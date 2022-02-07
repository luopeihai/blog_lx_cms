<template>
  <div class="wrap">
    <el-row>
      <el-col :lg="16" :md="20" :sm="24" :xs="24">
        <el-form
          :model="form"
          :rules="formRules"
          status-icon
          ref="form"
          label-width="100px"
          v-loading="loading"
          @submit.native.prevent
        >
          <el-form-item label="标题" prop="title">
            <el-input size="medium" v-model="form.title" placeholder="请填写标题"></el-input>
          </el-form-item>
          <el-form-item class="submit">
            <el-button type="primary" @click="submitForm('form')">保 存</el-button>
            <el-button @click="resetForm('form')">重 置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import tag from '@/model/tag'

export default {
  props: {
    editID: {
      type: Number,
    },
  },
  data() {
    return {
      loading: false,
      form: {
        title: '',
      },
      formRules: {
        title: [{ trigger: 'blur', required: true }],
      },
    }
  },
  async mounted() {
    if (this.editID) {
      this.loading = true
      const res = await tag.getTag(this.editID)
      this.form = res
      this.loading = false
    }
  },
  methods: {
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const res = this.editID ? await tag.editTag(this.editID, this.form) : await tag.createTag(this.form)
          if (res.code < window.MAX_SUCCESS_CODE) {
            this.$message.success(`${res.message}`)
            this.$emit('editClose')
          }
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    back() {
      this.$emit('editClose')
    },
  },
}
</script>

<style lang="scss" scoped>
.wrap {
  padding: 20px;
}
</style>
