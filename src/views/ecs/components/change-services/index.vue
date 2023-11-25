<template>
  <div class="drawer-content">
    <div class="service-modify">
      <div class="template-box">
        <el-form
          ref="modifyForm"
          label-width="100px"
          :model="modifyServerVmFormData"
          :rules="rulesTemplate"
        >
          <el-form-item label="系统">
            <span>{{ osMachine }}</span>
          </el-form-item>
          <el-form-item label="架构">
            <span>{{ architecture }}</span>
          </el-form-item>
          <el-form-item label="类型">
            <span>{{ systemType }}</span>
          </el-form-item>
          <el-form-item label="名称" prop="aliasName">
            <el-input
              v-model="modifyServerVmFormData.aliasName"
              placeholder=""
              type="text"
            />
          </el-form-item>

          <el-form-item label="CPU" prop="cpu">
            <el-input v-model="modifyServerVmFormData.cpu" v-only-num />
            <el-tooltip
              class="item"
              effect="light"
              content="在线云服务器，变更cpu大小，需重启云服务器大小才能生效"
              placement="top"
            >
              <i v-if="architecture == 'aarch64'" class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="内存" prop="mem">
            <el-input
              v-model="modifyServerVmFormData.mem"
              v-only-num
              size="small"
            >
              <template slot="append">GB</template>
            </el-input>
            <el-tooltip
              class="item"
              effect="light"
              content="在线云服务器，变更内存大小，需重启云服务器大小才能生效"
              placement="top"
            >
              <i v-if="architecture == 'aarch64'" class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>

          <!-- 磁盘 -->
          <div class="disk-group-wrap">
            <div v-for="(item, index) in disks" :key="'disk' + index">
              <el-form-item
                :label="'磁盘' + (disks.length > 1 ? index + 1 : '')"
                prop="disk"
              >
                <el-input
                  v-model="item.diskSize"
                  v-only-num
                  v-if="item.type === 'custom'"
                  class="customDiskInput"
                >
                  <template slot="append">GB</template>
                </el-input>
                <el-input
                  v-else
                  v-model="item.diskSize"
                  v-only-num
                  class="defaultDiskInput"
                >
                  <template slot="append">GB</template>
                </el-input>

                <el-input
                  v-if="item.type === 'custom'"
                  v-model="item.purpose"
                  class="customDiskInput"
                  placeholder="描述磁盘用途"
                />
                <i
                  v-show="index === disks.length - 1"
                  class="el-icon-circle-plus-outline"
                  @click="addDiskItem"
                />
                <i
                  v-show="index !== 0"
                  class="el-icon-remove-outline"
                  @click="deleteDiskItem(index)"
                />
                <span v-show="item.errorFlag" style="color: #f00">{{
                  item.errorMsg
                }}</span>
              </el-form-item>
            </div>
            <div v-if="disks.length === 0" class="disk-group-wrap">
              <el-form-item label="磁盘">
                <span>该云服务器目前还没有磁盘，请按需添加</span>
                <i class="el-icon-circle-plus-outline" @click="addDiskItem" />
              </el-form-item>
            </div>
          </div>

          <!-- 网卡 -->
          <div class="network-group-wrap">
            <div v-for="(item, index) in networks" :key="'network' + index">
              <el-form-item
                :label="'网卡' + (networks.length > 1 ? index + 1 : '')"
                prop="network"
              >
                <el-input
                  v-if="item.type === 'custom'"
                  v-model="item.purpose"
                  placeholder="描述新增网卡用途"
                />
                <el-input v-else v-model="item.purpose" disabled />

                <i
                  v-if="index === networks.length - 1"
                  class="el-icon-circle-plus-outline"
                  @click="addNetworkItem"
                />
                <i
                  class="el-icon-remove-outline"
                  @click="deleteNetworkItem(index)"
                />
                <span v-show="item.errorFlag" style="color: #f00">{{
                  item.errorMsg
                }}</span>
              </el-form-item>
            </div>
            <div v-if="networks.length === 0" class="network-group-wrap">
              <el-form-item label="网卡">
                <span>模板没有网卡，请按需添加网卡</span>
                <i
                  class="el-icon-circle-plus-outline"
                  style="margin-left: 183px"
                  @click="addNetworkItem"
                />
              </el-form-item>
            </div>
          </div>

          <el-form-item label="到期时间" prop="deadline_time">
            <el-input
              v-model="modifyServerVmFormData.deadline_time"
              type="text"
              disabled
            />

            <template>
              <el-checkbox
                style="margin-left: 10px; margin-top: 0px"
                v-model="modifyServerVmFormData.addDeadTimeChecked"
              >
                添加时间
              </el-checkbox>
            </template>

            <el-input
              v-show="modifyServerVmFormData.addDeadTimeChecked"
              class="addTimeInput"
              v-model="modifyServerVmFormData.addNewDeadTime"
              v-only-num
            />
            <el-radio-group
              style="margin-left: 5px"
              v-show="modifyServerVmFormData.addDeadTimeChecked"
              v-model="modifyServerVmFormData.addNewDeadTimeUnit"
              size="small"
            >
              <el-radio-button
                v-for="item in addNewTimeUnitList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-radio-group>
            <span
              v-show="modifyServerVmFormData.addNewDeadTimeErrorFlag"
              style="color: #f00"
              >{{ modifyServerVmFormData.addNewDeadTimeError }}</span
            >
          </el-form-item>
          <el-form-item label="到期处理" prop="deadline_type">
            <el-radio-group
              v-model="modifyServerVmFormData.deadline_type"
              size="small"
            >
              <el-radio-button
                v-for="item in deadlineTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="变更理由" prop="modify_reason">
            <el-input
              v-model="modifyServerVmFormData.modify_reason"
              type="textarea"
              :rows="3"
              placeholder=""
              maxlength="50"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <foot-btn
      class="drawer-foot"
      @confirm="handlerConfirm"
      @cancel="handlerCancel"
    />
  </div>
</template>

<script>
import footBtn from "@/components/Footbtn";
import validate from "@/utils/validate";
import equalsObj from "@/utils/equalsObj";
import { getModifyServerVmDetail, modifyServerVm } from "@/api/serverVm";
import ReMessage from "@/utils/message";
export default {
  components: {
    footBtn,
  },
  props: ["modifyDeferredData"],
  data() {
    const validCpuAndMemNum = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error(rule.message));
      } else if (Number(value) < 1) {
        callback(new Error(rule.message));
      } else {
        callback();
      }
    };
    return {
      dataOption: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      deadlineTypeList: [
        // 到期处理
        { value: "ALARM", label: "告警" },
        { value: "POWER_OFF", label: "关机" },
        { value: "DESTROY", label: "销毁" },
      ],
      // 云服务器模板表单数据
      modifyServerVmFormData: {
        aliasName: "",
        deadline_type: "告警",
        cpu: 0,
        mem: 0,
        memUnit: "GB",
        deadline_time: "",
        modify_reason: "",
        addDeadTimeChecked: false,
        addNewDeadTime: 1,
        addNewDeadTimeUnit: "月",
        addNewDeadTimeError: "",
        addNewDeadTimeErrorFlag: false,
      },
      addNewTimeUnitList: [
        // 到期处理
        { value: "MONTH", label: "月" },
        { value: "YEAR", label: "年" },
      ],
      osMachine: "", //操作系统
      architecture: "", //系统架构
      systemType: "",
      disks: [], //磁盘信息
      networks: [], //网卡信息
      oldDiskList: [], //变更前磁盘信息
      oldNetworkList: [], //变更前网卡信息
      rulesTemplate: {
        aliasName: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          {
            min: 6,
            max: 32,
            message: "名称长度应控制在 6 ~ 32 个字符",
            trigger: "blur",
          },
          {
            required: true,
            trigger: "blur",
            message: "名称不能出现特殊字符",
            validator: validate.special_char,
          },
        ],
        cpu: [
          { required: true, message: "cpu不能为空", trigger: "blur" },
          {
            message: "CPU核数不能小于1",
            trigger: "blur",
            validator: validCpuAndMemNum,
          },
        ],
        mem: [
          { required: true, message: "内存不能为空", trigger: "blur" },
          {
            message: "内存大小不能小于1GB",
            trigger: "blur",
            validator: validCpuAndMemNum,
          },
        ],
        deline_type: [
          { required: true, message: "到期处理不能为空", trigger: "blur" },
        ],
        modify_reason: [
          { required: true, message: "变更原因不能为空", trigger: "blur" },
        ],
      },
      originPageData: {},
      onlyModifyName: false,
    };
  },
  created() {},
  mounted() {
    this.serverVmDetail();
  },
  methods: {
    serverVmDetail() {
      const { serverVmUuid, clusterId } = this.modifyDeferredData;
      getModifyServerVmDetail({ serverVmUuid, clusterId }).then((res) => {
        this.originPageData = JSON.parse(JSON.stringify(res));
        this.osMachine = res.osMachine;
        this.architecture = res.architecture;
        this.systemType = res.systemType;
        this.modifyServerVmFormData.aliasName = res.aliasName;
        this.modifyServerVmFormData.cpu = res.cpu;
        this.modifyServerVmFormData.mem = res.mem;
        this.modifyServerVmFormData.deadline_time = res.deadlineTime;
        this.modifyServerVmFormData.deadline_type = this.deadlineTypeList.find(
          (item) => item.value === res.deadlineType
        ).label;
        //磁盘
        let diskList = res.disks;
        let diskArray = new Array();
        for (let i = 0; i < diskList.length; i++) {
          var disk = new Object();
          disk.diskSize = diskList[i].diskSize;
          disk.type = "original";
          disk.diskId = diskList[i].diskId;
          (disk.purpose = diskList[i].purpose),
            this.oldDiskList.push({
              diskSize: diskList[i].diskSize,
              type: "original",
              diskId: diskList[i].diskId,
              purpose: diskList[i].purpose,
            });
          disk.errorFlag = false;
          diskArray.push(disk);
        }
        this.disks = diskArray;
        //网卡
        let networkList = res.networks;
        let networkArray = new Array();
        for (let i = 0; i < networkList.length; i++) {
          var network = new Object();
          network.purpose = networkList[i].purpose;
          network.interfaceId = networkList[i].interfaceId;
          network.type = "original";
          this.oldNetworkList.push({
            purpose: networkList[i].purpose,
            interfaceId: networkList[i].interfaceId,
            type: "original",
          });
          network.errorFlag = false;
          networkArray.push(network);
        }
        this.networks = networkArray;
      });
    },
    addDiskItem() {
      if (this.disks.length >= 4) {
        this.alertTips("磁盘数目已达上限");
        return false;
      }
      this.disks.push({
        diskSize: 300,
        diskId: 0,
        type: "custom",
        errorFlag: false,
        purpose: "",
      });
    },
    deleteDiskItem(index) {
      this.disks.splice(index, 1);
    },
    addNetworkItem() {
      if (this.networks.length >= 4) {
        this.alertTips("网卡数目已达上限");
        return false;
      }
      this.networks.push({
        purpose: "",
        interfaceId: 0,
        errorFlag: false,
        errorMsg: "",
        type: "custom",
      });
    },
    deleteNetworkItem(index) {
      this.networks.splice(index, 1);
    },
    changeDiskSize(oldDiskSize) {
      console.log(oldDiskSize);
    },
    // 提交申请
    handlerConfirm() {
      const that = this;
      this.$refs.modifyForm.validate((valid) => {
        if (valid) {
          this.alertConfirm("确定变更云服务器？")
            .then((_) => {
              that.onSubmitApplyForm();
            })
            .catch((_) => {});
        } else {
          return false;
        }
      });
    },
    onSubmitApplyForm() {
      let servervmName = this.modifyServerVmFormData.aliasName;
      let osMachine = this.osMachine;
      let architecture = this.architecture;
      let systemType = this.systemType;
      let machineUuid = this.modifyDeferredData.serverVmUuid;

      let addDeadTimeChecked = this.modifyServerVmFormData.addDeadTimeChecked;
      let addNewDeadTime = this.modifyServerVmFormData.addNewDeadTime;
      this.modifyServerVmFormData.addNewDeadTimeError = "";
      this.modifyServerVmFormData.addNewDeadTimeErrorFlag = false;

      if (addDeadTimeChecked) {
        if (!addNewDeadTime) {
          this.modifyServerVmFormData.addNewDeadTimeError =
            "新增过期时间不能为空";
          this.modifyServerVmFormData.addNewDeadTimeErrorFlag = true;
          return;
        }
        if (addNewDeadTime < 1) {
          this.modifyServerVmFormData.addNewDeadTimeError =
            "新增过期时间不能小于1";
          this.modifyServerVmFormData.addNewDeadTimeErrorFlag = true;
          return;
        }
      }
      let addNewDeadTimeUnit = this.addNewTimeUnitList.find(
        (item) => item.label === this.modifyServerVmFormData.addNewDeadTimeUnit
      ).value;

      let deadlineType = this.deadlineTypeList.find(
        (item) => item.label === this.modifyServerVmFormData.deadline_type
      ).value;
      let applyReason = this.modifyServerVmFormData.modify_reason;

      let cpu = this.modifyServerVmFormData.cpu;
      let originalCpu = this.originPageData.cpu;
      if (cpu < originalCpu && this.originPageData.status !== "OFFLINE") {
        ReMessage.error("在线云服务器不能减小cpu");
        return;
      }
      let mem = this.modifyServerVmFormData.mem;
      let originalMem = this.originPageData.mem;
      if (mem < originalMem && this.originPageData.status !== "OFFLINE") {
        ReMessage.error("在线云服务器不能减小内存");
        return;
      }
      let memUnit = "GB";
      //磁盘处理
      let disks = this.disks;
      let diskList = new Array();
      for (let i = 0; i < disks.length; i++) {
        var disk = new Object();
        disk.diskSize = disks[i].diskSize;
        disk.type = disks[i].type;
        disk.purpose = disks[i].purpose;
        disk.diskId = disks[i].diskId;
        this.disks[i].errorFlag = false;
        this.disks[i].errorMsg = "";
        if (!disks[i].diskSize || disks[i].diskSize < 1) {
          this.disks[i].errorMsg = "磁盘大小不能为空";
          this.disks[i].errorFlag = true;
          return false;
        }
        if (disks[i].type === "original") {
          let originDisk = this.originPageData.disks.find(
            (item) => item.diskId === disk.diskId
          );
          if (parseInt(originDisk.diskSize) > parseInt(disk.diskSize)) {
            this.disks[i].errorMsg = "原有磁盘只能变大，不能变小";
            this.disks[i].errorFlag = true;
            return false;
          }
        }
        if (disks[i].type === "custom") {
          if (!disks[i].purpose) {
            this.disks[i].errorMsg = "磁盘用途不能为空";
            this.disks[i].errorFlag = true;
            return false;
          }
        }
        diskList.push(disk);
      }

      //网卡处理
      let networks = this.networks;
      let networkList = new Array();
      for (let i = 0; i < networks.length; i++) {
        var network = new Object();
        network.type = networks[i].type;
        network.purpose = networks[i].purpose;
        network.interfaceId = networks[i].interfaceId;
        this.networks[i].errorFlag = false;
        this.networks[i].errorMsg = "";
        if (networks[i].type === "custom") {
          if (!networks[i].purpose) {
            this.networks[i].errorMsg = "网卡用途不能为空";
            this.networks[i].errorFlag = true;
            return false;
          }
        }
        networkList.push(network);
      }
      let oldDiskList = this.oldDiskList;
      let oldNetworkList = this.oldNetworkList;
      const { clusterId } = this.modifyDeferredData;
      let modifyPageData = {
        servervmName,
        osMachine,
        architecture,
        systemType,
        machineUuid,
        addDeadTimeChecked,
        addNewDeadTime,
        addNewDeadTimeUnit,
        deadlineType,
        applyReason,
        cpu,
        originalCpu,
        mem,
        originalMem,
        memUnit,
        diskList,
        oldDiskList,
        networkList,
        oldNetworkList,
        clusterId,
        onlyModifyName: false,
      };
      let onlyModifyNameTag = this.modifyValidate(
        this.originPageData,
        modifyPageData
      );

      modifyPageData.onlyModifyName = onlyModifyNameTag;
      //申请云服务器
      let msg = "";
      if (onlyModifyNameTag) {
        msg = "名称已修改成功";
      } else {
        msg = "变更申请已提交，请等管理员审核";
      }
      modifyServerVm(modifyPageData).then((res) => {
        ReMessage.success(msg);
        this.$parent.closeDrawer();
      });
    },
    modifyValidate(originPageData, modifyPageData) {
      let flag = false;
      // 是否变更名称
      let modifyName =
        originPageData.aliasName == modifyPageData.servervmName ? false : true;

      // 是否变更cpu
      let modifycpu = originPageData.cpu == modifyPageData.cpu ? false : true;
      // 是否变更磁盘信息
      let modifyDisk = !equalsObj.equalsArrObj(
        modifyPageData.oldDiskList,
        modifyPageData.diskList
      );

      // 是否变更网卡信息
      let modifynetwork = !equalsObj.equalsArrObj(
        modifyPageData.oldNetworkList,
        modifyPageData.networkList
      );

      // 是否变更内存
      let modifymemem = originPageData.mem == modifyPageData.mem ? false : true;

      // 是否变更过期时间
      let modifyDeadTime = modifyPageData.addDeadTimeChecked;

      // 是否变更到期处理
      let modifydeadlineType =
        originPageData.deadlineType == modifyPageData.deadlineType
          ? false
          : true;
      flag =
        modifyName &&
        !modifycpu &&
        !modifyDisk &&
        !modifynetwork &&
        !modifymemem &&
        !modifyDeadTime &&
        !modifydeadlineType;
      return flag;
    },
    // 取消申请
    handlerCancel() {
      this.$refs.modifyForm.resetFields();
      this.$parent.closeDrawer();
    },
  },
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";

.service-modify {
  @include formStyle;
  flex: 1;
  max-height: 82vh;
  overflow: auto;
  $input-width: 375px;
  .template-box {
    margin-bottom: 60px;
  }
  .el-input {
    width: $input-width;
  }
  .el-input-number {
    width: $input-width;
  }
  .use_month {
    .el-radio-button__inner {
      width: 75px;
    }
  }
  .self-input-group {
    width: $input-width;
    margin-top: 18px;

    .el-input {
      width: calc(100% - 60px);
    }
  }
  .el-textarea {
    width: 380px;
    max-height: 100px;
  }

  .disk-group-wrap {
    .switch-port-wrap {
      display: inline-block;
      color: $fontColor;
      width: 500px;
    }
    .customDiskInput {
      width: 188px;
    }
  }
  .network-group-wrap {
    .switch-port-wrap {
      display: inline-block;
      color: $fontColor;
    }
  }
  .appendGB {
    background-color: #f5f7fa;
    color: #909399;
    vertical-align: middle;
    display: table-cell;
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 0 20px;
    width: 1px;
    white-space: nowrap;
  }
  .addTimeInput {
    margin-left: 5px;
    width: 80px;
  }
}
</style>
