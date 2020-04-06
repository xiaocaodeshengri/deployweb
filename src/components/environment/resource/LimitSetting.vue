<template>
    <div>
        <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>限定值设置</span>
            <el-button style="float: right; padding: 3px 0" type="text"
            @click.native="updateSetting()">更新设定</el-button>
            <el-button style="float: right; padding: 3px 10px 0 0" type="text"
            @click.native="reset()">刷新</el-button>
        </div>
            <div>
                <el-row :gutter="10">
                    <el-col :span="3" style="padding: 10px 0 0 0">
                        CPU分配比
                    </el-col>
                    <el-col :span="10">
                        <el-slider max=200
                        v-model="cpuLimit"
                        show-input>
                        </el-slider>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="3" style="padding: 10px 0 0 0">
                        内存分配比
                    </el-col>
                    <el-col :span="10">
                        <el-slider max=200
                        v-model="memLimit"
                        show-input>
                        </el-slider>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="3" style="padding: 10px 0 0 0">
                        共享存储分配比
                    </el-col>
                    <el-col :span="10">
                        <el-slider max=100
                        v-model="storageLimit"
                        show-input>
                        </el-slider>
                    </el-col>
                </el-row>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "limitSetting",
        data() {
            return {
                cpuLimit: 60,
                memLimit: 86,
                storageLimit: 90
            }
        },
        mounted() {
            this.reset();
        },
        methods: {
            updateSetting(){

            },
            reset(){

            },
        }
    }
</script>

<style>
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>