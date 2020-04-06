<template>
    <div>
        <el-page-header @back="goBack" :content="task.title"></el-page-header>
        <el-divider></el-divider>
        <div class="row">
            <div class="mdui-typo">
                <ul>
                <li>项目:</li>{{ task.category }}
                <li>Host:</li> {{ task.host }}
                <li>Command:</li>{{ task.command }}
                <li>Report Path:</li>{{ task.report_path }}
                <li>Emails:</li>{{ task.email }}
                <li>Cron:</li>{{ task.cron }}
                <li>状态:</li>
                    <p v-if="task.status === 0">STOPPED</p>
                    <p v-else>RUNNING</p>
                </ul>
                <el-divider content-position="left"><strong>任务描述</strong></el-divider>
                <span v-html="task.remark"></span>
            </div>
        </div>
        <el-divider content-position="left"><strong>测试报告</strong></el-divider>
        <el-table
            :data="reports"
            stripe
            style="width: 100%">
            <el-table-column
            type="index"
            label="No."
            width="50">
            </el-table-column>
            <el-table-column
            prop="reportId"
            label="测试报告链接">
                <template slot-scope="scope">
                <a :href="'/api/testTaskReport/' + scope.row.reportId" target="_blank">{{ scope.row.reportId }}</a>
                </template>
            </el-table-column>
            <el-table-column
            prop="timestamp"
            label="时间">
            </el-table-column>
            <el-table-column label="操作" width="360">
                <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" size="mini" circle plain
                                @click.native="sureView(deleteReport,reports[scope.$index]['reportId'],reports[scope.$index]['reportId'])">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    inject: ['reload'],
    data(){
        return{
            task: {
                id: '',
                title: '',
                category_id: '',
                host: '',
                username: '',
                password: '',
                command: '',
                report_path: '',
                email: '',
                cron: '',
                remark: ''
            },
            reports: []
        }
    },
    mounted() {
        this.initTaskDetial()
    },
    methods: {
        initTaskDetial(){
            let id = this.$route.params.id
            this.$axios.get((this.$api.testTaskManage + '/' + id)).then((response) => {
                this.task.title = response.data['res']['title']
                this.task.category_id = response.data['res']['category_id']
                this.task.host = response.data['res']['host']
                this.task.username = response.data['res']['username']
                this.task.password = response.data['res']['password']
                this.task.command = response.data['res']['command']
                this.task.report_path = response.data['res']['report_path']
                this.task.email = response.data['res']['email']
                this.task.cron = response.data['res']['cron']
                this.task.remark = response.data['res']['remark']
                this.reports = response.data['reports']
            })
        },
        goBack(){
            this.$router.go(-1);
        },
        deleteReport(id){
            this.$axios.delete((this.$api.testTaskReport + id)).then((response) => {
                if (this.messageShow(this, response)){
                    this.reload();
                }
                }).catch((error) => {
                    this.errorMessageShow(this, error.response);
                })
        }
    }
}
</script>