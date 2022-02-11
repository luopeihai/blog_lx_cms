<template>
  <div class="container">
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form
            :model="form"
            :rules="formRules"
            status-icon
            ref="form"
            label-width="100px"
            v-loading="formLoading"
            @submit.native.prevent
          >
            <el-form-item label="用户名" prop="username">
              <el-input :disabled="true" size="medium" v-model="form.username" placeholder="请填写用户名"></el-input>
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
              <el-input type="hidden" v-model="form.avatar" placeholder="请选中头像"></el-input>
              <div class="avatar">
                <img :src="form.avatar" alt="头像" />
                <label class="mask">
                  <i class="iconfont icon-icon-test" style="font-size: 20px;"></i>
                  <input ref="avatarInput" type="file" accept="image/*" @change="fileChange" />
                </label>
              </div>
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input size="medium" v-model="form.nickname" placeholder="请填写昵称"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="tel">
              <el-input size="medium" v-model="form.tel" placeholder="请填写电话"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input size="medium" v-model="form.email" placeholder="请填写邮箱"></el-input>
            </el-form-item>
            <el-form-item label="wx二维码" prop="wx">
              <upload-imgs :min-num="1" :max-num="1" ref="wxEle" :rules="rules" :value="wxData" />
              <el-input type="hidden" v-model="form.wx" />
            </el-form-item>
            <el-form-item label="qq二维码" prop="qq">
              <upload-imgs :min-num="1" :max-num="1" ref="qqEle" :rules="rules" :value="qqData" />
              <el-input type="hidden" v-model="form.qq" />
            </el-form-item>
            <el-form-item label="签名" prop="sign">
              <el-input size="medium" v-model="form.sign" placeholder="请填写签名"></el-input>
            </el-form-item>
            <el-form-item label="自我介绍" prop="introduce">
              <el-input size="medium" type="textarea" :rows="4" placeholder="请填写自我介绍" v-model="form.introduce">
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
    <!-- 修改头像 -->
    <el-dialog
      title="裁剪"
      :visible.sync="cropVisible"
      width="300px"
      :append-to-body="true"
      :close-on-click-modal="false"
      custom-class="croppa-dialog"
      center
    >
      <div style="text-align: center;">
        <div class="avatar-croppa-container">
          <croppa
            ref="croppa"
            :width="cropRule.width"
            :height="cropRule.height"
            :zoom-speed="30"
            :disable-drag-and-drop="false"
            :show-remove-button="false"
            :prevent-white-space="true"
            :disable-click-to-choose="false"
            :disable-scroll-to-zoom="false"
            :show-loading="true"
            :quality="quality"
            :initial-image="cropImg"
          ></croppa>
        </div>
        <div style="margin-top: 1em;">通过鼠标滚轮调节头像大小</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cropVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleCrop" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import user from '@/model/user'
import { mapActions, mapGetters } from 'vuex'
import Vue from 'vue'
import Croppa from 'vue-croppa'
import 'vue-croppa/dist/vue-croppa.css'
import defaultAvatar from '@/assets/image/user/user.png'
import UploadImgs from '@/component/base/upload-image'
import Utils from '@/lin/util/util'

Vue.use(Croppa)

const width = 150
const height = 150

export default {
  name: 'center',
  components: { UploadImgs },
  data() {
    return {
      formLoading: false,
      form: {
        username: '',
        nickname: '',
        avatar: '',
        email: '',
        sign: '',
        introduce: '',
        tel: '',
        qq: '',
        wx: '',
      },
      formRules: {
        username: [{ trigger: 'blur', required: true }],
        nickname: [{ trigger: 'blur', required: true }],
        avatar: [{ trigger: 'blur', required: true }],
        email: [{ trigger: 'blur', required: true }],
        // sign: [{ trigger: 'blur', required: true }],
        introduce: [{ trigger: 'blur', required: true }],
        // tel: [{ trigger: 'blur', required: true }],
        // qq: [{ trigger: 'blur', required: true }],
        // wx: [{ trigger: 'blur', required: true }],
      },
      cropRule: {
        width,
        height,
      },
      cropVisible: false,
      cropImg: '',
      croppa: {},
      imgInfo: null,
      quality: 1,
      rules: {
        minWidth: 10,
        minHeight: 10,
        maxSize: 5,
      },
      qqData: [],
      wxData: [],
    }
  },
  computed: {
    ...mapGetters(['user']),
  },
  watch: {
    cropVisible(val) {
      if (!val) {
        this.$refs.croppa.remove()
        this.cropImg = ''
        this.imgInfo = null
      }
    },
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions(['loginOut', 'setUserAndState']),
    fileChange(evt) {
      if (evt.target.files.length !== 1) {
        return
      }
      const imgFile = evt.target.files[0]
      // 验证文件大小是否符合要求, 不大于 5M
      if (imgFile.size > 1024 * 1024 * 5) {
        this.$message.error('文件过大超过5M')
        // 清空输入框
        this.clearFileInput(this.$refs.avatarInput)
        return
      }

      // 验证图像是否符合要求
      const imgSrc = window.URL.createObjectURL(imgFile)
      const image = new Image()
      image.src = imgSrc
      image.onload = () => {
        const w = image.width
        const h = image.height
        if (w < 50) {
          this.$message.error('图像宽度过小, 请选择大于50px的图像')
          // 清空输入框
          this.clearFileInput(this.$refs.avatarInput)
          return
        }
        if (h < 50) {
          this.$message.error('图像高度过小, 请选择大于50px的图像')
          // 清空输入框
          this.clearFileInput(this.$refs.avatarInput)
          return
        }
        // 验证通过, 打开裁剪框
        this.cropImg = imgSrc
        this.cropVisible = true
        if (this.$refs.croppa) {
          this.$refs.croppa.refresh()
        }
      }
      image.onerror = () => {
        this.$message.error('获取本地图片出现错误, 请重试')
        // 清空输入框
        this.clearFileInput(this.$refs.avatarInput)
      }
    },
    async handleCrop() {
      // 获取裁剪数据
      const blob = await this.$refs.croppa.promisedBlob('image/jpeg', 0.8)
      // 构造为文件对象
      const file = new File([blob], 'avatar.jpg', {
        type: 'image/jpeg',
      })

      this.$axios({
        method: 'post',
        url: '/cms/file',
        data: {
          file,
        },
      }).then(res => {
        // 清空输入框
        this.clearFileInput(this.$refs.avatarInput)
        if (!Array.isArray(res) || res.length !== 1) {
          this.$message.error('头像上传失败, 请重试')
        } else {
          this.form.avatar = res[0].url
          this.cropVisible = false
        }

        // TODO: 错误码处理
        // if (res.code === 10110) {
        //   throw new Error('文件体积过大')
        // }
        // return this.$axios({
        //   method: 'put',
        //   url: '/cms/user',
        //   data: {
        //     avatar: res[0].path,
        //   },
        // })
        //   .then(putRes => {
        //     // eslint-disable-line
        //     if (putRes.code < window.MAX_SUCCESS_CODE) {
        //       this.$message({
        //         type: 'success',
        //         message: '更新头像成功',
        //       })
        //       this.cropVisible = false
        //       // 触发重新获取用户信息
        //       return User.getInformation()
        //     }
        //     return Promise.reject(new Error('更新头像失败'))
        //   })
        //   .then(infoRes => {
        //     // eslint-disable-line
        //     // 尝试获取当前用户信息
        //     const data = infoRes
        //     this.setUserAndState(data)
        //   })
      })
    },
    async init() {
      this.formLoading = true
      const { isSuccess, data } = await user.getUser()
      if (isSuccess) {
        this.form = data
        if (data.qq) {
          this.qqData = [{ display: data.qq }]
        }
        if (data.wx) {
          this.wxData = [{ display: data.wx }]
        }
      }
      if (!this.form.avatar) {
        this.form.avatar = defaultAvatar
      }
      this.formLoading = false
    },
    async submitForm(formName) {
      this.form.qq = await Utils.getImages(this.$refs.qqEle)
      this.form.wx = await Utils.getImages(this.$refs.wxEle)
      this.$refs[formName].validate(async valid => {
        // eslint-disable-line
        if (valid) {
          const { isSuccess, data, message } = await user.updateUser(this.form)
          this.$message({
            type: isSuccess ? 'success' : 'error',
            message,
          })
          if (isSuccess) {
            this.setUserAndState(data)
          }
          // const res = await User.updatePassword(this.form)
          // if (res.code < window.MAX_SUCCESS_CODE) {
          //   this.$message.success(`${res.message}`)
          //   this.resetForm(formName)
          //   this.dialogFormVisible = false
          //   setTimeout(() => {
          //     this.loginOut()
          //     const { origin } = window.location
          //     window.location.href = origin
          //   }, 1000)
          // }
        } else {
          this.$message.error('请填写正确的信息')
          return false
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    clearFileInput(ele) {
      // eslint-disable-next-line
      ele.value = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  .wrap {
    max-width: 800px;
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      cursor: pointer;
      overflow: hidden;
      position: relative;
      .mask {
        opacity: 0;
        transition: all 0.2s;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        color: white;

        input {
          display: none;
        }
      }

      &:hover {
        .mask {
          opacity: 1;
        }
      }
    }
  }
}
</style>
