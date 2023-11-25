<template>
  <div class="login-container">
    <div class="login-top-container">
      <div class="wrapper">
        <registerForm v-if="isRegister" @toggleRegister="toggleRegister" />
        <loginForm v-else @toggleRegister="toggleRegister" />
      </div>
    </div>
    <div class="copyright center">
      版权所有 © 2006-2022 湖南麒麟. 保留所有权利。
    </div>
  </div>
</template>

<script>
import loginForm from './components/login-form'
import registerForm from './components/register-form'

export default {
  name: 'Login',
  components: {
    loginForm,
    registerForm
  },
  data() {
    return {
      isRegister: false, // 是否显示注册页
      loading: false,
      tip1: '麒麟自服务系统针对云和私有云环境的云基础设施等资源管理，提供“云管理+云服务+云运营+云运维”四位一体的私立云管理服务',
      tip2: '以统一化的服务交付，精细化和可视化的成本运营分析，帮助企业从传统环境平滑迁移到多云环境，保持企业云架构系统的持续优化'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    // 登录、注册页切换方法
    toggleRegister: function(flag) {
      this.isRegister = flag
    }
  }
}
</script>

<style lang="scss">
/* reset element-ui css */

.login-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .login-top-container {
    background: #172238;
    position: relative;
    height: calc(100vh - 30px);
    .wrapper {
      max-width: 90%;
      height: 100%;
      margin: 0px auto;
      background: $loginBg url('~@/assets/hnkylin/bigbg.png') no-repeat 
        center;
      background-size: 100% 100%;
      .main {
        display: flex;
        margin: 68px auto;
        overflow: hidden;
      }
    }
  }
  .copyright {
    font-family: MicrosoftYaHei;
    font-size: 12px;
    font-weight: normal;
    text-align: center;
    line-height: 30px;
    color: #9c9c9c;
  }
  .white-p {
    color: #e9eaee;
  }
  .login-intro {
    position: absolute;
    top: 32%;
    left: 20%;
    .login-top-intro {
      font-weight: 400;
      font-size: 28px;
      margin-bottom: 33px;
    }
  }
  .login-intro-bac {
    width: 525px;
    height: 185px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 15px;
    .intro-content {
      display: flex;
      align-items: center;
      overflow: hidden;
      img {
        margin-right: 5px;
      }
      .intro-p{
        line-height: 30px;
      }
    }
  }
}
</style>
