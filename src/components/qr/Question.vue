<template>
    <div>
        <el-row :gutter="10">
          <el-col :span="3"><h2>问题记录</h2></el-col>
          <el-col :span="6" :offset="11" style="padding-top:18px">
            <el-autocomplete placeholder="请输入内容" v-model="filterInput" size="small"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="true">
              <el-select v-model="filterTag" slot="prepend" placeholder="请选择" class="select-inside">
                <el-option label="类型" value="record_type"></el-option>
                <el-option label="级别" value="p_class"></el-option>
                <el-option label="状态" value="status_code"></el-option>
                <el-option label="指派人" value="resolver"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click.native="filterBtn"></el-button>
            </el-autocomplete>
          </el-col>
          <el-col :span="1" style="padding-top:18px">
                <el-button type="primary" icon="el-icon-refresh" size="mini" plain
                            @click.native="refreshList">
                </el-button>
          </el-col>
          <el-col :span="1" style=padding-top:17px>
            <el-button @click.native="gotoQuestionCreate" type="primary" icon="el-icon-plus" size="small" circle plain></el-button>
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
            width="350">
            <template slot-scope="scope">
              <a :href="'#/q_r/questions/' + scope.row.id + '/detail'">{{ scope.row.title }}</a>
            </template>
            </el-table-column>
            <el-table-column
            prop="record_type"
            label="类型">
            </el-table-column>
            <el-table-column
            prop="p_class"
            label="级别">
            </el-table-column>
            <el-table-column
            prop="questioner"
            label="提出者">
            </el-table-column>
            <el-table-column
            prop="resolver"
            label="指派">
            </el-table-column>
            <el-table-column
            prop="status"
            label="状态">
            </el-table-column>
            <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" plain
                                @click.native="editQuestion(tableData[scope.$index]['id'])">Edit
                    </el-button>
                    <el-button type="warning" size="mini" v-if="tableData[scope.$index]['status_code'] === 0" plain
                                :disabled="true">Close
                    </el-button>
                    <el-button type="warning" size="mini" v-else-if="tableData[scope.$index]['status_code'] === 1" plain
                                @click.native="closeQuestion(tableData[scope.$index]['id'])">Close
                    </el-button>
                    <el-button type="info" size="mini" v-else plain
                                @click.native="reactiveQuestion(tableData[scope.$index]['id'])">Reactive
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" plain
                                @click.native="sureView(deleteQuestion,tableData[scope.$index]['id'],tableData[scope.$index]['title'])">
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
        tableData: [],
        filterInput: '',
        filterTag: '',
        resolver: '',
        record_type: '',
        p_class: '',
        status_code: '',
        users: [],
        record_types: [
          {key: '环境问题', value: '环境问题'},
          {key: '脚本问题', value: '脚本问题'},
          {key: '版本问题', value: '版本问题'},
          {key: '测试数据有误', value: '测试数据有误'},
          {key: '其它', value: '其它'}
        ],
        p_classes: [
          {key: 'P1', value: 'P1'},
          {key: 'P2', value: 'P2'},
          {key: 'P3', value: 'P3'},
          {key: 'P4', value: 'P4'}
        ],
        status_codes: [
          {key: '0', value: '未确认'},
          {key: '1', value: '已确认'},
          {key: '2', value: '已关闭'}
        ]
      }
    },
    mounted() {
      this.questionList();
      this.getAllUsers();
    },
    methods: {
      editQuestion(id){
        this.$router.push('/q_r/questions/' + id +'/edit')
      },
      answerQuestion(id){
        console.log(id)
      },
      closeQuestion(id){
        this.$axios.get((this.$api.questionOperation.replace(/OPERATION/g, 'close') + '/' + id)).then((response) => {
          if (this.messageShow(this, response)){
            this.reload();
          }
        }).catch((error) => {
            this.errorMessageShow(this, error.response);
        })
      },
      reactiveQuestion(id){
        this.$axios.get((this.$api.questionOperation.replace(/OPERATION/g, 'reactive') + '/' + id)).then((response) => {
          if (this.messageShow(this, response)){
            this.reload();
          }
        }).catch((error) => {
            this.errorMessageShow(this, error.response);
        })
      },
      deleteQuestion(id){
        this.$axios.delete((this.$api.questionManage + '/' + id)).then((response) => {
          if (this.messageShow(this, response)){
            this.questionList();
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      questionList(){
        let paramsData = {
          page: this.currentPage,
          size: this.pageSize,
          record_type: this.record_type,
          resolver: this.resolver,
          p_class: this.p_class,
          resolver: this.resolver
        }
        if (this.filterTag === 'resolver'){
          paramsData.resolver = this.filterInput;
        }else if (this.filterTag === 'record_type'){
          paramsData.record_type = this.filterInput;
        }else if (this.filterTag === 'p_class'){
          paramsData.p_class = this.filterInput;
        }else if (this.filterTag === 'status_code'){
          paramsData.status_code = this.filterInput;
        }
        this.$axios.get(this.$api.questionList,
        {
          params: paramsData
        }).then((response) => {
            this.tableData = response.data['res']
            this.total = response.data['total']
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.questionList()
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.questionList()
      },
      gotoQuestionCreate(){
        this.$router.push('/q_r/questions/create')
      },
      querySearch(queryString, cb) {
        this.initFilter()
        if (this.filterTag === 'resolver'){
          var filters = this.users;
        }else if (this.filterTag === 'record_type'){
          var filters = this.record_types;
        }else if (this.filterTag === 'p_class'){
          var filters = this.p_classes;
        }else if (this.filterTag === 'status_code'){
          var filters = this.status_codes;
        }
        var results = queryString ? filters.filter(this.createFilter(queryString)) : filters;
        cb(results);
      },
      createFilter(queryString) {
        return (filters) => {
          return (filters.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      getAllUsers(){
        this.$axios.get(this.$api.userList, 
        {
          params: {page: 1, size: 100}
        }).then((response) => {
          this.users = response.data['res']
        })
      },
      initFilter(){
        this.resolver = null
        this.p_class = null
        this.status_code = null
        this.record_type = null
      },
      refreshList(){
        this.filterTag = null
        this.filterInput = null
        this.initFilter()
        this.questionList()
      },
      filterBtn(){
        this.questionList()
      }
    }
  }
</script>

<style scoped>
.select-inside {
  width: 100px;
}
</style>