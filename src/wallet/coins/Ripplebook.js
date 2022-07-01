class Ripplebook {
  constructor(remote, address) {
    this.remote = remote;
    this.address = address || 'rghL9q8iPW6P4ZqG53nv3VNkVBKWWngdd';
  }
  
  connect() {
    if (!this.remote) throw new Error("NotConnectedError");
    return this.remote.isConnected() ? Promise.resolve() : this.remote.connect();
  }
  
  async getBook(info) {
    info.base.currency = realCode(info.base.currency);
    info.counter.currency = realCode(info.counter.currency);
    if (info.base.currency === 'XRP') {
      delete info.base.counterparty;
    }
    if (info.counter.currency == 'XRP') {
      delete info.counter.counterparty;
    }
    
    if (info.base.currency !== 'XRP' && info.counter.currency !== 'XRP') {
      return await this._bridgeBook(info);
    } else {
      let data = await this._getBook(info);
      return formatBook(data);
    }
  }
  
  async _getBook(info) {
    try {
      await this.connect();
      const response = await this.remote.getOrderbook(this.address, info, {limit: 50});
      //console.log('fetched ' + info.base.currency + '/' + info.counter.currency);
      return response;
    } catch (err) {
      console.error('ripple', info.base.currency + '/' + info.counter.currency, err.data && err.data.error ? err.data.error : err);
      return {asks:[], bids:[]};
    }
  }
  
  async _bridgeBook(info) {
    var info1 = { base : info.base, counter : {currency: 'XRP'} };
    var info2 = { base : {currency: 'XRP'}, counter: info.counter };
    let values = await Promise.all([this._getBook(info), this._getBook(info1), this._getBook(info2)]);
    var book0 = formatBook(values[0]);
    var book1 = formatBook(values[1]);
    var book2 = formatBook(values[2]);
    var bridge_asks = calculateAsks(book1.asks, book2.asks).concat(book0.asks).sort((a, b)=>{
      return a.price - b.price;
    });
    var birdge_bids = calculateBids(book1.bids, book2.bids).concat(book0.bids).sort((a, b)=>{
      return b.price - a.price;
    });
    return {asks: bridge_asks, bids: birdge_bids};
  }
}

function calculateAsks(asks1, asks2) {
  var data = [];
  var pointer1 = 0, pointer2 = 0, i = 0;
  while (pointer1 < asks1.length && pointer2 < asks2.length && i < 10) {
    var ask1 = asks1[pointer1], ask2 = asks2[pointer2];
    if (ask1.pays_value < 0.001) {
      pointer1++;
      continue;
    }
    if (ask2.gets_value < 0.001) {
      pointer2++;
      continue;
    }
    var order = {
        account : 'AUTOBRIDGED',
        gets_currency : ask1.gets_currency,
        pays_currency : ask2.pays_currency
    };
    if(ask1.pays_value >= ask2.gets_value) {
      order.pays_value = ask2.pays_value;
      order.gets_value = ask2.gets_value / ask1.price;
      pointer2++;
      ask1.pays_value = ask1.pays_value - ask2.gets_value;
      ask1.gets_value = ask1.pays_value / ask1.price;
    } else {
      order.pays_value = ask1.pays_value * ask2.price;
      order.gets_value = ask1.gets_value;
      pointer1++;
      ask2.gets_value = ask2.gets_value - ask1.pays_value;
      ask2.pays_value = ask2.gets_value * ask2.price;
    }
    order.amount = order.gets_value;
    order.volume = order.pays_value;
    order.price = order.volume / order.amount;
    data.push(order);
    i++;
  }
  return data;
}

function calculateBids(bids1, bids2) {
  var data = [];
  var pointer1 = 0, pointer2 = 0, i = 0;
  while (pointer1 < bids1.length && pointer2 < bids2.length && i < 10) {
    var bid1 = bids1[pointer1], bid2 = bids2[pointer2];
    if (bid1.gets_value < 0.001) {
      pointer1++;
      continue;
    }
    if (bid2.pays_value < 0.001) {
      pointer2++;
      continue;
    }
    var order = {
        account : 'AUTOBRIDGED',
        gets_currency : bid2.gets_currency,
        pays_currency : bid1.pays_currency
    };
    if(bid1.gets_value >= bid2.pays_value) {
      order.gets_value = bid2.gets_value;
      order.pays_value = bid2.pays_value / bid1.price;
      pointer2++;
      bid1.gets_value = bid1.gets_value - bid2.pays_value;
      bid1.pays_value = bid1.gets_value / bid1.price;
    } else {
      order.gets_value = bid1.gets_value * bid2.price;
      order.pays_value = bid1.pays_value;
      pointer1++;
      bid2.pays_value = bid2.pays_value - bid1.gets_value;
      bid2.gets_value = bid2.pays_value * bid2.price;
    }
    order.amount = order.pays_value;
    order.volume = order.gets_value;
    order.price = order.volume / order.amount;
    data.push(order);
    i++;
  }
  return data;
}

function formatBook(book) {
  let asks = book.asks.map(formatOrder);
  let bids = book.bids.map(formatOrder);
  
  asks = asks.filter(item => {
    return item.gets_value > 0.001 || item.pays_value > 0.001;
  });
  bids = bids.filter(item => {
    return item.gets_value > 0.001 || item.pays_value > 0.001;
  });
  
  return {
    asks: asks,
    bids: bids
  };
}

function formatOrder(item) {
  var order = {};
  order.account = item.properties.maker;
  if (item.specification.direction == 'sell') {
    order.gets_currency = item.specification.quantity.currency;
    order.gets_value = item.state ? parseFloat(item.state.fundedAmount.value) : parseFloat(item.specification.quantity.value);
    order.pays_currency = item.specification.totalPrice.currency;
    order.pays_value = item.state ? parseFloat(item.state.priceOfFundedAmount.value) : parseFloat(item.specification.totalPrice.value);
    order.volume = order.pays_value;
    order.amount = order.gets_value;
    order.price = order.pays_value/order.gets_value;
  } else {
    order.gets_currency = item.specification.totalPrice.currency;
    order.gets_value = item.state ? parseFloat(item.state.fundedAmount.value) : parseFloat(item.specification.totalPrice.value);
    order.pays_currency = item.specification.quantity.currency;
    order.pays_value = item.state ? parseFloat(item.state.priceOfFundedAmount.value) : parseFloat(item.specification.quantity.value);
    order.volume = order.gets_value;
    order.amount = order.pays_value;
    order.price = order.gets_value/order.pays_value;
  }
  return order;
}

function asciiToHex(str) {
  var hex = "";
  for(var i = 0; i < str.length; i++) {
    var code = str.charCodeAt(i);
    var n = code.toString(16);
    hex += n.length < 2 ? '0' + n : n;
  }
  return (hex + "0000000000000000000000000000000000000000").substring(0, 40).toUpperCase();
}

function realCode(input) {
    return input && input.length > 3 && input.length <= 20 ? asciiToHex(input) : input;
}

export default Ripplebook;