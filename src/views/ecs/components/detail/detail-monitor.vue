<template>
  <div class="detailMonitor">
    <highChart key="cpu" :options="calcCpuData(timeList, cpuUsed)" />
    <highChart key="mem" :options="calcMemData(timeList, memUsed)" />
    <highChart
      key="disk"
      :options="calcDiskData(timeList, diskReadSpeed, diskWriteSpeed)"
    />
    <highChart
      key="network"
      :options="calcNetWorkData(timeList, netWorkInSpeed, netWorkOutSpeed)"
    />
  </div>
</template>

<script>
import highChart from "@/components/Hightchart";
import { getServerVmMonitorInfo } from "@/api/serverVm";
export default {
  components: {
    highChart,
  },
  data() {
    return {
      chartOptions: {
        title: {
          align: "left",
          text: "",
          style: {
            fontSize: "14px",
          },
          margin: 50,
        },
        xAxis: {
          type: "datetime",
        },
        yAxis: {
          title: {
            align: "high",
            offset: 0,
            rotation: 0,
            y: -30,
            text: "",
            style: {
              fontSize: "12px",
            },
          },
        },
        legend: {
          layout: "vertical",
          align: "right",
          verticalAlign: "top",
        },
        credits: {
          enabled: false,
        },
        series: [],
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500,
              },
            },
          ],
        },
      },
      serverVmUuid: this.$route.params.serverVmUuid,
      timeList: [],
      cpuUsed: [],
      memUsed: [],
      diskReadSpeed: [],
      diskWriteSpeed: [],
      netWorkInSpeed: [],
      netWorkOutSpeed: [],
    };
  },
  created() {
    this.getMonitorInfo();
  },
  methods: {
    getMonitorInfo() {
      let serverVmUuid = this.serverVmUuid;
      getServerVmMonitorInfo({ serverVmUuid }).then((res) => {
        this.timeList = res.timeList;
        this.cpuUsed = res.cpuUsed;
        this.memUsed = res.memUsed;
        this.diskReadSpeed = res.diskReadSpeed;
        this.diskWriteSpeed = res.diskWriteSpeed;
        this.netWorkInSpeed = res.netWorkInSpeed;
        this.netWorkOutSpeed = res.netWorkOutSpeed;
      });
    },
    calcCpuData(timeData, cpuData) {
      const chartOptions = JSON.parse(JSON.stringify(this.chartOptions));
      chartOptions.chart = {
        type: "spline",
      };
      chartOptions.title.text = "CPU利用率(%)";
      chartOptions.xAxis.categories = timeData;
      chartOptions.yAxis.labels = {
        formatter: function () {
          return this.value.toFixed(1) + "%";
        },
      };
      chartOptions.series = [
        {
          name: "CPU利用率(%)",
          data: cpuData,
        },
      ];
      return chartOptions;
    },
    calcMemData(timeData, memData) {
      const chartOptions = JSON.parse(JSON.stringify(this.chartOptions));
      chartOptions.chart = {
        type: "spline",
      };
      chartOptions.title.text = "内存利用率(%)";
      chartOptions.xAxis.categories = timeData;
      chartOptions.yAxis.labels = {
        formatter: function () {
          return this.value.toFixed(1) + "%";
        },
      };
      chartOptions.series = [
        {
          name: "内存利用率(%)",
          data: memData,
        },
      ];
      return chartOptions;
    },
    calcDiskData(timeData, diskReadSpeedData, diskWriteSpeedData) {
      const chartOptions = JSON.parse(JSON.stringify(this.chartOptions));
      chartOptions.chart = {
        type: "spline",
      };
      chartOptions.title.text = "磁盘I/O(KB/s)";
      chartOptions.xAxis.categories = timeData;
      chartOptions.series = [
        {
          name: "磁盘I/O写入",
          data: diskWriteSpeedData,
        },
        {
          name: "磁盘I/O读取",
          data: diskReadSpeedData,
        },
      ];
      return chartOptions;
    },
    calcNetWorkData(timeData, netWorkInSpeedData, netWorkOutSpeedData) {
      const chartOptions = JSON.parse(JSON.stringify(this.chartOptions));
      chartOptions.chart = {
        type: "spline",
      };
      chartOptions.title.text = "网络(KB/s)";
      chartOptions.xAxis.categories = timeData;
      chartOptions.yAxis.labels = {
        formatter: function () {
          return (this.value * 100).toFixed(1);
        },
      };
      chartOptions.series = [
        {
          name: "网络流入速度",
          data: netWorkInSpeedData,
        },
        {
          name: "网络流出速度",
          data: netWorkOutSpeedData,
        },
      ];
      return chartOptions;
    },
  },
};
</script>

<style lang="scss" scoped>
.detailMonitor {
  @include nineStyle(2);
  padding: 5px;
  > div {
    box-shadow: $boxShadow;
    padding: 10px;
  }
}
</style>
