<template>
  <div class="asset-item">
    <div class="bg-wrapper">
      <div class="asset-nav-bar">
        <div class="nav-bar-wrapper">
          <span>{{ $t("assets.assets") }}</span>
          <div class="icon-right">
            <!-- @click="this.$parent.toScan"
            @click="this.$parent.viewAccounts"
            
            -->
            <i @click="toScan()" class="sao">
              <img
                style="width:1.11rem"
                src="../../../static/img/sao-white.png"
                alt
              />
            </i>
            <i @click="viewAccounts()" class="menu">
              <img
                style="width:1.11rem"
                src="../../../static/img/menu.png"
                alt
              />
            </i>
          </div>
        </div>
      </div>
      <div class="top-wrapper">
        <div
          class="asset-top-card"
          @click="topCardClick"
          :class="`${data.type}-bg`"
        >
          <div class="bg">
            <!-- <img src="static/img/card-bg.png" /> -->
          </div>
          <div class="content-wrapper">
            <div class="qrcode">
              <i class="ultfont ult-ellipsis"></i>
            </div>
            <div class="title text-ellipsis">
              <img
                :src="dprImg(`${shortType(data.type)}-w.png`)"
                width="25"
                height="25"
                style="vertical-align: middle"
              />
              <span style="vertical-align: middle"
                >&nbsp;&nbsp;{{ data.name }}</span
              >
            </div>
            <!-- <div class="content" :class="setStatAmtClass">
              <span class="normal-font">&nbsp;&#8776;&nbsp;</span>
              <pl-privacy
                >{{ statAmt | currency("", "4") | cutTail }}&nbsp;</pl-privacy
              >
              <span class="small-font">
                &nbsp;{{ $store.state.setting.currencyUnit }}
              </span>
            </div> -->

            <div class="bottom">
              <pl-wallet-addr
                class="small-font"
                :complete="false"
                :address="data.address"
              ></pl-wallet-addr>
              <!-- 点击二维码进入收款页面 -->
              <span class="pull-right" @click.stop="showQRcode(data.type)">
                <i class="ultfont ult-qrcode"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- </div> -->
    <pl-content-block
      :offsetTop="214"
      :offsetBottom="51"
      heightType="minHeight"
      style="overflow-y: hidden;"
    >
      <div class="text-center" v-if="loading">
        <van-loading style="margin: 10px auto;" />
      </div>
      <div v-else>
        <!-- 账户未被激活 -->
        <account-activated
          v-if="!activated"
          :acct-type="data.type"
          :short-acct-type="shortType(data.type)"
          @transitionActivated="showQRcode(data.type)"
        ></account-activated>
        <div v-else>
          <div
            class="asset-bar"
            v-if="this.balances && this.balances.length > 0"
          >
            <div class="big-font" style="font-weight: bold">
              <span style="vertical-align: middle;">{{
                $t("assets.assets")
              }}</span>
              <span style="vertical-align: middle;">
                <i
                  v-if="!$store.state.setting.privacyMode"
                  @click="setMode(true)"
                  class="eye-icon"
                >
                  <img width="17" src="../../../static/img/eye-open.png" alt />
                </i>
                <i @click="setMode(false)" class="eye-icon" v-else>
                  <img width="17" src="../../../static/img/eye-close.png" alt />
                </i>
                <!-- <van-icon
                  v-if="!$store.state.setting.privacyMode"
                  name="eye-o"
                  @click="setMode(true)"
                />
                <van-icon v-else name="password-not-view" @click="setMode(false)" />-->
              </span>
            </div>
            <span
              class="add-btn"
              style="right: 77px;"
              @click="toTrade"
              v-if="showTradeBtn"
            >
              <img :src="dprImg(`trade.png`)" height="20" />
            </span>
            <span
              :class="`add-btn ${data.type}-add`"
              @click="addAssets"
              v-if="showAddBtn"
            >
              <!-- <img :src="dprImg(`add.png`)" width="20" height="20" /> -->
              <img
                :src="
                  data.type === 'ripplexag'
                    ? dprImg(`add-xag.png`)
                    : data.type === 'ripple'
                    ? dprImg(`add-ripple.png`)
                    : dprImg(`add-eth.png`)
                "
                width="20"
                height="20"
              />
            </span>
          </div>
          <div class="asset-list">
            <div
              class="asset-list-item item-block no-margin"
              v-for="(item, key) in assets"
              :key="key"
              @click="assetClick(item)"
            >
              <!-- <span>{{assets}}</span> -->
              <div class="content primary-shadow" style="border-bottom:0px">
                <table style="width: 100%;">
                  <tr>
                    <td width="35">
                      <span class="img-icon">
                        <img v-if="item.logo" :src="item.logo" />
                        <img
                          v-else-if="item.code === 'XRP'"
                          :src="`static/img/${item.code}-1@3x.png`"
                        />
                        <img
                          v-else
                          :src="`static/img/${item.code}@3x.png`"
                          onerror="this.src='static/img/unknown.png'"
                        />
                      </span>
                    </td>
                    <td width="90">
                      <div style="vertical-align: middle;" class="big-font">
                        {{ item.code }}
                      </div>
                      <span v-if="item.name" class="text-main">
                        <span v-if="item.name !== 'unknown'">
                          {{ item.name | longStrAbbr(3) }}
                        </span>

                        <span v-else>
                          <pl-wallet-addr
                            class="x-small-font"
                            :complete="false"
                            :address="item.issuer"
                            :length="4"
                            :show-copy="false"
                          ></pl-wallet-addr>
                        </span>
                      </span>
                    </td>
                    <td class="text-right">
                      <div class="big-font">
                        <pl-privacy :switchable="false">{{
                          item.value | currency("", "8") | cutTail
                        }}</pl-privacy>
                      </div>
                      <!-- <div class="content">
                        <span class="normal-font">&nbsp;&#8776;&nbsp;</span>
                        <pl-privacy
                          >{{
                            statAmt | currency("", "4") | cutTail
                          }}&nbsp;</pl-privacy
                        >
                        <span class="small-font"
                          >&nbsp;{{ $store.state.setting.currencyUnit }}</span
                        >
                      </div> -->
                      <div
                        class="text-main small-font"
                        v-if="isShowMarket(item.value, item.code, item.issuer)"
                      >
                        <div
                          v-if="
                            item.code !== 'XLM' &&
                              item.code !== 'XRP' &&
                              item.code !== 'XAG'
                          "
                        >
                          &#8776;&nbsp;
                          <pl-privacy
                            :suffix="$store.state.setting.currencyUnit"
                            :switchable="false"
                            >{{
                              item.value | market(item.code, item.issuer)
                            }}</pl-privacy
                          >
                        </div>
                      </div>
                      <div
                        v-if="
                          item.code === 'XLM' ||
                            item.code === 'XRP' ||
                            item.code === 'XAG'
                        "
                      >
                        {{ $t("assets.frozenNative") }}
                        <pl-privacy
                          :suffix="$store.state.setting.currencyUnit"
                          :switchable="false"
                          >{{ item.frozenNative }} {{ item.code }}</pl-privacy
                        >
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </pl-content-block>
  </div>
</template>

<script>
import asset from "./mixns/asset";
import coins from "src/wallet/coins";
import accountActivated from "./account-activated";
import { AccountType } from "src/wallet/constants";
import Big from "big.js";
import convertMarket from "core/utils/convertMarket";
export default {
  mixins: [asset],
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    toScan: {
      type: Function
    },
    viewAccounts: {
      type: Function
    }
  },
  data() {
    return {
      loading: false
    };
  },
  components: {
    accountActivated
  },
  computed: {
    showAddBtn() {
      if (this.data && this.data.type === AccountType.bitcoin) {
        return false;
      } else {
        return true;
      }
    },
    showTradeBtn() {
      if (
        this.data &&
        (this.data.type === AccountType.stellar ||
          this.data.type === AccountType.ripple ||
          this.data.type === AccountType.ripplexag)
      ) {
        return true;
      } else {
        return false;
      }
    },
    activated() {
      if (this.data && this.data.address) {
        let activated = this.$store.state.activatedMap[
          this.data.type + this.data.address
        ];
        return activated === false ? false : true;
      }
      return true;
    },
    assets() {
      let assets = [];
      if (this.data && this.data.address) {
        let assetsMap = this.getConfigAssetsMap(this.data.type);
        if (this.balances) {
          this.balances.forEach((item, index) => {
            let asset = { ...item };
            let assetMap = assetsMap[item.code + (item.issuer || "")];
            if (assetMap) {
              asset.logo = assetMap.logo || "";
              asset.name = assetMap.name || "unknown";
              asset.issuer = assetMap.issuer;
              assets.push(asset);
            } else if (index === 0) {
              // asset.name = this.data.type;
              assets.push(asset);
            } else {
              asset.logo = "static/img/unknown.png";
              if (!asset.name) {
                asset.name = "unknown";
              }
              assets.push(asset);
            }
          });
        }
      }
      return assets;
    },
    balances() {
      if (this.data.address) {
        return this.$store.state.balances[this.data.type + this.data.address];
      }
      return [];
    },
    statAmt() {
      let assets = this.assets;
      let result = 0;
      if (assets && assets.length > 0) {
        let markets = this.$store.state.markets;
        assets.forEach(item => {
          let key = item.issuer ? `${item.code}-${item.issuer}` : item.code;
          let market = markets[key];
          if (market && market.marketPrice) {
            let calVal = new Big(item.value).times(market.marketPrice);
            result = new Big(result).plus(calVal);
          }
        });
      }
      if (result > 1) {
        result = result.toFixed(2);
      } else if (result > 0 && result < 1) {
        result = result.toFixed(4);
      }
      return Number(result);
    },
    setStatAmtClass() {
      if (this.statAmt && this.statAmt.toString().length > 12) {
        return "x-large-font";
      } else {
        return "x-x-large-font";
      }
    }
  },
  methods: {
    isShowMarket(value, assetCode, assetIssuer) {
      return convertMarket(value, assetCode, assetIssuer) > 0;
    },
    setMode(val) {
      this.$store.dispatch("setPrivacyMode", val);
    },
    setActive() {
      if (!this.balances || this.balances.length === 0) {
        this.loading = true;
      }
      let params = { ...this.data, setBalance: false };
      this.$store.dispatch("setAccount", params);
      this.$store
        .dispatch("setBalances", this.data)
        .then(() => {
          this.$emit("setSwipeHeight");
          this.loading = false;
        })
        .catch(err => {
          console.info(err);
          this.$emit("setSwipeHeight");
          this.loading = false;
        });
      // this.$wallet.getInstance().getTrustlines('rDDJqnFgTNnR4c4u8EAAskpet4LUYUZm4A').then(ret => {
      //   console.info(ret);
      // });
    },
    shortType(type) {
      return coins[type].symbol || type;
    },
    assetClick(item) {
      this.$emit("assetClick", item);
    },
    topCardClick() {
      this.$emit("topCardClick");
    },
    showQRcode(type) {
      this.$emit("showQRcode", this.shortType(type));
    },
    addAssets() {
      this.$emit("addAssets");
    },
    toTrade() {
      if (this.balances.length > 1) {
        this.$emit("toTrade");
      } else {
        this.$dialog
          .confirm({
            title: this.$t("common.tip"),
            message: this.$t("trade.tradeTip")
          })
          .then(() => {
            this.$emit("toTrade");
          });
      }
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "~assets/scss/variables";
@import "~assets/scss/mixin";

.asset-item {
  height: 100%;

  .icon-right {
    float: right;
    img {
      vertical-align: middle;
    }
  }
  .menu {
    margin-left: 1.5rem;
  }

  .bg-wrapper {
    background: url("../../../static/img/card-bg.png") no-repeat center -40px;
    background-size: 100% 100%;
  }
  .top-wrapper {
    padding: 20px 20px;
    position: relative;
    border-radius: 0 0 12px 12px;
    .asset-top-card {
      /* background-image: radial-gradient(circle at left top, $primay-gradient-light, $primay-gradient);*/
      overflow: hidden;
      .content-wrapper {
        position: relative;
        z-index: 2;
      }
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
      border-radius: $border-radius;
      transition: 0.2s all;
      position: relative;
      z-index: 2;
      margin: 0px -60px;
      transform: scale(0.8);
      padding: 1.11rem 1.11rem;
      color: #000;
      .title {
        padding-right: 60px;
        > span {
          display: inline-block;
          line-height: 27px;
          height: 25px;
        }
      }
      .content {
        height: 58px;
        line-height: 58px;
        font-weight: 500;
      }
      .bottom {
        line-height: 20px;
        margin-top: 1.11rem;
      }
      .qrcode {
        position: absolute;
        top: -5px;
        right: 0px;
      }
    }
  }
  .asset-bar {
    padding: 15px 20px 20px;
    position: relative;
    line-height: 30px;
    .eye-icon {
      vertical-align: middle;
      margin-left: 0.28rem;
    }
    .add-btn {
      width: 36px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      display: block;
      position: absolute;
      top: 15px;
      /* right: 20px;*/
      right: 10px;
      color: $primary-color;
      padding: 5px;
      // box-shadow: 0px -2px 20px rgba(0, 0, 0, 0.05);
    }
  }

  .asset-list {
    .asset-list-item {
      padding: 0px 1.11rem;
      .title {
        @include clearfix();
        margin-bottom: 2px;
      }
      & > .content {
        padding-top: 1.11rem;
        padding-bottom: 1.11rem;
      }
      .content {
        @include clearfix();
        line-height: 20px;
        font-size: $x-small-font;
        .text-right .content {
          color: $deep-gray-text;
          line-height: 0.65rem;
          margin-top: 0.56rem;
        }
      }
    }
    margin-bottom: 20px;
  }

  .nav-bar-wrapper {
    padding: 0.83rem 1.11rem;
    font-size: 1.22rem;
    font-weight: 500;
    color: #fff;
  }
}
</style>
<style lang="scss">
@import "~assets/scss/variables";
.asset-top-card.ripplexag-bg {
  background: url("../../../static/img/xag-small.png") no-repeat center center;
  background-size: 100% 100%;
  .content-wrapper {
    i.ultfont {
      color: $xag-color;
    }
    .title span {
      color: $xag-color;
    }
  }
}
.asset-top-card.ripple-bg {
  background: url("../../../static/img/Ripple-small.png") no-repeat center
    center;
  background-size: 100% 100%;
  .content-wrapper {
    i {
      color: $ripple-color;
    }
    .title span {
      color: $ripple-color;
    }
  }
}
.asset-top-card.ethereum-bg {
  background: url("../../../static/img/Eth-small.png") no-repeat center center;
  background-size: 100% 100%;

  .content-wrapper {
    i {
      color: $eth-color;
    }
    .title span {
      color: $eth-color;
    }
  }
}
.van-swipe__indicators {
  top: 14.5rem;
  bottom: inherit;
  i {
    width: 13px;
    height: 2px;
    background-color: $deep-gray-text;
    border-radius: inherit;
    &.van-swipe__indicator--active {
      background-color: $primary-color;
    }
  }
}
</style>
