<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="21">
                <el-page-header @back="goBack" :content="question.title"></el-page-header>
            </el-col>
            <!-- <el-col :span="3" :offset="3">
                <el-button @click="answerQuestion" type="primary" size="small" plain>Answer</el-button>
            </el-col> -->
            <el-col :span="1" style=padding-top:0px>
                <el-dropdown>
                <span split-button class="el-dropdown-link icon-warp">
                    <i class="el-icon-circle-plus"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="answerQuestion">解答问题</el-dropdown-item>
                    <el-dropdown-item @click.native="addRemark">添加备注</el-dropdown-item>
                </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <div>
            <div class="mdui-typo">
                <ul>
                <li>项目: {{ question.category }}</li>
                <li>级别: {{ question.p_class }}</li>
                <li>问题类型: {{ question.record_type }}</li>
                <li>发起者: {{ question.questioner }}</li>
                <li>指派: {{ question.resolver }}</li>
                <li>状态: {{ question.status }}</li>
                <li>创建时间: {{ question.create_time }}</li>
                </ul>
                <el-divider content-position="left"><strong>详细内容</strong></el-divider>
                <span v-html="question.body"></span>
                <div v-show="question.answer">
                    <el-divider content-position="left"><strong>解决情况</strong></el-divider>
                    <span v-html="question.answer"></span>
                </div>
            </div>
        </div>

        <el-divider content-position="left"><strong>历史记录</strong></el-divider>
        <el-table
            :data="question.question_histories"
            stripe
            style="width: 100%">
            <el-table-column
            prop="timestamp"
            label="时间"
            width="230">
            </el-table-column>
            <el-table-column
            prop="user"
            label=""
            width="150">
            </el-table-column>
            <el-table-column
            prop="record"
            label="记录"
            min-width="100">
            </el-table-column>
        </el-table>

        <el-dialog title="问题解答" :visible.sync="dialogFormVisible">
          <el-form :model="answerForm" :rules="rules" ref="answerForm" label-width="100px" class="demo-answerForm" label-position="top">
              <el-form-item prop="answer" size="small">
                <div>
                <ckeditor :editor="editor" @ready="editorOnReady" v-model="answerForm.answer" :config="editorConfig">
                </ckeditor>
                <el-divider></el-divider>
                </div>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelBtn()">取 消</el-button>
              <el-button type="primary" @click="answerBtn()">确 认</el-button>
            </div>
        </el-dialog>

        <el-dialog title="备注" :visible.sync="remarkFormVisible">
          <el-form :model="remarkForm" :rules="rules" ref="remarkForm" label-width="100px" class="demo-answerForm" label-position="top">
              <el-form-item prop="remark" size="small" label="备注">
                <el-input type="textarea" v-model="remarkForm.remark"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelBtn()">取 消</el-button>
              <el-button type="primary" @click="addRemarkBtn()">确 认</el-button>
            </div>
        </el-dialog>
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
            dialogFormVisible: false,
            remarkFormVisible: false,
            question: {
                title: "",
                category: "",
                p_class: "",
                questioner: "",
                record_type: "",
                resolver: "",
                status: "",
                create_time: null,
                update_time: null,
                resolve_time: null,
                body: "",
                answer: "",
                question_histories: []
            },
            answerForm: {
                answer: ''
            },
            rules: {
                answer: [
                    { required: true, message: '请解决该问题', trigger: 'blur' },
                ],
                remark: [
                    { required: true, message: '请输入问题备注', trigger: 'blur' },
                ]
            },
            remarkForm: {
                remark: ''
            }
        }
    },
    mounted() {
        this.initQuestionDetail()
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
        initQuestionDetail(){
            let id = this.$route.params.id
            this.$axios.get((this.$api.questionManage + '/' + id)).then((response) => {
                this.question.title = response.data['res']['title']
                this.question.category = response.data['res']['category']
                this.question.p_class = response.data['res']['p_class']
                this.question.questioner = response.data['res']['questioner']
                this.question.record_type = response.data['res']['record_type']
                this.question.resolver = response.data['res']['resolver']
                this.question.status = response.data['res']['status']
                this.question.create_time = response.data['res']['create_time']
                this.question.update_time = response.data['res']['update_time']
                this.question.resolve_time = response.data['res']['resolve_time']
                this.question.body = response.data['res']['body']
                this.question.answer = response.data['res']['answer']
                this.question.question_histories = response.data['res']['question_histories']
            })
        },
        goBack(){
            this.$router.go(-1);
        },
        answerQuestion(){
            this.answerForm.answer = this.question.answer
            this.dialogFormVisible = true
        },
        cancelBtn(){
            this.dialogFormVisible = false
            this.remarkFormVisible = false
            this.reload()
        },
        answerBtn(){
            let id = this.$route.params.id
            let data = {
                'answer': this.answerForm.answer
            }
            this.$axios.put((this.$api.questionManage + '/' + id), data).then((response) => {
                if (this.messageShow(this, response)){
                  this.reload();}
                }).catch((error) => {
                    this.errorMessageShow(this, error.response);
                })
        },
        addRemark(){
            this.remarkForm.answer = ''
            this.remarkFormVisible = true
        },
        addRemarkBtn(){
            let id = this.$route.params.id
            let data = {
                'remark': this.remarkForm.remark
            }
            this.$axios.put((this.$api.questionManage + '/' + id), data).then((response) => {
                if (this.messageShow(this, response)){
                  this.reload();}
                }).catch((error) => {
                    this.errorMessageShow(this, error.response);
                })
        }
    }
}
</script>