<template>
    <div>
        <el-row :gutter="10">
          <el-col :span="3"><h2>设备信息</h2></el-col>
          <el-col :span="3" :offset="12">
            <el-select v-model="category" filterable placeholder="根据项目筛选" size="small" v-on:change="filterByCategory"
            style="padding-top:19px">
              <el-option
                v-for="item in categorys"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>          
          </el-col>
          <el-col :span="3">
            <el-select v-model="rackId" filterable placeholder="根据机柜筛选" size="small" v-on:change="filterByRack"
            style="padding-top:19px">
              <el-option
                v-for="item in racks"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="1" style="padding-top:19px">
                <el-button type="primary" icon="el-icon-refresh" size="mini" plain
                            @click.native="refreshList">
                </el-button>
          </el-col>
          <el-col :span="1" style=padding-top:18px>
            <el-button @click.native="addBtn()" type="primary" icon="el-icon-plus" size="small" circle plain></el-button>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-table
            :data="tableDeviceData"
            stripe
            style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="用户名">
                            <span>{{ props.row.username }}</span>
                        </el-form-item>
                        <el-form-item label="密码">
                            <span>{{ props.row.password }}</span>
                        </el-form-item>
                        <el-form-item label="HDM">
                            <span>{{ props.row.hdm_ip }}</span>
                        </el-form-item>
                        <el-form-item label="序列号">
                            <span>{{ props.row.sn }}</span>
                        </el-form-item>
                        <el-form-item label="资产名称">
                            <span>{{ props.row.property_name }}</span>
                        </el-form-item>
                        <el-form-item label="硬件配置">
                            <span>{{ props.row.hw }}</span>
                        </el-form-item>
                        <el-form-item label="用途">
                            <span>{{ props.row.usage }}</span>
                        </el-form-item>
                        <el-form-item label="备注">
                            <span>{{ props.row.remark }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
            type="index"
            label="No."
            width="50">
            </el-table-column>
            <el-table-column
            prop="name"
            label="名称">
            </el-table-column>
            <el-table-column
            prop="category"
            label="项目组">
            </el-table-column>
            <el-table-column
            prop="rack"
            label="所在机柜">
            </el-table-column>
            <el-table-column
            prop="u_location"
            label="位置">
            </el-table-column>
            <el-table-column
            prop="mgt_ip"
            label="管理IP">
            </el-table-column>
            <el-table-column
            prop="device_type"
            label="设备类型">
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" circle plain
                                @click.native="editDevice(tableDeviceData[scope.$index]['id'])">
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" circle plain
                                @click.native="sureView(deleteDevice,tableDeviceData[scope.$index]['id'],tableDeviceData[scope.$index]['name'])">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-row type="flex" justify="end">
          <el-col :span="12" style=padding-top:24px>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </el-col>
        </el-row>
        
        <el-dialog title="设备配置" :visible.sync="dialogFormVisible" width="50%">
          <el-form :model="deviceForm" :rules="rules" ref="deviceForm" label-width="150px" class="demo-deviceForm"  label-position="top">
              <el-form-item label="名称" prop="name" size="small">
                  <el-input v-model="deviceForm.name" class="commonwidth"></el-input>
              </el-form-item>
              <el-row :gutter="10">
                  <el-col :span="6">
                    <el-form-item label="项目组" prop="category" size="small">
                      <el-autocomplete
                      class="inline-input"
                      v-model="deviceForm.category"
                      :fetch-suggestions="querySearch"
                      placeholder="请输入所属项目组"
                      :trigger-on-focus="true"
                      >
                      </el-autocomplete>
                      <!-- <el-input v-model="deviceForm.category"></el-input> -->
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="所在机柜" prop="rack_id" size="small">
                        <el-select v-model="deviceForm.rack_id" placeholder="请选择机柜">
                        <el-option
                            v-for="item in racks"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                        </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="设备类型" prop="device_type" size="small">
                        <el-select v-model="deviceForm.device_type" placeholder="请选择设备类型">
                        <el-option
                            v-for="item in deviceTypes"
                            :key="item.key"
                            :label="item.value"
                            :value="item.value">
                        </el-option>
                        </el-select>
                    </el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="10">
                  <el-col :span="6">
                    <el-form-item label="管理IP" prop="mgt_ip" size="small">
                        <el-input v-model="deviceForm.mgt_ip"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="HDM" prop="hdm_ip" size="small">
                        <el-input v-model="deviceForm.hdm_ip"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="所在位置" prop="u_location" size="small">
                        <el-input v-model="deviceForm.u_location"></el-input>
                    </el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="10">
                  <el-col :span="9">
                    <el-form-item label="管理用户名" prop="username" size="small">
                        <el-input v-model="deviceForm.username" placeholder="root"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label="后台密码" prop="password" size="small">
                        <el-input v-model="deviceForm.password"></el-input>
                    </el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="10">
                  <el-col :span="9">
                    <el-form-item label="资产名称" prop="property_name" size="small">
                        <el-input v-model="deviceForm.property_name"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label="序列号" prop="sn" size="small">
                        <el-input v-model="deviceForm.sn"></el-input>
                    </el-form-item>
                  </el-col>
              </el-row>
              <el-form-item label="硬件配置" prop="hw" size="small">
                  <el-input type="textarea" v-model="deviceForm.hw"></el-input>
              </el-form-item>
              <el-form-item label="用途" prop="usage" size="small">
                  <el-input type="textarea" v-model="deviceForm.usage"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="remark" size="small">
                  <el-input type="textarea" v-model="deviceForm.remark"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelBtn()">取 消</el-button>
              <el-button v-if="editDeviceFlag === true" type="primary" @click="editDeviceBtn(deviceForm['id'])">确 定</el-button>
              <el-button v-else type="primary" @click="addDeviceBtn()">新 建</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    props: ['categorys'],
    data() {
      return {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        editDeviceFlag: false,
        dialogFormVisible: false,
        category: '',
        rackId: '',
        racks: [],
        deviceTypes: [
            {'key': '服务器', 'value': '服务器'},
            {'key': '交换机', 'value': '网络设备-交换机'},
            {'key': '负载均衡', 'value': '网络设备-负载均衡'},
            {'key': '防火墙', 'value': '网络设备-防火墙'},
        ],
        deviceForm: {
          id: '',
          name: '',
          category: '',
          rack_id: '',
          u_location: '',
          sn: '',
          device_type: '',
          property_name: '',
          hw: '',
          hdm_ip: '',
          mgt_ip: '',
          usage: '',
          remark: '',
          extra: '',
          username: '',
          password: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入设备名称', trigger: 'blur' },
            { min: 1, max: 60, message: '长度在 1 到 60 个字符', trigger: 'blur' }
          ],
          category: [
            { required: true, message: '请输入所属项目组', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
          ],
          rack_id: [
            { required: true, message: '请选择所在机柜', trigger: 'blur' }
          ],
          device_type: [
            { required: true, message: '请选择设备类型', trigger: 'blur' }
          ],
          mgt_ip: [
            { required: true, message: '请输入设备管理IP', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
        },
        tableDeviceData: []
      }
    },
    mounted() {
      this.deviceList(this.category, this.rackId);
      this.rackList();
    },
    methods: {
      getRole(num){
        this.role = localStorage.getItem("role")
        if(this.role >= num){
          return true
        }else{
          return false
        }
      },
      rackList(){
        this.$axios.get(this.$api.rackList, 
        {
          params: {page: 1, size: 100}
        }).then((response) => {
            this.racks = response.data['res']
        })
      },
      deviceList(category, rackId){
        this.$axios.get(this.$api.deviceList, 
        {
          params: {page: this.currentPage, size: this.pageSize, category: category, rack_id: rackId}
        }).then((response) => {
            this.tableDeviceData = response.data['res']
            this.total = response.data['total']
        })
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.deviceList(this.category, this.rackId)
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.deviceList(this.category, this.rackId)
      },
      filterByCategory(){
          this.deviceList(this.category, this.rackId)
      },
      filterByRack(){
          this.deviceList(this.category, this.rackId)
      },
      refreshList(){
          this.currentPage = 1;
          this.rackId = null;
          this.category = null;
          this.deviceList(this.category, this.rackId);
      },
      initDeviceForm(){
        this.deviceForm.name = null,
        this.deviceForm.category = localStorage.getItem('category'),
        this.deviceForm.rack_id = null,
        this.deviceForm.u_location = null,
        this.deviceForm.sn = null,
        this.deviceForm.device_type = null,
        this.deviceForm.property_name = null,
        this.deviceForm.hw = null,
        this.deviceForm.hdm_ip = null,
        this.deviceForm.mgt_ip = null,
        this.deviceForm.usage = null,
        this.deviceForm.remark = null,
        this.deviceForm.username = 'root',
        this.deviceForm.password = null
      },
      addBtn(){
        this.initDeviceForm()
        this.editDeviceFlag = false
        this.dialogFormVisible = true
      },
      editDevice(id){
        this.editDeviceFlag = true
        this.$axios.get((this.$api.deviceManage + '/' + id)).then((response) => {
            this.deviceForm.id = id
            this.deviceForm.name = response.data['res']['name']
            this.deviceForm.category = response.data['res']['category']
            this.deviceForm.rack_id = response.data['res']['rack_id']
            this.deviceForm.u_location = response.data['res']['u_location']
            this.deviceForm.sn = response.data['res']['sn']
            this.deviceForm.device_type = response.data['res']['device_type']
            this.deviceForm.property_name = response.data['res']['property_name']
            this.deviceForm.hw = response.data['res']['hw']
            this.deviceForm.hdm_ip = response.data['res']['hdm_ip']
            this.deviceForm.mgt_ip = response.data['res']['mgt_ip']
            this.deviceForm.usage = response.data['res']['usage']
            this.deviceForm.remark = response.data['res']['remark']
            this.deviceForm.username = response.data['res']['username']
            this.deviceForm.password = response.data['res']['password']
        })
        this.dialogFormVisible = true
      },
      deleteDevice(id){
        this.$axios.delete((this.$api.deviceManage + '/' + id)).then((response) => {
          if (this.messageShow(this, response)){
            this.deviceList(this.category, this.rackId);
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      addDeviceBtn(){
        let data = {
          "name": this.deviceForm.name,
          "category": this.deviceForm.category,
          "rack_id": this.deviceForm.rack_id,
          "u_location": this.deviceForm.u_location,
          "sn": this.deviceForm.sn,
          "device_type": this.deviceForm.device_type,
          "property_name": this.deviceForm.property_name,
          "hw": this.deviceForm.hw,
          "hdm_ip": this.deviceForm.hdm_ip,
          "mgt_ip": this.deviceForm.mgt_ip,
          "usage": this.deviceForm.usage,
          "remark": this.deviceForm.remark,
          "username": this.deviceForm.username,
          "password": this.deviceForm.password
        }
        this.$axios.post(this.$api.deviceManage, data).then((response) => {
          if (this.messageShow(this, response)){
            this.dialogFormVisible = false;
            this.deviceList(this.category, this.rackId);
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      editDeviceBtn(id){
        let data = {
          "name": this.deviceForm.name,
          "category": this.deviceForm.category,
          "rack_id": this.deviceForm.rack_id,
          "u_location": this.deviceForm.u_location,
          "sn": this.deviceForm.sn,
          "device_type": this.deviceForm.device_type,
          "property_name": this.deviceForm.property_name,
          "hw": this.deviceForm.hw,
          "hdm_ip": this.deviceForm.hdm_ip,
          "mgt_ip": this.deviceForm.mgt_ip,
          "usage": this.deviceForm.usage,
          "remark": this.deviceForm.remark,
          "username": this.deviceForm.username,
          "password": this.deviceForm.password
        }
        this.$axios.put((this.$api.deviceManage + '/' + id), data).then((response) => {
          if (this.messageShow(this, response)){
            this.dialogFormVisible = false;
            this.editDeviceFlag = false;
            this.deviceList(this.category, this.rackId);
          }
        }).catch((error) => {
          this.errorMessageShow(this, error.response);
        })
      },
      cancelBtn(){
        this.dialogFormVisible = false;
        this.initDeviceForm();
        this.editDeviceFlag = false;
      },
      querySearch(queryString, cb) {
        var categorys = this.categorys;
        var results = queryString ? categorys.filter(this.createFilter(queryString)) : categorys;
        cb(results);
      },
      createFilter(queryString) {
        return (category) => {
          return (category.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      }
    }
  }
</script>