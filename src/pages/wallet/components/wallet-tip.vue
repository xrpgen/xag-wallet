<template>
  <div class="text-tip sn-font">{{tip}}</div>
</template>
<script>
export default {
  props: {
    tip: String
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.text-tip {
  color: #888888;
  padding-left: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
