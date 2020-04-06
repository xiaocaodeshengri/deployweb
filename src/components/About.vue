<template>
  <div class="about">
    <div class="page-header">
      <el-row :gutter="1">
        <el-col :span="2"><h1>关于</h1></el-col>
        <el-col v-show="getRole(9)" :span="2" style=padding-top:21px>
          <el-button @click.native="editAbout()" type="primary" icon="el-icon-edit" size="small" circle plain></el-button>
        </el-col>
      </el-row>
    </div>
    <div class="row">
        <div class="col-sm-8 mdui-typo">
        <ul>
            <li>管理员:</li>{{ manager }}
            <li>管理员邮箱:</li>{{ managerEmail }}
            <li v-if="deployFlag === 1">当前版本正在部署:</li>{{ deployVersion }}
        </ul>
        </div>
        <div class="col-sm-8 mdui-typo">
            <h3>预发布环境规范</h3>
              <ul>
                  <span v-html="aboutPage"></span>
              </ul>
        </div>
    </div>

      <el-drawer
      title="关于页面配置"
      :visible.sync="dialog"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
      size="80%">
          <div class="demo-drawer__content">
              <el-form :model="aboutForm" ref="aboutForm" label-width="100px">
                  <el-form-item label="标题" prop="blog_title" size="small">
                      <el-input v-model="aboutForm.blog_title" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="关于" prop="about" size="small">
                      <div>
                      <ckeditor :editor="editor" @ready="editorOnReady" v-model="aboutForm.about" :config="editorConfig">
                      </ckeditor>
                      <el-divider></el-divider>
                      </div>
                  </el-form-item>
              </el-form>
              <div class="demo-drawer__footer">
              <el-button type="primary" @click.native="editAboutBtn()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
              <el-button @click="dialog = false">取 消</el-button>
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
      dialog: false,
      loading: false,
      title: '',
      manager: '',
      managerEmail: '',
      deployFlag: '',
      deployVersion: '',
      aboutPage: '',
      aboutForm: {
          blog_title: '',
          about: ''
      },
    }
  },
  mounted() {
    this.initAbout()
    this.getFlagVersionInfo()
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
    getRole(num){
      this.role = localStorage.getItem("role")
      if(this.role >= num){
        return true
      }else{
        return false
      }
    },
    initAbout(){
      this.$axios.get(this.$api.aboutPage).then((response) => {
        this.title = response.data['res']['title']
        this.manager = response.data['res']['manager']
        this.managerEmail = response.data['res']['managerEmail']
        this.aboutPage = response.data['res']['aboutPage']
      })
    },
    getFlagVersionInfo(){
      this.$axios.get(this.$api.flagData).then((response) => {
        this.deployFlag = response.data['res']['DEPLOY']['flag']
        this.deployVersion = response.data['res']['DEPLOY']['version']
      })
    },
    editAbout(){
      this.$axios.get(this.$api.aboutPage).then((response) => {
        this.aboutForm.blog_title = response.data['res']['title']
        this.aboutForm.about = response.data['res']['aboutPage']
      })
      this.dialog = true
    },
    editAboutBtn(){
      this.$confirm('确定修改预发布环境规范吗？')
          .then(_ => {
          this.loading = true;
          let data = {
              "blog_title": this.aboutForm.blog_title,
              "about": this.aboutForm.about
          }
          this.$axios.put(this.$api.aboutPage, data).then(response => {
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
    }
  }
}
</script>