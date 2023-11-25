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
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="模板镜像" name="first">
        <!-- 选择模板 -->
        <apply ref="drawerApply" @closeDrawer="closeDrawer" />
      </el-tab-pane>
      <el-tab-pane label="选择ISO镜像" name="second">
        <!-- 选择ISO镜像 -->
        <applyiso ref="drawerApplyIso" @closeDrawer="closeDrawer" />
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script>
import apply from "../apply-services/index.vue";
import applyiso from "../apply-iso/index.vue";
export default {
  components: {
    apply,
    applyiso,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      drawerVisible: this.visible,
      selectRowData: new Object(),
      activeName: "first",
    };
  },
  watch: {
    visible(isvis) {
      this.activeName = "first";
      this.drawerVisible = isvis;
    },
  },
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
