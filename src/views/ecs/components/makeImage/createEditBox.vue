<template>
  <div class="drawer-content">
    <div class="create-new-form">
      <div class="template-tipbox">
        <div class="template-tipbox-icon el-icon-warning"></div>
        <div class="template-tipbox-mag">
          镜像中只包含选择云服务器的系统盘，为了避免镜像数据的不全面，请将云服务器的其他磁盘的重要数据迁移到系统盘中再来制作镜像！
        </div>
      </div>
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
              placeholder="请输入镜像名称"
            />
          </el-form-item>
          <!-- 描述 -->
          <el-form-item label="描述" prop="imageRemark">
            <el-input
              type="textarea"
              placeholder="请输入描述"
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
import { makeImage } from "@/api/imageApi";
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
        selectUuid: "", // 选择云服务器uuid
        imageName: "", // 镜像名称
        imageRemark: "", // 镜像描述
        selectMachineName: "", // 选择云服务器名称
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

      zoneList: [],
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
        selectUuid: formData.serverVmUuid, // 选择云服务器uuid
        selectMachineName: formData.aliasName, // 选择云服务器名称
        clusterId: formData.clusterId,
        imageId: "",
        imageName: "", // 镜像名称
        imageRemark: "", // 镜像描述
        zoneIds: "", // 可用区id
      };
    },

    // 提交
    handlerConfirm() {
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
        // imageId: this.createDataFormData.imageId, // 镜像id
        selectUuid: this.createDataFormData.selectUuid, // 选择云服务器uuid
        selectClusterId: this.createDataFormData.clusterId,
        selectMachineName: this.createDataFormData.selectMachineName, // 选择云服务器名称
        imageName: this.createDataFormData.imageName, // 镜像名称
        imageRemark: this.createDataFormData.imageRemark, // 镜像描述
        zoneIds: this.createDataFormData.zoneIds.toString(), // 镜像可用区
      };
      makeImage(editData)
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
.template-tipbox {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  background-color: #fdf6ec;
  border-color: #faecd8;
  color: #e6a23c;
  padding: 20px;
  line-height: 20px;
  .template-tipbox-icon {
    width: 20px;
    margin-right: 15px;
    font-size: 20px;
  }
  .template-tipbox-mag {
    flex: 1;
  }
}
</style>
