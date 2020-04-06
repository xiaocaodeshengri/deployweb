<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-page-header @back="goBack" :content="plan.title"></el-page-header>
            </el-col>
          <el-col :span="2" style="padding-top:0px" :offset="6">
                <el-button type="primary" size="mini" plain
                            @click.native="testEnv">设置测试环境
                </el-button>
          </el-col>
          <el-col :span="2" style=padding-top:0px>
            <el-button @click="testDialog = true" type="warning" size="mini" plain>版本转测</el-button>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <div class="row">
            <div class="mdui-typo">
                <ul>
                <li>项目：{{ plan.category }}</li>
                <li>责任人：{{ plan.author }}</li> 
                <li>发布版本：{{ plan.version }}</li>
                <li>状态:</li>
                    <p v-if="plan.status === 0">未进行预发布部署</p>
                    <p v-else-if="plan.status === 1">预发布测试验证中</p>
                    <p v-else>上线完成</p>
                <li>计划上预发布时间：{{ plan.yfb_datetime }}</li>
                <li>计划上线时间：{{ plan.online_datetime }}</li>
                <el-divider content-position="left"><strong>详细内容</strong></el-divider>
                <span v-html="plan.remark"></span>
                </ul>
            </div>
        </div>
        <el-divider content-position="left"><strong>测试环境 - {{plan.environment}}</strong></el-divider>

        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column type="expand">
            <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="下载链接">
                        <ul>
                            {{ props.row.test_urls }}
                        </ul>
                    </el-form-item>
                </el-form>
            </template>
            </el-table-column>
            <el-table-column
            label="开发责任人"
            prop="developer"
            width="120">
            </el-table-column>
            <el-table-column
            label="详细描述"
            prop="describe">
            </el-table-column>
            <el-table-column
            label="状态"
            prop="status"
            width="100">
            </el-table-column>
            <el-table-column
            label="时间"
            prop="timestamp"
            width="230">
            </el-table-column>
            <el-table-column
            label="操作"
            width="150">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" round plain
                                @click.native="testDeploy(tableData[scope.$index]['id'])"
                                v-loading.fullscreen.lock="fullscreenLoading">Deploy
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" circle plain
                                @click.native="sureView(deleteTest,tableData[scope.$index]['id'],'')">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="测试环境" :visible.sync="envDialog" width="30%">
          <el-form :model="envForm" ref="envForm" label-width="100px">
              <el-form-item label="测试环境" prop="environment_id" size="small">
                <el-select v-model="envForm.environment_id" placeholder="请选择测试环境">
                    <el-option
                    v-for="item in environments"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="testEnvBtn()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="版本转测" :visible.sync="testDialog">
            <el-form :model="testForm" :rules="testRule" ref="testForm" label-width="100px" class="demo-testForm">
                <el-form-item label="开发责任人" prop="developer" size="small">
                    <el-input v-model="testForm.developer" class="width300"></el-input>
                </el-form-item>
                <el-form-item label="改动详情" prop="describe" size="small">
                    <el-input type="textarea" v-model="testForm.describe" class="commonwidth"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small"
                                @click="addTestUrl()">添加下载链接
                    </el-button>
                </el-form-item>
            </el-form>
            <hr>
            <el-table :data="testForm.test_urls"
                        style="width:100%"
                        :show-header="false"
                        size="mini"
                        max-height="538"
                        stripe>
                <el-table-column property="url" label="下载链接" header-align="center" minWidth="50">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.url" size="small" placeholder="http://***.tar.gz">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column property="value" label="操作" header-align="center" width="140">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button type="danger" size="mini"
                                        @click.native="delTestUrl(scope.$index)"> 删除
                            </el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
              <el-button @click="chanceBtn()">取 消</el-button>
              <el-button type="primary" @click="addTestBtn()">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
export default {
    data(){
        return{
            role: 0,
            fullscreenLoading: false,
            envDialog: false,
            testDialog: false,
            plan_id: Number,
            plan: {
                id: Number,
                title: "",
                category: "",
                category_id: '',
                author: "",
                version: "",
                status: Number,
                yfb_datetime: "",
                online_datetime: "",
                remark: "",
                environment: ""
            },
            tableData: [],
            testForm: {
                developer: '',
                describe: '',
                test_urls: []
            },
            testRule: {
                developer: [
                    { required: true, message: '请输入开发责任人', trigger: 'blur' }
                ],
                describe: [
                    { required: true, message: '请输入此次转测变更的详情', trigger: 'blur' },
                ]
            },
            envForm: {
                environment_id: ''
            },
            environments: []
        }
    },
    mounted() {
        this.initPlanDetail()
        this.testList()
    },
    methods: {
        initPlanDetail(){
            let id = this.$route.params.id
            this.plan_id = id
            this.$axios.get((this.$api.planManage + '/' + id)).then((response) => {
                this.plan.id = response.data['res']['id']
                this.plan.title = response.data['res']['title']
                this.plan.category = response.data['res']['category']
                this.plan.category_id = response.data['res']['category_id']
                this.plan.version = response.data['res']['version']
                this.plan.author = response.data['res']['author']
                this.plan.yfb_datetime = response.data['res']['yfb_datetime']
                this.plan.online_datetime = response.data['res']['online_datetime']
                this.plan.remark = response.data['res']['remark']
                this.plan.status = response.data['res']['status']
                this.plan.environment = response.data['res']['environment']
                let category_id = response.data['res']['category_id']
                this.$axios.get(this.$api.environmentList, {
                    params: {page: 1, size: 100, category_id: category_id}
                }).then((response) => {
                    this.environments = response.data['res']
                })
            })
        },
        testList(){
            this.$axios.get(this.$api.testList.replace(/PLAN_ID/g, this.$route.params.id)).then(response => {
                this.tableData = response.data['res']
            })
        },
        goBack(){
            this.$router.go(-1);
        },
        addTestUrl(){
            this.testForm.test_urls.push({url: ''})
        },
        delTestUrl(i){
            this.testForm.test_urls.splice(i, 1)
        },
        chanceBtn(){
            this.testDialog = false
            this.testForm.developer = ''
            this.testForm.describe = ''
            this.testForm.test_urls = []
        },
        addTestBtn(){
            let data = {
                "developer": this.testForm.developer,
                "describe": this.testForm.describe,
                "test_urls": this.testForm.test_urls
            }
            this.$axios.post(this.$api.testAdd.replace(/PLAN_ID/g, this.plan_id), data).then((response) => {
                if (this.messageShow(this, response)){
                    this.testDialog = false;
                    this.testList();
                }
            }).catch((error) => {
                this.errorMessageShow(this, error.response);
            })
        },
        testEnv(){
            this.envForm.environment_id = this.plan.environment_id
            this.envDialog = true
        },
        testEnvBtn(){
            let data = {
                "test_environment": this.envForm.environment_id
            }
            this.$axios.put(this.$api.planTestEnv.replace(/PLAN_ID/g, this.plan_id), data).then((response) => {
                if (this.messageShow(this, response)){
                    this.envDialog = false;
                    this.initPlanDetail();
                }
            }).catch((error) => {
                this.errorMessageShow(this, error.response);
            })
        },
        testDeploy(id){
            this.fullscreenLoading = true
            this.$axios.get(this.$api.testOperation + id + "/" + "deploy").then(response => {
                this.messageShow(this, response)
                this.fullscreenLoading = false
            }).catch((error) => {
                this.errorMessageShow(this, error.response)
                this.fullscreenLoading = false
            })
        },
        deleteTest(id){
            this.$axios.delete(this.$api.testOperation + id).then(response => {
                if (this.messageShow(this, response)){
                    this.testList();
                }
            }).catch((error) => {
                this.errorMessageShow(this, error.response);
            })
        }
    }
}
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 80px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
  .el-drawer {
    padding: 10px 10px 10px 10px;
    position: absolute;
    box-sizing: border-box;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 10px -5px rgba(0,0,0,.2), 0 16px 24px 2px rgba(0,0,0,.14), 0 6px 30px 5px rgba(0,0,0,.12);
    overflow: hidden;
  }  
  .demo-drawer__footer {
      display: flex;
  }
</style>