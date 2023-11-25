<template>
  <div>
    <div class="detailSummary">
      <div class="basicInfo">
        <h3>基本信息</h3>
        <div class="flex">
          <div class="flex2">
            <!-- <img :src="serverVmInfo.machineInfo.logo" /> -->
            <img v-if="imgSrc" :src="imgSrc" />
            <p>{{ getStatusText() }}</p>
            <el-button
              v-show="
                serverVmInfo.machineInfo.status === 'AVAILABLE' ||
                serverVmInfo.machineInfo.status === 'CONNECTED' ||
                serverVmInfo.machineInfo.status === 'SUSPEND' ||
                serverVmInfo.machineInfo.status === 'INSTALLING'
              "
              type="primary"
              @click="openVncUrl(serverVmInfo.machineInfo.uuid)"
              >控制台</el-button
            >
          </div>
          <div class="flex3">
            <p>
              名称：<span>
                {{ serverVmInfo.machineInfo.alisname }}
                <el-link
                  type="primary"
                  @click="editalisname(serverVmInfo.machineInfo)"
                >
                  修改名称
                </el-link></span
              >
            </p>
            <p>
              创建时间：<span>{{ serverVmInfo.machineInfo.createDate }}</span>
            </p>
            <p>
              控制台地址：<span>{{ serverVmInfo.machineInfo.remoteUrl }}</span>
            </p>
          </div>
          <div class="flex3">
            <p class="flex">
              描述：
              <span v-if="!isEdit">
                {{ serverVmInfo.machineInfo.description }}
                <i class="el-icon-edit-outline" @click="handleEditDesc" />
              </span>
              <span v-else>
                <el-form ref="form" :model="form" class="ruleForm">
                  <el-form-item
                    prop="desc"
                    :rules="[
                      {
                        validator: validateCharNum,
                        trigger: 'blur',
                        message: '描述内容不能包含特殊字符',
                      },
                      {
                        required: true,
                        message: '描述不能为空',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input
                      v-model="form.desc"
                      placeholder="输入描述信息"
                      style="width: 150px"
                      size="mini"
                    />
                    <el-button
                      size="mini"
                      style="margin-left: 5px"
                      @click="handelChangeDec"
                      >确定</el-button
                    >
                    <el-button size="mini" @click="isEdit = false"
                      >取消</el-button
                    >
                  </el-form-item>
                </el-form>
              </span>
            </p>
            <p>
              IP地址：<span>{{ serverVmInfo.machineInfo.ipAddress }}</span>
            </p>

            <p>
              访问密码：<span>
                {{ serverVmInfo.machineInfo.remotePassword }}
                <!-- v-if="serverVmInfo.machineInfo.remotePassword" -->
                <el-link
                  type="primary"
                  @click="resetPassword(serverVmInfo.machineInfo)"
                >
                  重置密码
                </el-link>
              </span>
            </p>
          </div>
          <div class="flex3">
            <p>
              操作系统：<span>{{ serverVmInfo.machineInfo.osName }}</span>
            </p>
            <p>
              UUID：<span>{{ serverVmInfo.machineInfo.uuid }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="hardwareInfo">
        <h3>硬件信息</h3>
        <div class="grid">
          <div>
            <div class="gridcontent-box">
              <p class="flex justify-between">
                <span class="t">CPU</span>
                <span>大小/{{ serverVmInfo.deviceInfo.cpu.cpus }}核</span>
              </p>
              <p class="flex justify-between">
                <span>利用率</span>
                <span>{{ serverVmInfo.deviceInfo.cpu.usedPercent }}%</span>
              </p>
              <el-progress
                :text-inside="true"
                :percentage="
                  setItemProgress(serverVmInfo.deviceInfo.cpu.usedPercent)
                "
                :color="customColorMethod"
              />
            </div>
          </div>
          <div>
            <div class="gridcontent-box">
              <p class="flex justify-between">
                <span class="t">内存</span>
                <span
                  >大小/{{ serverVmInfo.deviceInfo.memory.memoryTotal }}GB</span
                >
              </p>
              <p class="flex justify-between">
                <span>利用率</span>
                <span>{{ serverVmInfo.deviceInfo.memory.memoryPercent }}%</span>
              </p>
              <el-progress
                :text-inside="true"
                :percentage="
                  setItemProgress(serverVmInfo.deviceInfo.memory.memoryPercent)
                "
                :color="customColorMethod"
              />
            </div>
          </div>

          <div
            v-for="(item, index) in serverVmInfo.deviceInfo.disks"
            :key="index"
          >
            <div class="gridcontent-box center-box">
              <p class="flex justify-between">
                <span class="t">磁盘{{ index }}</span>
                <span>大小/{{ item.total }}GB</span>
              </p>
              <!-- <p class="flex justify-between">
                <span>利用率</span>
                <span>{{ item.usedPercent }}%</span>
              </p>
              <el-progress
                :text-inside="true"
                :percentage="setItemProgress(item.usedPercent)"
                :color="customColorMethod"
              /> -->
            </div>
          </div>
          <div
            v-for="(network, index) in serverVmInfo.deviceInfo.interfaces"
            :key="'network' + index"
          >
            <div class="gridcontent-box">
              <p class="flex justify-between">
                <span class="t">网卡{{ index }}</span>
              </p>
              <div class="flex justify-between">
                <div class="flex-column networkinfo">
                  <span>交换机：{{ network.virtualSwitch }}</span>
                  <span>端口：{{ network.portGroup }}</span>

                  <span>地址池：{{ network.macAddressPool }}</span>
                  <span>MAC地址：{{ network.macAddress }}</span>

                  <span>安全组：{{ network.securityGroup }}</span>
                </div>
                <div class="flex-column networkinfo">
                  <span v-if="network.ip">
                    ip地址：{{ network.ip || "-" }}
                  </span>

                  <span v-if="network.mask">
                    子网掩码：{{ network.mask || "-" }}
                  </span>

                  <span v-if="network.gw">
                    默认网关：{{ network.gw || "-" }}
                  </span>

                  <span v-if="network.dns1">
                    首选DNS：{{ network.dns1 || "-" }}
                  </span>

                  <span v-if="network.dns2">
                    次选DNS：{{ network.dns2 || "-" }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 重置密码 -->
    <resetPassword
      :options="resetPasswordOption"
      :visible.sync="showresetPassword"
    ></resetPassword>
    <!-- 修改名称 -->
    <editalisname
      :options="editalisnameOption"
      :visible.sync="showeditalisname"
    ></editalisname>
  </div>
</template>

<script>
import validate from "@/utils/validate";
import {
  getServerVmDetail,
  getVncUrl,
  updateMachineDescription,
  downLoadServerVmLog,
} from "@/api/serverVm";
import ReMessage from "@/utils/message";
import resetPassword from "../drawer/resetPassword.vue";
import editalisname from "../drawer/editaliname.vue";
export default {
  name: "serviceDetail",
  components: {
    resetPassword,
    editalisname,
  },
  data() {
    return {
      isEdit: false,
      serverVmUuid: this.$route.params.serverVmUuid,
      clusterId: this.$route.params.clusterId,
      // 变更云服务器
      serverVmInfo: {
        machineInfo: {},
        deviceInfo: {
          cpu: {},
          memory: {},
        },
      },
      form: {
        desc: "",
      },
      showresetPassword: false,
      resetPasswordOption: {
        title: "",
        editflag: "",
        formData: {}, // 表单数据
      },
      imgSrc: "",

      showeditalisname: false,
      editalisnameOption: {
        title: "",
        editflag: "",
        formData: {}, // 表单数据
      },
    };
  },
  created() {
    this.getServerVmInfo();
  },
  methods: {
    refreshPage() {
      this.getServerVmInfo();
    },
    // 修改名称
    editalisname(machineInfo) {
      this.showeditalisname = true;
      this.editalisnameOption.formData = machineInfo;
    },
    resetPassword(machineInfo) {
      this.showresetPassword = true;
      this.resetPasswordOption.formData = machineInfo;
    },
    handelChangeDec() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          updateMachineDescription({
            uuid: this.serverVmUuid,
            clusterId: this.clusterId,
            description: this.form.desc,
          }).then((res) => {
            this.$message.success("备注修改成功");
            this.isEdit = false;
            this.refreshPage();
          });
        } else {
          return false;
        }
      });
    },
    getServerVmInfo() {
      getServerVmDetail({
        serverVmUuid: this.serverVmUuid,
        clusterId: this.clusterId,
      }).then((data) => {
        this.serverVmInfo = data;
        let imgObj = {
          mcServerVmLogoPath: this.serverVmInfo.machineInfo.logo,
          mcServerVmLogoName: this.serverVmInfo.machineInfo.logoName,
          serverVmUuid: this.serverVmUuid,
          clusterId: this.clusterId,
        };
        // console.log("imgObj", imgObj, this.serverVmInfo.machineInfo);
        downLoadServerVmLog(imgObj).then((res) => {
          this.imgSrc = "data:image/png;base64," + res.body;
        });
      });
    },
    validateCharNum(rule, value, callback) {
      return validate.validateCharNum(rule, value, callback);
    },
    handleEditDesc() {
      this.isEdit = true;
      this.form.desc;
      // this.$emit("showFoot", true);
    },
    handleConfirm() {
      const validate = this.$refs["form"].validate();
      let uuid = this.serverVmUuid;
      let description = this.form.desc;
      updateMachineDescription({ uuid, description }).then((data) => {
        ReMessage.success("修改成功");
        this.getServerVmInfo();
        this.handleCancel();
      });
    },
    handleCancel() {
      this.isEdit = false;
      this.form.desc = "";
      this.$refs["form"].resetFields();
    },
    setItemProgress(value = 0) {
      return parseInt(value.toFixed(1));
    },
    // 自定义进度条颜色
    customColorMethod(percentage) {
      if (percentage <= 80) {
        return "#0000FF";
      } else if (80 < percentage < 90) {
        return "#FFA500";
      } else {
        return "#FF0000";
      }
    },
    openVncUrl(uuid) {
      let serverVmUuid = uuid;
      getVncUrl({ serverVmUuid, clusterId: this.clusterId }).then((res) => {
        let vncUrl = res.vncUrl;
        if (vncUrl) {
          window.open(vncUrl, "_blank");
        }
      });
    },
    getStatusText() {
      const { status } = this.serverVmInfo.machineInfo;
      switch (status) {
        case "CONNECTED":
          return "状态：已连接";
        case "SUSPEND":
          return "状态：暂停";
        case "OFFLINE":
          return "状态：离线";
        case "INSTALLING":
          return "状态：安装";
        case "OVERDUE":
          return "状态：已过期";

        default:
          return "-";
      }
    },
  },
};
</script>
<style lang="scss">
.detailSummary .el-progress-bar__innerText {
  display: none;
}
.detailSummary .ruleForm {
  .el-form-item {
    margin-bottom: 0;
    .el-form-item__content {
      line-height: 26px;
    }
  }
}
</style>
<style lang="scss" scoped>
.detailSummary {
  padding: 5px;
  > div {
    box-shadow: $boxShadow;
    margin-bottom: 30px;
    padding: 10px 20px 20px 20px;
  }
  h3 {
    font-weight: normal;
    font-size: 18px;
  }
  .basicInfo {
    .el-icon-receiving {
      font-size: 60px;
    }
    p {
      line-height: 29px;
      margin-top: 0;
    }
  }
  .grid {
    @include nineStyle();
    > div {
      .gridcontent-box {
        border: 1px $borderColor solid;
        padding: 0 15px 10px;
        min-height: 88px;
      }
      .center-box {
        display: flex;
        align-items: center;
        .flex {
          flex: 1;
        }
      }
      p {
        margin: 8px 0;
        span {
          &.t {
            font-size: 14px;
          }
        }
        &.text-info {
          margin-top: 20px;
          span {
            font-size: 12px;
            color: $fontLightColr;
          }
        }
      }
    }
  }

  .networkinfo {
    span {
      margin: 4px 0;
    }
    font-size: 14px;
    color: $fontLightColr;
  }
  .flex3 {
    p {
      display: flex;
      span {
        display: inline-block;
        flex: 1;
        width: 1px;
        white-space: nowrap;
        /*内容超宽后禁止换行显示*/

        overflow: hidden;
        /*超出部分隐藏*/

        text-overflow: ellipsis;
        /*文字超出部分以省略号显示*/
      }
    }
  }
}
</style>
