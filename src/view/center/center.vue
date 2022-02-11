<template>
  <div class="tab-box">
    <el-tabs type="border-card">
      <el-tab-pane label="用户信息管理">
        <detail></detail>
      </el-tab-pane>
      <el-tab-pane label="密码管理">
        <div class="wrap">
          <el-row>
            <el-col :lg="16" :md="20" :sm="24" :xs="24">
              <div class="password">
                <el-form
                  :model="form"
                  status-icon
                  :rules="rules"
                  label-position="left"
                  ref="form"
                  label-width="90px"
                  @submit.native.prevent
                >
                  <el-form-item label="原始密码" prop="old_password">
                    <el-input type="password" v-model="form.old_password" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="新密码" prop="new_password">
                    <el-input type="password" v-model="form.new_password" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="确认密码" prop="confirm_password" label-position="top">
                    <el-input type="password" v-model="form.confirm_password" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitForm('form')">保存</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import User from '@/lin/model/user'
import Detail from './detail'

export default {
  name: 'center',
  components: {
    Detail,
  },
  data() {
    const oldPassword = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('原始密码不能为空'))
      }
      if (value.length < 6) {
        callback(new Error('密码长度不能少于6位数'))
      }
      callback()
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能少于6位数'))
      } else {
        if (this.form.checkPassword !== '') {
          this.$refs.form.validateField('confirm_password')
        }
        callback()
      }
    }
    const validatePassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.new_password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      nickname: null,
      form: {
        old_password: '',
        new_password: '',
        confirm_password: '',
      },
      rules: {
        old_password: [{ validator: oldPassword, trigger: 'blur', required: true }],
        new_password: [{ validator: validatePassword, trigger: 'blur', required: true }],
        confirm_password: [{ validator: validatePassword2, trigger: 'blur', required: true }],
      },
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
  methods: {
    ...mapActions(['loginOut', 'setUserAndState']),
    goToCenter() {
      this.$router.push('/center')
    },
    submitForm(formName) {
      if (this.form.old_password === '' && this.form.new_password === '' && this.form.confirm_password === '') {
        this.dialogFormVisible = false
        return
      }
      if (this.form.old_password === this.form.new_password) {
        this.$message.error('新密码不能与原始密码一样')
        return
      }
      this.$refs[formName].validate(async valid => {
        // eslint-disable-line
        if (valid) {
          const res = await User.updatePassword(this.form)
          if (res.code < window.MAX_SUCCESS_CODE) {
            this.$message.success(`${res.message}`)
            this.resetForm(formName)
            this.dialogFormVisible = false
            setTimeout(() => {
              this.loginOut()
              const { origin } = window.location
              window.location.href = origin
            }, 1000)
          }
        } else {
          console.log('error submit!!')
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
.tab-box {
  padding: 20px;
}
</style>
