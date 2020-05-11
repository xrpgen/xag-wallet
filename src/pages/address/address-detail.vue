<template>
  <div>
    <van-popup
      v-model="showPop"
      position="right"
      class="popup-wapper address-detail"
      get-container="body"
      style="width:100%;height: 100%;"
    >
      <van-nav-bar :title="$t('common.detail')" left-arrow @click-left="close">
        <span slot="left">
          <i>
            <img src="../wallet/img/back.png" alt />
          </i>
        </span>
        <!-- <span slot="right" class="normal-font text-primary" v-text="$t('common.delete')"></span> -->
      </van-nav-bar>

      <van-cell-group class="margin-top item-block">
        <van-field
          v-model="addressInfo.name"
          @blur="modifyName"
          maxlength="80"
          clearable
          :label="$t('address.addressName')"
          :placeholder="$t('address.namePlaceholder')"
        />
        <van-field
          type="input"
          maxlength="50"
          @blur="modifyRemark"
          v-model="addressInfo.remark"
          clearable
          :label="$t('address.remarkName')"
          :placeholder="$t('address.remarkPlaceholder')"
        />

        <!-- <van-field
          type="input"
          maxlength="50"
          v-model="addressInfo.value"
          clearable
          :label="$t('address.shippingAddress')"
          :placeholder="$t('address.remarkPlaceholder')"
          disabled
        />-->
        <!--<van-cell
          title="名称"
          :value="addressInfo.name"
          is-link
        @click="toModifyName('1')"/>-->
        <!-- <van-cell
          title="备注"
          :value="addressInfo.remark"
          is-link
        @click="toModifyRemark"/>-->
      </van-cell-group>
      <div class="van-cell addrCode">
        <div class="van-cell__title">
          <span v-text="$t('address.shippingAddress')"></span>
        </div>
        <div class="van-cell__value">
          <div class="van-field__body">
            <div class="addr">
              <pl-wallet-addr
                class="small-font text-primary text-center"
                complete
                :address="addressInfo.value"
              ></pl-wallet-addr>
            </div>
          </div>
        </div>
      </div>
      <pl-block class="margin-top item-block">
        <div class="text-center qrcode-container">
          <qrcode class="qrcode" :value="addressInfo.value" :options="{ size: 200 }"></qrcode>
        </div>
      </pl-block>
      <!-- <van-row>
        <van-col span="24">{{$t('common.delete')}}</van-col>
      </van-row>-->
      <div class="single-btn">
        <van-button
          size="large"
          round
          @click="deleteAddress"
          type="primary"
          :text="$t('address.deleteAddress')"
        ></van-button>
      </div>
    </van-popup>
  </div>
</template>
<script>
import qrcode from "@xkeshi/vue-qrcode";
export default {
  data() {
    return {
      showPop: false,
      showNameDialog: false,
      showRemarkDialog: false,
      addressInfo: {},
      addressName: "",
      remark: ""
    };
  },
  components: {
    qrcode
  },
  methods: {
    show(params) {
      this.addressInfo = { ...params };
      this.showPop = true;
    },
    close() {
      this.$emit("done");
      this.showPop = false;
    },
    deleteAddress() {
      this.$dialog
        .confirm({
          title: this.$t("common.tip"),
          message: this.$t("address.deleteConfirm")
        })
        .then(() => {
          this.$collecitons.address.deleteAddressByValue(
            this.addressInfo.value
          );
          this.close();
        });
    },
    modifyName() {
      if (this.addressInfo.name) {
        this.$collecitons.address.findAnUpdateAddress(
          { value: this.addressInfo.value },
          address => {
            return (address.name = this.addressInfo.name);
          }
        );
      } else {
        this.$toast(this.$t("address.nameNotEmpty"));
      }
      // this.showNameDialog = false;
    },
    modifyRemark() {
      this.$collecitons.address.findAnUpdateAddress(
        { value: this.addressInfo.value },
        address => {
          return (address.remark = this.addressInfo.remark);
        }
      );
      // this.showRemarkDialog = false;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~assets/scss/_variables.scss";
.qrcode-container {
  padding: 4px 0;
}
.addr {
  padding: 10px;
  background-color: $primary-color-light;
}
.address-detail {
  .van-nav-bar {
    margin-bottom: 0.56rem;
  }
  .item-block {
    padding: 0;
    border-bottom: none;
  }
  .van-cell {
    padding: 1.33rem 1.11rem;
    border-bottom: 1px solid #fbfbfb;
    box-shadow: 0px 0px 0px 0px transparent, 0px 0px 0px 0px transparent,
      0px 0px 0px 0px transparent, 0px 1px 0px 0px #f7f7f7;
  }
  .addrCode .van-cell__title {
    max-width: 4.72rem !important;
  }
  .van-cell__value {
    span.addr-container {
      text-align: left;
    }
    .van-field__body .addr {
      background-color: #fff;
      padding: 0px;
    }
  }
  .qrcode-container {
    padding-top: 1.67rem;
  }
  .container.padding-15 {
    background-color: #f7f7f7;
  }
  .single-btn {
    position: absolute;
    bottom: 1.11rem;
    width: 90%;
  }
}
</style>
