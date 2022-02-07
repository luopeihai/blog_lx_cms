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
          <el-form-item label="标签" prop="tags">
            <el-select
              v-model="form.tags"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="getTags"
              :loading="selectLoading"
            >
              <el-option v-for="item in options" :key="item.id" :label="item.title" :value="item.id"> </el-option>
            </el-select>
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
import tag from '@/model/tag'
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
      selectLoading: false,
      options: [],
      form: {
        title: '',
        description: '',
        cover: '',
        pics: '',
        tags: '',
      },
      formRules: {
        title: [{ trigger: 'blur', required: true }],
        description: [{ trigger: 'blur', required: true }],
        cover: [{ trigger: 'blur', required: true }],
        pics: [{ trigger: 'blur', required: true }],
        tags: [{ trigger: 'blur', required: true }],
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
    await this.getTags('')
    if (this.editID) {
      this.loading = true
      const res = await work.getWork(this.editID)
      this.form = {
        ...res,
        tags: res.tags.map(item => item.id),
      }
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
    async getTags(query) {
      this.selectLoading = true
      const tags = await tag.getTags(0, 100, query)
      this.options = tags.items
      this.selectLoading = false
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
