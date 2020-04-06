<template>
    <div>
        <el-row :gutter="10">
          <el-col :span="3"><h2>产品开通信息</h2></el-col>
          <el-col :span="3" :offset="15">
            <el-select v-model="category" filterable placeholder="根据项目筛选" size="small" v-on:change="filterProduct"
            style="padding-top:17px">
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
          <!-- <el-col :span="1" style=padding-top:16px>
            <el-button @click.native="addBtn()" type="primary" icon="el-icon-plus" size="small" circle plain></el-button>
          </el-col> -->
          <el-col :span="1" style=padding-top:16px>
            <el-dropdown>
            <span split-button class="el-dropdown-link icon-warp">
                <i class="el-icon-circle-plus-outline"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="addBtn()">产品</el-dropdown-item>
                <el-dropdown-item @click.native="addRegionBtn()">地域</el-dropdown-item>
            </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-table
            :data="tableData"
            stripe
            style="width: 100%"
            @row-dblclick="editProduct">
            <el-table-column
            type="index"
            label="No."
            width="50">
            </el-table-column>
            <el-table-column
            prop="category"
            label="项目组"
            width="100">
            </el-table-column>
            <el-table-column
            prop="product"
            label="产品"
            width="120">
            </el-table-column>
            <el-table-column
            prop="function"
            label="功能"
            width="120">
            </el-table-column>
            <el-table-column label="地域">
                <template v-for="(item,index) in tableHead">
                    <el-table-column :prop="item.region" :label="item.name" :key="index" width="100"></el-table-column>
                </template>
            </el-table-column>
            <el-table-column
            fixed="right"
            label="操作"
            width="50">
                <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" size="mini" circle plain
                                @click.native="sureView(deleteProduct,tableData[scope.$index]['id'],tableData[scope.$index]['function'])">
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

        <el-dialog title="产品配置" :visible.sync="dialogFormVisible">
          <el-form :model="productForm" :rules="rules" ref="productForm" label-width="150px" class="demo-productForm">
              <el-form-item label="项目" prop="category_id" size="small">
                <el-select v-model="productForm.category_id" placeholder="请选择项目">
                  <el-option
                    v-for="item in categorys"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="产品名称" prop="product" size="small">
                  <el-input v-model="productForm.product" class="commonwidth"></el-input>
              </el-form-item>
              <el-form-item label="二级功能" prop="function" size="small">
                  <el-input v-model="productForm.function" class="commonwidth"></el-input>
              </el-form-item>
              <el-form-item label="开通地域" prop="region" size="small">
                  <template>
                      <el-checkbox-group v-model="productForm.region">
                          <template v-for="(item,index) in tableHead">
                              <el-checkbox :value="item.region" :label="item.region" :key="index"></el-checkbox>
                          </template>
                      </el-checkbox-group>
                  </template>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancleBtn()">取 消</el-button>
              <el-button v-if="editFlag === true" type="primary" @click="editProductBtn(productForm['id'])">修 改</el-button>
              <el-button v-else type="primary" @click="addProductBtn()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="添加地域" :visible.sync="dialogRegionFormVisible" width="30%">
          <el-form :model="regionForm" :rules="regionRules" ref="regionForm" label-width="150px" class="demo-regionForm">
              <el-form-item label="地域名称" prop="name" size="small">
                  <el-input v-model="regionForm.name" class="small-size"></el-input>
              </el-form-item>
              <el-form-item label="地域英文字符" prop="region" size="small">
                  <el-input v-model="regionForm.region" class="small-size"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancleRegionBtn()">取 消</el-button>
              <el-button type="primary" @click="addRegion()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    inject: ['reload'],
    props: ['categorys'],
    data() {
      return {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        dialogFormVisible: false,
        dialogRegionFormVisible: false,
        editFlag: false,
        category: '',
        tableData: [],
        tableHead: [],
        productForm: {
            id: '',
            category_id: null,
            product: '',
            function: '',
            region: []
        },
        rules: {
            category_id: [
                { required: true, message: '请选择所属项目', trigger: 'change' },
            ],
            product: [
                { required: true, message: '请输入产品名称', trigger: 'blur' }
            ],
            function: [
                { required: true, message: '请输入产品二级功能', trigger: 'blur' }
            ],
            region: [
                { required: true, message: '请选择开通地域', trigger: 'blur' }
            ]
        },
        regionForm: {
            name: '',
            region: ''
        },
        regionRules: {
            name: [
                { required: true, message: '请输入地域名称', trigger: 'blur' }
            ],
            region: [
                { required: true, message: '请输入输入地域英文表示字符', trigger: 'blur' }
            ]
        },
      }
    },
    mounted() {
      this.regionList();
      this.productList();
    },
    methods: {
        regionList(){
            this.$axios.get(this.$api.regionList,{
                params: {page: 1, size: 100}
            }).then((response) =>{
                this.tableHead = response.data['res']
            })
        },
        productList(category){
            this.$axios.get(this.$api.productList, {
                params: {page: this.currentPage, size: this.pageSize, category_id: category}
            }).then((response) => {
                this.tableData = response.data['res']
                this.total = response.data['total']
            })
        },
        handleSizeChange(val){
            this.pageSize = val;
            this.productList(this.category)
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.productList(this.category)
        },
        filterProduct(){
            this.productList(this.category)
        },
        refreshList(){
            this.currentPage = 1,
            this.category = null,
            this.productList(this.category)
        },
        editProduct(row){
            this.$axios.get((this.$api.productManage + '/' + row.id)).then((response) => {
                this.productForm = response.data['res']
            })
            this.dialogFormVisible = true
            this.editFlag = true
        },
        editProductBtn(id){
            let data = {
                'category_id': this.productForm.category_id,
                'product': this.productForm.product,
                'function': this.productForm.function,
                'region': this.productForm.region
            }
            this.$axios.put((this.$api.productManage + '/' + id), data).then((response) => {
                if (this.messageShow(this, response)){
                    this.productList(this.category)
                    this.dialogFormVisible = false
                    this.editFlag = false
                }
                }).catch((error) => {
                    this.errorMessageShow(this, error.response);
            })
        },
        addBtn(){
            this.initForm()
            this.editFlag = false
            this.dialogFormVisible = true
        },
        addRegionBtn(){
            this.initRegionForm()
            this.dialogRegionFormVisible = true
        },
        addProductBtn(){
            let data = {
                'category_id': this.productForm.category_id,
                'product': this.productForm.product,
                'function': this.productForm.function,
                'region': this.productForm.region
            }
            this.$axios.post(this.$api.productManage, data).then((response) => {
                if (this.messageShow(this, response)){
                    this.productList(this.category)
                    this.dialogFormVisible = false
                }
                }).catch((error) => {
                    this.errorMessageShow(this, error.response);
            })
        },
        addRegion(){
            let data = {
                'name': this.regionForm.name,
                'region': this.regionForm.region
            }
            this.$axios.post(this.$api.regionManage, data).then((response) => {
                if (this.messageShow(this, response)){
                    this.dialogFormVisible = false
                    this.reload()
                }
                }).catch((error) => {
                    this.errorMessageShow(this, error.response);
            })
        },
        initForm(){
            this.productForm.category_id = null,
            this.productForm.product = null,
            this.productForm.function = null,
            this.productForm.region = []
        },
        initRegionForm(){
            this.regionForm.name = '',
            this.regionForm.region = ''
        },
        cancleBtn(){
            this.initForm()
            this.editFlag = false
            this.dialogFormVisible = false
        },
        cancleRegionBtn(){
            this.initRegionForm()
            this.dialogRegionFormVisible = false
        },
        deleteProduct(id){
            this.$axios.delete((this.$api.productManage + '/' + id)).then((response) => {
            if (this.messageShow(this, response)){
                this.productList(this.category);
            }
            }).catch((error) => {
            this.errorMessageShow(this, error.response);
            })
        }
    }
}
</script>