<template>
  <div class="type-select__main">
    <van-checkbox-group v-model="accountTypes">
      <div
        class="item-block type-select__cell"
        :key="index"
        @click="clickOpt(item, index)"
        v-show="canSelected(item.type)"
        v-for="(item,index) in accounts"
      >
        <span class="content-left__icon type-select__icon">
          <img :src="`static/img/${item.code}@3x.png`" />
        </span>
        <div class="type-select-group">
          <div class="type-select__title">
            <span>{{item.name}}</span>
          </div>
          <div class="type-select__value">
            <van-checkbox :name="item.type" ref="checkboxes" v-if="isCheck" />
            <i class="arrow-right" v-else></i>
          </div>
        </div>
      </div>
    </van-checkbox-group>
  </div>
</template>
<script>
import accounts from "../mixins/accounts";
export default {
  mixins: [accounts],
  props: {
    value: String | Array,
    clickable: Boolean,
    filterTypes: String | Array,
    isCheck: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    accountTypes(val) {
      this.$emit("input", val);
    },
    value(val) {
      this.accountTypes = val;
    }
  },
  data() {
    return {
      accountTypes: this.value
    };
  },
  methods: {
    clickOpt(item, index) {
      if (this.clickable) {
        this.$emit("click-opt", item);
      } else if (this.isCheck) {
        this.$refs.checkboxes[index].toggle();
      }
    },
    canSelected(type) {
      if (this.filterTypes && this.filterTypes.length > 0) {
        return this.filterTypes.indexOf(type) < 0;
      }
      return true;
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.type-select__main {
  margin-top: 1.6rem;
  .type-select__cell {
    /*height: 4rem;*/
    display: flex;
    align-items: center;
    padding-left: 20px;
    padding-right: 0;
    font-size: 0.88rem;
    color: #333;
    line-height: 24px;
    margin-bottom: 15px;
    .type-select__title {
      flex: 1;
      align-self: center;
    }
    .type-select__value {
      flex: 1;
      align-self: center;
      text-align: right;
      overflow: hidden;
      vertical-align: middle;
    }
    .type-select-group {
      flex: 1;
      display: flex;
      padding-right: 20px;
      border-bottom: 1px solid #fbfbfb;
      box-shadow: 0px 0px 0px 0px transparent, 0px 0px 0px 0px transparent,
        0px 0px 0px 0px transparent, 0px 1px 0px 0px #f7f7f7;
      padding-top: 25px;
      padding-bottom: 25px;
    }
    &.item-block {
      margin: 0;
      border-radius: 0;
      box-shadow: none;
      //0px -2px 20px rgba(0, 0, 0, 0.05)
      padding-top: 0;
      padding-bottom: 0;
    }
  }
  .type-select__value {
    .arrow-right {
      display: block;
      width: 0.89rem;
      height: 0.78rem;
      background: url("../../../../static/img/app/more.png");
      background-size: auto 0.78rem;
      float: right;
    }
  }
  .item-block {
    border-bottom: none;
  }
}
</style>
