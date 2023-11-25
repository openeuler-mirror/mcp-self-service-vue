<template>
  <el-drawer
    size="900px"
    title="修改名称"
    direction="rtl"
    custom-class="ecs-apply-drawer"
    :wrapper-closable="false"
    v-if="drawerVisible"
    :visible.sync="drawerVisible"
    :before-close="handleCloseApply"
  >
    <editalisnameCont ref="editalisnameCont" :formOptions="formOptions" />
  </el-drawer>
</template>

<script>
import editalisnameCont from "../detail/editalisnameCont.vue";
export default {
  components: {
    editalisnameCont,
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
      formOptions: this.options,
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
    },
  },
  methods: {
    handleCloseApply() {
      this.$emit("update:visible", false);

      this.$parent.refreshPage();
    },
  },
};
</script>

<style></style>
