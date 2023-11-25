<template>
  <el-dropdown @click.stop trigger="click" @visible-change="visibleChange">
    <el-link @click.stop type="primary">
      更多
      <i class="el-icon-arrow-down el-icon--right" />
    </el-link>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="(item, index) in toggleList"
        :key="item.key + index"
        :command="item"
      >
        <el-link
          @click="downToggleCommand(item.key)"
          :disabled="item.disabled"
          :underline="false"
        >
          {{ item.label }}
        </el-link>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import {
  startServerVm,
  shutdownServerVm,
  abortServerVm,
  restartServerVm,
  forcedRestartServerVm,
  deleteServerVm,
} from "@/api/serverVm";
import ReMessage from "@/utils/message";
import { MessageBox } from "element-ui";
export default {
  props: {
    // 选中的数组
    selectData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      toggleList: [],
      toggleAllList: {},
      toggleListArr: [
        { key: "start", label: "开机", disabled: true },
        { key: "shutdown", label: "关机", disabled: true },
        { key: "abort", label: "强制关机", disabled: true },
        { key: "reboot", label: "重启", disabled: true },
        { key: "forcereboot", label: "强制重启", disabled: true },
        { key: "snapshot", label: "快照", disabled: true },
        { key: "edit", label: "变更规格", disabled: true },
        { key: "applyDeferred", label: "申请延期", disabled: true },
        { key: "makeImage", label: "制作镜像", disabled: true },
        { key: "delete", label: "删除", disabled: true },
      ],
      toggleListData: {},
    };
  },
  created() {
    // this.defaultList();
    // this.defaultListNew();
  },
  watch: {},
  methods: {
    visibleChange(val) {
      if (val) {
        this.toggleListData = JSON.parse(JSON.stringify(this.selectData[0]));
        this.defaultListNew(this.toggleListData);
      }
    },
    //  下拉列表
    defaultListNew(toggleListData) {
      let {
        startBtnShow,
        startBtnDisabled,
        shutdownBtnShow,
        shutdownBtnDisabled,
        abortBtnShow,
        abortBtnDisabled,
        rebootBtnShow,
        rebootBtnDisabled,
        forcerebootBtnShow,
        forcerebootBtnDisabled,
        snapshotBtnShow,
        snapshotBtnDisabled,
        editBtnShow,
        editBtnDisabled,
        applyDeferredBtnShow,
        applyDeferredBtnDisabled,
        deleteBtnShow,
        deleteBtnDisabled,
        makeImageBtnShow,
        makeImageBtnDisabled,
      } = toggleListData;
      let list = [];
      this.toggleListArr.forEach((element) => {
        let { key } = element;
        switch (key) {
          // 开机
          case "start":
            if (startBtnShow) {
              element.disabled = startBtnDisabled;
              list.push(element);
            }
            break;
          // 关机
          case "shutdown":
            if (shutdownBtnShow) {
              element.disabled = shutdownBtnDisabled;
              list.push(element);
            }
            break;
          // 强制关机
          case "abort":
            if (abortBtnShow) {
              element.disabled = abortBtnDisabled;
              list.push(element);
            }
            break;
          // 重启
          case "reboot":
            if (rebootBtnShow) {
              element.disabled = rebootBtnDisabled;
              list.push(element);
            }
            break;
          // 强制重启
          case "forcereboot":
            if (forcerebootBtnShow) {
              element.disabled = forcerebootBtnDisabled;
              list.push(element);
            }
            break;
          // 快照
          case "snapshot":
            if (snapshotBtnShow) {
              element.disabled = snapshotBtnDisabled;
              list.push(element);
            }
            break;
          // 变更规格
          case "edit":
            if (editBtnShow) {
              element.disabled = editBtnDisabled;
              list.push(element);
            }
            break;
          // 申请延期
          case "applyDeferred":
            if (applyDeferredBtnShow) {
              element.disabled = applyDeferredBtnDisabled;
              list.push(element);
            }
            break;

          // 制作镜像
          case "makeImage":
            if (makeImageBtnShow) {
              element.disabled = makeImageBtnDisabled;
              list.push(element);
            }

            break;
          //  删除
          case "delete":
            if (deleteBtnShow) {
              element.disabled = deleteBtnDisabled;
              list.push(element);
            }

            break;
          default:
            // list = [];
            break;
        }
      });
      this.toggleList = JSON.parse(JSON.stringify(list));
      this.$emit("downToggleCommand", this.toggleListData);
    },
    downToggleCommand(type) {
      if (type === "start") {
        this.toggleListData.startBtnDisabled = true;
        this.startVm();
      }
      if (type === "shutdown") {
        this.toggleListData.shutdownBtnDisabled = true;
        this.shutdownVm();
      }
      if (type === "snapshot") {
        this.toggleListData.snapshotBtnDisabled = true;
        this.$router.push({
          name: "serviceDetail",
          params: {
            serverVmUuid: this.selectData.length
              ? this.selectData[0].serverVmUuid
              : 1,
            clusterId: this.selectData[0].clusterId,
            tab: "snapshot",
          },
        });
      }
      if (type === "abort") {
        this.toggleListData.abortBtnDisabled = true;
        this.abortVm();
      }
      if (type === "reboot") {
        this.toggleListData.rebootBtnDisabled = true;
        this.restartVm();
      }
      if (type === "forcereboot") {
        this.toggleListData.forcerebootBtnDisabled = true;
        this.forcerebootVm();
      }

      if (type === "edit") {
        this.toggleListData.editBtnDisabled = false;
        this.$emit("handleShowChangeServices");
      }
      if (type === "applyDeferred") {
        this.toggleListData.applyDeferredBtnDisabled = false;
        this.$emit("handleShowDely");
      }
      if (type === "delete") {
        this.toggleListData.deleteBtnDisabled = true;
        this.deleteServerVm();
      }

      if (type === "makeImage") {
        this.toggleListData.makeImageBtnDisabled = true; // 制作镜像按钮
        this.makeImageServerVm();
      }

      this.defaultListNew(this.toggleListData);
    },
    //删除
    deleteServerVm() {
      MessageBox.confirm("确定要删除这台云服务器？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const { clusterId, serverVmUuid } = this.selectData[0];
          deleteServerVm({ clusterId, serverVmUuid })
            .then((res) => {
              ReMessage.success("删除成功");
              this.refreshParentTable();
            })
            .catch((err) => {
              ReMessage.warning("删除失败");
              this.refreshParentTable();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });

          this.toggleListData.deleteBtnDisabled = false;
          this.defaultListNew(this.toggleListData);
        });
    },
    startVm() {
      const { clusterId, serverVmUuid } = this.selectData[0];
      startServerVm({ clusterId, serverVmUuid })
        .then((res) => {
          ReMessage.success("开机成功");
          this.refreshParentTable();
        })
        .catch((err) => {
          ReMessage.warning("开机失败");
          this.refreshParentTable();
        });
    },
    shutdownVm() {
      const { clusterId, serverVmUuid } = this.selectData[0];
      this.$emit("shutdownVm");
      shutdownServerVm({ clusterId, serverVmUuid })
        .then((res) => {
          ReMessage.success("关机成功");
          this.refreshParentTable();
        })
        .catch((err) => {
          ReMessage.warning("关机失败");
          this.refreshParentTable();
        });
    },
    abortVm() {
      MessageBox.confirm(
        "此操作可能导致云服务器内尚未保存的数据丢失，是否确认强制关机？",
        "强制关机",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          const { clusterId, serverVmUuid } = this.selectData[0];
          abortServerVm({ clusterId, serverVmUuid })
            .then((res) => {
              ReMessage.success("强制关机成功");
              this.refreshParentTable();
            })
            .catch((err) => {
              ReMessage.warning("强制关机失败");
              this.refreshParentTable();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消强制关机",
          });
          this.toggleListData.abortBtnDisabled = false;
          this.defaultListNew(this.toggleListData);
        });
    },
    restartVm() {
      const { clusterId, serverVmUuid } = this.selectData[0];
      restartServerVm({ clusterId, serverVmUuid })
        .then((res) => {
          ReMessage.success("重启成功");
          this.refreshParentTable();
        })
        .catch((err) => {
          ReMessage.warning("重启失败");
          this.refreshParentTable();
        });
    },
    forcerebootVm() {
      MessageBox.confirm(
        "此操作可能导致云服务器内尚未保存的数据丢失，是否确认强制重启？",
        "强制重启",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          const { clusterId, serverVmUuid } = this.selectData[0];
          forcedRestartServerVm({ clusterId, serverVmUuid })
            .then((res) => {
              ReMessage.success("强制重启成功");
              this.refreshParentTable();
            })
            .catch((err) => {
              ReMessage.warning("强制重启失败");
              this.refreshParentTable();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消强制重启",
          });

          this.toggleListData.forcerebootBtnDisabled = false;
          this.defaultListNew(this.toggleListData);
        });
    },
    refreshParentTable() {
      this.$emit("refreshTable");
    },

    makeImageServerVm() {
      this.$emit("downToggle", { key: "makeImage", row: this.selectData[0] });
    },
  },
};
</script>
