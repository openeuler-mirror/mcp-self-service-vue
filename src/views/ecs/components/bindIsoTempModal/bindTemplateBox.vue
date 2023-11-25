<template>
  <div class="drawer-content">
    <div class="bind-table">
      <div class="iossearch-box">
        <div class="small-select-box select-box">
          <el-select
            v-model="isoValue"
            placeholder="请选择"
            @change="isoValuechange"
          >
            <el-option
              v-for="item in isoOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="small-input-box input-box">
          <el-input
            ref="sinput"
            v-model="input"
            placeholder="搜索"
            prefix-icon="el-icon-search"
            :clearable="true"
            @change="inputchange"
          />
        </div>
      </div>
      <!-- 没有所需ISO？前往镜像管理上传【私有镜像】 -->
      <div class="flex align-center">
        <span> 没有所需ISO？前往镜像管理上传【</span>
        <el-link type="primary" @click="toImgMgr"> 私有镜像 </el-link>
        <span>】</span>
      </div>
      <mc-table
        ref="isotable"
        :data="tableData"
        :total="total"
        :pageSize="pageSize"
        :currentPage="pageNo"
        :defaultSelectedKeys="defaultSelectedKeysNew"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        @handleSelectione="handleSelectione"
        @row-click="rowSelect"
        :rowkey="rowkey"
        selectionType="singleTable"
        style="margin-top: 20px"
      >
        <template v-for="(item, index) in columnArr">
          <el-table-column :key="index" :label="item.label" :width="item.width">
            <template slot-scope="{ row }">
              <el-tooltip
                v-if="item.tooltipsFlag"
                effect="light"
                :content="row[item.prop] + ''"
                placement="top"
                :visible-arrow="true"
              >
                <span style="width: 100%">{{ row[item.prop] }}</span>
              </el-tooltip>
              <span v-else>{{ row[item.prop] }}</span>
            </template>
          </el-table-column>
        </template>
      </mc-table>
    </div>

    <foot-btn
      class="drawer-foot"
      @confirm="handlerConfirm"
      @cancel="handlerCancel"
    />
  </div>
</template>
<script>
import mcTable from "@/components/MctablePro";
import footBtn from "@/components/Footbtn";

import { listIsoImage } from "@/api/serverVm";

export default {
  components: { mcTable, footBtn },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    defaultSelectedKeys: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      input: "",
      rowkey: "isoKey",
      columnArr: [
        { label: "ISO镜像名称", prop: "isoLabel", tooltipsFlag: true },
        {
          label: "镜像描述",
          prop: "isoRemark",
          tooltipsFlag: true,
        },
        {
          label: "镜像大小",
          prop: "isoSize",
        },
      ],
      tableData: [],
      oritableData: [],
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,
      selectList: [],
      defaultSelectedKeysNew: [],
      isoValue: "All",
      isoReqValue: null,
      isoOptions: [
        { value: "All", label: "全部" },
        { value: "PUBLIC", label: "公共镜像" },
        { value: "SHARE", label: "共享镜像" },
        { value: "PRIVATE", label: "私有镜像" },
        // 枚举: PUBLIC,SHARE,PRIVATE
        // 枚举备注: PUBLIC( "公共镜像"), SHARE("共享镜像"), PRIVATE("私有镜像"),
      ],
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
    },
  },
  created() {
    this.renderTable();
  },
  computed: {},
  methods: {
    toImgMgr() {
      this.$router.push({
        name: "imageMgr",
        params: { type: "privateImage" },
      });
    },
    // 提交
    handlerConfirm() {
      this.commitCreate();
    },
    commitCreate() {
      if (this.selectList.length > 0) {
        this.$emit("confirm", this.selectList);
      }
      this.$parent.closeDrawer();
    },
    handlerCancel() {
      this.$parent.closeDrawer();
    },

    renderTable() {
      const loading = this.$loading({
        lock: true,
        text: "正在拼命加载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let pramas = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        visibleType: this.isoReqValue,
        searchKey: this.input,
      };
      listIsoImage(pramas)
        .then((res) => {
          this.total = res.pageInfo.total;
          this.tableData = this.setTableData(res.list);

          let selected = [];
          this.defaultSelectedKeys.forEach((element) => {
            let { isoImageId } = element;
            selected.push(isoImageId);
          });
          this.$nextTick(() => {
            for (let i = 0; i < selected.length; i++) {
              let row = this.tableData.find(
                (item) => item.isoImageId.toString() === selected[i].toString()
              );
              if (row) {
                this.$refs.isotable.$refs.elTable.toggleRowSelection(row);
              }
            }
          });

          loading.close();
        })
        .catch((err) => {
          loading.close();
          this.alertTips(err);
        });
    },
    setTableData(orilist) {
      let newList = [];

      orilist.forEach((element) => {
        let {
          isoImageId, // iso镜像id
          isoName, //iso镜像名称
          isoRemark, //iso镜像描述
          isoSize, //镜像大小
        } = element;
        newList.push({
          clusterId: "",
          clusterName: "",
          clusterRemark: "",
          isoLabel: isoName,
          isoKey: isoImageId,
          ...element,
        });
      });
      return newList;
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
    isoValuechange(val) {
      if (val === "All") {
        this.isoReqValue = null;
      } else {
        this.isoReqValue = val;
      }
      this.pageNo = 1;
      this.pageSize = 20;
      this.renderTable();
    },
    inputchange() {
      this.pageNo = 1;
      this.pageSize = 20;
      this.renderTable();
      // renderTable
      // this.tableData = data;
    },
    handleSelectione(rows) {
      this.selectList = rows;
    },
    rowSelect(row) {
      if (this.selectList.length > 0) {
        let currentRow = this.selectList[0];
        if (currentRow[this.rowkey] == row[this.rowkey]) {
          this.$refs.isotable.handleSelectione([]);
        } else {
          this.$refs.isotable.handleSelectione([row]);
        }
      } else {
        this.$refs.isotable.handleSelectione([row]);
      }
    },
  },
};
</script>
<style>
.search-box .small-input-box .el-input__suffix {
  right: 12px;
}
</style>
<style lang="scss" scope>
@import "~@/styles/mixin.scss";
@include DrawerRtl;

.bind-table {
  display: flex;
  flex-direction: column;
  flex: 1;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  padding: 0 50px;
}
.iossearch-box {
  display: inline-flex;
  margin-bottom: 20px;
  .small-select-box {
    width: 200px;
  }
  .small-input-box {
    flex: 1;
    margin-left: 15px;
  }
}
</style>
