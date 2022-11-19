<template>
  <div style="width: 100%;" class="news-container">
    <!-- <van-nav-bar
      :title="$t('news.discovery')"
      :left-arrow="false">
    </van-nav-bar>-->
    <!--<application></application>-->
    <p class="head-title">发现</p>
    <van-tabs v-model="active" sticky swipeable style="z-index: 1" :line-width="35">
      <van-tab :title="$t('common.whole')">
        <application-item :datas.sync="all"></application-item>
      </van-tab>
      <van-tab :title="$t('find.application')">
        <application-item :datas.sync="application"></application-item>
      </van-tab>
      <van-tab :title="$t('find.game')">
        <application-item :datas.sync="game"></application-item>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import applicationItem from "./application-item";
export default {
  name: "news-adv",
  components: {
    applicationItem,
  },
  data() {
    return {
      active: 0,
      dappList: [],
    };
  },
  mounted() {
    this.getDappList(this.$store.state.setting.language);
  },
  watch: {
    "$store.state.setting.language": function(val) {
      this.dappList = [];
      this.getDappList(val);
    },
    "$store.state.updateDappTime": function() {
      this.dappList = [];
      this.getDappList(this.$store.state.setting.language);
    },
  },
  computed: {
    type() {
      if (this.active === 0) {
        return "all";
      } else if (this.active === 1) {
        return "tool";
      } else if (this.active === 2) {
        return "game";
      } else if (this.active === 3) {
        return "exchange";
      }
      return "";
    },
    all() {
      let arr = [
        {
          title: this.$t("find.xrpTitle"),
          subTitle: this.$t("find.xrpSubTitle"),
          desc: this.$t("find.xrpDesc"),
          link: "https://xrpscan.com/",
          imgUrl: "static/img/XRP@3x.png"
        },
        {
          title: this.$t("find.xagTitle"),
          subTitle: this.$t("find.xagSubTitle"),
          desc: this.$t("find.xagDesc"),
          link: "https://scan.xrpgen.com/",
          imgUrl: "static/img/XAG@3x.png"
        },
      ];
      return [...arr, ...this.dappList];
    },
    application() {
      return this.dappList.filter(item => {
        return item.type == "app";
      });
    },
    game() {
      return this.dappList.filter(item => {
        return item.type == "game";
      });
    },
  },
  methods: {
    getDappList(language) {
      let lang;
      if (language == "zh-CN") {
        lang = "cn";
      } else if (language == "ja-JP") {
        lang = "jp";
      } else {
        lang = "en";
      }
      this.$api.getDapp().then(res => {
        let dapp = [];
        for (let index in res) {
          let isDapp = typeof res[index].isDapp == "undefined" 
            ? true
            : res[index].isDapp;
          let obj = {
            title: res[index].name[lang],
            subTitle: "",
            desc: "",
            link: res[index].url,
            imgUrl: res[index].logo,
            isDapp: isDapp,
            type: res[index].type,
          };
          dapp.push(obj);
        }
        this.dappList = dapp;
      });
    },
  },
  activated() {
    this.active = 0;
  }
};
</script>
<style lang="scss">
@import "~assets/scss/_variables.scss";
.news-container {
  position: relative;
  height: 1000px;
  .van-tab--active {
    background: #fff;
    color: #4abbe7;
  }
  .van-tabs__line {
    background-color: $primary-color;
  }
  .head-title {
    height: 2.67rem;
    line-height: 2.67rem;
    background: #fff;
    padding: 0 1.11rem;
    font-size: 1.22rem;
    font-weight: 500;
    margin: 0;
  }
  .van-tabs__nav {
    display: inline-block;
  }
  .van-tab {
    float: left;
    font-size: 0.78rem;
    padding: 0 20px;
    &.van-tab--active {
      font-size: 0.94rem;
    }
  }
  .van-tabs__nav {
    width: 100%;
  }
  .van-hairline--top-bottom::after {
    border-width: 0px;
  }
  .item-block {
    margin: 0px;
    border-radius: 0px;
    box-shadow: none;
    -webkit-box-shadow: none;
  }
  .application .van-card {
    padding-bottom: 0px;
    padding-right: 0px;
  }
  .van-card__content {
    border-bottom: 1px solid #fbfbfb;
    box-shadow: 0px 0px 0px 0px transparent, 0px 0px 0px 0px transparent,
      0px 0px 0px 0px transparent, 0px 1px 0px 0px #f7f7f7;
  }
}
</style>
