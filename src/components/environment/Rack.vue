<template>
    <div>
        <el-row :gutter="10">
          <el-col :span="3"><h2>机柜信息</h2></el-col>
          <el-col :span="3" :offset="18" style=padding-top:18px>
            <el-button @click.native="addBtn()" type="primary" icon="el-icon-plus" size="small" circle plain></el-button>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-table
            :data="tableRackData"
            stripe
            style="width: 100%"
            @row-dblclick="rackDeviceInfo">
            <el-table-column
            type="index"
            label="No."
            width="50">
            </el-table-column>
            <el-table-column
            prop="name"
            label="名称">
            </el-table-column>
            <el-table-column
            prop="category"
            label="项目组">
            </el-table-column>
            <el-table-column
            prop="location"
            label="机柜位置">
            </el-table-column>
            <el-table-column
            prop="remark"
            label="备注">
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" circle plain
                                @click.native="editRack(tableRackData[scope.$index]['id'])">
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" circle plain  v-if="getRole(9)"
                                @click.native="sureView(deleteRack,tableRackData[scope.$index]['id'],tableRackData[scope.$index]['name'])">
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
        
        <el-dialog title="机柜配置" :visible.sync="dialogFormVisible">
          <el-form :model="rackForm" :rules="rules" ref="rackForm" label-width="150px" class="demo-rackForm">
              <el-form-item label="名称" prop="name" size="small">
                  <el-input v-model="rackForm.name" class="commonwidth"></el-input>
              </el-form-item>
              <el-form-item label="项目组" prop="category" size="small">
                  <!-- <el-input v-model="rackForm.category" class="commonwidth"></el-input> -->
                    <el-autocomplete
                    class="inline-input"
                    v-model="rackForm.category"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入所属项目组"
                    :trigger-on-focus="true"
                    >
                    </el-autocomplete>
              </el-form-item>
              <el-form-item label="机柜位置" prop="location" size="small">
                  <el-input v-model="rackForm.location" class="commonwidth"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="remark" size="small">
                  <el-input type="textarea" v-model="rackForm.remark" class="commonwidth"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelBtn()">取 消</el-button>
              <el-button v-if="editRackFlag === true" type="primary" @click="editRackBtn(rackForm['id'])">确 定</el-button>
              <el-button v-else type="primary" @click="addRackBtn()">新 建</el-button>
            </div>
        </el-dialog>

        <el-drawer
        :title="selectedRack"
        :visible.sync="dialog"
        direction="rtl"
        custom-class="demo-drawer"
        ref="drawer"
        size="50%">
            <el-table :data="tableDeviceData" stripe style="width: 100%">
                <el-table-column
                type="index"
                label="No."
                width="50">
                </el-table-column>
                <el-table-column
                prop="name"
                label="名称">
                </el-table-column>
                <el-table-column
                prop="category"
                label="项目组">
                </el-table-column>
                <el-table-column
                prop="u_location"
                label="位置">
                </el-table-column>
                <el-table-column
                prop="mgt_ip"
                label="管理IP">
                </el-table-column>
                <el-table-column
                prop="device_type"
                label="设备类型">
                </el-table-column>
            </el-table>
        </el-drawer>

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
        editRackFlag: false,
        dialogFormVisible: false,
        dialog: false,
        tableDeviceData: [],
        selectedRack: '',
        rackForm: {
          id: '',
          name: '',
          category: '',
          location: '',
          remark: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入机柜名称', trigger: 'blur' },
            { min: 1, max: 60, message: '长度在 1 到 60 个字符', trigger: 'blur' }
          ],
          category: [
            { required: true, message: '请输入所属项目组', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
          ],
          location: [
            { required: true, message: '请输入机柜位置', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          remark: [
            { required: false, message: '请输入备注', trigger: 'blur' }
          ]
        },
        tableRackData: []
      }
    },
    mounted() {
      this.rackList();
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
      rackList(){
        this.$axios.get(this.$api.rackList, 
        {
          params: {page: this.currentPage, size: this.pageSize}
        }).then((response) => {
            this.tableRackData = response.data['res']
            this.total = response.data['total']
        })
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.rackList()
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.rackList()
      },
      initRackForm(){
        this.rackForm.name = null,
        this.rackForm.category = null,
        this.rackForm.location = null,
        this.rackForm.remark = null
      },
      addBtn(){
        this.initRackForm()
        this.editRackFlag = false
        this.dialogFormVisible = true
      },
      editRack(id){
        this.editRackFlag = true
        this.$axios.get((this.$api.rackManage + '/' + id)).then((response) => {
          this.rackForm.id = id
          this.rackForm.name = response.data['res']['name']
          this.rackForm.category = response.data['res']['category']
          this.rackForm.location = response.data['res']['location']
          this.rackForm.remark = response.data['res']['remark']
        })
        this.dialogFormVisible = true
      },
      deleteRack(id){
        this.$axios.delete((this.$api.rackManage + '/' + id)).then((response) => {
          if (this.messageShow(this, response)){
            this.rackList();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      addRackBtn(){
        let data = {
          "name": this.rackForm.name,
          "category": this.rackForm.category,
          "location": this.rackForm.location,
          "remark": this.rackForm.remark
        }
        this.$axios.post(this.$api.rackManage, data).then((response) => {
          if (this.messageShow(this, response)){
            this.dialogFormVisible = false;
            this.rackList();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      editRackBtn(id){
        let data = {
          "name": this.rackForm.name,
          "category": this.rackForm.category,
          "location": this.rackForm.location,
          "remark": this.rackForm.remark
        }
        this.$axios.put((this.$api.rackManage + '/' + id), data).then((response) => {
          if (this.messageShow(this, response)){
            this.dialogFormVisible = false;
            this.editRackFlag = false;
            this.rackList();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      cancelBtn(){
        this.dialogFormVisible = false;
        this.initRackForm();
        this.editRackFlag = false;
      },
      querySearch(queryString, cb) {
        var categorys = this.categorys;
        var results = queryString ? categorys.filter(this.createFilter(queryString)) : categorys;
        cb(results);
      },
      createFilter(queryString) {
        return (category) => {
          return (category.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      rackDeviceInfo(row, column, event){
        this.$axios.get(this.$api.deviceList, 
        {
          params: {page: 1, size: 30, rack_id: row.id}
        }).then((response) => {
            this.tableDeviceData = response.data['res']
        })
        this.selectedRack = row.name
        this.dialog = true
      }
    }
  }
</script>