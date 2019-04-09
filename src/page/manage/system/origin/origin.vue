<template>
  <div class="main-container origin-main">
    <div class="common-header">
      <hzzt-title>来源管理</hzzt-title>
      <div class="common-header-end flex align-items-center">
        <!--<el-input style="margin-right: 22px" v-model="keyword" size="small" clearable
                  placeholder="请输入来源名称"
                  suffix-icon="el-icon-search"
                  @keyup.enter.native="originList()"
                  @clear="originList()"></el-input>-->
        <el-button type="primary" size="small" @click="exportExcel">导出医院数据</el-button>
        <el-button type="primary" size="small" @click="addOrigin">新增</el-button>
      </div>
    </div>
    <div class="common-table">
      <div class="origin-table">
        <el-table
          ref="pTable"
          v-loading="loading"
          :data="data"
          border
          :height="tableHeight"
          style="width: 100%">
          <el-table-column prop="hospital" label="来源名称" align="center"></el-table-column>
          <el-table-column prop="operate" align="center" label="操作" >
            <template slot-scope="scope">
              <div class="flex align-items-center justify-content-center wrap">
                <el-button type="danger" size="small" @click="deleteOrigin(scope.row.id)">删除</el-button>
                <el-button type="primary" size="small" @click="editOrigin(scope.row)">编辑</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="origin-dialog">
      <el-dialog :title="dialogTitle" :visible.sync="dialogOriginVisible" center>
        <el-form :model="originForm" label-width="100px" ref="originForm" :rules="originRules">
          <el-form-item label="来源名称" prop="hospital">
            <el-input v-model="originForm.hospital" auto-complete="off" placeholder="请输入来源名称"></el-input>
          </el-form-item>
          <!--<el-form-item label="来源地址">
            <div style="margin-bottom: 10px" v-for="(path, index) in originForm.path" :key="index">
              <el-input v-model="originForm.path[index]" placeholder="请输入分类路径"></el-input>
              &lt;!&ndash;<el-button type="danger" icon="el-icon-delete" size="small" @click="deletePath(index)"></el-button>&ndash;&gt;
            </div>
            &lt;!&ndash;<el-button type="primary" icon="el-icon-plus" size="small" @click="addPath">新增路径</el-button>&ndash;&gt;
          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveOrigin">保存</el-button>
          <el-button @click="dialogOriginVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>

  import hzztTitle from '@/components/hzztTitle';
  import {originService} from "./origin.service";
  import {baseUrl} from '@/config/utils';
  import HzztIcon from "../../../../components/hzztIcon";

  export default {
    created() {
      this.originList();
    },
    components: {
      HzztIcon,
      hzztTitle,
    },
    data() {
      return {
        data: [],
        dialogOriginVisible: false,
        dialogTitle: '新增来源',
        keyword: '',
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        originForm: {},
        originRules: {
          hospital: [{required: true, message: '请输入来源名称', trigger: 'blur'}],
        },
        tableHeight: undefined,
        total: 10
      }
    },
    methods: {
      addOrigin() {
        this.dialogOriginVisible = true;
        this.dialogTitle = '新增来源';
        if (this.$refs['originForm']) {
          this.$refs['originForm'].resetFields()
        }
        this.originForm = {
          hospital: '',
        }
      },
      editOrigin(row) {
        this.dialogOriginVisible = true;
        this.dialogTitle = '编辑来源';
        this.originForm = {
          hospital: row.hospital,
          id: row.id,
        };
      },
      exportExcel() {
        originService.exportData()
          .then(({body}) => {
            let anchor = document.createElement('a');
            anchor.setAttribute('href', body.path);
            anchor.click();
          }).catch((error) => {
          this.$message.error('导出失败');
        })
      },
      saveOrigin() {
        this.$refs['originForm'].validate((valid) => {
          if (valid) {
            if (this.originForm.id) {//编辑操作
              originService.saveOrigin(this.originForm.id, {
                hospital: this.originForm.hospital,
              }).then(({body}) => {
                if (body?.ret_code === 0) {
                  this.$message.success(body.ret_msg);
                  this.dialogOriginVisible = false;
                  this.originList();
                } else {
                  this.$message.error(body?.ret_msg || '编辑失败');
                }
              }).catch(() => {
                this.$message.error('编辑失败');
              });
            }
            else {//新增操作
              originService.addOrigin(this.originForm)
                .then(({body}) => {
                  if (body?.ret_code === 0) {
                    this.dialogOriginVisible = false;
                    this.originList();
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
      originList() {
        this.loading = true;
        originService.originList()
          .then(({body}) => {
            if (body?.ret_code === 0) {
              this.data = body.data;
            }
          }).finally(() => {
          this.loading = false;
        })
      },
      deleteOrigin(id) {
        originService.delOrigin(id)
          .then(({body}) => {
            this.$message.success('删除成功');
            this.originList();
          }).catch(() => {
          this.$message.error('删除失败');
        });
      },
      addPath() {
        if (this.originForm?.path && Array.isArray(this.originForm?.path)) {
          this.originForm.path.push('');
        } else {
          this.originForm.path = [''];
        }
      },
      deletePath(index) {
        this.originForm.path.splice(index, 1);
      },
    }
  }
</script>

<style lang="scss">
  .common-table-header {
    margin: 0 0 25px;
  }

  .origin-dialog {
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
    .origin-main {
      height: calc(100% - 60px);
      display: flex;
      flex-direction: column;
      .common-table {
        position: relative;
        padding-bottom: 60px !important;
        flex: 1;
        .origin-table {
          height: 100%;
          .el-table__fixed-right-patch {
            background-color: #EBEEF6;
          }
        }
      }
    }
  }
</style>
