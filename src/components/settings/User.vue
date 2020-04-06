<template>
    <div>
        <el-row :gutter="10">
          <el-col :span="3"><h2>用户信息</h2></el-col>
          <el-col :span="6" :offset="12" style="padding-top:18px">
            <el-input placeholder="请输入用户名" v-model="filterInput" size="small">
              <el-select v-model="filterTag" slot="prepend" placeholder="请选择" class="select-inside">
                <el-option label="用户名" value="name"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click.native="filterBtn"></el-button>
            </el-input>
          </el-col>
          <el-col :span="1" style="padding-top:18px">
                <el-button type="primary" icon="el-icon-refresh" size="mini" plain
                            @click.native="refreshList">
                </el-button>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
            type="index"
            label="No."
            width="50">
            </el-table-column>
            <el-table-column
            prop="username"
            label="登录名">
            </el-table-column>
            <el-table-column
            prop="name"
            label="用户名">
            </el-table-column>
            <el-table-column
            prop="email"
            label="电子邮箱">
            </el-table-column>
            <el-table-column
            prop="category"
            label="项目组">
            </el-table-column>
            <el-table-column
            prop="role"
            label="权限等级">
            </el-table-column>
            <el-table-column label="操作" width="550">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" plain
                                @click.native="editUser(tableData[scope.$index]['id'])">Edit
                    </el-button>
                    <el-button type="warning" size="mini" plain
                                @click.native="opUser(tableData[scope.$index]['id'], 'resetPassword')">Reset Password
                    </el-button>
                    <el-button type="waring" size="mini" plain
                                @click.native="opUser(tableData[scope.$index]['id'], 'roleUp')">Role +1
                    </el-button>
                    <el-button type="warning" size="mini" plain
                                @click.native="opUser(tableData[scope.$index]['id'], 'roleDown')">Role -1
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" plain
                                @click.native="sureView(deleteUser,tableData[scope.$index]['id'],tableData[scope.$index]['name'])">Delete
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

        <el-dialog title="用户配置" :visible.sync="dialogFormVisible">
          <el-form :model="userForm" :rules="rules" ref="userForm" label-width="100px" class="demo-userForm">
              <el-form-item label="登陆名" prop="username" size="small">
                  <el-input v-model="userForm.username" class="commonwidth"></el-input>
              </el-form-item>
              <el-form-item label="用户名" prop="name" size="small">
                  <el-input v-model="userForm.name" class="commonwidth"></el-input>
              </el-form-item>
              <el-form-item label="电子邮箱" prop="email" size="small">
                  <el-input v-model="userForm.email" class="commonwidth"></el-input>
              </el-form-item>
              <el-form-item label="项目" prop="category_id" size="small">
                  <el-select v-model="userForm.category_id" placeholder="请选择项目">
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
              <el-button @click.native="cancelBtn()">取 消</el-button>
              <el-button type="primary" @click="editUserBtn(userForm['id'])">确 定</el-button>
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
        total: 0,
        editUserFlag: false,
        dialogFormVisible: false,
        userForm: {
          id: Number,
          username: '',
          name: '',
          email: '',
          category_id: null
        },
        rules: {
          username: [
            { required: true, message: '请输入登陆用户名', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入用户显示名称', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入电子邮件', trigger: 'blur' },
            { min: 1, max: 254, message: '长度在 1 到 254 个字符', trigger: 'blur' }
          ],
          category_id: [
            { required: true, message: '请选择项目组', trigger: 'change' }
          ]
        },
        tableData: [],
        filterInput: '',
        filterTag: 'name',
      }
    },
    mounted() {
      this.userList();
    },
    methods: {
      initUserForm(){
        this.userForm.id = Number,
        this.userForm.username = null,
        this.userForm.name = null,
        this.userForm.email = null,
        this.userForm.category_id = null
      },
      userList(){
        this.$axios.get(this.$api.userList, 
        {
          params: {page: this.currentPage, size: this.pageSize, name: this.filterInput}
        }).then((response) => {
            this.tableData = response.data['res']
            this.total = response.data['total']
        })
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.userList()
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.userList()
      },
      editUser(id){
        this.editTaskFlag = true
        this.$axios.get((this.$api.userManage + '/' + id)).then((response) => {
          this.userForm.id = id
          this.userForm.username = response.data['res']['username']
          this.userForm.name = response.data['res']['name']
          this.userForm.email = response.data['res']['email']
          this.userForm.category_id = response.data['res']['category_id']
        })
        this.dialogFormVisible = true
      },
      editUserBtn(id){
        let data = {
          "username": this.userForm.username,
          "name": this.userForm.name,
          "email": this.userForm.email,
          "category_id": this.userForm.category_id
        }
        this.$axios.put((this.$api.userManage + '/' + id), data).then((response) => {
          if (this.messageShow(this, response)){
            this.dialogFormVisible = false;
            this.editUserFlag = false;
            this.userList();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      opUser(id, operation){
        this.$axios.get((this.$api.userOperation.replace(/OPERATION/g, operation) + '/' + id)).then((response) => {
          if (this.messageShow(this, response)){
            this.userList()
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      deleteUser(id){
        this.$axios.delete((this.$api.userManage + '/' + id)).then((response) => {
          if (this.messageShow(this, response)){
            this.userList();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      cancelBtn(){
        this.dialogFormVisible = false;
        this.initUserForm();
        this.editUserFlag = false;
      },
      refreshList(){
        this.filterInput = null
        this.userList()
      },
      filterBtn(){
        this.userList()
      }
    }
  }
</script>

<style scoped>
.select-inside {
  width: 100px;
}
</style>