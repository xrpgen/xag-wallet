<template>
  <div>
    <div style="width: 100%;" class="transfer-container">
      <pl-content-block :offsetTop="46" :offsetBottom="45">
        <div class="item-block" style="margin-top:40px">
          <pl-block>
            <div class="normal-font">
              <span class="small-font pull-right">
                <span class="ava-balance" slot="title">
                  <span>{{$t('transaction.balance')}}&nbsp;</span>
                  <span
                    class="text-primary"
                  >{{balance| currency('', '7') | cutTail}}&nbsp;{{asset.code}}</span>
                </span>
              </span>
            </div>
            <van-field
              v-model="form.amt"
              type="number"
              name="amt"
              :placeholder="$t('transaction.amtPlaceholder')"
              class="x-large-font"
              :label="asset.code"
            >
              <span
                slot="button"
                class="small-font"
              >≈&nbsp;{{form.amt | market(asset.code, asset.issuer)}}</span>
            </van-field>
            <!--<van-cell style="padding: 14px 0;">-->
            <!--<span slot="title">{{$t('transaction.balance')}}&nbsp;<span class="text-primary">{{balance| currency('', '7') | cutTail}}&nbsp;{{asset.code}}</span></span>-->
            <!--<span class="text-primary" @click="form.amt = balance">全部转出</span>-->
            <!--</van-cell>-->
          </pl-block>
        </div>
        <!-- 地址 -->
        <receive-address
          class="item-block"
          v-model="form.receiveAddress"
          :accountType="ripple"
          @change="changeReceiveAddress"
        >
          <small
            class="text-danger"
            v-show="!addressValid"
            v-text="$t('address.invalidAddressTip')"
          ></small>
          <small
            class="text-danger"
            v-show="!addressActivated"
            v-text="$t('transaction.xagUnActivationAddressMsg')"
          ></small>
          <small
            class="text-danger"
            v-show="!trustAsset"
            v-html="$t('transaction.notTrustAssetMsg', {code: asset.code})"
          ></small>
        </receive-address>

        <div class="item-block">
          <pl-block>
            <van-field
              v-model="form.tag"
              :placeholder="$t('transaction.inputTagPlaceholder')"
              type="number"
              clearable
              label="Tag"
            ></van-field>
            <small
              class="text-danger"
              v-show="isNeedTag && !form.tag"
              v-text="$t('transaction.xrpExchangeAddress')"
            ></small>
          </pl-block>
        </div>
        <!-- 新增的信息部分 -->
        <div class="item-block">
          <pl-block>
            <van-field
              rows="1"
              autosize
              type="textarea"
              v-model="form.memo"
              :placeholder="$t('transaction.inputMessage')"
              clearable
              :label="$t('common.message')"
              maxlength="100"
            ></van-field>
            <!-- <small class="text-danger" v-text="$t('transaction.xrpExchangeAddress')"></small> -->
          </pl-block>
        </div>
      </pl-content-block>
      <pl-stick :offset-bottom="0">
        <van-button
          size="large"
          :loading="loading"
          :disabled="firstBthDisabled"
          class="plat-btn"
          @click="firstStep"
          type="primary"
          :text="$t('common.next')"
        ></van-button>
      </pl-stick>
    </div>
    <!-- 下拉菜单 -->
    <van-actionsheet
      class="transfer-actionsheet"
      v-model="showFirstStep"
      :close-on-click-overlay="false"
    >
      <div class="transfer-sub-warpper">
        <div v-show="!showSecondStep">
          <van-nav-bar
            class="fw400"
            :title="$t('transaction.confirmTransferAcctMsg')"
            @click-right="showFirstStep = false"
          >
            <span slot="right">
              <i>
                <img style="width:14px" src="../../../static/img/X.png" alt />
              </i>
            </span>
          </van-nav-bar>
          <div>
            <van-cell-group>
              <div class="normal-block" style="margin-top:0px">
                <van-cell>
                  <span slot="title" v-text="$t('common.transferAmount')"></span>
                  <div class="fw500" style="font-size:0.89rem ;color:#333">
                    {{form.amt | currency('', '7') | cutTail}}&nbsp;
                    <small
                      style="font-size:0.78rem"
                    >{{asset.code}}</small>
                  </div>
                </van-cell>
              </div>
              <!-- 转账类型 -->
              <div class="normal-block">
                <van-cell>
                  <span slot="title" v-text="$t('transaction.transferAcctType')"></span>
                  {{asset.code}}&nbsp;{{$t('common.transferAccounts')}}
                </van-cell>
              </div>
              <div class="normal-block">
                <van-cell>
                  <span slot="title" v-text="$t('common.receivablesAddress')"></span>
                  <div>{{form.receiveAddress}}</div>
                </van-cell>
              </div>
              <div class="normal-block">
                <van-cell>
                  <span slot="title" v-text="$t('common.paymentAddress')"></span>
                  <div>{{$store.state.account.address}}</div>
                </van-cell>
              </div>
              <div class="normal-block">
                <van-cell>
                  <span slot="title">Tag</span>
                  <div>{{form.tag}}</div>
                </van-cell>
              </div>
              <!-- 新增的备注信息 -->
              <div class="normal-block">
                <van-cell>
                  <span slot="title">{{$t('common.message')}}</span>
                  <div>{{form.memo}}</div>
                </van-cell>
              </div>
            </van-cell-group>
          </div>
          <pl-stick :offset-bottom="0">
            <!-- 下一步按钮 -->
            <van-button
              size="large"
              :loading="loading"
              class="plat-btn"
              @click="secondStep()"
              type="primary"
              :text="$t('common.next')"
            ></van-button>
          </pl-stick>
        </div>
        <div v-show="showSecondStep">
          <van-nav-bar
            class="fw400"
            :title="$t('common.inputPwd')"
            @click-left="showSecondStep = false"
            @click-right="showFirstStep = false"
          >
            <span slot="left">
              <i>
                <img style="width:14px" src="../../../static/img/back-small.png" alt />
              </i>
            </span>
            <span slot="right">
              <i>
                <img style="width:14px" src="../../../static/img/X.png" alt />
              </i>
            </span>
          </van-nav-bar>
          <van-cell-group>
            <div class="normal-block">
              <van-field
                v-model="form.password"
                ref="password"
                type="password"
                :placeholder="$t('common.inputPwd')"
                v-show="!displayPassword"
                :label="$t('common.password')"
              ></van-field>
              <span v-show="!displayPassword" @click="displayPassword = true" class="password-icon">
                <img width="17" src="../../../static/img/close-small.png" alt />
              </span>
            </div>
            <div class="normal-block">
              <van-field
                v-model="form.password"
                ref="visualPassword"
                type="text"
                :placeholder="$t('common.inputPwd')"
                v-show="displayPassword"
                :label="$t('common.password')"
              ></van-field>
              <span v-show="displayPassword" @click="displayPassword = false" class="password-icon">
                <img width="17" src="../../../static/img/open-small.png" alt />
              </span>
            </div>
          </van-cell-group>
          <pl-stick :offset-bottom="0">
            <van-button
              size="large"
              :loading="loading"
              :disabled="!form.password"
              class="plat-btn"
              @click="submit"
              type="primary"
              :text="$t('transaction.submit')"
            ></van-button>
          </pl-stick>
        </div>
      </div>
    </van-actionsheet>
  </div>
</template>
<script>
import receiveAddress from "../ui/receive-address";
import Big from "big.js";
import cryptor from "core/utils/cryptor";
import { AccountType } from "../../wallet/constants";

export default {
  components: { receiveAddress },
  props: {
    asset: {
      type: Object,
      default() {
        return {};
      }
    },
    address: String,
    transferAmt: String
  },
  data() {
    return {
      showFirstStep: false,
      showSecondStep: false,
      displayPassword: false,
      form: {
        amt: "",
        receiveAddress: "",
        tag: "",
        remark: "",
        password: "",
        memo: ""
      },
      loading: false,
      addressValid: true,
      addressActivated: true,
      trustAsset: true,
      ripple: AccountType.ripple
    };
  },
  watch: {
    "form.receiveAddress"() {
      if (this.form.receiveAddress) {
        if (!this.$wallet.isValidAddress(this.form.receiveAddress)) {
          this.addressValid = false;
          this.addressActivated = true;
          this.trustAsset = true;
          return;
        } else {
          this.addressValid = true;
        }
        this.$wallet.isActivated(this.form.receiveAddress).then(ret => {
          this.addressActivated = ret;
          if (this.addressActivated) {
            this.$wallet
              .isTrustAsset(
                this.form.receiveAddress,
                this.asset.code,
                this.asset.issuer
              )
              .then(ret => {
                this.trustAsset = ret;
              });
          } else {
            this.trustAsset = true;
          }
        });
      } else {
        this.addressValid = true;
        this.addressActivated = true;
        this.trustAsset = true;
      }
    },
    displayPassword() {
      if (this.showSecondStep) {
        if (this.displayPassword) {
          this.$nextTick(() => {
            this.$refs["visualPassword"].$refs["input"].focus();
          });
        } else {
          this.$nextTick(() => {
            this.$refs["password"].$refs["input"].focus();
          });
        }
      }
    }
  },
  computed: {
    balance() {
      return this.getBalance(this.asset.code, this.asset.issuer).value;
    },
    isNeedTag() {
      if (this.form.receiveAddress) {
        return this.$wallet.isTradingPlatformAddress(this.form.receiveAddress);
      }
      return false;
    },
    firstBthDisabled() {
      if (
        this.form.amt &&
        this.form.receiveAddress &&
        this.addressValid &&
        this.trustAsset
      ) {
        if (this.asset.issuer && !this.addressActivated) {
          return true;
        }
        if (this.isNeedTag && !this.form.tag) {
          return true;
        }
        return false;
      }
      return true;
    },
    errMsg() {
      return {
        tecUNFUNDED_PAYMENT: this.$t("transaction.tecUnfundedPayment"), // Insufficient XRP balance to send
        tecNO_DST_INSUF_XRP: this.$t("transaction.tecNoDstInsufXrp") // Destination does not exist. Too little XRP sent to create it.
      };
    }
  },
  created() {},
  methods: {
    init() {
      console.log(this.asset);
      this.showFirstStep = false;
      this.showSecondStep = false;
      this.displayPassword = false;
      this.form = {
        amt: "",
        receiveAddress: "",
        tag: "",
        remark: "",
        password: "",
        memo: ""
      };
      if (this.address && this.address !== "") {
        this.form.receiveAddress = this.address;
      }
      if (this.transferAmt && this.transferAmt !== "") {
        this.form.amt = Number(this.transferAmt);
      }
    },
    firstStep() {
      let amt = new Big(this.form.amt);
      if (amt.lte(0)) {
        this.$toast(this.$t("transaction.amountGreaterThanZero"));
        return;
      }

      if (
        amt.gt(this.balance) &&
        this.$store.state.account !== this.asset.issuer &&
        this.form.receiveAddress !== this.asset.issuer
      ) {
        this.$toast(this.$t("transaction.balanceTooLowTip"));
        return;
      }

      if (!this.addressActivated && amt.lt("50")) {
        this.$toast(this.$t("transaction.xagUnActivationAddressTip"));
        return;
      }

      if (!this.$wallet.isValidAddress(this.form.receiveAddress)) {
        this.$toast(this.$t("address.invalidAddressTip"));
        return;
      }

      if (this.isNeedTag && !this.form.tag) {
        this.$toast(this.$t("transaction.requiredTag"));
        return;
      }

      this.showFirstStep = true;
    },
    secondStep() {
      this.showSecondStep = true;
      this.form.password = "";
      this.$nextTick(() => {
        this.$refs["password"].$refs["input"].focus();
      });
    },
    changeReceiveAddress(address) {
      this.form.tag = address.labelValue;
      console.log(this.form.tag);
    },
    getErrMsg(err) {
      let retMsg = this.$t("common.transactionFail");
      if (err && err.resultCode && this.errMsg[err.resultCode]) {
        return this.errMsg[err.resultCode];
      }
      return retMsg;
    },
    submit() {
      let paswordMd5 = cryptor.encryptMD5(this.form.password);
      if (paswordMd5 !== this.$store.state.account.password) {
        this.$toast(this.$t("transaction.walletPwdError"));
        return;
      }
      //  正在提交要以提示框
      const toast = this.$toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: "circular",
        message: this.$t("transaction.inTransactionMessage")
      });

      let options = {
        tag: this.form.tag
      };
      console.log(this.asset, this.asset.code, this.asset.issuer);

      if (this.asset && this.asset.code && this.asset.issuer) {
        options.assetCode = this.asset.code;
        options.assetIssuer = this.asset.issuer;
      }

      this.$wallet
        .sendTransaction(
          cryptor.decryptAES(
            this.$store.state.account.secret,
            this.form.password
          ),
          this.form.receiveAddress,
          this.form.amt,
          options,
          this.form.memo
        )
        .then(ret => {
          if (ret && ret.resultCode === "tesSUCCESS") {
            console.info(ret);
            toast.message = this.$t("transaction.transactionBroadcastSuccess");
            setTimeout(() => {
              toast.clear();
              this.$emit("done");
            }, 1000);
          } else {
            let errMsg = this.getErrMsg(ret);
            if (errMsg) {
              this.$toast(errMsg);
            } else {
              this.$toast(
                this.$t("common.transactionFail") + ":" + ret.resultCode
              );
            }
            setTimeout(() => {
              toast.clear();
            }, 5000);
          }
        })
        .catch(err => {
          console.error(err);
          let errMsg = this.getErrMsg(err);
          if (errMsg) {
            this.$toast(errMsg);
          } else {
            this.$toast(this.$t("common.transactionFail") + ":" + err);
          }
          setTimeout(() => {
            toast.clear();
          }, 5000);
        });
    }
  }
};
</script>
<style lang="scss">
.transfer-container {
  .van-field {
    padding-left: 0;
    padding-right: 0;
  }
  .van-cell {
    &:after {
      left: 0;
    }
  }
  .slider {
    padding-top: 30px;
    padding-bottom: 14px;
  }
  .content-block {
    overflow: visible;
  }
}
.transfer-sub-warpper {
  height: 450px;
  .van-cell {
    .van-cell__title {
      width: 90px;
      flex: none;
    }
    .van-cell__value {
      text-align: left;
      word-break: break-all;
    }
  }
}
.content-block {
  .ava-balance {
    position: absolute;
    top: -43px;
    left: -20px;
  }
}
.transfer-container {
  .van-field .van-cell__title {
    max-width: 50px;
  }
  .container.padding-15 {
    .text-danger {
      left: 50px;
      bottom: inherit;
    }
  }
  .van-field__button .small-font {
    color: #333;
  }
}
</style>
<style lang="scss">
.transfer-container {
  .stick .stick-bottom {
    left: 20px;
    right: 20px;
    width: inherit;
    bottom: 0px;
    border-radius: 0.28rem;
  }
}
.van-actionsheet {
  border-radius: 10px 10px 0 0;
  background-color: #fff;
}
.normal-block .van-cell {
  background-color: #f7f7f7;
  border-radius: 6px;
}
.transfer-sub-warpper {
  .stick .stick-bottom {
    left: 20px;
    right: 20px;
    width: inherit;
    border-radius: 0.28rem;
  }
}
// .transfer-actionsheet {
//   bottom: 20px;
// }
// .transfer-container {
//   background-color: #fff;
// }
// .van-modal {
//   top: -20px;
// }
</style>
<style lang="scss" scoped>
.normal-block {
  position: relative;
  .password-icon {
    position: absolute;
    right: 1.11rem;
    top: 50%;
    transform: translateY(-50%);
  }
  .van-field__body .van-field__control {
    padding-right: 1rem;
  }
}
</style>
