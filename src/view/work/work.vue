<template>
  <div class="container">
    <div class="title" v-if="!editId">新建作品{{ editId }}</div>
    <div class="title" v-else>
      <span>修改作品</span> <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
    </div>

    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="work" status-icon ref="form" label-width="150px" @submit.prevent :rules="rules">
            <el-form-item label="标题" min-width="100" prop="title">
              <el-input size="medium" v-model="work.title" placeholder="请填写标题"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input size="medium" v-model="work.description" placeholder="请填写描述"></el-input>
            </el-form-item>
            <el-form-item label="封面(数量=1)" prop="cover">
              <upload-imgs ref="coverEle" :max-num="1" :preview="true" :value="coverEleInitData" :multiple="false" />
              <el-input type="hidden" v-model="work.cover" />
            </el-form-item>
            <el-form-item label="作品图片(数量<30)" prop="pics">
              <upload-imgs
                ref="picsEle"
                :min-num="1"
                :max-num="30"
                :preview="true"
                :value="picsEleInitData"
                :multiple="true"
                :sortable="true"
              />
              <el-input type="hidden" v-model="work.pics" />
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
import Utils from '@/lin/util/util'

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
    // 封面图片
    const coverEle = ref(null)
    const coverEleInitData = ref([])

    // 作品图
    const picsEle = ref(null)
    const picsEleInitData = ref([])

    const form = ref(null)
    const loading = ref(false)
    const work = reactive({ title: '', description: '', cover: '', pics: '' })

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

      if (res.pics) {
        picsEleInitData.value = res.pics.split(',').map(item => ({
          display: item,
        }))
      }
      loading.value = false
    }

    // 重置表单
    const resetForm = () => {
      form.value.resetFields()
    }

    const submitForm = async formName => {
      // 有封面图
      work.cover = await Utils.getImages(coverEle)

      // 作品图
      work.pics = await Utils.getImages(picsEle)

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
      picsEle,
      picsEleInitData,
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
    pics: [{ validator: checkInfo, trigger: 'blur', required: true }],
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
