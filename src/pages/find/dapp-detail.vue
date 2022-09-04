<template>
  <div style="height: 100%;width: 100%;" position="right" :overlay="true">
    <van-nav-bar :title="data.title" @click-left="close">
      <span slot="left"><i class="ultfont ult-left"></i></span>
    </van-nav-bar>

    <pl-content-block :offsetTop="46">
      <div class="new-adv-detail" v-if="data.content">
        <div class="froala-editor">
          <div v-append="data.content" @appended="appended"></div>
        </div>
        <div class="text-right" style="color: #999999">{{ data.modified | date('YYYY-MM-DD') }}</div>
      </div>
      <div v-else class="news-loading">
        <van-loading />
      </div>
    </pl-content-block>
    <send-transaction ref="sendTransaction"></send-transaction>
  </div>
</template>
<script>
import sendTransaction from "./transaction/send-transaction";
export default {
  name: "dapp-detail",
  components: {
    sendTransaction,
  },
  data() {
    return {
      data: {
        title: "",
        content: "",
      },
      curVersionCode: "1.0.1",
    };
  },
  created() {
    if (!(window.cordova && window.cordova.getAppVersion)) {
      this.curVersionCode = "1.0.1";
      let item = this.$route.params.item;
      this.show(item);
    } else {
      window.cordova.getAppVersion.getVersionNumber().then(version => {
        this.curVersionCode = version;
        let item = this.$route.params.item;
        this.show(item);
      });
    }
  },
  mounted() {
    let _this = this;
    document.body.addEventListener("click", function () {
      let target = event.target || event.srcElement;
      if (target.nodeName.toLocaleLowerCase() == "a") {
        let url = target.getAttribute("href");
        if (url.indexOf("XSEND://") > -1) {
          if (event.preventDefault) {
            event.preventDefault();
          } else {
            window.event.returnValue = true;
          }
          let replaceUrl = url.replace(/^XSEND?:\/\//,'');
          let urlArr = replaceUrl.split(":");
          console.log(urlArr);
          let asset = {};
          if (urlArr[3] == "") {
            asset.code = urlArr[0] == "ripple"
            ? "XRP"
            : "XAG";
          } else {
            asset.code = urlArr[2];
            asset.issuer = urlArr[3];
          }
          console.log(urlArr);
          let tag = urlArr[5];
          let msg = urlArr[6];
          let address = urlArr[4];
          let transferAmt = urlArr[1];
          _this.$refs.sendTransaction.show(
            asset,
            address,
            transferAmt,
            tag,
            msg,
          );
          return false;
        }
      }
    });
  },
  methods: {
    appended() {
      console.log("appended!");
    },
    parseParams(uri, params) {
      const paramsArray = [];
      Object.keys(params).forEach(key => params[key] && paramsArray.push(`${key}=${params[key]}`));
      if (uri.search(/\?/) === -1) {
        uri += `?${paramsArray.join("&")}`;
      } else {
        uri += `&${paramsArray.join("&")}`;
      }
      return uri;
    },
    show(item) {
      this.data = {
        title: item.title || "",
        content: ""
      };
      let lang;
      if (this.$store.state.setting.language == "zh-CN") {
        lang = "cn";
      } else if (this.$store.state.setting.language == "ja-JP") {
        lang = "jp";
      } else {
        lang = "en";
      }
      let uri = item.link;
      let params = {
        name: "idapp",
        address: this.$store.state.account.address,
        lang: lang,
        client: this.curVersionCode,
        time: new Date().getTime(),
      };
      if (this.$store.state.account.type == "ripple") {
        params.network = "ripple";
      } else {
        params.network = "xrpgen";
      }
      let url = this.parseParams(uri, params);
      this.$api.getUrl(url).then(resp => {
        this.data.content = resp;
      }).catch(() => {
        this.data.content = "error";
      });
    },
    close() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/less">
@import "~assets/scss/_variables.scss";

.news-loading {
  position: relative;
  top: 45%;
  left: 45%;
  padding: 10px;
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.5);
  width: 50px;
  height: 50px;
}
</style>
