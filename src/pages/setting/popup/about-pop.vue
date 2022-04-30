<template>
  <van-popup
    v-model="showVpop"
    position="bottom"
    class="popup-wapper"
    style="height: 100%;width: 100%;"
  >
    <van-nav-bar left-arrow :title="$t('setting.aboutUs')" @click-left="close">
      <span slot="left">
        <i>
          <img src="../../wallet/img/back.png" alt />
        </i>
      </span>
    </van-nav-bar>

    <div class="top-container text-center">
      <img :src="dprImg(`logo1.png`)" style="width: 4.28rem;padding-bottom: 0.78rem;" alt="Logo" />
      <p>{{$t('setting.appName')}}</p>
      <p>v&nbsp;{{curVersionCode}}</p>
      <p class="deep-gray-text margin-top">{{$t('setting.walletDesc')}}</p>
    </div>

    <van-cell-group class="margin-top item-block">
      <van-cell :title="$t('setting.newVersion')" @click.native="showUpdateDialog">
        <span v-if="versionCode && versionCode !== ''">
          <span class="new-dot deep-gray-text"></span>
          &nbsp;v{{versionCode}}
        </span>
        <span class="deep-gray-text" v-else>{{$t('setting.latestVersion')}}</span>
      </van-cell>
      <van-cell :title="$t('setting.officialNetwork')" @click.native="toOfficialNet">
        <span class="text-primary">https://xrpgen.com</span>
      </van-cell>
    </van-cell-group>
    <update-dialog :check-update-url="updateUrl" :auto-show="false" ref="updateDialog"></update-dialog>
  </van-popup>
</template>
<script>
import updateDialog from "../../ui/update-dialog.vue";
import config from "../../../config.js";
export default {
  data() {
    return {
      showVpop: false,
      versionCode: "",
      updateUrl: config.newUpdateUrl,
      curVersionCode: "1.0.1"
    };
  },
  components: {
    updateDialog
  },
  methods: {
    close() {
      this.showVpop = false;
    },
    show() {
      this.showVpop = true;
    },
    showUpdateDialog() {
      this.$refs.updateDialog.showUpdateDialog();
    },
    toOfficialNet() {
      window.location.href = config.officialWebsite;
    }
  },
  created() {
    this.$api.checkUpdate(this.updateUrl).then(newVersionInfo => {
      this.versionCode = newVersionInfo.version.toString();
    });
    if (!(window.cordova && window.cordova.getAppVersion)) {
      return;
    }
    window.cordova.getAppVersion.getVersionNumber().then(version => {
      this.curVersionCode = version;
    });
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.top-container {
  padding: 1.67rem 0;
}
.new-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 100%;
  background: red;
}
.van-popup {
  .top-container img {
    display: block;
    margin: 0 auto;
  }
  .top-container p {
    margin-bottom: 0.44rem;
    font-size: 0.72rem;
    &:nth-of-type(3) {
      margin-top: 0.94rem;
    }
  }
  .item-block.margin-top {
    margin-top: 0.78rem;
  }
}
</style>
