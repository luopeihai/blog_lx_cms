<template>
  <div class="container">
    <div class="title">
      <span>修改标签</span> <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
    </div>
    <el-divider></el-divider>
    <tag-form :editID="editID"></tag-form>
  </div>
</template>

<script>
import TagForm from './tag-form'

export default {
  components: {
    TagForm,
  },
  props: {
    editID: {
      type: Number,
    },
  },
  methods: {
    back() {
      this.$emit('editClose')
    },
  },
}
</script>

<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 0;
}

.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;

    .back {
      float: right;
      margin-right: 40px;
      cursor: pointer;
    }
  }
  .wrap {
    padding: 20px;
  }
}
</style>
