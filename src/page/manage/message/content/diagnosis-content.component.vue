<template>
  <div>
    <el-row class="diagnosis-content">
      <el-row type="flex" align="middle">
        <span class="base-info-title flex-1">姓名：<span
          class="dark-color">{{caseInfoForm.patient_name}}</span></span>
        <span class="base-info-title flex-1">性别：<span
          class="dark-color">{{caseInfoForm.gender}}</span></span>
        <span class="base-info-title flex-1">年龄：<span
          class="dark-color">{{caseInfoForm.age}}</span></span>
        <span class="base-info-title flex-1">病理号：<span
          class="dark-color">{{caseInfoForm.id}}</span></span>
        <span class="flex-1"></span>
      </el-row>
      <el-row type="flex" align="middle">
         <span class="base-info-title flex-1">标本类型：<span
           class="dark-color">{{caseInfoForm.specimen_type}}</span></span>
        <span class="base-info-title flex-4">标本名称：<span
          class="dark-color">{{caseInfoForm.specimenTotalName}}</span></span>
      </el-row>
      <el-row type="flex" align="middle">
      <span class="base-info-title flex-3">临床诊断：<span
        class="dark-color">{{caseInfoForm.ext.clinical_opinions}}</span></span>
      </el-row>
      <el-row type="flex" align="middle">
         <span class="base-info-title flex-1">大体所见：<span
           class="dark-color">{{caseInfoForm.ext.clinical_opinions}}</span></span>
      </el-row>
      <div class="diagnosis-line"></div>
      <el-form :model="writeDiagnosisForm" ref="writeDiagnosisForm"
              >
        <el-row>
          <div class="flex align-items-center justify-content-between">
            <p class="diagnosis-title">镜下所见</p>
          </div>
          <el-form-item prop="mirror">
            <el-input type="textarea" v-model="writeDiagnosisForm.mirror"
                      :autosize="{ minRows: 4, maxRows: 4}"
                      :disabled="true"
                      :readonly=readonly></el-input>
          </el-form-item>
        </el-row>
        <div class="flex align-items-center justify-content-between"  :disabled="true">
          <p class="diagnosis-title">报告附图</p>
        </div>
        <div class="upload-report" v-if="readonly"  :disabled="true">
          <img class="upload-img" v-for="(img, index) in writeDiagnosisForm.imgList" :src="img.url">
        </div>
        <div class="flex align-items-center justify-content-between">
          <p class="diagnosis-title">诊断意见</p>
        </div>
        <el-form-item prop="advice">
          <el-input type="textarea" v-model="writeDiagnosisForm.advice"
                    :autosize="{ minRows: 4, maxRows: 4}"
                    :readonly="readonly"
                    :disabled="true"></el-input>
        </el-form-item>
        <p class="diagnosis-title">附注建议</p>
        <el-form-item prop="remark">
          <el-input type="textarea" v-model="writeDiagnosisForm.remark"
                    :autosize="{ minRows: 4, maxRows: 4}"
                    :readonly="readonly"
                    :disabled="true"></el-input>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        writeDiagnosisForm: {
          imgList: [],
        },
      };
    },
    props: {
      caseInfoForm: Object,
      diagnosis: Object,
      readonly: false,
    },
    mounted() {
    },
    watch: {
      diagnosis(val) {
        this.writeDiagnosisForm = Object.assign({imgList: []}, val);
      },
    },
    methods: {
    },
  };
</script>

<style lang="scss">
  @import "../../../../style/variables";
  $_pm-tree-color: #222222;
  .diagnosis-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 6px;
    .base-info-title {
      color: $_pm-default-light-color;
      .dark-color{
        color:$_pm-tree-color
      }
    }
    .diagnosis-line {
      margin: 10px 0 0;
      height: 0;
      width: 100%;
      border-bottom: 2px dashed #E9E9E9;
    }
    textarea {
      background-color: #F8F8F8 !important;
      border: 1px solid #E2E2E2 !important;
    }
    .diagnosis-title {
      padding: 14px 0;
      color: $_pm-tree-color;
    }
    .upload-report {
      position: relative;
      min-height: 80px;
      border: 1px solid #dcdfe6;
      padding: 10px 15px;
      border-radius: 4px;
      background-color: #F8F8F8;
      .upload-img {
        height: 120px;
        width: 150px;
        margin-right: 10px;
      }
    }
  }
</style>
