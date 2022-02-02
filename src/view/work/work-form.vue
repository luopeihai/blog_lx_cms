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
          <el-form-item label="封面" prop="cover">
            <upload-imgs :min-num="1" :max-num="1" ref="uploadCoverEle" :rules="rules" :value="initCoverData" />
            <el-input type="hidden" v-model="form.cover" />
          </el-form-item>
          <el-form-item label="作品图片" prop="pics">
            <upload-imgs
              :min-num="1"
              :max-num="30"
              ref="uploadPicsEle"
              :rules="rules"
              :multiple="true"
              :sortable="true"
              :value="initPicsData"
            />
            <el-input type="hidden" v-model="form.pics" />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input size="medium" type="textarea" :rows="4" placeholder="请输入简介" v-model="form.description">
            </el-input>
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
import work from '@/model/work'
import UploadImgs from '@/component/base/upload-image'
import Utils from '@/lin/util/util'

export default {
  components: { UploadImgs },
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
        description: '',
        cover: '',
        pics: '',
      },
      formRules: {
        title: [{ trigger: 'blur', required: true }],
        description: [{ trigger: 'blur', required: true }],
        cover: [{ trigger: 'blur', required: true }],
        pics: [{ trigger: 'blur', required: true }],
      },
      rules: {
        minWidth: 10,
        minHeight: 10,
        maxSize: 5,
      },
      initCoverData: [],
      initPicsData: [],
    }
  },
  async mounted() {
    if (this.editID) {
      this.loading = true
      const res = await work.getWork(this.editID)
      this.form = res
      if (res.cover) {
        this.initCoverData = [{ display: res.cover }]
      }
      if (res.pics) {
        this.initPicsData = res.pics.split(',').map(item => ({
          display: item,
        }))
      }
      this.loading = false
    }
  },
  methods: {
    async submitForm(formName) {
      this.form.cover = await Utils.getImages(this.$refs.uploadCoverEle)
      this.form.pics = await Utils.getImages(this.$refs.uploadPicsEle)
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const res = this.editID ? await work.editWork(this.editID, this.form) : await work.createWork(this.form)
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

  .submit {
    float: left;
  }
}
</style>
