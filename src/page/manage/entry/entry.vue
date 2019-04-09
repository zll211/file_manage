<template>
  <div class="main-container entry-main">
    <!--<div class="common-header">
      <hzzt-title>数据录入</hzzt-title>
      <div class="common-header-end flex align-items-center">
      </div>
    </div>-->
    <div class="common-table" style="padding: 5px 25px;margin-top: 0">
      <div class="common-table-header flex justify-content-between align-items-center"
           style="width: 100%;">
        <el-tabs v-model="activeTabName" @tab-click="handleClick">
          <el-tab-pane v-for="tab in tabList" :key="tab.name" :label="tab.label"
                       :name="tab.name">
          </el-tab-pane>
        </el-tabs>
        <div class="flex" v-if="activeTabName === '待关联'">
          <el-input style="margin-right: 12px" v-model="keyword" size="small" clearable
                    placeholder="请输入切片名称"
                    suffix-icon="el-icon-search" v-on:keyup.enter.native="getSliceList()"></el-input>
          <el-button type="primary" size="small" @click="autoScan" :disabled="isShowScanProgress">自动扫描</el-button>
          <el-button type="primary" size="small" @click="patchRelateSource">批量来源关联</el-button>
          <el-button type="primary" size="small" @click="patchRelate">批量病理号关联</el-button>
          <el-button type="primary" size="small" @click="autoRelate">自动病理号关联</el-button>
          <el-button type="primary" size="small" @click="loadJSON()">批量下载JSON</el-button>
          <el-button type="danger" size="small" @click="batchDelete()">批量删除</el-button>
        </div>
        <div class="flex" v-if="activeTabName === '未知'">
          <el-input style="margin-right: 12px" v-model="keyword" size="small" clearable
                    placeholder="请输入切片名称"
                    suffix-icon="el-icon-search" v-on:keyup.enter.native="getSliceList({status: 2})"></el-input>
          <el-button type="primary" size="small" @click="loadJSON()">批量下载JSON</el-button>
          <!--<el-button type="danger" size="small" @click="deleteSlice()">移除</el-button>-->
          <el-button type="danger" size="small" @click="batchDelete()">批量删除</el-button>
        </div>
      </div>
    </div>
    <div class="slice-body flex">
      <div v-show="activeTabName !== '未知'" class="slice-tree" style="margin-right: 24px">
        <el-row class="tree-page">
          <el-input
            size="small"
            class="filter-text"
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <el-tree
            v-loading="loading"
            class="filter-tree"
            :data="classifies"
            node-key="id"
            :check-strictly="true"
            :default-expanded-keys="defaultExpandedKeys"
            :default-checked-keys="defaultCheckedKeys"
            :highlight-current="true"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            ref="entryTree">
          </el-tree>
        </el-row>
      </div>
      <div class="slice-table common-table">
        <el-table
          ref="pTable"
          v-loading="tableLoading"
          :data="data"
          border
          :height=tableHeight
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column fixed="left" type="selection" align="center">
          </el-table-column>
          <el-table-column v-for="(data, index) in headers"
                           :key="index"
                           :fixed="data.fixed"
                           :prop="data.prop"
                           :label="data.label"
                           :min-width="data['min-width']"
                           :align="data.align">
            <template slot-scope="scope">
              <img style="width: 80px" v-if="data.prop === 'label_img'" :src="scope.row[data.prop]">
              <span v-if="data.prop !== 'label_img'">{{scope.row[data.prop]}}</span>
            </template>
          </el-table-column>
          <!--<el-table-column prop="slides" align="center" label="阅片" fixed="right" width="100px">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="loadPicture(scope.row)">下载</el-button>
            </template>
          </el-table-column>-->
          <el-table-column prop="operate" align="center" label="操作" fixed="right" width="180px">
            <template slot-scope="scope">
              <div class="entry-template-btn" v-if="activeTabName === '待关联'">
                <el-button type="primary" size="mini" @click="contactSlice(scope.row)">关联</el-button>
                <el-button type="default" size="mini" @click="markUnknown(scope.row)">标记未知</el-button>
                <el-button type="primary" size="mini" @click="readSlide(scope.row)">阅片</el-button>
                <el-button type="primary" size="mini" @click="loadPicture(scope.row)">下载KFB</el-button>
                <el-button v-if="scope.row.label_status==='已标注'" type="primary" size="mini"
                           @click="loadSingleJSON(scope.row)">下载JSON
                </el-button>
              </div>
              <div v-if="activeTabName === '未知'"
                   class="flex align-items-center justify-content-around wrap entry-template-btn">
                <el-button type="primary" size="mini" @click="readSlide(scope.row)">阅片</el-button>
                <el-button type="danger" size="mini" @click="batchDelete(scope.row)">删除</el-button>
                <el-button type="primary" size="mini" @click="loadPicture(scope.row)">下载KFB</el-button>
                <el-button v-if="scope.row.label_status==='已标注'" type="primary" size="mini"
                           @click="loadSingleJSON(scope.row)">下载JSON
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="slicePage" style="position: absolute;bottom: 0; width:100%;
        display: flex;justify-content:center ;height: 40px;align-items:flex-start">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="pagination.current_page"
            :page-size="pagination.per_page"
            layout="prev, pager, next, jumper"
            :total="pagination.count">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      class="slice-pathological-dialog"
      title="病理详情"
      :visible.sync="pathologyFormVisible"
      center
      append-to-body>
      <el-form label-width="100px" :form="pathologyForm" ref="pathologyForm">
        <el-form-item label="病理号：">
          <span>{{pathologyForm.id}}</span>
        </el-form-item>
        <el-form-item label="姓名：">
          <span>{{pathologyForm.patient_name}}</span>
        </el-form-item>
        <el-form-item label="性别：">
          <span>{{pathologyForm.gender}}</span>
        </el-form-item>
        <el-form-item label="年龄：">
          <span>{{pathologyForm.age}}</span>
        </el-form-item>
        <el-form-item label="送检医生：">
          <span>{{pathologyForm.inspection_doctor}}</span>
        </el-form-item>
        <el-form-item label="身份证号码：">
          <span>{{pathologyForm.id_number}}</span>
        </el-form-item>
        <el-form-item label="民族：">
          <span>{{pathologyForm.nation}}</span>
        </el-form-item>
        <!--<el-form-item label="籍贯：">
          <span>{{pathologyForm.origin}}</span>
        </el-form-item>-->
        <el-form-item label="职业：">
          <span>{{pathologyForm.career}}</span>
        </el-form-item>
        <el-form-item label="联系电话：">
          <span>{{pathologyForm.phone}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="pathologyFormVisible = false">确定</el-button>
        <el-button size="small" @click="pathologyFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="关联" class="entry-pathological-dialog" :visible.sync="entryFormVisible" center>
      <el-form :model="entryForm" label-width="120px" ref="entryForm" :rules="entryRules">
        <el-form-item label="病理号" prop="pathology_id">
          <el-input v-model="entryForm.pathology_id" auto-complete="off"></el-input>
          <el-button type="text" @click="importMessages">查看病例信息</el-button>
        </el-form-item>
        <el-form-item label="数据来源" prop="source_id">
          <el-select v-model="entryForm.source_id" placeholder="请选择扫描仪来源">
            <el-option
              v-for="item in origins"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="数据责任人" prop="liable_user">
          <el-input v-model="entryForm.liable_user" auto-complete="off"></el-input>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="entryFormSubmit">确 定</el-button>
        <el-button size="small" @click="entryFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="关联来源" class="entry-source-dialog" :visible.sync="entrySourceFormVisible" center>
      <el-form :model="entryForm" label-width="120px" ref="entryForm" :rules="entryRules">
        <el-form-item label="数据来源" prop="source_id">
          <el-select v-model="entryForm.source_id" placeholder="请选择扫描仪来源">
            <el-option
              v-for="item in origins"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="数据责任人" prop="liable_user">
          <el-input v-model="entryForm.liable_user" auto-complete="off"></el-input>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="entrySourceFormSubmit">确 定</el-button>
        <el-button size="small" @click="entrySourceFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog class="slide-view-dialog" :fullscreen="true" :visible.sync="showFile" title="阅片"
               :close-on-press-escape="false" :show-close="false">
      <div slot="title" class="slide-dialog-header flex align-items-center justify-content-between">
        <span>阅片</span>
        <div class="close-btn" @click="showFile=false">
          <img src="assets/img/close.png">
        </div>
      </div>
      <pis-slide-view v-if="showFile"
                      :file-name-list="fileNameList"
                      :file-index="0">
      </pis-slide-view>
    </el-dialog>
  </div>
</template>

<script>

  import hzztTitle from '@/components/hzztTitle';
  import pisSlideView from '@/components/pisSlideView/pisSlideView';
  import {entryService} from "./entry.service";
  import {baseUrl} from '@/config/utils';
  import {mapState, createNamespacedHelpers} from 'vuex';

  const moduleMapState = createNamespacedHelpers('stomp').mapState;

  const headerCateList = [
    /*{
      'prop': 'pathology_id',
      'label': '病理号',
      'min-width': 120,
      'align': 'center',
    },*/ {
      'prop': 'name',
      'label': '切片名称',
      'min-width': 120,
      'align': 'center',
    }, {
      'prop': 'path',
      'label': '切片路径',
      'min-width': 120,
      'align': 'center',
    }, {
      'prop': 'cate',
      'label': '切片分类',
      'min-width': 120,
      'align': 'center',
    }, {
      'prop': 'label_img',
      'label': '切片标签图',
      'min-width': 120,
      'align': 'center',
    }, {
      'prop': 'source',
      'label': '来源',
      'min-width': 120,
      'align': 'center',
    }, {
      'prop': 'label_status',
      'label': '标注状态',
      'min-width': 80,
      'align': 'center',
    }, {
      'prop': 'scanistor',
      'label': '扫描仪',
      'min-width': 120,
      'align': 'center',
    }, {
      'prop': 'scan_time',
      'label': '扫描时间',
      'min-width': 120,
      'align': 'center',
    }, {
      'prop': 'scan_user',
      'label': '扫描用户',
      'min-width': 120,
      'align': 'center',
    }];
  const headerUnKnowList = [
    {
      'prop': 'name',
      'label': '切片名称',
      'min-width': 120,
      'align': 'center',
    }, {
      'prop': 'path',
      'label': '切片路径',
      'min-width': 120,
      'align': 'center',
    }, {
      'prop': 'label_img',
      'label': '切片标签图',
      'min-width': 120,
      'align': 'center',
    }, {
      'prop': 'label_status',
      'label': '标注状态',
      'min-width': 80,
      'align': 'center',
    }, {
      'prop': 'scanistor',
      'label': '扫描仪',
      'min-width': 120,
      'align': 'center',
    }, {
      'prop': 'scan_time',
      'label': '扫描时间',
      'min-width': 120,
      'align': 'center',
    }, {
      'prop': 'scan_user',
      'label': '扫描用户',
      'min-width': 120,
      'align': 'center',
    }];

  export default {
    components: {
      hzztTitle,
      pisSlideView,
    },
    data() {
      return {
        activeTabName: '待关联',
        _cateData: [],
        cateDirItem: {},
        classifies: [],
        classify: [],
        classifyOptions: [],
        data: [],
        defaultCheckedKeys: [],
        defaultExpandedKeys: [],
        entryFormVisible: false,
        entrySourceFormVisible: false,
        entryForm: {
          pathology_id: '',
          remark: [],
        },
        entryRules: {
          /* pathology_id: [
             {required: true, message: '请输入病理号', trigger: 'blur'},
           ],*/
          /*source_id: [
            {required: true, message: '请输入数据来源', trigger: 'blur'},
          ],
          liable_user: [
            {required: true, message: '请输入数据负责人', trigger: 'blur'},
          ],*/
        },
        fileNameList: [],
        filterText: '',
        headers: headerCateList,
        keyword: '',
        loading: false,
        multipleSelection: [],
        origins: [],
        pagination: {count: 0, current_page: 1, per_page: 15},
        path: '',
        pathList: [],
        pathologyForm: {},
        pathologyFormVisible: false,
        showFile: false,
        selectCate: {},
        tableHeight: '100%',
        tabList: [/*{
          label: '待分类',
          name: '待分类',
        },*/ {
          label: '待关联',
          name: '待关联',
        }, {
          label: '未知',
          name: '未知',
        }],
        tableLoading: false,
      }
    },
    mounted() {
      this.cateList();
      this.originList();
      this.$root.$on('refresh-list', () => this.getSliceList({
        page: this.pagination.current_page,
        size: this.pagination.per_page
      }));
    },
    computed: {
      ...mapState(['user']),
      ...moduleMapState([
        'isConnected',
        'scanSliceProgress',
      ]),
      isShowScanProgress() {
        return !!this.scanSliceProgress;
      },
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      //获取分类
      cateList() {
        this.loading = true;
        this.classifies = [];
        entryService.cateList().then(res => {
          if (res.body?.ret_code === 0) {
            // this.classifyOptions = res.body.data.map((item) => ({...item}));
            this.classifies = res.body.data;
            if (this.classifies[0]) {
              this.cateDirItem = this.classifies[0];
              this.defaultCheckedKeys = [this.classifies[0]?.id];
              this.defaultExpandedKeys = [this.classifies[0]?.id];
              this.$nextTick(() => {
                this.$refs.entryTree.setCurrentKey(this.classifies[0]?.id);
              });
              this.getSliceList({cate_id: this.classifies[0]?.id});
            }
          }
        }).finally(() => {
          setTimeout(() => this.loading = false, 100)
        })
      },
      originList() {
        this.loading = true;
        this.classifies = [];
        entryService.originList().then(res => {
          if (res.body?.ret_code === 0) {
            /*this.classifies = res.body.data.map((item) => ({
              id: item.id,
              label: item.hospital,
              path: item.path,
              children: [{
                id: item.id + '阴性',
                parent_id: item.id,
                parent_path: item.path,
                label: '阴性',
                path: item.path.map((item) => ({path: `${item.path}/neg`})),
              }, {
                id: item.id + '阳性',
                parent_id: item.id,
                parent_path: item.path,
                label: '阳性',
                path: item.path.map((item) => ({path: `${item.path}/pos`})),
              }]
            }));*/
            this.origins = res.body.data.map((item) => ({
              id: item.id,
              label: item.hospital,
              path: item.path,
            }));
          }
        }).finally(() => {
          setTimeout(() => this.loading = false, 100)
        })
      },
      handleNodeClick(item, node) {
        if (!item.id) {
          return;
        }
        if (!item.path) {
          item.path = [];
        }
        this.cateDirItem = item;
        if (this.activeTabName === '待关联') {
          this.getSliceList({cate_id: item.id});
        }
      },
      getSliceList({status = 0, page = 1, size = 15, cate_id} = {status: 0, page: 1, size: 15}) {
        this.tableLoading = true;
        this.data = [];
        entryService.sliceList({status, page, size, cate_id, name: this.keyword}).then(({body}) => {
          if (this.activeTabName === '待分类') return;
          if (body?.ret_code === 0) {
            this.data = body.data.list.map((item) => ({
              ...item,
              label_img: `/api/process/get_image?file=${item.path}&type=label`,
            }));
            this.pagination = body.data.meta;
          } else {
            this.pagination = {count: 0, current_page: 1, per_page: 15};
          }
        }).finally(() => {
          this.tableLoading = false;
        })
      },
      handleChange(list) {
        let cateList = [...this.classifyOptions];
        let ids = [...list];
        let cate = {path: []};
        while (ids.length > 0) {
          let id = ids.shift();
          if (cateList.find((classify) => classify.id === id)) {
            cate = cateList.find((classify) => classify.id === id);
            cateList = cate?.children && [...cate.children];
          }
        }
        this.selectCate = cate;
        this.pathList = cate.path;
        this.path = this.pathList?.[0]?.path;
      },
      autoScan() {
        if (!this.isConnected) {
          this.$notify.warning({
            title: '警告',
            message: 'stomp未连接，无法进行通讯',
          });
          return;
        }
        entryService.sliceEntry({
          cate_id: this.cateDirItem.id,
          queue: `file_${this.user.username}_scan_slice`
        }).then(({body}) => {
          if (body?.ret_code === 0) {
            this.$message.success(body?.ret_msg || '正在切片扫描中...');
          } else {
            this.$message.error(body?.ret_msg || '切片扫描失败');
          }
        }).catch(() => {
          this.$message.error('切片扫描失败');
          this.isShowScanProgress = false;
        }).finally(() => {
        });
      },
      autoRelate() {
        entryService.autoRelate({cate_id: this.cateDirItem.id}).then(res => {
          if (res.body?.ret_code === 0) {
            this.$message.success('自动关联成功');
            this.getSliceList({cate_id: this.cateDirItem.id});
          } else {
            this.$message.error(res.body.ret_msg || '自动关联失败');
          }
        }).catch(() => {
          this.$message.error('自动关联失败');
        })
      },
      handleSelectionChange(list) {
        this.multipleSelection = list.concat();
      },
      //tab选项点击
      handleClick(tab) {
        this.pagination = {count: 0, current_page: 1, per_page: 15};
        this.pathList = [];
        this.selectCate = {};
        this.data = [];
        this.path = undefined;
        this.multipleSelection = [];
        if (tab.name === '待关联') {
          this.headers = headerCateList;
          this.cateList();
        }
        if (tab.name === '未知') {
          this.headers = headerUnKnowList;
          this.getSliceList({status: 2});
        }
      },
      handleCurrentChange(page) {
        if (this.activeTabName === '待分类') {
          this.pagination.current_page = page;
          this.data = this._cateData.slice((page - 1) * this.pagination.per_page, page * this.pagination.per_page);
        } else {
          const status = this.activeTabName === '待关联' ? 0 : 2;
          this.getSliceList({page, cate_id: this.cateDirItem.id, status});
        }
      },
      //标记未知
      markUnknown(row) {
        entryService.markUnknown({
          id: [row.id],
        }).then(({body}) => {
          if (body?.ret_code === 0) {
            this.$message.success('标记未知成功');
            this.getSliceList({cate_id: this.cateDirItem.id, status: 0});
          } else {
            this.$message.error(body?.ret_msg || '标记未知失败');
          }
        }).catch(() => {
          this.$message.error('标记未知失败');
        })
      },
      contactSlice(row) {
        this.entryFormVisible = true;
        this.entryForm = {
          id: row.id,
          pathology_id: row.pathology_id,
          remark: [''],
          source_id: '',
          liable_user: '',
        };
      },
      deleteSlice(row) {
        if (!row && this.multipleSelection.length === 0) {
          this.$message.warning('请选择移除项');
          return;
        }
        const params = {
          id: row ? [row.id] : this.multipleSelection.map((item) => item.id),
        };
        entryService.deleteSlice(params).then(({body}) => {
          if (body?.ret_code === 0) {
            this.$message.success('切片移除成功');
            this.getSliceList({status: 2});
          } else {
            this.$message.error(body?.ret_msg || '切片移除失败');
          }
        }).catch(() => {
          this.$message.error('切片移除失败');
        })
      },
      batchDelete(row) {
        if (!row && this.multipleSelection.length === 0) {
          this.$message.warning('请选择需删除的数据');
          return;
        }
        const params = {
          id: row ? [row.id] : this.multipleSelection.map((item) => item.id),
        };
        entryService.batchDelete(params).then(({body}) => {
          if (body?.ret_code === 0) {
            this.$message.success('切片删除成功');
            this.getSliceList({
              cate_id: this.cateDirItem.id,
              status: this.activeTabName === '待关联' ? undefined : 2,
            });
          } else {
            this.$message.error(body?.ret_msg || '切片删除失败');
          }
        }).catch(() => {
          this.$message.error('切片删除失败');
        })
      },
      //关联切片
      entryFormSubmit() {
        this.$refs['entryForm'].validate((valid) => {
          if (valid) {
            entryService.relateSlice({
              id: [this.entryForm.id],
              pathology_id: this.entryForm.pathology_id,
              liable_user: this.entryForm.liable_user,
              source_id: this.entryForm.source_id,
              remark: this.entryForm.remark,
            }).then(({body}) => {
              if (body?.ret_code === 0) {
                this.$message.success('关联成功');
                this.getSliceList({cate_id: this.cateDirItem.id});
                this.entryFormVisible = false;
              } else {
                this.$message.error(body?.ret_msg || '关联失败');
              }
            }).catch(() => {
              this.$message.error('关联失败');
            })
          }
        })
      },
      entrySourceFormSubmit() {
        entryService.relateSlice({
          id: this.multipleSelection.map((item) => item.id),
          liable_user: this.entryForm.liable_user,
          source_id: this.entryForm.source_id,
          remark: this.entryForm.remark,
        }).then(({body}) => {
          if (body?.ret_code === 0) {
            this.$message.success('关联成功');
            this.entrySourceFormVisible = false;
            this.getSliceList({cate_id: this.cateDirItem.id});
          } else {
            this.$message.error(body?.ret_msg || '关联失败');
          }
        }).catch(() => {
          this.$message.error('关联失败');
        })
      },
      importMessages() {
        if (!this.entryForm.pathology_id) {
          this.$message.error('请输入病理号');
          return;
        }
        entryService.pathologyMessages(this.entryForm.pathology_id).then(({body}) => {
          if (body?.ret_code === 0) {
            if (body.data) {
              this.pathologyForm = body.data;
              if (this.$refs['pathologyForm']) this.$refs['pathologyForm'].resetFields();
              this.pathologyFormVisible = true;
            } else {
              this.$message.error('暂无该病理号的病例信息');
            }
          } else {
            this.$message.error(body?.ret_msg || '暂无该病理号的病例信息');
          }
        }).catch(() => {
          this.$message.error('暂无该病理号的病例信息');
        })
      },
      deleteRemark(index) {
        this.entryForm.remark.splice(index, 1);
      },
      addRemark() {
        if (this.entryForm?.remark && Array.isArray(this.entryForm?.remark)) {
          this.entryForm.remark.push('');
        } else {
          this.$set(this.entryForm, 'remark', ['']);
        }
      },
      readSlide(row) {
        this.fileNameList = [row.filepath || row.path];
        this.showFile = true;
      },
      //表格选择项发生变化时触发该事件，表格选中的数据
      patchRelate() {
        if (this.multipleSelection.length === 0) {
          this.$message.warning('请选择需关联的数据');
          return;
        }
        entryService.autoRelate({
          cate_id: this.cateDirItem.id,
          slice_ids: this.multipleSelection.map((item) => item.id),
        }).then(({body}) => {
          if (body?.ret_code === 0) {
            this.$message.success('关联成功');
            this.getSliceList({cate_id: this.cateDirItem.id});
          } else {
            this.$message.error(body?.ret_msg || '关联失败');
          }
        }).catch(() => {
          this.$message.error('关联失败');
        })
      },
      patchRelateSource() {
        if (this.multipleSelection.length === 0) {
          this.$message.warning('请选择需关联的数据');
          return;
        }
        this.entrySourceFormVisible = true;
      },
      loadPicture(row) {
        let anchor = document.createElement('a');
        anchor.setAttribute('href', row.path || row.filepath);
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('download', (row.name || row.filename));
        anchor.click();
      },
      loadSingleJSON(row) {
        let anchor = document.createElement('a');
        anchor.setAttribute('href', (row.path || row.filepath).replace('.kfb', '.json'));
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('download', (row.name || row.filename).replace('.kfb', '.json'));
        anchor.click();
      },
      loadJSON() {
        let params = {
          slice_ids: this.multipleSelection.length > 0 ? this.multipleSelection.map((item) => item.id) : undefined,
        };
        entryService.downloadJSON(params)
          .then(({body}) => {
            if (body?.ret_code === 0) {
              let anchor = document.createElement('a');
              anchor.setAttribute('href', body.path);
              anchor.setAttribute('target', '_blank');
              anchor.setAttribute('download', new Date().getTime() + '.json.zip');
              anchor.click();
            } else {
              this.$message.error(body?.ret_msg || '下载失败');
            }
          }).catch(() => {
          this.$message.error('下载失败');
        })
      },
    },
    watch: {
      filterText(val) {
        this.$refs.entryTree.filter(val);
      },
    },
  }
</script>

<style lang="scss">
  .slice-pathological-dialog {
    .el-dialog--center {
      width: 500px;
      .el-form-item {
        color: #676767;
        margin-bottom: 10px;
        .el-form-item__label {
          color: #222222;
        }
        .el-button--text {
          margin-left: 60px;
        }
      }
    }
  }

  .entry-source-dialog {
    .el-dialog--center {
      width: 400px;
      .el-form-item {
        color: #676767;
        margin-bottom: 20px;
        .el-form-item__label {
          color: #222222;
        }
        .el-input {
          max-width: 217px;
        }
        .el-textarea {
          max-width: 217px;
        }
        .form-age {
          display: inline-block;
          width: 217px;
        }
        .el-button--text {
          margin-left: 20px;
        }
        .el-input__inner {
          height: 31px;
        }
      }
    }
  }

  .entry-pathological-dialog {
    .el-dialog--center {
      min-width: 510px;
      max-width: 600px;
      .el-form-item {
        color: #676767;
        margin-bottom: 20px;
        .el-form-item__label {
          color: #222222;
        }
        .el-input {
          max-width: 217px;
        }
        .el-textarea {
          max-width: 217px;
        }
        .form-age {
          display: inline-block;
          width: 217px;
        }
        .el-button--text {
          margin-left: 20px;
        }
        .el-input__inner {
          height: 31px;
        }
      }
    }
  }

  .slide-view-dialog {
    .el-dialog {
      display: flex;
      flex-direction: column;
      .slide-dialog-header {
        .close-btn {
          cursor: pointer;
          height: 25px;
          width: 25px;
          img {
            width: 100%;
          }
        }
      }
      .el-dialog__header {
        padding: 10px 20px;
      }
      .el-dialog__body {
        flex: 1;
        padding: 0;
      }
    }
  }

  .entry-template-btn {
    .el-button {
      margin: 5px 0;
      & + .el-button {
        margin-left: 0;
      }
    }
  }

  .entry-progress {
    display: flex;
    flex-direction: column;
    margin: 10px 0;
  }
</style>
