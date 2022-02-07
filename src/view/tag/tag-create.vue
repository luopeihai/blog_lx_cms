<template>
  <div class="container">
    <div class="title">新建标签</div>
    <tag-form></tag-form>
  </div>
</template>

<script>
import TagForm from './tag-form'

export default {
  components: { TagForm },
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
