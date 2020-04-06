<template>
    <div>
        <el-page-header @back="goBack" :content="deploy.title"></el-page-header>
        <el-divider></el-divider>
        <el-collapse v-model="activeNames">
            <el-collapse-item title="基本信息" name="1">
                <ul>
                    <li>项目:</li>{{ deploy.category }}
                    <li>日期:</li> {{ deploy.timestamp }}
                    <li>责任人:</li> {{ deploy.post_author }}
                    <li>发布版本:</li>{{ deploy.version }}
                    <li>转测范围:</li>{{ deploy.deploy_describe }}
                </ul>
            </el-collapse-item>
            <el-collapse-item title="下载链接" name="2">
                <ul>
                    <li>部署环境:</li>{{ deploy.environment }}
                    <li>部署包下载链接:</li>{{ deploy.deploy_links }}
                    <li v-if="deploy.deploy_uco != null">UCO部署包下载链接:</li>{{ deploy.deploy_uco }}
                    <li v-if="deploy.deploy_uca != null">UCA部署包下载链接:</li>{{ deploy.deploy_uca }}
                    <li v-if="deploy.deploy_ucs != null">UCS部署包获取路径:</li>{{ deploy.deploy_ucs }}
                    <li v-if="deploy.deploy_sql != ''">SQL脚本:</li>{{ deploy.deploy_sql }}
                </ul>
            </el-collapse-item>
            <el-collapse-item title="测试报告" name="3">
                <ul>
                    <span v-html="deploy.body"></span>
                </ul>
            </el-collapse-item>
            <el-collapse-item title="测试报告文档" name="4">
                <li v-for="(item, index) in fileList" :key="index">
                    <a :href="downloadUrl(item.name)">{{ item.name }}</a>
                </li>
            </el-collapse-item>
        </el-collapse>

        <el-divider content-position="right">
        <el-button type="warning" size="mini" round plain
                    @click.native="beginDeploy()">开始部署
        </el-button>
        <el-button type="primary" size="mini" round plain
                    @click.native="addComment()">再次部署
        </el-button>
        </el-divider>

        <el-divider content-position="left">再次部署记录</el-divider>

        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column type="expand">
            <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="部署环境">
                        <span>{{ props.row.environment_name }}</span>
                    </el-form-item>
                    <el-form-item label="下载链接">
                        <span>{{ props.row.site }}</span>
                    </el-form-item>
                    <el-form-item label="描述">
                        <ul>
                            <span v-html="props.row.body"></span>
                        </ul>
                    </el-form-item>
                </el-form>
            </template>
            </el-table-column>
            <el-table-column
            label="责任人"
            prop="author">
            </el-table-column>
            <el-table-column
            label="禅道BUG ID"
            prop="bug_id">
            </el-table-column>
            <el-table-column
            label="时间"
            prop="timestamp">
            </el-table-column>
            <el-table-column
            label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" round plain
                                @click.native="commentDeploy(tableData[scope.$index]['id'])"
                                >Deploy
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" circle plain
                                @click.native="sureView(deleteComment,tableData[scope.$index]['id'],'')">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop> -->

        <el-drawer
        title="再次部署申请"
        :visible.sync="dialog"
        direction="rtl"
        custom-class="demo-drawer"
        ref="drawer"
        size="50%">
            <div class="demo-drawer__content">
                <el-form :model="commentForm" :rules="rules" ref="commentForm" label-width="100px">
                    <el-form-item label="责任人" prop="author" size="small">
                        <el-input v-model="commentForm.author" autocomplete="off" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="禅道BUG ID" prop="bug_id" size="small">
                        <el-input v-model="commentForm.bug_id" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="部署环境" prop="environment_id" size="small">
                        <el-select v-model="commentForm.environment_id" placeholder="请选择部署环境">
                            <el-option
                            v-for="item in environments"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="部署包路径" prop="site" size="small">
                        <el-input type="textarea" v-model="commentForm.site" autocomplete="off"
                        placeholder="http://***.tar.gz;http://***.tar.gz"></el-input>
                    </el-form-item>
                    <el-form-item label="事务记录" prop="body" size="small">
                        <div>
                        <ckeditor :editor="editor" @ready="editorOnReady" v-model="commentForm.body" :config="editorConfig">
                        </ckeditor>
                        <el-divider></el-divider>
                        </div>
                    </el-form-item>
                </el-form>
                <div class="demo-drawer__footer">
                <el-button type="primary" @click.native="addCommentBtn()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
                <el-button @click="dialog = false">取 消</el-button>
                <el-button @click="resetForm('commentForm')">重置</el-button>
                </div>
            </div>
        </el-drawer>

    </div>
</template>

<script>
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn'
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'

export default {
    inject: ['reload'],
    data(){
        return{
            editor: DecoupledEditor,
            editorConfig: {
                language: 'zh-cn',
                fontSize: {
                    options: [8, 10, 'default', 14, 16, 18, 20, 22, 24, 26, 28, 32, 48]
                },
                fontFamily:{
                    options: ['宋体', '仿宋', '微软雅黑', '黑体', '仿宋_GB2312', '楷体', '隶书', '幼圆']
                }
            },
            dialog: false,
            loading: false,
            activeNames: ['1'],
            deploy: {
                title: "",
                body: "",
                timestamp: "",
                category: "",
                post_author: "",
                deploy_uco: "",
                deploy_uca: "",
                deploy_ucs: "",
                deploy_links: "",
                environment: "",
                deploy_sql: "",
                deploy_describe: "",
                version: "",
                api_task_id: "",
                api_test_report: ""
            },
            fileList: [],
            tableData: [],
            commentForm: {
                author: '',
                site: '',
                body: '',
                bug_id: '',
                environment_id: null
            },
            rules: {
                author: [
                    { required: true, message: '请输入责任人', trigger: 'blur' },
                ],
                site: [
                    { required: true, message: '请输入下载链接', trigger: 'blur' }
                ],
                body: [
                    { required: true, message: '请输入再次部署原因', trigger: 'blur' },
                ],
                bug_id: [
                    { required: false, message: '请填写对应禅道BUG ID', trigger: 'blur' }
                ],
                environment_id: [
                    { required: true, message: '请选择部署环境', trigger: 'change' }
                ]
            },
            environments: [{
                value: 2,
                label: 'yfb-uco'
                }, {
                value: 3,
                label: 'UCA-LF'
                }, {
                value: 5,
                label: 'UCA-TJ'
                }, {
                value: 6,
                label: 'UCA-BJ'
                }, {
                value: 7,
                label: 'CVM-TJ'
                }, {
                value: 8,
                label: 'CVM-BJ'
                }, {
                value: 10,
                label: 'CVM-LF'
                }, {
                value: 11,
                label: 'CVK-TJ'
                }, {
                value: 13,
                label: 'CVK-BJ'
                }, {
                value: 15,
                label: 'CVK-LF'
                }, {
                value: 17,
                label: 'VCFC-TJ'
                }, {
                value: 18,
                label: 'VCFC-BJ'
                }, {
                value: 19,
                label: 'VCFC-LF'
            }],
        }
    },
    mounted() {
        this.initDeployDetial();
        this.getComments();
    },
    methods: {
        editorOnReady(editor){
            editor.ui.getEditableElement().parentElement.insertBefore(
                editor.ui.view.toolbar.element,
                editor.ui.getEditableElement()
            );
            editor.plugins.get('FileRepository').createUploadAdapter = function(loader){
                let val = editor.getData();
                return{
                    upload: async function(){
                        return await loader.file.then(f => {
                            const F = new FileReader();
                            F.readAsArrayBuffer(f);
                            return new Promise(resolve => {
                                F.onload = function(){
                                    resolve(F.result)
                                };
                            })
                        }).then(bufAsArray => {
                            return{
                                default: ''
                            }
                        });
                    }
                }
            };
        }, 
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        initDeployDetial(){
            let id = this.$route.params.id
            this.$axios.get((this.$api.deployManage + '/' + id)).then((response) => {
                this.deploy.title = response.data['res']['title']
                this.deploy.category = response.data['res']['category']
                this.deploy.version = response.data['res']['version']
                this.deploy.post_author = response.data['res']['post_author']
                this.deploy.deploy_uco = response.data['res']['deploy_uco']
                this.deploy.deploy_uca = response.data['res']['deploy_uca']
                this.deploy.deploy_ucs = response.data['res']['deploy_ucs']
                this.deploy.deploy_sql = response.data['res']['deploy_sql']
                this.deploy.deploy_links = response.data['res']['deploy_links']
                this.deploy.environment = response.data['res']['environment_name']
                this.deploy.deploy_describe = response.data['res']['deploy_describe']
                this.deploy.body = response.data['res']['body']
                this.deploy.api_task_id = response.data['res']['api_task_id']
                this.deploy.api_test_report = response.data['res']['api_test_report']
                this.deploy.timestamp = response.data['res']['timestamp']
                this.fileList = response.data['fileList']
            })
        },
        goBack(){
            this.$router.go(-1);
        },
        beginDeploy(){
            let post_id = this.$route.params.id
            this.$axios.get((this.$api.postDeploy + post_id)).then((response) => {
                this.$notify({
                    title: '开始部署',
                    message: '正在进行部署，部署完成后会有邮件通知',
                    type: 'success',
                })
                this.messageShow(this, response);
            }).catch((error) =>{
                this.errorMessageShow(this, error.response);
            })
        },
        getComments(){
            let deploy_id = this.$route.params.id
            this.$axios.get(this.$api.commentList.replace(/DEPLOY_ID/g, deploy_id),{
                params: {page: 1, size: 100}
            }).then(response => {
                this.tableData = response.data['res']
            })
        },
        addComment(){
            this.dialog = true
            this.commentForm.author = localStorage.getItem("name")
        },
        commentDeploy(id){
            this.$axios.get((this.$api.commentDeploy + id)).then((response) => {
                this.$notify({
                    title: '开始部署',
                    message: '正在进行部署，部署完成后会有邮件通知',
                    type: 'success',
                })
                this.messageShow(this, response);
            }).catch((error) =>{
                this.errorMessageShow(this, error.response);
            })
        },
        deleteComment(id){
            this.$axios.delete((this.$api.commentDelete + id)).then(response => {
                if (this.messageShow(this, response)){
                    this.reload();
                }
                }).catch((error) => {
                this.errorMessageShow(this, error.response);
                })
        },
        addCommentBtn(){
            this.$confirm('确定要提交再次部署申请吗？')
                .then(() => {
                this.loading = true;
                let deploy_id = this.$route.params.id
                let data = {
                    "author": this.commentForm.author,
                    "site": this.commentForm.site,
                    "body": this.commentForm.body,
                    "bug_id": this.commentForm.bug_id,
                    "environment_id": this.commentForm.environment_id
                }
                this.$axios.post(this.$api.commentAdd.replace(/DEPLOY_ID/g, deploy_id), data).then(response => {
                    if (this.messageShow(this, response)){
                        this.loading = false;
                        this.dialog = false;
                        this.reload();
                    }
                }).catch((error) => {
                    this.loading = false;
                    this.dialog = false;
                    this.errorMessageShow(this, error.response);
                })
            })
        },
        downloadUrl(fileName){
            let url = this.$api.fileDownload + 'report/' + fileName
            return url 
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