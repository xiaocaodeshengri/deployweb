<template>
<div>
    <el-page-header @back="goBack" v-bind:content="subHeader"></el-page-header>
    <el-divider></el-divider>
    <el-form :model="planForm" :rules="rules" ref="planForm" label-width="150px" class="demo-planForm" label-position="top">
        <el-form-item label="计划标题" prop="title" size="small">
            <el-input v-model="planForm.title" class="commonwidth"></el-input>
        </el-form-item>
        <el-form-item label="发布版本" prop="version" size="small">
            <el-input v-model="planForm.version" class="commonwidth"></el-input>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="4">
            <el-form-item label="项目" prop="category_id" size="small">
                <el-select v-model="planForm.category_id" placeholder="请选择项目">
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
            <el-form-item label="责任人" prop="author" size="small">
                <el-input v-model="planForm.author" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="计划上预发布时间" required size="small">
                <el-form-item prop="yfb_datetime">
                    <el-date-picker type="date" placeholder="选择日期" v-model="planForm.yfb_datetime">
                    </el-date-picker>
                </el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="计划上线时间" required size="small">
                <el-form-item prop="online_datetime">
                    <el-date-picker type="date" placeholder="选择日期" v-model="planForm.online_datetime">
                    </el-date-picker>
                </el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="转测详细内容" prop="remark" size="small">
        <div  class="deploytext">
        <ckeditor :editor="editor" @ready="editorOnReady" v-model="planForm.remark" :config="editorConfig">
        </ckeditor>
        <el-divider></el-divider>
        </div>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('planForm')">确定</el-button>
            <el-button @click="resetForm('planForm')">重置</el-button>
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
        planEditFlag: false,
        planEditId: '',
        subHeader: '',
        planForm: {
          title: '',
          category_id: '',
          version: '',
          author: '',
          yfb_datetime: '',
          online_datetime: '',
          remark: ''
        },
        rules: {
          title: [
            { required: true, message: '请输入计划标题', trigger: 'blur' },
            { min: 3, max: 60, message: '长度在 3 到 60 个字符', trigger: 'blur' }
          ],
          category_id: [
            { required: true, message: '请选择所属项目', trigger: 'change' }
          ],
          version: [
            { required: true, message: '请输入发布版本', trigger: 'blur' },
            { min: 3, max: 60, message: '长度在 3 到 60 个字符', trigger: 'blur' }
          ],
          yfb_datetime: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          online_datetime: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          remark: [
            { required: true, message: '请填写转测详细内容', trigger: 'blur' }
          ]
        }
      };
    },
    mounted() {
      this.judgeCreateOrEdit();
    },
    methods: {
        initPlanFormEdit(id){
          this.$axios.get((this.$api.planManage + '/' + id)).then((response) => {
            this.planForm.title = response.data['res']['title']
            this.planForm.category_id = response.data['res']['category_id']
            this.planForm.version = response.data['res']['version']
            this.planForm.author = response.data['res']['author']
            // this.planForm.yfb_datetime = response.data['res']['yfb_datetime']
            // this.planForm.online_datetime = response.data['res']['online_datetime']
            this.planForm.remark = response.data['res']['remark']
          })
        },
        judgeCreateOrEdit(){
            if(this.$route.path.indexOf('edit') >= 0){
                this.planEditFlag = true
                this.subHeader = '编辑计划'
                // this.planEditId = this.$route.path.split('/')[3]
                this.planEditId = this.$route.params.id
                this.initPlanFormEdit(this.planEditId)
            }else{
                this.planEditFlag = false
                this.subHeader = '新建计划'
                this.planForm.author = localStorage.getItem("name")
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
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {
              "title": this.planForm.title,
              "category_id": this.planForm.category_id,
              "version": this.planForm.version,
              "author": this.planForm.author,
              "yfb_datetime": this.planForm.yfb_datetime,
              "online_datetime": this.planForm.online_datetime,
              "remark": this.planForm.remark,
            }
            if (this.planEditFlag === false){
              this.$axios.post(this.$api.planManage, data).then((response) => {
                if (this.messageShow(this, response)){
                  this.$router.push('/management/plans')
                  this.planList();
                }
              }).catch((error) => {
                this.errorMessageShow(this, error.response);
              })
            }else{
              this.$axios.put((this.$api.planManage + '/' + this.planEditId), data).then((response) => {
                if (this.messageShow(this, response)){
                  this.$router.push('/management/plans')
                  this.planList();
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
      }
    }
  }
</script>