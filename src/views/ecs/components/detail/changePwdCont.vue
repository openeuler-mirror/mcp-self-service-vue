<template>
  <div class="drawer-content">
    <div class="create-new-network">
      <div class="template-box">
        <el-form
          ref="changePwdForm"
          label-width="100px"
          :model="changePwdFormData"
          :rules="rulesTemplate"
        >
          <!-- <el-form-item label="原密码" prop="oldPwd">
            <el-input
              v-model="changePwdFormData.oldPwd"
              type="password"
              placeholder="长度6~18位"
              name="password"
              auto-complete="on"
            />
          </el-form-item> -->
          <el-form-item label="新密码" prop="newPwd">
            <el-input
              v-model="changePwdFormData.newPwd"
              placeholder="长度6~18位"
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPwd">
            <el-input
              v-model="changePwdFormData.confirmPwd"
              placeholder="长度6~18位"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <foot-btn
      class="drawer-foot"
      @confirm="handlerConfirm"
      @cancel="handlerCancel"
    />
  </div>
</template>
<script>
import validate from "@/utils/validate";
import footBtn from "@/components/Footbtn";
import { resetRemotePassword } from "@/api/serverVm";
export default {
  components: {
    footBtn,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    formOptions: {
      formData: {},
    },
  },
  data() {
    const validateCheckPwd = (rule, value, callback) => {
      if (value !== this.changePwdFormData.newPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      drawerVisible: this.visible,
      clusterId: this.$route.params.clusterId,
      changePwdFormData: {
        oldPwd: "",
        newPwd: "",
        confirmPwd: "",
      },
      uuid: "",
      rulesTemplate: {
        // 原密码
        oldPwd: [
          { required: true, message: "原密码不能为空", trigger: "blur" },
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

        // 新密码
        newPwd: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "新密码长度应控制在 6 ~ 18 个字符",
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: "新密码只能由英文字母、数字组合",
            validator: validate.validateCharEnNum,
          },
        ],
        confirmPwd: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          {
            trigger: "blur",
            message: "确认密码和密码输入不一致",
            validator: validateCheckPwd,
          },
        ],
      },
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
    },
  },
  created() {
    this.uuid = this.formOptions.formData.uuid;
  },
  methods: {
    // 提交
    handlerConfirm() {
      this.$refs.changePwdForm.validate((valid) => {
        if (valid) {
          this.commitCreate();
        } else {
          return false;
        }
      });
    },
    commitCreate() {
      let newPwd = this.changePwdFormData.newPwd;

      resetRemotePassword({
        uuid: this.uuid,
        clusterId: this.clusterId,
        remotePassword: newPwd,
      })
        .then((res) => {
          this.alertTips("密码重置成功!", "success");
          this.$parent.closeDrawer();
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    handlerCancel() {
      this.$parent.closeDrawer();
    },
  },
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";

.create-new-network {
  @include formStyle;
  flex: 1;
  max-height: 82vh;
  overflow: auto;
  $input-width: 375px;
  .template-box {
    margin-bottom: 60px;
  }
  .el-input {
    width: $input-width;
  }
}
</style>
