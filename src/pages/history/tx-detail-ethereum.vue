<template>
  <div>
    <div class="transfer-success-bg">
      <div class="pic">
        <img
          width="40"
          style="display:block; margin:0 auto"
          src="../../../static/img/success.png"
          alt
        />
      </div>
      <div class="text-center sn-font" v-if="item.txType === '1'">
        <strong style="color:#fff">{{$t('history.receivableSuccess')}}</strong>
      </div>
      <div class="text-center sn-font" v-else>
        <strong style="color:#fff">{{$t('history.transferSuccess')}}</strong>
      </div>
      <div
        class="text-center small-font"
        style="margin-top: 10px;color:#fff"
      >{{item.txTime | date('YYYY/MM/DD hh:mm:ss')}}</div>
    </div>

    <pl-block style="padding-left: 20px; padding-right:20px">
      <div class="text-block">
        <!--<p class=" small-font" v-text="$t('history.transactionTime')"></p>-->
        <van-row>
          <van-col span="6" type="flex">
            <div class="small-font">{{$t('history.amount')}}</div>
          </van-col>
          <van-col span="18">
            <div
              class="big-font"
            >{{item.amount | currency('', '7') | cutTail}}&nbsp;&nbsp;{{item.assetCode}}</div>
          </van-col>
        </van-row>
      </div>
      <div class="text-block">
        <van-row>
          <van-col span="6">
            <p class="small-font" v-text="$t('common.transactionFee')"></p>
          </van-col>
          <van-col span="18">
            <div class="small-font">{{item.fee}}&nbsp;&nbsp;ether</div>
            <div
              class="x-small-font text-ellipsis text-muted"
            >=Gas({{item.data.gas}})*GasPrice({{item.data.gasPrice}})</div>
          </van-col>
        </van-row>
      </div>
      <div class="text-block">
        <van-row>
          <van-col span="6">
            <p class="small-font" v-text="$t('common.receivablesAddress')"></p>
          </van-col>
          <van-col span="18">
            <pl-wallet-addr class="small-font" :address="item.to" complete></pl-wallet-addr>
          </van-col>
        </van-row>
      </div>
      <div class="text-block">
        <van-row>
          <van-col span="6">
            <p class="small-font" v-text="$t('common.paymentAddress')"></p>
          </van-col>
          <van-col span="18">
            <pl-wallet-addr class="small-font" :address="item.from" complete></pl-wallet-addr>
          </van-col>
        </van-row>
      </div>
    </pl-block>

    <pl-block
      class="margin-top van-hairline--top"
      style="padding-left: 20px; padding-right:20px;position: relative;"
    >
      <div class="text-block">
        <van-row>
          <van-col span="6">
            <div class="small-font" v-text="$t('history.transactionHash')"></div>
          </van-col>
          <van-col span="18">
            <pl-wallet-addr class="small-font" :address="item.txHash" :length="6"></pl-wallet-addr>
          </van-col>
        </van-row>
      </div>
      <div class="text-block">
        <van-row>
          <van-col span="6">
            <p class="small-font" v-text="$t('common.block')"></p>
          </van-col>
          <van-col span="18">
            <div class="small-font">{{item.blockNumber}}</div>
          </van-col>
        </van-row>
      </div>
      <div class="qrcode-parent">
        <qrcode
          class="qrcode"
          :value="`https://cn.etherscan.com/tx/${item.txHash}`"
          :options="{ size: 80 }"
        ></qrcode>
      </div>
    </pl-block>
    <br />
    <br />
  </div>
</template>
<script>
import qrcode from "@xkeshi/vue-qrcode";
export default {
  components: { qrcode },
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    txTip() {
      if (this.item.confirmations === 0) {
        return this.$t("history.unpackage");
      } else {
        return this.$t("history.confirming");
      }
    },
    iconName() {
      if (this.item.confirmations < 6) {
        if (this.item.confirmations === 0) {
          return "more";
        }
        return "underway";
      }
      return "checked";
    }
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.tip {
  padding-bottom: 10px;
}

.text-block {
  padding-top: 10px;
}
.qrcode-parent {
  position: absolute;
  top: 15px;
  right: 0px;
}
</style>
