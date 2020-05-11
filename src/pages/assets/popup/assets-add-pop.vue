<template>
  <div>
    <van-popup
      v-model="showPop"
      position="bottom"
      class="popup-wapper"
      style="width:100%;height: 100%;"
    >
      <van-nav-bar :title="$t('assets.addAsset')" @click-left="close" @click-right="addToken">
        <span slot="left">
          <i>
            <img src="../../wallet/img/back.png" alt />
          </i>
        </span>
        <span slot="right" v-if="showAddBtn">
          <i>
            <img src="../../../../static/img/add-asset.png" alt />
          </i>
        </span>
      </van-nav-bar>
      <component :is="type" ref="component"></component>
    </van-popup>
    <token-add ref="tokenAdd" @reload="reload"></token-add>
    <token-add-stellar ref="tokenAddStellar" @reload="reload"></token-add-stellar>
    <token-add-ripple ref="tokenAddRipple" @reload="reload"></token-add-ripple>
    <token-add-ripplexag ref="tokenAddRipplexag" @reload="reload"></token-add-ripplexag>
  </div>
</template>
<script>
import { AccountType } from "../../../wallet/constants";
import ethereum from "./assets-add-ethereum-pop";
import ripple from "./assets-add-ripple-pop";
import ripplexag from "./assets-add-ripplexag-pop";
import stellar from "./assets-add-stellar-pop";
import btcion from "./assets-add-btcion-pop";
import tokenAdd from "./token-add-pop";
import tokenAddStellar from "./token-add-stellar-pop";
import tokenAddRipple from "./token-add-ripple-pop";
import tokenAddRipplexag from "./token-add-ripplexag-pop";
export default {
  data() {
    return {
      showPop: false,
      ethereum: AccountType.ethereum,
      stellar: AccountType.stellar,
      ripple: AccountType.ripple,
      ripplexag: AccountType.ripplexag
    };
  },
  components: {
    [AccountType.bitcoin]: btcion,
    [AccountType.ethereum]: ethereum,
    [AccountType.stellar]: stellar,
    [AccountType.ripple]: ripple,
    [AccountType.ripplexag]: ripplexag,
    tokenAdd,
    tokenAddStellar,
    tokenAddRipple,
    tokenAddRipplexag
  },
  computed: {
    type() {
      if (this.$store.state.account.type) {
        return this.$store.state.account.type;
      }
      return "";
    }
  },
  methods: {
    show() {
      this.showPop = true;
      this.$nextTick(() => {
        this.$refs["component"].init();
      });
    },
    showAddBtn() {
      return this.type() === this.ethereum || this.type() === this.stellar;
    },
    addToken() {
      switch (this.type) {
        case AccountType.ethereum:
          this.$refs.tokenAdd.show();
          break;
        case AccountType.stellar:
          this.$refs.tokenAddStellar.show();
          break;
        case AccountType.ripple:
          this.$refs.tokenAddRipple.show();
          break;
        case AccountType.ripplexag:
          this.$refs.tokenAddRipplexag.show();
          break;
        default:
          break;
      }
    },
    close() {
      this.showPop = false;
    },
    reload() {
      this.$refs["component"].init();
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
