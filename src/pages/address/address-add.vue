<template>
  <!-- 添加地址 -->
  <div class="address-add-container">
    <van-popup
      v-model="showPop"
      position="right"
      class="popup-wapper"
      get-container="body"
      style="width:100%;height: 100%;"
    >
      <van-nav-bar :title="$t('address.addAddress')" left-arrow @click-left="close">
        <span slot="left">
          <i>
            <img src="../wallet/img/back.png" alt />
          </i>
        </span>
      </van-nav-bar>
      <van-cell-group class="margin-top c">
        <van-field
          maxlength="80"
          :placeholder="$t('address.namePlaceholder')"
          :data-vv-as="$t('address.name')"
          clearable
          name="name"
          v-validate="'required'"
          v-model="form.name"
          :label="$t('address.addressName')"
        />
        <van-field
          class="small-font"
          maxlength="50"
          rows="1"
          type="textarea"
          autosize
          clearable
          :placeholder="$t('address.remarkPlaceholder')"
          v-model="form.remark"
          :label="$t('address.remarkName')"
        />
      </van-cell-group>
      <div class="item-block arrow" @click="toSelectType">
        <van-field
          v-model="form.type"
          v-validate="'required'"
          :placeholder="$t('address.coinTypePlaceholder')"
          :data-vv-as="$t('address.coinType')"
          name="type"
          readonly
          :label="$t('address.addressType')"
        ></van-field>
      </div>

      <!--地址-->
      <div class="item-block" v-if="form.type">
        <pl-block :title="$t('common.receivablesAddress')" :title-class="false">
          <span slot="title-tip">
            <!-- <i class="ultfont ult-scan" @click="toScan"></i> -->
            <i @click="toScan">
              <img src="../../../static/img/sao.png" alt />
            </i>
          </span>

          <van-field
            v-model="form.value"
            :data-vv-as="$t('common.receivablesAddress')"
            :placeholder="$t('address.receivablesAddressPlaceholder')"
            name="value"
            rows="1"
            type="textarea"
            autosize
            class="no-border no-padding-side"
            style="padding-left: 0 !important;"
            v-validate="'required'"
            clearable
          ></van-field>
          <small class="text-danger" v-show="!addressValid">{{$t('address.invalidAddressTip')}}</small>
        </pl-block>
      </div>
      <!--stellar和ripple特有的信息-->
      <div class="item-block" v-if="(isStellar||isRipple) && form.value && addressValid">
        <pl-block>
          <div style="padding: 0 0 10px;">
            <div class="pull-left normal-font" v-if="isStellar">Memo</div>
            <div class="pull-left normal-font" v-else-if="isRipple">Tag</div>
            <div class="pull-right" v-if="isStellar">
              <span
                class="memo-type"
                @click="selectMemo(memo.value)"
                :class="{'active': form.labelType === memo.value, 'disabled' : !canSelectMemoType}"
                :key="index"
                v-for="(memo, index) in memoTypes"
              >
                <span class="icon text-success" v-if="form.labelType === memo.value">
                  <van-icon name="certificate" style="vertical-align: middle;" />
                </span>
                <span style="vertical-align: middle;">{{memo.text}}</span>
              </span>
            </div>
          </div>
          <van-field
            v-model="form.labelValue"
            class="no-border no-padding-side"
            style="padding-left: 0 !important;"
            :placeholder="labelValuePlaceholder"
            clearable
          ></van-field>
          <small
            class="text-danger"
            v-show="isNeedMemoOrTag && !form.labelValue"
          >{{needMemoOrTagTip}}</small>
          <small class="text-danger" v-show="isValidMemo">{{isValidMemo}}</small>
        </pl-block>
      </div>

      <div class="single-btn">
        <van-button
          size="large"
          round
          @click="saveAddress"
          type="primary"
          :text="$t('address.save')"
        ></van-button>
      </div>
      <coin-type-select ref="coinTypeSelect" @done="setType"></coin-type-select>
    </van-popup>
  </div>
</template>
<script>
import coinTypeSelect from "../ui/coin-type-select";
import { AccountType } from "src/wallet/constants";
import moment from "moment";
import QRCodeScanner from "core/utils/QRCodeScanner.js";
import coins from "src/wallet/coins";
import StellarSdk from "stellar-sdk";

export default {
  components: { coinTypeSelect },
  data() {
    return {
      showPop: false,
      addressValid: true,
      canSelectMemoType: true /*stellar是否可以选择，如果是交易所地址则不可以选择，只能是text*/,
      isNeedMemoOrTag: false /*是否需要memo或者tag*/,
      memoTypes: [
        { text: "ID", value: StellarSdk.MemoID },
        { text: "Text", value: StellarSdk.MemoText },
        { text: "Hash", value: StellarSdk.MemoHash }
      ],
      form: {
        acctType: "",
        type: "",
        name: "",
        value: "",
        remark: "",
        labelType: "",
        labelValue: ""
      }
    };
  },
  computed: {
    isStellar() {
      return this.form.acctType === AccountType.stellar;
    },
    isRipple() {
      return this.form.acctType === AccountType.ripple;
    },
    labelValuePlaceholder() {
      if (this.isStellar) {
        return this.$t("transaction.inputMemoPlaceholder");
      } else if (this.isRipple) {
        return this.$t("transaction.inputTagPlaceholder");
      }
    },
    needMemoOrTagTip() {
      if (this.isStellar) {
        return this.$t("transaction.stellarNeedMemo");
      } else if (this.isRipple) {
        return this.$t("transaction.xrpExchangeAddress");
      }
    },
    isValidMemo() {
      if (this.form.labelValue && this.isStellar) {
        let msg = coins[this.form.acctType].wallet.isValidMemo(
          this.form.labelType,
          this.form.labelValue
        );
        if (msg) {
          return this.memoErrMsg[this.form.labelType];
        } else {
          return "";
        }
      }
      return "";
    },
    memoErrMsg() {
      return {
        [StellarSdk.MemoID]: this.$t("transaction.memoExpectsNum"), // Expects a int64 as a string
        [StellarSdk.MemoText]: this.$t("transaction.memoExpectsMax28Byte"), // Expects string, array or buffer, max 28 bytes
        [StellarSdk.MemoHash]: this.$t("transaction.memoExpects32Byte") // Expects a 32 byte hash value or hex encoded string
      };
    }
  },
  watch: {
    "form.value"() {
      if (this.form.value && this.form.acctType) {
        if (!coins[this.form.acctType].wallet.isValidAddress(this.form.value)) {
          this.addressValid = false;
        } else {
          this.addressValid = true;
          if (this.isStellar || this.isRipple) {
            this.isNeedMemoOrTag = coins[
              this.form.acctType
            ].wallet.isTradingPlatformAddress(this.form.value);
            if (this.isNeedMemoOrTag) {
              this.canSelectMemoType = false;
            } else {
              this.canSelectMemoType = true;
            }
          }
        }
      } else {
        this.addressValid = true;
        this.isNeedMemoOrTag = false;
      }
    },
    "form.type"() {
      if (this.form.value && this.form.acctType) {
        if (!coins[this.form.acctType].wallet.isValidAddress(this.form.value)) {
          this.addressValid = false;
        } else {
          this.addressValid = true;
        }
      } else {
        this.addressValid = true;
      }
    }
  },
  methods: {
    show(address) {
      this.resetForm();
      if (typeof address === "object" && address) {
        this.form.value = address.address;
        this.form.acctType = address.type;
        this.form.type = this.stringUpperCaseFirstChar(address.type);
      } else if (address && address !== "") {
        this.form.value = address;
      }
      this.showPop = true;
    },
    resetForm() {
      this.form.name = "";
      this.form.type = "";
      this.form.value = "";
      this.form.acctType = "";
      this.form.remark = "";
      this.resetLabelForm();
    },
    resetLabelForm() {
      this.form.labelType = "";
      if (this.form.acctType === AccountType.ripple) {
        this.form.labelType = "Tag";
      }
      this.form.labelValue = "";
    },
    selectMemo(value) {
      if (!this.canSelectMemoType) {
        return;
      }
      if (value !== this.form.labelType) {
        this.form.labelType = value;
        this.form.labelValue = "";
      }
    },
    toScan() {
      QRCodeScanner.scan(this).then(
        res => {
          if (res && res.address && res.address !== "") {
            this.form.value = res.address;
            // let assetCode = QRCodeScanner.getAssetCodeByAddress(res);
            // if (assetCode && assetCode !== '') {
            // this.form.type = assetCode;
            // return;
            // }
            // this.$toast('Not invalid address!');
          } else {
            this.$toast(this.$t("assets.scanFailTip"));
          }
        },
        errorMsg => {
          this.$toast(errorMsg);
        }
      );
    },
    close() {
      this.showPop = false;
    },
    toSelectType() {
      this.$refs.coinTypeSelect.show();
    },
    setType(type, acctType) {
      this.form.acctType = acctType;
      acctType = acctType == "ripplexag"
      ? "xrpgen"
      : acctType;
      this.form.type = this.stringUpperCaseFirstChar(acctType);
      this.resetLabelForm();
    },
    stringUpperCaseFirstChar(str) {
      // 首字母大写
      return str.charAt(0).toUpperCase() + str.substring(1);
    },
    saveAddress() {
      if (!this.form.value) {
        this.$toast(this.$t("address.addressRequire"));
        return;
      }
      if (
        !this.addressValid ||
        (this.isNeedMemoOrTag && !this.form.labelValue)
      ) {
        return;
      }
      let checkAddress = this.$collecitons.address.findAddreByValue(
        this.form.value
      );
      if (checkAddress) {
        this.$toast(this.$t("address.existAddress"));
        return;
      }
      if (!this.form.type) {
        this.$toast(this.$t("address.coinTypeRequire"));
        return;
      }
      if (!this.form.name) {
        this.$toast(this.$t("address.nameNotEmpty"));
        return;
      }
      this.$validator.validateAll().then(result => {
        if (result) {
          let addObj = this.form;
          addObj.addTime = moment().format("YYYY-MM-DD HH:mm:ss");
          addObj.type = this.form.acctType;
          this.$collecitons.address.insertAddress(addObj);
          this.$emit("done");
          this.close();
        } else {
          this.$toast(this.validateErrors.items[0].msg);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~assets/scss/variables";
.address-add-container {
  .no-padding-side {
    &.van-field {
      padding-left: 0;
      padding-right: 0;
    }
  }
}
.memo-type {
  height: 20px;
  margin: 6px 0px 6px 5px;
  line-height: 20px;
  display: inline-block;
  width: 55px;
  text-align: center;
  background: #ecebeb;
  border-radius: 10px;
  font-size: 12px;
  position: relative;
  .icon {
    position: absolute;
    top: -4px;
    right: 0px;
  }
  &.active {
    background: $primary-color-light-1 !important;
    color: #222 !important;
  }
  &.disabled {
    background: $dark-white;
    color: #999;
  }
}
.item-block.arrow {
  position: relative;
}
.item-block.arrow::before {
  content: "";
  display: block;
  width: 0.89rem;
  height: 0.78rem;
  // background-color: pink;
  background-image: url("../../../static/img/app/more.png");
  background-size: auto 0.78rem;
  position: absolute;
  right: 1.11rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 999;
}
.van-popup .item-block {
  margin: 0px;
  border-radius: 0px;
}
</style>
<style lang="scss">
.address-add-container {
  .van-field {
    padding-left: 15px;
    padding-right: 15px;
  }
}

.margin-top {
  margin-top: 0.56rem;
}
.single-btn {
  margin-top: 1.67rem;
}
.van-cell__title {
  font-size: 0.78rem;
}
.van-cell {
  padding: 0px;
  &.van-field {
    border-bottom: 1px solid #fbfbfb;
  }
}
.item-block {
  padding: 20px;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-bottom: 1px solid #fbfbfb;
}
.item-block > .van-cell {
  border: none;
}
.container.padding-15 {
  padding: 0px;
  position: relative;
  .pull-right span img {
    width: 1rem;
    position: relative;
    z-index: 1;
    vertical-align: middle;
  }
  .text-danger {
    position: absolute;
    left: 4.61rem;
    bottom: 0;
  }
}
.no-border.no-padding-side {
  position: relative;
  left: 84px;
  top: -29px;
  padding-right: 0;
  width: 80%;
}
.van-cell__value {
  color: #676767;
  font-size: 0.78rem;
}
input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  font-size: 0.78rem !important;
}

input:-moz-placeholder,
textarea::-webkit-input-placeholder {
  font-size: 0.78rem !important;
}

input::-moz-placeholder,
textarea::-webkit-input-placeholder {
  font-size: 0.78rem !important;
}

input:-ms-input-placeholder,
textarea::-webkit-input-placeholder {
  font-size: 0.78rem !important;
}
.van-cell:not(:last-child)::after {
  border: none;
}
[class*="van-hairline"]::after {
  border: none;
}
.title-container .pull-left {
  font-size: 0.78rem;
}
.no-border {
  position: relative;
  textarea {
    padding-right: 4rem;
  }
  i.van-icon-clear {
    position: absolute;
    right: 3rem;
    top: 0;
  }
}
</style>
