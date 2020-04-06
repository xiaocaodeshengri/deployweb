<template>
<div>
    <el-page-header @back="goBack" v-bind:content="subHeader"></el-page-header>
    <el-divider></el-divider>
    <el-form :model="requireForm" :rules="rules" ref="requireForm" label-width="150px" class="demo-requireForm" label-position="top">
        <el-form-item label="需求标题" prop="title" size="small">
            <el-input v-model="requireForm.title" class="commonwidth"></el-input>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="4">
            <el-form-item label="提出者" prop="questioner" size="small">
                <el-input v-model="requireForm.questioner" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="项目" prop="category_id" size="small">
                <el-select v-model="requireForm.category_id" placeholder="请选择项目">
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
                <el-select v-model="requireForm.p_class" placeholder="请选择需求级别">
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
            <el-form-item label="需求类型" prop="record_type" size="small">
                <el-select v-model="requireForm.record_type" placeholder="请选择需求类型">
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
                <!-- <el-input v-model="requireForm.resolver"></el-input> -->
                <el-autocomplete
                  class="inline-input"
                  v-model="requireForm.resolver"
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
        <ckeditor :editor="editor" @ready="editorOnReady" v-model="requireForm.body" :config="editorConfig">
        </ckeditor>
        <el-divider></el-divider>
        </div>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('requireForm')" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
            <el-button @click="resetForm('requireForm')">重 置</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn'
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
// import func from '../../../vue-temp/vue-editor-bridge';

  export default {
    inject: ['reload'],
    props: ['categorys'],
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
        requireEditFlag: false,
        requireEditId: '',
        subHeader: '',
        loading: false,
        p_classes: [
          {key: 'P1', value: 'P1'},
          {key: 'P2', value: 'P2'},
          {key: 'P3', value: 'P3'},
          {key: 'P4', value: 'P4'}
        ],
        record_types: [
          {key: '环境需求', value: '环境需求'},
          {key: '物料需求', value: '物料需求'},
          {key: '其它', value: '其它'}
        ],
        requireForm: {
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
            { required: true, message: '请选择需求级别', trigger: 'blur' }
          ],
          resolver: [
            { required: true, message: '请输入需求指派人', trigger: 'blur' }
          ],
          body: [
            { required: true, message: '请填写需求详细内容', trigger: 'blur' }
          ],
          record_type: [
            { required: true, message: '请选择需求类型', trigger: 'blur' }
          ]
        }
      };
    },
    mounted() {
      this.judgeCreateOrEdit();
      this.getAllUsers();
    },
    methods: {
        initRequireFormEdit(id){
          this.$axios.get((this.$api.requireManage + '/' + id)).then((response) => {
            this.requireForm.title = response.data['res']['title']
            this.requireForm.category_id = response.data['res']['category_id']
            this.requireForm.p_class = response.data['res']['p_class']
            this.requireForm.questioner = response.data['res']['questioner']
            this.requireForm.resolver = response.data['res']['resolver']
            this.requireForm.body = response.data['res']['body']
            this.requireForm.record_type = response.data['res']['record_type']
          })
        },
        judgeCreateOrEdit(){
            if(this.$route.path.indexOf('edit') >= 0){
                this.requireEditFlag = true
                this.subHeader = '编辑需求'
                this.requireEditId = this.$route.params.id
                this.initRequireFormEdit(this.requireEditId)
            }else{
                this.requireEditFlag = false
                this.subHeader = '新建需求'
                this.requireForm.questioner = localStorage.getItem("name")
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
              "title": this.requireForm.title,
              "category_id": this.requireForm.category_id,
              "p_class": this.requireForm.p_class,
              "questioner": this.requireForm.questioner,
              "resolver": this.requireForm.resolver,
              "body": this.requireForm.body,
              "record_type": this.requireForm.record_type
            }
            if (this.requireEditFlag === false){
              this.$axios.post(this.$api.requireManage, data).then((response) => {
                if (this.messageShow(this, response)){
                  this.loading = false
                  this.$router.push('/q_r/requires')
                  this.reload();
                }
              }).catch((error) => {
                this.errorMessageShow(this, error.response);
              })
            }else{
              this.$axios.put((this.$api.requireManage + '/' + this.requireEditId), data).then((response) => {
                if (this.messageShow(this, response)){
                  this.loading = false
                  this.$router.push('/q_r/requires')
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