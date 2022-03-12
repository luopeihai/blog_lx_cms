<template>
  <div class="container">
    <div class="title">新建作品</div>
    <work-form></work-form>
  </div>
</template>

<script>
import WorkForm from './work-form'

export default {
  components: { WorkForm },
}
</script>

<style lang="scss" scoped>
.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;
    border-bottom: 1px solid #dae1ec;
  }
}
</style>
