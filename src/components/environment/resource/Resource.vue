<template>
    <div>
        <el-row :gutter="10">
            <el-col :span="3"><h2>资源管理</h2></el-col>
        </el-row>
        <el-tabs v-model="activeTab" @tab-click="tabChange">
            <el-tab-pane label="资源监控" name="first">
                <el-button style="float: right; padding: 3px 0 0 0" type="text"
                @click.native="dialogFormVisible = true">添加监控项
                </el-button>
                <el-button style="float: right; padding: 3px 20px 0 0" type="text"
                @click.native="refresh()">刷新
                </el-button>
                 <el-table
                :data="resourceData"
                style="width: 100%"
                :show-header="false">
                <el-table-column
                prop="date"
                label="资源信息"
                min-width="300">
                    <template slot-scope="scope">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>{{ scope.row.data.casName }}</span>
                                <el-button style="float: right; padding: 3px 0; color: red" type="text"
                                @click.native="sureView(delResource,scope.row.data.id,scope.row.data.casName)">删除
                                </el-button>
                                <el-button style="float: right; padding: 3px 15px 0 0" type="text"
                                @click.native="clearResource(scope.row.data.id)">一键清理</el-button>
                            </div>
                            <div>
                                <el-row :gutter="10">
                                    <el-col :span="3">
                                        CPU分配比
                                    </el-col>
                                    <el-col :span="10">
                                        <el-progress :stroke-width="12" :percentage="scope.row.data.cpu"
                                        :color="checkStatus(scope.row.data.cpu)"></el-progress>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="10">
                                    <el-col :span="3">
                                        内存分配比
                                    </el-col>
                                    <el-col :span="10">
                                        <el-progress :stroke-width="12" :percentage="scope.row.data.memery"
                                        :color="checkStatus(scope.row.data.memery)"></el-progress>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="10">
                                    <el-col :span="3">
                                        共享存储分配比
                                    </el-col>
                                    <el-col :span="10">
                                        <el-progress :stroke-width="12" :percentage="scope.row.data.storage"
                                        :color="checkStatus(scope.row.data.storage)"></el-progress>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-card>
                    </template>
                </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="资源白名单" name="second">
                <whiteList>
                </whiteList>
            </el-tab-pane>
            <el-tab-pane label="设置" name="third">
                <limitSetting>
                </limitSetting>
            </el-tab-pane>            
        </el-tabs>

        <el-dialog title="资源监控" :visible.sync="dialogFormVisible">
          <el-form :model="resourceForm" :rules="rules" ref="resourceForm" label-width="150px" class="resourceForm">
              <el-form-item label="监控项" prop="linkId" size="small">
                  <el-select v-model="resourceForm.linkId" placeholder="请选择CAS">
                    <el-option
                      v-for="item in casList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="关联UCA" prop="relatedUCA" size="small">
                  <el-select v-model="resourceForm.relatedUCA" placeholder="请选择相关UCA">
                    <el-option
                      v-for="item in ucaList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelBtn()">取 消</el-button>
              <el-button type="primary" @click="addBtn()">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import whiteList from './WhiteList.vue'
    import limitSetting from './LimitSetting.vue'

  export default {
      components: {
          whiteList: whiteList,
          limitSetting: limitSetting
      },

    data() {
      return {
        activeTab: 'first',
        dialogFormVisible: false,
        casList: [{
            id: 1,
            name: "cas1"
        },{
            id: 2,
            name: "cas2"
        }],
        ucaList: [{
            id: 1,
            name: "uca1"
        },{
            id: 2,
            name: "uca2"
        }],
        resourceData: [{
            "data": {"id": 1, "casName": "预发布天津CAS", "cpu": 68, "memery": 118, "storage": 20},
        }],
        resourceForm: {
            linkId: null,
            relatedUCA: null
        },
        rules: {
          linkId: [
            { required: true, message: '请选择需要监控的CAS', trigger: 'blur' }
          ],
          relatedUCA: [
            { required: true, message: '请选择与CAS关联的UCA', trigger: 'blur' }
          ]
        }
      };
    },
    mounted() {
        this.resourceDateList();
    },
    methods: {
      tabChange(tab) {
        console.log(tab.label);
      },
      checkStatus(n) {
          if (n <= 60) {
              return "#00CC66"
          }else if (n <=90) {
              return "#CCCC33"
          }else {
              return "#FF3333"
          }
      },
      resourceDateList(){
          this.resourceData = [{
            "data": {"id": 1, "casName": "预发布天津CAS", "cpu": 68, "memery": 118, "storage": 20},
        }]
      },
      addBtn(){
          this.dialogFormVisible = false
      },
      cancelBtn(){
          this.resourceForm.linkId = null;
          this.resourceForm.relatedUCA = null;
          this.dialogFormVisible = false
      },
      refresh(){
          
      },
      delResource(id){
          console.log(id)
      },
      clearResource(id){
          console.log(id)
      }
    }
  };
</script>