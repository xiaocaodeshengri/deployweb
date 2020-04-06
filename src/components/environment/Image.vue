<template>
    <div>
        <el-row :gutter="10">
          <el-col :span="3"><h2>镜像信息</h2></el-col>
          <el-col :span="3" :offset="10" style="padding-top:16px">
                <el-input placeholder="镜像名称" 
                v-model='imageName' size="small"
                @change="searchByName">
                </el-input>
          </el-col>
          <el-col :span="3">
            <el-select v-model="category" filterable placeholder="根据项目筛选" size="small" v-on:change="filterByCategory"
            style="padding-top:16px">
              <el-option
                v-for="item in categorys"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>          
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
            @cell-dblclick="dblhandleCurrentChange">
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
            prop="category"
            label="所属项目"
            width="150">
                <template scope="scope">
                    <el-input v-if="scope.row.editable" v-model='imageCategory' size="small"
                    @change="handleEdit(scope.row.id)"
                    v-on:blur="inputblur"></el-input>
                    <span v-else>{{scope.row.category}}</span>
                </template>
            </el-table-column>
            <el-table-column
            prop="environment"
            label="所在环境"
            width="100">
            </el-table-column>
            <el-table-column
            prop="last_version"
            label="上个版本">
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" size="mini" circle plain
                                @click.native="sureView(deleteImage,tableImageData[scope.$index]['id'],tableImageData[scope.$index]['name'])">
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
    props: ['categorys'],
    data() {
      return {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tableImageData: [],
        imageCategory: '',
        environmentId: null,
        environments: [],
        category: null,
        imageName: null
      }
    },
    mounted() {
      this.imageList();
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
        imageList(environmentId, categoryName, imageName){
            this.$axios.get(this.$api.imageList, 
            {
            params: {page: this.currentPage, size: this.pageSize, environment_id: environmentId, category: categoryName, name: imageName}
            }).then((response) => {
                this.tableImageData = response.data['res']
                this.total = response.data['total']
            })
        },
        handleSizeChange(val){
            this.pageSize = val;
            this.imageList(this.environmentId, this.category, this.imageName)
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.imageList(this.environmentId, this.category, this.imageName)
        },
        filterByEnv(){
            this.imageList(this.environmentId, this.category, this.imageName)
        },
        filterByCategory(){
            this.imageList(this.environmentId, this.category, this.imageName)
        },
        searchByName(){
            this.imageList(this.environmentId, this.category, this.imageName)
        },
        refreshList(){
            this.currentPage = 1;
            this.environmentId = null;
            this.category = null;
            this.imageName = null;
            this.imageList(this.environmentId, this.category, this.imageName);
        },
        handleEdit(id){
            let data = {
                'category': this.imageCategory
            }
            this.$axios.put((this.$api.imageOperation + id), data).then((response) => {
                if (this.messageShow(this, response)){
                    this.imageList(this.environmentId, this.category, this.imageName);
                }
                }).catch((error) => {
                this.errorMessageShow(this, error.response);
            })
        },
        deleteImage(id){
            this.$axios.delete((this.$api.imageOperation + id)).then((response) => {
                if (this.messageShow(this, response)){
                    this.imageList(this.environmentId, this.category, this.imageName);
                }
                }).catch((error) => {
                this.errorMessageShow(this, error.response);
            })
        },
        dblhandleCurrentChange(row) {
            row.editable = true
        },
        inputblur(row){
            row.editable = false
            this.imageCategory = null
        }
    }
  }
</script>