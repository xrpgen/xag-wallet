<template>
  <van-popup
    v-model="show"
    class="receive-container"
    @click.self.native="closePopup"
    :overlay="false"
    :overlay-style="{'background': 'rgba(39, 51, 50, 0.9)'}"
  >
    <van-nav-bar
      :title="barTitle"
      style="background: transparent;color: #fff;border: none;"
      class="no-border"
      @click-left="closePopup"
      @click-right="toScan"
    >
      <span slot="left">
        <i>
          <img src="../wallet/img/back-white.png" alt />
        </i>
      </span>
      <span slot="right">
        <i @click="toScan()" class="sao">
          <img style="width:1.11rem" src="../../../static/img/sao-white.png" alt />
        </i>
      </span>
    </van-nav-bar>
    <div :class="`card ${$store.state.account.type}-bg`">
      <div class="header text-center">
        <p class="big-font">{{$store.state.account.name}}</p>
      </div>
      <div class="qrcode-container text-center">
        <div class="small-font" style="padding: 15px 0 10px;">
          {{$t('scan.scanQrCode')}}
          <b class="normal-font text-primary">&nbsp;{{assetCode}}</b>
        </div>
        <!-- 合并的设置收款金额 -->
        <div class="b-white padding set-amount border-radius">
          <van-field
            type="number"
            ref="amountInput"
            :class="showConfirm ==1 ? `large-font text-primary confirm-border`: `large-font text-primary` "
            v-model="amount"
            :placeholder="$t('scan.transferAmtPlaceholder')"
            @focus="toConfirm"
            @blur="toCoin"
          >
            <!-- coinType -->
            <span
              v-if="showConfirm !==1"
              slot="icon"
              style="color:#353535"
              class="text-main normal-font"
            >{{shortCode}}</span>
            <span
              v-if="showConfirm==1"
              slot="icon"
              class="text-main normal-font confirmColor"
              @click="sure"
            >{{$t('common.confirm')}}</span>
          </van-field>
        </div>
        <!-- <div v-if="transferAmt" style="margin-bottom: 5px;">{{transferAmt}}&nbsp;&nbsp;{{shortCode}}</div> -->
        <qrcode class="qrcode" :value="qrCodeText" :options="{ size: 127 }"></qrcode>
        <span class="address-text">{{address | longStrAbbr(11)}}&nbsp;</span>
      </div>
      <div class="footer van-hairline--top">
        <van-row>
          <!-- 设置金额 -->
          <!-- <van-col
            :span="24"
            class="text-center padding text-primary"
            @click.native="toSetAmt"
          >{{$t('common.setAmt')}}</van-col>-->
          <!-- 复制钱包按钮 -->
          <div class="btn">
            <van-button
              @click="toCopyAddress"
              size="large"
              round
              type="primary"
              :text="$t('scan.copyWalletAddress')"
            ></van-button>
          </div>
        </van-row>
      </div>
    </div>
    <div
      class="share text-center text-primary"
      @click="showShareActions = true"
      v-if="!canChangeAsset"
    >{{$t('scan.shareReceiptCode')}}</div>

    <van-actionsheet
      :overlay="true"
      v-model="showShareActions"
      :cancel-text="$t('common.cancelText')"
      :actions="shareActions"
      @select="onShare"
    />
    <!-- <set-amount ref="setAmount" @done="setAmt"></set-amount> -->
  </van-popup>
</template>
<script>
import qrcode from "@xkeshi/vue-qrcode";
// import setAmount from "./set-amount";
// import coins from 'src/wallet/coins';
export default {
  props: {
    canChangeAsset: {
      type: Boolean,
      default: true
    },
    navTitle: {
      type: String,
      default: () => {
        return "";
      }
    },
    shortCode: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      show: false,
      assetCode: "",
      transferAmt: "",
      showShareActions: false,
      showConfirm: "",
      amount: "",
      confirmAmount: ""
    };
  },
  components: {
    qrcode
    // setAmount
  },
  computed: {
    shareActions() {
      return [
        {
          name: this.$t("scan.shareWeiXin"),
          action: "wechat"
        },
        {
          name: this.$t("scan.shareQQ"),
          action: "QQ"
        }
      ];
    },
    address() {
      if (this.$store.state.account && this.$store.state.account.address) {
        return this.$store.state.account.address;
      }
      return "";
    },
    qrCodeText() {
      if (this.confirmAmount && this.confirmAmount !== "") {
        // console.info(`address=${this.address}&transferAmt=${this.amount}`);
        return `address=${this.confirmAmount}&transferAmt=${this.confirmAmount}`;
      } else {
        return this.address;
      }
    },
    barTitle() {
      return this.shortCode + " " + this.$t("common.receivables");
    }
  },
  methods: {
    sure() {
      this.$refs.amountInput.focus();
      this.confirmAmount = this.amount;

      // 校验是否是数字
      let reg = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/
      if (this.amount && !reg.test(this.amount)) {
        this.$toast(this.$t("scan.inputIllegal"));
      } else {
        setTimeout(() => {
          this.$refs.amountInput.blur();
        }, 300);
      }
    },
    toConfirm() {
      this.showConfirm = 1;
    },
    toCoin() {
      this.showConfirm = 2;
    },
    showPopup(assetCode) {
      this.transferAmt = "";
      this.assetCode = assetCode;
      this.show = true;
    },
    /*shortType () {
        let type = this.$store.state.account.type;
        return coins[type].symbol || type;
      },*/
    toScan() {
      this.$emit("scanQrcode");
    },
    closePopup() {
      this.show = false;
    },
    toCopyAddress() {
      this.$copyText(this.address).then(
        () => {
          this.$toast(this.$t("common.copySuccess"));
        },
        () => {
          this.$toast(this.$t("common.copyFail"));
        }
      );
    },
    toSetAmt() {
      this.$refs.setAmount.show(this.shortCode);
    },
    // setAmt(val) {
    //   this.transferAmt = val;
    // },
    onShare(item) {
      this.showShareActions = false;
      let self = this;
      let shareInfo = { text: self.address };
      if (!window.sharesdk) {
        this.$toast(this.$t("scan.equipmentType"));
        return;
      }
      switch (item.action) {
        case "wechat": {
          window.sharesdk.isInstallClient
            .promise(window.ShareSDK.ClientType.Wechat)
            .then(isInstall => {
              if (isInstall) {
                window.sharesdk.share(
                  window.ShareSDK.PlatformType.WechatSession,
                  window.ShareSDK.ShareType.Text,
                  shareInfo,
                  success => {
                    console.log("分享成功：" + success);
                  },
                  fail => {
                    if (fail.state != window.ShareSDK.ResponseState.Cancel) {
                      this.$toast("分享失败：" + fail.error);
                    }
                  }
                );
              } else {
                this.$toast(this.$t("scan.shareWeiXinFail"));
              }
            });
          break;
        }
        case "QQ": {
          window.sharesdk.isInstallClient
            .promise(window.ShareSDK.ClientType.QQ)
            .then(isInstall => {
              if (isInstall) {
                window.sharesdk.share(
                  window.ShareSDK.PlatformType.QQFriend,
                  window.ShareSDK.ShareType.Text,
                  shareInfo,
                  success => {
                    console.log("分享成功：" + success);
                  },
                  fail => {
                    if (fail.state != window.ShareSDK.ResponseState.Cancel) {
                      this.$toast("分享失败：" + fail.error);
                    }
                  }
                );
              } else {
                this.$toast(this.$t("scan.shareQQFail"));
              }
            });
          break;
        }
        default:
          break;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~assets/scss/_variables.scss";
.receive-container {
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.9);
}
.card {
  position: fixed;
  top: 3.67rem;
  left: 50%;
  transform: translateX(-50%);
  width: 86%;
  background: #fff;
  /*z-index: 99999;*/
  border-radius: $border-radius;
  .header {
    padding: 1.39rem 0.56rem 0.83rem;
    color: #353535;

    /*    background: $primary-color;*/
    border-radius: $border-radius $border-radius 0 0;
    p {
      margin-bottom: 0px;
      line-height: 1rem;
    }
  }
}
.share {
  position: fixed;
  bottom: 10px;
  width: 100%;
}

.ripplexag-bg {
  .header {
    color: $xag-color;
  }
  .van-button--primary {
    background-color: $xag-color;
    border: 1px solid $xag-color;
  }
  .confirmColor {
    color: $xag-color;
  }
  .confirm-border {
    border-bottom: 1px solid $xag-color;
  }
}
.ethereum-bg {
  .header {
    color: $eth-color;
  }
  .van-button--primary {
    background-color: $eth-color;
    border: 1px solid $eth-color;
  }
  .confirmColor {
    color: $eth-color;
  }
  .confirm-border {
    border-bottom: 1px solid $eth-color;
  }
}
.ripple-bg {
  .header {
    color: $ripple-color;
  }
  .van-button--primary {
    background-color: $ripple-color;
    border: 1px solid $ripple-color;
  }
  .confirmColor {
    color: $ripple-color;
  }
  .confirm-border {
    border-bottom: 1px solid $ripple-color;
  }
}
.footer {
  margin: 1.11rem 3.06rem 1.94rem;
}
canvas {
  display: block;
  margin: 1.11rem auto 1.39rem;
}
.b-white {
  &.padding {
    padding: 0.56rem 1.67rem 0px;
  }
  .van-cell.van-field {
    padding-bottom: 10px;
  }
}
</style>
