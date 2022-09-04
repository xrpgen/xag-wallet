<template>
  <pl-content-block :offsetTop="44" :offsetBottom="50">
    <div class="application">
      <van-card
        @click.native="to(item)"
        class="item-block"
        style="border-bottom:0px"
        v-for="(item, index) in datas"
        :key="index"
      >
        <template v-if="item.isDapp">
          <div slot="title" class="card-title" style="margin: auto;">
            <div class="normal-font">{{item.title}}</div>
          </div>
          <div slot="thumb">
            <img :src="item.imgUrl" width="60" height="60" />
          </div>
          <div slot="footer">
            <span></span>
          </div>
        </template>
        <template v-else>
          <div slot="title" class="card-title" style="margin: auto;">
            <div class="normal-font">{{item.title}}</div>
          </div>
          <div slot="thumb">
            <img :src="item.imgUrl" width="60" height="60" />
          </div>
          <div slot="footer">
            <span></span>
          </div>
        </template>
      </van-card>
    </div>
  </pl-content-block>
</template>
<script>
import customerBrowser from "core/utils/customerBrowser";
import dappDetail from "./dapp-detail";

export default {
  props: {
    datas: Array
  },
  components: {
    dappDetail,
  },
  data() {
    return {};
  },
  methods: {
    to(item) {
      if (item.isDapp == true) {
        this.$router.push({name: 'dapp-detail', params: {item: item}});
      } else {
        customerBrowser.open(item.title, item.link);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~assets/scss/_variables.scss";
.application {
  margin-top: 15px;
  background: $main-background-color;
}
</style>
<style lang="scss">
@import "~assets/scss/_variables.scss";
.application {
  .van-card {
    display: flex;
    background: #fff;
    padding: 5px 15px 5px;
    border-radius: $border-radius;
    .van-card__thumb {
      display: flex;
      display: -webkit-flex;
      align-items: center;
    }
  }
  .card-title {
    margin-top: 10px;
  }
  .van-card__thumb {
    left: 5px;
  }
  .van-card__footer span {
    display: block;
    width: 0.89rem;
    height: 0.78rem;
    // background-color: pink;
    background-image: url("../../../static/img/app/more.png");
    background-size: auto 0.78rem;
  }
  .van-card__footer {
    right: 1.11rem;
    top: 50%;
    // transform: translateY(-50%);
    bottom: 2.22rem;
    flex-direction: column-reverse;
    padding-top: 38px;
    flex: 1;
    div {
      float: right;
      padding-right: 20px;
    }
  }
}
</style>
