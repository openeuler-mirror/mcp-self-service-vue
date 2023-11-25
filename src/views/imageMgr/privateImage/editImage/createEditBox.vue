<template>
  <div class="drawer-content">
    <div class="create-new-form">
      <div class="template-box">
        <el-form
          ref="createDataForm"
          label-width="auto"
          :model="createDataFormData"
          :rules="rulesTemplate"
        >
          <!-- 镜像名称 -->
          <el-form-item label="镜像名称" prop="imageName">
            <el-input
              v-model="createDataFormData.imageName"
              placeholder="镜像名称"
            />
          </el-form-item>
          <!-- 描述 -->
          <el-form-item label="描述" prop="imageRemark">
            <el-input
              type="textarea"
              placeholder="描述"
              :autosize="{ minRows: 2, maxRows: 4 }"
              v-model="createDataFormData.imageRemark"
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
import footBtn from "@/components/Footbtn";
import { modifyImage } from "@/api/imageApi";
export default {
  components: {
    footBtn,
  },
  props: {
    formOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      oriFormData: {
        imageId: "",
        imageName: "", // 镜像名称
        imageRemark: "", // 镜像描述
        zoneIds: [], // 可用区id
      },
      createDataFormData: {},

      rulesTemplate: {
        imageName: [
          {
            required: true,
            message: "请输入镜像名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {},
  created() {},
  computed: {},
  mounted() {
    this.setPageData();
  },
  methods: {
    setPageData() {
      this.createDataFormData = JSON.parse(JSON.stringify(this.oriFormData));
      let { formData } = this.formOptions;
      this.createDataFormData = {
        imageId: formData.imageId,
        imageName: formData.imageName, // 镜像名称
        imageRemark: formData.imageRemark, // 镜像描述
        visibleType: formData.visibleType,
        zoneIds: "", // 可用区id
      };
    },

    // 提交
    handlerConfirm() {
      let { editflag } = this.formOptions;
      this.$refs.createDataForm.validate((valid) => {
        if (valid) {
          // 编辑信息
          this.commitEdit();
        } else {
          return false;
        }
      });
    },

    commitEdit() {
      let editData = {
        imageId: this.createDataFormData.imageId, // 镜像id
        imageName: this.createDataFormData.imageName, // 镜像名称
        imageRemark: this.createDataFormData.imageRemark, // 镜像描述
        zoneIds: this.createDataFormData.zoneIds.toString(), // 镜像可用区
      };
      modifyImage(editData)
        .then((res) => {
          this.alertTips("操作成功", "success");
          this.$parent.closeDrawer();
        })
        .catch((err) => {
          this.alertTips(err);
          this.$parent.closeDrawer();
        });
    },

    handlerCancel() {
      this.$parent.closeDrawer();
    },
    handleCloseCreate(done) {
      this.$parent.closeDrawer();
    },
  },
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";
@include DrawerRtl;

.create-new-form {
  @include formStyle;
  flex: 1;
  max-height: 82vh;
  overflow: auto;
  $input-width: 375px;

  .el-input {
    width: $input-width;
  }

  .el-textarea {
    width: $input-width;
  }
}
</style>
