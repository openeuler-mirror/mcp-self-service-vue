<template>
  <div class="app-container">
    <headerBox @refresh="refreshTable" :spinBol="tableLoading">
      <template slot="headerLeft">
        <el-date-picker
          v-model="dateArr"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @blur="refreshTable"
        >
        </el-date-picker>
        <searchInput
          placeholder="输入云服务器名称"
          style="margin-left: 10px"
          @change="searchInputChange"
        />
        <p class="total-money">总消费：1,363.06 元</p>
      </template>
    </headerBox>
    <mc-table
      ref="escDetailTable"
      :data="tableData"
      :total="total"
      :tableLoading="tableLoading"
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
import { getWorkOrderList } from "@/api/workOrder";
import mcTable from "@/components/MctablePro";
import headerBox from "@/components/headerBox";
import searchInput from "@/components/SearchInput";
export default {
  name: "Workorder",
  components: {
    mcTable,
    headerBox,
    searchInput,
  },
  data() {
    return {
      rowkey: "workOrderId",
      tableLoading: false,
      dateArr: [],
      columnArr: [
        { label: "云服务器名称", prop: "vmName" },
        { label: "CPU配置（核)", prop: "cpuConfig" },
        { label: "CPU消费（元）", prop: "cpuSpend" },
        { label: "内存配置（GB）", prop: "memConfig" },
        { label: "内存消费（元）", prop: "memSpend" },
        { label: "存储配置（GB）", prop: "storageConfig" },
        { label: "存储消费（元）", prop: "storageSpend" },
        { label: "总计（元）", prop: "totalSpend" },
      ],
      vmName: "",
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
    searchInputChange(val) {
      this.vmName = val;
      this.refreshTable();
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

    refreshTable() {
      this.pageNo = 1;
      this.pageSize = 20;
      this.renderTable();
    },
    renderTable() {
      let pageNo = this.pageNo;
      let pageSize = this.pageSize;
      const params = {
        pageNo,
        pageSize,
        statTime: this.dateArr[0],
        endTime: this.dateArr[1],
        vmName: this.vmName,
      };
      this.tableLoading = true;
      getWorkOrderList({ ...params })
        .then((res) => {
          this.tableData = res.list;
          this.total = res.pageInfo.total;
          this.timeStamp = new Date();
        })
        .finally((_) => {
          this.tableLoading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.total-money {
  margin-left: 20px;
  font-size: 16px;
  color: #333;
}
</style>
