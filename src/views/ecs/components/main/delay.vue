<template>
  <div class="drawer-content">
    <div class="service-delay">
      <el-form ref="form" label-width="130px" :model="formData" :rules="rules">
        <el-form-item label="到期时间" prop="deadline_time">
          <el-date-picker
            v-model="formData.deadline_time"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="dataOption"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="理由" prop="apply_reason">
          <el-input
            v-model="formData.apply_reason"
            type="textarea"
            :rows="3"
            placeholder=""
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>
    <foot-btn
      class="drawer-foot"
      @confirm="handlerConfirm"
      @cancel="handlerCancel"
    />
  </div>
</template>

<script>
import footBtn from "@/components/Footbtn";
import { applyDeferredMachine } from "@/api/serverVm";
import ReMessage from "@/utils/message";
export default {
  components: {
    footBtn,
  },
  props: ["applyDeferredData"],

  data() {
    return {
      // 基本信息表单数据
      formData: {
        deadline_time: "",
        apply_reason: "",
      },
      dataOption: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      rules: {
        deadline_time: [
          { required: true, message: "到期时间不能为空", trigger: "blur" },
        ],
        apply_reason: [
          {
            required: true,
            trigger: "blur",
            message: "申请原因只能由中文、英文、数字组合",
            validator: this.validateCharEnNum,
          },
        ],
      },
    };
  },

  methods: {
    // 提交申请
    handlerConfirm() {
      const that = this;
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.alertConfirm("确定延期云服务器？")
            .then((_) => {
              that.onSubmitApplyForm();
            })
            .catch((_) => {});
        } else {
          return false;
        }
      });
    },
    // 取消申请
    handlerCancel() {
      this.$refs.form.resetFields();
      this.$parent.closeDrawer();
    },
    onSubmitApplyForm() {
      let userMachineUuid = this.applyDeferredData.serverVmUuid;
      let clusterId = this.applyDeferredData.clusterId;
      let machineName = this.applyDeferredData.aliasName;
      let deadlineTime = this.formData.deadline_time;
      let applyReason = this.formData.apply_reason;
      //申请云服务器
      applyDeferredMachine({
        userMachineUuid,
        machineName,
        deadlineTime,
        clusterId,
        applyReason,
      }).then((res) => {
        ReMessage.success("延期申请已提交，请等管理员审核");
        this.$parent.closeDrawer();
      });
    },
  },
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";

.service-delay {
  flex: 1;
  @include formStyle;
  .el-input {
    width: 380px;
  }
  .el-textarea {
    width: 380px;
    max-height: 100px;
  }
  .el-form-item__label {
    width: 130px;
  }
  .el-form-item__content {
    margin-left: 130px;
  }
}
</style>
