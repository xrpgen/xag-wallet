<template>
  <div class="coin-type">
    <van-popup
      v-model="showPop"
      position="right"
      class="popup-wapper address-type"
      style="width:100%;height: 100%"
    >
      <van-nav-bar :title="$t('address.coinTypePlaceholder')" @click-left="close">
        <span slot="left">
          <i>
            <img src="../wallet/img/back.png" alt />
          </i>
        </span>
      </van-nav-bar>
      <pl-content-block :offsetTop="46" :offsetBottom="0" class="margin-top">
        <div class="shadow-bottom">
          <van-cell-group :border="false">
            <van-cell
              :title="item.name"
              v-for="(item,index) in coinTypes"
              clickable
              :key="index"
              @click="toSelect(item)"
            >
              <span slot="icon" class="content-left__icon">
                <img :src="`static/img/${item.coinType}@3x.png`" />
                <!--<img :src="dprImg(`${item.coinType}.png`)" class="img-icon">-->
                <!--<img :src="`static/img/tokens/${item.coinType}.png`" style="vertical-align: middle" width="20px" height="20px">-->
              </span>
            </van-cell>
          </van-cell-group>
        </div>
      </pl-content-block>
    </van-popup>
  </div>
</template>
<script>
import coins from "src/wallet/coins";
export default {
  data() {
    return {
      showPop: false,
      coinTypes: []
    };
  },
  methods: {
    show() {
      this.coinTypes = [];
      Object.keys(coins).forEach(key => {
        let coin = coins[key];
        if (coin.isShow) {
          let name = coin.name.charAt(0).toUpperCase() + coin.name.substring(1);
          name = name == "Ripplexag" ? "Xrpgen" : name;
          this.coinTypes.push({
            acctType: key,
            name: name,
            coinType: coin.symbol
          });
        }

        // Object.keys(coin.tokens).forEach(titem => {
        //   let coinType = {acctType: key, coinType: titem};
        //   this.coinTypes.push(coinType);
        // });
      });
      this.showPop = true;
    },
    toSelect(item) {
      this.$emit("done", item.coinType, item.acctType);
      this.close();
    },
    close() {
      this.showPop = false;
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.coin-type {
  .content-left__icon {
    display: inline-block;
    width: 36px;
    height: 36px;
    /*border: 1px solid #e5e5e5;*/
    /*line-height: 32px;*/
    border-radius: 50%;
    text-align: center;
    margin-right: 5px;
    vertical-align: middle;
    padding: 2px;
    img {
      width: 30px;
      height: 30px;
    }
  }
}
</style>
<style lang="scss" rel="stylesheet/scss">
.coin-type {
  .van-cell__title {
    line-height: 35px;
  }
}
.address-type.popup-wapper {
  .van-cell {
    border-bottom: 1px solid #fbfbfb;
    box-shadow: 0px 0px 0px 0px transparent, 0px 0px 0px 0px transparent,
      0px 0px 0px 0px transparent, 0px 1px 0px 0px #f7f7f7;
  }
  .item-block {
    border-bottom: none;
    padding-bottom: 0;
  }
}
</style>
