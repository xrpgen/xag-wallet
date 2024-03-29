<template>
  <van-popup
    v-model="showPop"
    position="bottom"
    class="popup-wapper"
    style="width:100%;height: 100%;"
  >
    <van-nav-bar :title="$t('common.add')" @click-left="close">
      <span slot="left">
        <i>
          <img src="../../wallet/img/back.png" alt />
        </i>
      </span>
    </van-nav-bar>
    <van-cell-group class="margin-top shadow-bottom">
      <van-field
        maxlength="80"
        :placeholder="$t('assets.enterAssetCode')"
        clearable
        name="name"
        v-model="form.symbol"
        :label="$t('assets.assetCode')"
      />
      <van-field
        maxlength="80"
        :placeholder="$t('assets.enterAssetIssuer')"
        clearable
        name="symbol"
        v-model="form.issuer"
        :label="$t('assets.assetIssuer')"
      />
      <small
        class="text-danger padding-left"
        v-show="!symbolValid"
      >{{$t('assets.assetCodeRippleValid')}}</small>
      <small class="text-danger padding-left" v-show="assetExist">{{$t('assets.assetExit')}}</small>
      <small class="text-danger padding-left" v-show="!addressValid">{{$t('assets.addressValid')}}</small>
    </van-cell-group>
    <div class="single-btn" style="margin-top: 30px;">
      <van-button
        size="large"
        round
        :loading="loading"
        @click="saveToken"
        type="primary"
      >{{$t('common.save')}}</van-button>
    </div>
  </van-popup>
</template>
<script>
import coins from "src/wallet/coins";
import { AccountType } from "src/wallet/constants";
import tokens from "src/wallet/tokens";
import { realCode } from "src/wallet/util";
export default {
  data() {
    return {
      showPop: false,
      form: {
        symbol: "",
        issuer: "",
        decimals: "4"
      },
      symbolValid: true,
      addressValid: true,
      assetExist: false,
      loading: false
    };
  },
  watch: {
    "form.issuer"() {
      if (this.form.issuer) {
        this.addressValid = coins[AccountType.ripplexag].wallet.isValidAddress(
          this.form.issuer
        );
        this.isAssetExist();
      } else {
        this.addressValid = true;
      }
    },
    "form.symbol"() {
      if (this.form.symbol) {
        let re = /^([a-zA-Z0-9<>(){}[\]|?!@#$%^&*]{3}|[A-F0-9]{40}|drops)$/;
        let symbol = realCode(this.form.symbol);
        this.symbolValid = re.test(symbol);
        this.isAssetExist();
      } else {
        this.symbolValid = false;
      }
    }
  },
  computed: {
    errMsg() {
      return {
        "Contract source code not verified": this.$t(
          "assets.contractERC-20Valid"
        ) // valid ERC-20 token
      };
    }
  },
  methods: {
    show() {
      this.resetForm();
      this.showPop = true;
    },
    close() {
      this.showPop = false;
    },
    resetForm() {
      this.form.issuer = "";
      this.form.symbol = "";
    },
    isAssetExist() {
      if (!this.addressValid || !this.symbolValid) {
        return;
      }
      let tokens = coins[AccountType.ripplexag].tokens();
      let _form = this.form;
      let exist = false;
      Object.keys(tokens).forEach(key => {
        let token = tokens[key];
        token.assets.forEach(item => {
          if (
            item.code === _form.symbol &&
            item.issuer.toLocaleLowerCase() === _form.issuer.toLocaleLowerCase()
          ) {
            exist = true;
          }
        });
      });
      this.assetExist = exist;
    },
    saveAssetConfig() {
      // 对所有的账户进行合约绑定
      let assetConfig = {
        address: this.form.issuer,
        symbol: this.form.symbol,
        name: "",
        decimals: Number(this.form.decimals),
        type: AccountType.ripplexag
      };
      this.$collecitons.assetConfig.insertAssetConfig(assetConfig);
    },
    setTokens() {
      // 追加合约到内存
      let config = tokens.get(AccountType.ripplexag);
      config[this.form.symbol] = {
        name: "",
        logo: "",
        assets: [
          { code: this.form.symbol, issuer: this.form.issuer, list: true }
        ]
        //
        // symbol:  this.form.symbol,
        // name:  this.form.symbol,
        // displayName: this.form.symbol,
        // decimals: Number(this.form.decimals),
        // address: this.form.issuer.toLocaleLowerCase()
      };
      tokens.set(config);
    },
    saveToken() {
      if (!this.form.issuer) {
        this.$toast(this.$t("assets.addressValid"));
        return;
      }
      if (!this.form.symbol) {
        this.$toast(this.$t("assets.assetCodeTip"));
        return;
      }
      // 保存数据库操作
      this.loading = true;
      this.saveAssetConfig();
      this.setTokens();
      this.loading = false;
      this.$emit("reload");
      this.close();
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.padding-left {
  padding-left: 15px;
}
</style>
