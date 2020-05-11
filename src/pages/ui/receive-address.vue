<template>
  <div>
    <pl-block>
      <van-field
        v-model="receiveAddress"
        :placeholder="$t('common.receivablesAddressPlaceholder')"
        clearable
        type="textarea"
        rows="1"
        autosize
        name="receiveAddress"
        :label="$t('common.address')"
      >
        <span slot="icon">
          <!--<i class="ultfont ult-contacts"></i>-->
          <img
            :src="dprImg(`book.png`)"
            style="width: 20px; height: 20px;display:block"
            @click="toSelectAddress"
          />
        </span>
      </van-field>
      <slot></slot>
    </pl-block>
    <address-list ref="addressList" @done="setReceiveAddress"></address-list>
  </div>
</template>
<script>
import addressList from "../address/address-list";
export default {
  components: { addressList },
  props: {
    value: String,
    accountType: String
  },
  watch: {
    value(val) {
      if (val) {
        val = val.trim();
      }
      if (val === this.receiveAddress) {
        return;
      }
      this.receiveAddress = val;
    },
    receiveAddress(val) {
      this.$emit("input", val);
    }
  },
  data() {
    return {
      receiveAddress: this.value
    };
  },
  methods: {
    toSelectAddress() {
      this.$refs.addressList.show("2", this.accountType);
    },
    setReceiveAddress(address) {
      // 设置收款地址
      this.receiveAddress = address.value;
      this.$emit("input", address.value);
      this.$emit("change", address);
    }
  }
};
</script>
<style></style>
