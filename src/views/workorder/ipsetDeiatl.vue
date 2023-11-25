<template>
  <div>
    <span
      v-if="pageInfo.ipBindMac || pageInfo.manualSetIp"
      class="networkIpinfo"
    >
      <span v-if="pageInfo.ipBindMac && !pageInfo.manualSetIp">
        IP/MAC绑定：IP地址（ {{ pageInfo.ip }});
      </span>

      <span v-if="pageInfo.ipBindMac && pageInfo.manualSetIp">
        IP/MAC绑定+手动设置IP：IP地址（ {{ pageInfo.ip }});
      </span>
      <span v-if="!pageInfo.ipBindMac && pageInfo.manualSetIp">
        手动设置IP：IP地址（ {{ pageInfo.ip }});
      </span>

      <span v-if="pageInfo.manualSetIp && pageInfo.mask">
        子网掩码:({{ pageInfo.mask }});
      </span>
      <span v-if="pageInfo.manualSetIp && pageInfo.gw">
        默认网关:({{ pageInfo.gw }});
      </span>
      <span v-if="pageInfo.manualSetIp && pageInfo.dns1">
        首先DNS:({{ pageInfo.dns1 }});</span
      >
      <span v-if="pageInfo.manualSetIp && pageInfo.dns2">
        备先DNS:({{ pageInfo.dns2 }});</span
      >
    </span>

    <span v-if="pageInfo.automaticAcqIp" class="networkIpinfo">
      <span> ip方式：自动DHCP</span>
    </span>
  </div>
</template>

<script>
export default {
  name: "App",
  props: ["ipinfo"],
  data() {
    return {
      pageInfo: this.ipinfo,
    };
  },
};
</script>
<style lang="scss" scoped>
.networkIpinfo {
  margin-left: 40px;
  line-height: 20px;
  color: #606266;
  display: block;
}
</style>
