<template>
  <div class="full-page guide-main">
    <!--<van-nav-bar
      class="no-border"
    @click-right="$router.push({name: 'register'})"/>-->
    <!--<div style="height: 46px;"></div>-->
    <div class="margin-top">
      <van-cell @click="toSetLanguage" style="background: transparent;">
        <span slot="title"></span>
        <span class="text-tip-color">{{languages[$store.state.setting.language]}}</span>
        <i>
          <img width="10" style="margin-left:6px" src="../../../static/img/check-language.png" alt />
        </i>
      </van-cell>
    </div>
    <div class="guide-img">
      <img src="static/img/guide@3.png" />
    </div>
    <!--<div class="text-primary text-center guide-middle">
      <span>简单</span>
      <span class="dolt">•</span>
      <span>便捷</span>
      <span class="dolt">•</span>
      <span>安全</span>
    </div>

    <div class="text-center big-font guide-middle-text text-tip-color" v-html="$t('wallet.guideTip')"></div>-->
    <div class="guide-container">
      <van-button
        size="large"
        @click="createWallet"
        :loading="loading"
        type="primary"
        :text="$t('wallet.createWallet')"
      ></van-button>
      <br />
      <br />
      <van-button
        size="large"
        @click="toRecoveryWallet"
        class="border-color text-white bg-color"
        :loading="loading"
        :text="$t('wallet.recoverWallet')"
      ></van-button>
    </div>
    <div class="text-center text-tip-color guide-protocol-text">
      {{ $t("wallet.guideText") }}&nbsp;
      <span
        @click="showUserProtocol"
        class="text-color"
      >{{$t("wallet.guideProto")}}</span>
    </div>
    <coin-type-select ref="coinTypeSelect"></coin-type-select>
    <user-protocol ref="userProtocol"></user-protocol>
    <language-setting ref="languageSetting"></language-setting>
  </div>
</template>

<script>
import config from "src/config";
import coinTypeSelect from "../wallet/account-type-select-pop";
import languageSetting from "../setting/popup/language-setting-pop";
import userProtocol from "../ui/user-protocol.vue";
import constants from "src/core/constants";

export default {
  components: { coinTypeSelect, userProtocol, languageSetting },
  data() {
    return {
      loading: false,
      languages: constants.languages
    };
  },
  methods: {
    createWallet() {
      this.$refs.coinTypeSelect.show("1");
    },
    toRecoveryWallet() {
      this.$refs.coinTypeSelect.show("2");
    },
    go() {
      this.$router.push(config.defaultRoute());
    },
    showUserProtocol() {
      this.$refs.userProtocol.showPopup();
    },
    toSetLanguage() {
      this.$refs.languageSetting.show();
    }
  },
  created() {}
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "~assets/scss/variables";
.guide-main {
  background: url("img/guide-bg.png") no-repeat center 0;
  background-size: 100% 100%;
  position: relative;
  .guide-img {
    width: 15rem;
    margin: 5rem auto 0px;
    text-align: center;
    img {
      height: 4.67rem;
    }
  }
  .guide-middle {
    margin-top: 3rem;
    font-size: 1.375rem;
    .dolt {
      margin-right: 10px;
      margin-left: 10px;
    }
  }
  .guide-middle-text {
    margin-top: 1rem;
  }
  .guide-container {
    margin-top: 4.5rem;
    padding: 1.11rem 2.44rem 1.5rem 2.44rem;
    .logo {
      margin: 40px auto;
      width: 60px;
      height: 60px;
      border-radius: 5px;
      text-align: center;
      line-height: 58px;
      font-size: 18px;
    }
    .link {
      line-height: 44px;
    }
    .border-color {
      border-color: #7c8590;
    }
    .bg-color {
      background-color: #929ca5;
    }
  }
  .guide-protocol-text {
    // margin-top: 3.5rem;
    font-size: 12px;
  }
  .margin-top {
    margin-top: 51px;
  }
  .guide-container button {
    border-radius: 0.28rem;
  }
  span.text-color {
    color: #00a6da;
  }
}
</style>
