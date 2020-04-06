<template>
    <div>
        <el-row :gutter="10">
          <el-col :span="3"><h2>版本计划</h2></el-col>
          <el-col :span="3" :offset="15">
            <el-select v-model="category" filterable placeholder="根据项目筛选" size="small" v-on:change="filterPlan"
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
            <el-button @click="gotoPlanCreate" type="primary" icon="el-icon-plus" size="small" circle plain></el-button>
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
                <a :href="'#/management/plans/' + scope.row.id + '/detail'">{{ scope.row.title }}</a>
              </template>
            </el-table-column>
            <el-table-column
            prop="category"
            label="项目"
            width="90">
            </el-table-column>
            <el-table-column
            prop="version"
            label="版本">
            </el-table-column>
            <el-table-column
            prop="tests_num"
            label="转测次数"
            width="80">
            </el-table-column>
            <el-table-column
            prop="yfb_datetime"
            label="计划预发"
            width="100">
            </el-table-column>
            <el-table-column
            prop="online_datetime"
            label="计划上线"
            width="100">
            </el-table-column>
            <el-table-column
            prop="actual_online"
            label="实际上线"
            width="100">
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button v-if="tableData[scope.$index]['status'] === 0" type="warning" size="mini" round plain
                                @click.native="gotoDeploy(tableData[scope.$index]['id'])">转部署
                    </el-button>
                    <el-button v-else-if="tableData[scope.$index]['status'] === 1" type="warning" size="mini" round plain
                                @click.native="onlinePlan(tableData[scope.$index]['id'])">上线
                    </el-button>
                    <el-button v-else type="warning" size="mini" round plain :disabled=true>已上线</el-button>
                    <el-button type="primary" icon="el-icon-edit" size="mini" circle plain
                                @click.native="editPlan(tableData[scope.$index]['id'])">
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" circle plain
                                @click.native="sureView(deletePlan,tableData[scope.$index]['id'],tableData[scope.$index]['title'])">
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
        
        <el-dialog title="上线" :visible.sync="dialogFormVisible" width="30%">
          <el-form :model="onlineDateForm" :rules="rules" ref="onlineDateForm" label-width="100px">
              <el-form-item label="上线时间" prop="actual_online" size="small">
                <el-date-picker type="date" placeholder="选择日期" v-model="onlineDateForm.actual_online">
                </el-date-picker>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="onlinePlanBtn()">确 定</el-button>
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
        dialogFormVisible: false,
        onlinePlanId: Number,
        onlineDateForm: {
          actual_online: ''
        },
        rules: {
          actual_online: [
            { required: true, message: '请选择上线时间', trigger: 'blur' }
          ]
        },
        category: '',
        tableData: []
      }
    },
    mounted() {
      this.planList(null);
    },
    methods: {
      planList(category_id){
        this.$axios.get(this.$api.planList, 
        {
          params: {page: this.currentPage, size: this.pageSize, category_id: category_id}
        }).then((response) => {
          if (this.messageShow(this, response)){
            this.tableData = response.data['res']
            this.total = response.data['total']
          }
        })
      },
      initOnlineDateForm(){
        this.onlineDateForm.actual_online = null
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.planList(this.category)
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.planList(this.category)
      },
      planDetail(id){
        this.$router.push('/management/plans/' + id +'/detail')
      },
      gotoDeploy(id){
        this.$router.push('/management/plans/' + id +'/gotoDeploy')
      },
      editPlan(id){
        this.$router.push('/management/plans/' + id +'/edit')
      },
      deletePlan(id){
        this.$axios.delete((this.$api.planManage + '/' + id)).then((response) => {
          if (this.messageShow(this, response)){
            this.planList(this.category);
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      filterPlan(){
        this.planList(this.category)
      },
      refreshList(){
          this.currentPage = 1,
          this.category = null,
          this.planList(this.category)
      },
      gotoPlanCreate(){
        this.$router.push('/management/plans/create')
      },
      onlinePlanBtn(){
        let data = {
          'actual_online': this.onlineDateForm.actual_online,
          'status': 2
        }
        this.$axios.put((this.$api.planManage + '/' + this.onlinePlanId), data).then((response) => {
          if (this.messageShow(this, response)){
            this.planList()
            this.dialogFormVisible = false
            this.initOnlineDateForm()
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      onlinePlan(id){
        this.dialogFormVisible = true
        this.onlinePlanId = id
      }
    }
  }
</script>