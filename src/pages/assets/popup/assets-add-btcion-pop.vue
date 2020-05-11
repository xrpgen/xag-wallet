<template>
  <div>
    <van-search
      v-model="searchValue"
      :placeholder="$t('common.searchPlaceholder')"
      ref="searchRef"
      input-align="center"
    ></van-search>
    <pl-content-block :offsetTop="112">
      <div
        v-for="(asset, index) in filterBy(assets, searchValue, 'code') "
        :key="index"
        class="item-block assset-add-block"
      >
        <table style="width: 100%;table-layout: fixed;">
          <tr>
            <td width="40px">
              <span class="img-icon">
                <img v-if="asset.logo" :src="asset.logo" />
                <img v-else :src="`static/img/${asset.code}@3x.png`" />
              </span>
            </td>
            <td>
              <div class="text-ellipsis">
                <span>{{asset.code}}</span>
              </div>
              <div v-if="asset.name" class="text-ellipsis text-muted">{{asset.name}}</div>
            </td>
            <td width="50">
              <van-switch
                v-if="asset.canSelect"
                size="25px"
                v-model="asset.selected"
                @change="changeAssets(asset)"
              />
            </td>
          </tr>
        </table>
      </div>
    </pl-content-block>
  </div>
</template>
<script>
import coins from "src/wallet/coins";
import asset from "../mixns/asset";
import hidden from "../mixns/hidden-icon";
export default {
  mixins: [asset, hidden],
  data() {
    return {
      searchValue: "",
      assets: {},
      curreAcctountAddress: ""
    };
  },
  // created () {
  //   this.init();
  // },
  methods: {
    init() {
      let account = this.$store.state.account;
      this.curreAcctountAddress = account.address;
      this.type = account.type;
      this.assets = this.getAssets(account.type);
    },
    getAssets(type) {
      let coin = coins[type];
      let result = [
        {
          code: coin.symbol,
          canSelect: false
        }
      ];

      let selectAssets = this.$collecitons.asset.findByAddress(
        this.curreAcctountAddress
      );
      let selectAssetsCode = selectAssets
        .map(item => {
          return item.code;
        })
        .join(",");

      let configAssets = this.getConfigAssets(type);
      configAssets.forEach(token => {
        let selected = selectAssetsCode.indexOf(token.code) !== -1;
        let item = { ...token, canSelect: true, selected: selected };
        result.push(item);
      });
      return result;
    },
    changeAssets(asset) {
      if (asset.selected) {
        // 保存数据库
        this.$collecitons.asset.insertAsset({
          type: this.type,
          address: this.curreAcctountAddress,
          code: asset.code,
          issuer: asset.issuer,
          name: asset.name
        });
      } else if (asset.selected === false) {
        // 从数据库中移除
        let option = { code: asset.code, address: this.curreAcctountAddress };
        this.$collecitons.asset.removAssetByAddressAndName(option);
      }
      this.$store.dispatch("setBalances", this.curreAcctountAddress);
    }
  }
};
</script>
<style  lang="scss" rel="stylesheet/scss" scoped>
.assset-add-block {
  padding-left: 20px;
  padding-top: 23px;
  padding-bottom: 23px;
}
</style>
