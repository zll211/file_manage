<template>
  <div class="loginWrapper">
      <div class="content">
        <div class="leftShow"></div>
        <div class="loginBox">
          <div class="loginLogo"></div>
          <h3 class="systemName">文件管理系统</h3>
          <el-form label-position="top" label-width="80px" :model="loginForm" ref="loginForm" :rules="loginRules" >
            <el-form-item  prop="username" >
              <el-input v-model="loginForm.username" :auto-complete="rememberPassChecked ? 'on' : 'off'" placeholder="请输入用户名" >
                <i slot="prefix" class="loginUIcon"></i>
              </el-input>
            </el-form-item>
            <el-form-item  prop="password">
              <el-input type="password" v-model="loginForm.password" :auto-complete="rememberPassChecked ? 'on' : 'off'" v-on:keyup.enter.native="login('loginForm')" placeholder="请输入密码">
                <i slot="prefix" class="loginPIcon"></i>
              </el-input>
            </el-form-item>
            <el-row type="flex" justify="space-between">
              <el-checkbox label="记住密码" name="rememberPass" v-model="rememberPassChecked"></el-checkbox>
            </el-row>
            <el-form-item class="loginBtn">
              <el-button type="primary" @click="login('loginForm')" plain>登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <footer>
        <p>{{version}}</p>
        <p>版权 杭州智团©2018</p>
      </footer>
      <!--<header>-->
        <!--<h3 class="left">杭州智团病理信息管理系统</h3>-->
        <!--<p class="right"><a href="#">U盾软件下载</a><a href="https://www.google.cn/chrome/" target="_blank">浏览器下载</a></p>-->
        <!--<p class="clear"></p>-->
      <!--</header>-->
      <!--<div class="content">-->
        <!--<div class="loginBox">-->
          <!--<h3 class="hospitalName">{{setting.hospital_name||hospitalName}}</h3>-->
          <!--<el-form label-position="top" label-width="80px" :model="loginForm" ref="loginForm" :rules="loginRules" >-->
            <!--<el-form-item label="用户名" prop="username" >-->
              <!--<el-input v-model="loginForm.username" :auto-complete="rememberPassChecked ? 'on' : 'off'"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="密码" prop="password">-->
              <!--<el-input type="password" v-model="loginForm.password" :auto-complete="rememberPassChecked ? 'on' : 'off'" v-on:keyup.enter.native="login('loginForm')"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-row type="flex" justify="space-between">-->
              <!--<el-checkbox label="记住密码" name="rememberPass" v-model="rememberPassChecked"></el-checkbox>-->
              <!--&lt;!&ndash;<a class="forget-password">忘记密码？</a>&ndash;&gt;-->
            <!--</el-row>-->
            <!--<el-form-item>-->
              <!--<el-button type="primary" @click="login('loginForm')" plain>登录</el-button>-->
              <!--&lt;!&ndash;<el-button @click="ukey()" type="primary" plain>Ukey</el-button>&ndash;&gt;-->
            <!--</el-form-item>-->
          <!--</el-form>-->
        <!--</div>-->
      <!--</div>-->
      <!--<footer>-->
        <!--<p>版权 杭州智团©2018</p>-->
      <!--</footer>-->
  </div>
</template>

<script src="./login.component.js"></script>
<style lang="scss" src="./login.scss"></style>
