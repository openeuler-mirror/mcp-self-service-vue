<template>
  <div class="serviceDetail app-container">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="概要" name="summary">
        <detail-summary ref="detailSummary" @showFoot="handleShowFoot" />
      </el-tab-pane>
      <el-tab-pane label="监控" name="monitor">
        <detail-monitor />
      </el-tab-pane>
      <el-tab-pane label="快照" name="snapshot">
        <detail-snapshot />
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="log">
        <detail-log />
      </el-tab-pane>
    </el-tabs>
    <foot-btn v-show="footVisible && activeTab === 'summary'" class="foot-btn" @confirm="handleConfirm" @cancel="handleCancel" />
  </div>
</template>

<script>
import { detailSummary, detailMonitor, detailSnapshot, detailLog } from './index'
import footBtn from '@/components/Footbtn'

export default {
  name: 'ServiceDetail',
  components: {
    detailSummary,
    detailMonitor,
    detailSnapshot,
    detailLog,
    footBtn
  },
  data() {
    return {
      activeTab: 'summary',
      footVisible: false
    }
  },
  created() {
    this.activeTab = this.$route.params.tab || 'summary'
  },
  methods: {
    handleShowFoot() {
      this.footVisible = true
    },
    handleConfirm() {
      if (this.activeTab === 'summary') {
        this.$refs.detailSummary.handleConfirm().then(res => {
          this.footVisible = false
        }).catch(() => {})
      }
    },
    handleCancel() {
      if (this.activeTab === 'summary') {
        this.footVisible = false
        this.$refs.detailSummary.handleCancel()
      }
    }
  }
}
</script>

<style lang="scss">
.serviceDetail {
  color: $fontColor;
  .el-tabs__item{
    width: 120px;text-align: center;
  }
  .foot-btn{
    margin: 0 -20px;
  }
}
</style>
