<template>
  <div class="tct">
    <el-form class="tct-form" size="small" :model="diagnosis"
             ref="diagnosis" disabled>
      <el-row class="tct-one-header">
        <el-col :span="8">
          姓名：{{caseInfoForm.patient_name}}
        </el-col>
        <el-col :span="8">
          性别：{{caseInfoForm.gender}}
        </el-col>
        <el-col :span="8">
          年龄：{{caseInfoForm.age}}
        </el-col>
        <el-col :span="8">
          病理号：{{caseInfoForm.id}}
        </el-col>
        <el-col :span="8">
          取样日期：{{caseInfoForm.take_cell_at}}
        </el-col>
        <el-col :span="8">
          取样医师：{{caseInfoForm.register_doctor}}
        </el-col>
      </el-row>
      <el-row class="tct-two-container">
        <el-col :span="12">
          <el-row>
            <el-form-item>
              <el-col :span="8">标本满意情况：</el-col>
              <el-col :span="8">
                <el-select v-model="diagnosis.specimen_satisfaction">
                  <el-option label="满意" value="满意"></el-option>
                  <el-option label="基本满意" value="基本满意"></el-option>
                  <el-option label="重新取样" value="重新取样"></el-option>
                  <el-option label="不满意" value="不满意"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8"></el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item>
              <el-col :span="8">（1）上皮细胞数：</el-col>
              <el-col :span="8">
                <el-select v-model="diagnosis.epithelium_count">
                  <el-option label=">5000个细胞" value=">5000个细胞"></el-option>
                  <el-option label="<5000个细胞" value="<5000个细胞"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8"></el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item>
              <el-col :span="8">（2）颈管细胞：</el-col>
              <el-col :span="8">
                <el-select v-model="diagnosis.neck_canal_cell_count">
                  <el-option label="有" value="有"></el-option>
                  <el-option label="无" value="无"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8"></el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item>
              <el-col :span="8">（3）化生细胞：</el-col>
              <el-col :span="8">
                <el-select v-model="diagnosis.metaplastic_cell_count">
                  <el-option label="有" value="有"></el-option>
                  <el-option label="无" value="无"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8"></el-col>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item>
              <el-col :span="8">炎症程度：</el-col>
              <el-col :span="8">
                <el-select v-model="diagnosis.inflammation">
                  <el-option label="无" value="无"></el-option>
                  <el-option label="轻度炎症" value="轻度炎症"></el-option>
                  <el-option label="重度炎症" value="重度炎症"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8"></el-col>
            </el-form-item>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col>微生物项目：</el-col>
            <el-form-item v-for="(item, index) in diagnosis.microbial" :key="index">
              <el-col class="flex">（{{index+1}}）{{item.name}}：
                <el-checkbox v-model="item.checked"></el-checkbox>
              </el-col>
            </el-form-item>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="tct-three-container">
        <div class="flex">
          <div class="flex-3">
            <p class="tct-diagnosis-TBS">TBS标准诊断：</p>
            <p class="tct-diagnosis-title">鳞状上皮细胞：</p>
            <div class="flex align-items-center" v-for="(cell, index) in diagnosis.squamous_cell"
                 :key="index">
              <el-form-item>
                <span>{{cell.name}}</span>
                <el-checkbox v-model="cell.checked"></el-checkbox>
              </el-form-item>
              <span style="margin: 0 10px" v-if="cell.children.length>0">───</span>
              <div>
                <el-form-item v-for="(item, index) in cell.children" :key="index">
                  <span v-show="index===0">┌─</span>
                  <span v-show="index!==0&&index!==cell.children.length-1">├─</span>
                  <span v-show="index===cell.children.length-1">└─</span>
                  <span>{{item.name}}</span>
                  <el-checkbox v-model="item.checked" :disabled="!cell.checked"></el-checkbox>
                </el-form-item>
              </div>
            </div>
            <p class="tct-diagnosis-title">腺上皮细胞分析：</p>
            <div class="flex align-items-center" v-if="index<2"
                 v-for="(cell, index) in diagnosis.glandular_cell"
                 :key="cell.name">
              <el-form-item>
                <span>{{cell.name}}</span>
                <el-checkbox v-model="cell.checked"></el-checkbox>
              </el-form-item>
              <span style="margin: 0 10px" v-if="cell.children.length>0">───</span>
              <div>
                <el-form-item v-for="(item, index) in cell.children" :key="index">
                  <span v-show="index===0">┌─</span>
                  <span v-show="index!==0&&index!==cell.children.length-1">├─</span>
                  <span v-show="index===cell.children.length-1">└─</span>
                  <span>{{item.name}}</span>
                  <el-checkbox v-model="item.checked" :disabled="!cell.checked"></el-checkbox>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="flex-2" v-if="readonly">
            <div class="uploadImg">
              <img class="upload-img" v-for="(img, index) in diagnosis.imgList" :src="img.url">
            </div>
          </div>
        </div>
        <div class="flex align-items-center">
          <div class="flex align-items-center" v-if="index>=2"
               :class="{'margin-left-temp': index===3}"
               v-for="(cell, index) in diagnosis.glandular_cell"
               :key="index">
            <el-form-item>
              <span>{{cell.name}}</span>
              <el-checkbox v-model="cell.checked"></el-checkbox>
            </el-form-item>
            <span style="margin: 0 10px" v-if="cell.children.length>0">───</span>
            <div>
              <el-form-item v-for="(item, index) in cell.children" :key="index">
                <span v-show="index===0">┌─</span>
                <span v-show="index!==0&&index!==cell.children.length-1">├─</span>
                <span v-show="index===cell.children.length-1">└─</span>
                <span>{{item.name}}</span>
                <el-checkbox v-model="item.checked" :disabled="!cell.checked"></el-checkbox>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-row>
      <div class="flex align-items-center justify-content-between">
        <p class="diagnosis-title">诊断意见</p>
      </div>
      <el-form-item prop="tct_diagnostic">
        <el-input type="textarea" v-model="diagnosis.tct_diagnostic"
                  :autosize="{ minRows: 4, maxRows: 4}"
                  :readonly="readonly"></el-input>
      </el-form-item>
    </el-form>
    <!--导入相关的镜下所见和诊断模板-->
  </div>
</template>

<script>
  /*import methods from './diagnosis.common';*/


  export default {

    /*mixins: [methods],*/
    data() {
      return {}
    },
    props: {
      caseInfoForm: Object,
      diagnosis: Object,
      readonly: false,
    },
    mounted() {
    },
    methods: {

    },
  };
</script>

<style lang="scss">
  @import "../../../../style/variables";

  .tct {
    .tct-form {
      background: #ffffff;
      padding: 0 5px 5px;
      border-radius: 5px;
      .el-form-item--small .el-form-item__content {
        line-height: 24px;
      }
    }
    .tct-one-header {
      padding: 5px 0;
      border-bottom: 1px solid $_pm-default-border-color;
    }
    .tct-two-container {
      padding: 5px 0;
      border-bottom: 1px solid $_pm-default-border-color;
    }
    .tct-three-container {
      position: relative;
      padding: 5px 0;
      border-bottom: 1px solid $_pm-default-border-color;
      .el-checkbox {
        margin-left: 20px;
      }
      .margin-left-temp {
        margin-left: 50px;
      }
      .el-form-item--small.el-form-item {
        margin-bottom: 0;
      }
      .uploadImg {
        position: relative;
        .el-upload-list {
          display: flex;
          flex-direction: column;
        }
        .el-upload-list__item {
          height: 120px;
          width: 150px;
        }
        .el-upload--picture-card {
          width: 0;
          height: 0;
          border: none;
          position: absolute;
          top: 0;
          right: 84px;
        }
        .get-video-btn {
          position: absolute;
          right: 5px;
          top: 40px;
        }
        .screen-shot-btn {
          position: absolute;
          right: 5px;
          top: 80px;
        }
      }
      .el-upload--picture-card {
        line-height: 1;
      }
      .el-upload-dragger {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 146px;
        width: auto;
        border: none;
      }
    }
    .el-form-item--small.el-form-item {
      margin-bottom: 5px;
    }
    .tct-diagnosis-TBS {
      font-size: 18px;
      font-weight: bold;
    }
    .tct-diagnosis-title {
      font-size: 16px;
      font-weight: bold;
    }

    .show-template {
      font-size: 14px;
      img {
        width: 20px;
        height: 17px;
      }
      & + .show-template {
        margin: 0 0 0 10px;
      }
    }
  }

</style>
