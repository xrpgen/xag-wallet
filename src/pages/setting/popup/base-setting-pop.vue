<template>
  <div style="width: 100%;">
    <van-popup
      position="right"
      class="popup-wapper bt-border"
      style="width:100%;height: 100%;"
      v-model="showPop"
    >
      <van-nav-bar :title="$t('setting.settings')" @click-left="goBack">
        <span slot="left">
          <i>
            <img src="../../wallet/img/back.png" alt />
          </i>
        </span>
      </van-nav-bar>
      <div class="item-block">
        <van-cell-group :border="false">
          <van-cell
            class="arrow"
            :title="$t('setting.networkSettings')"
            @click="toNetworkSettings"
          />
          <van-cell :title="$t('setting.gestureCipher')">
            <van-switch v-model="gesture" size="20px" />
          </van-cell>
          <van-cell :title="$t('setting.privacyMode')">
            <van-switch v-model="privacyMode" size="20px" />
          </van-cell>
        </van-cell-group>
      </div>

      <div style="position: fixed;bottom: 0;width: 100%;">
        <div class="single-btn margin-top margin-bottom">
          <van-button
            size="large"
            round
            type="primary"
            @click="toLogout()"
            :text="$t('setting.logout')"
          ></van-button>
        </div>
      </div>
    </van-popup>
    <van-dialog v-model="showDialog" @confirm="logout" show-cancel-button>
      <div class="text-center" style="margin-top: 20px;margin-bottom:10px">
        <van-icon
          name="warn"
          class="text-danger x-x-large-font"
          style="vertical-align: middle"
        />
      </div>
      <div style=" font-size: 1rem;" class="text-center">
        {{ $t("common.tip") }}
      </div>
      <div
        v-text="$t('setting.logoutTip')"
        class="text-center"
        style="color: #666;padding:20px 25px 20px;font-size:14px;line-height:1.5"
      ></div>
    </van-dialog>
    <gesture-pwd-pop ref="gesturePwdPop"></gesture-pwd-pop>
    <network-setting ref="networkSetting"></network-setting>
  </div>
</template>
<script>
import gesturePwdPop from "./gesture-pwd-pop.vue";
import networkSetting from "./network-setting-pop";
export default {
  components: {
    gesturePwdPop,
    networkSetting
  },
  data() {
    return {
      showPop: false,
      showDialog: false
    };
  },
  computed: {
    gesture: {
      get() {
        let gesturePwd = this.$store.state.setting.gesturePwd;
        return gesturePwd !== "";
      },
      set(val) {
        this.$refs.gesturePwdPop.show(!val);
      }
    },
    privacyMode: {
      get() {
        let privacyMode = this.$store.state.setting.privacyMode;
        return privacyMode;
      },
      set(val) {
        this.$store.dispatch("setPrivacyMode", val);
      }
    }
  },
  methods: {
    show() {
      this.showPop = true;
    },
    goBack() {
      this.showPop = false;
    },
    toNetworkSettings() {
      this.$refs.networkSetting.show();
    },
    clearData() {
      this.$collecitons.identity.getInstance().clear();
      this.$collecitons.account.getInstance().clear();
      this.$collecitons.address.getInstance().clear();
      this.$collecitons.setting.getInstance().clear();
      this.$collecitons.history.getInstance().clear();
    },
    toLogout() {
      this.showDialog = true;
    },
    logout() {
      this.clearData();
      this.$store.dispatch("setDefaultAddress", "");
      this.$store.dispatch("setPasswordMap", null);
      this.$store.dispatch("initData");
      this.$router.push({ name: "guide" });
      /*this.$dialog.confirm({
          title: this.$t('common.tip'),
          message: this.$t('setting.logoutTip')
        }).then(() => {
          this.clearData();
          this.$store.dispatch('setDefaultAddress', '');
          this.$store.dispatch('setPasswordMap', null);
          this.$store.dispatch('initData');
          this.$router.push({name: 'guide'});
        });*/
    }
  }
};
</script>
<style lang="scss" scoped>
.arrow.van-cell {
  position: relative;
}
.arrow.van-cell::before {
  content: "";
  display: block;
  width: 0.89rem;
  height: 0.78rem;
  // background-color: pink;
  background-image: url("../../../../static/img/app/more.png");
  background-size: auto 0.78rem;
  position: absolute;
  right: 1.11rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 999;
}
</style>
