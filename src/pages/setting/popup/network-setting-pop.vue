<template>
  <van-popup
    v-model="showPop"
    position="right"
    class="popup-wapper"
    style="width:100%;height: 100%;"
  >
    <van-nav-bar
      :title="$t('setting.networkSettings')"
      @click-left="close"
      @click-right="onClickRight"
    >
      <span slot="left">
        <i>
          <img src="../../wallet/img/back.png" alt />
        </i>
      </span>
      <span slot="right" class="normal-font text-primary" v-text="$t('common.save')"></span>
    </van-nav-bar>
    <pl-content-block :offsetTop="46">
      <div class="padding">Xrpalike Gene</div>
      <div class="item-block">
        <van-radio-group v-model="ripplexag">
          <van-cell-group :border="false">
            <van-cell
              :key="index"
              v-for="(item, index) in $store.state.network.ripplexag"
              @click="ripplexag = item.value"
            >
              <van-row>
                <van-col span="20">
                  {{item.value}}
                  <span v-if="item.type === 'public'">
                    &nbsp;
                    <van-tag round class="tag">public</van-tag>
                  </span>
                </van-col>
                <van-col span="4" class="text-right">
                  <van-radio :name="item.value" />
                </van-col>
              </van-row>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
      <div class="padding">Ripple</div>
      <div class="item-block">
        <van-radio-group v-model="ripple">
          <van-cell-group :border="false">
            <van-cell
              :key="index"
              v-for="(item, index) in $store.state.network.ripple"
              @click="ripple = item.value"
            >
              <van-row>
                <van-col span="20">
                  {{item.value}}
                  <span v-if="item.type === 'public'">
                    &nbsp;
                    <van-tag round class="tag">public</van-tag>
                  </span>
                </van-col>
                <van-col span="4" class="text-right">
                  <van-radio :name="item.value" />
                </van-col>
              </van-row>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
      <!-- <div class="padding">Ethereum</div>
      <div class="item-block">
        <van-radio-group v-model="ethereum">
          <van-cell-group :border="false">
            <van-cell
              :key="index"
              v-for="(item, index) in $store.state.network.ethereum"
              @click="ethereum = item.value"
            >
              <van-row>
                <van-col span="20">
                  {{item.value}}
                  <span v-if="item.type === 'public'">
                    &nbsp;
                    <van-tag round class="tag">public</van-tag>
                  </span>
                </van-col>
                <van-col span="4" class="text-right">
                  <van-radio :name="item.value" />
                </van-col>
              </van-row>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div> -->
      <!--
        <div class="padding">Bitcoin</div>
        <div class="item-block">
          <van-radio-group v-model="bitcoin">
            <van-cell-group :border="false">
              <van-cell :key="index" v-for="(item, index) in $store.state.network.bitcoin" @click="bitcoin = item.value">
                <van-row>
                  <van-col span="20">{{item.value}}<span v-if="item.type === 'public'">&nbsp;<van-tag round class="tag">public</van-tag></span></van-col>
                  <van-col span="4" class="text-right"> <van-radio :name="item.value" /></van-col>
                </van-row>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </div>
        <div class="padding">Stellar</div>
        <div class="item-block">
          <van-radio-group v-model="stellar">
            <van-cell-group :border="false">
              <van-cell  :key="index" v-for="(item, index) in $store.state.network.stellar" @click="stellar = item.value">
                <van-row>
                  <van-col span="20">{{item.value}}<span v-if="item.type === 'public'">&nbsp;<van-tag round class="tag">public</van-tag></span></van-col>
                  <van-col span="4" class="text-right"> <van-radio :name="item.value" /></van-col>
                </van-row>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
      </div>-->
    </pl-content-block>
  </van-popup>
</template>
<script>
import { AccountType } from "src/wallet/constants";
export default {
  data() {
    return {
      showPop: false,
      stellar: "",
      ripple: "",
      ripplexag: "",
      ethereum: "",
      bitcoin: ""
    };
  },
  methods: {
    show() {
      this.stellar = this.$store.state.setting.network.stellar;
      this.ripple = this.$store.state.setting.network.ripple;
      this.ripplexag = this.$store.state.setting.network.ripplexag;
      this.ethereum = this.$store.state.setting.network.ethereum;
      this.bitcoin = this.$store.state.setting.network.bitcoin;
      this.showPop = true;
    },
    close() {
      this.showPop = false;
    },
    onItemSelect() {},
    onClickRight() {
      /*保存更新到数据库*/
      this.$collecitons.setting.updateSetting(setting => {
        setting.network.stellar = this.stellar;
        setting.network.ripple = this.ripple;
        setting.network.ripplexag = this.ripplexag;
        setting.network.ethereum = this.ethereum;
        setting.network.bitcoin = this.bitcoin;
      });

      Object.keys(AccountType).forEach(key => {
        let acctType = AccountType[key];
        let accounts = this.$collecitons.account.findByType(acctType);
        this.$store.dispatch("setNetwork", {
          type: AccountType[key],
          url: this[key],
          accounts: accounts
        });
        // this.$store.dispatch('setNetwork', {type: AccountType.stellar, url: this.stellar});
        // this.$store.dispatch('setNetwork', {type: AccountType.ethereum, url: this.ethereum});
        // this.$store.dispatch('setNetwork', {type: AccountType.bitcoin, url: this.bitcoin});
      });
      this.close();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~assets/scss/_variables.scss";
.tag {
  background-color: $primary-color !important;
}
.van-popup {
  .padding {
    padding: 0.83rem 1.11rem;
  }
  .item-block {
    margin-top: 0px;
    padding: 0px 0px 0px 1.11rem;
  }
  .van-cell {
    padding-left: 0;
    padding-right: 0;
    border-bottom: 1px solid #f7f7f7;
  }
  .van-col.van-col--20 {
    color: #7a7a7a;
  }
}
</style>
