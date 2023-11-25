<template>
  <div class="account app-container">
    <div class="account-form-box">
      <h3>基本信息</h3>
      <el-form
        ref="form"
        :label-position="labelPosition"
        label-width="130px"
        :model="form"
        :rules="rules"
      >
        <el-form-item label="用户名">
          <span>{{ loginUserInfo.userName }}</span>
        </el-form-item>
        <el-form-item v-show="textVisible.name" label="真实姓名">
          <span>{{ loginUserInfo.realName }}</span>
          <i class="el-icon-edit-outline" @click="handleEditName" />
        </el-form-item>
        <el-form-item v-if="!textVisible.name" label="真实姓名" prop="name">
          <el-input v-model="form.name" size="mini" />
        </el-form-item>
        <el-form-item v-show="textVisible.pwd" label="密码">
          <span>***********</span>
          <i class="el-icon-edit-outline" @click="handleEditPwd" />
        </el-form-item>
        <el-form-item v-if="!textVisible.pwd" label="原始密码" prop="pwd">
          <el-input v-model="form.pwd" type="password" size="mini" />
        </el-form-item>
        <el-form-item v-if="!textVisible.pwd" label="新密码" prop="newPwd">
          <el-input v-model="form.newPwd" type="password" size="mini" />
        </el-form-item>
        <el-form-item
          v-if="!textVisible.pwd"
          label="确认密码"
          prop="confirmPwd"
        >
          <el-input v-model="form.confirmPwd" type="password" size="mini" />
        </el-form-item>

        <!-- <el-form-item label="组织">
          <span>{{loginUserInfo.organizationName}}</span>
        </el-form-item> -->
        <el-form-item label="手机号">
          <span>{{ loginUserInfo.mobile }}</span>
        </el-form-item>
        <el-form-item label="原因">
          <span>{{ loginUserInfo.remark }}</span>
        </el-form-item>
      </el-form>
    </div>
    <foot-btn
      class="drawer-foot"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script>
import footBtn from "@/components/Footbtn";
import { updateRealName, updatePwd } from "@/api/login";
import { getInfo } from "@/api/user";
import md5 from "js-md5";
import validate from "@/utils/validate";
export default {
  components: {
    footBtn,
  },
  data() {
    var validatePassWord = (rule, value, callback) => {
      if (value !== this.form.newPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      labelPosition: "left",
      textVisible: {
        name: true,
        pwd: true,
      },
      form: {
        name: "",
        pwd: "",
        newPwd: "",
        confirmPwd: "",
      },
      rules: {
        name: [
          { required: true, message: "真实姓名不能为空", trigger: "blur" },
          {
            min: 1,
            max: 12,
            message: "真实姓名长度应控制在 1 ~ 12 个字符",
            trigger: "blur",
          },
        ],
        pwd: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "密码长度应控制在 6 ~ 18 个字符",
            trigger: "blur",
          },
          // {
          //   trigger: "blur",
          //   message: "密码只能由英文字母、数字组合",
          //   validator: validate.validateCharEnNum,
          // },
        ],
        newPwd: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "密码长度应控制在 6 ~ 18 个字符",
            trigger: "blur",
          },
          // {
          //   trigger: "blur",
          //   message: "密码只能由英文字母、数字组合",
          //   validator: validate.validateCharEnNum,
          // },
        ],
        confirmPwd: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "密码长度应控制在 6 ~ 18 个字符",
            trigger: "blur",
          },
          { validator: validatePassWord, trigger: "blur", required: true },
        ],
      },
      loginUserInfo: {},
    };
  },
  created() {
    // 申请云服务器
    getInfo().then((data) => {
      this.loginUserInfo = data;
    });
  },
  mounted() {},
  methods: {
    handleConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.handleSubmitForm()
            .then((res) => {
              if (!this.textVisible.name) {
                this.alertTips(
                  "申请修改真实姓名成功，请等待审核生效!",
                  "success"
                );
              } else {
                this.alertTips("修改成功!", "success");
              }
              this.handleCancel();
            })
            .catch((err) => {
              this.alertTips(err);
            });
        }
      });
    },

    async handleSubmitForm() {
      const {
        name: realName,
        newPwd: password,
        confirmPwd: newConfirmPwd,
        pwd: oldPassword,
      } = this.form;

      if (realName) {
        await updateRealName({ realName });
      }
      if (password) {
        if (password != newConfirmPwd) {
          //两次密码不一致

          this.alertTips("两次密码不一致，请重新输入");
          return false;
        }
        await updatePwd({
          password: md5(password),
          oldPassword: md5(oldPassword),
        });
      }
    },
    handleCancel() {
      this.textVisible.name = true;
      this.textVisible.pwd = true;
      this.$refs.form.resetFields();
    },
    handleEditName() {
      this.textVisible.name = false;
    },
    handleEditPwd() {
      this.textVisible.pwd = false;
    },
  },
};
</script>

<style lang="scss">
.account {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  position: relative;

  .account-form-box {
    @include formStyle;
    flex: 1;
    overflow: auto;
    .el-icon-edit-outline {
      margin-left: 15px;
    }
    .el-input {
      width: 180px;
    }
  }
  .drawer-foot {
    padding: 25px 70px;
    margin: 0 -20px;
  }
}
</style>
