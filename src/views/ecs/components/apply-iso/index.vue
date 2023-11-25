<template>
  <div class="drawer-content">
    <div class="iso-apply">
      <div class="template-box">
        <el-form
          ref="formTemplate"
          label-width="100px"
          :model="formTemplate"
          :rules="rulesTemplate"
        >
          <!-- ISO镜像 -->
          <el-form-item
            class="selectTemplateBtn input-with-select"
            label="ISO镜像"
            prop="templateName"
          >
            <el-input
              v-model="formTemplate.templateName"
              disabled
              placeholder="选择或搜索ISO镜像"
            >
              <template #append>
                <el-button @click="openSelectModal('isotemplate')">
                  选择
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <!-- 名称 -->
          <el-form-item label="名称" prop="name">
            <el-input v-model="formTemplate.name" placeholder="" type="text" />
          </el-form-item>
          <!-- 架构 -->
          <el-form-item label="架构" prop="architecture">
            <el-select
              v-model="formTemplate.architecture"
              placeholder="请选择架构"
              @change="getAllSystem"
            >
              <el-option
                v-for="item in architectureoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 系统 -->
          <el-form-item label="系统" prop="osMachine">
            <el-select
              v-model="formTemplate.osMachine"
              placeholder="请选择系统"
              filterable
            >
              <el-option-group
                v-for="group in machineoptions"
                :key="group[0].osType"
                :label="group[0].osTypeAlias"
              >
                <el-option
                  v-for="item in group"
                  :key="item.systemName"
                  :label="item.systemName"
                  :value="item.systemName"
                >
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <!-- 选择模板 -->
          <select-template
            ref="selectTemplate"
            :template_disk="template_disk"
            :template_networks="template_networks"
          />

          <el-form-item label="使用时间" prop="use_month" class="use_month">
            <div>
              <el-radio-group
                v-model="formTemplate.use_month"
                @change="changeUseMonth"
              >
                <el-radio-button
                  v-for="item in useMonthList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-radio-group>

              <el-form-item
                class="self-input-group"
                prop="use_month_custom"
                v-if="!customUseMonth"
              >
                <el-input v-model="formTemplate.use_month_custom" v-only-num>
                  <template slot="append">月</template>
                </el-input>
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item label="到期处理" prop="deadline_type">
            <el-radio-group v-model="formTemplate.deadline_type" size="small">
              <el-radio-button
                v-for="item in deadlineTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="申请理由" prop="apply_reason">
            <el-input
              v-model="formTemplate.apply_reason"
              type="textarea"
              :rows="3"
              placeholder=""
              maxlength="50"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="formTemplate.description"
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
    <!-- bindTemplateModal -->
    <bindTemplateModal
      :visible.sync="showbindisotemplateModal"
      @confirm="templateConfirm"
      :defaultSelectedKeys="defaultSelectedKeys"
    >
    </bindTemplateModal>
  </div>
</template>

<script>
import footBtn from "@/components/Footbtn";
import selectTemplate from "./select-template.vue";
import validate from "@/utils/validate";
import { applyServerVm, getAllOperatingSystem } from "@/api/serverVm";
import ReMessage from "@/utils/message";
import bindTemplateModal from "../bindIsoTempModal/bindTemplateModal.vue";
export default {
  components: {
    footBtn,
    selectTemplate,
    bindTemplateModal,
  },

  data() {
    const validApplyNum = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error(rule.message));
      } else if (Number(value) < 1 || Number(value) > 4) {
        callback(new Error(rule.message));
      } else {
        callback();
      }
    };
    const validUseMonthNum = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error(rule.message));
      } else if (Number(value) < 1 || Number(value) > 100) {
        callback(new Error(rule.message));
      } else {
        callback();
      }
    };
    return {
      architectureoptions: [
        // 架构
        { value: "X86_64", label: "X86_64" },
        { value: "aarch64", label: "ARM64" },
        { value: "mips", label: "MIPS" },
        { value: "sw_64", label: "SW64" },
      ],
      machineoptions: [],
      useMonthList: [
        // 使用时间
        { value: "1", label: "1个月" },
        { value: "3", label: "3个月" },
        { value: "6", label: "半年" },
        { value: "12", label: "1年" },
        { value: "36", label: "3年" },
        { value: "0", label: "自定义" },
      ],
      deadlineTypeList: [
        // 到期处理
        { value: "ALARM", label: "告警" },
        { value: "POWER_OFF", label: "关机" },
        { value: "DESTROY", label: "销毁" },
      ],
      // 云服务器模板表单数据
      formTemplate: {
        template: "",
        templateName: "",
        architecture: "X86_64",
        osMachine: "",
        name: "",
        apply_num: 1,
        use_month: "1个月", // 5选一
        use_month_custom: 0, // 自定义时间 / 延期时间
        deadline_type: "告警",
        apply_reason: "",
        description: "",
      },
      customUseMonth: true,
      template_disk: [], //模板自带磁盘信息
      template_networks: [], //模板自带网卡信息
      editInfo: {}, // 编辑时获原先的内容
      rulesTemplate: {
        templateName: [
          { required: true, message: "请选择ISO镜像", trigger: "blur" },
        ],
        name: [
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
        osMachine: [{ required: true, message: "请选择系统", trigger: "blur" }],
        architecture: [
          { required: true, message: "请选择架构", trigger: "blur" },
        ],
        apply_num: [
          { required: true, message: "申请个数不能为空", trigger: "blur" },
          {
            message: "申请个数应控制在 1 ~ 4 范围",
            trigger: "blur",
            validator: validApplyNum,
          },
          {
            message: "申请个数必须是正整数",
            trigger: "blur",
            validator: validate.validateInt,
          },
        ],
        use_month_custom: [
          { required: true, message: "申请个数不能为空", trigger: "blur" },
          {
            message: "自定义使用时间必须是正整数",
            trigger: "blur",
            validator: validate.validateInt,
          },
          {
            message: "申请个数应控制在 1 ~ 100 范围",
            trigger: "blur",
            validator: validUseMonthNum,
          },
        ],
        use_month: [
          { required: true, message: "申请时间不能为空", trigger: "blur" },
        ],
        deadline_type: [
          { required: true, message: "到期处理不能为空", trigger: "blur" },
        ],
        apply_reason: [
          {
            required: true,
            trigger: "blur",
            message: "申请理由不能为空",
          },
        ],
      },
      addTime: "",
      showbindisotemplateModal: false,
      allSystem: {},
      defaultSelectedKeys: [],
    };
  },
  created() {
    this.getAllSystem();
    this.$nextTick(() => {
      this.template_disk = [
        {
          diskSize: 100,
          type: "custom",
          diskId: 0,
          purpose: "",
          errorFlag: false,
          errorMsg: "",
        },
      ]; //模板自带磁盘信息
      this.template_networks = [
        {
          purpose: "",
          interfaceId: 0,
          type: "custom",
          errorFlag: false,
          errorMsg: "",
        },
      ];
    });
  },
  mounted() {},
  methods: {
    getAllSystem() {
      this.formTemplate.osMachine = "";
      let params = {
        plateformtype: this.formTemplate.architecture,
      };
      getAllOperatingSystem(params)
        .then((res) => {
          this.allSystem = {};
          res.forEach((element) => {
            let { osType, systemName } = element;
            this.allSystem[systemName] = osType;
          });
          this.getSystenLIstGroup(res);
        })
        .catch((err) => {});
    },
    getSystenLIstGroup(list) {
      function groupBy(array, f) {
        // debugger;
        const groups = {};
        array.forEach(function (o) {
          //注意这里必须是forEach 大写
          const group = JSON.stringify(f(o));
          groups[group] = groups[group] || [];
          groups[group].push(o);
        });
        return Object.keys(groups).map(function (group) {
          return groups[group];
        });
      }
      let sorted = groupBy(list, function (item) {
        return [item.osType]; //按照name进行分组
      });

      //需要将信安系统提升至首位
      let index = sorted.findIndex((n) => n[0]["systemName"] === "KylinsecOS");
      const ownSysArr = sorted.splice(index, 1);
      sorted.unshift(ownSysArr[0]);
      this.machineoptions = sorted;
    },
    openSelectModal(key) {
      switch (key) {
        case "isotemplate":
          this.showbindisotemplateModal = true;
          break;

        default:
          this.showbindisotemplateModal = false;
          break;
      }
    },
    templateConfirm(rows) {
      let template = rows[0];
      this.formTemplate.imageId = template.isoImageId;
      this.formTemplate.templateName = template.isoLabel;
      this.formTemplate.template = 0;
      this.formTemplate.clusterId = template.clusterId;
      this.template_networks = [
        {
          purpose: "",
          interfaceId: 0,
          type: "custom",
          errorFlag: false,
          errorMsg: "",
        },
      ];
      this.template_disk = [
        {
          diskSize: 100,
          type: "custom",
          diskId: 0,
          purpose: "",
          errorFlag: false,
          errorMsg: "",
        },
      ];
      this.defaultSelectedKeys = rows;
    },

    // 提交申请
    handlerConfirm() {
      const that = this;
      //旧版封装问题较多，数据无法走model形式进行绑定数据，无法在短期内进行网卡的校验，前端仿造一个报错样式
      this.checkNetWorks();
      this.$refs.formTemplate.validate((valid) => {
        if (valid) {
          this.alertConfirm("确定申请云服务器？")
            .then((_) => {
              that.onSubmitApplyForm();
            })
            .catch((_) => {});
        } else {
          return false;
        }
      });
    },
    checkNetWorks() {
      let networks = this.$refs.selectTemplate.customNetworks;
      let networkList = new Array();
      let errEmptyBol = false;
      for (let i = 0; i < networks.length; i++) {
        var network = new Object();
        network.type = networks[i].type;
        network.purpose = networks[i].purpose;
        network.interfaceId = networks[i].interfaceId;
        this.$refs.selectTemplate.customNetworks[i].errorFlag = false;
        this.$refs.selectTemplate.customNetworks[i].errorMsg = "";
        if (networks[i].type === "custom") {
          if (!networks[i].purpose) {
            this.$refs.selectTemplate.customNetworks[i].errorFlag = true;
            this.$refs.selectTemplate.customNetworks[i].errorMsg =
              "网卡用途不能为空";
            this.errEmptyBol = true;
          }
        }
        networkList.push(network);
      }
      if (errEmptyBol) return;
    },
    onSubmitApplyForm() {
      let templateId = this.formTemplate.template;
      let imageId = this.formTemplate.imageId;
      let servervmName = this.formTemplate.name;
      let applyNum = this.formTemplate.apply_num;

      let useMonthLabel = this.formTemplate.use_month;
      let useMonth = this.useMonthList.find(
        (item) => item.label === useMonthLabel
      ).value;
      if (useMonth === "0") {
        let useMonthCustom = this.formTemplate.use_month_custom;
        if (!useMonthCustom || useMonthCustom === "0") {
          ReMessage.error("使用期限不能为空");
          return false;
        }
        useMonth = useMonthCustom;
      }

      let deadlineTypeLabel = this.formTemplate.deadline_type;
      let deadlineType = this.deadlineTypeList.find(
        (item) => item.label === deadlineTypeLabel
      ).value;
      let applyReason = this.formTemplate.apply_reason;
      let osMachine = this.formTemplate.osMachine; // 操作系统
      let architecture = this.formTemplate.architecture; // 架构
      let systemType = this.allSystem[osMachine]; // 系统类型
      //cpu和内存处理
      let cpu = "";
      let mem = "";
      let cpuAndMem = this.$refs.selectTemplate.cpu_mem;
      if (cpuAndMem) {
        cpu = this.$refs.selectTemplate.cpuMemList.find(
          (item) => item.label === cpuAndMem
        ).cpuValue;
        mem = this.$refs.selectTemplate.cpuMemList.find(
          (item) => item.label === cpuAndMem
        ).memValue;
      } else {
        cpu = this.$refs.selectTemplate.custom_cup;
        mem = this.$refs.selectTemplate.custom_mem;
      }
      if (!cpu) {
        ReMessage.error("cpu不能为空");
        return false;
      }
      if (cpu < 1) {
        ReMessage.error("cpu和数不能小于1");
        return false;
      }
      if (!mem) {
        ReMessage.error("内存不能为空");
        return false;
      }
      if (mem < 1) {
        ReMessage.error("内存大小不能小于1GB");
        return false;
      }

      //磁盘处理
      let disks = this.$refs.selectTemplate.customDisks;

      if (disks.length < 1) {
        ReMessage.error("至少添加一块磁盘");
        return false;
      }
      let diskList = new Array();
      for (let i = 0; i < disks.length; i++) {
        var disk = new Object();
        disk.diskSize = disks[i].diskSize;
        disk.type = disks[i].type;
        disk.purpose = disks[i].purpose;
        disk.diskId = disks[i].diskId;
        this.$refs.selectTemplate.customDisks[i].errorFlag = false;
        this.$refs.selectTemplate.customDisks[i].errorMsg = "";

        if (!disks[i].diskSize) {
          this.$refs.selectTemplate.customDisks[i].errorFlag = true;
          this.$refs.selectTemplate.customDisks[i].errorMsg =
            "磁盘大小不能为空";
          return false;
        }
        if (parseInt(disks[i].diskSize) <= 0) {
          this.$refs.selectTemplate.customDisks[i].errorFlag = true;
          this.$refs.selectTemplate.customDisks[i].errorMsg =
            "磁盘大小不能为小于1的正整数";
          return false;
        }
        if (disks[i].type === "custom") {
          if (!disks[i].purpose) {
            this.$refs.selectTemplate.customDisks[i].errorFlag = true;
            this.$refs.selectTemplate.customDisks[i].errorMsg =
              "磁盘用途不能为空";
            return false;
          }
        }
        diskList.push(disk);
      }
      let networks = this.$refs.selectTemplate.customNetworks;
      let networkList = new Array();
      let errEmptyBol = false;
      for (let i = 0; i < networks.length; i++) {
        var network = new Object();
        network.type = networks[i].type;
        network.purpose = networks[i].purpose;
        network.interfaceId = networks[i].interfaceId;
        this.$refs.selectTemplate.customNetworks[i].errorFlag = false;
        this.$refs.selectTemplate.customNetworks[i].errorMsg = "";
        if (networks[i].type === "custom") {
          if (!networks[i].purpose) {
            this.$refs.selectTemplate.customNetworks[i].errorFlag = true;
            this.$refs.selectTemplate.customNetworks[i].errorMsg =
              "网卡用途不能为空";
            this.errEmptyBol = true;
          }
        }
        networkList.push(network);
      }
      if (errEmptyBol) return;
      let description = this.formTemplate.description;

      // 处理光驱
      let isoList = [this.formTemplate.templateName];

      let applyServerVmType = "ISO";
      // 枚举: TEMPLATE,ISO
      // 枚举备注: TEMPLATE(基于模板创建) ISO(ISO创建)
      //申请云服务器
      let clusterId = this.formTemplate.clusterId;
      let params = {
        templateId,
        imageId,
        clusterId,
        osMachine,
        architecture,
        systemType,
        servervmName,
        applyNum,
        useMonth,
        deadlineType,
        cpu,
        mem,
        applyReason,
        diskList,
        networkList,
        description,
        isoList,
        applyServerVmType,
      };
      applyServerVm(params).then((res) => {
        ReMessage.success("申请云服务器成功");
        this.$emit("closeDrawer");
      });
    },

    // 取消申请
    handlerCancel() {
      this.$refs.formTemplate.resetFields();
      this.$refs.selectTemplate.handleCancel();
      this.formTemplate.use_month_custom = "";
      this.$emit("closeDrawer");
    },
    changeUseMonth() {
      this.formTemplate.use_month_custom = 0;
      let useMonthLabel = this.formTemplate.use_month;
      let useMonth = this.useMonthList.find(
        (item) => item.label === useMonthLabel
      ).value;
      if (useMonth === "0") {
        this.customUseMonth = false;
        this.formTemplate.use_month_custom = 6;
      } else {
        this.customUseMonth = true;
      }
    },
  },
};
</script>

<style lang="scss" scope>
@import "~@/styles/mixin.scss";

.iso-apply {
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
  .use_month {
    .el-radio-button__inner {
      width: 62px;
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
  .el-input.is-disabled .el-input__inner {
    border-color: none !important;
  }
  .selectTemplateBtn {
    .el-input-group--prepend .el-input__inner,
    .el-input-group__append {
      color: rgb(22, 22, 22) !important;
      background-color: #fff !important;
    }
  }
}
</style>
