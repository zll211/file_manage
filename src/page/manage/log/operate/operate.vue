<template>
  <div class="main-container log-main">
    <div class="common-header">
      <hzzt-title>操作日志</hzzt-title>
      <div class="common-header-end flex align-items-center">
        <!--<el-input style="margin-right: 22px" v-model="keyword" size="small" clearable
                  placeholder="请输入用户id"
                  suffix-icon="el-icon-search"
                  @keyup.enter.native="activeTabName === '登录日志' ? loginList() : operateList()"
                  @clear="activeTabName === '登录日志' ? loginList() : operateList()">
        </el-input>-->
        <el-select style="margin-right: 10px" v-model="userValue" placeholder="请选择用户" @change="userHandleChange">
          <el-option
            v-for="item in userOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select style="margin-right: 10px" v-model="operateValue" placeholder="请选择操作内容" @change="operateHandleChange" v-if="activeTabName === '操作日志'">
          <el-option
            v-for="item in operateOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker
          style="margin-right: 10px"
          v-model="date"
          type="datetimerange"
          :picker-options="datePickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="datePicker">
        </el-date-picker>

      </div>
    </div>
    <div class="common-table">
      <div class="common-table-header flex justify-content-between align-items-center" style="width: 100%">
        <el-tabs v-model="activeTabName" @tab-click="handleClick" >
          <el-tab-pane label="登录日志" name="登录日志"></el-tab-pane>
          <el-tab-pane label="操作日志" name="操作日志"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="log-table">
        <el-table
          ref="pTable"
          v-loading="loading"
          :data="data"
          border
          :height="tableHeight"
          style="width: 100%">
          <el-table-column
            prop="username"
            label="用户"
            align="center">
          </el-table-column>
          <el-table-column
            prop="ip"
            label="ip"
            align="center"
          v-if="activeTabName === '登录日志'">
          </el-table-column>
          <el-table-column
            prop="time"
            label="时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="type"
            label="操作"
            align="center">
          </el-table-column>


        </el-table>

      </div>

      <div class="log-page">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="pageIndex"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
  import hzztTitle from '@/components/hzztTitle';
  import {operateService} from "./operate.service";
  import {baseUrl} from '@/config/utils';
  import HzztIcon from "../../../../components/hzztIcon";

  export default {
    created() {
      this.getLoginUserOptions();
      this.loginList();
    },
    components: {
      HzztIcon,
      hzztTitle,
    },
    data() {
      return {
        activeTabName: '登录日志',
        data: [],
        date: '',
        datePickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        tableHeight: undefined,
        total: 10,
        userOptions: [],
        userValue: '',
        operateOption: [{
          value: 'created',
          label: '新增'
        }, {
          value: 'updated',
          label: '修改'
        }, {
          value: 'deleted',
          label: '删除'
        },{
          value: 'relate',
          label: '切片关联'
        }, {
          value: 'classify',
          label: '切片分类'
        }],
        operateValue: '',

      };
    },
    methods: {
      handleClick(tab) {
        this.pageIndex = 1;
        if (this.activeTabName === '登录日志') {
          this.getLoginUserOptions();
          this.loginList();
        }else{
          this.getOperateUserOptions();
          this.operateList();
        }
      },
      // 登录日志
      loginList() {
        let params = {
          page: this.pageIndex,
          page_size: this.pageSize,
          user_id: this.userValue,
          begin_at: this.date[0],
          end_at: this.date[1],
          // operate: this.userValue
        };
        this.loading = true;
        operateService.loginList(params)
          .then(({body}) => {
            if (body?.ret_code === 0) {
              this.data = body.data.list;
              this.total = body.data.meta.count;
            }
          }).finally(() => {
          this.loading = false;
        })
      },
      // 操作日志
      operateList() {
        let params = {
          page: this.pageIndex,
          page_size: this.pageSize,
          user_id: this.userValue,
          begin_at: this.date[0],
          end_at: this.date[1],
          operate: this.operateValue
        };
        this.loading = true;
        operateService.operateList(params)
          .then(({body}) => {
            if (body?.ret_code === 0) {
              this.data = body.data.list.map((item) => ({
                username:item.user_name,
                time:item.time,
                type:item.opt
              }));
              this.total = body.data.meta.count;
            }
          }).finally(() => {
          this.loading = false;
        })
      },
      //分页
      handleCurrentChange(val) {
        this.pageIndex = val;
        if (this.activeTabName === '登录日志') {
          this.loginList();
        }else{
          this.operateList();
        }
      },
      //时间日期选择器
      datePicker() {
        // console.log("this.date",this.date);
        if (this.activeTabName === '登录日志') {
          this.loginList();
        }else{
          this.operateList();
        }
      },
      // 获取登录日志的用户下拉选
      getLoginUserOptions() {
        this.userOptions = [];
        this.userValue = '';
        let params = {};
        operateService.loginList(params)
          .then(({body}) => {
            if (body?.ret_code === 0) {
              this.userOptions = body.data.users.map((item)=>({
                value:item.id,
                label:item.username,
              }));
            }
          })
      },
      // 获取操作日志的用户下拉选
      getOperateUserOptions() {
        this.userOptions = [];
        this.userValue = '';
        let params = {};
        operateService.operateList(params)
          .then(({body}) => {
            if (body?.ret_code === 0) {
              this.userOptions = body.data.users.map((item)=>({
                value:item.id,
                label:item.username,
              }));
            }
          })
      },
      userHandleChange(value) {
        this.userValue=value;
        this.pageIndex=1;
        if (this.activeTabName === '登录日志') {
          this.loginList();
        }else{
          this.operateList();
        }
      },
      operateHandleChange(value) {
        this.operateValue=value;
        this.pageIndex=1;
        this.operateList();
      }
    }
  }

</script>

<style lang="scss">
  .common-table-header {
    margin: 0 0 25px;
  }
  .el-main {
    height: 100%;
    .log-main {
      height: calc(100% - 60px);
      display: flex;
      flex-direction: column;
      .common-header{
        .el-input--suffix {
          .el-input__inner {
            line-height: 32px !important;
            height: 32px !important;
          }
          .el-select__caret {
            line-height: 32px !important;
          }
        }
        .el-range-editor {
          width: 350px !important;
          line-height: 32px !important;
          height: 32px !important;
          .el-range__icon{
            line-height: 24px !important;
          }
          .el-range-separator{
            line-height: 24px !important;
          }
        }
      }
      .common-table {
        position: relative;
        padding-bottom: 60px !important;
        flex: 1;
        .log-table {
          height: 100%;

        }
        .log-page {
          position: absolute;
          bottom: 0;
          width: 100%;
          display: flex;
          justify-content: center;
          height: 40px;
          align-items: flex-start;
        }
      }
    }
  }
</style>
