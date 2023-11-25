<template>
  <div class="mc-table">
    <el-table
      ref="elTable"
      :data="tableData"
      style="width: 100%"
      border
      stripe=""
      :height="tableHeight"
      :class="{ hasPagination: total > 0 }"
      tooltip-effect="light"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-click="rowSelect"
      @filter-change="filterChange"
    >
      <slot />
    </el-table>

    <el-pagination
      v-if="total > 0"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100, 200]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    // 表格渲染的数据
    data: {
      type: Array,
      default: () => [],
    },
    // 总页数
    total: {
      type: Number,
      default: 0,
    },
    // 当前查询每次数量
    pageSize: {
      type: Number,
      default: 0,
    },
    // 当前页
    currentPage: {
      type: Number,
      default: 0,
    },
    // 表格固定高度，不会根据屏幕宽带变化而变化, eg: 20vh / 600px
    height: {
      type: String,
      default: "0",
    },
    // 减去的表格高度，部分情况下计算的表格高度不准确，需要额外增减一些
    shortHeight: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      tableData: this.data,
      tableHeight: null,
      screenWidth: document.documentElement.clientWidth, // 屏幕宽度
      screenHeight: document.documentElement.clientHeight, // 屏幕高度
    };
  },
  watch: {
    data: {
      // 监听的对象
      deep: true, // 深度监听设置为 true
      handler: function (newV, oldV) {
        this.tableData = newV;
      },
    },
    screenWidth() {
      this.calcTableHeight();
    },
    screenHeight() {
      this.calcTableHeight();
    },
  },
  mounted() {
    this.calcTableHeight();
    window.onresize = () => {
      this.screenWidth = document.body.clientWidth;
      this.screenHeight = document.body.clientHeight;
    };
  },
  methods: {
    calcTableHeight() {
      // 表格高度
      this.tableHeight = isNaN(this.height)
        ? this.height
        : window.innerHeight -
          this.$refs.elTable.$el.offsetTop -
          130 -
          this.shortHeight;
    },
    handlePageChange(page) {
      this.$emit("current-change", page);
    },
    handleSizeChange(pageSize) {
      this.$emit("size-change", pageSize);
    },
    handleSelectionChange(selection) {
      // 返回选中的数组
      this.$emit("selection-change", selection);
    },
    rowSelect(row, column, event) {
      // 返回选中的数组
      this.$emit("row-click", row);
    },
    handleSortChange(option) {
      // 点击就筛选回调
      this.$emit("sort-change", option);
    },
    filterChange(filters) {
      // 点击就筛选回调
      this.$emit("filter-change", filters);
    },
  },
};
</script>

<style lang="scss">
.el-table th > .cell {
  font-weight: normal !important;
  color: $fontColor;
}
.el-table i {
  margin-right: 3px;
}
.el-table--border {
  border: none;
}
// .el-table__row > td {
//   border: none;
// }
.el-pagination {
  text-align: right;
  padding: 12px 0;
}
.el-table--border::after,
.el-table--group::after,
.el-table::before,
.el-table__fixed-right::before,
.el-table__fixed::before {
  width: 0;
  position: none;
}
</style>
