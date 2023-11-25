<template>
  <div class="workorder app-container">
    <mc-table
      ref="escDetailTable"
      :data="tableData"
      :total="total"
      :pageSize="pageSize"
      :currentPage="pageNo"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      :rowkey="rowkey"
    >
      <el-table-column
        v-for="(item, index) in columnArr"
        :key="index"
        :width="item.width"
        :resizable="index != 0"
        :label="item.label"
      >
        <template slot-scope="{ row }">
          <span>{{ row[item.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        :resizable="false"
        width="200px"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <router-link
            :to="{
              name: 'workDetail',
              params: { id: row.workOrderId, type: row.type },
            }"
          >
            <el-link type="primary">详情</el-link>
          </router-link>
        </template>
      </el-table-column>
    </mc-table>
  </div>
</template>

<script>
import { getWorkOrderList } from "@/api/workOrder";
import mcTable from "@/components/MctablePro";
export default {
  name: "Workorder",
  components: {
    mcTable,
  },
  data() {
    return {
      rowkey: "workOrderId",
      columnArr: [
        { label: "工单类型", width: "200px", prop: "typeDesc" },
        { label: "工单对象", width: "200px", prop: "target" },
        { label: "状态", width: "200px", prop: "statusDesc" },
        { label: "申请原因", prop: "applyReason" },
        { label: "反馈意见", prop: "auditOpinion" },
        { label: "申请时间", width: "200px", prop: "applyTime" },
      ],
      tableData: [],
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,
    };
  },
  created() {
    this.renderTable();
  },
  methods: {
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
      const loading = this.$loading({
        lock: true,
        text: "拼命加载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      getWorkOrderList({ pageNo, pageSize })
        .then((res) => {
          this.tableData = res.list;
          this.total = res.pageInfo.total;
          this.timeStamp = new Date();
          loading.close();
        })
        .catch((_) => {
          loading.close();
        });
    },
  },
};
</script>
