<template>
  <div class="import-wallet">
    <van-popup
      v-model="showVpop"
      position="right"
      class="popup-wapper import-fw400"
      style="width:100%;height: 100%;overflow: hidden"
    >
      <van-nav-bar :title="barTitle" @click-left="close">
        <span slot="left">
          <i>
            <img src="./img/back.png" alt />
          </i>
        </span>
      </van-nav-bar>
      <div class="import-way">{{$t('wallet.importAcctType')}}</div>
      <van-cell-group>
        <!-- <van-cell class="import-way" :value="$t('wallet.importAcctType')" /> -->
        <van-cell
          @click="toMnemonicCode"
          class="primary-shadow"
          :title="$t('wallet.mnemonicCode')"
          value
        />
        <van-cell @click="toPrivateKey" :title="$t('wallet.privateKey')" value />
      </van-cell-group>
    </van-popup>
    <import-Private-Key ref="importPrivateKey" @done="done" @refreshAll="refreshAll"></import-Private-Key>
    <importMnemonicCode ref="importMnemonicCode" @done="done" @refreshAll="refreshAll"></importMnemonicCode>
  </div>
</template>
<script>
import createWallet from "./mixins/createWallet";
import passwordBlock from "./components/password-input-block";
import walletTextArea from "./components/wallet-textarea";
import walletTip from "./components/wallet-tip";
import buttonBottom from "./components/button-bottom";
import importPrivateKey from "./import-privateKey-pop";
import importMnemonicCode from "./import-mnemonicCode-pop";

export default {
  mixins: [createWallet],
  components: {
    passwordBlock,
    walletTextArea,
    walletTip,
    buttonBottom,
    importPrivateKey,
    importMnemonicCode
  },
  data() {
    return {
      coin: {},
      source: "",
      tagSelect: "1",
      showVpop: false,
      form: {
        memorizingWords: "",
        walletPwd: "",
        confirmWalletPwd: "",
        privateKey: ""
      }
    };
  },
  computed: {
    bottomTip() {
      if (this.tagSelect === "1") {
        return this.$t("wallet.oneSecUnderstandMnemonicCode");
      } else if (this.tagSelect === "2") {
        return this.$t("wallet.oneSecUnderstandPrivateKey");
      }
      return "";
    },
    barTitle() {
      return (
        this.$t("common.import") +
        " " +
        this.coin.name +
        " " +
        this.$t("common.account")
      );
    }
  },
  methods: {
    show(coin, source) {
      this.source = source;
      this.coin = coin;
      this.resetForm();
      this.showVpop = true;
    },
    close() {
      this.showVpop = false;
    },
    resetForm() {
      this.tagSelect = "1";
      this.form.memorizingWords = "";
      this.form.privateKey = "";
      this.$nextTick(() => {
        this.$refs.passwordBlock.resetForm();
      });
    },
    // 显示私钥的方法
    toPrivateKey() {
      this.$refs.importPrivateKey.show(this.coin, this.source);
    },
    //显示助记词的方法
    toMnemonicCode() {
      this.$refs.importMnemonicCode.show(this.coin, this.source);
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
<style lang="scss" rel="stylesheet/scss" scoped>
@import "~assets/scss/variables";
// .import-wallet {
//   .top-btn {
//     width: 125px;
//     display: inline-block;
//     text-align: center;
//     padding: 8px 15px;
//     border: 1px solid #6e7f8d;
//     cursor: pointer;
//     &.select {
//       background-color: #6e7f8d;
//     }
//   }
//   .coin-type-select__main {
//     min-height: 200px;
//     .main-logo {
//       width: 80px;
//       height: 80px;
//       border-radius: 50%;
//       margin: 0 auto;
//     }
//   }
//   .btn {
//     padding-top: 10px;
//     padding-bottom: 10px;
//     margin-top: 30px;
//   }
// }
.import-wallet {
  .import-way {
    padding: 20px;
    font-size: 0.78rem;
    color: $font-color-light;
  }
  .van-cell {
    position: relative;
  }
}
.van-cell::before {
  content: "";
  display: block;
  width: 0.89rem;
  height: 0.78rem;
  background-image: url("../../../static/img/app/more.png");
  background-size: auto 0.78rem;
  position: absolute;
  right: 1.11rem;
  top: 50%;
  transform: translateY(-50%);
}
</style>
