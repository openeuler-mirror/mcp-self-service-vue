<template>
  <div class="template-group">
    <el-form label-width="100px">
      <el-form-item label="系统">
        <el-input v-model="os_machine" disabled />
      </el-form-item>
      <el-form-item label="架构">
        <el-input v-model="framework" disabled />
      </el-form-item>
      <el-form-item label="CPU/内存">
        <div class="flex">
          <el-radio-group v-model="cpu_mem" @change="handleCpuChange">
            <el-radio-button
              v-for="item in cpuMemList"
              :key="item.cpuValue"
              :label="item.label"
              :value="item.cpuValue"
            />
          </el-radio-group>
          <el-radio-group
            v-model="cpu_custom"
            class="custom-radio"
            @change="handleCustoChange"
          >
            <el-radio :label="1">自定义</el-radio>
          </el-radio-group>
          <div v-show="!cpu_mem" class="custom-group-wrap">
            <div>
              <span>CPU</span>
              <el-input v-model="custom_cup" v-only-num min="1">
                <template slot="append">核</template>
              </el-input>
            </div>
            <div>
              <span>内存</span>
              <el-input v-model="custom_mem" v-only-num min="1">
                <template slot="append">GB</template>
              </el-input>
            </div>
          </div>
        </div>
      </el-form-item>

      <!-- 添加磁盘  -->
      <add-disk ref="addDisk" :customDisks="customDisks" />

      <!-- 添加网卡 -->
      <add-network ref="addNetwork" :customNetworks="customNetworks" />
    </el-form>
  </div>
</template>

<script>
import addDisk from "./add-disk.vue";
import addNetwork from "./add-network.vue";
export default {
  components: {
    addDisk,
    addNetwork,
  },
  props: {
    template_os_machine: {
      //操作系统数据类型
      type: String,
    },
    template_framework: {
      //架构数据类型
      type: String,
    },
    template_systemType: {
      //架构数据类型
      type: String,
    },
    template_disk: {
      type: Array,
      default: () => [],
    },
    template_networks: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      os_machine: "",
      framework: "",
      systemType: "",
      templateDisks: [],
      templateNetworks: [],
      templateMirrorfile: [],
      customDisks: [],
      customNetworks: [],
      cpu_mem: "1核/1GB",
      cpu_custom: "", // 是否是自定义
      cpuMemList: [
        { cpuValue: "1", memValue: "1", label: "1核/1GB" },
        { cpuValue: "2", memValue: "2", label: "2核/2GB" },
        { cpuValue: "4", memValue: "4", label: "4核/4GB" },
      ],
      custom_cup: "",
      custom_mem: "",
    };
  },
  watch: {
    template_os_machine(newVal, oldVal) {
      this.os_machine = newVal;
    },
    template_framework(newVal, oldVal) {
      this.framework = newVal;
    },
    template_systemType(newVal, oldVal) {
      this.systemType = newVal;
    },
    template_disk(newVal, oldVal) {
      let disks = newVal;
      this.customDisks = [];
      for (let i = 0; i < disks.length; i++) {
        let disk = new Object();
        disk.diskSize = disks[i].diskSize;
        disk.type = "original";
        disk.diskId = disks[i].diskId;
        disk.purpose = "";
        this.customDisks.push(disk);
      }
      this.templateDisks = newVal;
    },
    template_networks(newVal, oldVal) {
      let networks = newVal;
      this.customNetworks = [];
      if (networks) {
        for (let i = 0; i < networks.length; i++) {
          let network = new Object();
          network.purpose = networks[i].purpose;
          network.interfaceId = networks[i].interfaceId;
          network.type = "original";
          this.customNetworks.push(network);
        }
      }
      this.templateNetworks = newVal;
    },
    deep: true,
  },
  methods: {
    //   cpu 切换
    handleCpuChange(val) {
      this.custom_cup = "";
      this.custom_mem = "";
      this.cpu_custom = "";
    },
    // 勾选自定义
    handleCustoChange() {
      this.cpu_mem = "";
    },
    handleCancel() {
      this.cpu_mem = "1核/1GB";
      this.cpu_custom = "";
      this.custom_cup = "";
      this.custom_mem = "";
      this.customDisks = [];
      this.templateDisks = [];
      this.templateNetworks = [];
      this.customDisks = [];
      this.customNetworks = [];
      this.templateMirrorfile = [];
    },
  },
};
</script>
<style lang="scss">
.template-group {
  .el-form-item__label {
    text-align: left !important;
  }
  .el-radio-button__inner {
    width: 100px;
  }
  [class*=" el-icon-"],
  [class^="el-icon-"] {
    margin-left: 15px;
  }
}
</style>
<style lang="scss" scoped>
.template-group {
  padding-left: 100px;
  .el-input {
    width: 300px;
    .r {
      width: 20px;
      display: inline-block;
    }
  }
  .custom-radio {
    display: flex;
    align-items: center;
    margin-left: 15px;
  }
  .custom-group-wrap {
    display: flex;
    span {
      margin: 0 10px 0 15px;
    }
    .el-input {
      width: 140px;
    }
  }
}
</style>
