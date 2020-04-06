<template>
    <div>
        <el-row :gutter="10">
          <el-col :span="3"><h2>部署记录</h2></el-col>
          <el-col :span="3" :offset="13">
            <el-select v-model="category" filterable placeholder="根据项目筛选" size="small" v-on:change="filterDeploy"
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
          <el-col :span="1" style=padding-top:23px>
            <el-tooltip class="item" effect="dark" content="导出全部部署记录" placement="top">
              <a :href="this.$api.deployExportDate"><i class="el-icon-document"></i></a>
            </el-tooltip>
          </el-col>
          <el-col :span="1" style="padding-top:17px">
                <el-button type="warning" size="mini" plain
                            @click.native="rcDialogVisible = true">改RC
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
            prop="title"
            label="标题"
            width="300">
            <template slot-scope="scope">
              <a :href="'#/management/deploys/' + scope.row.id + '/detail'">{{ scope.row.title }}</a>
            </template>
            </el-table-column>
            <el-table-column
            prop="category"
            label="项目"
            width="120">
            </el-table-column>
            <el-table-column
            prop="version"
            label="版本">
            </el-table-column>
            <el-table-column
            prop="timestamp"
            label="创建时间"
            width="150">
            </el-table-column>
            <el-table-column
            prop="deploy_times"
            label="部署次数"
            width="100">
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" circle plain
                                @click.native="editDeploy(tableData[scope.$index]['id'])">
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" circle plain
                                @click.native="sureView(deleteDeploy,tableData[scope.$index]['id'],tableData[scope.$index]['title'])">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-row type="flex" justify="end">
          <el-col :span="15" style=padding-top:24px>
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

        <el-dialog title="修改RC并重启Pod" :visible.sync="rcDialogVisible" width="30%">
          <el-form :model="rcForm" :rules="rules" ref="rcForm" label-width="100px">
              <el-form-item label="主节点IP" prop="master_ip" size="small">
                  <el-input v-model="rcForm.master_ip" class="width300" placeholder="10.253.146.17"></el-input>
              </el-form-item>
              <el-form-item label="RC名称" prop="rc" size="small">
                  <el-input v-model="rcForm.rc" class="width300" placeholder="xxx-rc"></el-input>
              </el-form-item>
              <el-form-item label="字段索引" prop="env_index" size="small">
                  <el-input v-model="rcForm.env_index" class="width300" placeholder="只允许输入数字"></el-input>
              </el-form-item>
              <el-form-item label="字段name" prop="name" size="small">
                  <el-input v-model="rcForm.name" class="width300" placeholder="RouterAddr"></el-input>
              </el-form-item>
              <el-form-item label="字段value" prop="value" size="small">
                  <el-input v-model="rcForm.value" class="width300" placeholder="xxxxx"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelBtn()">取 消</el-button>
              <el-button type="primary" @click="modifyRcBtn()">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
  export default {
    props: ['categorys'],
    data() {
      return {
        rcDialogVisible: false,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        category: '',
        tableData: [],
        rcForm: {
          master_ip: '',
          rc: '',
          env_index: '',
          name: '',
          value: ''
        },
        rules: {
          master_ip: [
            { required: true, message: '请输入主节点IP地址', trigger: 'blur' }
          ],
          rc: [
            { required: true, message: '请输入RC名称', trigger: 'blur' }
          ],
          env_index: [
            { required: true, message: '请输入字段在env中的索引', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入字段name', trigger: 'blur' }
          ],
          value: [
            { required: true, message: '请输入字段value', trigger: 'blur' }
          ],
        },
      }
    },
    mounted() {
      this.deployList(null);
    },
    methods: {
      deployList(category_id){
        this.$axios.get(this.$api.deployList, 
        {
          params: {page: this.currentPage, size: this.pageSize, category_id: category_id}
        }).then((response) => {
          if (this.messageShow(this, response)){
            this.tableData = response.data['res']
            this.total = response.data['total']
          }
        })
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.deployList(this.category)
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.deployList(this.category)
      },
      editDeploy(id){
        this.$router.push('/management/deploys/' + id +'/edit')
      },
      deleteDeploy(id){
        this.$axios.delete((this.$api.deployManage + '/' + id)).then((response) => {
          if (this.messageShow(this, response)){
            this.deployList(this.category);
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      filterDeploy(){
        this.deployList(this.category)
      },
      refreshList(){
          this.currentPage = 1,
          this.category = null,
          this.deployList(this.category)
      },
      cancelBtn(){
        this.rcDialogVisible = false
      },
      modifyRcBtn(){
        let data = {
          'master_ip': this.rcForm.master_ip,
          'rc': this.rcForm.rc,
          'env_index': this.rcForm.env_index,
          'name': this.rcForm.name,
          'value': this.rcForm.value
        }
        this.$axios.post(this.$api.k8sModifyRc, data).then((response) => {
          this.messageShow(this, response)
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
        this.rcDialogVisible = false
      }
    }
  }
</script>