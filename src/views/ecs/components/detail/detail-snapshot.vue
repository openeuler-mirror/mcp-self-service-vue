<template>
  <div class="detailSnapshot">
    <headerBox @refresh="refreshTable" :spinBol="tableLoading">
      <template slot="headerLeft">
        <el-button @click="handleCreatSnapshot">创建快照</el-button>
        <el-button
          :disabled="!(selectTable.length === 1)"
          @click="applyServerVmSnapshot"
          >恢复快照</el-button
        >
        <el-button
          :disabled="!(selectTable.length === 1)"
          @click="handleEditSnapshot"
          >编辑快照</el-button
        >
        <el-button
          :disabled="selectTable.length === 0"
          @click="deleteServerVmSnapshot"
          >删除</el-button
        >
      </template>
    </headerBox>
    <mc-table
      :data="tableData"
      :short-height="120"
      v-loading.lock="tableLoading"
      :element-loading-text="$t('common.loadingText')"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.2)"
      @selection-change="handlerSelectionChange"
      key="timeStamp"
    >
      <el-table-column
        type="selection"
        :resizable="false"
        width="55"
        :selectable="getTableSelectble"
        align="center"
      />

      <template v-for="(item, index) in columnArr">
        <!-- 状态 -->
        <el-table-column
          v-if="item.prop === 'status'"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :resizable="index != columnArr.length - 1"
        >
          <template slot-scope="{ row }">
            <div class="status-row">
              <span v-if="row[item.prop] === 0" class="error">失败</span>
              <span v-else-if="row[item.prop] === 1" class="notice"
                >进行中</span
              >
              <span v-else-if="row[item.prop] === 2" class="success">成功</span>
              <span v-else-if="row[item.prop] === 3" class="success">其他</span>
              <span v-else-if="row[item.prop] === 4" class="notice"
                >删除中</span
              >
            </div>
          </template>
        </el-table-column>

        <!-- 快照类型 -->
        <el-table-column
          v-else-if="item.prop === 'snapType'"
          :key="index + item.prop"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
          :resizable="index != columnArr.length - 1"
        >
          <template slot-scope="{ row }">
            <div class="snapType-row">
              <span v-if="row[item.prop] === 0" class="success">手动创建</span>
              <span v-else-if="row[item.prop] === 1" class="success"
                >系统策略创建</span
              >
            </div>
          </template>
        </el-table-column>

        <!-- 系统盘是否丢失 -->
        <!-- <el-table-column
         v-else-if="item.prop === 'lose'"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
        >
          <template slot-scope="{row}">
            <div class="lose-row">
              <span v-if="row[item.prop] === 0" class="success">未丢失</span>
              <span v-else-if="row[item.prop] === 1" class="error">丢失</span>
            </div>
          </template>
     </el-table-column> -->

        <el-table-column
          v-else
          :key="index + item.prop"
          :label="item.label"
          :prop="item.prop"
          :resizable="index != columnArr.length - 1"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <span>{{ row[item.prop] }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column v-for="(item,index) in columnArr" :key="index" :label="item.label">
        <template slot-scope="{row}">
          <span>{{ row[item.prop] }}</span>
        </template>
      </el-table-column> -->
      </template>
    </mc-table>
    <el-dialog
      :title="(snapDialogType === 1 ? '编辑' : '创建') + '快照'"
      :visible.sync="snapDialogVisible"
      class="sm-dialog editDialog"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.desc" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import headerBox from "@/components/headerBox";
import mcTable from "@/components/Mctable";
import ReMessage from "@/utils/message";
import { MessageBox } from "element-ui";
import {
  getSnapshotList,
  createSnapshot,
  updateSnapshot,
  deleteSnapshot,
  applySnapshot,
} from "@/api/serverVm";
export default {
  components: {
    mcTable,
    headerBox,
  },
  data() {
    return {
      serverVmUuid: this.$route.params.serverVmUuid,
      clusterId: this.$route.params.clusterId,
      columnArr: [
        { label: "ID", prop: "id", width: "100px" },
        { label: "名称", prop: "alias", width: "200px" },
        { label: "快照状态", prop: "status", width: "200px" },
        { label: "描述", prop: "description", width: "400px" },
        { label: "创建者", prop: "createUserName", width: "200px" },
        { label: "快照类型", prop: "snapType", width: "200px" },
        { label: "创建时间", prop: "dateCreated" },
      ],
      tableData: [],
      selectTable: [], // 选中的数据
      tableLoading: false,
      snapDialogVisible: false,
      snapDialogType: 1, // 1是编辑，其他是新建
      form: {
        name: "",
        desc: "",
      },
    };
  },
  created() {
    this.renderTable();
  },
  methods: {
    refreshTable() {
      this.renderTable();
    },
    renderTable() {
      this.selectTable = [];
      const serverVmUuid = this.serverVmUuid;
      const clusterId = this.clusterId;
      this.tableLoading = true;
      getSnapshotList({ serverVmUuid, clusterId })
        .then((res) => {
          this.tableData = res;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    handlerSelectionChange(selection) {
      this.selectTable = selection;
    },
    handleCreatSnapshot() {
      this.snapDialogType = 0;
      this.snapDialogVisible = true;
      this.form.desc = "";
      this.form.name = "";
    },
    handleEditSnapshot() {
      this.snapDialogType = 1;
      this.snapDialogVisible = true;
      this.form.desc = this.selectTable[0].description;
      this.form.name = this.selectTable[0].alias;
    },
    handleConfirm() {
      this.snapDialogVisible = false;

      if (this.snapDialogType == 0) {
        this.createNewSnapshot();
      } else {
        this.editSnapshot();
      }
    },
    createNewSnapshot() {
      let uuid = this.serverVmUuid;
      let description = this.form.desc;
      let snapName = this.form.name;
      const clusterId = this.clusterId;
      createSnapshot({ uuid, description, snapName, clusterId }).then((res) => {
        ReMessage.success("创建快照成功");
        this.renderTable();
      });
    },
    editSnapshot() {
      let snapId = this.selectTable[0].id;
      let description = this.form.desc;
      let snapName = this.form.name;
      let uuid = this.serverVmUuid;
      const clusterId = this.clusterId;
      updateSnapshot({ snapId, description, snapName, uuid, clusterId }).then(
        (res) => {
          ReMessage.success("编辑快照成功");
          this.renderTable();
        }
      );
    },
    handleCancel() {
      this.$refs.form.resetFields();
      this.snapDialogVisible = false;
    },
    applyServerVmSnapshot() {
      MessageBox.confirm("确定要恢复该快照", "恢复快照", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let snapId = this.selectTable[0].id;
        let uuid = this.serverVmUuid;
        const clusterId = this.clusterId;
        applySnapshot({ snapId, uuid, clusterId }).then((res) => {
          ReMessage.success("恢复快照成功");
          this.renderTable();
        });
      });
    },
    deleteServerVmSnapshot() {
      MessageBox.confirm("确定要删除这些快照", "删除快照", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const ids = this.selectTable.map((item) => {
          return item.id;
        });
        let snapId = ids.join(",");
        let uuid = this.serverVmUuid;
        const clusterId = this.clusterId;
        deleteSnapshot({ snapId, uuid, clusterId }).then((res) => {
          ReMessage.success("删除快照成功");
          this.renderTable();
        });
      });
    },
    getTableSelectble(row, index) {
      //删除中状态不能进行任何操作
      return row.status !== 4;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.detailSnapshot {
  .header-box {
    @include headerBarStyle;
    margin-bottom: 20px;
  }
  .editDialog {
    .el-input,
    .el-textarea {
      width: 300px;
    }
  }
}
</style>
