<template>
  <div class="main-container slice-main">
    <div class="common-header">
      <hzzt-title>数据列表</hzzt-title>
      <div class="common-header-end flex align-items-center">
        <el-input style="margin-right: 12px" v-model="keyword" size="small" clearable
                  placeholder="请输入切片名称"
                  suffix-icon="el-icon-search" v-on:keyup.enter.native="sliceTable()"></el-input>

        <!--<el-button style="margin-right: 7px" type="text" disabled>扫描时间</el-button>-->
        <el-date-picker
          style="margin-right: 9px"
          v-model="scanTime"
          type="date"
          clearable
          size="small"
          value-format="yyyy-MM-dd"
          @change="handleTimeChange"
          placeholder="请选择扫描日期">
        </el-date-picker>
        <el-select style="margin-right: 12px" v-model="label_status" size="small" placeholder="请选择标注状态" clearable
                   @change="sliceTable()">
          <el-option label="未标注" :value="0"></el-option>
          <el-option label="已标注" :value="1"></el-option>
          <el-option label="已精修" :value="2"></el-option>
        </el-select>
        <el-button type="primary" size="small" v-show="label_status===0" @click="relateJSON"
                   :disabled="isShowRelateProgress">关联JSON
        </el-button>
        <el-button type="primary" size="small" @click="sliceDuplicate">数据查重</el-button>
        <el-button type="primary" size="small" @click="batchStatus()">批量修改状态</el-button>
        <el-button type="primary" size="small" @click="loadJSON()">批量下载JSON</el-button>
        <el-button type="primary" size="small" @click="deleteSlice()">批量移除</el-button>
        <el-button type="danger" size="small" @click="batchDelete(multipleSelection)">批量删除</el-button>
      </div>
    </div>
    <div class="slice-body flex">
      <div class="slice-tree relative" style="margin-right: 24px">
        <div class="show-icon" :class="[showCate?'el-icon-arrow-left':'el-icon-arrow-right']"
             @click="showCate=!showCate"></div>
        <el-row class="tree-page" v-show="showCate">
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
            :highlight-current="true"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            ref="sliceTree">
            <span class="custom-tree-node" slot-scope="{node,data}">
              <span>{{data.label}}</span>
              <span>
                <el-button type="text" size="small">{{data.count.unmark}}</el-button>
                <el-button type="text" size="small">{{data.count.marked}}</el-button>
                <el-button type="text" size="small">{{data.count.refinement}}</el-button>
                <el-button type="text" size="small">{{data.count.total}}</el-button>
              </span>
            </span>
          </el-tree>
        </el-row>
      </div>
      <div class="slice-table common-table">
        <el-table
          ref="pTable"
          v-loading="tableLoading"
          :data="data"
          @selection-change="handleSelect"
          border
          :height=tableHeight
          style="width: 100%">
          <el-table-column fixed="left" type="selection" align="center">
          </el-table-column>
          <el-table-column align="center" prop="pathology_id" label="病理号" width="120" fixed="left">
            <template slot-scope="scope">
              <a class="pathology-id" style="cursor:pointer;color:#4F93FE"
                 @click="pathologyMessages(scope.row.pathology_id)">{{scope.row.pathology_id}}</a>
            </template>
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
          <el-table-column prop="operate" align="center" label="操作" fixed="right" width="220px">
            <template slot-scope="scope">
              <div class="flex align-items-center justify-content-center wrap">
                <el-button type="danger" size="small" @click="deleteSlice(scope.row)">移除</el-button>
                <el-button type="primary" size="small" @click="seeSlice(scope.row)">查看</el-button>
                <el-button type="primary" size="small" @click="readSlice(scope.row)">阅片</el-button>
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
    <el-dialog class="slice-pathological-dialog" title="切片详情" :visible.sync="outerVisible" center>
      <el-form label-width="100px" :model="sliceForm">
        <el-form-item label="病理号：">
          <span>{{sliceForm.pathology_id}}</span>
        </el-form-item>
        <el-form-item label="切片名称：">
          <span>{{sliceForm.name}}</span>
        </el-form-item>
        <el-form-item label="切片分类：">
          <span>{{sliceForm.cate}}</span>
        </el-form-item>
        <el-form-item label="来源：">
          <span>{{sliceForm.source}}</span>
        </el-form-item>
        <el-form-item label="扫描机器名：">
          <span>{{sliceForm.scanistor}}</span>
        </el-form-item>
        <el-form-item label="扫描人：">
          <span>{{sliceForm.scanUser}}</span>
        </el-form-item>
        <el-form-item label="扫描时间：">
          <span>{{sliceForm.scanTime}}</span>
        </el-form-item>
        <el-form-item label="切片路径：">
          <span style="word-break: break-all">{{sliceForm.path}}</span>
        </el-form-item>
        <el-form-item label="切片缩略图：">
          <img width="180px" height="180px" class="preview-img" alt="切片缩略图"
               :src="sliceForm.previewImg">
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="loadPicture(sliceForm)">下载KFB</el-button>
        <el-button v-if="sliceForm.label_status==='已标注'" type="primary" size="small" @click="loadSingleJSON(sliceForm)">
          下载JSON
        </el-button>
        <el-button size="small" @click="outerVisible = false">取消</el-button>
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
      <pis-slide-view
        v-if="showFile"
        :file-name-list="fileNameList"
        :file-index="fileIndex">
      </pis-slide-view>
    </el-dialog>
    <el-dialog title="修改状态" class="status-dialog" :visible.sync="statusVisible" center width="400px">
      <el-form :model="statusForm" label-width="120px" ref="statusForm">
        <el-form-item label="标注状态" prop="label_status">
          <el-select v-model="statusForm.label_status" size="small" placeholder="请选择标注状态">
            <el-option label="未标注" :value="0"></el-option>
            <el-option label="已标注" :value="1"></el-option>
            <el-option label="已精修" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标注人" prop="label_user" v-if="statusForm.label_status===1">
          <el-input v-model="statusForm.label_user" size="small" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="精修人" prop="refinement_user" v-if="statusForm.label_status===2">
          <el-input v-model="statusForm.refinement_user" size="small" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="statusFormSubmit">确 定</el-button>
        <el-button size="small" @click="statusVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="重复列表" class="repeat-dialog" :visible.sync="repeatVisible" center width="80%">
      <div class="flex" style="margin-bottom: 10px">
        <el-input style="margin-right: 12px" v-model="repeatName" size="small" clearable
                  placeholder="请输入切片名称"
                  suffix-icon="el-icon-search" v-on:keyup.enter.native="repeatData()"></el-input>
        <el-button type="danger" size="small" @click="batchDelete(repeatMultipleSelection)">
          批量删除
        </el-button>
      </div>
      <el-table
        :data="repeatList"
        @selection-change="handleRepeatSelect"
        border
        height="550px"
        v-loading="repeatLoading"
        :span-method="arraySpanMethod"
        style="width: 100%">
        <el-table-column fixed="left" type="selection" align="center">
        </el-table-column>
        <el-table-column v-for="(data, index) in repeatHeaders"
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
      </el-table>
    </el-dialog>
  </div>

</template>

<script>
  import hzztTitle from '@/components/hzztTitle';
  import {sliceService} from './slice.service';
  import {baseUrl} from '@/config/utils';
  import pisSlideView from '@/components/pisSlideView/pisSlideView';
  import {mapState, createNamespacedHelpers} from 'vuex';

  const moduleMapState = createNamespacedHelpers('stomp').mapState;

  export default {
    components: {
      hzztTitle,
      pisSlideView,
    },
    data() {
      return {
        cate_id: undefined,
        classifies: [],
        // classify: undefined,
        // classifyOptions: [],
        data: [],
        defaultExpandedKeys: [],
        fileIndex: 0,
        fileNameList: [],
        filterText: '',
        headers: [{
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
          'prop': 'label_user',
          'label': '标注人',
          'min-width': 80,
          'align': 'center',
        }, {
          'prop': 'refinement_user',
          'label': '精修人',
          'min-width': 80,
          'align': 'center',
        }, {
          'prop': 'scanistor',
          'label': '扫描机器名',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'scan_time',
          'label': '扫描时间',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'scan_user',
          'label': '扫描人',
          'min-width': 120,
          'align': 'center',
        }],
        initData: [],
        innerVisible: false,
        keyword: '',
        loading: false,
        messageList: {},
        multipleSelection: [],
        outerVisible: false,
        pagination: {count: 0, current_page: 1, per_page: 15},
        pathologyForm: {},
        pathologyLoading: false,
        scanTime: undefined,
        showFile: false,
        sliceForm: {},
        sliceMode: true,
        tableHeight: '100%',
        tableLoading: false,
        statusVisible: false,
        statusForm: {},
        label_status: undefined,
        repeatVisible: false,
        repeatList: [],
        repeatName: '',
        repeatMultipleSelection: [],
        repeatLoading: false,
        repeatHeaders: [{
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
          'prop': 'label_user',
          'label': '标注人',
          'min-width': 80,
          'align': 'center',
        }, {
          'prop': 'refinement_user',
          'label': '精修人',
          'min-width': 80,
          'align': 'center',
        }],
        showCate: true,
      }
    },
    watch: {
      filterText(val) {
        this.$refs.sliceTree.filter(val);
      }
    },
    created() {
      this.cateList();
      this.$root.$on('refresh-slice-list', () => this.cateTwoList());
    },
    computed: {
      ...mapState(['user']),
      ...moduleMapState([
        'isConnected',
        'relateJSONProgress',
      ]),
      isShowRelateProgress() {
        return !!this.relateJSONProgress;
      },
    },
    methods: {
      //获取树形结构的分类
      cateList() {
        this.loading = true;
        sliceService.cateList().then(({body}) => {
          if (body?.ret_code === 0) {
            this.classifies = body.data;
            if (this.classifies[0]) {
              this.defaultExpandedKeys = [this.classifies[0]?.id];
              this.cate_id = this.classifies[0]?.id;
              this.$nextTick(() => {
                this.$refs.sliceTree.setCurrentKey(this.classifies[0]?.id);
              });
            }
            this.sliceTable()
          }
        }).finally(() => {
          this.loading = false;
        })
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      handleTimeChange() {
        this.sliceTable();
      },
      //分页页码改变事件
      handleCurrentChange(val) {
        this.sliceTable();
      },
      //点击树形结构分类的某一项的回调函数
      handleNodeClick(item, node) {
        this.cate_id = item.id;
        this.sliceTable();
      },
      //得到切片列表
      sliceTable() {
        let params = {
          page: this.pagination.current_page,
          status: 1,
          label_status: this.label_status,
          name: this.keyword || undefined,
          cate_id: this.cate_id || this.classifies[0].id,
        };
        this.tableLoading = true;
        sliceService.sliceList(params).then(({body}) => {
          this.data = [];
          if (body?.ret_code === 0) {
            this.data = (body.data.list || []).map((item) => ({
              ...item,
              label_img: `/api/process/get_image?file=${item.path}&type=label`,
            }));
            this.pagination = body.data.meta;
          }
        }).catch(() => {
          this.pagination = {count: 0, current_page: 1, per_page: 15};
        }).finally(() => {
          this.tableLoading = false;
        });
      },
      //阅片
      readSlice(row) {
        this.showFile = true;
        this.fileNameList = [row.path];
        this.fileIndex = 0;
      },
      //查看切片
      seeSlice(data) {
        this.sliceForm = data;
        this.sliceForm.previewImg = `${baseUrl}/slice_thumb?file=${this.sliceForm.path}&type=thumbnail`;
        this.outerVisible = true;
      },
      relateJSON() {
        this.$prompt('关联JSON的路径地址', '关联JSON', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: 'JSON的路径地址'
        }).then((res) => {
          const path = res.value;
          if (!path) return;
          sliceService.relateJSON({
            status: 1,
            label_status: 0,
            json_dir: path,
            cate_id: this.cate_id,
            queue: `file_${this.user.username}_relate_json`
          }).then((res) => {

          });
        }).catch(() => {

        })
      },
      sliceDuplicate() {
        this.repeatVisible = true;
        this.repeatList = [];
        this.repeatMultipleSelection = [];
        this.repeatLoading = true;
        this.repeatName = '';
        this.repeatData();
      },
      repeatData() {
        sliceService.sliceDuplicate({page_size: 100, name: this.repeatName})
          .then((res) => {
            const obj = res.body.data.list;
            for (let key in obj) {
              this.repeatList = [...this.repeatList, ...obj[key].map((item, index) => {
                if (index === 0) item.count = obj[key].length;
                item.label_img = `/api/process/get_image?file=${item.path}&type=label`;
                return item;
              })]
            }
          }).finally(() => {
          this.repeatLoading = false;
        })
      },
      arraySpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 1) {
          if (row.count) {
            return {
              rowspan: row.count,
              colspan: 1,
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0,
            };
          }
        }
      },
      batchStatus() {
        if (this.multipleSelection.length === 0) {
          this.$message.warning('请选择项');
          return;
        }
        this.statusForm = {
          label_user: '',
          refinement_user: '',
          label_status: '',
        };
        this.statusVisible = true;
      },
      statusFormSubmit() {
        sliceService.sliceUpdate({
          id: this.multipleSelection.map((item) => item.id),
          label_user: this.statusForm.label_status !== 2 ? this.statusForm.label_user : undefined,
          refinement_user: this.statusForm.label_status !== 1 ? this.statusForm.refinement_user : undefined,
          label_status: this.statusForm.label_status,
        }).then(({body}) => {
          if (body?.ret_code === 0) {
            this.$message.success('修改成功');
            this.cateTwoList();
            this.statusVisible = false;
          } else {
            this.$message.error(body?.ret_msg || '修改失败');
          }
        }).catch(() => {
          this.$message.error('修改失败');
        })
      },
      cateTwoList() {
        sliceService.cateList().then(({body}) => {
          if (body?.ret_code === 0) {
            this.classifies = body.data;
            if (this.classifies[0]) {
              this.$nextTick(() => {
                this.$refs.sliceTree.setCurrentKey(this.cate_id);
              });
            }
            this.sliceTable();
          }
        }).finally(() => {
          this.loading = false;
        })
      },
      //单个删除
      deleteSlice(row) {
        if (!row && this.multipleSelection.length === 0) {
          this.$message.warning('请选择移除项');
          return;
        }
        const params = {
          id: row ? [row.id] : this.multipleSelection.map((item) => item.id),
        };
        // console.log(params)
        sliceService.deleteSlice(params).then(({body}) => {
          if (body?.ret_code === 0) {
            this.outerVisible = false;
            this.$message.success('切片移除成功');
            this.sliceTable();
          }
          else {
            this.$message.error(body?.ret_msg || '切片移除失败');
          }
        })
      },
      batchDelete(list) {
        if (list.length === 0) {
          this.$message.warning('请选择需删除的数据');
          return;
        }
        sliceService.batchDelete({
          id: list.map((item) => item.id),
        }).then(({body}) => {
          if (body?.ret_code === 0) {
            this.$message.success('切片删除成功');
            if (this.repeatVisible) {
              this.repeatList = [];
              this.repeatData();
            } else {
              this.sliceTable();
            }
          }
          else {
            this.$message.error(body?.ret_msg || '切片删除失败');
          }
        })
      },
      handleSelect(list) {
        this.multipleSelection = list.concat();
      },
      handleRepeatSelect(list) {
        this.repeatMultipleSelection = list.concat();
      },
      //下载
      loadPicture(row) {
        let anchor = document.createElement('a');
        anchor.setAttribute('href', row.path);
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('download', row.name);
        anchor.click();
      },
      loadSingleJSON(row) {
        let anchor = document.createElement('a');
        anchor.setAttribute('href', (row.path).replace('.kfb', '.json'));
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('download', row.name.replace('.kfb', '.json'));
        anchor.click();
      },
      loadJSON() {
        let params = {
          slice_ids: this.multipleSelection.length > 0 ? this.multipleSelection.map((item) => item.id) : undefined,
        };
        sliceService.downloadJSON(params)
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
      pathologyMessages(id) {
        this.$router.push(`/message/${id}`);
      },
    }
  }
</script>

<style lang="scss">
  @import "../../../style/variables";

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

  /* .status-dialog {
     .el-dialog--center {
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
   }*/

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

  .repeat-dialog {
    .el-dialog__body {
      padding-top: 0;
      height: 600px;
      .el-input {
        max-width: 217px;
      }
    }
  }

</style>
