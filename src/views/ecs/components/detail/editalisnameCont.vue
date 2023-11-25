<template>
  <div class="drawer-content">
    <div class="create-new-network">
      <div class="template-box">
        <el-form
          ref="changePwdForm"
          label-width="100px"
          :model="changeNameFormData"
          :rules="rulesTemplate"
        >
          <!-- <el-form-item label="原名称">
            <el-input
              v-model="changeNameFormData.oldName"
              placeholder="长度6~18位"
            />
          </el-form-item> -->
          <el-form-item label="名称" prop="newName">
            <el-input
              v-model="changeNameFormData.newName"
              placeholder="长度6~32 位"
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
import { updateMachineName } from "@/api/serverVm";
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
    return {
      drawerVisible: this.visible,
      changeNameFormData: {
        oldName: "",
        newName: "",
      },
      uuid: "",
      rulesTemplate: {
        // 原密码
        oldName: [
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

        // 新名称
        newName: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          {
            min: 6,
            max: 32,
            message: "名称长度应控制在 6 ~ 32 个字符",
            trigger: "blur",
          },
          {
            required: true,
            trigger: "blur",
            message: "名称不能出现特殊字符",
            validator: validate.special_char,
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
    let formData = JSON.parse(JSON.stringify(this.formOptions.formData));
    this.uuid = formData.uuid;
    this.changeNameFormData.newName = formData.alisname;
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
      let newName = this.changeNameFormData.newName;

      updateMachineName({
        uuid: this.uuid,
        clusterId: this.clusterId,
        aliasName: newName,
      })
        .then((res) => {
          this.alertTips("名称已修改成功!", "success");
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
@include DrawerRtl;
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
