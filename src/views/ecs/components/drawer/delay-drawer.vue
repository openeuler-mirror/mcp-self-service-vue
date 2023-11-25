<template>
  <el-drawer
    size="900px"
    title="申请延期"
    direction="rtl"
    custom-class="ecs-delay-drawer"
    :wrapper-closable="false"
    :visible.sync="drawerVisible"
    :before-close="handleCloseDely"
  >
    <delay
      ref="drawerDelay"
      :applyDeferredData="applyDeferredData"
      @confirm="handleSubmitDely"
    />
  </el-drawer>
</template>

<script>
import delay from "../main/delay.vue";
export default {
  components: {
    delay,
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
      applyDeferredData: null,
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
    },
    selectRowData(selectRow) {
      this.applyDeferredData = selectRow;
    },
  },
  methods: {
    handleCloseDely() {
      this.$emit("update:visible", false);
      done();
    },
    handleSubmitDely() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style></style>
