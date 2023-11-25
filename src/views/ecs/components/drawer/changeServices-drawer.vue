<template>
  <el-drawer
    size="900px"
    title="变更规格"
    direction="rtl"
    custom-class="ecs-changeServices-drawer"
    v-if="drawerVisible"
    :wrapper-closable="false"
    :visible.sync="drawerVisible"
    :before-close="handleCloseChangeServices"
  >
    <modify
      ref="drawerChangeServices"
      :modifyDeferredData="modifyDeferredData"
    />
  </el-drawer>
</template>

<script>
import modify from "../change-services/index.vue";
export default {
  components: {
    modify,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    selectRowData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      drawerVisible: this.visible,
      modifyDeferredData: null,
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
    },
    selectRowData(selectRow) {
      this.modifyDeferredData = selectRow;
    },
  },
  methods: {
    handleSubmitChangeServices() {},
    handleCloseChangeServices(done) {
      this.$emit("update:visible", false);
      this.$parent.renderTable();
      done();
    },
  },
};
</script>

<style></style>
