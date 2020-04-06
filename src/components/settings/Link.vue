<template>
    <div>
        <el-row :gutter="10">
          <el-col :span="3"><h2>链接信息</h2></el-col>
          <el-col :span="3" :offset="15">
            <el-select v-model="category" filterable placeholder="根据项目筛选" size="small" v-on:change="filterLink"
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
            <el-button @click.native="initLinkForm()" @click="dialogFormVisible = true" type="primary" icon="el-icon-plus" size="small" circle plain></el-button>
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
            prop="name"
            label="链接名称" v-if="getRole(1)">
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
            label="链接名称" v-else>
            </el-table-column>
            <el-table-column
            prop="url"
            label="URL">
            <template slot-scope="scope">
              <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
            </template>
            </el-table-column>
            <el-table-column
            prop="category"
            label="项目组">
            </el-table-column>
            <el-table-column label="操作" width="360">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" circle plain
                                @click.native="editLink(tableData[scope.$index]['id'])">
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" circle plain
                                @click.native="sureView(deleteLink,tableData[scope.$index]['id'],tableData[scope.$index]['name'])">
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

        <el-dialog title="链接配置" :visible.sync="dialogFormVisible">
          <el-form :model="linkForm" :rules="rules" ref="linkForm" label-width="100px" class="demo-linkForm">
              <el-form-item label="名称" prop="name" size="small">
                  <el-input v-model="linkForm.name" class="commonwidth"></el-input>
              </el-form-item>
              <el-form-item label="URL" prop="url" size="small">
                  <el-input v-model="linkForm.url" class="commonwidth"></el-input>
              </el-form-item>
              <el-form-item label="Username" prop="username" size="small">
                  <el-input v-model="linkForm.username" class="commonwidth"></el-input>
              </el-form-item>
              <el-form-item label="Password" prop="password" size="small">
                  <el-input v-model="linkForm.password" class="commonwidth"></el-input>
              </el-form-item>
              <el-form-item label="项目组" prop="category_id" size="small">
                  <el-select v-model="linkForm.category_id" placeholder="请选择项目组">
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
              <el-button v-if="editFlag === true" type="primary" @click="editLinkBtn(linkForm['id'])">确 定</el-button>
              <el-button v-else type="primary" @click="addLinkBtn()">新 建</el-button>
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
        editFlag: false,
        dialogFormVisible: false,
        linkForm: {
          id: Number,
          name: '',
          url: '',
          username: '',
          password: '',
          category_id: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' },
            { min: 1, max: 60, message: '长度在 1 到 60 个字符', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '请输入URL', trigger: 'blur' },
            { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
          ],
          username: [
            { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
          ],
          password: [
            { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
          ],
          category_id: [
            { required: true, message: '请选择项目组', trigger: 'change' }
          ],
        },
        tableData: []
      }
    },
    mounted() {
      this.linkList();
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
      linkList(){
        this.$axios.get(this.$api.linkList, 
        {
          params: {page: this.currentPage, size: this.pageSize, category_id: this.category}
        }).then((response) => {
          if (this.messageShow(this, response)){
            this.tableData = response.data['res']
            this.total = response.data['total']
          }
        })
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.linkList()
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.linkList()
      },
      initLinkForm(){
          this.linkForm.id = Array();
          this.linkForm.name = null;
          this.linkForm.url = null;
          this.linkForm.username = null;
          this.linkForm.password = null;
          this.linkForm.category_id = parseInt(localStorage.getItem('category_id'));
      },
      editLink(id){
        this.editFlag = true
        this.$axios.get((this.$api.linkManage + '/' + id)).then((response) => {
          this.linkForm.id = id
          this.linkForm.name = response.data['res']['name']
          this.linkForm.url = response.data['res']['url']
          this.linkForm.username = response.data['res']['username']
          this.linkForm.password = response.data['res']['password']
          this.linkForm.category_id = response.data['res']['category_id']
        })
        this.dialogFormVisible = true
      },
      deleteLink(id){
        this.$axios.delete((this.$api.linkManage + '/' + id)).then((response) => {
          if (this.messageShow(this, response)){
            this.linkList();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      addLinkBtn(){
        let data = {
          "name": this.linkForm.name,
          "url": this.linkForm.url,
          "username": this.linkForm.username,
          "password": this.linkForm.password,
          "category_id": this.linkForm.category_id
        }
        this.$axios.post(this.$api.linkManage, data).then((response) => {
          if (this.messageShow(this, response)){
            this.dialogFormVisible = false;
            this.linkList();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      editLinkBtn(id){
        let data = {
          "name": this.linkForm.name,
          "url": this.linkForm.url,
          "username": this.linkForm.username,
          "password": this.linkForm.password,
          "category_id": this.linkForm.category_id
        }
        this.$axios.put((this.$api.linkManage + '/' + id), data).then((response) => {
          if (this.messageShow(this, response)){
            this.dialogFormVisible = false;
            this.editFlag = false;
            this.linkList();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      cancelBtn(){
        this.dialogFormVisible = false;
        this.initLinkForm();
        this.editFlag = false;
      },
      filterLink(){
        this.linkList()
      },
      refreshList(){
        this.category = null
        this.linkList()
      }
    }
  }
</script>