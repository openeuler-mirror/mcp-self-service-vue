<template>
  <el-drawer
    size="900px"
    title="申请云服务器"
    direction="rtl"
    custom-class="ecs-apply-drawer"
    :wrapper-closable="false"
    v-if="drawerVisible"
    :visible.sync="drawerVisible"
    :before-close="handleCloseApply"
  >
    <!-- 选择模板 -->
    <apply
      v-if="activeName == 'GVM'"
      ref="drawerApply"
      :formOptions="formOptions"
      @closeDrawer="closeDrawer"
    />
    <!-- 选择ISO镜像 -->
    <applyiso
      v-else-if="activeName == 'ISO'"
      ref="drawerApplyIso"
      :formOptions="formOptions"
      @closeDrawer="closeDrawer"
    />
    <div v-else></div>
  </el-drawer>
</template>

<script>
import apply from "./apply-services/index.vue";
import applyiso from "./apply-iso/index.vue";
export default {
  name: "ImageApplyDrawer",
  components: {
    apply,
    applyiso,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      drawerVisible: this.visible,
      selectRowData: new Object(),
      activeName: "",
      formOptions: {},
    };
  },
  watch: {
    visible(isvis) {
      this.activeName = this.options.imageType;
      this.formOptions = this.options;
      this.drawerVisible = isvis;
    },
  },
  created() {},
  methods: {
    handleCloseApply() {
      this.$emit("update:visible", false);
    },
    closeDrawer() {
      this.$emit("update:visible", false);
    },
    handleClick(tab, event) {},
  },
};
</script>
<style lang="scss" scoped>
.ecs-apply-drawer {
  .el-drawer__body,
  .el-tabs,
  .el-tabs__content {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 0px;
  }
}
</style>
<style lang="scss">
.ecs-apply-drawer {
  .el-tabs__header {
    padding: 0 20px;
  }
  .el-drawer__body,
  .el-tabs,
  .el-tabs__content,
  .el-tab-pane {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 0px;
  }
}
</style>
