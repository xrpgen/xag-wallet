<template>
  <div>
    <div style="width: 100%;" class="transfer-container">
      <pl-content-block :offsetTop="46" :offsetBottom="45">
        <div class="item-block" style="margin-top:40px">
          <pl-block>
            <div>
              <span class="small-font pull-right">
                <span class="ava-balance" slot="title">
                  <span>{{$t('transaction.balance')}}&nbsp;</span>
                  <span
                    class="text-ripple"
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
            </van-field>
            <!--<van-cell style="padding: 14px 0;">-->
            <!--<span slot="title">{{$t('transaction.balance')}}&nbsp;<span class="text-primary">{{balance| currency('', '7') | cutTail}}&nbsp;{{asset.code}}</span></span>-->
            <!--<span class="text-primary" @click="form.amt = balance">全部转出</span>-->
            <!--</van-cell>-->
          </pl-block>
        </div>

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
            v-text="$t('transaction.xrpUnActivationAddressMsg')"
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
              v-text="$t('transaction.requiredTag')"
            ></small>
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
    <van-actionsheet v-model="showFirstStep" :close-on-click-overlay="false">
      <div class="transfer-sub-warpper">
        <div v-show="!showSecondStep">
          <van-nav-bar
            :title="$t('transaction.confirmTransferAcctMsg')"
            @click-left="showFirstStep = false"
          >
            <span slot="left">
              <van-icon name="close" />
            </span>
          </van-nav-bar>
          <div>
            <div class="text-center x-x-large-font" style="padding:20px 0px;">
              {{form.amt | currency('', '7') | cutTail}}&nbsp;
              <small>{{asset.code}}</small>
            </div>
            <van-cell-group>
              <van-cell>
                <span slot="title" class="text-muted" v-text="$t('transaction.transferAcctType')"></span>
                {{asset.code}}&nbsp;{{$t('common.transferAccounts')}}
              </van-cell>
              <van-cell>
                <span slot="title" class="text-muted" v-text="$t('common.receivablesAddress')"></span>
                <div>{{form.receiveAddress}}</div>
              </van-cell>
              <van-cell>
                <span slot="title" class="text-muted" v-text="$t('common.paymentAddress')"></span>
                <div>{{$store.state.account.address}}</div>
              </van-cell>
              <van-cell>
                <span slot="title" class="text-muted">Tag</span>
                <div>{{form.tag}}</div>
              </van-cell>
            </van-cell-group>
          </div>
          <pl-stick :offset-bottom="0">
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
            :title="$t('common.inputPwd')"
            left-arrow
            @click-left="showSecondStep = false"
          />
          <van-cell-group>
            <van-field
              v-model="form.password"
              ref="password"
              type="password"
              @click-icon="displayPassword = true"
              :placeholder="$t('transaction.walletPwdPlaceholder')"
              icon="password-not-view"
              v-show="!displayPassword"
            />
            <van-field
              v-model="form.password"
              ref="visualPassword"
              type="text"
              @click-icon="displayPassword = false"
              :placeholder="$t('transaction.walletPwdPlaceholder')"
              icon="password-view"
              v-show="displayPassword"
            />
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
import receiveAddress from "../../ui/receive-address";
import Big from "big.js";
import cryptor from "core/utils/cryptor";
import { AccountType } from "../../../wallet/constants";

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
    transferAmt: String,
    tag: String,
    msg: String,
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
        password: ""
      },
      requireDestinationTag: false,
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
        this.$wallet.checkSettings(this.form.receiveAddress).then(res => {
          if (res.requireDestinationTag && res.requireDestinationTag == true) {
            this.requireDestinationTag = true;
          } else {
            this.requireDestinationTag = false;
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
        if (this.requireDestinationTag == true) {
          return true;
        }
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
      this.showFirstStep = false;
      this.showSecondStep = false;
      this.displayPassword = false;
      this.form = {
        amt: "",
        receiveAddress: "",
        tag: "",
        remark: "",
        password: ""
      };
      if (this.address && this.address !== "") {
        this.form.receiveAddress = this.address;
      }
      if (this.transferAmt && this.transferAmt !== "") {
        this.form.amt = this.transferAmt;
      }
      if (this.tag && this.tag !== "") {
        this.form.tag = this.tag;
      }
      if (this.msg && this.msg !== "") {
        this.form.memo = this.msg;
      }
    },
    firstStep() {
      let amt = new Big(this.form.amt);
      if (amt.lte(0)) {
        this.$toast(this.$t("transaction.amountGreaterThanZero"));
        return;
      }

      if (amt.gt(this.balance)) {
        this.$toast(this.$t("transaction.balanceTooLowTip"));
        return;
      }

      if (!this.addressActivated && amt.lt("20")) {
        this.$toast(this.$t("transaction.xrpUnActivationAddressTip"));
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

      const toast = this.$toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: "circular",
        message: this.$t("transaction.inTransactionMessage")
      });

      let options = {
        tag: this.form.tag
      };

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
          options
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
</style>
