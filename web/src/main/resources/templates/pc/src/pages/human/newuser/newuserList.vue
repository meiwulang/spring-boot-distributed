<template>
  <div class="jdy-content fleft newuserList">
    <!-- <div class="jdy-content-inner">
      <div class="newuserList mt30">

      </div>
    </div> -->
          <div class="fleft comList clearfix">
              <el-tree ref='tree' :data="treeData" highlight-current :props="defaultProps"  default-expand-all node-key="id" @node-click="handleNodeClick"></el-tree>
          </div>
          <div class="fleft userList clearfix">
            <div class="jdy-tab" style="margin:0;padding-right:0">
                <a href="javascript:;" title="" @click="jdytab(null)" :class="{ active: jdytabActive==null }">用户管理
                    <span></span>
                </a>
                <a href="javascript:;" title="" @click="jdytab(1)" :class="{ active: jdytabActive==1 }">离职人员
                    <span></span>
                </a>
            </div>
            <div style="padding:1%">
                <el-input v-model="tickForm.fastSearchStr" placeholder="请输入用户名，姓名，手机号" style="width:25%" class="searchInput"></el-input>
                <el-button @click="getTableData(true)" type="primary" class="mr20 mt10">搜索</el-button>
                <!-- <el-button @click="getlog" class="fright mr20 mt10">日志</el-button> -->
                <el-button @click="addUser" class="fright mt10" :disabled="this.routeParam.btnFlag">新增用户</el-button>
            </div>

            <el-table class="all yjk-orderList" :data="tableData" border highlight-current-row @current-change="handleRowChange">
            <el-table-column label="序号" type="index" min-width="60">
            </el-table-column>
            <el-table-column label="状态" min-width="80" v-show="jdytabActive===null">
              <template scope="scope">
                <el-switch v-model="scope.row.status" on-color="#71dc1c" :on-value="booleanValue.on" :off-value="booleanValue.off" on-text="" off-text="" @change="setStatus(scope.row)" v-show="jdytabActive===null">
                </el-switch>
                <span v-show="jdytabActive!==null">已离职</span>
              </template>
            </el-table-column>
            <el-table-column label="用户编号"  >
                <template scope="scope">
                {{ scope.row.userNo }}
                </template>
            </el-table-column>
            <el-table-column label="用户名"  >
                <template scope="scope">
                {{ scope.row.userName }}
                </template>
            </el-table-column>
            <el-table-column label="姓名"  >
                <template scope="scope">
                {{ scope.row.realName }}
                </template>
            </el-table-column>
            <el-table-column label="手机号" >
                <template scope="scope">
                {{ !scope.row.phone?"未设置":scope.row.phone }}
                </template>
            </el-table-column>
            <el-table-column label="职务" >
                <template scope="scope">
                {{ scope.row.dutyName }}
                </template>
            </el-table-column>
            <el-table-column label="单位">
                <template scope="scope">
                {{ scope.row.unitName }}
                </template>
            </el-table-column>
            <el-table-column label="部门">
                <template scope="scope">
                {{ scope.row.departmentName }}
                </template>
            </el-table-column>
            <el-table-column label="操作" prop="" min-width="120">
                <template scope="scope">
                <el-button type="default" size="mini" @click.native.prevent="detail(scope.row.userId)">
                    查看
                </el-button>
                <el-button type="default" size="mini" @click.native.prevent="editdetail(scope.row.userId)" v-show="jdytabActive===null">
                    编辑
                </el-button>
                <el-button type="default" size="mini" class="red" @click.native.prevent="deleteRow(scope.row)" v-show="jdytabActive===null">
                    注销
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
          </div>    
  </div>
  <!--jdy-content end-->
</template>

<script>
  import API from './../api/index';
  import api_prefix from '@/assets/js/apiUrl';

  export default {
    name: 'roleManager',
    data() {
      return {
        currentPage:1,
        pageSizeAll:20,
        tableDataTotal:0,
        ruleSearchForm:{},
        tickForm:{
            currPage:1,
            pageSize:20,
            fastSearchStr:'',
            type:null,
            statusList:[0,2],
            companyId:null,
            departmentId:null,
        },

        jdytabActive:null,
        expandData:[], //展开数据项
        checkData:[], //选中数据项
        resData:{
          expand:[],
          check:[],
        },
        allRjght:false,
        searchValue:'',
        tableData:[],
        publicId:'',
        accesstoken:'',
        time:'',
        // 树状结构
        treeData:[],
        defaultProps:{
            children: 'children',
            label: 'text'
        },
        searchKey:'',
        activeNode:{
            type:null,
        },
        booleanValue: {on: 0, off: 2}, //状态控制on/off 的value
        routeParam:{
            companyId:"",
            departmentId:"",
            btnFlag:true,
        },
        logindata:null      
      }
    },
    created(){

    },
    mounted() {
        this.logindata = JSON.parse(sessionStorage.loginData);
        // 如果是系统级则传null，如果不是系统级则传相应公司id
        this.tickForm.companyId=this.logindata.uDataLimit==3?null:this.logindata.uCompanyId 
        this.getTreeData();
        this.getTableData();
    },
    methods: {
        getTableData(){
            // 用户管理 status=[0,2] 离职人员=[1]
            API.userBaseList(this.tickForm).then((response)=>{
                if(response.data.code ==='200'){
                   this.tableData=response.data.data.list;
                   this.tableDataTotal=response.data.data.total
                }
                else{
                    this.$alert(response.data.message);
                }
            });
        },
        getTreeData(){
            const sendId = 888888;
            API.getOrgTreeList(sendId).then((response)=>{
            if(response.data.code ==='200'){
                const treeData = response.data.data;
                this.treeData = eval('('+treeData+')');
                this.routeParam.companyId=Number(this.treeData[0].companyId)
            }
            else{
                this.$alert(response.data.message);
            }
            });
        },
        jdytab(index){
            this.tickForm.statusList=index==null?[0,2]:[1]
            this.jdytabActive = index;
            console.log("状态",this.jdytabActive);
            this.tickForm.fastSearchStr='';
            this.getTableData();
        },
        deleteRow(row){
            this.$confirm('你确定要注销该用户？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post(api_prefix.api_prefix + '/user/status/' + row.userId + '/1/' + row.userName).then(response => {
                if(response.body.code==0){
                    this.$message.success("保存成功！")
                }else{
                    this.$alert(response.body.message,"温馨提示",{type: 'error'});
                };
                this.getTableData()
                }).then(response => {

                })
            }).catch(() => {

            });
        },
        setStatus(row){
            console.log(row.status)
            let status=row.status==0?2:0;
            let url=api_prefix.api_prefix + '/user/status/' + row.userId + '/' + row.status + '/' + row.userName
            this.$http.post(url).then(response => {
              if(response.body.code==0){
                this.$message.success("保存成功！")
              }else{
                this.$alert(response.body.message,"温馨提示",{type: 'error'});
              };
              this.getTableData()
            }).then(response => {

            })
        },
        search(){

        },
        getlog(){

        },
        addUser(){
            // 1.总公司下面不能直接添加员工，2.
            // if(this.routeParam.companyId===""){
            //     // return this.$message.info('新增用户请先在左边栏选择公司或者部门！');
            //     this.routeParam.companyId
            // }
            // this.routeParam.companyId===""&&
            // this.routeParam.companyId=this.routeParam.companyId===""?:this.routeParam.companyId;
            this.$router.push({name:'staffEdit',query:{
                isAdd:true,
                companyId:this.routeParam.companyId,
                departmentId:this.routeParam.departmentId
            }})
        },
        editdetail(id){
            this.$router.push({name:'staffEdit',query:{formDataIndex:id,
            isAdd:false,
            companyId:this.routeParam.companyId,
            departmentId:this.routeParam.departmentId           
            }})
        },
        detail(id){
            this.$router.push({name:'staffDetail',query:{id:id}})
        },
      handleNodeClick(data){
        const activeData = data;
        this.activeNode = jdyFn.deepCopy(activeData);
        this.activeNode.companyId = Number(activeData.companyId);
        this.activeNode.orgId = Number(activeData.id.substring(1));
        this.activeNode.parentId =Number( activeData.parentId.substring(1));
        this.activeNode.parentType = activeData.parentId.substring(0,1);
        this.activeNode.type = activeData.id.substring(0,1);
        // console.log(this.activeNode);
        this.tickForm.fastSearchStr='';
        if(this.activeNode.type=='c'){
            // this.tickForm.companyId=!(activeData.parentId)?null:this.activeNode.orgId;
            this.tickForm.companyId=this.activeNode.orgId==0?null:this.activeNode.orgId;
            this.tickForm.departmentId=null;
            this.routeParam.companyId=this.activeNode.companyId;
            this.routeParam.departmentId="";            
        }else{
            this.tickForm.companyId=null;
            this.tickForm.departmentId=this.activeNode.orgId;
            this.routeParam.companyId=this.activeNode.companyId;
            this.routeParam.departmentId=this.tickForm.departmentId;                        
        }
        this.routeParam.btnFlag=false;
        this.getTableData();
      },
      goback(){
        this.$router.push({name:'roleManager'})
      },
      save(){
        this.tickForm.checkedKeys=this.$refs.tree.getCheckedKeys();
        this.$refs["tickForm"].validate((valid) => {
        if(valid){
            let params=JSON.parse(JSON.stringify(this.tickForm));
            let limit=/^[A-Za-z0-9]+$/;
            if(!limit.test(params.rRoleNo)){
                this.$message.error('角色编号只能为数字或字母！');
                return;
            }
            API.roleUpdate(params).then(response => {
              if(response.body.code==0){
                this.$alert("保存成功","温馨提示",{type: 'success'});
                this.$router.push({ name: 'roleManager'})
              }else{
                this.$alert(response.body.message,"温馨提示",{type: 'error'});
              };
            })
        }else{
            this.$message.error('提交失败了');
        }
        });
      },
      spear(){
        this.expandData=this.resData.expand
      },
      close(){
        this.expandData=[];
      },
      checkCancel(){
        this.$refs.tree.setCheckedKeys([]);
      },
      setCheckedKeys(){
        this.expandData=this.resData.expand
        this.checkData=this.resData.expand
        this.$refs.tree.setCheckedKeys(this.checkData);
      },
      getRole(){
        let params={
          id:this.$route.query.rId,
          rCompanyId:this.$route.query.rCompanyId
        };
        API.roleEdit(params).then(response => {
          if(response.body.code==0){
            let resData=response.body.body
            this.treeData=resData.tree;
            this.resData.expand=resData.allTreeId;
            this.resData.check=resData.checkedKeys;
            this.$refs.tree.setCheckedKeys(resData.checkedKeys);
          }else{

          };
        })
      },
      handleCurrentChange(val){
        this.tickForm.currPage=val;
        this.currentPage = val;
        this.getTableData();
      },
      handleRowChange(){

      },
    }

  }


</script>
<style scoped lang='less'>
.el-form-item{
    margin-bottom: 0;
}
.yjk-orderList{
    width:98%;
    margin: 1%;
}
.yjk-orderList .el-table th>.cell,.yjk-orderList .el-table td>.cell{
    text-align: center;
}
.newuserList{
    height: auto;
    padding-bottom: 30px;
    .comList{
        width:20%;
    }
    .userList{
        width:78.5%;
        border: 1px solid #d7dfe3;
        margin: 10px 0 0 10px;
        .searchInput{
            width:25%;
            min-width:230px;
        }
    }
    .el-row{
      padding:15px 20px 0 10px;
    }
}
.sysRight{
    margin-top: 20px;
    height: auto;
    padding-bottom: 30px;
    border: 1px solid #dfe6ec;
    .sysTitle{
      background: #e5e9f2;
      height:50px;
      line-height: 50px;
      padding: 0 10px;
    }
    .sysMain{
      margin: 10px;
      border: 1px solid #dfe6ec;
    }
}

</style>



