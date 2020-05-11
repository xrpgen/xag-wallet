<template>
  <!-- 添加以太坊资产 -->
  <div class="assets-add">
    <van-search
      v-model="searchValue"
      :placeholder="$t('common.searchPlaceholder')"
      input-align="center"
      ref="searchRef"
    ></van-search>
    <pl-content-block :offsetTop="112">
      <div
        v-for="(asset, index) in filterBy(assets, searchValue, 'code') "
        :key="index"
        class="item-block assset-add-block"
      >
        <!-- <span>{{assets}}</span> -->
        <table style="width: 100%;table-layout: fixed;">
          <tr>
            <td width="40px">
              <span class="img-icon">
                <img v-if="asset.logo" :src="asset.logo" />
                <img
                  v-else
                  :src="`static/img/${asset.code}@3x.png`"
                  onerror="this.src='static/img/unknown.png'"
                />
              </span>
            </td>
            <td>
              <!-- <div class="text-ellipsis">
                <span>{{asset.code}}</span>
                <span v-if="asset.name" class="text-muted">
                  &nbsp;
                  {{asset.name}}
                </span>
              </div>
              <div v-if="asset.issuer">
                <pl-wallet-addr
                  class="small-font text-muted"
                  :complete="false"
                  :show-copy="false"
                  :address="asset.issuer"
                ></pl-wallet-addr>
              </div>-->
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
  computed: {
    listAsset() {
      let balances = this.$store.state.balances[
        this.$store.state.account.type + this.$store.state.account.address
      ];
      return balances.map(item => {
        return item.code;
      });
    }
  },
  methods: {
    init() {
      let account = this.$store.state.account;
      this.searchValue = "";
      this.curreAcctountAddress = account.address;
      this.type = account.type;
      this.assets = this.getAssets(account.type);
      console.log(this.assets);
    },
    getAssets(type) {
      let coin = coins[type];
      console.log(coin);
      let result = [
        {
          code: coin.symbol,
          canSelect: false,
          name: coin.displayName
        }
      ];

      let selectAssets = this.$collecitons.asset.findByAddressAndType(
        this.curreAcctountAddress,
        this.type
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
      console.log(asset);
      if (asset.selected) {
        // 保存数据库
        this.$collecitons.asset.insertAsset({
          type: this.type,
          address: this.curreAcctountAddress,
          code: asset.code,
          issuer: asset.issuer,
          name: asset.name
        });
        let aa = this.$collecitons.asset.getInstance();
        console.log(aa);
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
