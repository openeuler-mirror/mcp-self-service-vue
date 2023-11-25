<template>
  <div class="detailLog">
    <mc-table
      :data="tableData"
      :total="total"
      :currentPage="pageNo"
      :pageSize="pageSize"
      :short-height="60"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
      key="timeStamp"
    >
      <template v-for="(item, index) in columnArr">
        <el-table-column
          v-if="item.prop == 'detail'"
          :key="'detail' + index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <span>{{ getdetailInfo(row) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :key="item.prop + index"
          :resizable="index != 0 && index != columnArr.length - 1"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <span>{{ row[item.prop] }}</span>
          </template>
        </el-table-column>
      </template>
    </mc-table>
  </div>
</template>

<script>
import mcTable from "@/components/Mctable";
import { getServerVmOperateLog } from "@/api/serverVm";
import { KSVD } from "./taskDetailInfo.js";
export default {
  components: {
    mcTable,
  },
  data() {
    return {
      columnArr: [
        { label: "操作", prop: "action", width: "200px" },
        { label: "对象名称", prop: "objName", width: "200px" },
        { label: "操作用户", prop: "operUser", width: "200px" },
        { label: "开始时间", prop: "startTime", width: "200px" },
        { label: "结束时间", prop: "finishTime", width: "200px" },
        { label: "状态", prop: "status", width: "200px" },
        { label: "详情", prop: "detail", width: "200px" },
        { label: "原因", prop: "reason" },
      ],
      tableData: [],
      serverVmUuid: this.$route.params.serverVmUuid,
      clusterId: this.$route.params.clusterId,
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 10,
    };
  },
  created() {
    this.renderTable();
  },
  methods: {
    getdetailInfo(row) {
      let details = "";
      var name = row.detail;
      if (name == "null" || typeof name == "undefined") {
        name = "";
      } else {
        name = KSVD.taskDetailInfo.init(row.objName, name);
      }
      details = name;
      return details;
    },
    handlePageChange(page) {
      this.pageNo = +page;
      this.renderTable();
    },
    handleSizeChange(pageSize) {
      this.pageNo = 1;
      this.pageSize = pageSize;
      this.renderTable();
    },
    renderTable() {
      let pageNo = this.pageNo;
      let pageSize = this.pageSize;
      const serverVmUuid = this.serverVmUuid;
      const clusterId = this.clusterId;
      getServerVmOperateLog({ pageNo, pageSize, serverVmUuid, clusterId }).then(
        (res) => {
          this.tableData = res.list;
          this.total = res.pageInfo.total;
          this.timeStamp = new Date();
        }
      );
    },
  },
};
</script>

<style></style>
