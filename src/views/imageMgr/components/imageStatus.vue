<template>
  <div class="imgstatuscell">
    <div class="imgstatus-row">
      <!-- NORMAL("正常"), ERROR("异常"), SYNCING("同步中"), -->
      <span v-if="status === 'NORMAL'" class="success">
        <i class="el-icon-video-play success" />
        <!-- 正常 -->
        正常
      </span>
      <span v-if="status === 'ERROR'" class="error">
        <el-tooltip effect="light" placement="top" :visible-arrow="true">
          <div slot="content">
            <div v-for="(item, index) in errMsgArr" :key="index">
              {{ item }}
            </div>
          </div>
          <span>
            <i class="el-icon-warning error" />
            <!-- 异常 -->
            异常
          </span>
        </el-tooltip>
      </span>
      <span v-if="status === 'SYNCING'" class="syncing">
        <i class="el-icon-loading syncing" />
        <!-- 同步中 -->
        同步中
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      default: "",
    },
    rowstatus: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      errMsgArr: "",
    };
  },
  created() {
    this.errMsgArr = this.rowstatus.errorMsg;
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.imgstatuscell {
  .imgstatus-row {
    span {
      display: inline-flex;
      align-items: center;
    }
    .success {
      color: $msgSuccess;
    }
    .error {
      color: $msgDanger;
    }
    .syncing {
      color: #409eff;
    }

    .offline {
      // color: #fff;
    }
    .warn {
      color: $msgWarning;
    }
    .notice {
      color: $msgNotice;
    }
    [class*="el-icon-"] {
      margin-left: 0px;
      font-size: 16px;
    }
  }
}
</style>
