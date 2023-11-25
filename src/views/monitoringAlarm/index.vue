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
    </mc-table>
  </div>
</template>

<script>
import { monitoringList } from "@/api/monitoringAlarm";
import mcTable from "@/components/MctablePro";
export default {
  name: "monitoringAlarm",
  components: {
    mcTable,
  },
  data() {
    return {
      rowkey: "monitoringAlarm",
      //   告警详情 告警时间 到期时间 所属集群 云服务器名称
      columnArr: [
        { label: "云服务器名称", prop: "machineName" },
        { label: "告警详情", prop: "alarmDetail" },
        { label: "告警时间", prop: "alarmTime" },
        { label: "到期时间", prop: "expireTime" },
        { label: "所属集群", prop: "clusterName" },
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
      const pageNo = this.pageNo;
      const pageSize = this.pageSize;
      const loading = this.$loading({
        lock: true,
        text: "拼命加载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      monitoringList({ pageNo, pageSize })
        .then((res) => {
          this.tableData = res.list;
          this.total = res.pageInfo.total;
          this.timeStamp = new Date();
          loading.close();
        })
        .finally((_) => {
          loading.close();
        });
    },
  },
};
</script>
