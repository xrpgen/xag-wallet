<template>
  <div class="importType-wallet import-fw400">
    <van-popup
      v-model="showVpop"
      position="right"
      class="popup-wapper"
      style="width:100%;height: 100%;overflow: hidden"
    >
      <van-nav-bar :title="barTitle" @click-right="toScan" @click-left="close">
        <span slot="left">
          <i>
            <img src="./img/back.png" alt />
          </i>
        </span>
        <span slot="right">
          <i class="menu">
            <img style="width:1.11rem" src="../../../static/img/sao.png" alt />
          </i>
        </span>
      </van-nav-bar>
      <pl-content-block :offsetTop="46">
        <div>
          <wallet-text-area
            :tip="$t('wallet.recoverWalletTip')"
            v-model="form.memorizingWords"
            :type="'memorizingWords'"
          ></wallet-text-area>
        </div>
        <wallet-tip :tip="$t('wallet.exportWalletPwdTip')"></wallet-tip>
        <password-block v-model="form" ref="passwordBlock"></password-block>
        <button-bottom>
          <div class="bottom-tip text-primary">
            <van-icon name="question" style="vertical-align: middle" class="text-primary" />
            <span @click="viewHelp">{{$t('wallet.whatIsMnemonic')}}</span>
          </div>
          <!-- <div class="text-primary text-center" style="padding-bottom:10px;">
            <van-icon name="idcard" style="vertical-align: middle" class="text-primary" />&nbsp;&nbsp;
            <span @click="viewHelp" style="vertical-align: middle">{{bottomTip}}</span>
          </div>-->
          <van-button
            size="large"
            round
            type="primary"
            @click="importWallet"
            :text="$t('wallet.immediatelyImport')"
          ></van-button>
        </button-bottom>
      </pl-content-block>
    </van-popup>
    <help ref="help"></help>
  </div>
</template>
<script>
import createWallet from "./mixins/createWallet";
import help from "./components/help";
import passwordBlock from "./components/password-input-block";
import walletTextArea from "./components/wallet-textarea";
import walletTip from "./components/wallet-tip";
import buttonBottom from "./components/button-bottom";
import QRCodeScanner from "core/utils/QRCodeScanner.js";
import cryptor from "core/utils/cryptor";

export default {
  mixins: [createWallet],
  components: { help, passwordBlock, walletTextArea, walletTip, buttonBottom },
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
    onchangeTag(type) {
      this.resetForm();
      this.tagSelect = type;
    },
    viewHelp() {
      this.$refs.help.show("mnemonic");
    },
    toScan() {
      QRCodeScanner.scan(this).then(
        res => {
          if (res && res.address && res.address !== "") {
            this.form.memorizingWords = res.address;
          } else {
            this.$toast(this.$t("assets.scanFailTip"));
          }
        },
        errorMsg => {
          console.error(errorMsg);
          this.$toast(errorMsg);
        }
      );
    },
    checkFormFields() {
      // 校验表单
      if (this.form.walletPwd !== this.form.confirmWalletPwd) {
        this.$toast(this.$t("common.confirmPwdTip"));
        return false;
      }
      if (!this.form.walletPwd) {
        this.$toast(this.$t("common.notEmptyPwd"));
        return false;
      }
      if (this.form.walletPwd.length < 6) {
        this.$toast(this.$t("wallet.passwordLimitTip"));
        return false;
      }
      if (
        this.form.privateKey &&
        this.form.privateKey.length < 64 &&
        this.coin.type === "ethereum"
      ) {
        this.$toast(this.$t("wallet.invalidPrivateKeyTip"));
        return false;
      }
      if (
        this.form.memorizingWords &&
        this.form.memorizingWords.split(" ").length < 12
      ) {
        this.$toast(this.$t("wallet.invalidMnemonicCodeTip"));
        return false;
      }
      return true;
    },
    updateAccountState(hdWalletAccount) {
      // 更新账户状态
      const toast = this.$toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: "circular",
        message: this.$t("wallet.importing")
      });
      this.$collecitons.account.findAndUpdateAcct(
        { address: hdWalletAccount.address },
        account => {
          account.password = cryptor.encryptMD5(this.form.walletPwd);
          account.secret = cryptor.encryptAES(
            hdWalletAccount.secret,
            this.form.walletPwd
          );
          account.mnemonicCode = cryptor.encryptAES(
            this.form.memorizingWords,
            this.form.walletPwd
          );
          return (account.state = "N");
        }
      );
      setTimeout(() => {
        toast.clear();
        this.close();
        this.$emit("refreshAll");
      }, 1000);
    },
    importWallet() {
      if (!this.checkFormFields()) {
        return;
      }
      // 获取地址以判断钱包账户是否已经存在
      let hdWalletAccount = this.getHdWalletAccount(
        this.coin.type,
        this.form.memorizingWords,
        this.form.privateKey
      );
      if (hdWalletAccount) {
        let ga = this.$collecitons.account.findByAddressAndType(
          hdWalletAccount.address,
          hdWalletAccount.type
        );
        if (ga) {
          if (ga.state === "D") {
            // 删除重新导入则改变状态同时更新对应信息
            this.updateAccountState(hdWalletAccount);
          } else {
            this.$toast(this.$t("wallet.existWalletTip"));
          }
          return;
        }
      } else {
        this.$toast(this.$t("wallet.invalidMnemonicCodeTip"));
        return;
      }
      const toast = this.$toast.loading({
        duration: 0,
        forbidClick: true,
        loadingType: "circular",
        message: this.$t("wallet.importing")
      });
      // 保存数据库操作
      let mnemonicCodes = this.form.memorizingWords.split(" ");
      if (mnemonicCodes.length < 12) {
        this.$toast(this.$t("wallet.invalidMnemonicCodeTip"));
        return;
      }
      try {
        this.createWalletAcctByMnemonicCode(
          [this.coin.type],
          this.form.memorizingWords,
          this.form.walletPwd,
          this.source,
          true
        );
        setTimeout(() => {
          toast.clear();
          this.close();
          this.$emit("done");
        }, 1000);
      } catch (e) {
        if (e.toString().indexOf("Invalid mnemonic") >= 0) {
          this.$toast(this.$t("wallet.invalidMnemonicCodeTip"));
        }
        console.error(e);
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.import-wallet {
  .top-btn {
    width: 125px;
    display: inline-block;
    text-align: center;
    padding: 8px 15px;
    border: 1px solid #6e7f8d;
    cursor: pointer;
    &.select {
      background-color: #6e7f8d;
    }
  }
  .coin-type-select__main {
    min-height: 200px;
    .main-logo {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin: 0 auto;
    }
  }
  .btn {
    padding-top: 10px;
    padding-bottom: 10px;
  }
}
</style>
<style lang="scss" rel="stylesheet/scss">
.importType-wallet {
  .password-block {
    margin-top: 0;
  }
  .bottom-tip {
    text-align: center;
    position: absolute;
    bottom: 0.89rem;
    font-size: 0.67rem;
    line-height: 0.67rem;
    left: 50%;
    transform: translateX(-50%);
    span {
      margin-left: 0.28rem;
    }
  }
  .btn {
    margin-top: 2.22rem;
  }
  .wallet-textarea .textarea .van-cell-group {
    border-radius: 0;
  }
}
</style>
