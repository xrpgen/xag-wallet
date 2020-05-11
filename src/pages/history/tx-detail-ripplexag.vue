<template>
  <div style="overflow-x: hidden;">
    <!-- <pl-block class="van-hairline--bottom">
      <div class="text-center padding">
        <van-icon
          name="checked"
          class="text-primary"
          style="font-size: 40px;vertical-align: middle;"
        />
      </div>
      <div class="text-center big-font" v-if="item.txType === '1'">
        <strong>{{$t('history.receivableSuccess')}}</strong>
      </div>
      <div class="text-center big-font" v-else>
        <strong>{{$t('history.transferSuccess')}}</strong>
      </div>
      <div
        class="text-center text-muted small-font"
        style="margin-top: 10px;"
      >{{item.txTime | date('YYYY/MM/DD hh:mm:ss')}}</div>
    </pl-block>-->

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
      <!-- 金额 -->
      <div class="text-block">
        <van-row>
          <van-col span="6" type="flex">
            <div class="small-font">{{$t('common.transferAmount')}}</div>
          </van-col>
          <van-col span="18">
            <div
              class="big-font"
            >{{item.amount | currency('', '7') | cutTail}}&nbsp;&nbsp;{{item.assetCode}}</div>
          </van-col>
        </van-row>
      </div>
      <!-- 交易费用 -->
      <div class="text-block">
        <van-row>
          <van-col span="6">
            <p class="small-font" v-text="$t('common.transactionFee')"></p>
          </van-col>
          <van-col span="18">
            <div class="x-small-font">{{item.fee}}&nbsp;&nbsp;XAG</div>
          </van-col>
        </van-row>
      </div>
      <!-- tag -->
      <div
        class="text-block"
        v-if="item.data && item.data.specification && item.data.specification.destination && item.data.specification.destination.tag"
      >
        <van-row>
          <van-col span="6">
            <p class="small-font">Tag</p>
          </van-col>
          <van-col span="18">
            <div class="x-small-font">{{item.data.specification.destination.tag}}</div>
          </van-col>
        </van-row>
      </div>
      <!-- !!!新增德备注信息 -->
      <div
        class="text-block"
        v-if="item.data && item.data.specification && item.data.specification.destination && item.data.specification.memos[0].data"
      >
        <van-row>
          <van-col span="6">
            <p class="small-font">信息</p>
          </van-col>
          <van-col span="18">
            <div class="x-small-font">{{item.data.specification.memos[0].data}}</div>
          </van-col>
        </van-row>
      </div>

      <!-- 收货地址 -->
      <div class="text-block">
        <van-row>
          <van-col span="6">
            <p class="small-font" v-text="$t('common.receivablesAddress')"></p>
          </van-col>
          <van-col span="18">
            <pl-wallet-addr class="x-small-font" :address="item.to" complete></pl-wallet-addr>
          </van-col>
        </van-row>
      </div>
      <div class="text-block">
        <van-row>
          <van-col span="6">
            <p class="small-font" v-text="$t('common.paymentAddress')"></p>
          </van-col>
          <van-col span="18">
            <pl-wallet-addr class="x-small-font" :address="item.from" complete></pl-wallet-addr>
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
            <pl-wallet-addr class="x-small-font" :address="item.txHash" :length="6"></pl-wallet-addr>
          </van-col>
        </van-row>
      </div>
      <div class="text-block">
        <van-row>
          <van-col span="6">
            <p class="small-font" v-text="$t('history.ledgerNummber')"></p>
          </van-col>
          <van-col span="18">
            <div class="x-small-font">{{item.blockNumber}}</div>
          </van-col>
        </van-row>
      </div>
      <div class="qrcode-parent">
        <qrcode
          class="qrcode"
          :value="`https://xrpalikegene.org/transactions/${item.txHash}`"
          :options="{ size: 85 }"
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
  created() {
    this.aa();
  },
  methods: {
    aa() {
      console.log(this.item);
    }
  }
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
<style lang="scss">
// 转账成功详情样式
.transfer-success-bg {
  background: url("../../../static/img/success-bg.png");
  background-size: 100% 100%;
  padding-top: 1.11rem;
  padding-bottom: 1.11rem;
  .pic {
    margin-bottom: 0.83rem;
  }
}

.tx-detail-popup {
  background-color: #f7f7f7;
  .container.padding-15 {
    margin-top: 0.56rem;
    border-radius: 7px;
    padding-top: 25px;
    padding-bottom: 30px;
  }
}
</style>
