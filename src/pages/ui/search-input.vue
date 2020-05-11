<template>
  <div>
    <van-search
      class="input-search"
      v-model="searchStr"
      :placeholder="$t('common.searchPlaceholder')"
      ref="searchRef"
      input-align="center"
      @keydown="hiddenIcon"
      @keyup="showIcon(searchStr)"
    ></van-search>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    searchStr: String
  },
  computed: {},
  methods: {
    hiddenIcon() {
      this.$refs.searchRef.$children[0].$children[0].$children[0].$el.style.display =
        "none";
    },
    showIcon(searchValue) {
      if (searchValue.length === 0) {
        this.$refs.searchRef.$children[0].$children[0].$children[0].$el.style.display =
          "block";
      }
    }
  }
};
</script>

<style scoped lang="scss">
</style>
