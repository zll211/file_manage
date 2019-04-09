<template>
  <div class="main-container scan-main">
    <div class="common-header">
      <hzzt-title>扫描仪管理</hzzt-title>
      <div class="common-header-end flex align-items-center">
        <el-input style="margin-right: 22px" v-model="keyword" size="small" clearable
                  placeholder="请输入扫描名称"
                  suffix-icon="el-icon-search"
                  @keyup.enter.native="scanList()"
                  @clear="scanList()"></el-input>
        <el-button type="primary" size="small" @click="addScan">新增</el-button>
      </div>
    </div>
    <div class="common-table">
      <div class="common-table-header flex justify-content-between align-items-center" style="width: 100%;margin-bottom: 25px">
        <el-tabs v-model="activeTabName" @tab-click="handleClick">
          <el-tab-pane label="扫描仪配置" name="扫描仪配置"></el-tab-pane>
          <el-tab-pane label="扫描仪日志配置" name="扫描仪日志配置"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="scan-table">
        <el-table
          v-if="activeTabName==='扫描仪配置'"
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

          <el-table-column prop="operate" align="center" label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <div class="flex align-items-center justify-content-center wrap">
                <el-button type="danger" size="small" @click="deleteScan(scope.row.id)">删除</el-button>
                <el-button type="primary" size="small" @click="editScan(scope.row)">编辑</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-form class="scan-log-form" size="small" :model="scanLogForm" :rules="scanLogRules"
                 ref="scanLogForm" label-width="100px" v-if="activeTabName==='扫描仪日志配置'">
          <el-form-item label="ip" prop="ip">
            <el-input v-model="scanLogForm.ip"></el-input>
          </el-form-item>
          <el-form-item label="port" prop="port">
            <el-input v-model="scanLogForm.port"></el-input>
          </el-form-item>
          <el-form-item label="queue" prop="queue">
            <el-input v-model="scanLogForm.queue"></el-input>
          </el-form-item>
          <el-form-item label="exchange" prop="exchange">
            <el-input v-model="scanLogForm.exchange"></el-input>
          </el-form-item>
          <el-form-item label="username" prop="username">
            <el-input v-model="scanLogForm.username"></el-input>
          </el-form-item>
          <el-form-item label="password" prop="password">
            <el-input v-model="scanLogForm.password"></el-input>
          </el-form-item>
          <el-form-item class="flex justify-content-center">
            <el-button type="primary" @click="saveScanLog">保存</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="scan-page" v-if="activeTabName==='扫描仪配置'">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="pageIndex"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <div class="scan-dialog">
      <el-dialog :title="dialogTitle" :visible.sync="dialogScanVisible" center>
        <el-form :model="scanForm" label-width="110px" ref="scanForm" :rules="scanRules">
          <el-form-item label="扫描仪名称" prop="name">
            <el-input v-model="scanForm.name" auto-complete="off" placeholder="请输入扫描仪名称"></el-input>
          </el-form-item>
          <el-form-item label="ip地址" prop="ip">
            <el-input v-model="scanForm.ip" auto-complete="off" placeholder="请输入ip地址"></el-input>
          </el-form-item>
          <el-form-item label="扫描仪型号" prop="version">
            <el-input v-model="scanForm.version" auto-complete="off" placeholder="请输入扫描仪型号"></el-input>
          </el-form-item>
          <el-form-item label="扫描仪负责人" prop="liable_user">
            <el-input v-model="scanForm.liable_user" auto-complete="off" placeholder="请输入扫描仪负责人"></el-input>
          </el-form-item>
          <el-form-item label="来源" prop="source_id">
            <el-select v-model="scanForm.source_id" placeholder="请选择扫描仪来源">
              <el-option
                v-for="item in origins"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" v-show="showStatus">
            <el-switch
              v-model="scanForm.status"
              inactive-color="#ff4949"
              active-value="在用"
              inactive-value="闲置"
              active-text="在用"
              inactive-text="闲置">
            </el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveScan">保存</el-button>
          <el-button @click="dialogScanVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>

  import hzztTitle from '@/components/hzztTitle';
  import {scanService} from "./scan.service";
  import {baseUrl} from '@/config/utils';
  import HzztIcon from "../../../../components/hzztIcon";
  import {originService} from "../origin/origin.service";

  export default {
    created() {
      this.scanList();
      this.originList();
    },
    components: {
      HzztIcon,
      hzztTitle,
    },
    data() {
      return {
        activeTabName: '扫描仪配置',
        data: [],
        dialogScanVisible: false,
        dialogTitle: '新增扫描仪',
        headers: [{
          'prop': 'name',
          'label': '扫描仪名称',
          'align': 'center',
        }, {
          'prop': 'ip',
          'label': 'ip地址',
          'align': 'center',
        }, {
          'prop': 'version',
          'label': '设备id',
          'align': 'center',
        }, {
          'prop': 'source',
          'label': '来源',
          'align': 'center',
        }, {
          'prop': 'liable_user',
          'label': '负责人',
          'align': 'center',
        }, {
          'prop': 'status',
          'label': '状态',
          'align': 'center',
        }],
        keyword: '',
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        scanForm: {},
        scanLogForm: {},
        scanLogRules: {
          ip: [{required: true, message: '请输入RabbitMQ的ip', trigger: 'blur'}],
          port: [{required: true, message: '请输入RabbitMQ的port', trigger: 'blur'}],
          exchange: [{required: true, message: '请输入RabbitMQ的exchange', trigger: 'blur'}],
          queue: [{required: true, message: '请输入RabbitMQ的queue', trigger: 'blur'}],
          username: [{required: true, message: '请输入RabbitMQ的username', trigger: 'blur'}],
          password: [{required: true, message: '请输入RabbitMQ的password', trigger: 'blur'}],
        },
        scanRules: {
          name: [{required: true, message: '请输入扫描仪名称', trigger: 'blur'}],
          ip: [{required: true, message: '请输入ip地址', trigger: 'blur'}],
          version: [{required: true, message: '请输入扫描仪型号', trigger: 'blur'}],
          source_id: [{required: true, message: '请选择扫描仪来源', trigger: 'change'}],
          liable_user: [{required: true, message: '请输入扫描仪负责人', trigger: 'blur'}],
        },
        showStatus: true,
        tableHeight: undefined,
        total: 10,
        origins: [],
      }
    },
    methods: {
      addScan() {
        this.dialogScanVisible = true;
        this.dialogTitle = '新增扫描仪';
        this.showStatus = false;
        if (this.$refs['scanForm']) {
          this.$refs['scanForm'].resetFields()
        }
        this.scanForm = {
          name: '',
          ip: '',
          version: ''
        }
      },
      handleClick(tab) {
        if (tab.name === '扫描仪配置') {
          this.scanList();
        }
        if (tab.name === '扫描仪日志配置') {
          this.getScanLog();
        }
      },
      editScan(row) {
        this.dialogScanVisible = true;
        this.dialogTitle = '编辑扫描仪';
        this.showStatus = true;
        this.scanForm = {
          name: row.name,
          id: row.id,
          ip: row.ip,
          version: row.version,
          status: row.status,
          liable_user: row.liable_user,
          source_id: this.origins.find((item) => item.label === row.source)?.value,
        };
      },
      saveScan() {
        this.$refs['scanForm'].validate((valid) => {
          if (valid) {
            if (this.scanForm.id) {//编辑操作
              scanService.saveScan({
                name: this.scanForm.name,
                id: this.scanForm.id,
                ip: this.scanForm.ip,
                version: this.scanForm.version,
                status: this.scanForm.status === '闲置' ? 0 : 1,
                source_id: this.scanForm.source_id,
                liable_user: this.scanForm.liable_user,
              }).then(({body}) => {
                if (body?.ret_code === 0) {
                  this.$message.success(body.ret_msg);
                  this.dialogScanVisible = false;
                  this.scanList();
                } else {
                  this.$message.error(body?.ret_msg || '编辑失败');
                }
              }).catch(() => {
                this.$message.error('编辑失败');
              });
            }
            else {//新增操作
              scanService.addScan({
                name: this.scanForm.name,
                ip: this.scanForm.ip,
                version: this.scanForm.version,
                source_id: this.scanForm.source_id,
                liable_user: this.scanForm.liable_user,
              }).then(({body}) => {
                if (body?.ret_code === 0) {
                  this.$message.success(body.ret_msg);
                  this.dialogScanVisible = false;
                  this.scanList();
                } else {
                  this.$message.error(body?.ret_msg || '新增失败');
                }
              }).catch(() => {
                this.$message.error('新增失败');
              });
            }
          }
        })
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.scanList();
      },
      scanList() {
        let params = {
          page: this.pageIndex,
          page_size: this.pageSize,
          name: this.keyword
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
      deleteScan(id) {
        scanService.delScan(id)
          .then(({body}) => {
            if (body?.ret_code === 0) {
              this.$message.success('删除成功');
              this.scanList();
            } else {
              this.$message.error(body?.ret_msg || '删除失败');
            }
          }).catch(() => {
          this.$message.error('新增失败');
        });
      },
      originList() {
        originService.originList()
          .then(({body}) => {
            if (body?.ret_code === 0) {
              this.origins = body.data.map((item) => ({
                label: item.hospital,
                value: item.id,
              }));
            }
          })
      },
      getScanLog() {
        scanService.getScanLog()
          .then(({body}) => {
            if (body?.ret_code === 0) {
              this.scanLogForm = body?.data || {};
            }
          })
      },
      saveScanLog() {
        this.$refs['scanLogForm'].validate((valid) => {
          if (valid) {
            scanService.saveScanLog(this.scanLogForm)
              .then(({body}) => {
                if (body?.ret_code === 0) {
                  this.$message.success('保存成功');
                } else {
                  this.$message.error(body?.ret_msg || '保存失败');
                }
              }).catch(() => {
              this.$message.error('保存失败');
            })
          } else {
            return false;
          }
        });
      }
    }
  }
</script>

<style lang="scss">

  .scan-dialog {
    .el-dialog--center {
      max-width: 526px;
      /*max-height: 362px;*/
      .el-dialog__body {
        padding: 25px 65px 30px;
        .el-input {
          width: 83%;
          .el-input__inner {
            height: 31px;
          }
        }
      }
    }
    .el-dialog__footer {
      .el-button {
        padding: 9px 20px;
      }
    }
  }

  .el-main {
    height: 100%;
    .scan-main {
      height: calc(100% - 60px);
      display: flex;
      flex-direction: column;
      .common-table {
        position: relative;
        padding-bottom: 60px !important;
        flex: 1;
        .scan-table {
          height: 100%;
          .el-table__fixed-right-patch {
            background-color: #EBEEF6;
          }
          .scan-log-form {
            width: 500px;
            margin: 0 auto;
          }
        }
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
