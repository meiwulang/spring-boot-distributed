<template>
  <div class="jdy-content fleft">
    <div class="jdy-content-inner-trip">
      <div class="jdy-tab">
        <el-form :model="ruleSearchForm" :inline="true" ref="ruleSearchForm" class="ml10">
          <el-row class="search-row pt10">
            <el-form-item prop="quickSearch" class="creditBillSearch">
              <el-input placeholder="搜索角色名称" v-model.trim="ruleform.key" class="search-input-l" style="width:420px">
              </el-input>
            </el-form-item>
            <el-button type="default" class="ml10 btnInTab" @click="getTableData">搜索</el-button>
            <el-button type="primary" class="ml10 btnInTab fright mr10" @click="addRole">添加</el-button>
          </el-row>
        </el-form>
      </div>
      <div class="jdy-table p10">
        <el-table class="all yjk-orderList" :data="tableData" border highlight-current-row @current-change="handleRowChange">
          <!-- <el-table-column label="角色编号"  min-width="150">
            <template scope="scope">
              {{ scope.row.rRoleNo }}
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="所属公司"  min-width="150">
            <template scope="scope">
              {{ scope.row.companyName }}
            </template>
          </el-table-column>           -->
          <el-table-column label="角色名称"  min-width="150">
            <template scope="scope">
             {{ scope.row.rRoleName }}
            </template>
          </el-table-column>
          <el-table-column label="备注说明" min-width="200">
            <template scope="scope">
             {{ scope.row.rRemark }}
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="" min-width="120">
            <template scope="scope">
              <el-button type="default" size="mini" @click.native.prevent="detail(scope.row)">
                编辑
              </el-button>
              <el-button type="default" size="mini" class="red" @click.native.prevent="deleteRow(scope.row.id)">
                删除
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
        ruleform:{
          currPage:1,
          pageSize:20,
          key:''
        },
        tableData:[],
        publicId:'',
        accesstoken:'',
        time:'',
        rCompanyId:null,
        companyName:null,
      }
    },
    created(){

    },
    mounted() {
      let InitData=JSON.parse(sessionStorage.loginData)
      this.publicId = InitData.appId;
      this.rCompanyId=InitData.uCompanyId;
      this.companyName=InitData.cName;
      // console.log(this.companyName)
      this.getTableData();
    },
    methods: {
      handleCurrentChange(val){
        this.currentPage = val;
        this.ruleform.currPage=val
        this.getTableData();
      },
      handleRowChange(){

      },
      addRole(){
        this.$router.push({name:'addroleManager',query:{rCompanyId:this.rCompanyId}})
      },
      detail(row){
        this.$router.push({name:'addroleManager',query:{rRoleNo:row.rRoleNo,rRoleName:row.rRoleName,rRemark:row.rRemark,rCompanyId:row.rCompanyId,rId:row.id}})
      },
      deleteRow(id){
        this.$confirm('你确定要删除该角色？', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.$http.post(api_prefix.api_prefix + "role/removeRole", id ).then(response => {
              if(response.body.code==0){
                this.$message.success("删除成功！")
              }else{
                this.$message.error(response.body.message);
              };
              this.getTableData()
            },response => {

            });
          // API.roleRemove(id).then(response => {
          //   if(response.body.code==0){
          //     this.$message.success("删除成功！")
          //   }else{
          //     this.$message.error("删除失败！")
          //   };
          //   this.getTableData()
          // })
          }).catch(() => {

          });
      },
      getTableData(){
        let param=filterSendData(this.ruleform,'delete')
        API.getRoleList(param).then(response => {
          if(response.body.code==0){
            this.tableData=response.body.body.list;
            this.tableDataTotal=response.body.body.total
          }else{

          };
        })
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

</style>



