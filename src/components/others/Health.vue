<template>
    <div>
        <el-row :gutter="10">
          <el-col :span="3"><h2>环境健康</h2></el-col>
        </el-row>
        <el-divider></el-divider>
        <el-table
            v-loading="loading"
            :data="tableData"
            stripe
            :span-method="objectSpanMethod"
            style="width: 100%">
            <el-table-column
            type="index"
            label="No."
            width="50">
            </el-table-column>
            <el-table-column
            prop="environment"
            label="环境">
            </el-table-column>
            <el-table-column
            prop="pod"
            label="POD">
            </el-table-column>
            <el-table-column
            prop="status"
            label="状态">
            </el-table-column>
            <el-table-column
            prop="category"
            label="责任组">
            </el-table-column>
        </el-table>

    </div>
</template>

<script>
  export default {
    data() {
      return {
        loading: true,
        rowList: [],
        spanArr: [],
        position: 0,
        tableData: []
      }
    },
    mounted() {
      this.HealthData();
    },
    methods: {
        HealthData(){
            this.$axios.get(this.$api.health, ).then((response) => {
                this.tableData = response.data['res']
                this.rowspan()
                this.loading = false
            })
        },
        rowspan() {
            this.tableData.forEach((item,index) => {
                if( index === 0){
                    this.spanArr.push(1);
                    this.position = 0;
                }else{
                    if(this.tableData[index].environment === this.tableData[index-1].environment ){
                        this.spanArr[this.position] += 1;
                        this.spanArr.push(0);
                    }else{
                        this.spanArr.push(1);
                        this.position = index;
                    }
                }
            })
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {  //表格合并行
            if (columnIndex === 0) {
                const _row = this.spanArr[rowIndex];
                const _col = _row>0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                }
            }
            if(columnIndex === 1){
                const _row = this.spanArr[rowIndex];
                const _col = _row>0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                }
            }
        }
    }
  }
</script>