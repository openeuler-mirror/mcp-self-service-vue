<template>
  <div class="app-container imageMgr">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <!-- 公共镜像 -->
      <el-tab-pane label="公共镜像" name="publicImage"> </el-tab-pane>
      <!-- 共享镜像 -->
      <el-tab-pane label="共享镜像" name="sharedMirror"> </el-tab-pane>
      <!-- 私有镜像 -->
      <el-tab-pane label="私有镜像" name="privateImage"> </el-tab-pane>
    </el-tabs>
    <publicImage v-if="activeName == 'publicImage'" ref="publicImage">
    </publicImage>
    <sharedMirror v-if="activeName == 'sharedMirror'" ref="publicImage">
    </sharedMirror>
    <privateImage v-if="activeName == 'privateImage'" ref="privateImage">
    </privateImage>
  </div>
</template>

<script>
import publicImage from "./publicImage/index.vue";
import sharedMirror from "./sharedMirror/index.vue";
import privateImage from "./privateImage/index.vue";

export default {
  name: "imageMgrHome",
  components: { publicImage, sharedMirror, privateImage },
  data() {
    return {
      activeName: "",
      beforeRouteType: "",
    };
  },
  beforeRouteEnter(to, from, next) {
    let params = from.params;
    if (from.name === "imageDetail") {
      params = from.params;
    } else {
      params = to.params;
    }
    next((vm) => {
      vm.beforeRouteType = params.type;
      vm.setpage(params.type);
    });
  },

  created() {},
  mounted() {},
  methods: {
    tabClick(val) {},
    setpage() {
      let activeNameObj = {
        publicImage: "publicImage",
        sharedImage: "sharedMirror",
        privateImage: "privateImage",
      };
      let beforeRouteType = activeNameObj[this.beforeRouteType];
      this.activeName = beforeRouteType || "publicImage";
    },
  },
};
</script>
<style lang="scss" scoped>
.imageMgr {
  padding-top: 0px;
}
</style>
