<template>
<div>
    <el-page-header @back="goBack" v-bind:content="subHeader"></el-page-header>
    <el-divider></el-divider>
    <el-form :model="questionForm" :rules="rules" ref="questionForm" label-width="150px" class="demo-questionForm" label-position="top">
        <el-form-item label="问题标题" prop="title" size="small">
            <el-input v-model="questionForm.title" class="commonwidth"></el-input>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="4">
            <el-form-item label="提出者" prop="questioner" size="small">
                <el-input v-model="questionForm.questioner" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="项目" prop="category_id" size="small">
                <el-select v-model="questionForm.category_id" placeholder="请选择项目">
                  <el-option
                    v-for="item in categorys"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="级别" prop="p_class" size="small">
                <el-select v-model="questionForm.p_class" placeholder="请选择问题级别">
                  <el-option
                    v-for="item in p_classes"
                    :key="item.key"
                    :label="item.key"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="问题类型" prop="record_type" size="small">
                <el-select v-model="questionForm.record_type" placeholder="请选择问题类型">
                  <el-option
                    v-for="item in record_types"
                    :key="item.key"
                    :label="item.key"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="指派" prop="resolver" size="small">
                <!-- <el-input v-model="questionForm.resolver"></el-input> -->
                <el-autocomplete
                  class="inline-input"
                  v-model="questionForm.resolver"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入指派人员"
                  :trigger-on-focus="true"
                  >
                </el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="详细内容" prop="body" size="small">
        <div  class="deploytext">
        <ckeditor :editor="editor" @ready="editorOnReady" v-model="questionForm.body" :config="editorConfig">
        </ckeditor>
        <el-divider></el-divider>
        </div>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('questionForm')" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
            <el-button @click="resetForm('questionForm')">重 置</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn'
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
// import func from '../../../vue-temp/vue-editor-bridge';

  export default {
    props: ['categorys'],
    inject: ['reload'],
    data() {
      return {
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
        users: [],
        questionEditFlag: false,
        questionEditId: '',
        subHeader: '',
        loading: false,
        p_classes: [
          {key: 'P1', value: 'P1'},
          {key: 'P2', value: 'P2'},
          {key: 'P3', value: 'P3'},
          {key: 'P4', value: 'P4'}
        ],
        record_types: [
          {key: '故障', value: '故障'},
          {key: '环境问题', value: '环境问题'},
          {key: '脚本问题', value: '脚本问题'},
          {key: '版本问题', value: '版本问题'},
          {key: '测试数据有误', value: '测试数据有误'},
          {key: '其它', value: '其它'}
        ],
        questionForm: {
          title: '',
          category_id: '',
          questioner: '',
          p_class: '',
          resolver: '',
          body: '',
          record_type: ''
        },
        rules: {
          title: [
            { required: true, message: '请输入计划标题', trigger: 'blur' },
            { min: 3, max: 60, message: '长度在 3 到 60 个字符', trigger: 'blur' }
          ],
          category_id: [
            { required: true, message: '请选择所属项目', trigger: 'change' }
          ],
          p_class: [
            { required: true, message: '请选择问题级别', trigger: 'blur' }
          ],
          resolver: [
            { required: true, message: '请输入问题指派人', trigger: 'blur' }
          ],
          body: [
            { required: true, message: '请填写问题详细内容', trigger: 'blur' }
          ],
          record_type: [
            { required: true, message: '请选择问题类型', trigger: 'blur' }
          ]
        }
      };
    },
    mounted() {
      this.judgeCreateOrEdit();
      this.getAllUsers();
    },
    methods: {
        initQuestionFormEdit(id){
          this.$axios.get((this.$api.questionManage + '/' + id)).then((response) => {
            this.questionForm.title = response.data['res']['title']
            this.questionForm.category_id = response.data['res']['category_id']
            this.questionForm.p_class = response.data['res']['p_class']
            this.questionForm.questioner = response.data['res']['questioner']
            this.questionForm.resolver = response.data['res']['resolver']
            this.questionForm.body = response.data['res']['body']
            this.questionForm.record_type = response.data['res']['record_type']
          })
        },
        judgeCreateOrEdit(){
            if(this.$route.path.indexOf('edit') >= 0){
                this.questionEditFlag = true
                this.subHeader = '编辑问题'
                this.questionEditId = this.$route.params.id
                this.initQuestionFormEdit(this.questionEditId)
            }else{
                this.questionEditFlag = false
                this.subHeader = '新建问题'
                this.questionForm.questioner = localStorage.getItem("name")
            }
        },
        goBack(){
            this.$router.go(-1);
        },
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
      submitForm(formName) {
        this.loading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {
              "title": this.questionForm.title,
              "category_id": this.questionForm.category_id,
              "p_class": this.questionForm.p_class,
              "questioner": this.questionForm.questioner,
              "resolver": this.questionForm.resolver,
              "body": this.questionForm.body,
              "record_type": this.questionForm.record_type
            }
            if (this.questionEditFlag === false){
              this.$axios.post(this.$api.questionManage, data).then((response) => {
                if (this.messageShow(this, response)){
                  this.loading = false
                  this.$router.push('/q_r/questions')
                  this.reload();
                }
              }).catch((error) => {
                this.errorMessageShow(this, error.response);
              })
            }else{
              this.$axios.put((this.$api.questionManage + '/' + this.questionEditId), data).then((response) => {
                if (this.messageShow(this, response)){
                  this.loading = false
                  this.$router.push('/q_r/questions')
                  this.reload();
                }
              }).catch((error) => {
                this.errorMessageShow(this, error.response);
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      querySearch(queryString, cb) {
        var users = this.users;
        var results = queryString ? users.filter(this.createFilter(queryString)) : users;
        cb(results);
      },
      createFilter(queryString) {
        return (user) => {
          return (user.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      getAllUsers(){
        this.$axios.get(this.$api.userList, 
        {
          params: {page: 1, size: 100}
        }).then((response) => {
          this.users = response.data['res']
        })
      }
    }
  }
</script>