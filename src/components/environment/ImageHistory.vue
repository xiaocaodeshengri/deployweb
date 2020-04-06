<template>
    <div>
        <el-row :gutter="10">
          <el-col :span="3"><h2>镜像历史</h2></el-col>
          <el-col :span="3" :offset="13" style="padding-top:16px">
                <el-input placeholder="镜像名称" 
                v-model='imageName' size="small"
                @change="searchByName">
                </el-input>
          </el-col>
          <el-col :span="3">
            <el-select v-model="environmentId" filterable placeholder="根据环境筛选" size="small" v-on:change="filterByEnv"
            style="padding-top:16px">
              <el-option
                v-for="item in environments"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2" style="padding-top:16px">
                <el-button type="primary" icon="el-icon-refresh" size="mini" plain
                            @click.native="refreshList">
                </el-button>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-table
            :data="tableImageData"
            stripe
            style="width: 100%"
            @cell-dblclick="checkImageHistory">
            <el-table-column
            type="index"
            label="No."
            width="50">
            </el-table-column>
            <el-table-column
            prop="name"
            label="镜像名称">
            </el-table-column>
            <el-table-column
            prop="version"
            label="版本">
            </el-table-column>
            <el-table-column
            prop="environment"
            label="所在环境"
            width="100">
            </el-table-column>
            <el-table-column
            prop="timestamp"
            label="记录时间">
            </el-table-column>
        </el-table>

        <el-row type="flex" justify="end">
          <el-col :span="15" style=padding-top:24px>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 50, 100, 200, 500]"
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
    data() {
      return {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tableImageData: [],
        environmentId: null,
        environments: [],
        imageName: null
      }
    },
    mounted() {
      this.imageHistoryList();
      this.environmentList();
    },
    methods: {
        environmentList(){
            this.$axios.get(this.$api.environmentList, 
            {
            params: {page: 1, size: 100}
            }).then((response) => {
                this.environments = response.data['res']
            })
        },
        imageHistoryList(environmentId, imageName){
            this.$axios.get(this.$api.imageHistoryList, 
            {
            params: {page: this.currentPage, size: this.pageSize, environment_id: environmentId, name: imageName}
            }).then((response) => {
                this.tableImageData = response.data['res']
                this.total = response.data['total']
            })
        },
        handleSizeChange(val){
            this.pageSize = val;
            this.imageHistoryList(this.environmentId, this.imageName)
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.imageHistoryList(this.environmentId, this.imageName)
        },
        searchByName(){
            this.imageHistoryList(this.environmentId, this.imageName)
        },
        filterByEnv(){
            this.imageHistoryList(this.environmentId, this.imageName)
        },
        refreshList(){
            this.currentPage = 1,
            this.environmentId = null,
            this.imageName = null,
            this.imageHistoryList(this.environmentId, this.imageName)
        },
        checkImageHistory(row){
            let historyId = row.id
            this.$axios.post(this.$api.imageHistoryCheck + historyId).then((response) => {
                this.messageShow(this, response)
            }).catch((error) => {
              this.errorMessageShow(this, error.response);
            })
        }
    }
  }
</script>