<template>
  <div class="header-main">
    <div class="header-start" @click="modifyCollapse">
      <img src="../assets/img/navCloseIcon.png">
    </div>
    <div class="header-center">
      <div class="entry-progress" style="margin-right: 20px" v-if="isShowScanProgress">
        <div class="flex align-self-end align-items-center" style="width: 250px">
          <el-button type="text">扫描进度：</el-button>
          <el-progress :text-inside="true" :stroke-width="18" class="flex-1"
                       :percentage="progressScanValue"></el-progress>
        </div>
      </div>
      <div class="entry-progress flex column align-items-start" v-if="isShowRelateProgress">
        <div class="flex align-self-end align-items-center" style="width: 250px">
          <el-button type="text">关联进度：</el-button>
          <el-progress :text-inside="true" :stroke-width="18" class="flex-1"
                       :percentage="progressRelateValue"></el-progress>
        </div>
      </div>
    </div>
    <div class="header-end">
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="dropdown-button">
          <!--<img class="user-avatar" src="assets/img/default-avator.png"/>-->
          <span class="real-name">{{user.nickname}}</span>
          <i class="el-icon-caret-bottom drop-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">退出
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
  import {loginService} from '../page/base/login/login.service';
  import {mapState, createNamespacedHelpers} from 'vuex';
  const moduleMapState = createNamespacedHelpers('stomp').mapState;

  export default {
    data() {
      return {};
    },
    computed: {
      ...mapState([
        'user',
        'collapse',
      ]),
      ...moduleMapState([
        'relateJSONProgress',
        'scanSliceProgress',
      ]),
      isShowScanProgress() {
        return !!this.scanSliceProgress;
      },
      isShowRelateProgress() {
        return !!this.relateJSONProgress;
      },
      /*totalSliceCount() {
        if (this.moveFileProgress) {
          return this.moveFileProgress.count_slice;
        } else {
          return 0;
        }
      },
      currentSliceCount() {
        if (this.moveFileProgress) {
          return this.moveFileProgress.current_slice;
        } else {
          return 0;
        }
      },*/
      progressRelateValue() {
        if (this.relateJSONProgress) {
          if (this.relateJSONProgress.completed === this.relateJSONProgress.count) {
            this.$store.commit('stomp/setRelateJSONProgress', null);
            return 0;
          }
          return (this.relateJSONProgress.completed / this.relateJSONProgress.count * 100).toFixed(2) / 1;
        } else {
          return 0;
        }
      },
      progressScanValue() {
        if (this.scanSliceProgress) {
          if (this.scanSliceProgress.completed === this.scanSliceProgress.count) {
            this.$store.commit('stomp/setScanSliceProgress', null);
            return 0;
          }
          return (this.scanSliceProgress.completed / this.scanSliceProgress.count * 100).toFixed(2) / 1;
        } else {
          return 0;
        }
      },
    },
    mounted() {

    },
    methods: {
      handleCommand(command) {
        if (command === 'logout') {
          loginService.logout()
            .then(({body}) => {
              if (body?.ret_code === 0) {
                window.sessionStorage.removeItem('accessToken');
                window.sessionStorage.removeItem('user');
                this.$store.commit('isLogin', false);
                this.$router.replace('/login');
              } else {
                this.$message.error(body?.ret_msg || '退出失败');
              }
            }).catch(() => {
            this.$message.error('退出失败');
          });
        }
      },
      modifyCollapse() {
        this.$store.commit('setCollapse', !this.collapse);
        setTimeout(() => {
          this.$root.$emit('size-change');
        }, 300);
      },
    },

  };
</script>

<style scoped lang="scss">
  @import "../style/variables";

  .header-main {
    display: flex;
    justify-content: space-between;
    position: relative;
  }

  .header-start {
    align-items: center;
    display: flex;
    cursor: pointer;
  }

  .header-center {
    align-items: center;
    display: flex;
  }

  .header-end {
    align-items: center;
    display: flex;
    height: 68px;
  }

  .dropdown-button {
    cursor: pointer;
    align-items: center;
    display: flex;
    justify-content: space-between;
    height: 68px;
    .user-avatar {
      margin-right: 8px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
    }
    .real-name {
      margin-right: 28px;
      color: $_pm-default-color;
      font-size: 14px;
    }
    .drop-bottom {
      margin-right: 8px;
      &::before {
        width: 9px;
        height: 9px;
        color: $_pm-base-color;
      }
    }
    &:hover {
      background: $_pm-default-background;
    }
  }

  .el-dropdown-menu {
    padding: 4px 0;
    .popper__arrow {
      border-width: 0 !important;
      &:after {
        border-width: 0 !important;
      }
    }
  }

  .el-popper[x-placement^="bottom"] {
    margin-top: 0;
  }

  .el-dropdown-menu__item {
    color: $_pm-default-dark-color;
    height: 42px;
    line-height: 42px;
    margin-top: 0;
    padding: 0 30px;
    &:before {
      height: 0;
    }
    &:focus {
      background-color: $_pm-base-color;
      color: #fff;
      a {
        color: #fff;
      }
    }
    &:not(.is-disabled):hover {
      background-color: $_pm-base-color;
      color: #fff;
      a {
        color: #fff;
      }
    }
    a {
      color: $_pm-default-dark-color;
    }
  }

</style>
