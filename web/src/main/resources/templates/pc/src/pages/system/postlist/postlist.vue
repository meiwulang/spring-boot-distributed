<template>
  <div class="jdy-content fleft">
    <div class="jdy-content-inner">
      <div class="jdy-tab">
        <el-form :model="ruleSearchForm" :inline="true" ref="ruleSearchForm" class="ml10">
          <el-row class="search-row pt10">
            <el-form-item prop="quickSearch" class="creditBillSearch">
              <el-input placeholder="搜索岗位名称" v-model.trim="ruleform.searchParam" class="search-input-l" style="width:220px">
              </el-input>
            </el-form-item>
            <el-form-item class="pl10" v-show="logindata.uDataLimit==3" >
                <el-select style="width:280px" v-model="ruleform.companyId" placeholder="请选择分公司" filterable remote clearable :remote-method="remote_oBuyerCompanyId">
                    <el-option v-for="item in companyIdArr" :key="item.id" :label="item.cName" :value="item.id"></el-option>
                </el-select>                         
            </el-form-item>            
            <el-button type="primary" class="ml10 btnInTab" @click="getTableData">搜索</el-button>
          </el-row>
        </el-form>
      </div>
      <div class="jdy-table pt20">
        <el-table class="all yjk-orderList" :data="tableData" border highlight-current-row @current-change="handleRowChange">
          <el-table-column label="序号" type="index" width="100">
          </el-table-column>
          <el-table-column label="岗位名称"  min-width="200">
            <template scope="scope">
             {{ scope.row.positionName }}
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="" width="120">
            <template scope="scope">
              <el-button type="default" size="mini" @click.native.prevent="editRole(scope.row.positionName,scope.row.roleIds,scope.row.dataLimit)">
                编辑角色
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页   begin-->
        <div class="clearfix">
          <el-pagination class="fright mt20" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSizeAll" layout="prev, pager, next, jumper" :total="tableDataTotal">
          </el-pagination>
        </div>
        <!-- 分页   end-->

        <!--修改角色 弹窗  begin-->
        <jdy-alert title="绑定角色" @closeAlert="closeAlert" v-if="roleFlag" class="alertCityList showtfcity bindrole">
          <el-form class="roleForm bindrole" :model="roleForm">
            <el-row style="padding-bottom:10px">
              <el-col :span="24">
                <el-form-item prop="signDate">
                  <el-select v-model="roleListCheckList" class="all" :filterable="true" clearable remote @change="changeRole">
                    <el-option :key="roleItem.id" :label="roleItem.rRoleName" v-for="roleItem in roleList" :value="roleItem.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-select v-model="dataLimit" class="all">
                  <el-option  :key="0" label="用户级" :value="0"></el-option>
                  <el-option  :key="1" label="部门级" :value="1"></el-option>
                  <el-option  :key="2" label="单位级" :value="2"></el-option>
                  <el-option  :key="3" label="系统级" :value="3"></el-option>
                </el-select>
              </el-col>
            </el-row>            
          </el-form>
          <div class="alertfoot1 clearfix">
            <el-button class="fright mt10 mr10" @click="saveRole" type="primary" :disabled="btnFlag">提交</el-button>
            <el-button class="fright mt10 mr10" @click="closeAlert">取消</el-button>
          </div>
        </jdy-alert>
        <!--修改角色 弹窗  end-->
      </div>

    </div>
  </div>
  <!--jdy-content end-->
</template>

<script>
  import API from './../api/index';
  import api_prefix from '@/assets/js/apiUrl';
  import jdyAlert from '@/components/Alert';

  export default {
    name: 'roleManager',
    data() {
      return {
        btnFlag:false,
        currentPage:1,
        pageSizeAll:20,
        tableDataTotal:0,
        ruleSearchForm:{},
        ruleform:{
          pageIndex:1,
          searchParam:'',
          companyId:null
        },
        tableData:[],
        publicId:'',
        accesstoken:'',
        time:'',
        rCompanyId:null,
        companyName:null,
        //角色弹窗
        roleFlag:false,
        roleForm:{
          roleId:'',
        },
        postName:null,
        // 
        roleList:[],
        roleListCheckList:null,
        // 用户权限
        dataLimit:0,
        companyIdArr:[],
        // 登录
        logindata:null
      }
    },
    created(){

    },
    components: {
      jdyAlert
    },    
    mounted() {
      this.logindata=JSON.parse(sessionStorage.loginData)
      this.publicId = this.logindata.appId;
      this.rCompanyId=this.logindata.uCompanyId;
      this.companyName=this.logindata.cName;
      this.getTableData();
      this.searchRoles("");
      this.logindata.uDataLimit == 3 && this.remote_oBuyerCompanyId();      
    },
    methods: {
      handleCurrentChange(val){
        this.currentPage = val;
        this.ruleform.pageIndex=val
        this.getTableData();
      },
      handleRowChange(){

      },
      getTableData(){
        this.$http.post(api_prefix.api_prefix + "position/positionList",this.ruleform).then(response => {
          if(response.body.code==0){
            this.tableData=response.body.body.list;
            this.tableDataTotal=response.body.body.total
          }else{
            this.$alert(response.body.message);
          };
        },response => {

        });        
      },
      //编辑
      editRole(name,idList,dataLimit){
        this.roleFlag = true;
        this.postName=name;
        // 如果idList没数据，查所有role
        if(idList.length==0){
          this.searchRoles("");
          this.roleListCheckList=null;
        }else{
          this.roleListCheckList=idList[0];
        }
        this.dataLimit=dataLimit
        this.$nextTick(function() {
          jdyFn.setAlertStyle("showtfcity");
        });
      },
      changeRole(id){
        this.roleForm.roleId = id;
      },
      saveRole(){
        let nullarray=[];
        nullarray.push(this.roleListCheckList)
        let param={
          positionName:this.postName,
          roleIds:nullarray,
          dataLimit:this.dataLimit
        }
        this.$http.post(api_prefix.api_prefix + "position/savePositionRoles", param ).then(response => {
          if(response.body.code==0){
            this.$message.success("保存成功！")
          }else{
            this.$alert(response.body.message);
          };
          this.closeAlert()
          this.getTableData()
        },response => {

        });
      },
      closeAlert() {
        //关闭弹窗统一方法
        this.roleFlag = false;
        this.roleListCheckList=null;
        $(".alertbgg").remove();
      },
      // // 获取角色列表
      // getRole(){
      //   let param={
      //     currPage:1,
      //     pageSize:2000,
      //     key:''        
      //   }
      //   API.getRoleList(param).then(response => {
      //     if(response.body.code==0){
      //       this.roleList=response.body.body.list;
      //     }else{

      //     };
      //   })        
      // },
      searchRoles(keys){
        let param={
          currPage:1,
          pageSize:2000,
          key:keys        
        }
        API.getRoleList(param).then(response => {
          if(response.body.code==0){
            this.roleList=response.body.body.list;
          }else{

          };
        })            
      },
      remote_oBuyerCompanyId(key) {
        this.$http
          .post(
            api_prefix.api_prefix + "Company/index",
            { pid: 343, searchType: 1, pageIndex: 1, fastSearchStr: $.trim(key) },
            { emulateJSON: true }
          )
          .then(response => {
            if (response.body.code == 0) {
              this.companyIdArr = response.body.body.list;
            } else {
            }
          });
      },             

    }

  }


</script>
<style scoped>
.el-form-item{
    margin-bottom: 0;
}
.yjk-orderList .el-table th>.cell,.yjk-orderList .el-table td>.cell{
    text-align: center;
}
.bindrole{
  margin:40px 80px;
}

</style>



