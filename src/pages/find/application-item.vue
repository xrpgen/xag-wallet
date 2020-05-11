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
        <!-- <div class="arrow-right">
          <a href>
            <span>11</span>
          </a>
        </div>-->
        <div slot="title" class="card-title">
          <div class="normal-font">{{item.title}}</div>
          <div class="small-font text-ellipsis text-main">{{item.subTitle}}</div>
        </div>

        <div slot="thumb">
          <img :src="item.imgUrl" width="60" height="60" />
        </div>
        <div slot="desc" class="text-muted">{{item.desc}}</div>
        <!--<div slot="footer" style="position: relative;top: -35px;">
          <van-icon name="arrow"></van-icon>
        </div>-->
        <div slot="footer">
          <!-- <a :href="item.link"></a> -->
          <span></span>
        </div>
      </van-card>
    </div>
  </pl-content-block>
</template>
<script>
import customerBrowser from "core/utils/customerBrowser";
export default {
  props: {
    datas: Array
  },
  data() {
    return {};
  },
  methods: {
    to(item) {
      customerBrowser.open(item.title, item.link);
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
