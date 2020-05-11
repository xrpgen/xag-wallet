<template>
  <div style="overflow-x: hidden;">
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
        <van-row>
          <van-col span="6" type="flex">
            <div class="small-font">{{$t('history.amount')}}</div>
          </van-col>
          <van-col span="18">
            <div class="big-font">{{item.amount | currency('', '7') | cutTail}}&nbsp;&nbsp;BTC</div>
          </van-col>
        </van-row>
      </div>
      <div class="text-block">
        <van-row>
          <van-col span="6">
            <p class="small-font" v-text="$t('common.transactionFee')"></p>
          </van-col>
          <van-col span="18">
            <div class="small-font">{{item.fee}}&nbsp;&nbsp;BTC</div>
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
      style="padding-left: 20px; padding-right:20px;position: relative"
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
          :value="`https://live.blockcypher.com/btc/tx/${item.txHash}`"
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
  right: -3px;
}
</style>
