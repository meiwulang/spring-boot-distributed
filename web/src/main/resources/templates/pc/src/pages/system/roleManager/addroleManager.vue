<template>
  <div class="jdy-content fleft">
    <div class="jdy-content-inner">
      <div class="jdy-tab">
        <el-form :model="ruleSearchForm" :inline="true" ref="ruleSearchForm" class="ml10">
          <el-row class="search-row pt10">
            <el-button type="default" class="ml10 btnbg fright" @click="goback" >返回</el-button>
            <el-button type="default" class="ml10 btnbg fright" @click="save" :disabled="btnFlag">保存</el-button>
          </el-row>
        </el-form>
      </div>
      <div class="role_info mt30">
        <el-form :model="tickForm" :rules="rules" ref="tickForm" class="demo-form-inline" label-width="150px">
          <el-row>
              <el-col :span="24" class="p10">
                  <el-form-item label="角色名称:" prop="rRoleName">
                    <el-input v-model="tickForm.rRoleName"></el-input>
                  </el-form-item>
              </el-col>
          </el-row>
          <el-row>
              <el-col :span="24" class="p10">
                  <el-form-item label="备注说明:">
                    <el-input v-model="tickForm.rRemark" type="textarea"></el-input>
                  </el-form-item>
              </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="sysRight">
        <div class="sysTitle">
            <el-button type="default" class="ml10 btnbg fright mt5" @click="setCheckAll">{{checkAllbtn}}</el-button>
        </div>
        <div class="sysMain">
            <div class="treepad" v-for="(item, key) in treeData" :key="key">
              <el-checkbox v-model="item.checked">{{item.label}}</el-checkbox>
              <div class="treepad1" v-if="item.children!=0" v-for="(item1, key1) in item.children" :key="key1">
                <el-checkbox v-model="item1.checked" @change="checkChange(item1)">{{item1.label}}</el-checkbox>
                <div class="treepad2" v-if="item1.children!=0" v-for="(item2, key2) in item1.children" :key="key2">
                  <el-checkbox v-model="item2.checked" @change="checkSonChange(item2)">{{item2.label}}</el-checkbox>
                </div>
              </div>
            </div>
        </div>
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
        tickForm:{
          rCompanyId:null,
          id:null,
          rRoleNo:null,
          sort:null,
          rRoleName:null,
          rRemark:null,
          checkedKeys:[]
        },
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
        checkedList:[],
        checkAllFlag:false,
        checkAllbtn:"全选",
        // 菜单树
        menuTreeData:[],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        /*校验*/
        rules: {
            rRoleName: [{type: 'string', required: true, message: '请输入角色名称', trigger: 'change' },
            {  max: 15, message: '长度在15个字符以内', trigger: 'blur' }],
        },
        pIds:[],
        btnFlag:false,
        tabsActive:"menu"
      }
    },
    created(){

    },
    mounted() {
      this.publicId = JSON.parse(sessionStorage.loginData).appId;
      // this.getTableData();
      if(this.$route.query.rRoleName!=null){
        this.tickForm={
          rRoleNo:this.$route.query.rRoleNo,
          rRoleName:this.$route.query.rRoleName,
          rRemark:this.$route.query.rRemark,
          id:this.$route.query.rId,
        };
      };
      this.tickForm.rCompanyId=this.$route.query.rCompanyId
      this.getRole();
    },
    methods: {
      goback(){
        this.$router.push({name:'roleManager'})
      },
      save(){
        this.btnFlag=true;
        // 获取选中的id
        let getCheckKeys=(tree)=>{
          for(let i=0;i<tree.length;i++){
            if(tree[i].checked==true){
              this.checkedList.push(tree[i].id)
            }
            if(tree[i].children.length!=0){
              getCheckKeys(tree[i].children)
            }
          }
          return  this.checkedList
        }

        this.tickForm.checkedKeys = getCheckKeys(this.treeData);
        this.tickForm.checkedKeys.removeArr(0);
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
              this.btnFlag=false;
            })
        }else{
            this.$message.error('提交失败了');
            this.btnFlag=false;
        }
        });
      },
      // 全选切换
      setCheckAll(){
        if(this.checkAllFlag){
          this.checkAllbtn="全选";
          this.checkAllFlag=false;
          this.setCheckAllNode(this.treeData,false)
        }else{
          this.checkAllbtn="取消全选";
          this.checkAllFlag=true;
          this.setCheckAllNode(this.treeData,true)
        }
      },
      // flag=true为全选
      setCheckAllNode(tree,flag){
          for(let i=0;i<tree.length;i++){
            tree[i].checked=flag?true:false;
            if(tree[i].children.length!=0){
              this.setCheckAllNode(tree[i].children,flag)
            }
          }
      },
      getRole(){
        let params={
          id:this.$route.query.rId,
          rCompanyId:this.$route.query.rCompanyId
        };
        API.roleEdit(params).then(response => {
          if(response.body.code==0){
            let resData=response.body.body;
            // 混合checkkeys和menukeys
            let allchecks=[]
            if(!resData.checkedKeys && !resData.checkedMenuKeys){
              allchecks=[];
            }else{
              allchecks=resData.checkedKeys.concat(resData.checkedMenuKeys);
              allchecks=Array.from(new Set(allchecks));
            }
            setCheckNode(resData.tree,allchecks)
          }else{
            this.$alert(response.body.message,"温馨提示",{type: 'error'});
          };
        });
        /**
         * @description 后端暂时没改，由前端改造数据结构
         * checkedKeys存在：节点递归添加字段checked，判断是否被选中
         * checkedKeys不存在：节点递归添加字段checked，默认设置为false
         * @param tree:树
         * @param checkedKeys:选中节点数组
        */
        let setCheckNode=(tree,checkedKeys)=>{
          for(let i=0;i<tree.length;i++){
            // 判断该id是否存在checkedKeys数组中.
            if(checkedKeys && checkedKeys.length!=0){
              let checkId=checkedKeys.filter(data=>{
                return data==tree[i].id
              })
              tree[i].checked=checkId.length!=0?true:false
            }else{
              tree[i].checked=false
            }
            if(tree[i].children.length!=0){
              setCheckNode(tree[i].children,checkedKeys)
            }
          }
          this.treeData=JSON.parse(JSON.stringify(tree))
        }
      },
      /**
       * @todo 节点点击逻辑优化（优先级1）
       * 1.点击父节点不影响子节点；点击子节点影响父节点（完成）
       * 2.同级子节点全部取消时父节点也取消
       * @todo 组件化（优先级2）
       * @todo 父节点可以展开（优先级3）
      */
      checkChange(target){
        this.setSingleNode(this.treeData,target.pId)

      },
      checkSonChange(target){
        this.setSingleNode(this.treeData,target.pId);
      },
      //点亮该id的节点
      setSingleNode(tree,id){
        for(let i=0;i<tree.length;i++){
          if(tree[i].id==id){
            tree[i].checked=true
          }else{
            if(tree[i].children.length!=0){
              this.setSingleNode(tree[i].children,id)
            }
          }
        }
      }
    }

  }


</script>
<style scoped lang='less'>
.el-form-item{
    margin-bottom: 0;
}
.yjk-orderList .el-table th>.cell,.yjk-orderList .el-table td>.cell{
    text-align: center;
}
.role_info{
    height: auto;
    padding-bottom: 30px;
    border: 1px solid #dfe6ec;
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
      background: #f9fafc;
      height:50px;
      line-height: 50px;
      padding: 0 10px;
    }
    .sysMain{
      margin: 10px 50px;
      .treepad{
        margin-bottom: 10px;
        .treepad1{
          padding-left: 16px;
          margin-top: 5px;
          .treepad2{
            padding-left: 32px;
          }
        }
      }
    }
}
</style>



