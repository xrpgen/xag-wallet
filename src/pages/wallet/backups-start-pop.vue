<template>
  <div class="backups-wallet">
    <van-popup
      v-model="showVpop"
      position="right"
      class="popup-wapper"
      style="width:100%;height: 100%;;overflow: hidden"
    >
      <van-nav-bar @click-left="close">
        <span slot="left">
          <i>
            <img src="./img/back.png" alt />
          </i>
        </span>
      </van-nav-bar>
      <pl-content-block :offsetTop="46">
        <!--头部信息-->
        <content-block>
          <top-block :title="$t('wallet.backWallet')">
            <img src="static/img/back-up@3x.png" width="64" height="64" />
          </top-block>
        </content-block>
        <!--提示信息-->
        <div class="tip item-block">
          <div
            style="padding: 15px;line-height: 1.5rem;"
            class="text-tip-color big-font text-center"
          >
            <p class="text-center">
              <img src="static/img/important-tip@3x.png" alt />
              <span class="text-primary text-center" v-text="$t('wallet.importTip')"></span>
            </p>
            <span class="sn-font" v-text="$t('wallet.backWalletTip')"></span>
          </div>
        </div>
        <!--按钮部分-->
        <button-bottom>
          <div style="margin-bottom: 17px" class="text-center">
            <span>
              <van-icon name="info-o" class="vertical-align-middle text-primary" />
            </span>
            <span class="small-font">&nbsp;{{$t('wallet.backWalletTip2')}}</span>
          </div>
          <van-button
            size="large"
            round
            type="primary"
            @click="checkPassword"
            :text="$t('wallet.backWallet')"
          ></van-button>
        </button-bottom>
      </pl-content-block>
    </van-popup>
    <select-memorizing-language ref="selectML"></select-memorizing-language>
  </div>
</template>
<script>
import SelectMemorizingLanguage from './select-memorizing-language';
import topBlock from "./components/top-block";
import contentBlock from "./components/content-block";
import buttonBottom from "./components/button-bottom";
export default {
  components: {
    SelectMemorizingLanguage,
    topBlock,
    contentBlock,
    buttonBottom
  },
  data() {
    return {
      showVpop: false,
      passwordFlag: true,
      mnemonicCode: "",
      source: "",
      accountTypes: []
    };
  },
  methods: {
    show(password, passwordFlag = true, source, accountTypes) {
      /* 备份成功之后把手机设备返回按钮禁用 */
      // window.canBack = false;
      this.passwordFlag = passwordFlag;
      this.password = password;
      this.source = source;
      this.accountTypes = accountTypes;
      this.showVpop = true;
    },
    close() {
      this.showVpop = false;
    },
    checkPassword() {
      this.toBackups(this.password);
    },
    toBackups(password) {
      // cryptor.decryptAES(this.$store.state.account.mnemonicCode, password)
      this.$refs.selectML.show(null, password, 'create', this.source, this.accountTypes);
    }
  },
  created() {
    /* let params = this.$route.params;
      if (params && params.showVpop) {
        // window.canBack = false;
        // this.showVpop = true;
      } */
  }
};
</script>
<style  lang="scss" rel="stylesheet/scss" scoped>
@import "~assets/scss/variables";
.backups-wallet {
  position: relative;
  .vertical-align-middle {
    vertical-align: middle;
  }
  .item {
    margin-right: 15px;
    margin-left: 15px;
  }
  .tip {
    position: relative;
    top: 1rem;
    background: $main-background-color;
    p {
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 1rem;
        margin-right: 0.28rem;
      }
    }
  }
  .btn {
    margin-top: 9rem;
  }
  span.small-font {
    color: #838383;
  }
}
</style>
