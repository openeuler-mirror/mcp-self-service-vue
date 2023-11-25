<template>
  <div class="header-box">
    <div class="header-left">
      <el-button :disabled="batchStartDisabled" @click="startService">
        开机
      </el-button>
      <el-button :disabled="batchShutdownDisabled" @click="closeService">
        关机
      </el-button>
      <el-button :disabled="batchRestartDisabled" @click="rebootService">
        重启
      </el-button>
      <!-- 更多btn -->
      <el-dropdown trigger="click" @command="downBatchToggleCommand">
        <el-button :disabled="toggleDisabled" style="margin-left: 10px">
          更多
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in batchToggleList"
            :key="index"
            :command="item"
            :disabled="item.disabled"
          >
            <span>{{ item.name }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <searchInput style="margin-left: 10px" @change="searchInputChange" />
    </div>
    <div class="header-right">
      <utilsButton type="fresh" :spinBol="spinBol" @refresh="refresh" />
      <el-button type="primary" @click="applyService">申请云服务器</el-button>
    </div>
  </div>
</template>

<script>
import utilsButton from "@/components/utilsButton";
import searchInput from "@/components/SearchInput";
import ReMessage from "@/utils/message";
import { MessageBox } from "element-ui";
import {
  batchStartServerVm,
  batchShutdownServerVm,
  batchRebootServerVm,
  batchDeleteServerVm,
  abortServerVm,
  forcedRestartServerVm,
} from "@/api/serverVm";
export default {
  components: {
    searchInput,
    utilsButton,
  },
  props: {
    // 选中的数组
    selectData: {
      type: Array,
      default: () => [],
    },
    spinBol: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      toggleDisabled: true,
      batchStartDisabled: true,
      batchShutdownDisabled: true,
      batchRestartDisabled: true,
      batchDeleteDisabled: true,
      batchToggleList: [
        { key: "batchAbort", name: "强制关机", disabled: true },
        { key: "batchForceReboot", name: "强制重启", disabled: true },
        { key: "batchModifyServerVm", name: "变更规格", disabled: true },
        { key: "batchDelete", name: "删除", disabled: true },
      ],
    };
  },
  watch: {
    selectData: {
      handler: function (newV, oldV) {
        this.initDisabled(true);
        if (newV.length > 0) {
          this.setBtnsDis(newV);
        }
      },
      deep: true,
    },
  },
  methods: {
    setBtnsDis(newV) {
      // 开机按钮  start
      let startDis = newV.some((item) => item.startBtnDisabled == true);
      if (!startDis) {
        this.batchStartDisabled = false;
      }
      // 关机按钮  shutdown
      let shutdownDis = newV.some((item) => item.shutdownBtnDisabled == true);
      if (!shutdownDis) {
        this.batchShutdownDisabled = false;
      }
      // 重启按钮  reboot
      let rebootDis = newV.some((item) => item.rebootBtnDisabled == true);
      if (!rebootDis) {
        this.batchRestartDisabled = false;
      }
      // 强制关机按钮  abort
      let abortDis = newV.some((item) => item.abortBtnDisabled == true);

      // 强制重启  forcereboot
      let forcerebootDis = newV.some(
        (item) => item.forcerebootBtnDisabled == true
      );

      // 变更规格 edit
      let editDis = newV.some((item) => item.editBtnDisabled == true);

      // 删除 delete
      let deleteDis = newV.some((item) => item.deleteBtnDisabled == true);

      this.toggleDisabled = abortDis && forcerebootDis && editDis && deleteDis;

      let selectDataLength = this.selectData.length;
      this.batchToggleList.forEach((element) => {
        element.disabled = true;

        // 强制关机按钮
        if (element.key == "batchAbort" && !abortDis) {
          element.disabled = false;
        }
        if (element.key == "batchAbort" && selectDataLength > 1) {
          element.disabled = true;
        }

        // 强制重启
        if (element.key == "batchForceReboot" && !forcerebootDis) {
          element.disabled = false;
        }
        if (element.key == "batchForceReboot" && selectDataLength > 1) {
          element.disabled = true;
        }

        // 变更规格
        if (
          element.key == "batchModifyServerVm" &&
          !editDis &&
          newV.length == 1
        ) {
          element.disabled = false;
        }
        // 删除
        if (element.key == "batchDelete" && !deleteDis) {
          element.disabled = false;
        }
      });
    },

    initDisabled(booleanFlag) {
      this.toggleDisabled = booleanFlag;
      this.batchStartDisabled = booleanFlag;
      this.batchShutdownDisabled = booleanFlag;
      this.batchRestartDisabled = booleanFlag;
      this.batchDeleteDisabled = booleanFlag;
    },

    // 开机
    startService() {
      const batchServerVmParams = this.getBatchOperateParam();
      this.selectData.forEach((element) => {
        element.startBtnDisabled = true;
      });
      this.$emit("headerBarEmit", this.selectData);

      batchStartServerVm({ batchServerVmParams })
        .then((res) => {
          ReMessage.success("操作成功");
          this.initDisabled(true);
          this.$emit("refreshTable");
        })
        .catch((err) => {
          ReMessage.error("操作失败");
          this.initDisabled(true);
          this.$emit("refreshTable");
        });
    },
    // 关机
    closeService() {
      const batchServerVmParams = this.getBatchOperateParam();
      this.selectData.forEach((element) => {
        element.shutdownBtnDisabled = true;
      });
      this.$emit("headerBarEmit", this.selectData);
      batchShutdownServerVm({ batchServerVmParams })
        .then((res) => {
          ReMessage.success("关机成功");
          this.initDisabled(true);
          this.$emit("refreshTable");
        })
        .catch((err) => {
          ReMessage.error("关机失败");
          this.initDisabled(true);
          this.$emit("refreshTable");
        });
    },
    // 重启
    rebootService() {
      const batchServerVmParams = this.getBatchOperateParam();
      this.selectData.forEach((element) => {
        element.rebootBtnDisabled = true;
      });
      this.$emit("headerBarEmit", this.selectData);
      batchRebootServerVm({ batchServerVmParams })
        .then((res) => {
          ReMessage.success("重启成功");
          this.initDisabled(true);
          this.$emit("refreshTable");
        })
        .catch((err) => {
          ReMessage.error("重启失败");
          this.initDisabled(true);
          this.$emit("refreshTable");
        });
    },
    //删除
    batchDeleteService() {
      MessageBox.confirm("确定要删除所选云服务器？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const batchServerVmParams = this.getBatchOperateParam();
        batchDeleteServerVm({ batchServerVmParams })
          .then((res) => {
            ReMessage.success("删除成功");
            this.initDisabled(true);
            this.$emit("refreshTable");
          })
          .catch((err) => {
            ReMessage.error("删除失败");
            this.initDisabled(true);
            this.$emit("refreshTable");
          });
      });
    },
    //强制关机
    batchAbortVm() {
      MessageBox.confirm(
        "此操作可能导致云服务器内尚未保存的数据丢失，是否确认强制关机？",
        "强制关机",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        const { clusterId, serverVmUuid } = this.selectData[0];
        abortServerVm({ clusterId, serverVmUuid })
          .then((res) => {
            ReMessage.success("强制关机成功");
            this.initDisabled(true);
            this.$emit("refreshTable");
          })
          .catch((err) => {
            ReMessage.error("强制关机失败");
            this.initDisabled(true);
            this.$emit("refreshTable");
          });
      });
    },
    //强制重启
    batchForcerebootVm() {
      MessageBox.confirm(
        "此操作可能导致云服务器内尚未保存的数据丢失，是否确认强制重启？",
        "强制重启",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        const { clusterId, serverVmUuid } = this.selectData[0];
        forcedRestartServerVm({ clusterId, serverVmUuid })
          .then((res) => {
            ReMessage.success("强制重启成功");
            this.$emit("refreshTable");
          })
          .catch((err) => {
            ReMessage.error("强制重启失败");
            this.initDisabled(true);
            this.$emit("refreshTable");
          });
      });
    },
    // 申请云服务器
    applyService() {
      this.$emit("handleToApply");
    },
    // 刷新
    refresh() {
      this.$emit("refreshTable");
    },
    // 搜索
    searchInputChange(val) {
      this.$parent.changeSearchKey(val);
      this.$emit("refreshTable");
    },
    downBatchToggleCommand(type) {
      let commandType = type.key;
      if (commandType === "batchDelete") {
        this.batchDeleteService();
      }
      if (commandType === "batchAbort") {
        this.batchAbortVm();
      }
      if (commandType === "batchForceReboot") {
        this.batchForcerebootVm();
      }
      if (commandType === "batchModifyServerVm") {
        let selectRow = this.selectData[0];
        this.$parent.handleShowChangeServices(selectRow);
      }
    },
    getBatchOperateParam() {
      const batchServerVmParams = [];
      for (let i = 0; i < this.selectData.length; i++) {
        const { serverVmUuid, clusterId } = this.selectData[i];
        batchServerVmParams.push({ serverVmUuid, clusterId });
      }
      return batchServerVmParams;
    },
  },
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";
.header-box {
  @include headerBarStyle;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.header-left {
  display: flex;
  align-items: center;
  flex: 1;
  ::v-deep {
    .el-input {
      width: 200px;
    }
  }
  .btn-margin {
    margin-left: 15px;
  }
}
.header-box {
  margin-bottom: 20px;
}
.el-checkbox-group {
  .el-checkbox {
    display: block;
    margin: 10px;
  }
}
</style>
