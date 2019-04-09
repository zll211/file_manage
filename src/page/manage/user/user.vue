<template>
  <div class="main-container">
    <div class="common-header">
      <hzzt-title>用户管理</hzzt-title>
      <div class="common-header-end flex align-items-center">
        <!--<el-input style="margin-right: 22px" v-model="keyword" size="small" clearable
                  placeholder="请输入用户名称"
                  suffix-icon="el-icon-search"></el-input>-->
        <el-button type="primary" size="small" @click="addUser">新增用户</el-button>
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
        <el-table-column prop="username"
                         label="用户名"
                         min-width="120"
                         align="center">
        </el-table-column>
        <el-table-column prop="nickname"
                         label="姓名"
                         min-width="120"
                         align="center">
        </el-table-column>
        <el-table-column prop="role"
                         label="角色"
                         min-width="120"
                         align="center">
          <template slot-scope="scope">
            <el-tag v-for="role in scope.row.role" :key="role.id" style="margin: 0 5px">{{role.role_name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="mobile"
                         label="手机号"
                         min-width="120"
                         align="center">
        </el-table-column>
        <el-table-column prop="email"
                         label="邮箱"
                         min-width="120"
                         align="center">
        </el-table-column>
        <el-table-column prop="operate" align="center" label="操作" fixed="right" min-width="120">
          <template slot-scope="scope">
            <div class="flex align-items-center justify-content-center wrap">
              <el-button type="primary" size="small" @click="editUser(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteUser(scope.row.id)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="用户信息" :visible.sync="dialogUser" center width="40%">
      <el-form
        size="small" :model="userForm" label-width="80px" label-position="left"
        class="edit-user-form" ref="userForm" :rules="userRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" auto-complete="off" placeholder="用以登录系统"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="nickname">
          <el-input v-model="userForm.nickname" auto-complete="off" placeholder="请输入您的姓名"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="userForm.roleIds" multiple placeholder="请选择角色"
                     style="width: 100%">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.role_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="userForm.password" auto-complete="new-password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="newpassword">
          <el-input type="password" v-model="userForm.newpassword" auto-complete="new-password"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="userForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="saveUser">保 存
        </el-button>
        <el-button size="small" @click="cancelUser">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import hzztTitle from '@/components/hzztTitle';
  import {userService} from "./user.service";
  import {roleService} from "../role/role.service";

  export default {
    created() {
      this.userList();
      this.roleList();
    },
    components: {
      hzztTitle,
    },
    data() {
      return {
        data: [],
        dialogUser: false,
        keyword: '',
        loading: false,
        roles: [],
        tableHeight: undefined,
        userForm: {},
        userRules: {
          username: [
            {required: true, message: '请输入用户名称', trigger: 'blur'},
          ],
          nickname: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
          ],
          newpassword: [{required: true, message: '请输入密码', trigger: 'blur'}, {
            validator: this.valPwd, trigger: 'blur',
          }],
          roleIds: [
            {required: true, message: '请选择角色', trigger: 'change'},
          ],
        },
      }
    },
    methods: {
      addUser() {
        this.dialogUser = true;
        this.$refs?.['userForm']?.resetFields();
        this.userForm = {
          roleIds: [],
        };
      },
      cancelUser() {

      },
      deleteUser(id) {
        userService.delUser(id)
          .then(({body}) => {
            this.$message.success('删除成功');
            this.userList();
          })
      },
      editUser(user) {
        this.dialogUser = true;
        this.$refs?.['userForm']?.resetFields();
        let _form = Object.assign({}, user);
        _form.roleIds = user.role.map((item) => item.id);
        _form.password = encodeURIComponent('//:,;');
        _form.newpassword = encodeURIComponent('//:,;');
        this.userForm = _form;
      },
      handleClick() {

      },
      roleList() {
        roleService.roleList()
          .then(({body}) => {
            if (body?.ret_code === 0) {
              this.roles = body.data;
            }
          })
      },
      saveUser() {
        let params = {
          id: this.userForm?.id,
          username: this.userForm.username,
          nickname: this.userForm.nickname,
          password: this.userForm.password === encodeURIComponent('//:,;') ? undefined : this.userForm.password,
          email: this.userForm.email,
          mobile: this.userForm.mobile,
          role: this.userForm.roleIds,
        };
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            if (this.userForm.id) {
              userService.saveUser(params)
                .then(({body}) => {
                  if (body?.ret_code === 0) {
                    this.$message.success('修改用户信息成功');
                    this.userList();
                    this.dialogUser = false;
                  } else {
                    this.$message.error(body?.ret_msg || '修改用户信息失败');
                  }
                }).catch(() => {
                this.$message.error('修改用户信息失败');
              });
            } else {
              this.$refs['userForm'].validate((valid) => {
                if (valid) {
                  userService.addUser(params)
                    .then(({body}) => {
                      if (body?.ret_code === 0) {
                        this.$message.success('新增用户成功');
                        this.userList();
                        this.dialogUser = false;
                      } else {
                        this.$message.error(body?.ret_msg || '新增用户失败');
                      }
                    }).catch(() => {
                    this.$message.error('新增用户失败');
                  });
                }
              });
            }
          }
        });
      },
      userList() {
        this.loading = true;
        userService.userList()
          .then(({body}) => {
            if (body?.ret_code === 0) {
              this.data = body.data.list;
            }
          }).finally(() => {
          this.loading = false;
        })
      },
      valPwd(rule, value, callback) {
        if (!value) {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.userForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  .common-table-header {
    margin: 0 0 25px;
  }
</style>
