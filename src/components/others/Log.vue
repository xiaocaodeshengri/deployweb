<template>
    <div>
        <el-row :gutter="10">
          <el-col :span="3"><h2>操作日志</h2></el-col>
          <el-col :span="3" :offset="13" style="padding-top:16px">
                <el-input placeholder="操作类型" 
                v-model='operationType' size="small"
                @change="logList">
                </el-input>
          </el-col>
          <el-col :span="3">
            <el-select v-model="category" filterable placeholder="根据项目筛选" size="small" v-on:change="logList"
            style="padding-top:16px">
              <el-option
                v-for="item in categorys"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>          
          </el-col>
          <el-col :span="1" style="padding-top:17px">
                <el-button type="primary" icon="el-icon-refresh" size="mini" plain
                            @click.native="refreshList">
                </el-button>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-table
            :data="tableLogData"
            stripe
            style="width: 100%">
            <el-table-column
            type="index"
            label="No."
            width="50">
            </el-table-column>
            <el-table-column
            prop="person"
            label="责任人"
            width="100">
            </el-table-column>
            <el-table-column
            prop="category"
            label="项目"
            width="100">
            </el-table-column>
            <el-table-column
            prop="type"
            label="类型"
            width="100">
            </el-table-column>
            <el-table-column
            prop="log"
            label="日志">
            </el-table-column>
            <el-table-column
            prop="timestamp"
            label="时间"
            width="150">
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
        tableLogData: [],
        operationType: null,
        category: null,
      }
    },
    mounted() {
      this.logList();
    },
    methods: {
      logList(){
        this.$axios.get(this.$api.logList, 
        {
          params: {page: this.currentPage, size: this.pageSize, category: this.category, type: this.operationType}
        }).then((response) => {
          if (this.messageShow(this, response)){
            this.tableLogData = response.data['res']
            this.total = response.data['total']
          }
        })
      },
      refreshList(){
        this.category = null
        this.operationType = null
        this.logList()
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.logList()
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.logList()
      },
    }
  }
</script>