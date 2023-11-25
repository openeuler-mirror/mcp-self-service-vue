<template>
  <div class="network-group-wrap">
    <div v-for="(item, index) in networks" :key="'network' + index">
      <el-form-item
        :label="'网卡' + (networks.length > 1 ? index + 1 : '')"
        prop="network"
        :class="[item.errorFlag ? 'error-input' : '', 'network-own-required']"
      >
        <el-input
          v-if="item.type === 'custom'"
          v-model="item.purpose"
          @change="inputChange($event, index)"
          placeholder="描述新增网卡用途"
        />
        <el-input v-else v-model="item.purpose" disabled />

        <i
          v-if="index === networks.length - 1"
          class="el-icon-circle-plus-outline"
          @click="addNetworkItem"
        />
        <i
          v-show="item.type === 'custom'"
          class="el-icon-remove-outline"
          @click="deleteNetworkItem(index)"
        />

        <span v-show="item.errorFlag" class="error-text">{{
          item.errorMsg
        }}</span>
      </el-form-item>
    </div>
    <div v-if="networks.length === 0" class="switch-port-wrap">
      <el-form-item label="网卡">
        <span class="noNetWorkMsg">模板没有网卡，请按需添加网卡</span>
        <i class="el-icon-circle-plus-outline" @click="addNetworkItem" />
      </el-form-item>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    customNetworks: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      networks: [],
    };
  },
  watch: {
    customNetworks(newVal, oldVal) {
      this.networks = newVal;
    },
  },
  methods: {
    addNetworkItem() {
      if (this.networks.length >= 4) {
        this.alertTips("网卡数目已达上限");
        return false;
      }
      this.networks.push({
        purpose: "",
        interfaceId: 0,
        type: "custom",
        errorFlag: false,
        errorMsg: "",
      });
    },
    deleteNetworkItem(index) {
      this.networks.splice(index, 1);
    },
    inputChange(val, index) {
      if (val.length > 0) {
        this.$set(this.networks[index], "errorFlag", false);
        this.$set(this.networks[index], "errorMsg", false);
      } else {
        this.$set(this.networks[index], "errorFlag", true);
        this.$set(this.networks[index], "errorMsg", "网卡用途不能为空");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.network-group-wrap {
  .switch-port-wrap {
    display: inline-block;
    color: $fontColor;
  }
  .noNetWorkMsg {
    width: 300px;
    display: inline-block;
  }
  .el-input {
    width: 300px;
  }
  .network-own-required ::v-deep {
    .el-form-item__label:before {
      content: "*";
      color: #f56c6c;
      margin-right: 4px;
    }
  }
  .switch-port-wrap ::v-deep {
    .el-form-item__label:before {
      content: "*";
      color: #f56c6c;
      margin-right: 4px;
    }
  }
  .error-text {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
  }
}
</style>
