<template>
  <div>
      <el-row>
          <el-col :span="10" :offset="14">
          <el-menu :default-active="activeIndex" :router="true" class="el-menu-demo" mode="horizontal">
                  <el-menu-item index="/">首页</el-menu-item>
                  <el-menu-item index="/about">关于</el-menu-item>
                  <el-submenu index="1"><template slot="title">新建</template>
                      <el-menu-item index="/management/plans/create">计划</el-menu-item>
                  </el-submenu>
                  <el-submenu index="2"><template slot="title">环境链接</template>
                      <el-menu-item v-for="link in links" v-bind:key="link.linkName">
                        <a :href="link.url" target="_blank">{{ link.name }}</a>
                      </el-menu-item>
                  </el-submenu>
                  <el-submenu index="3"><template slot="title">环境拓扑</template>
                      <el-menu-item @click.native="newTopo()">新建</el-menu-item>
                      <hr>
                      <el-menu-item v-for="topo in topos" v-bind:key="topo.id">
                        <a :href="topo.url" target="_blank">{{ topo.name }}</a>
                      </el-menu-item>
                  </el-submenu>
                  <el-submenu v-if="username != null" index="4"><template slot="title">{{ username }}</template>
                      <el-menu-item @click.native="logout()">Logout</el-menu-item>
                      <el-menu-item @click.native="changePassword()">修改密码</el-menu-item>
                  </el-submenu>
                  <el-submenu v-else index="4"><template slot="title">Login</template>
                      <el-menu-item index="/login">Login</el-menu-item>
                      <el-menu-item @click.native="register()">Register</el-menu-item>
                  </el-submenu>
          </el-menu>
          </el-col>
      </el-row>

        <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="30%">
          <el-form :model="passwordForm" :rules="rules" ref="passwordForm" label-width="100px">
              <el-form-item label="密码" prop="password" size="small">
                  <el-input v-model="passwordForm.password" class="password" type="password"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="passwordConfirm" size="small">
                  <el-input v-model="passwordForm.passwordConfirm" class="password" type="password"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelBtn()">取 消</el-button>
              <el-button type="primary" @click="changePasswordBtn()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="用户注册" :visible.sync="registerFormVisible" width="30%">
          <el-form :model="registerForm" :rules="registerRules" ref="registerForm" label-width="100px">
              <el-form-item label="登录名称" prop="username" size="small">
                  <el-input v-model="registerForm.username" class="register" placeholder="请输入登录名称，如：zhangsan"></el-input>
              </el-form-item>
              <el-form-item label="用户姓名" prop="name" size="small">
                  <el-input v-model="registerForm.name" class="register" placeholder="请输入显示名称，如：张三"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password" size="small">
                  <el-input v-model="registerForm.password" class="register" type="password"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="passwordConfirm" size="small">
                  <el-input v-model="registerForm.passwordConfirm" class="register" type="password"></el-input>
              </el-form-item>
              <el-form-item label="电子邮件" prop="email" size="small">
                  <el-input v-model="registerForm.email" class="register"></el-input>
              </el-form-item>
              <el-form-item label="项目" prop="category_id" size="small">
                  <el-select v-model="registerForm.category_id" placeholder="请选择项目">
                    <el-option
                      v-for="item in categorys"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelRegisterBtn()">取 消</el-button>
              <el-button type="primary" @click="registerBtn()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="新建网络拓扑" :visible.sync="topoFormVisible" width="30%">
          <el-form :model="topoForm" :rules="topoRules" ref="topoForm" label-width="100px">
              <el-form-item label="拓扑名称" prop="name" size="small">
                  <el-input v-model="topoForm.name" class="register" placeholder="请输入拓扑名称"></el-input>
              </el-form-item>
          </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelTopoBtn()">取 消</el-button>
              <el-button type="primary" @click="topoBtn()">确 定</el-button>
            </div>
        </el-dialog>

  </div>
</template>

<script>
  import * as types from '@/store/types'
  export default {
    inject: ['reload'],
    props: ['categorys'],
    data() {
      return {
        topoFormVisible: false,
        dialogFormVisible: false,
        registerFormVisible: false,
        username: null,
        activeIndex: '1',
        links: [],
        topos: [],
        passwordForm: {
          password: '',
          passwordConfirm: ''
        },
        rules: {
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          passwordConfirm: [
            { required: true, message: '请再次输入密码', trigger: 'blur' }
          ]
        },
        registerForm: {
          username: '',
          name: '',
          password: '',
          passwordConfirm: '',
          email: '',
          category_id: null
        },
        registerRules: {
          username: [
            { required: true, message: '请输入用户登录名称', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入用户姓名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          passwordConfirm: [
            { required: true, message: '请再次输入密码', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入用户电子邮件', trigger: 'blur' }
          ],
          category_id: [
            { required: true, message: '请选择项目组', trigger: 'change' }
          ]
        },
        topoForm: {
          name: ''
        },
        topoRules: {
          name: [
            { required: true, message: '请输入环境拓扑图名称', trigger: 'blur' }
          ]
        }
      };
    },
    mounted() {
      this.linkList();
      this.topoList();
      this.getUsername()
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      initPasswordForm(){
        this.passwordForm.password = null
        this.passwordForm.passwordConfirm = null
      },
      initRegisterForm(){
        this.registerForm.username = null
        this.registerForm.name = null
        this.registerForm.password = null
        this.registerForm.passwordConfirm = null
        this.registerForm.email = null
        this.registerForm.category_id = null
      },
      linkList(){
        this.$axios.get(this.$api.linkList, 
        {
          params: {page: 1, size: 100, category_id: 17}
        }).then((response) => {
            this.links = response.data['res']
        })
      },
      topoList(){
        this.$axios.get(this.$api.topoList).then((response) => {
          this.topos = response.data['res']
        })
      },
      getUsername(){
        this.username = localStorage.getItem("username")
      },
      logout(){
        this.$axios.get(this.$api.logoutApi).then((response) => {
          if(this.messageShow(this, response)){
            this.$store.commit(types.LOGOUT);
            this.$router.push('/');
            this.reload()
          }
        })
      },
      changePassword(){
        this.initPasswordForm()
        this.dialogFormVisible = true
      },
      register(){
        this.registerFormVisible = true
      },
      cancelBtn(){
        this.initPasswordForm()
        this.dialogFormVisible = false
      },
      changePasswordBtn(){
        let data = {
          "username": this.username,
          "password": this.passwordForm.password,
          "password_confirm": this.passwordForm.passwordConfirm
        }
        this.$axios.put(this.$api.changePassword, data).then((response) => {
          if (this.messageShow(this, response)){
            this.dialogFormVisible = false;
            this.$router.push({path: '/login'});
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      cancelRegisterBtn(){
        this.initRegisterForm()
        this.registerFormVisible = false
      },
      registerBtn(){
        let data = {
          "username": this.registerForm.username,
          "name": this.registerForm.name,
          "password": this.registerForm.password,
          "password_confirm": this.registerForm.passwordConfirm,
          "email": this.registerForm.email,
          "category_id": this.registerForm.category_id
        }
        this.$axios.post(this.$api.userManage, data).then(response => {
          if (this.messageShow(this, response)){
            this.registerFormVisible = false;
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      newTopo(){
        this.topoFormVisible = true
      },
      cancelTopoBtn(){
        this.topoForm.name = null
        this.topoFormVisible = false
      },
      topoBtn(){
        let data = {
          "name": this.topoForm.name
        }
        this.$axios.post(this.$api.topoList, data).then(response => {
          if (this.messageShow(this, response)){
            this.topoFormVisible = false;
            var url = '#/topo/' + response.data['res']['id']
            window.open(url, '_blank')
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      }
    }
  }
</script>