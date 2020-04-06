<template>
    <div>
        <el-row :gutter="10">
          <el-col :span="3"><h2>环境拓扑</h2></el-col>
          <!-- <el-col :span="3" :offset="18" style=padding-top:18px>
            <el-button @click.native="initTopoForm()" @click="dialogFormVisible = true" type="primary" icon="el-icon-plus" size="small" circle plain></el-button>
          </el-col> -->
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
            label="拓扑名称">
            <template slot-scope="scope">
              <a :href="'#/topo/' + scope.row.id" target="_blank">{{ scope.row.name }}</a>
            </template>
            </el-table-column>
            <el-table-column label="操作" width="360">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" circle plain
                                @click.native="editTopo(tableData[scope.$index]['id'])">
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" circle plain
                                @click.native="sureView(deleteTopo,tableData[scope.$index]['id'],tableData[scope.$index]['name'])">
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

        <el-dialog title="编辑拓扑名称" :visible.sync="dialogFormVisible" width="30%">
            <el-form :model="topoForm" :rules="topoRules" ref="topoForm" label-width="100px">
                <el-form-item label="拓扑名称" prop="name" size="small">
                    <el-input v-model="topoForm.name" class="register" placeholder="请输入拓扑名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelBtn()">取 消</el-button>
              <el-button type="primary" @click="editTopoBtn(topoForm['id'])">确 定</el-button>
              <!-- <el-button v-else type="primary" @click="addTopoBtn()">新 建</el-button> -->
            </div>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    inject: ['reload'],
    data() {
      return {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        // editFlag: false,
        dialogFormVisible: false,
        topoForm: {
            id: '',
            name: ''
        },
        topoRules: {
          name: [
            { required: true, message: '请输入环境拓扑图名称', trigger: 'blur' },
            { min: 1, max: 60, message: '长度在 1 到 60 个字符', trigger: 'blur' }
          ]
        },
        tableData: []
      }
    },
    mounted() {
      this.topoList();
    },
    methods: {
      topoList(){
        this.$axios.get(this.$api.topoList, 
        {
          params: {page: this.currentPage, size: this.pageSize}
        }).then((response) => {
            this.tableData = response.data['res']
            this.total = response.data['total']
        })
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.topoList()
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.topoList()
      },
      initTopoForm(){
          this.topoForm.id = null;
          this.topoForm.name = null;
      },
      editTopo(id){
        // this.editFlag = true
        this.$axios.get((this.$api.topoManage + id)).then((response) => {
          this.topoForm.id = id
          this.topoForm.name = response.data['res']['name']
        })
        this.dialogFormVisible = true
      },
      deleteTopo(id){
        this.$axios.delete((this.$api.topoManage + id)).then((response) => {
          if (this.messageShow(this, response)){
            this.reload();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
    //   addTopoBtn(){
    //     let data = {
    //       "name": this.topoForm.name,
    //     }
    //     this.$axios.post(this.$api.topoManage, data).then((response) => {
    //       if (this.messageShow(this, response)){
    //         this.dialogFormVisible = false;
    //         this.topoList();
    //       }
    //     }).catch((error) => {
    //       this.errorMessageShow(this, error.response);
    //     })
    //   },
      editTopoBtn(id){
        let data = {
          "name": this.topoForm.name,
        }
        this.$axios.put((this.$api.topoManage + '/' + id), data).then((response) => {
          if (this.messageShow(this, response)){
            this.dialogFormVisible = false;
            // this.editFlag = false;
            this.topoList();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      cancelBtn(){
        this.dialogFormVisible = false;
        this.initTopoForm();
        this.editFlag = false;
      }
    }
  }
</script>