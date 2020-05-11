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
            <div
              class="big-font"
            >{{tempItem.amount | currency('', '7') | cutTail}}&nbsp;&nbsp;{{item.assetCode}}</div>
          </van-col>
        </van-row>
      </div>
      <div
        class="text-block"
        v-if="tempItem && tempItem.data && tempItem.data.memo_type && tempItem.data.memo_type !== 'none'"
      >
        <van-row>
          <van-col span="6" type="flex">
            <div class="small-font">Memo-{{tempItem.data.memo_type}}</div>
          </van-col>
          <van-col span="18">
            <div>{{tempItem.data.memo}}</div>
          </van-col>
        </van-row>
      </div>
      <div class="text-block">
        <van-row>
          <van-col span="6">
            <p class="small-font" v-text="$t('common.receivablesAddress')"></p>
          </van-col>
          <van-col span="18">
            <pl-wallet-addr class="small-font" :address="tempItem.to" complete></pl-wallet-addr>
          </van-col>
        </van-row>
      </div>
      <div class="text-block">
        <van-row>
          <van-col span="6">
            <p class="small-font" v-text="$t('common.paymentAddress')"></p>
          </van-col>
          <van-col span="18">
            <pl-wallet-addr class="small-font" :address="tempItem.from" complete></pl-wallet-addr>
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
            <p class="small-font" v-text="$t('history.transactionHash')"></p>
          </van-col>
          <van-col span="18">
            <pl-wallet-addr :address="tempItem.txHash" :length="6"></pl-wallet-addr>
          </van-col>
        </van-row>
      </div>
      <div class="qrcode-parent">
        <qrcode
          class="qrcode"
          :value="`https://steexp.com/tx/${item.txHash}`"
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
  data() {
    return {
      tempItem: {
        data: {
          memo: "",
          memo_type: ""
        }
      }
    };
  },
  watch: {
    item() {
      this.setTx();
    }
  },
  methods: {
    setTx() {
      this.tempItem = this.item;
      if (this.tempItem && this.tempItem.data.memo_type === undefined) {
        this.$wallet.getTransaction(this.tempItem.txHash).then(tx => {
          this.tempItem.data.memo = tx.memo || "";
          this.tempItem.data.memo_type = tx.memo_type;
          this.$forceUpdate();
          this.$collecitons.history.updateHistory(
            this.tempItem.txHash,
            item => {
              item.data.memo = tx.memo || "";
              item.data.memo_type = tx.memo_type;
            }
          );
          this.$emit("update:item", this.tempItem);
        });
      }
    }
  },
  mounted() {
    this.setTx();
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
