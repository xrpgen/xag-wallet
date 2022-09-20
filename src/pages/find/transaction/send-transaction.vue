<template>
  <!-- 转账页面 -->
  <van-popup
    v-model="showPop"
    position="bottom"
    class="popup-wapper"
    style="width:100%;height: 100%;"
  >
    <div style="width: 100%;" class="transfer-container">
      <van-nav-bar :title="asset.code + '转账'" @click-left="close()">
        <div slot="title">
          <div v-if="asset.name">
            <div style="line-height: 30px;">{{asset.code}}&nbsp;{{$t('common.transferAccounts')}}</div>
            <div style="line-height: 15px;" class="text-muted small-font">&nbsp;({{asset.name}})</div>
          </div>
          <div v-else>{{asset.code}}&nbsp;{{$t('common.transferAccounts')}}</div>
        </div>
        <span slot="left">
          <i>
            <img src="../../wallet/img/back.png" alt />
          </i>
        </span>
      </van-nav-bar>
    </div>

    <component
      :is="sendType"
      ref="component"
      :asset="asset"
      :transfer-amt="transferAmt"
      :address="address"
      :tag="tag"
      :msg="msg"
      @done="done"
    ></component>
  </van-popup>
</template>
<script>
import { AccountType } from "../../../wallet/constants";
import sendRipple from "./send-ripple";
import sendRipplexag from "./send-ripplexag";

export default {
  data() {
    return {
      showPop: false,
      asset: {},
      loading: false,
      address: "",
      transferAmt: "",
      tag: "",
      msg: "",
    };
  },
  components: {
    [AccountType.ripple]: sendRipple,
    [AccountType.ripplexag]: sendRipplexag,
  },
  computed: {
    sendType() {
      if (this.$store.state.account.type) {
        return this.$store.state.account.type;
      }
      return "";
    }
  },
  methods: {
    show(asset, address, transferAmt, tag, msg) {
      console.log(asset);
      this.asset = asset;
      if (address && address !== "") {
        this.address = address;
      } else {
        this.address = "";
      }
      if (transferAmt && transferAmt !== "") {
        this.transferAmt = transferAmt;
      } else {
        this.transferAmt = "";
      }
      if (tag && tag !== "") {
        this.tag = tag;
      } else {
        this.tag = "";
      }
      if (msg && msg !== "") {
        this.msg = msg;
      } else {
        this.msg = "";
      }
      this.$nextTick(() => {
        if (this.$refs["component"]) {
          this.$refs["component"].init();
        }
      });
      this.showPop = true;
    },
    done() {
      this.$emit("done");
      this.close();
    },
    close() {
      this.showPop = false;
    },
  }
};
</script>
<style lang="scss">
</style>
