<template>
    <div>
        <el-button style="float: right; padding: 3px 0 0 0" type="text"
        @click.native="dialogFormVisible = true">添加白名单
        </el-button>
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
            prop="type"
            label="类型"
            width="80">
            </el-table-column>
            <el-table-column
            prop="uuid"
            label="实例ID"
            width="300">
            </el-table-column>
            <el-table-column
            prop="remark"
            label="备注"
            min-width="230">
            </el-table-column>
            <el-table-column
            prop="expire_date"
            label="保留截止时间">
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" size="mini" circle plain
                                @click.native="sureView(delWhiteList,tableData[scope.$index]['id'],tableData[scope.$index]['uuid'])">
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
        
        <el-dialog title="添加白名单" :visible.sync="dialogFormVisible">
          <el-form :model="whiteListForm" :rules="rules" ref="whiteListForm" label-width="150px" class="demo-whiteListForm">
                <el-form-item label="实例UUID" prop="uuid" size="small">
                    <el-input v-model="whiteListForm.uuid" class="commonwidth"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark" size="small">
                    <el-input v-model="whiteListForm.remark" class="commonwidth" placeholder="名称，用途"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type" size="small">
                    <el-select v-model="whiteListForm.type" placeholder="请选择实例类型">
                        <el-option
                        v-for="item in resourceTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="保留截止时间" required size="small">
                    <el-form-item prop="expireDate">
                        <el-date-picker type="date" placeholder="选择日期" v-model="whiteListForm.expireDate">
                        </el-date-picker>
                    </el-form-item>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelBtn()">取 消</el-button>
              <el-button type="primary" @click="addBtn()">新 建</el-button>
            </div>
        </el-dialog>        
    </div>
</template>

<script>
    export default {
        name: "whilteList",
        data() {
            return {
                currentPage: 1,
                pageSize: 10,
                total: 0,
                dialogFormVisible: false,
                tableData: [
                    {"id": 1, "type": "云主机", "uuid": "e5d82ab9-469c-4b4b-9854-e0db88a27dc7", "remark": "ABCDEFG", "expire_date": "2020-03-03"}
                ],
                whiteListForm: {
                    type: null,
                    uuid: null,
                    remark: null,
                    expireDate: null
                },
                rules: {
                    type: [
                        { required: true, message: '请选择实例类型', trigger: 'blur' },
                    ],
                    uuid: [
                        { required: true, message: '请输入实例UUID', trigger: 'blur' },
                        { min: 20, max: 60, message: '长度在 20 到 60 个字符', trigger: 'blur' }
                    ],
                    remark: [
                        { required: true, message: '请输入实例备注信息（用途，名称等），以避免遗忘', trigger: 'blur' }
                    ],
                    expireDate: [
                        { required: true, message: '请选择实例保留截止时间', trigger: 'blur' }
                    ],
                },
                resourceTypes: [{
                    value: '云主机',
                    label: '云主机'
                    }, {
                    value: '云硬盘',
                    label: '云硬盘'
                    }, {
                    value: '容器',
                    label: '容器'
                    }, {
                    value: 'MySQL',
                    label: 'MySQL'
                    }, {
                    value: 'Mongo',
                    label: 'Mongo'
                    }, {
                    value: 'Redis',
                    label: 'Redis'
                    }, {
                    value: 'Kafka',
                    label: 'Kafka'
                }],
            }
        },
        mounted() {
            this.whiteList();
        },
        methods: {
            handleSizeChange(val){
                this.pageSize = val;
                this.whiteList()
            },
            handleCurrentChange(val){
                this.currentPage = val;
                this.whiteList()
            },
            whiteList() {

            },
            delWhiteList(id) {
                console.log(id)
            },
            addBtn(){
                this.dialogFormVisible = false
            },
            cancelBtn(){
                this.whiteListForm.uuid = null;
                this.whiteListForm.type = null;
                this.whiteListForm.remark = null;
                this.whiteListForm.expireDate = null;
                this.dialogFormVisible = false
            },
        }
    }
</script>