<template>
  <van-dialog v-model="showPop" class="pwd-dialog" @confirm="sure" show-cancel-button>
    <div style="font-size: .78rem;" class="text-center" v-text="$t('common.inputPwd')"></div>
    <van-cell-group>
      <van-field
        input-align="left"
        type="password"
        v-model="value"
        :placeholder="$t('common.inputPwd')"
      ></van-field>
    </van-cell-group>
  </van-dialog>
</template>
<script>
import cryptor from "core/utils/cryptor";
export default {
  data() {
    return {
      loading: false,
      showPop: false,
      value: "",
      params: ""
    };
  },
  methods: {
    show(params) {
      this.value = "";
      this.params = params;
      this.showPop = true;
    },
    showPassword() {
      return new Promise(() => {
        this.value = "";
        this.showPop = true;
      });
    },
    close() {
      this.showPop = false;
    },
    sure() {
      if (this.value) {
        if (
          this.$store.state.account.password === cryptor.encryptMD5(this.value)
        ) {
          this.$emit("done", this.value, this.params);
        } else {
          this.$toast(this.$t("acct.pwdError"));
        }
      } else {
        this.$toast(this.$t("common.notEmptyPwd"));
      }
      this.close();
    }
  }
};
</script>
<style lang="scss" scoped>
.van-dialog__content .text-center {
  padding: 1.67rem 1.11rem 1.11rem;
}
</style>
