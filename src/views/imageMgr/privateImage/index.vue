<template>
  <!-- 公共镜像 -->
  <div class="privateImage">
    <!-- 头部菜单栏 -->
    <header-bar
      ref="headerBar"
      :selectData="selectTable"
      @refreshTable="refreshTable"
    />

    <mc-table
      ref="privateImageTable"
      :data="tableData"
      :total="total"
      :pageSize="pageSize"
      :currentPage="pageNo"
      @selection-change="handlerSelectionChange"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      :rowkey="rowkey"
      :selectionType="selectionType"
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
            <el-link type="primary" @click="editInfo(row)">
              {{ $t("common.modify") }}
            </el-link>
            <el-dropdown trigger="click" @visible-change="visibleChange">
              <el-link type="primary" @click.stop="stoplinkclick">
                <!-- 更多 -->
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-link>
              <el-dropdown-menu slot="dropdown">
                <template v-for="(item, index) in row.toggleList">
                  <el-dropdown-item :key="item.key + index" :command="item">
                    <el-link
                      @click="downToggleCommand(item.key, row)"
                      :disabled="item.disabled"
                      :underline="false"
                    >
                      {{ item.label }}
                    </el-link>
                  </el-dropdown-item>
                </template>
                <el-dropdown-item v-if="toggleList.length == 0">
                  <el-link :underline="false"> 暂无更多操作 </el-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
                  params: { id: row.imageId, type: 'privateImage' },
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

    <!-- 创建/编辑 -->
    <createEditModal
      :options="modalOption"
      :visible.sync="showcreateEditModal"
    ></createEditModal>
    <!-- 快速创建 -->
    <apply-drawer
      :visible="showapplyDrawerModal"
      @update:visible="showapplyDrawerModal = $event"
      :options="applyDrawerOption"
    ></apply-drawer>
  </div>
</template>

<script>
import mcTable from "@/components/MctablePro";
import headerBar from "./header.vue";
import imageStatus from "../components/imageStatus.vue";
import applyDrawer from "../components/apply-drawer.vue";
import createEditModal from "./editImage/createEditModal.vue";
import {
  pageImage,
  imageDetail,
  syncImage,
  deleteImage,
  imageDownload,
  quickApplyServerVm,
} from "@/api/imageApi";
import dictionary from "@/assets/common/dataDictionary/dictionary";
export default {
  name: "privateImage",
  components: {
    headerBar,
    mcTable,
    createEditModal,
    imageStatus,
    applyDrawer,
  },
  data() {
    return {
      rowkey: "imageId",
      selectionType: "multipleTable",
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
          width: "250px",
        },
      ],
      tableData: [],
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,
      searchKey: "",
      toggleList: [
        {
          key: "imageDownload",
          label: "导出镜像", // "导出镜像",
          disabled: true,
          show: true,
        },
        {
          key: "syncImage",
          label: "同步镜像", // "同步镜像",
          disabled: false,
          show: true,
        },
        {
          key: "deleteImage",
          label: "删除", //"同步镜像",
          disabled: true,
          show: true,
        },
      ],
      // 模态框配置
      showcreateEditModal: false,
      modalOption: {
        title: "",
        editflag: "",
        formData: "", // 表单数据
      },
      showapplyDrawerModal: false,
      applyDrawerOption: {
        title: "",
        editflag: "",
        formData: "", // 表单数据
      },
      selectTable: [],
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
        visibleType: "PRIVATE",
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
      let toggleList = JSON.parse(JSON.stringify(this.toggleList));
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

        toggleList.forEach((toggleListelement, toggleListi) => {
          let { key } = toggleListelement;

          toggleList[toggleListi].disabled = true;
          switch (key) {
            case "imageDownload":
              toggleList[toggleListi].disabled = false;
              break;

            case "syncImage":
              if (status == "ERROR") {
                toggleList[toggleListi].disabled = false;
              }
              break;
            case "deleteImage":
              let statusArr = ["ERROR", "NORMAL"];
              if (statusArr.indexOf(status) > -1) {
                toggleList[toggleListi].disabled = false;
                list[index].deleteImageDisabled = false;
              } else {
                list[index].deleteImageDisabled = true;
              }

              break;
            default:
              toggleList[toggleListi].disabled = false;
              break;
          }
        });
        list[index].toggleList = JSON.parse(JSON.stringify(toggleList));
      });
      return list;
    },
    editInfo(row) {
      this.$showFullScreenLoading(".publicImage");
      this.modalOption.title = "编辑镜像"; // "编辑镜像";
      let params = {
        imageId: row.imageId,
      };
      imageDetail(params)
        .then((res) => {
          this.modalOption.formData = res;
          this.showcreateEditModal = true;
          this.$hideFullScreenLoading();
        })
        .catch((err) => {
          this.alertTips(err);
          this.$hideFullScreenLoading();
        });
    },
    stoplinkclick() {},
    visibleChange() {},
    downToggleCommand(key, row) {
      switch (key) {
        case "imageDownload": // 导出镜像
          this.imageDownload(row);
          break;
        case "syncImage": // 同步镜像
          this.setsyncImage(row);
          break;
        case "deleteImage": // 删除镜像
          this.setdeleteImage(row);
          break;

        default:
          break;
      }
    },
    imageDownload(row) {
      let params = {
        imageId: row.imageId, // 镜像id
      };
      imageDownload(params)
        .then((res) => {
          window.open(res.mcDownLoadUrl, "_self");
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    setsyncImage(row) {
      let params = {
        imageId: row.imageId, // 镜像id
      };
      syncImage(params)
        .then((res) => {
          this.alertTips("同步镜像成功", "success");
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    setdeleteImage(row) {
      let deleteConfirm = "确定删除该镜像?"; // 确定删除该镜像?
      let deleteSuccess = "删除镜像成功!"; // "删除镜像成功!"
      this.$confirm(deleteConfirm, this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      })
        .then(() => {
          let params = {
            imageId: row.imageId, // 镜像id
          };
          deleteImage(params)
            .then((res) => {
              this.alertTips(deleteSuccess, "success");
              this.refreshTable();
            })
            .catch((err) => {
              this.alertTips(err);
            });
        })
        .catch(() => {
          this.alertTips(this.$t("common.canceled"), "info");
        });
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
          this.applyDrawerOption.formData = res;
          this.applyDrawerOption.imageType = res.imageType; // "iso/temp";
          this.showapplyDrawerModal = true;
          this.$hideFullScreenLoading();
        })
        .catch((err) => {
          this.alertTips(err);
          this.$hideFullScreenLoading();
        });
    },
    handlerSelectionChange(selection) {
      this.selectTable = selection;
    },
  },
};
</script>
<style lang="scss" scoped>
.privateImage {
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