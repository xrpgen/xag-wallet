export default {
  watch: {
    searchValue: {
      handler: function(val, oldVal) {
        if ((val.length && oldVal.length) || (val.length && !oldVal.length)) {
          this.hiddenIcon();
        } else if (!val.length) {
          this.showIcon();
        }
      }
    }
    // searchStr() {
    //   this.$refs.list.reload();
    // }
  },
  methods: {
    hiddenIcon() {
      this.$refs.searchRef.$children[0].$children[0].$children[0].$el.style.display =
        'none';
    },
    showIcon() {
      this.$refs.searchRef.$children[0].$children[0].$children[0].$el.style.display =
        'block';
    }
  }
};
