<template>
  <!-- 地址簿 -->
  <div>
    <van-popup
      v-model="showPop"
      position="right"
      class="popup-wapper address-list"
      style="width:100%;"
      get-container="body"
    >
      <van-nav-bar :title="$t('setting.addressBook')" left-arrow @click-left="close">
        <span slot="left">
          <i>
            <img src="../wallet/img/back.png" alt />
          </i>
        </span>
        <span slot="right" @click="addAddress" class="text-primary normal-font">
          <i>
            <img src="../../../static/img/add-address.png" alt />
          </i>
        </span>
      </van-nav-bar>
      <!-- 搜索框 -->
      <!-- <search-input :searchStr="searchStr"></search-input> -->
      <!--    @keydown="hiddenIcon(searchStr)"
      @keyup="showIcon(searchStr)"-->
      <van-search
        class="input-search"
        :placeholder="$t('common.searchPlaceholder')"
        v-model="searchStr"
        input-align="center"
        ref="searchRef"
      />
      <pl-page-list
        :dataFun="dataFun"
        ref="list"
        :params="params"
        :offsetBottom="0"
        :offsetTop="112"
      >
        <template slot-scope="props">
          <van-row class="address-card" @click.native="toAddressDetail(props.item)">
            <van-col :span="3" class="address-card-col text-center">
              <span class="wallet-logo">
                <img :src="`static/img/${props.item.type}@3x.png`" />
                <!--<img :src="`static/img/tokens/${props.item.type}.png`" style="vertical-align: middle" width="20px" height="20px">-->
              </span>
            </van-col>
            <van-col :span="21" class="address-card-col">
              <p class="address-card-col-line normal-font">{{props.item.name}}</p>
              <pl-wallet-addr
                :address="props.item.value"
                :show-copy="false"
                :length="14"
                class="x-small-font text-muted address-card-col-line addr-block"
              ></pl-wallet-addr>
            </van-col>
          </van-row>
          <div class="van-hairline--bottom"></div>
        </template>
      </pl-page-list>
      <address-add ref="addressAdd" @done="onRefresh"></address-add>
    </van-popup>
    <address-detail ref="addressDetail" @done="onRefresh"></address-detail>
  </div>
</template>
<script>
import addressAdd from "./address-add";
import addressDetail from "./address-detail";
// import searchInput from "../ui/search-input";
export default {
  components: { addressAdd, addressDetail },
  data() {
    return {
      showPop: false,
      searchStr: "",
      accountType: "",
      handleFalg: "1" /*点击列表项标识，1-到详情，2-触发回调*/,
      params: {}
    };
  },
  watch: {
    searchStr: {
      handler: function(val, oldVal) {
        this.$refs.list.reload();
        if ((val.length && oldVal.length) || (val.length && !oldVal.length)) {
          this.hiddenIcon();
        } else if (!val.length) {
          this.showIcon();
        }
      }
    }
    // searchStr() {
    //   this.$refs.list.reload();
    // }
  },
  methods: {
    show(handleFalg, accountType) {
      this.searchStr = "";
      this.params = {};
      if (handleFalg) {
        this.handleFalg = handleFalg;
        this.accountType = accountType;
      }
      if (this.$refs.list) {
        this.$refs.list.onRefresh();
      }
      this.showPop = true;
    },
    close() {
      this.showPop = false;
    },
    addAddress() {
      let params = null;
      if (this.accountType) {
        params = {};
        params.type = this.accountType;
      }
      this.$refs.addressAdd.show(params);
    },
    toAddressDetail(addressInfo) {
      if (this.handleFalg === "1") {
        this.$refs.addressDetail.show(addressInfo);
      } else if (this.handleFalg === "2") {
        this.$emit("done", addressInfo);
        this.close();
      }
    },
    dataFun(params) {
      // params.searchStr = this.searchStr;
      // if (this.accountType) {
      //   params.searchStr = this.accountType;
      // }
      return this.$collecitons.address.findAddressByPages(params);
    },
    onRefresh() {
      this.$refs.list.onRefresh();
    },
    hiddenIcon() {
      this.$refs.searchRef.$children[0].$children[0].$children[0].$el.style.display =
        "none";
    },

    showIcon() {
      this.$refs.searchRef.$children[0].$children[0].$children[0].$el.style.display =
        "block";
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~assets/scss/_variables.scss";

.address-card {
  background: #fff;
  padding: 0px 0px 20px !important;
  border-bottom: 1px solid #f7f7f7;
  margin-left: 20px;
  margin-right: 20px;

  .address-card-col {
    height: 70px;
    line-height: 70px;
    position: relative;
    .address-card-col-line {
      height: 20px;
      line-height: 20px;
      &:first-child {
        margin-top: 22px;
      }
      &:last-child {
        margin-bottom: 15px;
      }
      &.addr-block {
        display: block;
      }
    }

    .wallet-logo {
      display: inline-block;
      width: 35px;
      height: 35px;
      /*border: 1px solid #e5e5e5;*/
      border-radius: 50%;
      line-height: 30px;
      text-align: center;
      margin-right: 5px;
      img {
        margin: 26px 0px;
        width: 35px;
        height: 35px;
      }
    }
  }
}
</style>
<style lang="scss" type="text/scss">
.addr-block {
  .address-text {
    width: 100%;
  }
}
.input-search {
  border-bottom: 1px solid #f7f7f7;
}
.address-list {
  .van-list {
    background-color: #fff;
  }
}
</style>
