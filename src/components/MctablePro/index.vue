<template>
  <div class="mc-table">
    <div class="mc-table-box">
      <div class="mc-table-box-abs" ref="elTableabs">
        <el-table
          ref="elTable"
          :data="tableData"
          style="width: 100%; height: 100%"
          :height="tableHeight"
          border
          :class="[total > 0 ? 'hasPagination' : '', selectionType]"
          @select="handleSelectione"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
          @row-click="rowSelect"
          @filter-change="filterChange"
          v-loading.lock="tableLoading"
          :element-loading-text="$t('common.loadingText')"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.2)"
          :tree-props="treeProps"
          :row-key="rowkey"
          :default-expand-all="defaultExpandAll"
          :lazy="lazy"
          :load="load"
        >
          <el-table-column v-if="selectionType" type="selection" width="30px">
          </el-table-column>
          <slot />
        </el-table>
      </div>
    </div>
    <el-pagination
      v-if="total > 0"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
      :current-page="currentPage"
      :page-sizes="[20, 50, 100, 200]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
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
    tableLoading: {
      type: Boolean,
      default: false,
    },
    // 当前查询每次数量
    pageSize: {
      type: Number,
      default: 0,
    },
    //当前页
    currentPage: {
      type: Number,
      default: 0,
    },
    // 渲染嵌套数据的配置选项
    treeProps: {
      type: Object,
      default() {
        return { children: "children", hasChildren: "hasChildren" };
      },
    },
    // 行数据的 Key，用来优化 Table 的渲染
    rowkey: { type: String, default: "id" },
    // 表格的选择类型   multipleTable/singleTable   多选/单选
    selectionType: { type: String, default: "" },
    // 表格默认选中项
    defaultSelectedKeys: {
      type: Array,
      default: () => [],
    },
    defaultExpandAll: {
      type: Boolean,
      default: false,
    },
    lazy: {
      type: Boolean,
      default: false,
    },
    load: {
      type: Function,
    },
  },
  data() {
    return {
      tableData: this.data,
      tableHeight: null,
    };
  },
  watch: {
    data(val) {
      this.$refs.elTable.clearSelection();
      this.tableData = val;
      this.toggleSelection();
      this.$nextTick(() => {
        this.calcTableHeight();
      });
    },
  },
  mounted() {
    this.calcTableHeight();
    window.onresize = () => {
      this.calcTableHeight();
    };
  },
  methods: {
    toggleSelection() {
      let list = this.defaultSelectedKeys;
      this.$nextTick(() => {
        this.setTableSelection(list);
      });
    },
    doLayout() {
      this.$refs.elTable.doLayout();
    },
    calcTableHeight() {
      this.tableHeight = this.$refs.elTableabs.offsetHeight;
    },
    handlePageChange(page) {
      this.$emit("current-change", page);
    },
    handleSizeChange(pageSize) {
      this.$emit("size-change", pageSize);
    },
    handleSelectione(selection, row) {
      let key = this.selectionType;
      let selectionList = [];
      this.$refs.elTable.clearSelection();
      switch (key) {
        case "multipleTable": // 多选
          selectionList = selection;
          this.setTableSelection(selectionList);
          break;
        case "singleTable": // 单选
          selectionList = selection.slice(-1);
          this.setTableSelection(selectionList);
          break;
        default:
          selectionList = selection;
          break;
      }
      this.$emit("handleSelectione", selectionList);
    },
    handleSelectionChange(selection) {
      // 返回选中的数组
      this.$emit("selection-change", selection);
    },

    setTableSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.elTable.toggleRowSelection(row, true);
        });
      } else {
        this.$refs.elTable.clearSelection();
      }
    },
    handleSortChange(option) {
      // 点击就筛选回调
      this.$emit("sort-change", option);
    },
    rowSelect(row, column, event) {
      // 返回选中的数组
      this.$emit("row-click", row);
    },
    filterChange(filters) {
      // 点击就筛选回调
      this.$emit("filter-change", filters);
    },
  },
};
</script>

<style lang="scss">
.mc-table {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  .mc-table-box {
    position: relative;
    display: flex;
    flex: 1;
    .mc-table-box-abs {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  .el-checkbox,
  .el-checkbox__input {
    display: grid;
    position: unset;
  }
}
.singleTable {
  .el-table__header-wrapper {
    .el-table-column--selection {
      .cell {
        display: none;
      }
    }
  }
  //外边框的样式
  .el-checkbox__inner {
    width: 16px !important;
    height: 16px !important;
    border: 1px solid #19a9ff !important;
    background: none !important;
    border-radius: 50% !important;
  }
  //选中里面的样式
  .el-checkbox__inner::after {
    width: 8px !important;
    height: 8px !important;
    border: 1px solid #19a9ff !important;
    background: #19a9ff !important;
    border-radius: 50%;
    top: calc(50% - 5px) !important;
    left: calc(50% - 5px) !important;
  }
  //修改定位以及加载动画
  .el-checkbox__input.is-checked .el-checkbox__inner::after {
    transform: translate(0%, 0%) rotate(0) scale(1, 1) !important;
  }
}

// 表格
.el-table--enable-row-transition .el-table__body td {
  transition: none;
}

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
.el-table td.el-table__cell,
.el-table th.el-table__cell.is-leaf {
  border-bottom: 1px solid #ebeef5;
}

.el-table--border td,
.el-table--border th,
.el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
  border-right: 0px solid #ebeef5;
}

.el-table th.is-leaf .cell::after {
  height: 26px;
  width: 2px;
  background-color: #ebeef5;
  content: "";
  position: absolute;
  z-index: 1;
  right: 0px;
  top: calc(50% - 13px);
}

.el-table .is-leaf:last-child .cell::after,
.el-table--border::after,
.el-table--group::after,
.el-table__fixed-right::before,
.el-table__fixed::before,
.el-table::before {
  width: 0px !important;
}

.el-table-column--selection,
.el-table__expand-column {
  .cell {
    padding: 0;
  }
}

.el-table th,
.el-table__fixed-right-patch {
  background-color: #f5f7fa;
}

.el-table .el-table__row {
  height: 46px;
  td {
    padding: 0;
  }
}
.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #fafafa;
}
.el-pagination {
  text-align: right;
  padding: 12px 0;
}
</style>
