<template>
  <div class="search-box">
    <el-button
      v-show="showInput"
      class="el-icon-search"
      @click="triggerInput"
    />
    <div
      v-show="!showInput"
      class="small-input-box"
      :class="{ 'input-box': !showInput }"
    >
      <el-input
        ref="sinput"
        v-model="searchVal"
        :placeholder="placeholder"
        prefix-icon="el-icon-search"
        :clearable="true"
        @change="handleChange"
        @blur="handleBlur"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchInput",
  props: {
    placeholder: {
      type: String,
      default: "搜索",
    },
  },
  data() {
    return {
      showInput: true,
      searchVal: "",
    };
  },
  methods: {
    triggerInput() {
      this.showInput = !this.showInput;
    },
    handleBlur() {
      if (!this.searchVal) {
        this.showInput = true;
      }
    },
    handleChange(val) {
      this.$emit("change", val);
    },
  },
};
</script>
<style>
.search-box .small-input-box .el-input__suffix {
  right: 12px;
}
</style>
<style lang="scss" scoped>
.search-box {
  display: inline-block;
  [class*="el-icon-"] {
    margin-left: 0px;
  }
  .small-input-box {
    width: 60px;
    margin-left: 5px;
  }
  .input-box {
    width: 100%;
  }
}
</style>
