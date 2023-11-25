<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <el-avatar
            v-if="userImg"
            class="user-avatar"
            :src="userImgSrc"
            icon="el-icon-user-solid"
            :size="30"
          />
          <el-avatar v-else class="name-avatar" :size="25">{{
            firstRealName
          }}</el-avatar>
          <span class="name-lable">{{ loginUserInfo.realName }}</span>
          <i class="el-icon-arrow-down" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="logout">注销</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { getInfo } from "@/api/user";
export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
  },
  props: {
    userImg: {
      type: Boolean,
      default: false,
    },
    userImgSrc: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loginUserInfo: {},
      firstRealName: "",
    };
  },
  created() {
    //获取用户信息
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      // 申请云服务器
      getInfo().then((data) => {
        this.loginUserInfo = data;
        let realName = data.realName;
        if (realName) {
          this.firstRealName = realName.substring(0, 1);
        } else {
          this.firstRealName = data.userName(0, 1);
        }
      });
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
  },
};
</script>

<style  lang="scss">
// 退出下拉面板边框颜色
.el-popper[x-placement^="bottom"] .popper__arrow {
  border-bottom-color: #b5b4b4;
}
</style>
<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    .avatar-container {
      margin-right: 36px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        span {
          margin: -6px 2px;
        }
        .name-avatar {
          font-size: 12px;
        }
        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 10px;
        }
        .name-avatar {
          background: $menuActiveText;
        }
        .el-icon-arrow-down {
          cursor: pointer;
          position: absolute;
          right: -12px;
          top: 18px;
          font-size: 16px;
        }
      }
    }
  }
}
.el-dropdown-menu {
  width: 100px;
  border-radius: 0 !important;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
  .el-dropdown-menu__item {
    text-align: center;
  }
}
.user-dropdown {
  top: 42px !important;
}
</style>
