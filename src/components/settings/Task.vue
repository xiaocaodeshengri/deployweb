<template>
    <div>
        <el-row :gutter="10">
          <el-col :span="3"><h2>定时任务</h2></el-col>
          <el-col :span="3" :offset="18" style=padding-top:18px>
            <el-button @click.native="addBtn()" type="primary" icon="el-icon-plus" size="small" circle plain></el-button>
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
            prop="title"
            label="标题"
            width="150">
            </el-table-column>
            <el-table-column
            prop="task_url"
            label="URL">
            </el-table-column>
            <el-table-column
            prop="email"
            label="Emails"
            width="280">
            </el-table-column>
            <el-table-column
            prop="cron"
            label="CRON">
            </el-table-column>
            <el-table-column label="操作" width="360">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" plain
                                @click.native="editTask(tableData[scope.$index]['id'])">Edit
                    </el-button>
                    <el-button type="info" size="mini" plain
                                @click.native="opTask(tableData[scope.$index]['id'], 'run')">Run
                    </el-button>
                    <el-button type="success" size="mini" v-if="tableData[scope.$index]['status'] === 0" plain
                                @click.native="opTask(tableData[scope.$index]['id'], 'start')">Start
                    </el-button>
                    <el-button type="danger" size="mini" v-else plain
                                @click.native="opTask(tableData[scope.$index]['id'], 'stop')">Stop
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" plain
                                @click.native="sureView(deleteTask,tableData[scope.$index]['id'],tableData[scope.$index]['title'])">
                        Delete
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

        <el-dialog title="定时任务配置" :visible.sync="dialogFormVisible">
          <el-form :model="taskForm" :rules="rules" ref="taskForm" label-width="150px" class="demo-taskForm">
              <el-form-item label="定时任务名称" prop="title" size="small">
                  <el-input v-model="taskForm.title" class="commonwidth"></el-input>
              </el-form-item>
              <el-form-item label="任务URL" prop="task_url" size="small">
                  <el-input v-model="taskForm.task_url" class="commonwidth" placeholder="/api/taskx/"></el-input>
              </el-form-item>
              <el-form-item label="电子邮件" prop="email" size="small">
                  <el-input type="textarea" v-model="taskForm.email" class="commonwidth" placeholder="邮箱用`,`隔开"></el-input>
              </el-form-item>
              <el-form-item label="时间设定" prop="cron" size="small">
                  <el-input v-model="taskForm.cron" class="commonwidth" placeholder="分 时 日 月 星期"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click.native="cancelBtn()">取 消</el-button>
              <el-button v-if="editTaskFlag === true" type="primary" @click="editTaskBtn(taskForm['id'])">修 改</el-button>
              <el-button v-else type="primary" @click="addTaskBtn()">确 定</el-button>
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
        editTaskFlag: false,
        dialogFormVisible: false,
        taskForm: {
          id: '',
          title: '',
          task_url: '',
          email: '',
          cron: ''
        },
        rules: {
          title: [
            { required: true, message: '请输入任务名称', trigger: 'blur' },
            { min: 1, max: 60, message: '长度在 1 到 60 个字符', trigger: 'blur' }
          ],
          task_url: [
            { required: true, message: '请输入任务URL', trigger: 'blur' },
            { min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入电子邮件', trigger: 'blur' },
            { min: 1, max: 254, message: '长度在 1 到 254 个字符', trigger: 'blur' }
          ],
          cron: [
            { required: true, message: '请输入CRON定时任务时间', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ]
        },
        tableData: []
      }
    },
    mounted() {
      this.taskList();
    },
    methods: {
      taskList(){
        this.$axios.get(this.$api.taskList, 
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
        this.taskList()
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.taskList()
      },
      initTaskForm(){
        this.taskForm.id = null,
        this.taskForm.title = null,
        this.taskForm.task_url = null,
        this.taskForm.email = null,
        this.taskForm.cron = null
      },
      addBtn(){
        this.initTaskForm()
        this.editTaskFlag = false
        this.dialogFormVisible = true
      },
      editTask(id){
        this.editTaskFlag = true
        this.$axios.get((this.$api.taskManage + '/' + id)).then((response) => {
          this.taskForm.id = id
          this.taskForm.title = response.data['res']['title']
          this.taskForm.task_url = response.data['res']['task_url']
          this.taskForm.email = response.data['res']['email']
          this.taskForm.cron = response.data['res']['cron']
        })
        this.dialogFormVisible = true
      },
      opTask(id, operation){
        this.$axios.get((this.$api.taskOperation.replace(/OPERATION/g, operation) + '/' + id)).then((response) => {
          if (this.messageShow(this, response)){
            this.taskList()
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      deleteTask(id){
        this.$axios.delete((this.$api.taskManage + '/' + id)).then((response) => {
          if (this.messageShow(this, response)){
            this.taskList();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      addTaskBtn(){
        let data = {
          "title": this.taskForm.title,
          "task_url": this.taskForm.task_url,
          "email": this.taskForm.email,
          "cron": this.taskForm.cron
        }
        this.$axios.post(this.$api.taskManage, data).then((response) => {
          if (this.messageShow(this, response)){
            this.dialogFormVisible = false;
            this.taskList();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      editTaskBtn(id){
        let data = {
          "title": this.taskForm.title,
          "task_url": this.taskForm.task_url,
          "email": this.taskForm.email,
          "cron": this.taskForm.cron
        }
        this.$axios.put((this.$api.taskManage + '/' + id), data).then((response) => {
          if (this.messageShow(this, response)){
            this.dialogFormVisible = false;
            this.editTaskFlag = false;
            this.taskList();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      cancelBtn(){
        this.dialogFormVisible = false;
        this.initTaskForm();
        this.editTaskFlag = false;
      }
    }
  }
</script>