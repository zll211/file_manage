import {loginService} from './login.service';
import {httpHelperProvider} from '@/config/http';

import {
  baseRoutes,
} from '../../../config/utils';

export default {
  data() {
    return {
      setting: {},
      hospitalName: '杭州智团病理管理',
      version: 'v1.0.0',
      rememberPassChecked: false,
      loginForm: {
        username: '',
        password: '',
      },
      loginRules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
      },
    };
  },
  created() {

  },
  computed: {},
  methods: {
    login(formName) {
      if (!this.$refs[formName]) return;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          loginService.login(this.loginForm)
            .then(({body}) => {
              if (body?.ret_code ===0) {
                this.$store.commit('isLogin', true);
                this.$store.commit('setURL', baseRoutes);
                this.$store.commit('setMenus', []);
                this.$store.commit('setUser', body.data.user);
                this.$router.replace('/manage');
                window.sessionStorage.setItem('accessToken',
                  body.data.access_token);
                window.sessionStorage.setItem('user',
                  JSON.stringify(body.data.user));
                httpHelperProvider.setHeaders([{
                  'Authorization': `${body.data.access_token}`,
                }]);
              } else {
                this.$message.error(body?.ret_msg || '登录失败');
              }
          }).catch(() => {
            this.$message.error('登录失败');
          })
        } else {
          return false;
        }
      });
    },
  },
};
