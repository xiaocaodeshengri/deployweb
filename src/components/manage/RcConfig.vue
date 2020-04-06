<template>
    <div>
        <el-row :gutter="10">
          <el-col :span="3"><h2>RC配置</h2></el-col>
          <el-col :span="3" :offset="18" style=padding-top:18px>
            <el-button @click.native="initRCForm()" @click="dialogFormVisible=true" type="primary" icon="el-icon-plus" size="small" circle plain></el-button>
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
            label="名称">
            </el-table-column>
            <el-table-column
            prop="rc_name"
            label="RC文件名"
            width="200">
            </el-table-column>
            <el-table-column
            prop="master_ip"
            label="主节点IP"
            width="150">
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="warning" size="mini" plain :loading="executeStatus"
                                @click.native="executeRC(tableData[scope.$index]['id'])">执行
                    </el-button>
                    <el-button type="primary" icon="el-icon-edit" size="mini" circle plain
                                @click.native="editRCConf(tableData[scope.$index]['id'])">
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" circle plain
                                @click.native="sureView(deleteRCConf,tableData[scope.$index]['id'],tableData[scope.$index]['name'])">
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

        <el-dialog title="RC配置" :visible.sync="dialogFormVisible">
            <el-form :model="rcForm" :rules="rules" ref="rcForm" label-width="100px" class="demo-rcForm">
                <el-form-item label="名称" prop="name" size="small">
                    <el-input v-model="rcForm.name" class="commonwidth"></el-input>
                </el-form-item>
                <el-form-item label="RC文件名" prop="rc_name" size="small">
                    <el-input v-model="rcForm.rc_name" class="commonwidth" placeholder="xxx-rc"></el-input>
                </el-form-item>
                <el-form-item label="主节点IP" prop="master_ip" size="small">
                    <el-input v-model="rcForm.master_ip" class="commonwidth" placeholder="10.253.146.17"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small"
                                @click="addRCConfig()">添加RC配置
                    </el-button>
                </el-form-item>
            </el-form>
            <hr>
            <el-table :data="rcForm.rc_configs"
                        style="width:100%"
                        :show-header="false"
                        size="mini"
                        max-height="538"
                        stripe>
                <el-table-column property="env_index" label="env_index" header-align="center" minWidth="50">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.env_index" size="small" placeholder="字段索引">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column property="name" label="name" header-align="center" minWidth="100">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.name" size="small" placeholder="name">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="value" header-align="center" minWidth="100">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.value" size="small" placeholder="value">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column property="value" label="操作" header-align="center" width="140">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button type="danger" size="mini"
                                        @click.native="delRCConfig(scope.$index)"> 删除
                            </el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
              <el-button @click="chanceBtn()">取 消</el-button>
              <el-button v-if="editFlag === true" type="primary" @click="editRCConfBtn(rcForm['id'])">确 定</el-button>
              <el-button v-else type="primary" @click="addRCConfBtn()">确 定</el-button>
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
        executeStatus: false,
        editFlag: false,
        dialogFormVisible: false,
        rcForm: {
          id: Number,
          name: '',
          rc_name: '',
          master_ip: '',
          rc_configs: []
        },
        rules: {
          name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' },
            { min: 1, max: 60, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ],
          rc_name: [
            { required: true, message: '请输入RC文件名称', trigger: 'blur' }
          ],
          master_ip: [
            { required: true, message: '请输入主节点IP地址', trigger: 'blur' },
          ]
        },
        tableData: []
      }
    },
    mounted() {
      this.rcconfList();
    },
    methods: {
      rcconfList(){
        this.$axios.get(this.$api.k8sRcConfigsList, 
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
        this.rcconfList()
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.rcconfList()
      },
      initRCForm(){
          this.rcForm.id = Array();
          this.rcForm.name = null;
          this.rcForm.rc_name = null;
          this.rcForm.master_ip = null;
          this.rcForm.rc_configs = [];
          this.editFlag = false
      },
      editRCConf(id){
        this.editFlag = true
        this.$axios.get((this.$api.k8sRcConfigManage + '/' + id)).then((response) => {
          this.rcForm.id = id
          this.rcForm.name = response.data['res']['name']
          this.rcForm.rc_name = response.data['res']['rc_name']
          this.rcForm.master_ip = response.data['res']['master_ip']
          this.rcForm.rc_configs = response.data['res']['rc_configs']
        })
        this.dialogFormVisible = true
      },
      deleteRCConf(id){
        this.$axios.delete((this.$api.k8sRcConfigManage + '/' + id)).then((response) => {
          if (this.messageShow(this, response)){
            this.rcconfList();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      addRCConfBtn(){
        let data = {
          "name": this.rcForm.name,
          "rc_name": this.rcForm.rc_name,
          "master_ip": this.rcForm.master_ip,
          "rc_configs": this.rcForm.rc_configs
        }
        this.$axios.post(this.$api.k8sRcConfigManage, data).then((response) => {
          if (this.messageShow(this, response)){
            this.dialogFormVisible = false;
            this.rcconfList();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      editRCConfBtn(id){
        let data = {
          "name": this.rcForm.name,
          "rc_name": this.rcForm.rc_name,
          "master_ip": this.rcForm.master_ip,
          "rc_configs": this.rcForm.rc_configs
        }
        this.$axios.put((this.$api.k8sRcConfigManage + '/' + id), data).then((response) => {
          if (this.messageShow(this, response)){
            this.dialogFormVisible = false;
            this.editFlag = false;
            this.rcconfList();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      chanceBtn(){
        this.dialogFormVisible = false;
        this.initRCForm();
        this.editFlag = false;
      },
      addRCConfig(){
          this.rcForm.rc_configs.push({env_index: '', name: '', value: ''})
      },
      delRCConfig(i){
          this.rcForm.rc_configs.splice(i, 1)
      },
      executeRC(id){
          this.executeStatus = true
          this.$axios.get(this.$api.k8sRcConfigExecute + id).then((response) => {
              this.messageShow(this, response)
          })
          this.executeStatus = false
      }
    }
  }
</script>