<template>
  <div class="password-block item-block" style="padding:0">
    <van-cell-group :border="false">
      <pl-password-strength
        v-model="form.walletPwd"
        :type="inputType"
        :data-vv-as="$t('wallet.setTranPwdPlaceholder')"
        :placeholder="$t('wallet.setTranPwdPlaceholder')"
        v-validate="'required|min:6'"
        name="walletPwd"
      ></pl-password-strength>
      <div class="eye-open-close">
        <van-field
          v-model="form.confirmWalletPwd"
          maxlength="50"
          :type="inputType"
          :data-vv-as="$t('wallet.setTranPwdPlaceholder2')"
          :placeholder="$t('wallet.setTranPwdPlaceholder2')"
          v-validate="'required|min:6'"
          name="confirmWalletPwd"
        ></van-field>
        <span v-show="displayPassword" @click="transferPwdMode" class="password-icon">
          <img width="17" src="../../../../static/img/open-small.png" alt />
        </span>
        <span v-show="!displayPassword" @click="transferPwdMode" class="password-icon">
          <img width="17" src="../../../../static/img/close-small.png" alt />
        </span>
      </div>
    </van-cell-group>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          walletPwd: "",
          confirmWalletPwd: ""
        };
      }
    }
  },
  watch: {
    value(val) {
      this.from = val;
    },
    form(val) {
      this.$emit("input", val);
    }
  },
  data() {
    return {
      form: this.value,
      displayPassword: false,
      inputType: "password"
      // inputIcon: "password-not-view"
    };
  },
  methods: {
    transferPwdMode() {
      if (this.inputType === "password") {
        this.inputType = "text";
        this.displayPassword = true;
      } else {
        this.inputType = "password";
        this.displayPassword = false;
      }
    },
    resetForm() {
      this.form.walletPwd = "";
      this.form.confirmWalletPwd = "";
      this.displayPassword = false;
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped></style>
<style lang="scss" rel="stylesheet/scss">
.password-block {
  border-radius: 0px;
  .eye-open-close {
    position: relative;
    .password-icon {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
    }
  }
}
</style>
