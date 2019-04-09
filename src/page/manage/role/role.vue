<template>
  <div class="main-container role-main">
    <div class="common-header">
      <hzzt-title>角色管理</hzzt-title>
      <el-button type="primary" size="small" @click="addRole">新增角色</el-button>
    </div>
    <div class="flex">
      <div class="flex-2" style="margin-right: 24px">
        <el-row class="tree-page">
          <div class="flex"><!--
            <el-button type="primary" icon="el-icon-plus" size="small" @click="addCate">添加</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteCate">删除</el-button>-->
            <!--<el-input
              size="small"
              class="filter-text"
              placeholder="输入关键字进行过滤"
              v-model="keyword">
            </el-input>-->
          </div>
          <el-table
            ref="pTable"
            v-loading="loading"
            :data="roles"
            @row-click="rowClick"
            border>
            <el-table-column prop="role_name" align="center" label="角色名"></el-table-column>
            <el-table-column prop="operate" align="center" label="操作">
              <template slot-scope="scope">
                <el-button size="small" type="primary" @click="editRole(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteRole(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </div>
      <div class="flex-3">
        <el-row class="tree-page" v-if="roleRightForm.id">
          <el-form
            size="small" label-position="left" label-width="80px" :model="roleRightForm"
            ref="classifyForm">
            <el-form-item label="角色名称">
              <el-input v-model="roleRightForm.role_name" disabled></el-input>
            </el-form-item>
            <el-form-item label="所属分类">
              <el-tree
                class="filter-tree"
                :data="roleRightForm.cates"
                node-key="id"
                :props="classifyProps"
                :default-expand-all="true"
                ref="tree">
              </el-tree>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="editRole(roleRightForm)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteRole(roleRightForm.id)">删除</el-button>
            </el-form-item>
          </el-form>
        </el-row>
      </div>
    </div>
    <el-dialog title="新增角色" :visible.sync="dialogRole" center width="500px">
      <el-form
        size="small" :model="roleForm" label-width="80px" label-position="left"
        class="role-form" ref="roleForm" :rules="roleRules">
        <el-row :gutter="20">
          <el-col>
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="roleForm.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="所属类别">
              <el-tree
                v-if="dialogRole"
                class="filter-tree"
                :data="classifies"
                :props="classifyProps"
                node-key="id"
                show-checkbox
                :default-checked-keys="defaultCheckedKeys"
                :default-expand-all="true"
                :check-on-click-node="true"
                :expand-on-click-node="false"
                ref="tree">
              </el-tree>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveRole" size="small">保 存
        </el-button>
        <el-button @click="cancelRole" size="small">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import hzztTitle from '@/components/hzztTitle';
  import {roleService} from "./role.service";
  import {classifyService} from '../system/classify/classify.service';

  export default {
    async created() {
      await this.cateList();
      this.roleList();
    },
    components: {
      hzztTitle,
    },
    data() {
      return {
        defaultCheckedKeys: [],
        dialogRole: false,
        classifies: [],
        classifyProps: {
          value: 'id',
          label: 'label',
        },
        keyword: '',
        loading: false,
        roleRightForm: {},
        roleForm: {},
        roleRules: {
          name: [
            {required: true, message: '请输入用户名称', trigger: 'blur'},
          ]
        },
        roles: [],
      }
    },
    methods: {
      addRole() {
        this.$refs?.roleForm?.resetFields();
        this.roleForm = {};
        this.defaultCheckedKeys = [];
        this.dialogRole = true;
      },
      cancelRole() {
        this.$refs?.roleForm?.resetFields();
        this.roleForm = {};
        this.dialogRole = false;
      },
      cateList() {
        return classifyService.cateList()
          .then(({body}) => {
            if (body?.ret_code === 0) {
              this.classifies = body.data;
            }
          })
      },
      deleteRole(id) {
        roleService.delRole(id)
          .then(({body}) => {
            if (body?.ret_code === 0) {
              this.$message.success('删除成功');
              this.roleList();
            } else {
              this.$message.error(body?.ret_msg || '删除失败');
            }
          })
      },
      editRole(role) {
        this.$refs?.roleForm?.resetFields();
        this.dialogRole = true;
        this.roleForm = {
          name: role.role_name,
          id: role.id,
        };
        this.defaultCheckedKeys = this.handleCates(role.cates);
      },
      handleCates(cates, ids = []) {
        cates.forEach((cate) => {
          if (cate.children) {
            this.handleCates(cate.children, ids);
          } else {
            ids.push(cate.id);
          }
        });
        return ids;
      },
      handleClick() {

      },
      roleList() {
        this.loading = true;
        roleService.roleList()
          .then(({body}) => {
            if (body?.ret_code === 0) {
              this.roles = body.data;
              if (this.roleRightForm?.id) {
                this.roleRightForm = this.roles.find((role) => role.id === this.roleRightForm.id);
              } else {
                this.roleRightForm = {...(this.roles?.[0] || {})};
              }
              if (!this.roleRightForm) {
                this.roleRightForm = {...(this.roles?.[0] || {})};
              }
            }
          }).finally(() => {
          this.loading = false;
        })
      },
      rowClick(row, event, column) {
        this.roleRightForm = {...row};
      },
      saveRole() {
        let ids = [...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree.getHalfCheckedKeys()];
        if (this.roleForm.id) {
          roleService.saveRole({role_name: this.roleForm.name, cates: ids, id: this.roleForm.id})
            .then(({body}) => {
              if (body?.ret_code === 0) {
                this.cancelRole();
                this.roleList();
              } else {
                this.$message.error(body?.ret_msg || '修改失败');
              }
            })
        } else {
          roleService.addRole({role_name: this.roleForm.name, cates: ids})
            .then(({body}) => {
              if (body?.ret_code === 0) {
                this.cancelRole();
                this.roleList();
              } else {
                this.$message.error(body?.ret_msg || '新增失败');
              }
            })
        }
      },
    }
  }
</script>

<style lang="scss">
  @import "../../../style/variables";

  .role-main {
    .common-table-header {
      margin: 0 0 25px;
    }
    .tree-page {
      margin: 19px 0 0;
      padding: 28px;
      background-color: #fff;
      .filter-text {
        width: 200px;
        margin: 0 0 0 10px;
      }
    }
    .filter-tree {
      background-color: #fff;
      color: $_pm-default-color;
      font-size: 14px;
      height: 400px;
    }
    .role-form {
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
</style>
