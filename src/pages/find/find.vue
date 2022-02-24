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
// import news from './news';
import applicationItem from "./application-item";
export default {
  name: "news-adv",
  components: { applicationItem },
  data() {
    return {
      active: 0
    };
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
      return [
        // {
        //   title: "Etherscan",
        //   subTitle: this.$t("find.ethBlockBrowser"),
        //   desc: this.$t("find.ethDeveloped"),
        //   link: "https://cn.etherscan.com",
        //   imgUrl: "static/img/app/Etherscan.png"
        // },
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
        } /* 
          {
            title: this.$t('find.xmlTitle'),
            subTitle: this.$t('find.xmlSubTitle'),
            desc: this.$t('find.xmlDesc'),
            link: 'https://steexp.com/',
            imgUrl: 'static/img/XLM@3x.png'
          },
          {
            title: this.$t('find.xrpMarketTitle'),
            subTitle: this.$t('find.xrpMarketSubTitle'),
            desc: this.$t('find.xrpMarketDesc'),
            link: 'http://ripple.stellar.chat/#/',
            imgUrl: 'static/img/XRP@3x.png'
          }, 
          {
            title: this.$t('find.u919Title'),
            subTitle: this.$t('find.u919SubTitle'),
            desc: this.$t('find.u919Desc'),
            link: 'http://xlmyun.com:666/#!/track',
            imgUrl: 'static/img/app/u919.png'
          },
          {
            title: 'Fomo3D',
            subTitle: this.$t('find.fomo3DSubTitle'),
            desc: this.$t('find.fomo3DDsc'),
            link: 'http://exitscam.me',
            imgUrl: 'static/img/app/Fomo3D.png'
          }*/
      ];
    },
    application() {
      return [
        // {
        //   title: "Etherscan",
        //   subTitle: this.$t("find.ethBlockBrowser"),
        //   desc: this.$t("find.ethDeveloped"),
        //   link: "https://cn.etherscan.com/",
        //   imgUrl: "static/img/app/Etherscan.png"
        // },
        {
          title: this.$t("find.xrpTitle"),
          subTitle: this.$t("find.xrpSubTitle"),
          desc: this.$t("find.xrpDesc"),
          link: "https://xrpscan.com",
          imgUrl: "static/img/XRP@3x.png"
        }
        /* {
            title: this.$t('find.xrpMarketTitle'),
            subTitle: this.$t('find.xrpMarketSubTitle'),
            desc: this.$t('find.xrpMarketDesc'),
            link: 'http://ripple.stellar.chat/#/',
            imgUrl: 'static/img/XRP@3x.png'
          }, */
      ];
    },
    game() {
      return [
        {
          title: this.$t("find.xrpTitle"),
          subTitle: this.$t("find.xrpSubTitle"),
          desc: this.$t("find.xrpDesc"),
          link: "https://xrpscan.com",
          imgUrl: "static/img/XRP@3x.png"
        }
      ];
    }
  },
  methods: {},
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
