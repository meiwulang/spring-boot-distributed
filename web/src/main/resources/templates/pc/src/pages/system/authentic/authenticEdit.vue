<template>
  <div class="jdy-content fleft jl-information lv-order-detail">
    <div class="jdy-content-inner">
      <!--jdy-tab begin-->
      <div class="jdy-tab">
        <el-button type="default" class="fright mt10 mr10 el-button--primary" :disabled="btnFlag" @click="posEvent('')" >保存</el-button>
        <el-button type="default" class="fright mt10 mr10" @click="goback('sellerOrderAll')" >返回</el-button>
        
      </div>
      <!--jdy-tab end-->

      <!--table begin-->
      <!--table begin-->
      <div class="jdy-table-wrap pt20 pb20">
          <table width="100%" cellpadding="0" cellspacing="0" class="table-custom">
            <tr>
              <th>真实姓名</th>
              <td>{{ tableData.realName }}</td>
            </tr>
            <tr>
              <th>员工编号</th>
              <td>{{ tableData.userNo }}</td>
              
            </tr>
            <tr>
              <th>单位名称</th>
              <td>{{ tableData.unitName }}</td>
              
            </tr>
            <tr>
              <th>部门名称</th>
              <td>{{ tableData.departmentName }}</td>
              
            </tr>
            <tr>
              <th>职务</th>
              <td>{{ tableData.dutyName }}</td>
             
            </tr>
            <tr>
              <th>权限等级</th>
              <td>
                  <el-select class="sele" v-model="region" placeholder="请选择">
                    <el-option v-if="uDataLimit >= 0" key="0" label="用户级" value="0"></el-option>
                    <el-option v-if="uDataLimit >= 1" key="1" label="部门级" value="1"></el-option>
                    <el-option v-if="uDataLimit >= 2" key="2" label="单位级" value="2"></el-option>
                    <el-option v-if="uDataLimit >= 3" key="3" label="系统级" value="3"></el-option>
                  </el-select>
              </td>
            </tr>
            <tr>
              <th>角色权限</th>
              <td colspan="5">
                 <el-select class="sele" v-model="role" placeholder="请选择">
                 <el-option v-if="num == 0" :key="roledata.id" :label="roledata.name" :value="roledata.id"></el-option>
                  <el-option v-for="item in liData" :key="item.id" :label="item.roleName" :value="item.id">
                    </el-option>
                </el-select>
              </td>
            </tr>
          </table>
      </div>
      <!--table end-->
    </div>
  </div>
  <!--jdy-content end-->
</template>

<script>
  import ApiSystem from '@/pages/system/api/index';
  import api_prefix from '@/assets/js/apiUrl';
  export default {
    name: 'orderDetail',
    data() {
      return {
        tableData:[],
        region: '',
        uDataLimit: '',
        role:'',
        num:'',
        roledata: {
          id: '',
          name: ''
        },
        liData:[],
        btnFlag:false,
      }
    },
    mounted(){
      this.loginDatas();
      this.getTableData();
    },
    filters:{
      
    },
    methods: {
      goback(url) {
        window.history.go(-1);
        //this.$router.push({name:url});
      },
      //获取登录信息
      loginDatas(){
        let logindata = JSON.parse(sessionStorage.getItem('loginData'));
        this.uDataLimit =  logindata.uDataLimit;
      },
      //获取列表数据
      getTableData(){
        const vm = this;
        let url = api_prefix.api_prefix + '/userRolePrivilege/queryUserRolePrivilegeByUserId' + '?userId=' + this.$route.query.id + '&type=1'
        this.$http.get(url).then(response => {
          vm.getRoleList();
          if(response.data.code == '200'){
            let data = response.data.data;
            vm.tableData = data;
            if(data != null && data.privilegeLevel != null){
              vm.region = data.privilegeLevel.toString();
            }
            if(data != null){
              vm.roledata.name = data.rolePrivilegeList[0].roleName;
              vm.roledata.id = data.rolePrivilegeList[0].roleId;
              vm.role = data.rolePrivilegeList[0].roleId;
              vm.com = response.data.data.companyId;
              // if(vm.com != 0 && vm.uDataLimit == 3){
              //   vm.uDataLimit = 2;
              // }
            }else{
              vm.num = '1';
              return false;
            }
            
          }else{
            vm.$alert(response.data.message)
          }
        })
      },
      //获取权限等级
      getRoleList(){
        ApiSystem.queryRoleList().then((response) => {
          if(response.data.code == '200'){
            var data = response.data.data;
            this.liData = data;
            
            if(data != null){
              for(var i in data){
                if(data[i].id == this.role || !this.role){
                  this.num = '1';
                  return false;
                }else{
                  this.num = '0';
                }
              }
            }else{
              this.num = '1';
              return false;
            }
          }
        })
      },
      //提交保存
      posEvent(){
        if(!(this.role)){
          this.$message.error("请选择角色权限！");
          return false;
        }        
        this.btnFlag=true;
        let seData = {
          userId : this.tableData.userId,
          privilegeLevel : this.region,
          roleIdList : [this.role]
        };
        ApiSystem.addUser(seData).then((response) => {
          if(response.data.code == '0'){
            this.$alert(response.data.message);
            if(response.data.message == '修改成功！'){
              this.goback();
              this.btnFlag=false;
            }
          }
        })
      }

    },
  }


</script>
<style scoped>
  .jdy-content{
    height: 90%;
  }
  .table-custom th{
    width: 15%;
  }
  .table-custom tr td{
    width: 85%;
  }
  .table-custom tr td .sele{
    width: 350px;
    height: 30px;
  }
  .jdy-title{
    padding: 20px 0 15px;
  }
  .dialog-tourist{
    width: 1000px;
  }
  .dialog-tourist .dialog-title-custom{
    width: auto;
    max-width:850px ;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .dialog-price-detail{
    width: 900px;
  }


</style>



