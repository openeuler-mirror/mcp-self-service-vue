<template>
  <!-- 公共镜像 -->
  <div class="publicImage">
    <!-- 头部菜单栏 -->
    <headerBox @refresh="refreshTable" :spinBol="tableLoading"> </headerBox>
    <mc-table
      ref="publicImageTable"
      :data="tableData"
      :total="total"
      :pageSize="pageSize"
      :currentPage="pageNo"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      :rowkey="rowkey"
      style="margin-top: 20px"
    >
      <template v-for="(item, index) in columnArr">
        <!-- 操作 -->
        <el-table-column
          v-if="item.prop == 'operation'"
          :key="index"
          :label="item.label"
          :width="item.width"
          className="tableoperation"
        >
          <template slot-scope="{ row }">
            <el-link
              type="primary"
              :disabled="row.createQuicklyDis"
              @click="createQuickly(row)"
            >
              快速创建
            </el-link>
          </template>
        </el-table-column>
        <!-- imageName -->
        <el-table-column
          v-else-if="item.prop == 'imageName'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <el-tooltip
              effect="light"
              :content="row[item.prop] + ''"
              placement="top"
              :visible-arrow="true"
            >
              <router-link
                :to="{
                  name: 'imageDetail',
                  params: { id: row.imageId, type: 'publicImage' },
                }"
              >
                <el-link type="primary">{{ row.imageName }}</el-link>
              </router-link>
              <!-- <span v-else>{{ row.name }}</span> -->
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column
          v-else-if="item.prop == 'status'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <imageStatus :status="row.status" :rowstatus="row"></imageStatus>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :prop="item.prop"
          :key="item.prop + index"
          :label="item.label"
          :width="item.width"
          :sortable="item.sortable"
        >
          <template slot-scope="{ row }">
            <el-tooltip
              v-if="item.tooltipsFlag"
              effect="light"
              :content="row[item.prop] + ''"
              placement="top"
              :visible-arrow="true"
            >
              <span>{{ row[item.prop] }}</span>
            </el-tooltip>
            <span v-else>{{ row[item.prop] }}</span>
          </template>
        </el-table-column>
      </template>
    </mc-table>

    <!-- 快速创建 -->
    <apply-drawer
      :visible="showcreateEditModal"
      @update:visible="showcreateEditModal = $event"
      :options="modalOption"
    ></apply-drawer>
  </div>
</template>

<script>
import headerBox from "@/components/headerBox";
import mcTable from "@/components/MctablePro";
import imageStatus from "../components/imageStatus.vue";
import applyDrawer from "../components/apply-drawer.vue";
import { pageImage, quickApplyServerVm } from "@/api/imageApi";
import dictionary from "@/assets/common/dataDictionary/dictionary";
export default {
  name: "publicImage",
  components: {
    headerBox,
    mcTable,
    applyDrawer,
    imageStatus,
  },
  data() {
    return {
      rowkey: "imageId",
      tableLoading: false,
      columnArr: [
        {
          label: "状态", // "状态",
          prop: "status",
        },
        {
          label: "名称", // "名称",
          prop: "imageName",
          tooltipsFlag: true,
        },
        {
          label: "描述", // "描述",
          prop: "imageRemark",
          tooltipsFlag: true,
        },
        {
          label: "容量", // "容量",
          prop: "imageSize",
        },
        {
          label: "镜像类型", // "镜像类型",
          prop: "typeDesc",
        },
        {
          label: "来源", // "来源",
          prop: "imageFromDesc",
        },
        {
          label: "可用区", // "可用区",
          prop: "zoneName",
          tooltipsFlag: true,
        },
        {
          label: "创建时间", // "创建时间",
          prop: "createTime",
          tooltipsFlag: true,
        },
        {
          label: "创建者", // "创建者",
          prop: "createUser",
        },
        {
          label: "操作", // "操作",
          prop: "operation",
          width: "200px",
        },
      ],
      tableData: [],
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,
      searchKey: "",
      // 模态框配置
      showcreateEditModal: false,
      modalOption: {
        title: "",
        imageType: "",
        formData: "", // 表单数据
      },
    };
  },
  created() {
    // this.renderTable();
  },
  mounted() {
    this.renderTable();
  },
  methods: {
    // 刷新表格
    refreshTable() {
      this.renderTable();
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
    // 搜索内容
    changeSearchKey(val) {
      this.searchKey = val;
    },

    renderTable() {
      this.$nextTick(() => {
        this.$showFullScreenLoading(".mc-table");
      });
      // 枚举: PUBLIC,SHARE,PRIVATE
      // 枚举备注: PUBLIC( "公共镜像"), SHARE("共享镜像"), PRIVATE("私有镜像"),
      let params = {
        visibleType: "PUBLIC",
        pageSize: this.pageSize, //	string	非必须 分页数量
        pageNo: this.pageNo, // 非必须 页面
        searchKey: this.searchKey, // 搜索内容
      };
      pageImage(params)
        .then((res) => {
          this.tableData = this.totableData(res.list);
          this.total = res.pageInfo.total;
          this.$hideFullScreenLoading();
        })
        .catch((err) => {
          this.$hideFullScreenLoading();
        });
    },
    totableData(list) {
      list.forEach((element, index) => {
        let { imageFrom, type, status } = element;
        // 来源映射
        list[index].imageFromDesc = dictionary.getDesc(
          imageFrom,
          dictionary.imageFromArr
        );
        // 镜像类型映射
        list[index].typeDesc = dictionary.getDesc(type, dictionary.imgtypeArr);

        // 快速创建按钮
        list[index].createQuicklyDis = true;
        if (status === "NORMAL") {
          list[index].createQuicklyDis = false;
        }
      });
      return list;
    },
    //
    createQuickly(row) {
      this.$showFullScreenLoading(".publicImage");
      this.modalOption.title = "申请云服务器"; // "申请云服务器";
      let params = {
        imageId: row.imageId,
      };
      quickApplyServerVm(params)
        .then((res) => {
          this.modalOption.formData = res;
          this.modalOption.imageType = res.imageType; // "iso/temp";
          this.showcreateEditModal = true;
          this.$hideFullScreenLoading();
        })
        .catch((err) => {
          this.alertTips(err);
          this.$hideFullScreenLoading();
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.publicImage {
  display: flex;
  flex-direction: column;
  flex: 1;
  .tableoperation {
    .cell {
      display: inline-flex;
      align-items: center;
      // .el-link,
      .el-dropdown {
        height: 100%;
        margin-left: 15px;
      }
    }
  }
}
</style>
