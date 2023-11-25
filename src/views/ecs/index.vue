<template>
  <div class="ecs app-container">
    <!-- 云服务器头部菜单栏 -->
    <header-bar
      ref="headerBar"
      :select-data="selectTable"
      @refreshTable="refreshTable"
      @handleToApply="showApplyDrawer = true"
      @headerBarEmit="headerBarEmit"
    />
    <!-- 云服务器列表 -->
    <mc-table
      ref="escTable"
      :data="tableData"
      :total="total"
      :page-size="pageSize"
      :current-page="pageNo"
      :filter-data="columnArr"
      :rowkey="rowkey"
      :selection-type="selectionType"
      style="margin-top: 20px"
      @selection-change="handlerSelectionChange"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      @filter-change="filterChange"
      @row-click="rowSelect"
    >
      <template v-for="(item, index) in columnShowArr">
        <!-- 状态 -->
        <el-table-column
          v-if="item.prop === 'status'"
          :key="'esc' + index"
          column-key="ecsStatus"
          :label="item.label + statusLable"
          :prop="item.prop"
          :width="item.width"
          :sortable="item.sortable"
          :filters="statusFilter"
          :filter-multiple="false"
          :resizable="index != 0 && index != columnShowArr.length - 1"
        >
          <template slot-scope="{ row }">
            <div class="status-row">
              <span v-if="row[item.prop] === 'OVERDUE'" class="error"
                ><i class="el-icon-warning-outline" />已过期</span
              >
              <span v-else-if="row[item.prop] === 'AVAILABLE'" class="success"
                ><i class="el-icon-video-play" />在线</span
              >
              <span v-else-if="row[item.prop] === 'CONNECTED'" class="success"
                ><i class="el-icon-circle-check" />已连接</span
              >
              <span v-else-if="row[item.prop] === 'INSTALLING'" class="success"
                ><i class="el-icon-refresh-left" />安装</span
              >
              <span v-else-if="row[item.prop] === 'SUSPEND'" class="success"
                ><i class="el-icon-video-play" />暂停</span
              >
              <span v-else-if="row[item.prop] === 'OFFLINE'" class="offline">
                <i class="el-icon-video-pause" />离线
              </span>
              <span v-else-if="row[item.prop] === 'UNKNOWN'" class="error"
                ><i class="el-icon-warning" />其他</span
              >
            </div>
          </template>
        </el-table-column>

        <!-- 任务状态 -->
        <el-table-column
          v-else-if="item.prop === 'taskStatus'"
          :key="'taskStatus' + index"
          column-key="ecstaskStatus"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
          :sortable="item.sortable"
        >
          <template slot-scope="{ row }">
            <div class="taskStatus-row">
              <span v-if="row[item.prop] === 'LEISURE'" class="leisure">
                空闲
              </span>
              <span v-else-if="row[item.prop] === 'NEW'" class="leisure">
                新建
              </span>
              <span v-else-if="row[item.prop] === 'INSTALLING'" class="running">
                <i class="el-icon-loading" /> 安装中
              </span>
              <span v-else-if="row[item.prop] === 'NEWFAILED'" class="error">
                新建失败
              </span>
              <span
                v-else-if="row[item.prop] === 'INSTALLFAILED'"
                class="error"
              >
                安装失败
              </span>
              <span v-else-if="row[item.prop] === 'CREATING'" class="running">
                <i class="el-icon-loading" /> 正在创建
              </span>
              <span v-else-if="row[item.prop] === 'STARTING'" class="running">
                <i class="el-icon-loading" /> 正在开机
              </span>
              <span
                v-else-if="row[item.prop] === 'SHUTDOWNING'"
                class="running"
              >
                <i class="el-icon-loading" /> 正在关机
              </span>
              <span v-else-if="row[item.prop] === 'REBOOTING'" class="running">
                <i class="el-icon-loading" /> 正在重启
              </span>
              <span v-else-if="row[item.prop] === 'SUSPENDING'" class="running">
                <i class="el-icon-loading" /> 正在暂停
              </span>
              <span v-else-if="row[item.prop] === 'RESUMING'" class="running">
                <i class="el-icon-loading" /> 正在唤醒
              </span>
              <span
                v-else-if="row[item.prop] === 'VOLUME_MIGRATING'"
                class="running"
              >
                <i class="el-icon-loading" /> 正在存储迁移
              </span>
              <span
                v-else-if="row[item.prop] === 'HOST_MIGRATING'"
                class="running"
              >
                <i class="el-icon-loading" /> 正在主机迁移
              </span>
              <span
                v-else-if="row[item.prop] === 'BACKUP_RUNNING'"
                class="running"
              >
                <i class="el-icon-loading" /> 正在备份
              </span>
              <span
                v-else-if="row[item.prop] === 'BACKUP_RECOVERING'"
                class="running"
              >
                <i class="el-icon-loading" /> 正在备份恢复
              </span>
              <span
                v-else-if="row[item.prop] === 'SNAPSHOT_RUNNING'"
                class="running"
              >
                <i class="el-icon-loading" /> 正在快照
              </span>
              <span
                v-else-if="row[item.prop] === 'SNAPSHOT_RECOVERING'"
                class="running"
              >
                <i class="el-icon-loading" /> 正在快照恢复
              </span>
              <span v-else-if="row[item.prop] === 'IMPORTING'" class="running">
                <i class="el-icon-loading" /> 正在导入
              </span>
              <span v-else-if="row[item.prop] === 'EXPORTING'" class="running">
                <i class="el-icon-loading" /> 正在导出
              </span>
              <span v-else-if="row[item.prop] === 'CLONING'" class="running">
                <i class="el-icon-loading" />
                正在克隆
              </span>
              <span
                v-else-if="row[item.prop] === 'DISK_COPYING'"
                class="running"
              >
                <i class="el-icon-loading" /> 正在磁盘复制
              </span>
              <span
                v-else-if="row[item.prop] === 'CREATE_KCP_IMAGE'"
                class="running"
              >
                <i class="el-icon-loading" /> 正在制作模板镜像
              </span>
              <span v-else class="error">其他</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          v-else-if="item.prop == 'deadlineTime'"
          :key="item.prop + index"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
          :sortable="item.sortable"
        >
          <template slot-scope="{ row }">
            <div class="status-row">
              <span v-if="row[item.prop] < 0" class="error">
                {{ row[item.prop] }}(已过期)
              </span>
              <span
                v-else-if="row[item.prop] <= 3 && row[item.prop] >= 0"
                class="warn"
              >
                {{ row[item.prop] }}(即将过期)
              </span>

              <span v-else>{{ row[item.prop] }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
          :sortable="item.sortable"
        >
          <template slot-scope="{ row }">
            <el-tooltip
              v-if="item.isLink"
              effect="light"
              :content="row[item.prop] + ''"
              placement="top"
              :visible-arrow="true"
            >
              <router-link
                :to="{
                  name: 'serviceDetail',
                  params: {
                    serverVmUuid: row.serverVmUuid,
                    tab: 'summary',
                    clusterId: row.clusterId,
                  },
                }"
              >
                <el-link type="primary">{{ row[item.prop] }}</el-link>
              </router-link>
            </el-tooltip>
            <div v-else-if="item.isProgress" class="progress-row">
              <!-- //判断状态，如果为在线状态，显示利用率 -->
              <div
                v-if="
                  row.status === 'AVAILABLE' ||
                  row.status === 'CONNECTED' ||
                  row.status === 'SUSPEND'
                "
              >
                <div class="progress-item">
                  <span>CPU：</span>
                  <el-progress
                    :percentage="setItemProgress(row[item.prop], 1)"
                    :color="customColorMethod"
                    :stroke-width="4"
                  />
                </div>
                <div class="progress-item">
                  <span>内存：</span>
                  <el-progress
                    :percentage="setItemProgress(row[item.prop], 2)"
                    :color="customColorMethod"
                    :stroke-width="4"
                  />
                </div>
                <!-- <div class="progress-item"><span>磁盘：</span><el-progress :percentage="setItemProgress(row[item.prop],3)" :color="customColorMethod" :stroke-width="4" /></div> -->
              </div>
              <div v-else />
            </div>

            <!-- <el-tooltip v-else class="item" effect="light" :content="row[item.prop]+''" placement="bottom-start"  :visible-arrow="false">
                 <span style="width:item.width">{{ row[item.prop] }}</span>
                </el-tooltip> -->

            <span v-else>
              <el-tooltip
                v-if="item.tooltipsFlag"
                effect="light"
                :content="row[item.prop] + ''"
                placement="top"
                :visible-arrow="true"
              >
                <span style="width: item.width">{{ row[item.prop] }}</span>
              </el-tooltip>
              <span v-else>{{ row[item.prop] }}</span>
            </span>
          </template>
        </el-table-column>
      </template>
      <el-table-column width="200px" fixed="right" class-name="tableoperation">
        <template slot="header">
          <div class="tableoperation-header">
            <div>操作</div>
            <oper
              :filter-data="columnArr"
              :clumn-name="'ecs-table'"
              @tableColumn="getTableColumn"
            />
          </div>
        </template>
        <template slot-scope="{ row }">
          <el-link
            v-if="row.startBtnShow"
            :disabled="row.startBtnDisabled"
            type="primary"
            @click.stop="startServerVm(row)"
          >
            开机
          </el-link>
          <el-link
            v-if="row.vncBtnShow"
            :disabled="row.vncBtnDisabled"
            type="primary"
            @click.stop="openVnc(row)"
          >
            控制台
          </el-link>
          <btn-more
            ref="btnMore"
            :key="row.serverVmId"
            :disabled-list="[]"
            :select-data="[row]"
            :btn-type="'link'"
            class="el-link"
            @downToggleCommand="downToggleCommand"
            @handleShowChangeServices="handleShowChangeServices(row)"
            @handleShowDely="handleShowDely(row)"
            @downToggle="downToggle"
            @refreshTable="refreshTable"
          />
        </template>
      </el-table-column>
    </mc-table>

    <!-- 申请延期 -->
    <delay-drawer
      :visible.sync="showDelayDrawer"
      :select-row-data="selectRowData"
    />

    <!-- 申请云服务器 -->
    <apply-drawer
      :visible="showApplyDrawer"
      @update:visible="showApplyDrawer = $event"
    />

    <!-- 变更规格 -->
    <changeservices-drawer
      :visible.sync="showChangeSevicesDrawer"
      :select-row-data="selectRowData"
    />

    <!-- 制作镜像 -->
    <makeImageModal
      :options="makeImageModalOption"
      :visible.sync="showmakeImageModalModal"
    ></makeImageModal>
  </div>
</template>

<script>
import mcTable from "@/components/MctablePro";
import oper from "@/components/Operation";
import {
  headerBar,
  btnMore,
  delayDrawer,
  applyDrawer,
  changeservicesDrawer,
} from "./components/main/index";
import ReMessage from "@/utils/message";
import { getServerVmList, getVncUrl, startServerVm } from "@/api/serverVm";
import actbtnPms from "./components/main/actbtnPmsList";
import makeImageModal from "./components/makeImage/createEditModal.vue";
export default {
  name: "Ecs",
  components: {
    mcTable,
    oper,
    headerBar,
    btnMore,
    delayDrawer,
    applyDrawer,
    changeservicesDrawer,
    makeImageModal,
  },
  data() {
    return {
      rowkey: "serverVmId",
      selectionType: "multipleTable",
      columnArr: [
        // 表格总的列数据
        {
          label: "ID",
          prop: "serverVmId",
          show: false,
          width: "80px",
          tooltipsFlag: false,
        },
        {
          label: "UUID",
          prop: "serverVmUuid",
          show: false,
          width: "120px",
          tooltipsFlag: true,
        },
        {
          label: "名称",
          prop: "aliasName",
          width: "200px",
          isLink: true,
          show: true,
          tooltipsFlag: true,
        },
        {
          label: "状态",
          prop: "status",
          show: true,
          width: 150,
          tooltipsFlag: false,
        },
        {
          label: "任务状态",
          prop: "taskStatus",
          show: true,
          width: 120,
          tooltipsFlag: true,
        },
        {
          label: "IP地址",
          prop: "ip",
          width: 100,
          show: true,
          tooltipsFlag: true,
        },
        {
          label: "操作系统",
          prop: "os",
          width: 100,
          show: true,
          tooltipsFlag: true,
        },
        {
          label: "架构",
          prop: "architecture",
          width: 100,
          show: true,
          tooltipsFlag: true,
        },
        {
          label: "CPU(核)",
          prop: "cpus",
          width: 80,
          show: true,
          tooltipsFlag: false,
        },
        {
          label: "内存(GB)",
          prop: "memory",
          width: 80,
          show: true,
          tooltipsFlag: false,
        },
        { label: "磁盘(GB)", prop: "disks", show: true, tooltipsFlag: true },
        {
          label: "利用率",
          prop: "usage",
          width: 200,
          isProgress: true,
          show: true,
          tooltipsFlag: false,
        },
        {
          label: "创建时间",
          prop: "createDate",
          width: 120,
          sortable: true,
          show: true,
          tooltipsFlag: false,
        },
        {
          label: "到期时间(天)",
          prop: "deadlineTime",
          width: 130,
          sortable: true,
          show: true,
          tooltipsFlag: false,
        },
        {
          label: "描述",
          prop: "description",
          width: 100,
          show: false,
          tooltipsFlag: true,
        },
      ],
      columnShowArr: [], // 实际显示的表格列
      tableData: [], // 表格渲染数据
      selectTable: [], // 表格选中数据
      showApplyDrawer: false, // 是否显示申请云服务器
      showDelayDrawer: false, // 是否显示申请延期
      showChangeSevicesDrawer: false, // 是否显示变更规格
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,
      searchStatus: "ALL",
      searchKey: "",
      selectRowData: {},
      statusLable: "",
      statusFilter: [
        { text: "在线", value: "AVAILABLE" },
        { text: "离线", value: "OFFLINE" },
        { text: "安装", value: "INSTALLING" },
        { text: "已连接", value: "CONNECTED" },
        { text: "暂停", value: "SUSPEND" },
        { text: "其他", value: "UNKNOWN" },
      ],
      timer: "",
      loading: "",
      //制作镜像模态框配置
      showmakeImageModalModal: false,
      makeImageModalOption: {
        title: "",
        editflag: "",
        formData: "", // 表单数据
      },
    };
  },
  created() {
    this.renderTable();
  },
  mounted() {
    this.timer = setInterval(this.timeRefresh, 20000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    headerBarEmit(rows) {
      const tableDataOri = JSON.parse(JSON.stringify(this.tableData));
      this.tableData = [];
      tableDataOri.forEach((element, index) => {
        rows.forEach((row, k) => {
          if (row.serverVmId === element.serverVmId) {
            tableDataOri[index] = JSON.parse(JSON.stringify(row));
          }
        });
      });

      this.tableData = JSON.parse(JSON.stringify(tableDataOri));
    },
    downToggleCommand(row) {
      const tableDataOri = JSON.parse(JSON.stringify(this.tableData));
      this.tableData = [];
      const { serverVmId } = row;
      tableDataOri.forEach((element, index) => {
        if (serverVmId === element.serverVmId) {
          tableDataOri[index] = JSON.parse(JSON.stringify(row));
        }
      });
      this.tableData = JSON.parse(JSON.stringify(tableDataOri));
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
    timeRefresh() {
      const pageNo = this.pageNo;
      const pageSize = this.pageSize;
      const searchKey = this.searchKey;
      if (!this.searchStatus) {
        this.searchStatus = "ALL";
      }
      const vmStatus = this.searchStatus;
      this.selectTable = [];
      const headers = { TIME_REFRESH: "TIME_REFRESH" };
      this.getServerVmTableList(
        { pageNo, pageSize, searchKey, vmStatus },
        headers
      );
    },
    getServerVmTableList({ pageNo, pageSize, searchKey, vmStatus }, headers) {
      getServerVmList({ pageNo, pageSize, searchKey, vmStatus }, headers).then(
        (res) => {
          this.tableData = this.dealBootUp(res.list);
          this.total = res.pageInfo.total;
          this.loading.close();
        }
      );
    },
    renderTable() {
      this.loading = this.$loading({
        lock: true,
        text: "拼命加载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      const pageNo = this.pageNo;
      const pageSize = this.pageSize;
      const searchKey = this.searchKey;
      if (!this.searchStatus) {
        this.searchStatus = "ALL";
      }
      const vmStatus = this.searchStatus;
      this.selectTable = [];
      const headers = {};
      this.getServerVmTableList(
        { pageNo, pageSize, searchKey, vmStatus },
        headers
      );
    },
    dealBootUp(list) {
      // 电源状态 status
      // 任务状态 taskStatus
      list.forEach((element) => {
        const { status, taskStatus } = element;

        element.startBtnShow = false; // 开机按钮start Show
        element.startBtnDisabled = true; // 开机按钮start Disabled

        element.shutdownBtnShow = false; // 关机按钮 shutdown Show
        element.shutdownBtnDisabled = true; // 开机按钮 shutdown Disabled

        element.vncBtnShow = false; // 控制台按钮vnc Show
        element.vncBtnDisabled = true; // 控制台按钮vnc Disabled

        element.abortBtnShow = false; // 强制关机按钮 abort Show
        element.abortBtnDisabled = true; // 强制关机按钮 abort Disabled

        element.rebootBtnShow = false; // 重启按钮 reboot Show
        element.rebootBtnDisabled = true; // 重启按钮 reboot Disabled

        element.forcerebootBtnShow = false; // 强制重启按钮 forcereboot Show
        element.forcerebootBtnDisabled = true; // 强制重启按钮 forcereboot Disabled

        element.snapshotBtnShow = false; // 快照按钮 snapshot Show
        element.snapshotBtnDisabled = true; // 快照按钮 snapshot Disabled

        element.editBtnShow = false; // 变更规格按钮 edit Show
        element.editBtnDisabled = true; // 变更规格按钮 edit Disabled

        element.applyDeferredBtnShow = false; // 申请延期按钮 applyDeferred Show
        element.applyDeferredBtnDisabled = true; // 申请延期按钮 applyDeferred Disabled

        element.makeImageBtnShow = false; // 制作镜像 makeImage Show
        element.makeImageBtnDisabled = true; // 制作镜像 makeImage Disabled
        if (taskStatus === "LEISURE") {
          // 根据电源状态控制
          // 根据电源状态控制处理 开机按钮start startBtn
          if (actbtnPms.startstatusShowList.indexOf(status) > -1) {
            element.startBtnShow = true;
            element.startBtnDisabled = false;
          }
          // 根据电源状态控制处理 关机按钮 shutdown
          if (actbtnPms.shutdownstatusShowList.indexOf(status) > -1) {
            element.shutdownBtnShow = true;
            element.shutdownBtnDisabled = false;
          }
          // 根据电源状态控制处理 控制台按钮vnc vncBtn
          if (actbtnPms.vncstatusShowList.indexOf(status) > -1) {
            element.vncBtnShow = true;
            element.vncBtnDisabled = false;
          }
          // 根据电源状态控制处理 强制关机按钮abort abortBtn
          if (actbtnPms.abortstatusShowList.indexOf(status) > -1) {
            element.abortBtnShow = true;
            element.abortBtnDisabled = false;
          }
          // 根据电源状态控制处理 重启按钮 reboot
          if (actbtnPms.rebootstatusShowList.indexOf(status) > -1) {
            element.rebootBtnShow = true;
            element.rebootBtnDisabled = false;
          }
          // 根据电源状态控制处理 强制重启按钮 forcereboot
          if (actbtnPms.forcerebootstatusShowList.indexOf(status) > -1) {
            element.forcerebootBtnShow = true;
            element.forcerebootBtnDisabled = false;
          }
          // 根据电源状态控制处理 快照按钮 snapshot
          if (actbtnPms.snapshotstatusShowList.indexOf(status) > -1) {
            element.snapshotBtnShow = true;
            element.snapshotBtnDisabled = false;
          }
          // 根据电源状态控制处理 变更规格按钮 edit
          if (actbtnPms.editstatusShowList.indexOf(status) > -1) {
            element.editBtnShow = true;
            element.editBtnDisabled = false;
          }
          // 根据电源状态控制处理 申请延期按钮 applyDeferred
          if (actbtnPms.applyDeferredstatusShowList.indexOf(status) > -1) {
            element.applyDeferredBtnShow = true;
            element.applyDeferredBtnDisabled = false;
          }
          // 根据电源状态控制处理 删除按钮 delete
          if (actbtnPms.deletestatusShowList.indexOf(status) > -1) {
            element.deleteBtnShow = true;
            element.deleteBtnDisabled = false;
          }

          // 根据电源状态控制处理 制作镜像按钮 makeImage
          if (actbtnPms.makeImagestatusShowList.indexOf(status) > -1) {
            element.makeImageBtnShow = true;
            element.makeImageBtnDisabled = false;
          }
        } else {
          // 根据任务状态控制
          // 根据任务状态控制处理 开机按钮start startBtn
          if (actbtnPms.starttaskStatusShowList.indexOf(taskStatus) > -1) {
            element.startBtnShow = true;
            element.startBtnDisabled = false;
          }
          // 根据任务状态控制处理 关机按钮 shutdown
          if (actbtnPms.shutdowntaskStatusShowList.indexOf(taskStatus) > -1) {
            element.shutdownBtnShow = true;
            element.shutdownBtnDisabled = false;
          }
          // 根据任务状态控制处理 控制台按钮vnc vncBtn
          if (actbtnPms.vnctaskStatusShowList.indexOf(taskStatus) > -1) {
            element.vncBtnShow = true;
            element.vncBtnDisabled = false;
          }
          // 根据任务状态控制处理 强制关机按钮abort abortBtn
          if (actbtnPms.aborttaskStatusShowList.indexOf(taskStatus) > -1) {
            element.abortBtnShow = true;
            element.abortBtnDisabled = false;
          }
          // 根据任务状态控制处理 重启按钮 reboot
          if (actbtnPms.reboottaskStatusShowList.indexOf(taskStatus) > -1) {
            element.rebootBtnShow = true;
            element.rebootBtnDisabled = false;
          }
          // 根据任务状态控制处理 强制重启按钮 forcereboot
          if (
            actbtnPms.forcereboottaskStatusShowList.indexOf(taskStatus) > -1
          ) {
            element.forcerebootBtnShow = true;
            element.forcerebootBtnDisabled = false;
          }
          // 根据任务状态控制处理 快照按钮 snapshot
          if (actbtnPms.snapshottaskStatusShowList.indexOf(taskStatus) > -1) {
            element.snapshotBtnShow = true;
            element.snapshotBtnDisabled = false;
          }
          // 根据任务状态控制处理 变更规格按钮 edit
          if (actbtnPms.edittaskStatusShowList.indexOf(taskStatus) > -1) {
            element.editBtnShow = true;
            element.editBtnDisabled = false;
          }

          // 根据任务状态控制处理 申请延期按钮 applyDeferred
          if (
            actbtnPms.applyDeferredtaskStatusShowList.indexOf(taskStatus) > -1
          ) {
            element.applyDeferredBtnShow = true;
            element.applyDeferredBtnDisabled = false;
          }
          // 根据任务状态控制处理 删除按钮 delete
          if (actbtnPms.deletetaskStatusShowList.indexOf(taskStatus) > -1) {
            element.deleteBtnShow = true;
            element.deleteBtnDisabled = false;
          }
          // 根据任务状态控制处理 制作镜像按钮 makeImage
          if (actbtnPms.deletetaskStatusShowList.indexOf(taskStatus) > -1) {
            element.makeImageBtnShow = true;
            element.makeImageBtnDisabled = false;
          }
        }
      });
      return list;
    },
    getTableColumn(table) {
      const newTableHeader = table || this.columnArr;
      let checkedDisabled = ["systemImg", "aliasName", "status", "taskStatus"];
      newTableHeader.forEach((element) => {
        const { prop } = element;
        element.checkedDisabled = true;
        if (checkedDisabled.indexOf(prop) == -1) {
          element.checkedDisabled = false;
        }
      });
      this.$set(this, "columnShowArr", newTableHeader);
      this.$nextTick(() => {
        this.$refs.escTable && this.$refs.escTable.doLayout();
      });
    },
    // 申请延期
    handleShowDely(row) {
      this.showDelayDrawer = true;
      this.selectRowData = row;
    },
    // 变更规格
    handleShowChangeServices(row) {
      this.showChangeSevicesDrawer = true;
      this.selectRowData = row;
    },
    // 刷新表格
    refreshTable() {
      this.renderTable();
    },
    changeSearchKey(val) {
      this.searchKey = val;
    },
    changeVmStatus(val) {
      this.searchStatus = val;
    },
    filterChange(filters) {
      // 状态过滤
      this.searchStatus = filters.ecsStatus[0];
      this.renderTable();
      const lable = this.statusFilter.find(
        (item) => item.value === this.searchStatus
      );
      if (lable) {
        this.statusLable = "(" + lable.text + ")";
      } else {
        this.statusLable = "";
      }
    },
    // 表格勾选
    handlerSelectionChange(selection) {
      this.selectTable = selection;
    },
    rowSelect(row) {
      const rowUuid = row.serverVmUuid;
      const existUuid = this.selectTable.find(
        (item) => item.serverVmUuid === rowUuid
      );
      if (!existUuid) {
        this.$refs.escTable.$refs.elTable.toggleRowSelection(row);
      } else {
        this.$refs.escTable.$refs.elTable.toggleRowSelection(row, false);
      }
    },
    // 自定义进度条颜色
    customColorMethod(percentage) {
      if (percentage <= 80) {
        return "#0000FF";
      } else if (percentage > 80 < 90) {
        return "#FFA500";
      } else {
        return "#FF0000";
      }
    },
    setItemProgress(value, type) {
      if (type === 1) {
        return parseInt(JSON.parse(value).cpu);
      } else if (type === 2) {
        return parseInt(JSON.parse(value).mem);
      } else {
        return parseInt(JSON.parse(value).disk);
      }
    },
    openVnc(row) {
      const { serverVmUuid, clusterId } = row;
      getVncUrl({ serverVmUuid, clusterId }).then((res) => {
        const vncUrl = res.vncUrl;
        if (vncUrl) {
          window.open(vncUrl, "_blank");
        }
      });
    },
    startServerVm(row) {
      const { serverVmUuid, clusterId } = row;
      row.startBtnDisabled = true;
      startServerVm({ serverVmUuid, clusterId })
        .then((res) => {
          ReMessage.success("开机成功");
          this.refreshTable();
        })
        .catch(() => {
          this.selectTable = [];
          ReMessage.warning("开机失败");
          this.refreshTable();
        });
    },

    downToggle(val) {
      let { key, row } = val;
      switch (key) {
        case "makeImage": // 制作镜像
          this.setmakeImage(row);
          break;

        default:
          break;
      }
    },
    setmakeImage(row) {
      this.makeImageModalOption.title = "制作镜像";
      this.makeImageModalOption.formData = row; // 表单数据
      this.showmakeImageModalModal = true;
    },
  },
  beforeDestroy() {
    this.showmakeImageModalModal = false;
  },
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";
.ecs {
  .status-row {
    .success {
      color: $msgSuccess;
    }
    .error {
      color: $msgDanger;
    }
    .offline {
      color: "#090909";
    }
    .warn {
      color: $msgWarning;
    }
    .notice {
      color: $msgNotice;
    }
    [class*="el-icon-"] {
      margin-left: 0px;
    }
  }
  .taskStatus-row {
    .leisure {
      color: $msgSuccess;
    }
    .error {
      color: $msgDanger;
    }
    .running {
      color: $msgSuccess;
    }
    [class*="el-icon-"] {
      margin-left: 0px;
    }
  }
  .progress-row {
    .progress-item {
      display: flex;
      align-items: center;
      .el-progress {
        width: 70%;
        margin: 0 5px;
      }
    }
  }
  .el-drawer__wrapper {
    @include DrawerRtl;
  }
  .el-table .cell .el-tooltip {
    overflow: hidden;
    white-space: nowrap;
    overflow-y: auto;
  }
}
</style>
