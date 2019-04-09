<template>
  <div class="main-container scan-main">
    <div class="common-header">
      <hzzt-title>扫描日志</hzzt-title>
      <div class="common-header-end flex align-items-center">
        <el-input style="margin-right: 10px" v-model="keyword" size="small" clearable
                  placeholder="请输入病理号"
                  suffix-icon="el-icon-search"
                  @keyup.enter.native="scanList()"
                  @clear="scanList()">
        </el-input>
        <el-date-picker
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
      <el-table
          ref="pTable"
          v-loading="loading"
          :data="data"
          border
          :height="tableHeight"
          style="width: 100%">
        <el-table-column v-for="(data, index) in headers"
                         :key="index"
                         :fixed="data.fixed"
                         :prop="data.prop"
                         :label="data.label"
                         :min-width="data['min-width']"
                         :align="data.align">
        </el-table-column>
      </el-table>

      <div class="scan-page">
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
  import {scanService} from "./scan.service";
  import {baseUrl} from '@/config/utils';
  import HzztIcon from "../../../../components/hzztIcon";

  export default {
    created() {
      this.scanList();
    },
    components: {
      HzztIcon,
      hzztTitle,
    },
    data() {
      return {
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
        headers: [{
          'prop': 'pathology_id',
          'label': '病理号',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'section_number',
          'label': '切片编号',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'path',
          'label': '切片路径',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'scanistor',
          'label': '扫描仪',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'dev_id',
          'label': '设备id',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'record_at',
          'label': '扫描时间',
          'min-width': 120,
          'align': 'center',
        }],
        keyword: '',
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        tableHeight: undefined,
        total: 10,

      };
    },
    methods: {
      // 扫描日志列表
      scanList() {
        let params = {
          page: this.pageIndex,
          page_size: this.pageSize,
          pathology_id: this.keyword,
          begin_at: this.date[0],
          end_at: this.date[1],
        };
        this.loading = true;
        scanService.scanList(params)
          .then(({body}) => {
            if (body?.ret_code === 0) {
              this.data = body.data.list;
              this.total = body.data.meta.count;
            }
          }).finally(() => {
          this.loading = false;
        })
      },
      //分页
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.scanList();
      },
      //时间日期选择器
      datePicker() {
        this.scanList();
      },

    }
  }

</script>

<style lang="scss">
  .common-table-header {
    margin: 0 0 25px;
  }
  .el-main {
    height: 100%;
    .scan-main {
      height: calc(100% - 60px);
      display: flex;
      flex-direction: column;
      .common-header{
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
        .scan-page {
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
