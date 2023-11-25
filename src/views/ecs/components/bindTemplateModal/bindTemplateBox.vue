<template>
  <div class="drawer-content">
    <div class="bind-table">
      <div class="tempsearch-box">
        <div class="small-select-box select-box">
          <el-select
            v-model="tempValue"
            placeholder="请选择"
            @change="tempValuechange"
          >
            <el-option
              v-for="item in tempOptions"
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

      <mc-table
        ref="temptable"
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
        <el-table-column type="expand" :resizable="false" width="20px">
          <template slot-scope="{ row }">
            <div class="demo-table-expand flex">
              <div class="expand-item">
                <div class="expand-item-label">描述：</div>
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="row.templateImageRemark"
                  placement="top"
                >
                  <div class="expand-item-value">
                    {{ row.templateImageRemark }}
                  </div>
                </el-tooltip>
              </div>
              <div
                class="expand-item"
                v-for="(item, index) in row.disks"
                :key="'disk' + row[rowkey] + index"
              >
                <div class="expand-item-label">
                  {{
                    "磁盘" + (row.disks.length > 1 ? index + 1 + "：" : "：")
                  }}
                </div>
                <div class="expand-item-value">{{ item.diskSize }}GB</div>
              </div>
              <div
                class="expand-item"
                v-for="(item, index) in row.networks"
                :key="'networks' + +row[rowkey] + index"
              >
                <div class="expand-item-label">
                  {{
                    "网卡" + (row.networks.length > 1 ? index + 1 + "：" : "：")
                  }}
                </div>
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="item.purpose"
                  placement="top"
                >
                  <div class="expand-item-value">{{ item.purpose }}</div>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
        <template v-for="(item, index) in columnArr">
          <el-table-column
            v-if="item.prop == 'cpumem'"
            :key="index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <span>{{ row.cpu + "核/" + row.mem + "GB" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.prop == 'templateName'"
            :key="index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                class="item"
                effect="light"
                :content="row[item.prop]"
                placement="top"
              >
                <span class="table-ccsl">{{ row[item.prop] }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="index"
            :label="item.label"
            :width="item.width"
            :resizable="index != columnArr.length - 1"
          >
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
import { listTemplateImage } from "@/api/serverVm";

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
      rowkey: "templateId",
      columnArr: [
        { label: "模板名称", prop: "templateName" },
        {
          label: "CPU/内存",
          prop: "cpumem",
          width: "100",
        },
        {
          label: "磁盘大小（GB）",
          prop: "diskInfo",
          width: "150",
        },
        {
          label: "操作系统",
          prop: "osMachine",
        },
        {
          label: "架构",
          prop: "architecture",
          width: "100",
        },
        // {
        //   label: "集群名称",
        //   prop: "clusterName",
        //   tooltipsFlag: true,
        // },
        // {
        //   label: "集群描述",
        //   prop: "clusterRemark",
        //   tooltipsFlag: true,
        // },
      ],
      tableData: [],
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,
      selectList: [],
      defaultSelectedKeysNew: [],
      cpu_mem: "1核/1GB",
      cpuMemList: [
        { cpuValue: "1", memValue: "1", label: "1核/1GB" },
        { cpuValue: "2", memValue: "2", label: "2核/2GB" },
        { cpuValue: "4", memValue: "4", label: "4核/4GB" },
      ],
      tempValue: "All",
      tempReqValue: null,
      tempOptions: [
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
        visibleType: this.tempReqValue,
        searchKey: this.input,
      };
      listTemplateImage(pramas)
        .then((res) => {
          this.total = res.pageInfo.total;
          this.tableData = this.setTableData(res.list);
          let selected = [];
          this.defaultSelectedKeys.forEach((element) => {
            let { templateImageId } = element;
            selected.push(templateImageId);
          });
          this.$nextTick(() => {
            for (let i = 0; i < selected.length; i++) {
              let row = this.tableData.find(
                (item) =>
                  item.templateImageId.toString() === selected[i].toString()
              );
              if (row) {
                this.$refs.temptable.$refs.elTable.toggleRowSelection(row);
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
          templateImageId, // 模板镜像id
          templateImageName, // 模板镜像名称
          templateImageRemark, // 镜像描述
        } = element;
        newList.push({
          templateId: templateImageId,
          templateName: templateImageName,
          networks: [],
          clusterId: "",
          clusterName: "",
          clusterRemark: "",
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
    tempValuechange(val) {
      if (val === "All") {
        this.tempReqValue = null;
      } else {
        this.tempReqValue = val;
      }
      this.pageNo = 1;
      this.pageSize = 20;
      this.renderTable();
    },
    inputchange() {
      this.pageNo = 1;
      this.pageSize = 20;
      this.renderTable();
    },
    handleSelectione(rows) {
      this.selectList = rows;
    },
    rowSelect(row) {
      if (this.selectList.length > 0) {
        let currentRow = this.selectList[0];
        if (currentRow[this.rowkey] == row[this.rowkey]) {
          this.$refs.temptable.handleSelectione([]);
        } else {
          this.$refs.temptable.handleSelectione([row]);
        }
      } else {
        this.$refs.temptable.handleSelectione([row]);
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
<style lang="scss" scope >
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
  .el-table__expanded-cell[class*="cell"] {
    padding: 5px 5px;
  }
  .demo-table-expand {
    box-shadow: 0px 0px 4px 3px #ededed;
    padding: 10px;
    flex-wrap: wrap;
    justify-content: space-between;
    .expand-item {
      display: flex;
      align-items: center;
      line-height: 26px;
      font-size: 14px;

      .expand-item-label {
        color: #666;
        width: 50px;
      }
      .expand-item-value {
        color: #666;
        width: 150px;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .table-ccsl {
    width: 100%;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.tempsearch-box {
  display: inline-flex;
  .small-select-box {
    width: 200px;
  }
  .small-input-box {
    flex: 1;
    margin-left: 15px;
  }
}
</style>
