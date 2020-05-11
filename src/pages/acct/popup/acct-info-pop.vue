<template>
  <div>
    <van-popup
      v-model="showPop"
      position="bottom"
      class="popup-wapper"
      style="width:100%;height: 100%;"
    >
      <van-nav-bar :title="$t('acct.acctInformation')" @click-left="close">
        <span slot="left">
          <i>
            <img src="../../wallet/img/back.png" alt />
          </i>
        </span>
      </van-nav-bar>
      <!-- block -->
      <pl-content-block :offsetTop="112">
        <div class="item-block assset-add-block">
          <table style="width: 100%;table-layout: fixed;">
            <tr>
              <td>
                <p>DefaultRipple flag</p>
                <p>Gateways: Enable if you plan to issue balances</p>
              </td>
              <td width="50">
                <van-switch @input="changeDefault1" size="25px" :value="showDefaultRipple" />
              </td>
            </tr>
          </table>
        </div>
        <div class="item-block assset-add-block">
          <table style="width: 100%;table-layout: fixed;">
            <tr>
              <td>
                <p>RequireDest flag: Requires incoming payments to specify a destination tag</p>
              </td>
              <td width="50">
                <van-switch @input="changeDefault2" size="25px" :value="showRequireTag" />
              </td>
            </tr>
          </table>
        </div>
      </pl-content-block>
    </van-popup>
    <password-dialog ref="pwdDialogs" @done="changeTrust"></password-dialog>
  </div>
</template>
<script>
import cryptor from "core/utils/cryptor";
import passwordDialog from "../../ui/password-dialog";
export default {
  components: {
    passwordDialog
  },
  data() {
    return {
      showPop: false,
      searchValue: "",
      showDefaultRipple: false,
      showRequireTag: false,
      secret: "",
      curreAcctountAddress: "",
      setConfig: {},
      count: "",
      getSetting: ""
    };
  },
  methods: {
    init() {
      let account = this.$store.state.account;
      this.curreAcctountAddress = account.address;
      //一进来获取配置
      this.$wallet.queryAccountInfo(this.curreAcctountAddress).then(data => {
        console.log(data);
        this.getSetting = data;

        //让刷新过后的按钮的开关绑定这个false和true
        if (this.getSetting.requireDestinationTag) {
          this.showRequireTag = true;
        } else {
          this.showRequireTag = false;
        }

        if (this.getSetting.defaultRipple) {
          this.showDefaultRipple = true;
        } else {
          this.showDefaultRipple = false;
        }
      });
    },
    show() {
      this.showPop = true;
    },
    close() {
      this.showPop = false;
    },
    //设置
    async setFlag() {
      let aa = await this.$wallet.setAccountInfo(
        this.curreAcctountAddress,
        this.secret,
        this.setConfig
      );
      console.log(aa);
    },

    //得出地址，和解密后私钥的方法（确认按钮）
    changeTrust(password) {
      let map = {};
      map[this.curreAcctountAddress] = password;
      this.$store.dispatch("setPasswordMap", map);

      //解密出私钥
      let secret = cryptor.decryptAES(
        this.$store.state.account.secret,
        password
      );
      this.secret = secret;

      if (this.count === 1) {
        this.showDefaultRipple = !this.showDefaultRipple;
        if (this.showDefaultRipple) {
          this.setConfig = { defaultRipple: true };
        } else if (!this.showDefaultRipple) {
          this.setConfig = { defaultRipple: false };
        }

        this.setFlag();
      } else {
        this.showRequireTag = !this.showRequireTag;
        if (this.showRequireTag) {
          this.setConfig = { requireDestinationTag: true };
        } else if (!this.showRequireTag) {
          this.setConfig = { requireDestinationTag: false };
        }

        this.setFlag();
      }
    },
    // 切换第一个开关
    changeDefault1(checked) {
      this.count = 1;
      if (this.$store.state.passwordMap[this.curreAcctountAddress]) {
        this.showDefaultRipple = checked;
      } else {
        this.$refs.pwdDialogs.showPassword();
        return;
      }
      if (checked) {
        console.log(checked);
        this.setConfig = { defaultRipple: true };
      } else if (!checked) {
        console.log(checked);
        this.setConfig = { defaultRipple: false };
      }
      console.log(this.setConfig);
      this.setFlag();
    },
    //切换第二个开关
    changeDefault2(checked) {
      this.count = 2;
      if (this.$store.state.passwordMap[this.curreAcctountAddress]) {
        this.showRequireTag = checked;
      } else {
        this.$refs.pwdDialogs.showPassword();
        return;
      }
      if (checked) {
        this.setConfig = { requireDestinationTag: true };
      } else if (!checked) {
        this.setConfig = { requireDestinationTag: false };
      }
      console.log(this.setConfig);
      this.setFlag();
    }
  }
};
</script>

<style scoped lang="scss">
</style>
