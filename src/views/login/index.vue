<template>
  <div class="login-container">
    <div class="login-header">
      <h3 class="title">通用后台管理</h3>
    </div>
    <el-tabs class ="login-tap" v-model="activeName"  @tab-click="handleTapClick">
      <el-tab-pane class="" label="手机登录" name="first">
        <el-form class="login-form" autoComplete="on" :model="phoneForm" :rules="phoneLoginRules" ref="userForm" label-position="left">
          <el-form-item prop="username">
            <span class="svg-container svg-container_login">
              <svg-icon icon-class="user" />
            </span>
            <el-input name="phone" type="text" v-model="phoneForm.phone" autoComplete="on" placeholder="手机号码" />
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password"></svg-icon>
            </span>
            <el-input placeholder="请输入内容" class="el-input-w" v-model="phoneForm.code">

            </el-input>
            <span class="code"><a>获取验证码</a></span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
              登录
            </el-button>
          </el-form-item>
          <div class="tips">
            <span style="margin-right:20px;">username: admin</span>
            <span> password: admin</span>
          </div>
        </el-form>

      </el-tab-pane>
      <el-tab-pane label="账号登录" name="second">
        <el-form class="login-form" autoComplete="on" :model="userForm" :rules="userLoginRules" ref="userForm" label-position="left">
          <el-form-item prop="username">
            <span class="svg-container svg-container_login">
              <svg-icon icon-class="user" />
            </span>
            <el-input name="username" type="text" v-model="userForm.username" autoComplete="on" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password"></svg-icon>
            </span>
            <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="userForm.password" autoComplete="on"
                      placeholder="请输入密码"></el-input>
            <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { validatPhone } from '@/utils/validate'

export default {
  name: 'login',
  data() {
    const validateMobile = (rule, value, callback) => {
      if (!validatPhone(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    return {
      userForm: {
        username: '',
        password: ''
      },
      userLoginRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' },
          { min: 6, message: '密码不能少于6个字符', trigger: 'blur' }]
      },
      phoneForm: {
        phone: '',
        code: ''
      },
      phoneLoginRules: {
        phone: [{ required: true, message: '请输入正确的手机号码', trigger: 'blur', validator: validateMobile }],
        code: [{ required: true, trigger: 'blur' },
          { min: 6, message: '密码不能少于6个字符', trigger: 'blur' }]
      },
      loading: false,
      pwdType: 'password',
      activeName: 'second'
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleTapClick(tab, event) {
      console.log(tab, event)
    },
    handleLogin() {
      if (this.activeName === 'first') {
        this.$refs.phoneForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('Login', this.phoneForm).then(() => {
              this.loading = false
              this.$router.push({ path: '/' })
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else if (this.activeName === 'second') {
        this.$refs.userForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('Login', this.userForm).then(() => {
              this.loading = false
              this.$router.push({ path: '/' })
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    height: 47px;
    width: 85%;
    input {
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      color: #000;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: #000 !important;
      }
    }
  }
  .el-input-w {
    width: 71%;
  }
  .el-form-item {
    border: 1px solid rgba(193, 189, 189, 0.98);
    background: #fff;
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-header{
    width: 520px;
    padding: 35px 35px 0px 35px;
    margin: 120px auto;
    background-color: #fff;
    border-radius: 10px 10px 0 0;

  }
  .login-tap {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: -120px auto;
    height-min: 400px;
    background-color: #fff;
    border-radius: 0 0 10px 10px;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: #000;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .code {
    position: relative;
    background-color: #3a8ee6;
    border-radius: 0 5px 5px 0;
    padding: 18px 11px 19px 11px;
    color: #ffff;
    cursor: pointer;
  }
}
</style>
