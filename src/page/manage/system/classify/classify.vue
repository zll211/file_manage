<template>
  <div class="classify-main main-container">
    <div class="common-header">
      <hzzt-title>分类管理</hzzt-title>
    </div>
    <!--<el-tabs v-model="type" type="card" @tab-click="handleClick">
      <el-tab-pane label="组织学分类" name="组织学">
      </el-tab-pane>
      <el-tab-pane label="细胞学分类" name="细胞学">
      </el-tab-pane>
    </el-tabs>-->
    <div class="flex">
      <div class="flex-1" style="margin-right: 24px">
        <el-row class="tree-page">
          <div class="flex">
            <el-button type="primary" icon="el-icon-plus" size="small" @click="addCate">添加</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteCate">删除</el-button>
            <el-input
              size="small"
              class="filter-text"
              placeholder="输入关键字进行过滤"
              v-model="filterText">
            </el-input>
          </div>
          <el-tree
            v-loading="loading"
            class="filter-tree"
            :data="classifies"
            node-key="id"
            :check-strictly="true"
            :default-expanded-keys="defaultExpandedKeys"
            :highlight-current="true"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            ref="tree">
          </el-tree>
        </el-row>
      </div>
      <div class="flex-1">
        <el-row class="tree-page">
          <el-form
            size="small" label-position="top" label-width="80px" :model="classifyForm" :rules="classifyRules"
            ref="classifyForm">
            <el-form-item label="分类名称" prop="label">
              <el-input v-model="classifyForm.label" placeholder="请输入分类名称"></el-input>
            </el-form-item>
            <el-form-item label="上级分类" prop="ids">
              <el-cascader
                v-model="classifyForm.ids"
                placeholder="请选择上级分类"
                :props="classifyProps"
                :options="selectClassifies"
                filterable
                clearable
                change-on-select
              ></el-cascader>
            </el-form-item>
            <el-form-item label="路径">
              <div style="margin-bottom: 10px" v-for="(classify, index) in classifyForm.path" :key="index">
                <el-input @click.native="cascaderClick(index, classify.path, $event)"
                          @input="cascaderInput(classify.path)"
                          class="classify-path-input"
                          v-model="classify.path"
                          placeholder="请输入分类路径"></el-input>
                <el-select
                  v-model="classifyPath"
                  ref="classifyPath"
                  filterable
                  allow-create
                  default-first-option
                  multiple
                  :multiple-limit="1"
                  remote
                  :remote-method="getFileDir"
                  :loading="classifyLoading"
                  @change="handleItemChange(index, $event)"
                  placeholder="请输入分类路径">
                  <el-option
                    v-for="item in pathList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <!--<el-cascader
                  class="classify-path"
                  ref="classifyPath"
                  expand-trigger="click"
                  v-model="classifyPath"
                  :options="pathList"
                  @change="handleItemChange(index, $event)"
                  :change-on-select="true"
                ></el-cascader>-->
                <el-select
                  class="source-list"
                  v-model="classify.source"
                  ref="originName"
                  filterable
                  clearable
                  placeholder="请选择来源">
                  <el-option
                    v-for="item in origins"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select>
                <el-button type="danger" icon="el-icon-delete" size="small" @click="deletePath(index)"></el-button>
              </div>
              <el-button type="primary" icon="el-icon-plus" size="small" @click="addPath">新增路径</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="confirmCate">确定</el-button>
              <el-button v-show="classifyForm.id" type="danger" @click="deleteCate">删除</el-button>
            </el-form-item>
          </el-form>
        </el-row>
      </div>
    </div>

  </div>
</template>

<script>

  import hzztTitle from '@/components/hzztTitle';
  import {classifyService} from "./classify.service";
  import {originService} from "../origin/origin.service";
  import HzztIcon from "../../../../components/hzztIcon";

  function filterRepeatItem(list, id) {
    const array = list.filter((item) => item.id !== id).map((item) => ({...item}));
    if (array.length === list.length) {
      array.forEach((item) => {
        if (item?.children?.length > 0) {
          item.children = filterRepeatItem(item.children, id);
        }
      });
    }
    return array;
  }

  export default {
    components: {
      HzztIcon,
      hzztTitle,
    },
    created() {
      this.cateList();
      this.originList();
      // this.getFileDir('/');
    },
    data() {
      return {
        classifies: [],
        classifyForm: {path: [{path: ''}]},
        classifyLoading: false,
        classifyPath: [],
        classifyProps: {
          value: 'id',
          label: 'label',
        },
        classifyRules: {
          label: [
            {required: true, message: '请输入分类名称', trigger: 'blur'},
          ]
        },
        defaultExpandedKeys: [],
        filterText: '',
        pathList: [],
        loading: false,
        origins: [],
        originId: undefined,
        cate_id: undefined,
        /*type: '组织学',*/
      }
    },
    computed: {
      selectClassifies() {
        return filterRepeatItem(this.classifies, this.classifyForm?.id);
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      handleClick(tab) {
        this.defaultExpandedKeys = [];
        this.cateList();
      },
      handleItemChange(index, val) {
        this.classifyForm.path[index].path = val[0];
        this.getFileDir(val[0]);
        this.classifyPath = [];
      },
      cascaderClick(index, val, e) {
        this.$refs.classifyPath[index].focus();
        setTimeout(() => {
          e.target.focus();
        });
        this.classifyPath = [];
        this.pathList = [];
        this.getFileDir(val);
      },
      cascaderInput(val) {
        this.delayedTrigger(() => this.getFileDir(val));
      },
      delayedTrigger(callback) {
        if (this.clearTimeId) clearTimeout(this.clearTimeId);
        this.clearTimeId = setTimeout(callback, 1000);
      },
      // 级联选择切换事件
      getFileDir(val) {
        this.classifyLoading = true;
        classifyService.getFileDir({dir: val})
          .then(({body}) => {
            if (body?.ret_code === 0) {
              this.pathList = body.data.map((item) => ({
                value: item,
                label: item,
              }))
            } else {
              this.pathList = [];
            }
          }).finally(() => {
          this.classifyLoading = false;
        })
      },
      addCate() {
        this.$refs?.classifyForm?.resetFields();
        this.classifyForm = {path: [{path: ''}]};
      },
      addPath() {
        if (this.classifyForm?.path && Array.isArray(this.classifyForm?.path)) {
          this.classifyForm.path.push({path: ''});
        } else {
          this.$set(this.classifyForm, 'path', [{path: ''}]);
        }
      },
      deletePath(index) {
        this.classifyForm.path.splice(index, 1);
      },
      originList() {
        originService.originList()
          .then(({body}) => {
            if (body?.ret_code === 0) {
              this.origins = body.data.map((item) => ({
                value: item.id,
                label: item.hospital
              }));
            }
          }).finally(() => {
        })
      },
      cateList() {
        this.loading = true;
        classifyService.cateList()
          .then(({body}) => {
            if (body?.ret_code === 0) {
              this.classifies = body.data;
              this.classifyForm = {path: [{path: ''}], ...this.classifies[0]};
              this.defaultExpandedKeys =
                this.defaultExpandedKeys.length > 0 ? this.defaultExpandedKeys : [this.classifyForm.id];
            }
          }).finally(() => {
          this.loading = false;
        })
      },
      cateTwoList() {
        this.loading = true;
        classifyService.cateList()
          .then(({body}) => {
            if (body?.ret_code === 0) {
              this.classifies = body.data;
              this.defaultExpandedKeys =
                this.defaultExpandedKeys.length > 0 ? this.defaultExpandedKeys : [this.classifyForm.id];
              this.$nextTick(() => {
                this.$refs.tree.setCurrentKey(this.classifyForm.id);
              });
            }
          }).finally(() => {
          this.loading = false;
        })
      },
      confirmCate() {
        const params = {
          cate_name: this.classifyForm.label,
          parent_id: this.classifyForm?.ids?.[(this.classifyForm?.ids?.length - 1) || 0],
          path: this.classifyForm?.path?.length ? this.classifyForm.path.map((item) => ({
            path: item.path,
            source_id: this.origins.find((origin) => origin.label===item.source)?.value || 0,
          })) : [],
        };
        if (this.classifyForm.id) {
          // this.defaultExpandedKeys = this.$ref.tree.get
          classifyService.saveCate(this.classifyForm.id, params)
            .then(({body}) => {
              if (body?.ret_code === 0) {
                this.cateTwoList();
                this.$message.success('编辑成功');
              } else {
                this.$message.error(body?.ret_msg || '编辑失败');
              }
            }).catch(() => {
            this.$message.error('编辑失败');
          })
        } else {
          classifyService.addCate(params)
            .then(({body}) => {
              if (body?.ret_code === 0) {
                this.cateList();
              } else {
                this.$message.error(body?.ret_msg || '新增失败');
              }
            }).catch(() => {
            this.$message.error('新增失败');
          })
        }
      },
      deleteCate() {
        if (!this.classifyForm.id) {
          this.$message.warning('请选择删除的分类节点');
          return;
        }
        classifyService.delCate(this.classifyForm.id)
          .then(({body}) => {
            if (body?.ret_code === 0) {
              this.$message.success('删除成功');
              this.cateList();
            } else {
              this.$message.error(body?.ret_msg || '删除成功');
            }
          }).catch(() => {
          this.$message.error('删除失败');
        });
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      handleNodeClick(item, node) {
        const index = this.defaultExpandedKeys.findIndex((id) => id === item.id);
        if (!~index) {
          this.defaultExpandedKeys.push(item.id)
        } else {
          this.defaultExpandedKeys.splice(index, 1);
        }
        let _form = JSON.parse(JSON.stringify(item));
        _form.ids = [];
        let parent = node.parent;
        while (parent) {
          if (parent.data.id) {
            _form.ids.unshift(parent.data.id);
          }
          parent = parent.parent;
        }
        this.defaultExpandedKeys = [..._form.ids];
        this.$refs?.classifyForm?.resetFields();

        this.classifyForm = _form;
      },
    },
  }
</script>

<style lang="scss">
  @import "../../../../style/variables";

  .classify-main {
    .common-table-header {
      margin: 0 0 25px;
    }
    .el-tabs--card > .el-tabs__header {
      border: none;
    }
    .el-tabs__nav {
      border: none !important;
      .el-tabs__item {
        border: none !important;
        color: $_pm-default-table-color;
        &:hover {
          color: $_pm-base-color;
        }
        &.is-active {
          background: $_pm-base-color;
          border-radius: 18px;
          color: #fff;
          height: 36px;
          line-height: 36px;
        }
      }
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
      .el-tree-node__content {
        height: 46px;
      }
    }

    .el-input {
      width: 300px;
    }
    .classify-path-input {
      position: absolute;
      width: 300px;
      z-index: 2;
      // height: 30px;
      // border: 1px solid #ddd;
      // border-radius: 4px;
      // padding: 0 15px;
      // color: #606266;
    }
    .source-list{
      width: 200px;
      .el-input{
        width: 200px;
      }
    }
  }

  /*.el-cascader-menu {
    min-width: 50px;
    // max-width: 160px;
    .el-cascader-menu__item {
      padding: 8px 20px 8px 10px;
      &:after {
        right: 5px;
      }
    }
  }*/

</style>
