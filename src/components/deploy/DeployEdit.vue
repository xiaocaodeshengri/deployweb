<template>
<div>
    <el-page-header @back="goBack" v-bind:content="subHeader"></el-page-header>
    <el-divider></el-divider>
    <el-form :model="DeployForm" :rules="rules" ref="DeployForm" label-width="150px" class="demo-DeployForm" label-position="top">
        <el-form-item label="标题" prop="title" size="small" >
            <el-input v-model="DeployForm.title" class="commonwidth" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="发布版本" prop="version" size="small">
            <el-input v-model="DeployForm.version" class="commonwidth" :disabled="true"></el-input>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="4">
            <el-form-item label="项目" prop="category_id" size="small">
                <el-select v-model="DeployForm.category_id" placeholder="请选择项目" :disabled=true>
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
            <el-form-item label="责任人" prop="post_author" class="authorwidth" size="small">
                <el-input v-model="DeployForm.post_author" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="转测范围" prop="deploy_describe" class="deploytext" size="small">
            <el-input type="textarea" v-model="DeployForm.deploy_describe"></el-input>
        </el-form-item>
        <el-form-item label="部署环境" prop="environment_id" size="small">
            <el-select v-model="DeployForm.environment_id" placeholder="请选择部署环境">
                <el-option
                v-for="item in environments"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="部署包下载链接" prop="deploy_links" class="deploytext" size="small">
            <el-input type="textarea" v-model="DeployForm.deploy_links" placeholder="http://***.tar.gz;http://***.tar.gz"></el-input>
        </el-form-item>
        <el-form-item label="SQL文件" prop="deploy_sql" class="deploytext" size="small">
            <el-input type="textarea" v-model="DeployForm.deploy_sql"></el-input>
        </el-form-item>
        <el-form-item label="测试报告" prop="body" size="small">
          <div  class="deploytext">
          <ckeditor :editor="editor" @ready="editorOnReady" v-model="DeployForm.body" :config="editorConfig">
          </ckeditor>
          <el-divider></el-divider>
          </div>
        </el-form-item>
        <el-form-item>
          <el-upload
            class="upload-demo"
            :action="this.$api.uploadReport"
            :on-success="addFile"
            :on-remove="removeFile"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">支持多个文件，单个文件大小不超过10MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('DeployForm')">确定</el-button>
            <el-button @click="resetForm('DeployForm')">重置</el-button>
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
        deployEditFlag: false,
        deployEditId: '',
        planForDeployId: '',
        subHeader: '',
        fileList: [],
        DeployForm: {
          title: '',
          category_id: '',
          version: '',
          post_author: '',
          deploy_links: '',
          deploy_sql: '',
          deploy_describe: '',
          body: '',
          environment_id: null,
          fileNames: null
        },
        rules: {
          title: [
            { required: true, message: '请输入部署标题', trigger: 'blur' },
            { min: 3, max: 60, message: '长度在 3 到 60 个字符', trigger: 'blur' }
          ],
          category_id: [
            { required: true, message: '请选择所属项目', trigger: 'change' }
          ],
          version: [
            { required: true, message: '请输入发布版本', trigger: 'blur' },
            { min: 3, max: 60, message: '长度在 3 到 60 个字符', trigger: 'blur' }
          ],
          deploy_describe: [
            { required: true, message: '请填写转测范围', trigger: 'blur' }
          ],
          deploy_links: [
            { required: true, message: '请填写部署包下载链接', trigger: 'blur' }
          ],
          environment_id: [
            { required: true, message: '请选择部署环境', trigger: 'change' }
          ],
          body: [
            { required: true, message: '请将测试报告复制到此处', trigger: 'blur' },
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
      };
    },
    mounted() {
      this.judgeCreateOrEdit();
    },
    methods: {
      initDeployFormEdit(id){
          this.$axios.get((this.$api.deployManage + '/' + id)).then((response) => {
            this.DeployForm.title = response.data['res']['title']
            this.DeployForm.category_id = response.data['res']['category_id']
            this.DeployForm.version = response.data['res']['version']
            this.DeployForm.post_author = response.data['res']['post_author']
            this.DeployForm.environment_id = response.data['res']['environment_id']
            this.DeployForm.deploy_links = response.data['res']['deploy_links']
            this.DeployForm.deploy_sql = response.data['res']['deploy_sql']
            this.DeployForm.deploy_describe = response.data['res']['deploy_describe']
            this.DeployForm.body = response.data['res']['body']
            this.DeployForm.fileNames = response.data['res']['report_file_names']
            this.fileList = response.data['fileList']
          })
      },
      initDeployFormGoto(id){
          this.$axios.get((this.$api.planManage + '/' + id)).then((response) => {
            this.DeployForm.title = response.data['res']['title']
            this.DeployForm.category_id = response.data['res']['category_id']
            this.DeployForm.version = response.data['res']['version']
            this.DeployForm.post_author = response.data['res']['author']
          })
      },
      judgeCreateOrEdit(){
          if(this.$route.path.indexOf('edit') >= 0){
              this.deployEditFlag = true
              this.subHeader = '编辑部署'
              this.deployEditId = this.$route.path.split('/')[3]
              this.initDeployFormEdit(this.deployEditId)
          }else{
              this.planEditFlag = false
              this.subHeader = '转部署'
              this.planForDeployId = this.$route.path.split('/')[3]
              this.initDeployFormGoto(this.planForDeployId)
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
              "title": this.DeployForm.title,
              "category_id": this.DeployForm.category_id,
              "version": this.DeployForm.version,
              "post_author": this.DeployForm.post_author,
              "environment_id": this.DeployForm.environment_id,
              "deploy_links": this.DeployForm.deploy_links,
              "deploy_sql": this.DeployForm.deploy_sql,
              "deploy_describe": this.DeployForm.deploy_describe,
              "body": this.DeployForm.body,
              "report_file_names": this.DeployForm.fileNames
            }
            if (this.deployEditFlag === false){
              this.$axios.post((this.$api.planGotoDeploy.replace(/PLAN_ID/g, this.planForDeployId)), data).then((response) => {
                if (this.messageShow(this, response)){
                  this.$router.push('/management/deploys')
                  this.deployList();
                }
              }).catch((error) => {
                this.errorMessageShow(this, error.response);
              })
            }else{
              this.$axios.put((this.$api.deployManage + '/' + this.deployEditId), data).then((response) => {
                if (this.messageShow(this, response)){
                  this.$router.push('/management/deploys')
                  this.deployList();
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
      addFile(response, file, fileList) {
        if(response['code'] === 200){
          this.$notify({
              title: '成功',
              message: response['msg'],
              type: 'success',
          });
          if (this.DeployForm.fileNames === null){
              this.DeployForm.fileNames = file.name + ','
          }else{
              this.DeployForm.fileNames += (file.name + ',')
          }
          console.log(this.DeployForm.fileNames)
        }else{
          fileList.pop()
          this.fileList = fileList
          this.$notify({
              title: '警告',
              message: response['msg'],
              type: 'warning',
          });
        }
      },
      removeFile(file, fileList){
        let repStr = file.name + ','
        this.DeployForm.fileNames = this.DeployForm.fileNames.replace(repStr, '')
        console.log(this.DeployForm.fileNames)
        this.$axios.get((this.$api.removeReport + file.name)).then((response) =>{
          this.messageShow(this, response)
        })
      }
    }
  }
</script>