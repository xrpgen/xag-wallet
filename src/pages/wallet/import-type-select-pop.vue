<template>
  <div class="coin-type-select">
    <van-popup
      v-model="showVpop"
      position="right"
      class="popup-wapper import-fw400"
      style="width:100%;height: 100%;overflow: hidden;"
    >
      <pl-header>
        <van-nav-bar :title="title" fixed :z-index="999" @click-left="close">
          <span slot="left">
            <i>
              <img src="./img/back.png" alt />
            </i>
          </span>
        </van-nav-bar>
      </pl-header>
      <pl-content-block :offsetTop="46">
        <content-block min-height="200px">
          <top-block :title="$t('wallet.selectAccountType')">
            <img src="static/img/account-select@3x.png" style="width:3.5rem" />
          </top-block>
          <type-select :clickable="true" :isCheck="false" @click-opt="toImportWallet">
            <span slot="type-right-icon">
              <van-icon name="arrow"></van-icon>
            </span>
          </type-select>
        </content-block>
      </pl-content-block>
    </van-popup>
    <import-wallet-acct ref="importWalletAcct" @done="done" @refreshAll="refreshAll"></import-wallet-acct>
  </div>
</template>
<script>
import importWalletAcct from "./import-wallet-pop";
import contentBlock from "./components/content-block";
import topBlock from "./components/top-block";
import typeSelect from "./components/type-select";
export default {
  components: { importWalletAcct, topBlock, contentBlock, typeSelect },
  data() {
    return {
      showVpop: false,
      checkedValue: "",
      source: ""
    };
  },
  computed: {
    title() {
      return this.$t("wallet.importAcct");
    }
  },
  methods: {
    show(source) {
      // type=1表示创建钱包，type=2表示恢复钱包
      this.showVpop = true;
      this.source = source;
    },
    close() {
      this.showVpop = false;
    },
    toImportWallet(coin) {
      this.$refs.importWalletAcct.show(coin, this.source);
    },
    done() {
      this.close();
      this.$emit("done");
    },
    refreshAll() {
      this.close();
      this.$emit("refreshAll");
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.coin-type-select {
  .van-cell__title {
    align-self: center;
  }
  .van-cell__right-icon {
    line-height: 35px;
  }
}
.import-fw400 .van-nav-bar__title {
  font-weight: 400;
}
</style>
<style lang="scss" scoped>
</style>
