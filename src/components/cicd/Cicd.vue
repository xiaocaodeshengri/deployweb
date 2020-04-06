<template>
    <div>
        <el-row :gutter="10">
          <el-col :span="3"><h2>CICD配置</h2></el-col>
          <el-col :span="3" :offset="15">
            <el-select v-model="category" filterable placeholder="根据项目筛选" size="small" v-on:change="filterCicd"
            style="padding-top:16px">
              <el-option
                v-for="item in categorys"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="1" style="padding-top:17px">
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
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
            prop="id"
            label="ID."
            width="50">
            </el-table-column>
            <el-table-column
            prop="category"
            label="项目组"
            width="150">
            </el-table-column>
            <el-table-column
            prop="service_name"
            label="服务名称">
            </el-table-column>
            <el-table-column
            prop="develop_env"
            label="开发环境"
            width="150">
            </el-table-column>
            <el-table-column
            prop="develop_api_task"
            label="开发环境测试任务"
            width="200">
            </el-table-column>
            <el-table-column
            prop="test_env"
            label="测试环境"
            width="150">
            </el-table-column>
            <el-table-column
            prop="test_api_task"
            label="测试环境测试任务"
            width="200">
            </el-table-column>
            <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" plain
                                @click.native="editCicd(tableData[scope.$index]['id'])">Edit
                    </el-button>
                    <el-button type="success" size="mini" v-if="tableData[scope.$index]['status'] === 0" plain
                                @click.native="opCicd(tableData[scope.$index]['id'], 'enable')">Enable
                    </el-button>
                    <el-button type="danger" size="mini" v-else plain
                                @click.native="opCicd(tableData[scope.$index]['id'], 'disable')">Disable
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" plain
                                @click.native="sureView(deleteTask,tableData[scope.$index]['id'],tableData[scope.$index]['id'])">
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

        <el-dialog title="CICD策略配置" :visible.sync="dialogFormVisible">
          <el-form :model="cicdForm" :rules="rules" ref="cicdForm" label-width="150px" class="demo-cicdForm">
              <el-form-item label="项目组" prop="category_id" size="small">
                  <el-select v-model="cicdForm.category_id" placeholder="请选择项目组">
                    <el-option
                      v-for="item in categorys"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="服务名称" prop="service_name" size="small">
                  <el-input v-model="cicdForm.service_name" class="commonwidth" placeholder="network-interfaces"></el-input>
              </el-form-item>
              <el-form-item label="开发环境" prop="develop_env" size="small">
                  <el-select v-model="cicdForm.develop_env" placeholder="请选择开发环境">
                    <el-option
                      v-for="item in envList"
                      :key="item.id"
                      :label="item.ip"
                      :value="item.ip">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="开发环境测试任务" prop="develop_api_task" size="small">
                  <el-select v-model="cicdForm.develop_api_task" placeholder="请选择开发环境测试任务">
                    <el-option
                      v-for="item in cicdTaskList"
                      :key="item.id"
                      :label="item.task_name"
                      :value="item.id">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="测试环境" prop="test_env" size="small">
                  <el-select v-model="cicdForm.test_env" placeholder="请选择测试环境">
                    <el-option
                      v-for="item in envList"
                      :key="item.id"
                      :label="item.ip"
                      :value="item.ip">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="测试环境测试任务" prop="test_api_task" size="small">
                  <el-select v-model="cicdForm.test_api_task" placeholder="请选择测试环境测试任务">
                    <el-option
                      v-for="item in cicdTaskList"
                      :key="item.id"
                      :label="item.task_name"
                      :value="item.id">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click.native="cancelBtn()">取 消</el-button>
              <el-button v-if="editTaskFlag === true" type="primary" @click="editCicdBtn(cicdForm['id'])">修 改</el-button>
              <el-button v-else type="primary" @click="addCicdBtn()">确 定</el-button>
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
        editTaskFlag: false,
        dialogFormVisible: false,
        cicdForm: {
          id: '',
          category_id: '',
          service_name: '',
          develop_env: '',
          test_env: '',
          develop_api_task: '',
          test_api_task: ''
        },
        rules: {
          category_id: [
            { required: true, message: '请输入选择项目组', trigger: 'blur' },
          ]
        },
        tableData: [],
        envList: [],
        cicdTaskList: [],
        category: ''
      }
    },
    mounted() {
      this.cicdList(null);
      this.environmentList();
      this.cicdTask();
    },
    methods: {
      environmentList(){
        this.$axios.get(this.$api.environmentList, 
        {
          params: {page: 1, size: 100, category_id: localStorage.getItem("category_id")}
        }).then((response) => {
            this.envList = response.data['res']
        })
      },
      cicdTask(){
        this.$axios.get(this.$api.cicdTaskList, 
        {
          params: {category_id: localStorage.getItem("category_id")}
        }).then((response) => {
            this.cicdTaskList = response.data['res']
        })
      },
      cicdList(category_id){
        this.$axios.get(this.$api.cicdList, 
        {
          params: {page: this.currentPage, size: this.pageSize, category_id: category_id}
        }).then((response) => {
          if (this.messageShow(this, response)){
            this.tableData = response.data['res']
            this.total = response.data['total']
          }
        })
      },
      filterCicd(){
        this.cicdList(this.category)
      },
      refreshList(){
          this.currentPage = 1,
          this.category = null,
          this.cicdList(this.category)
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.cicdList(this.category)
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.cicdList(this.category)
      },
      initCicdForm(){
        this.cicdForm.id = null,
        this.cicdForm.category_id = null,
        this.cicdForm.service_name = null,
        this.cicdForm.develop_env = null,
        this.cicdForm.test_env = null,
        this.cicdForm.develop_api_task = null,
        this.cicdForm.test_api_task = null
        },
      addBtn(){
        this.initCicdForm()
        this.editTaskFlag = false
        this.dialogFormVisible = true
      },
      editCicd(id){
        this.editTaskFlag = true
        this.$axios.get((this.$api.cicdManage + '/' + id)).then((response) => {
          this.cicdForm.id = id
          this.cicdForm.category_id = response.data['res']['category_id']
          this.cicdForm.service_name = response.data['res']['service_name']
          this.cicdForm.develop_env = response.data['res']['develop_env']
          this.cicdForm.test_env = response.data['res']['test_env']
          this.cicdForm.develop_api_task = response.data['res']['develop_api_task']
          this.cicdForm.test_api_task = response.data['res']['test_api_task']
        })
        this.dialogFormVisible = true
      },
      opCicd(id, operation){
        this.$axios.get((this.$api.cicdOperation.replace(/OPERATION/g, operation) + '/' + id)).then((response) => {
          if (this.messageShow(this, response)){
            this.cicdList()
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      deleteTask(id){
        this.$axios.delete((this.$api.cicdManage + '/' + id)).then((response) => {
          if (this.messageShow(this, response)){
            this.cicdList();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      addCicdBtn(){
        let data = {
          "category_id": this.cicdForm.category_id,
          "service_name": this.cicdForm.service_name,
          "develop_env": this.cicdForm.develop_env,
          "test_env": this.cicdForm.test_env,
          "develop_api_task": this.cicdForm.develop_api_task,
          "test_api_task": this.cicdForm.test_api_task
        }
        this.$axios.post(this.$api.cicdManage, data).then((response) => {
          if (this.messageShow(this, response)){
            this.dialogFormVisible = false;
            this.cicdList();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      editCicdBtn(id){
        let data = {
          "category_id": this.cicdForm.category_id,
          "service_name": this.cicdForm.service_name,
          "develop_env": this.cicdForm.develop_env,
          "test_env": this.cicdForm.test_env,
          "develop_api_task": this.cicdForm.develop_api_task,
          "test_api_task": this.cicdForm.test_api_task
        }
        this.$axios.put((this.$api.cicdManage + '/' + id), data).then((response) => {
          if (this.messageShow(this, response)){
            this.dialogFormVisible = false;
            this.editTaskFlag = false;
            this.cicdList();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      cancelBtn(){
        this.dialogFormVisible = false;
        this.initCicdForm();
        this.editTaskFlag = false;
      }
    }
  }
</script>