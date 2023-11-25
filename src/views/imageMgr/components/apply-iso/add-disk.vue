<template>
  <div class="disk-group-wrap">
    <div v-for="(item, index) in disks" :key="'disk' + index">
      <el-form-item
        :label="'磁盘' + (disks.length > 1 ? index + 1 : '')"
        prop="disk"
      >
        <el-input
          v-if="item.type === 'custom'"
          v-model="item.diskSize"
          v-only-num
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
          v-show="item.type === 'custom' && index !== 0"
          class="el-icon-remove-outline"
          @click="deleteDiskItem(index)"
        />
        <span v-show="item.errorFlag" style="color: #f00">
          {{ item.errorMsg }}
        </span>
      </el-form-item>
    </div>

    <div v-if="disks.length === 0" class="switch-port-wrap">
      <el-form-item label="磁盘">
        <span>没有磁盘，请按需添加磁盘</span>
        <i class="el-icon-circle-plus-outline" @click="addDiskItem" />
      </el-form-item>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    customDisks: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      disks: [],
    };
  },
  watch: {
    customDisks(newVal, oldVal) {
      this.disks = newVal;
    },
  },
  created() {
    // this.addDiskItem();
  },
  methods: {
    addDiskItem() {
      if (this.disks.length >= 4) {
        this.alertTips("磁盘数目已达上限");
        return false;
      }
      this.disks.push({
        diskSize: 300,
        type: "custom",
        diskId: 0,
        purpose: "",
        errorFlag: false,
        errorMsg: "",
      });
    },
    deleteDiskItem(index) {
      this.disks.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.disk-group-wrap {
  .switch-port-wrap {
    display: inline-block;
    color: $fontColor;
    width: 500px;
  }

  .defaultDiskInput {
    width: 300px;
    .r {
      width: 20px;
      display: inline-block;
    }
  }
  .customDiskInput {
    width: 150px;
  }
}
</style>
