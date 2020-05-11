<template>
  <div class="view-account-item">
    <!-- 头部的箭头 -->
    <div @click="closePopup()" v-if="title == $t('assets.currentAccount')" class="push-back">
      <i>
        <img style="width:1.33rem" src="../../../../static/img/push-back.png" alt />
      </i>
    </div>
    <!--头部标题信息-->
    <van-row class="wallet-title">
      <van-col span="13">
        <div>{{title}}</div>
      </van-col>
      <van-col span="11" @click.native="toEmitOpt" class="text-right" v-if="optFalg">
        <img
          src="static/img/account-add@3x.png"
          style="vertical-align: middle;margin-right: 8px;"
          width="20"
          height="20"
          v-if="isImport"
        />
        <img
          src="static/img/account-import@3x.png"
          style="vertical-align: middle;margin-right: 8px;"
          width="20"
          height="20"
          v-else
        />
        <span style="vertical-align: middle">{{optText}}</span>
      </van-col>
    </van-row>
    <!--主体内容-->
    <div class="wallet-content-container">
      <van-swipe indicator-color="white" :loop="false" :duration="200" :initial-swipe="index">
        <van-swipe-item
          v-for="(item,key) in accounts"
          :key="key"
          :class="{
          'asset-active': index === key,
          'asset-active-prev': index === key + 1,
          'asset-active-next': index === key - 1,
          'asset-active-prev-1': index === key + 2,
           'asset-active-next-1': index === key - 2
          }"
        >
          <div
            class="wallet-content item-block"
            :class="`${item.type}-bg`"
            @click="toSelectWallet(item)"
          >
            <div class="wallet-content-wrapper">
              <div class="wallet-content-block">
                <div class="text">
                  <div>
                    <div class="text-ellipsis" style="width: 180px;">
                      <span class="icon-container">
                        <img
                          :src="`static/img/${shortType(item.type)}-w.png`"
                          class="vertical-align-middle"
                        />
                      </span>
                      <span class="big-font vertical-align-middle">{{item.name}}</span>
                    </div>
                    <span
                      @click="toAcctDetail(item)"
                      class="more select vertical-align-middle"
                      v-if="item.address == currentAccount.address&&item.type == currentAccount.type"
                    >
                      <i class="ultfont ult-ellipsis"></i>
                    </span>
                  </div>
                  <div class="normal-font addr-text">
                    <span class="vertical-align-middle small-font">
                      <pl-wallet-addr
                        class="small-font"
                        :complete="false"
                        :show-copy="false"
                        :address="item.address"
                      ></pl-wallet-addr>
                      <span class="more">
                        <van-icon name="success" class="icon" :class="item.type"></van-icon>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
    <acct-detail ref="acctDetail"></acct-detail>
  </div>
</template>
<script>
import coins from "src/wallet/coins";
import acctDetail from "../../acct/acct-detail";
export default {
  components: {
    acctDetail
  },
  props: {
    accounts: {
      type: Array,
      default: () => {
        return [];
      }
    },
    closePopup: {
      type: Function
    },
    title: String,
    optText: String,
    optFalg: {
      type: Boolean,
      default: true
    },
    isImport: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      index: 0
    };
  },
  computed: {
    currentAccount() {
      return this.$store.state.account;
    }
  },
  methods: {
    shortType(type) {
      return coins[type].symbol || type;
    },
    toEmitOpt() {
      this.$emit("opt");
    },
    toSelectWallet(item) {
      // this.$store.dispatch('setAccount' ,item);
      // this.currentAccount = item;
      this.$emit("selectWallet", item);
    },
    toAcctDetail(item) {
      this.$emit("viewDetail", item);
    },
    swipeChange(index) {
      this.index = index;
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import "~assets/scss/variables";
.view-account-item {
  .wallet-title {
    padding: 0px 15px;
    // line-height: 2.89rem;
    // height: 2.89rem;
    color: #fff;
    box-shadow: 0 -2px 20px 0 rgba(0, 0, 0, 0.05);
  }
  .wallet-content-container {
    position: relative;
    .bg {
      position: absolute;
      height: 100%;
      width: 100%;
      top: -5px;
      left: 0px;
      z-index: 1;
      img {
        height: 100%;
        width: 100%;
        border: 0px;
      }
    }
    .wallet-content {
      background-color: transparent;
      position: relative;
      z-index: 2;
      padding-bottom: 1.78rem;
      padding-top: 1.78rem;
      margin: 15px 20px 10px !important;
      color: #fff;
      /*  &.ethereum {
          background-image: radial-gradient(circle at left top, $eth-gradient-light, $eth-gradient);
        }
        &.bitcoin {
          background-image: radial-gradient(circle at left top, $btc-gradient-light, $btc-gradient);
        }
        &.stellar {
          background-image: radial-gradient(circle at left top, $stellar-gradient-light, $stellar-gradient);
        }
        &.ripple {
          background-image: radial-gradient(circle at left top, $ripple-gradient-light, $ripple-gradient);
        }*/
      .wallet-content-wrapper {
        padding-left: 10px;
        padding-right: 10px;
        position: relative;
        z-index: 2;
        .select {
          // background: #fff;
          width: 20px !important;
          height: 20px !important;
          line-height: 20px;
          border-radius: 50%;
          text-align: center;
          position: absolute;
          right: 10px;
          top: 11px;
          .icon {
            vertical-align: middle;
            &.ethereum {
              color: $eth-gradient;
            }
            &.bitcoin {
              color: $btc-gradient;
            }
            &.ripple {
              color: $ripple-gradient;
            }
            &.stellar {
              color: $stellar-gradient;
            }
            &.ripplexag {
              color: $ripple-gradient;
            }
          }
        }
        .wallet-content-block {
          padding: 5px 0px;
          display: flex;
          .icon-container {
            margin-right: 10px;
            vertical-align: text-bottom;
            img {
              width: 30px !important;
              height: 30px !important;
            }
          }
          .text {
            flex: 1;
            .addr-text {
              margin-left: 5px;
              padding-top: 30px;
              .address-text {
                width: 80% !important;
                overflow: hidden;
              }
            }
            .more {
              display: inline-block;
              float: right;
              width: 40px;
              height: 25px;
              text-align: center;
            }
          }
        }
      }
    }
  }
  .vertical-align-middle {
    vertical-align: middle;
  }
  .text-font-weight-bold {
    font-weight: bold;
  }
  .push-back {
    text-align: center;
    height: 2.78rem;
    line-height: 2.78rem;
    img {
      vertical-align: middle;
    }
  }

  .ripplexag-bg {
    background: url("../../../../static/img/xag-small.png") no-repeat center
      center;
    background-size: 100% 100%;
    .wallet-content-block {
      color: $xag-color;
    }
    .addr-text .more {
      background-color: $xag-color;
    }
  }
  .ripple-bg {
    background: url("../../../../static/img/Ripple-small.png") no-repeat center
      center;
    background-size: 100% 100%;
    .wallet-content-block {
      color: $ripple-color;
    }
    .addr-text .more {
      background-color: $ripple-color;
    }
  }
  .ethereum-bg {
    background: url("../../../../static/img/Eth-small.png") no-repeat center
      center;
    background-size: 100% 100%;
    .wallet-content-block {
      color: $eth-color;
    }
    .addr-text .more {
      background-color: $eth-color;
    }
  }

  .addr-text {
    .more {
      width: 20px !important;
      height: 20px !important;
      line-height: 20px;
      border-radius: 50%;
      text-align: center;
      text-align: center;
      i.van-icon-success {
        color: #fff;
      }
      .van-icon {
        top: 2px;
      }
    }
  }
  .view-account-item
    .wallet-content-block
    .text
    .addr-text
    .addr-container
    .address-text {
    color: #000;
  }

  // .asset-active-next {
  //   transform: translateX(-1.11rem) !important;
  // }
  // .wallet-content.item-block {
  //   width: 80%;
  // }
  // .asset-active-next {
  //   transform: translateX(-60px) !important;
  // }
  .item-block {
    border-bottom: none;
  }
}
.mt15 .wallet-title {
  margin-top: 1.11rem;
}
</style>
<style lang="scss" rel="stylesheet/scss">
.addr-text {
  .address-text {
    width: 80% !important;
    overflow: hidden;
    color: #353535;
  }
}
</style>
