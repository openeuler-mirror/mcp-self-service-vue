<template>
  <div class="register-form">
    <div class="form-title">
      <img class="logo-pic" src="~@/assets/hnkylin/kylin-logo.png" alt srcset />
      <p class="login-top-intro white-p">麒麟信安云</p>
    </div>
    <el-form
      ref="registerForm"
      :model="registerData"
      :rules="registerRules"
      label-width="80px"
      label-position="left"
      size="mini"
    >
      <h3 class="title">注册</h3>

      <el-form-item label="组织" prop="organization_id">
        <el-cascader
          v-model="organizationDefault"
          class="login-infor-input"
          :options="organizationList"
          :props="cascaderprops"
          placeholder
          @change="handleOrganizationChange"
        />
      </el-form-item>

      <el-form-item prop="name" label="用户名">
        <el-input
          v-model="registerData.name"
          class="login-infor-input"
          placeholder
          name="name"
          type="text"
          auto-complete="on"
        />
        <el-tooltip effect="light" placement="bottom-end">
          <div slot="content">
            用户名支持字母、数字进行组合，字符长度为6~18位
          </div>
          <img src="~@/assets/hnkylin/tooltip.png" alt />
        </el-tooltip>
      </el-form-item>
      <el-form-item prop="realname" label="昵称">
        <el-input
          v-model="registerData.realname"
          class="login-infor-input"
          placeholder="真实姓名"
          name="realname"
          type="text"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input
          v-model="registerData.password"
          class="login-infor-input"
          type="password"
          placeholder="长度6~18位"
          name="password"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="checkPwd" label="确定密码">
        <el-input
          v-model="registerData.checkPwd"
          class="login-infor-input"
          type="password"
          placeholder="长度6~18位"
          name="checkPwd"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="mobile" label="手机号">
        <el-input
          v-model="registerData.mobile"
          class="login-infor-input"
          type="text"
          placeholder
          name="mobile"
          auto-complete="on"
          oninput="value=value.replace(/[^\d]/g,'')"
          maxlength="11"
        />
      </el-form-item>
      <el-form-item prop="description" label="申请理由">
        <el-input
          v-model="registerData.description"
          class="login-infor-input"
          type="text"
          placeholder
          name="description"
          auto-complete="on"
        />
      </el-form-item>
      <div class="login-btn-content">
        <el-button
          :loading="loading"
          type="primary"
          @click.native.prevent="handleRegister"
          >注 册</el-button
        >
      </div>

      <div class="link-herf">
        <el-link class="register" type="primary" @click.native.prevent="toLogin"
          >已有账号? 立即登录</el-link
        >
      </div>
    </el-form>
  </div>
</template>

<script>
import validate from "@/utils/validate";
import { register, getOrganizationList } from "@/api/login";
import md5 from "js-md5";
export default {
  name: "RegisterForm",
  props: {},
  data() {
    const validateCheckPwd = (rule, value, callback) => {
      if (value !== this.registerData.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // 登录表单信息
      registerData: {
        organization_id: 0,
        name: "",
        realname: "",
        password: "",
        mobile: "",
        description: "",
      },
      organizationDefault: [],
      organizationList: [], // 组织列表
      cascaderprops: {
        checkStrictly: true,
        emitPath: false,
        value: "value",
        label: "label",
        children: "children",
      },
      // 注册信息校验
      registerRules: {
        organization_id: [
          { required: true, message: "请选择组织", trigger: "blur" },
        ],
        name: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "用户名长度应控制在 6 ~ 18 个字符",
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: "用户名只能由英文字母、数字组合",
            validator: validate.validateCharEnNum,
          },
        ],
        realname: [
          { required: true, message: "真实姓名不能为空", trigger: "blur" },
          {
            max: 12,
            message: "真实姓名长度不允许超过 12 个字符",
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: "真实姓名只能由中文、英文字母、数字和下划线组合",
            validator: validate.validateCharNum,
          },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "密码长度应控制在 6 ~ 18 个字符",
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: "密码只能由英文字母、数字组合",
            validator: validate.validateCharEnNum,
          },
        ],
        checkPwd: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          {
            trigger: "blur",
            message: "确认密码和密码输入不一致",
            validator: validateCheckPwd,
          },
        ],
        description: [
          { required: true, message: "注册原因不能为空", trigger: "blur" },
          { max: 30, message: "原因长度不允许超过 30 个字符", trigger: "blur" },
        ],
      },
      loading: this.loading, // 注册按钮是否正在操作中
      redirect: this.redirect,
    };
  },
  created() {
    this.getOrganizationList();
  },
  methods: {
    // 获取组织列表
    getOrganizationList() {
      getOrganizationList().then((res) => {
        this.foreachOrganizationList(res).forEach((item) =>
          this.organizationList.push(item)
        );
        // this.foreachOrganizationIds(res);
        // this.registerData.organization_id = this.organizationDefault[0];
        this.registerData.organization_id = "";
      });
    },
    // 循环，赋值value 和 label
    foreachOrganizationIds(arr) {
      if (arr.length) {
        const item = arr[0];
        // this.organizationDefault.push(item.organizationId);
        if (item.children && item.children.length > 0) {
          this.foreachOrganizationIds(item.children);
        }
      }
    },
    // 循环，赋值value 和 label
    foreachOrganizationList(arr) {
      if (arr.length) {
        arr.forEach((item, index) => {
          item["label"] = item.organizationName;
          item["value"] = item.organizationId;
          if (item.children && item.children.length > 0) {
            item["children"] = this.foreachOrganizationList(item.children);
          } else {
            item["children"] = null;
          }
        });
      }
      return arr;
    },
    // 进行注册
    handleRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.handleSubmitForm();
        }
      });
    },
    handleSubmitForm() {
      // TODO 注册失败的几种状态
      register({
        userName: this.registerData.name,
        realName: this.registerData.realname,
        password: md5(this.registerData.password),
        mobile: this.registerData.mobile,
        applyReason: this.registerData.description,
        organizationId: this.registerData.organization_id, // 组织ID
      })
        .then((res) => {
          this.alertTips("注册成功!", "success");
          this.loading = true;
          this.toLogin();
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    // 跳转到登录页

    toLogin() {
      this.$emit("toggleRegister", false);
    },
    // 选择组织
    handleOrganizationChange(ids) {
      this.registerData.organization_id = ids;
    },
  },
};
</script>

<style lang="scss">
// .form-box {
//   .register-form {
//     .el-form-item {
//       margin-bottom: 20px;

//       .el-input {
//         width: 240px;

//         input {
//           background: transparent;
//           border: 1px solid #d5d5d5;
//           -webkit-appearance: none;
//           border-radius: 5px;
//           padding: 12px 5px 12px 15px;
//           height: 30px;

//           &:-webkit-autofill {
//             box-shadow: 0 0 0px 1000px $light_gray inset !important;
//           }
//         }
//       }
//       img {
//         border-width: 0px;
//         position: absolute;
//         right: 0px;
//         top: 5px;
//         width: 20px;
//         height: 20px;
//       }
//     }
//     .el-button {
//       margin-top: 20px;
//     }
//   }
// }
.register-form {
  width: 528px;
  border-radius: 10px;
  padding: 10px 60px;
  margin-left: 200px;
  background-color: $light_gray;
  position: absolute;
  left: 45vw;
  top: 50%;
  transform: translateY(-50%);
  .login-form {
    position: relative;
    margin: 0 auto;
    overflow: hidden;
    .el-form-item {
      background: $light_gray;
      margin-bottom: 18px;
    }
  }
  .login-infor-input {
    background: transparent;
    width: 100%;
  }
  .el-tooltip {
    border-width: 0px;
    position: absolute;
    right: 5px;
    top: 4px;
    width: 20px;
    height: 20px;
  }
  .title {
    color: #393939;
    font-size: 30px;
    font-weight: 400;
  }
  .link-herf {
    font-size: 13px;
    color: #fff;
    padding: 2px;
    margin-bottom: 15px;
    .register {
      float: right;
    }
  }
  .login-btn-content {
    width: 100%;
    margin-bottom: 20px;
    height: 60px;
    position: relative;
    .el-button {
      width: 100%;
      height: 40px;
      font-size: 15px;
      font-weight: bold;
      border-radius: 20px;
      background: linear-gradient(to right, #4bddff, #287cff);
      border: none;
      position: absolute;
      z-index: 2;
    }
    .el-button:after {
      content: " ";
      width: 94%;
      height: 40px;
      background: linear-gradient(to right, #4bddff, #287cff);
      font-weight: bold;
      position: absolute;
      left: 3.5%;
      top: 21px;
      border-radius: 20px;
      z-index: -1;
      mask: linear-gradient(0deg, transparent, #fff);
      filter: blur(20px);
    }
  }
  .form-title {
    display: flex;
    align-items: center;
    position: absolute;
    top: -84px;
    width: 528px;
    justify-content: center;
    left: 0;
    p {
      font-size: 30px;
      color: white;
      margin-left: 10px;
      font-style: oblique;
    }
    .logo-pic {
      width: 47px;
      height: 47px;
    }
  }
}
</style>
