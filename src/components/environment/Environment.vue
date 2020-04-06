<template>
    <div>
        <el-row :gutter="10">
          <el-col :span="3"><h2>环境信息</h2></el-col>
          <el-col :span="3" :offset="15">
            <el-select v-model="category" filterable placeholder="根据项目筛选" size="small" v-on:change="filterEnv"
            style="padding-top:16px">
              <el-option
                v-for="item in categorys"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>          
          </el-col>
          <el-col :span="1" style="padding-top:18px">
                <el-button type="primary" icon="el-icon-refresh" size="mini" plain
                            @click.native="refreshList">
                </el-button>
          </el-col>
          <el-col :span="1" style=padding-top:16px>
            <el-button @click.native="addBtn()" type="primary" icon="el-icon-plus" size="small" circle plain></el-button>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-table
            :data="tableEnvironmentData"
            stripe
            style="width: 100%">
            <el-table-column
            type="index"
            label="No."
            width="50">
            </el-table-column>
            <el-table-column
            prop="name"
            label="名称" v-if="getRole(2)">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                    <p>用户名: {{ scope.row.username }}</p>
                    <p>密码: {{ scope.row.password }}</p>
                    <div slot="reference" class="name-wrapper">
                        <el-tag size="medium">{{ scope.row.name }}</el-tag>
                    </div>
                    </el-popover>
                </template>          
            </el-table-column>
            <el-table-column
            prop="name"
            label="名称" v-else>
            </el-table-column>
            <el-table-column
            prop="type"
            label="类型">
            </el-table-column>
            <el-table-column
            prop="category"
            label="项目组">
            </el-table-column>
            <el-table-column
            prop="ip"
            label="IP">
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" circle plain
                                @click.native="editEnvironment(tableEnvironmentData[scope.$index]['id'])">
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" circle plain
                                @click.native="sureView(deleteEnvironment,tableEnvironmentData[scope.$index]['id'],tableEnvironmentData[scope.$index]['name'])">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-row type="flex" justify="end">
          <el-col :span="12" style=padding-top:24px>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </el-col>
        </el-row>
        
        <el-dialog title="环境配置" :visible.sync="dialogFormVisible">
          <el-form :model="environmentForm" :rules="rules" ref="environmentForm" label-width="150px" class="demo-environmentForm">
              <el-form-item label="名称" prop="name" size="small">
                  <el-input v-model="environmentForm.name" class="commonwidth"></el-input>
              </el-form-item>
              <el-form-item label="IP" prop="ip" size="small">
                  <el-input v-model="environmentForm.ip" class="commonwidth" placeholder="10.10.10.10"></el-input>
              </el-form-item>
              <el-form-item label="后台登陆账号" prop="username" size="small">
                  <el-input v-model="environmentForm.username" class="commonwidth"></el-input>
              </el-form-item>
              <el-form-item label="后台登陆密码" prop="password" size="small">
                  <el-input v-model="environmentForm.password" class="commonwidth"></el-input>
              </el-form-item>
              <el-form-item label="类型" prop="type" size="small">
                  <el-select v-model="environmentForm.type" placeholder="请选择环境类型">
                    <el-option
                      v-for="item in environmentTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="项目组" prop="category_id" size="small">
                  <el-select v-model="environmentForm.category_id" placeholder="请选择项目组">
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
              <el-button @click="cancelBtn()">取 消</el-button>
              <el-button v-if="editEnvFlag === true" type="primary" @click="editEnvironmentBtn(environmentForm['id'])">确 定</el-button>
              <el-button v-else type="primary" @click="addEnvironmentBtn()">新 建</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    props: ['categorys'],
    data() {
      return {
        currentPage: 1,
        pageSize: 10,
        category: parseInt(localStorage.getItem('category_id')),
        total: 0,
        editEnvFlag: false,
        dialogFormVisible: false,
        environmentForm: {
          id: Number,
          name: '',
          ip: '',
          username: '',
          password: '',
          type: '',
          category_id: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入环境名称', trigger: 'blur' },
            { min: 1, max: 60, message: '长度在 1 到 60 个字符', trigger: 'blur' }
          ],
          ip: [
            { required: true, message: '请输入IP地址', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          username: [
            { required: true, message: '请输入后台登陆账号', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入后台登陆密码', trigger: 'blur' },
            { min: 1, max: 60, message: '长度在 1 到 60 个字符', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择环境类型', trigger: 'blur' }
          ],
          category_id: [
            { required: true, message: '请选择项目组', trigger: 'blur' }
          ]
        },
        environmentTypes: [{
          value: 'UCO',
          label: 'UCO'
        }, {
          value: 'UCA',
          label: 'UCA'
        }, {
          value: 'CVM',
          label: 'CVM'
        }, {
          value: 'CVK',
          label: 'CVK'
        }, {
          value: 'VCFC',
          label: 'VCFC'
        }, {
          value: 'CMP',
          label: 'CMP'
        }],
        tableEnvironmentData: []
      }
    },
    mounted() {
      this.environmentList();
    },
    methods: {
      getRole(num){
        this.role = localStorage.getItem("role")
        if(this.role >= num){
          return true
        }else{
          return false
        }
      },
      environmentList(){
        this.$axios.get(this.$api.environmentList, 
        {
          params: {page: this.currentPage, size: this.pageSize, category_id: this.category}
        }).then((response) => {
          if (this.messageShow(this, response)){
            this.tableEnvironmentData = response.data['res']
            this.total = response.data['total']
          }
        })
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.environmentList()
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.environmentList()
      },
      initEnvForm(){
        this.environmentForm.name = null,
        this.environmentForm.ip = null,
        this.environmentForm.username = null,
        this.environmentForm.password = null,
        this.environmentForm.type = null,
        this.environmentForm.category_id = parseInt(localStorage.getItem('category_id'))
      },
      addBtn(){
        this.initEnvForm()
        this.editEnvFlag = false
        this.dialogFormVisible = true
      },
      editEnvironment(id){
        this.editEnvFlag = true
        this.$axios.get((this.$api.environmentManage + '/' + id)).then((response) => {
          this.environmentForm.id = id
          this.environmentForm.name = response.data['res']['name']
          this.environmentForm.ip = response.data['res']['ip']
          this.environmentForm.username = response.data['res']['username']
          this.environmentForm.password = response.data['res']['password']
          this.environmentForm.type = response.data['res']['type']
          this.environmentForm.category_id = response.data['res']['category_id']
        })
        this.dialogFormVisible = true
      },
      deleteEnvironment(id){
        this.$axios.delete((this.$api.environmentManage + '/' + id)).then((response) => {
          if (this.messageShow(this, response)){
            this.environmentList();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      addEnvironmentBtn(){
        let data = {
          "name": this.environmentForm.name,
          "ip": this.environmentForm.ip,
          "username": this.environmentForm.username,
          "password": this.environmentForm.password,
          "type": this.environmentForm.type,
          "category_id": this.environmentForm.category_id
        }
        this.$axios.post(this.$api.environmentManage, data).then((response) => {
          if (this.messageShow(this, response)){
            this.dialogFormVisible = false;
            this.environmentList();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      editEnvironmentBtn(id){
        let data = {
          "name": this.environmentForm.name,
          "ip": this.environmentForm.ip,
          "username": this.environmentForm.username,
          "password": this.environmentForm.password,
          "type": this.environmentForm.type,
          "category_id": this.environmentForm.category_id
        }
        this.$axios.put((this.$api.environmentManage + '/' + id), data).then((response) => {
          if (this.messageShow(this, response)){
            this.dialogFormVisible = false;
            this.editEnvFlag = false;
            this.environmentList();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      cancelBtn(){
        this.dialogFormVisible = false;
        this.initEnvForm();
        this.editEnvFlag = false;
      },
      filterEnv(){
        this.environmentList()
      },
      refreshList(){
        this.category = null
        this.environmentList()
      }
    }
  }
</script>