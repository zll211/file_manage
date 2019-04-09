import {dNormalService} from './message.service'
import diagnosisContent from './content/diagnosis-content.component';
import tctContent from './content/tct-content.component';
import registerInfo from './content/register-info.component';
import materialsInfo from './content/materials-info.component';
import doctorAdvice from './content/doctor-advice.component';

class TCT {
  constructor() {
    this.microbial = [{name: '放线菌', checked: false}, {name: '菌群转变', checked: false}, {
      name: '滴虫感染',
      checked: false,
    }, {name: '霉菌感染', checked: false}, {name: 'HPV感染', checked: false}, {name: '疱疹病毒感染', checked: false}];
    this.squamous_cell = [{
      name: '未见上皮内病变',
      checked: false,
      children: [{name: '正常', checked: false}, {name: '炎症', checked: false}, {
        name: '表皮细胞萎缩',
        checked: false,
      }, {name: '宫内节育器反应', checked: false}, {name: '妊娠反应', checked: false}, {name: '放疗反应', checked: false}, {
        name: '其他',
        checked: false,
      }],
    }, {
      name: '非典型鳞状细胞',
      checked: false,
      children: [{name: '不能明确意义', checked: false}, {name: '倾向上皮细胞内高度病变', checked: false}],
    }, {
      name: '上皮内低度病变',
      checked: false,
      children: [],
    }, {
      name: '上皮内高度病变',
      checked: false,
      children: [{name: 'CIN-II级', checked: false}, {name: 'CIN-III级', checked: false}],
    }, {
      name: '鳞状细胞癌',
      checked: false,
      children: [],
    }];
    this.glandular_cell = [{
      name: '非典型性腺细胞',
      checked: false,
      children: [{name: '宫内膜', checked: false}, {name: '来源不明', checked: false}],
    }, {
      name: '可疑腺癌',
      checked: false,
      children: [],
    }, {
      name: '非典型性腺细胞(宫颈管)',
      checked: false,
      children: [{name: '倾向原位腺癌', checked: false}, {name: '不能明确意义', checked: false}, {
        name: '倾向良性反应性改变',
        checked: false,
      }],
    }, {
      name: '腺癌',
      checked: false,
      children: [{name: '宫颈管', checked: false}, {name: '宫内膜', checked: false}, {name: '其他', checked: false}],
    }];
  }
}


export default {
  data() {
    return {
      activeName: 'diagnosis',
      caseType: '',
      caseInfoForm: {
        ext: {},
        specimen: {},
        drawMaterial: {},
        technicalAdvice: {data: []},
      },
      loading: false,
      specialInspectionAdvice: [],
      writeDiagnosisForm: {},
    }

  },
  components: {
    diagnosisContent,
    tctContent,
    registerInfo,
    materialsInfo,
    doctorAdvice,
  },
  computed: {
    tabList: function () {
      let tabList = [];
      if ((this.caseType === '常规' || this.caseType === '冰冻')
        && this.caseInfoForm.outside_register_type !== '玻片' && this.caseInfoForm.outside_register_type !== '蜡块') {
        tabList = [{
          id: 1,
          label: '下诊断',
          name: 'diagnosis',
        }, {
          id: 2,
          label: '病例信息',
          name: 'register',
        }, {
          id: 3,
          label: '取材信息',
          name: 'materials',
        }];
      } else if (this.caseType === '细胞' || this.caseInfoForm.outside_register_type === '玻片' || this.caseInfoForm.outside_register_type === '蜡块') {
        tabList = [{
          id: 1,
          label: '下诊断',
          name: 'diagnosis',
        }, {
          id: 2,
          label: '病例信息',
          name: 'register',
        }];
      }
      if (this.caseInfoForm?.technicalAdvice?.data?.length > 0) {
        tabList = tabList.concat([{
          id: 6,
          label: '技术医嘱',
          name: 'technical',
        }]);
      }
      if (this.specialInspectionAdvice.length > 0) {
        tabList = tabList.concat([{
          id: 7,
          label: '特检医嘱',
          name: 'special',
        }]);
      }
      return tabList;
    },
    isReadonly: function () {
      return !!(~['已签发', '已打印', '已发放'].indexOf(this.caseInfoForm.status));
    },
  },
  props: ['id'],
  created() {
    this.registerInfo();
    // this.diagnosisInfo();
    // this.getTemplateList();
    // this.processConfigList();
  },
  methods: {
    backList() {
      this.$router.back()
    },
    registerInfo() {
      this.loading = true;
      return dNormalService.pathologyMessages(this.id)
        .then((res) => {
          if (res.body?.ret_code ===0) {
            this.caseInfoForm = res.body.data;
            this.caseInfoForm.age = this.caseInfoForm.age + this.caseInfoForm.age_unit;
            this.caseInfoForm.ext = this.caseInfoForm.ext.data;
            this.caseType = this.caseInfoForm.case_type;
            this.caseInfoForm.specimenTotalName = '';
            this.caseInfoForm.imgs = this.caseInfoForm.img.data;
            this.caseInfoForm.hasImg = !!this.caseInfoForm.img.data.length;
            this.caseInfoForm.drawMaterial = this.caseInfoForm.draw_material?.data || {};
            this.caseInfoForm.specimen.data.forEach((specimen) => {
              this.caseInfoForm.specimenTotalName += specimen.specimen_name + ',';
            });
            this.specialInspectionAdvice = this.caseType === '常规' ? this.caseInfoForm?.specialProductionRoutine?.data :
              this.caseInfoForm?.specialProductionCell?.data;
            this.diagnosisInfo();
          } else {
            this.$message.error('获取病理信息失败');
            this.backList();
          }
        }).catch((error) => {
          this.$message.error('获取病理信息失败');
          this.backList();
        }).finally(() => {
          this.loading = false;
        });
    },
    diagnosisInfo() {
      if (this.caseType === '细胞' && this.caseInfoForm?.specimen_type === '宫颈细胞') {
        let form = Object.assign({}, this.caseInfoForm.tct_report.data);
        const writeDiagnosisForm = {
          specimen_satisfaction: form?.specimen_satisfaction,
          imgList: form?.tct_imgList ? form.tct_imgList.map((item, index) => ({
            url: item,
            name: index + 1,
          })) : [],
          epithelium_count: form?.epithelium_count,
          neck_canal_cell_count: form?.neck_canal_cell_count,
          metaplastic_cell_count: form?.metaplastic_cell_count,
          inflammation: form?.inflammation,
          tct_diagnostic: form?.tct_diagnostic,
          tct_content: form?.tct_content || [],
          microbial: form?.tct_content?.[0] || {},
          squamous_cell: form?.tct_content?.[1] || {},
          glandular_cell: form?.tct_content?.[2] || {},
        };
        if (!writeDiagnosisForm.tct_content || writeDiagnosisForm.tct_content.length === 0) {
          writeDiagnosisForm.microbial = new TCT().microbial;
          writeDiagnosisForm.squamous_cell = new TCT().squamous_cell;
          writeDiagnosisForm.glandular_cell = new TCT().glandular_cell;
        }
        this.writeDiagnosisForm = writeDiagnosisForm;
      }
      else {
        this.writeDiagnosisForm = {
          mirror: this.caseInfoForm?.see_under_microscope,
          imgList: this.caseInfoForm?.appended_drawings ? this.caseInfoForm?.appended_drawings.map((item, index) => ({
            url: item,
            name: index + 1,
          })) : [],
          advice: this.caseInfoForm?.diagnostic_opinion,
          remark: this.caseInfoForm?.note_suggestion,
        };
      }
    },

  }
}
