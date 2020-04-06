<template>
    <div>
        <el-row :gutter="10">
          <el-col :span="3"><h2>项目</h2></el-col>
          <el-col :span="3" :offset="18" style=padding-top:18px>
            <el-button @click.native="initProjectForm()" @click="dialogFormVisible=true" type="primary" icon="el-icon-plus" size="small" circle plain></el-button>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
            prop="id"
            label="ID."
            width="50">
            </el-table-column>
            <el-table-column
            prop="name"
            label="项目"
            width="100">
            </el-table-column>
            <el-table-column
            prop="deploy_path"
            label="部署包下载路径"
            width="200">
            </el-table-column>
            <el-table-column
            prop="project_emails"
            label="项目邮件组">
            </el-table-column>
            <el-table-column
            prop="version_number"
            label="版本数"
            width="100">
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" circle plain
                                @click.native="editProject(tableData[scope.$index]['id'])">
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" circle plain
                                @click.native="sureView(deleteProject,tableData[scope.$index]['id'],tableData[scope.$index]['name'])">
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

        <el-dialog title="项目配置" :visible.sync="dialogFormVisible">
          <el-form :model="projectForm" :rules="rules" ref="projectForm" label-width="150px" class="demo-projectForm">
              <el-form-item label="项目名称" prop="name" size="small">
                  <el-input v-model="projectForm.name" class="commonwidth"></el-input>
              </el-form-item>
              <el-form-item label="部署包下载路径" prop="deploy_path" size="small">
                  <el-input v-model="projectForm.deploy_path" class="commonwidth" placeholder="/home/OtherTemp/"></el-input>
              </el-form-item>
              <el-form-item label="项目邮件组" prop="project_emails" size="small">
                  <el-input type="textarea" v-model="projectForm.project_emails" class="commonwidth" placeholder="邮箱用`,`隔开"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="chanceBtn()">取 消</el-button>
              <el-button v-if="editFlag === true" type="primary" @click="editProjectBtn(projectForm['id'])">确 定</el-button>
              <el-button v-else type="primary" @click="addProjectBtn()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        editFlag: false,
        dialogFormVisible: false,
        projectForm: {
          id: Number,
          name: '',
          deploy_path: '',
          project_emails: '',
        },
        rules: {
          name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' },
            { min: 1, max: 60, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ],
          deploy_path: [
            { required: false, message: '请输入部署包下载路径', trigger: 'blur' }
          ],
          project_emails: [
            { required: false, message: '请输入项目邮件组', trigger: 'blur' },
            { min: 1, max: 256, message: '长度在 1 到 256 个字符', trigger: 'blur' }
          ]
        },
        tableData: []
      }
    },
    mounted() {
      this.projectList();
    },
    methods: {
      projectList(){
        this.$axios.get(this.$api.projectList, 
        {
          params: {page: this.currentPage, size: this.pageSize}
        }).then((response) => {
          if (this.messageShow(this, response)){
            this.tableData = response.data['res']
            this.total = response.data['total']
          }
        })
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.projectList()
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.projectList()
      },
      initProjectForm(){
          this.projectForm.id = Array();
          this.projectForm.name = null;
          this.projectForm.deploy_path = null;
          this.projectForm.project_emails = null;
      },
      editProject(id){
        this.editFlag = true
        this.$axios.get((this.$api.projectManage + '/' + id)).then((response) => {
          this.projectForm.id = id
          this.projectForm.name = response.data['res']['name']
          this.projectForm.deploy_path = response.data['res']['deploy_path']
          this.projectForm.project_emails = response.data['res']['project_emails']
        })
        this.dialogFormVisible = true
      },
      deleteProject(id){
        this.$axios.delete((this.$api.projectManage + '/' + id)).then((response) => {
          if (this.messageShow(this, response)){
            this.projectList();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      addProjectBtn(){
        let data = {
          "name": this.projectForm.name,
          "deploy_path": this.projectForm.deploy_path,
          "project_emails": this.projectForm.project_emails
        }
        this.$axios.post(this.$api.projectManage, data).then((response) => {
          if (this.messageShow(this, response)){
            this.dialogFormVisible = false;
            this.projectList();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      editProjectBtn(id){
        let data = {
          "name": this.projectForm.name,
          "deploy_path": this.projectForm.deploy_path,
          "project_emails": this.projectForm.project_emails
        }
        this.$axios.put((this.$api.projectManage + '/' + id), data).then((response) => {
          if (this.messageShow(this, response)){
            this.dialogFormVisible = false;
            this.editFlag = false;
            this.projectList();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      chanceBtn(){
        this.dialogFormVisible = false;
        this.initProjectForm();
        this.editFlag = false;
      }
    }
  }
</script>