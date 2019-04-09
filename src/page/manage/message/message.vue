<template>
  <div class="main-container doperate-page" v-loading.fullscreen="loading">
    <el-row class="fixed-head" type="flex" align="button"
            justify="space-between">
      <el-row type="flex" align="middle">
        <div class="back-icon" @click="backList">
          <i class="el-icon-back"></i>
        </div>
        <el-tabs v-model="activeName" type="card" class="nav-top">
          <el-tab-pane :label="tab.label" :name="tab.name"
                       v-for="tab in tabList" :key="tab.id">
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-row>
    <tct-content v-if="caseType==='细胞'&&caseInfoForm.specimen_type==='宫颈细胞'" class="doperate-child-page"
                 v-show="activeName==='diagnosis'"
                 :case-info-form="caseInfoForm"
                 :readonly="isReadonly"
                 :diagnosis="writeDiagnosisForm"></tct-content>
    <diagnosis-content
      v-if="caseType&&caseInfoForm.specimen_type&&!(caseType==='细胞'&&caseInfoForm.specimen_type==='宫颈细胞')"
      ref="doctorAdvice" class="doperate-child-page" v-show="activeName==='diagnosis'"
      :case-info-form="caseInfoForm"
      :readonly="isReadonly"
      :diagnosis="writeDiagnosisForm"
    ></diagnosis-content>
    <register-info class="doperate-child-page" v-show="activeName==='register'"
                   :case-info-form="caseInfoForm"
                   :case-type="caseType"></register-info>
    <materials-info class="doperate-child-page" v-show="activeName==='materials'"
                    :specimen-info-form="caseInfoForm"></materials-info>
    <!--特检医嘱-->
    <doctor-advice class="doperate-child-page" v-show="activeName==='special'"
                    :case-type=caseType type="special"
                    :advice-data="specialInspectionAdvice"></doctor-advice>
    <!--技术医嘱-->
    <doctor-advice class="doperate-child-page" v-show="activeName==='technical'"
                   type="technical"
                   :case-type="caseType"
                   :advice-data="caseInfoForm.technicalAdvice.data"></doctor-advice>
  </div>
</template>

<script src="./message.component.js"></script>

<style src="./message.scss"></style>
