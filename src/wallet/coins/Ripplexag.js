import { RippleAPI } from 'ripple-lib';
import RippleAddress from 'ripple-address-codec';
import { AccountType, CoinType } from '../constants';
import tradingPlatformConfig from '../config/trading-platform';
import rippleKeypairs from 'ripple-keypairs';
import Big from 'big.js';
import { fmtCode, realCode } from '../util';

class RipplexagWallet {
  constructor(url, option = {}) {
    if (url) {
      this.setServer(url);
    }
    this.option = option;
  }

  setServer(url) {
    this.url = url;
    if (!this.server || !this.server.isConnected()) {
      this.server = new RippleAPI({
        server: url,
        maxFeeXRP: '0.05',
        timeout: 10 * 1000
      });
    }
  }

  destroy() {
    if (this.server) {
      if (this.server.isConnected()) {
        this.server.disconnect();
      }
    }
  }

  getInstance() {
    return this.server;
  }

  async isActivated(address) {
    if (!this.server.isConnected()) {
      await this.server.connect();
    }
    return new Promise(resolve => {
      this.server
        .getAccountInfo(address)
        .then(() => {
          resolve(true);
        })
        .catch(e => {
          if (e.data && e.data.error === 'actNotFound') {
            resolve(false);
          }
        });
    });
  }

  // subscribe (address) {
  //   this.server.connection.on('transaction', (response) => {
  //     //console.info(response);
  //     store.dispatch('setBalances', address); // 更新余额
  //   }); // 指定地址发生交易时触发
  //
  //   this.server.request('subscribe', { // 监听指定地址
  //     accounts: [ address ]
  //   }).then(response => {
  //     if (response.status === 'success') {
  //       //console.log('Successfully subscribed');
  //     }
  //   });
  // }
  // async unsubscribe (address) {
  //   if (!this.server.isConnected()) {
  //     await this.server.connect();
  //   }
  //   this.server.request('unsubscribe', { // 取消监听指定地址
  //     accounts: [ address ]
  //   }).then(response => {
  //     if (response.status === 'success') {
  //       //console.log('Successfully subscribed');
  //     }
  //   });
  // }

  async getBalances(address) {
    if (!this.server.isConnected()) {
      await this.server.connect();
    }
    try {
      let ret = await this.server.getBalances(address);
      let balances = [];
      let native;
      ret.forEach(item => {
        if (item.currency === CoinType.XRP) {
          native = {
            code: CoinType.XAG,
            value: item.value
          };
        } else {
          balances.push({
            code: fmtCode(item.currency),
            value: item.value,
            issuer: item.counterparty || ''
          });
        }
      });
      let accountInfo = await this.server.getAccountInfo(address);
      native.frozenNative = 20 + 5 * accountInfo.ownerCount;
      balances.unshift(native);
      return balances;
    } catch (e) {
      //console.error(e);
      return [
        {
          value: '0',
          code: CoinType.XAG
        }
      ];
    }
  }

  async isTrustAsset(address, assetCode, assetIssuer) {
    if (
      (CoinType.XRP === assetCode || CoinType.XAG === assetCode) &&
      !assetIssuer
    ) {
      return true;
    }
    if (address && assetIssuer && address === assetIssuer) {
      return true;
    }
    let trustlines = await this.server.getTrustlines(address);
    // console.info(trustlines);
    if (!trustlines && trustlines.length === 0) {
      return false;
    }
    assetCode = realCode(assetCode);
    let flag = trustlines.some(line => {
      if (
        line.specification.counterparty === assetIssuer &&
        line.specification.currency === assetCode
      ) {
        return line.specification.limit !== '0';
      }
      return false;
    });
    return flag;
  }

  getTransactions(address, option = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        const serverInfo = await this.server.getServerInfo();
        const temps = serverInfo.completeLedgers.split(',');
        const ledgers = temps[0].split('-');
        const minLedgerVersion = Number(ledgers[0]);
        const maxLedgerVersion = Number(ledgers[1]);
        let params = {
          minLedgerVersion,
          maxLedgerVersion
        };
        option.excludeFailures = true;
        params = { ...params, ...option };
        let transactions = await this.server.getTransactions(address, params);
        transactions.forEach((item) => {
          item.outcome.deliveredAmount.currency = fmtCode(item.outcome.deliveredAmount.currency);
          item.specification.source.maxAmount.currency = fmtCode(item.specification.source.maxAmount.currency);
        });
        resolve(transactions);
      } catch (err) {
        //console.error(err);
        reject(err);
      }
    });
  }

  //添加新的消息

  sendTransaction(fromSecret, to, amount, option = {}, data) {
    const keypair = rippleKeypairs.deriveKeypair(fromSecret);
    const fromAddress = rippleKeypairs.deriveAddress(keypair.publicKey);
    // let  data = CryptoJS.AES.encrypt(data,'Abc111').toString();

    const memo = {
      data: data,
      format: 'text',
      type: 'sign'
    };
    let currency = realCode(option.assetCode) || CoinType.XRP;
    let payment = {
      source: {
        address: fromAddress,
        maxAmount: {
          value: amount,
          currency: currency
        }
      },
      destination: {
        address: to,
        amount: {
          value: amount,
          currency: currency
        }
      },
      memos: [memo]
    };
    
    if (option.assetIssuer) {
      payment.destination.amount.counterparty = option.assetIssuer;
      payment.source.maxAmount.counterparty = option.assetIssuer;
    }
    if (option.tag !== '') {
      let tag = new Number(option.tag);
      payment.destination.tag = tag.valueOf();
    }

    return new Promise((resolve, reject) => {
      this.server.preparePayment(fromAddress, payment).then(prepared => {
        const { signedTransaction } = this.server.sign(
          prepared.txJSON,
          fromSecret
        );
        this.server
          .submit(signedTransaction)
          .then(result => {
            console.info(result);
            resolve(result);
          })
          .catch(err => {
            console.info(err);
            reject(err);
          });
      });
    });
  }

  async changeTrust(fromSecret, code, issuer, limit) {
    const keypair = rippleKeypairs.deriveKeypair(fromSecret);
    const fromAddress = rippleKeypairs.deriveAddress(keypair.publicKey);
    const trustline = {
      currency: realCode(code),
      counterparty: issuer,
      limit: limit,
      ripplingDisabled: true
      // ripplingDisabled: ripplingDisabled
    };
    // //console.info(ripplingDisabled);
    return new Promise((resolve, reject) => {
      this.server.prepareTrustline(fromAddress, trustline).then(prepared => {
        const { signedTransaction } = this.server.sign(
          prepared.txJSON,
          fromSecret
        );
        this.server
          .submit(signedTransaction)
          .then(result => {
            //console.info(result);
            resolve(result);
          })
          .catch(err => {
            //console.info(err);
            reject(err);
          });
      });
    });
  }

  isValidAddress(address) {
    return RippleAddress.isValidAddress(address);
  }

  isTradingPlatformAddress(address) {
    let config = tradingPlatformConfig[AccountType.ripplexag];
    return config[address];
  }

  getAccount(key) {
    let options = { entropy: key };
    const secret = rippleKeypairs.generateSeed(options);
    const keypair = rippleKeypairs.deriveKeypair(secret);
    const address = rippleKeypairs.deriveAddress(keypair.publicKey);
    return { secret, address };
  }

  getAccountFromSecret(secret) {
    const keypair = rippleKeypairs.deriveKeypair(secret);
    const address = rippleKeypairs.deriveAddress(keypair.publicKey);
    return { secret, address };
  }

  /**
   * 查询交易对的挂单记录
   * @param baseBuy （基础货币，包含code和合约）
   * @param counterSelling (对手货币，包含code和合约)
   * @returns {Promise<any>}
   */
  async queryBook(baseBuy, counterSelling) {
    return new Promise(async (resolve, reject) => {
      try {
        baseBuy.code = realCode(baseBuy.code);
        counterSelling.code = realCode(counterSelling.code);
        let buyCode = baseBuy.code;
        let sellCode = counterSelling.code;
        if (sellCode == CoinType.XAG && !counterSelling.issuer) {
          sellCode = CoinType.XRP;
        }
        if (buyCode == CoinType.XAG && !baseBuy.issuer) {
          buyCode = CoinType.XRP;
        }
        const orderbook = {
          base: {
            currency: buyCode
          },
          counter: {
            currency: sellCode
          }
        };
        let address = '';
        if (baseBuy.issuer) {
          address = baseBuy.issuer;
          orderbook.base.counterparty = baseBuy.issuer;
        }
        if (counterSelling.issuer) {
          if (!address) {
            address = counterSelling.issuer;
          }
          orderbook.counter.counterparty = counterSelling.issuer;
        }
        await this.server
          .getOrderbook(address, orderbook, { limit: 150 })
          .then(data => {
            let result = {
              asks: [],
              bids: []
            };
            data.asks.map(ret => {
              let amount = ret.specification.quantity.value;
              let price = Number(
                new Big(ret.specification.totalPrice.value)
                  .div(ret.specification.quantity.value)
                  .toFixed(7)
                  .toString()
              ).toString();
              if (ret.state) {
                amount = ret.state.fundedAmount.value;
              }
              if (Number(amount) === Number(0)) {
                return;
              }
              let r = {
                amount: amount,
                price: price
              };
              let pop = result.asks.pop();
              if (!pop) {
                result.asks.push(r);
              } else {
                if (pop.price === r.price) {
                  pop.amount = Number(
                    new Big(pop.amount)
                      .add(r.amount)
                      .toFixed(7)
                      .toString()
                  ).toString();
                  result.asks.push(pop);
                } else {
                  result.asks.push(pop);
                  result.asks.push(r);
                }
              }
            });
            data.bids.map(ret => {
              let amount = ret.specification.quantity.value;
              let price = Number(
                new Big(ret.specification.totalPrice.value)
                  .div(ret.specification.quantity.value)
                  .toFixed(7)
                  .toString()
              ).toString();
              if (ret.state) {
                amount = ret.state.priceOfFundedAmount.value;
              }
              if (Number(amount) === Number(0)) {
                return;
              }
              let r = {
                amount: amount,
                price: price
              };
              let pop = result.bids.pop();
              if (!pop) {
                result.bids.push(r);
              } else {
                if (pop.price === r.price) {
                  pop.amount = Number(
                    new Big(pop.amount)
                      .add(r.amount)
                      .toFixed(7)
                      .toString()
                  ).toString();
                  result.bids.push(pop);
                } else {
                  result.bids.push(pop);
                  result.bids.push(r);
                }
              }
            });
            resolve(result);
          })
          .catch(err => {
            //console.error(err);
            reject(err);
          });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * 查询我的委托单
   * @param address (账户地址)
   * @param optional (可选项)
   * @returns {Promise<any>}
   */
  async queryOffers(address, optional = {}) {
    ////console.debug('offers', address);
    return new Promise(async (resolve, reject) => {
      try {
        let options = {};
        if (!optional.limit) {
          options.limit = 200;
        } else {
          options.limit = optional.limit;
        }
        let page = await this.server.getOrders(address, options);
        page.forEach((item) => {
          item.specification.quantity.currency = fmtCode(item.specification.quantity.currency);
          item.specification.totalPrice.currency = fmtCode(item.specification.totalPrice.currency);
        });
        resolve(page);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * 发起挂单交易请求
   * @param selling (卖方数据)
   * @param buying (买方数据)
   * @param amount (数量)
   * @param price (单价)
   * @param address (账户地址)
   * @param fromSecret (账户私钥)
   * @param direction (方向-买入还是卖出)
   * @returns {Promise<any>}
   */
  async sendOffer(
    selling,
    buying,
    amount,
    price,
    address,
    fromSecret,
    direction
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let totalPrice = Number(new Big(amount).times(price).toString())
          .toFixed(8)
          .toString();
        if (selling.code == CoinType.XAG && selling.issuer === '') {
          selling.code = CoinType.XRP;
        } else {
          selling.code = realCode(selling.code);
        }
        if (buying.code == CoinType.XAG && buying.issuer === '') {
          buying.code = CoinType.XRP;
        } else {
          buying.code = realCode(buying.code);
        }
        const order = {
          direction: direction,
          quantity: {
            currency: buying.code,
            value: amount
          },
          totalPrice: {
            currency: selling.code,
            value: totalPrice
          },
          passive: false,
          fillOrKill: false
        };
        if (selling.issuer) {
          order.totalPrice.counterparty = selling.issuer;
        }
        if (buying.issuer) {
          order.quantity.counterparty = buying.issuer;
        }
        let prepared = await this.server.prepareOrder(address, order);
        const { signedTransaction } = this.server.sign(
          prepared.txJSON,
          fromSecret
        );
        this.server
          .submit(signedTransaction)
          .then(result => {
            //console.info(result);
            if (result && result.resultCode === 'tesSUCCESS') {
              resolve(result);
            } else {
              reject(result.resultMessage);
            }
          })
          .catch(err => {
            //console.info(err);
            reject(err);
          });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * 撤单操作
   * @param offer
   * @param address
   * @param fromSecret
   * @returns {Promise<any>}
   */
  async cancelOffer(offer, address, fromSecret) {
    return new Promise(async (resolve, reject) => {
      try {
        const orderCancellation = { orderSequence: offer.id };
        let prepared = await this.server.prepareOrderCancellation(
          address,
          orderCancellation
        );
        const { signedTransaction } = this.server.sign(
          prepared.txJSON,
          fromSecret
        );
        this.server
          .submit(signedTransaction)
          .then(result => {
            //console.info(result);
            if (result && result.resultCode === 'tesSUCCESS') {
              resolve(result);
            } else {
              reject(result.resultMessage);
            }
          })
          .catch(err => {
            //console.info(err);
            reject(err);
          });
      } catch (err) {
        reject(err);
      }
    });
  }
  isSameAsset(orderbookChange, baseBuy, counterSelling) {
    baseBuy.code = fmtCode(baseBuy.code);
    counterSelling.code = fmtCode(counterSelling.code);
    if (
      (orderbookChange.quantity.currency == baseBuy.code && orderbookChange.quantity.counterparty == baseBuy.issuer)
      &&
      (orderbookChange.totalPrice.currency == counterSelling.code && orderbookChange.totalPrice.counterparty == counterSelling.issuer)
    ) {
      return true;
    } else if (
      (orderbookChange.quantity.currency == counterSelling.code && orderbookChange.quantity.counterparty == counterSelling.issuer)
      &&
      (orderbookChange.totalPrice.currency == baseBuy.code && orderbookChange.totalPrice.counterparty == baseBuy.issuer)
    ) {
      return true;
    }
    return true;
  }
  queryLastBook(baseBuy, counterSelling, optional = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        optional.limit = 50;
        var count = 0;
        var data = [];
        let txs = await this.server.getTransactions(optional.forAccount, {
          types: ["order", "payment"],
          excludeFailures: true,
          limit: optional.limit,
          earliestFirst: false
        });
        console.log(txs);
        for (let tx of txs) {
          let changes = tx.outcome.orderbookChanges;
          if (Object.keys(changes).length === 0) {
            continue;
          }
          for (let address of Object.keys(changes)) {
            let thisAddressOrderbookChanges = changes[address];
            if (thisAddressOrderbookChanges) {
              for (let orderbookChange of thisAddressOrderbookChanges) {
                if (orderbookChange.status === 'partially-filled' || orderbookChange.status === 'filled') {
                  if (tx.specification.quantity && tx.specification.quantity.counterparty == undefined) {
                    tx.specification.quantity.currency = 'XAG';
                    tx.specification.quantity.counterparty = '';
                  }
                  if (tx.specification.totalPrice && tx.specification.totalPrice.counterparty == undefined) {
                    tx.specification.totalPrice.currency = 'XAG';
                    tx.specification.totalPrice.counterparty = '';
                  }
                  if (orderbookChange.quantity.counterparty == undefined) {
                    orderbookChange.quantity.currency = 'XAG';
                    orderbookChange.quantity.counterparty = '';
                  }
                  if (orderbookChange.totalPrice.counterparty == undefined) {
                    orderbookChange.totalPrice.currency = 'XAG';
                    orderbookChange.totalPrice.counterparty = '';
                  }
                  if (this.isSameAsset(orderbookChange, baseBuy, counterSelling)) {
                    ++count;
                    data.push({
                      base_currency: orderbookChange.direction === 'buy'
                      ? fmtCode(orderbookChange.totalPrice.currency)
                      : fmtCode(orderbookChange.quantity.currency),
                      base_amount: orderbookChange.direction === 'buy'
                      ? orderbookChange.totalPrice.value
                      : orderbookChange.quantity.value,
                      base_issuer: orderbookChange.direction === 'buy'
                      ? orderbookChange.totalPrice.counterparty
                      : orderbookChange.quantity.counterparty,

                      counter_currency: orderbookChange.direction === 'sell'
                      ? fmtCode(orderbookChange.totalPrice.currency)
                      : fmtCode(orderbookChange.quantity.currency),
                      counter_amount: orderbookChange.direction === 'sell'
                      ? orderbookChange.totalPrice.value
                      : orderbookChange.quantity.value,
                      counter_issuer: orderbookChange.direction === 'sell'
                      ? orderbookChange.totalPrice.counterparty
                      : orderbookChange.quantity.counterparty,

                      buyer: orderbookChange.direction === 'buy'
                      ? tx.address
                      : tx.address,
                      seller: orderbookChange.direction === 'sell'
                      ? tx.address
                      : address,

                      node_index: '',
                      rate: '',
                      tx_index: '',
                      executed_time: tx.outcome.timestamp,
                      ledger_index: '',
                      offer_sequence: '',
                      provider: '',
                      taker: optional.forAccount,
                      tx_hash: tx.id,
                      tx_type: "OfferCreate",
                    });
                  }
                }
              }
            }
          }
        }
        var arr = {
          result: "success",
          count: count,
          exchanges: data
        };
        console.log(arr);
        resolve(arr);
      } catch (err) {
        console.log(err);
        reject({ data: [], result: "failed"});
      }
    });
  }
  async queryLastBook_bak(baseBuy, counterSelling, optional = {}) {
    return new Promise((resolve, reject) => {
      try {
        let options = { limit: 1, descending: true };
        optional.descending = options.descending;
        if (optional.limit) {
          options.limit = optional.limit;
        }
        let baseBuyCode = baseBuy.code;
        let counterSellingCode = counterSelling.code;
        if (baseBuyCode === CoinType.XAG && baseBuy.issuer === '') {
          baseBuyCode == CoinType.XRP;
        }
        if (
          counterSellingCode === CoinType.XAG &&
          counterSelling.issuer === ''
        ) {
          counterSellingCode == CoinType.XRP;
        }
        let url = `https://data.ripple.com/v2/exchanges/${baseBuy.code}+${
          baseBuy.issuer
          }/${counterSelling.code}+${counterSelling.issuer}?limit=${
          optional.limit
          }&descending=${optional.descending}`;
        if (optional.forAccount) {
          url = `https://data.ripple.com/v2/accounts/${
            optional.forAccount
            }/exchanges?descending=true&limit=200`;
          //url = `https://data.ripple.com/v2/accounts/${optional.forAccount}/exchanges?/${baseBuy.code}+${baseBuy.issuer}/${counterSelling.code}+${counterSelling.issuer}?limit=${optional.limit}&descending=${optional.descending}`;
        }
        let xmlhttp = new XMLHttpRequest(); // 创建异步请求
        xmlhttp.onreadystatechange = () => {
          if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            resolve(JSON.parse(xmlhttp.responseText));
          } else if (xmlhttp.status === 400) {
            resolve({ data: [] });
          }
        };
        xmlhttp.open('GET', url);
        xmlhttp.send();
      } catch (err) {
        reject(err);
      }
    });
  }
  // 设置账户信息的方法
  async setAccountInfo(address, secret, setConfig) {
    try {
      if (!this.server.isConnected()) {
        await this.server.connect();
      }
      let prepared = await this.server.prepareSettings(address, setConfig);
      let tx = this.server.sign(prepared.txJSON, secret);
      let result = await this.server.submit(tx.signedTransaction);
      // if (result && result.resultCode === 'tesSUCCESS') {

      // }
      return result;
    } catch (err) {
      console.log(err);
    }

  }

  // 查询账户信息的方法
  queryAccountInfo(address) {
    return new Promise(async (resolve, reject) => {
      try {
        let setting = await this.server.getSettings(address);
        resolve(setting);
      } catch (err) {
        reject(err);
      }
    });
  }
}
export default RipplexagWallet;
