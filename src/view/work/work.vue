<template>
  <div class="container">
    <div class="title" v-if="!editId">新建作品{{ editId }}</div>
    <div class="title" v-else>
      <span>修改作品</span> <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
    </div>

    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="work" status-icon ref="form" label-width="100px" @submit.prevent :rules="rules">
            <el-form-item label="标题" prop="title">
              <el-input size="medium" v-model="work.title" placeholder="请填写标题"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input size="medium" v-model="work.description" placeholder="请填写描述"></el-input>
            </el-form-item>
            <el-form-item label="封面" prop="cover">
              <upload-imgs
                ref="coverEle"
                max-num="1"
                preview="true"
                :rules="coverEleRules"
                :value="coverEleInitData"
                :multiple="true"
              />
              <el-input type="hidden" v-model="work.cover" placeholder="请填写描述" />
            </el-form-item>

            <el-form-item class="submit">
              <el-button type="primary" @click="submitForm">保 存</el-button>
              <el-button @click="resetForm">重 置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import workModel from '@/model/work'
import UploadImgs from '@/component/base/upload-image'

export default {
  components: {
    UploadImgs,
  },
  props: {
    editId: {
      type: Number,
      default: null,
    },
  },
  setup(props, context) {
    const coverEle = ref(null)
    const form = ref(null)
    const loading = ref(false)
    const work = reactive({ title: '', description: '', cover: '' })
    const coverEleInitData = ref([])
    const coverEleRules = {
      // maxSize: 5,
      // minWidth: 100,
      // minHeight: 100,
    }

    const listAssign = (a, b) => Object.keys(a).forEach(key => {
      a[key] = b[key] || a[key]
    })

    /**
     * 表单规则验证
     */
    const { rules } = getRules()

    onMounted(() => {
      if (props.editId) {
        getWork()
      }
    })

    const getWork = async () => {
      loading.value = true
      const res = await workModel.getWork(props.editId)
      listAssign(work, res)
      if (res.cover) {
        coverEleInitData.value = [{ display: res.cover }]
      }
      loading.value = false
    }

    // 重置表单
    const resetForm = () => {
      form.value.resetFields()
    }

    const submitForm = async formName => {
      if (coverEle.value) {
        const img = await coverEle.value.getValue()
        if (Array.isArray(img)) {
          work.cover = img.map(item => item.display).join(',')
        }
      }

      form.value.validate(async valid => {
        if (valid) {
          let res = {}

          if (props.editId) {
            res = await workModel.editWork(props.editId, work)
            context.emit('editClose')
          } else {
            res = await workModel.createWork(work)
            resetForm(formName)
          }
          if (res.code < window.MAX_SUCCESS_CODE) {
            ElMessage.success(`${res.message}`)
          }
        } else {
          console.error('error submit!!')
          ElMessage.error('请将信息填写完整')
        }
      })
    }

    const back = () => {
      context.emit('editClose')
    }

    return {
      back,
      work,
      form,
      rules,
      resetForm,
      submitForm,
      coverEle,
      coverEleInitData,
      coverEleRules,
    }
  },
}

/**
 * 表单验证规则
 */
function getRules() {
  /**
   * 验证回调函数
   */
  const checkInfo = (rule, value, callback) => {
    if (!value) {
      callback(new Error('信息不能为空'))
    }
    callback()
  }
  const rules = {
    title: [{ validator: checkInfo, trigger: 'blur', required: true }],
    description: [{ validator: checkInfo, trigger: 'blur', required: true }],
    cover: [{ validator: checkInfo, trigger: 'blur', required: true }],
  }
  return { rules }
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
