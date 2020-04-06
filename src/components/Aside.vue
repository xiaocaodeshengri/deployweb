<template>
    <el-row class="tac">
        <el-col :span="18">
            <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            :router="true"
            @open="handleOpen"
            @close="handleClose">
                <el-submenu index="1">
                    <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>管理</span>
                    </template>
                    <el-menu-item index="/management/plans">计划</el-menu-item>
                    <el-menu-item index="/management/deploys">部署</el-menu-item>
                    <el-menu-item index="/management/projects">项目</el-menu-item>
                    <el-menu-item index="/management/rcConfigs">RC配置</el-menu-item>
                    <el-menu-item index="/management/logs">操作日志</el-menu-item>
                    <el-menu-item index="/management/products">产品开通信息</el-menu-item>
                </el-submenu>
                <el-submenu index="2">
                    <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>设置</span>
                    </template>
                    <el-menu-item index="/setting/cicds">CICD配置</el-menu-item>
                    <el-menu-item index="/setting/tasks">定时任务</el-menu-item>
                    <el-menu-item v-show="getRole(9)" index="/setting/users">用户管理</el-menu-item>
                </el-submenu>
                <el-submenu index="3">
                    <template slot="title">
                    <i class="el-icon-s-platform"></i>
                    <span>环境</span>
                    </template>
                    <el-menu-item index="/env/links">环境链接</el-menu-item>
                    <el-menu-item index="/env/environments">测试环境</el-menu-item>
                    <el-menu-item index="/env/racks">机柜信息</el-menu-item>
                    <el-menu-item index="/env/devices">设备信息</el-menu-item>
                    <el-menu-item index="/env/topos">组网拓扑</el-menu-item>
                    <el-menu-item index="/env/images">镜像信息</el-menu-item>
                    <el-menu-item index="/env/imagesHistory">镜像历史</el-menu-item>
                    <el-menu-item index="/env/health">环境健康</el-menu-item>
                    <el-menu-item index="/env/resource">资源管理</el-menu-item>
                </el-submenu>
                <el-submenu index="4">
                    <template slot="title">
                    <i class="el-icon-document"></i>
                    <span>Q&R</span>
                    </template>
                    <el-menu-item index="/q_r/questions">问题</el-menu-item>
                    <el-menu-item index="/q_r/requires">需求</el-menu-item>
                </el-submenu>
                <el-submenu index="5">
                    <template slot="title">
                    <i class="el-icon-setting"></i>
                    <span>测试</span>
                    </template>
                    <el-menu-item index="/test/tasks">测试任务</el-menu-item>
                </el-submenu>
            </el-menu>
        </el-col>
    </el-row>
</template>

<script>
  // import * as types from '@/store/types'
  export default {
    data(){
      return {
        role: Number
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      getRole(num){
        this.role = localStorage.getItem("role")
        if(this.role >= num){
          return true
        }else{
          return false
        }
      }
    }
  }
</script>