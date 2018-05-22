<template>
  <div class="jdy-content fleft jl-information lv-order-detail">
    <div class="jdy-content-inner">
      <!--jdy-tab begin-->
     <!-- <div class="jdy-tab">
        <h2>组织架构</h2>
      </div>-->
      <div class="content">
        <el-tree class="orgTree" :data="treeData" :props="defaultProps"  node-key="id" :current-node-key="activeNode.id" :expand-on-click-node=false default-expand-all highlight-current :render-content="renderContent" @node-click="handleNodeClick"></el-tree>
      </div>
    </div>

    <!-- 新增编辑 组织架构 begin-->
    <jdy-alert :title="aorgDiaTitle" @closeAlert="closeAlert" v-if="orgDialogFlag" class="dialog-lv dialogOrg diaOrgAddOrEdit" style="height:342px">
      <el-row class="scroll-cont p20">
        <el-form  :model="orgForm" ref="orgForm" label-width="60px" class="dialog-form">
          <el-form-item label="名称:" prop="name" :rules="rulesForm.nameRule">
            <el-input placeholder="请输入" v-model="orgForm.name"></el-input>
          </el-form-item>
          <el-form-item label="类型:" prop="typeId" :rules="rulesForm.typeRule">
            <el-select v-model="orgForm.typeId" :disabled="orgDialogType === 'edit'">
              <el-option label="公司" value="c"  key="c" v-if="activeNode.type === 'c'"></el-option>
              <el-option label="部门" value="d"  key="d"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门类型:" prop="departmentType" :rules="rulesForm.departmentType" v-if="orgForm.typeId == 'd'">
            <el-select v-model="orgForm.departmentType">
              <el-option label="销售" value="0"  key="0"></el-option>
              <el-option label="非销售" value="1"  key="1"></el-option>
              <el-option label="同业" value="2"  key="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-row>
      <div class="alertfoot1 clearfix">
        <el-button type="primary" class="fright mt10 mr10" :disabled="btnFlag" @click="saveOrgFn()">确定</el-button>
        <el-button class="fright mt10 mr10" @click="closeAlert">取消</el-button>
      </div>
    </jdy-alert>
    <!-- 新增编辑 组织架构 end-->

    <!-- 调整部门 begin-->
    <AdjustDepartment ref="adjustDepartment" @refreshData="refreshTreeFn"></AdjustDepartment>
    <!-- 调整部门 end-->

    <!-- 设置负责人  begin-->
    <jdy-alert title="设置负责人" @closeAlert="closeAlert" v-if="chargePersonFlag" class="dialog-lv dialogOrg chargePersonDia" style="height:210px">
      <el-row class="scroll-cont p20">
        <el-form  :model="chargePersonForm"  ref="chargePersonForm" label-width="120px" class="dialog-form">
          <el-form-item label="请选择负责人:"  class="is-required" prop="personId" :rules="rulesForm.chargePersonRule">
            <el-select v-model="chargePersonForm.personId" clearable filterable :filter-method="searchChargePerson">
              <el-option :key="value.id" v-for="value in userList" :label="value.u_real_name" :value="value.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-row>
      <div class="alertfoot1 clearfix">
        <el-button type="primary" class="fright mt10 mr10" :disabled="btnFlag" @click="saveChargePersonFn()">确定</el-button>
        <el-button class="fright mt10 mr10" @click="closeAlert">取消</el-button>
      </div>
    </jdy-alert>
    <!-- 设置负责人  end-->
    <!-- 设置指导员  begin-->
    <jdy-alert title="设置指导员" @closeAlert="closeAlert" v-if="chargeLeaderFlag" class="dialog-lv dialogOrg chargePersonDia" style="height:210px">
      <el-row class="scroll-cont p20">
        <el-form  :model="chargeLeaderForm"  ref="chargeLeaderForm" label-width="120px" class="dialog-form">
          <el-form-item label="请选择指导员:"  class="is-required" prop="leaderId" :rules="rulesForm.chargeLeaderRule">
            <el-select v-model="chargeLeaderForm.leaderId" clearable filterable :filter-method="searchChargeLeader">
              <el-option :key="value.id" v-for="value in leaderList" :label="value.uRealName" :value="value.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-row>
      <div class="alertfoot1 clearfix">
        <el-button type="primary" class="fright mt10 mr10" :disabled="btnFlag" @click="saveChargeLeaderFn()">确定</el-button>
        <el-button class="fright mt10 mr10" @click="closeAlert">取消</el-button>
      </div>
    </jdy-alert>
    <!-- 设置指导员  end-->

  </div>
</template>

<script>
import jdyAlert from "@/components/Alert";
import AdjustDepartment from "./adjustDepartment";
import API from '@/pages/human/api/index';
import {requiredMust} from '@/assets/js/validate';
export default {
    name:"",
    components: {
      jdyAlert,
      AdjustDepartment
    },
    data() {
        return {
          btnFlag:false,
          firstNode:'',
          activeNode:{
            type:null,
            id:null
          },
          treeData:[],
          defaultProps:{
            children: 'children',
            label: 'text'
          },
          //弹层
          rulesForm:{
            nameRule:[{ required: true, message: '请输入名称', trigger: 'blur' },],
            typeRule:[{ required: true, message: '请选择类型', trigger: 'change' },],
            departmentType:[{ required: true, message: '请选择部门类型', trigger: 'change' },],
            chargePersonRule:[{ validator: requiredMust, message: '请选择负责人名称', trigger: 'change' },],
            chargeLeaderRule:[{ validator: requiredMust, message: '请选择指导员名称', trigger: 'change' },]
          },
          //新增编辑
          orgDialogFlag:false,
          orgDialogType:'add',
          aorgDiaTitle:'新增',
          departmentTypeList:[],
          orgForm:{
            name:'',
            typeId:'',
            departmentType:''
          },
          //负责人
          userList:[],
          chargePersonFlag:false,
          chargePersonForm:{
            personId:'',
          },
          //指导员
          chargeLeaderFlag:false,
          chargeLeaderForm:{
            leaderId:'',
          },
          leaderList:[]
        }
    },
    mounted(){
      const vm = this;

      this.getTreeList();
      let curentNodeId = JSON.parse(sessionStorage.loginData).uCompanyId;
      this.activeNode.id = curentNodeId;
      console.log(JSON.parse(sessionStorage.loginData));
      console.log(this.activeNode.id +' 666')
    },
    methods:{
      refreshTreeFn(){
        //只能刷新tree，因为要记录选择的节点
        this.getTreeList();
      },
      //treeData没有companyId时，给treeData添加companyId,
      dealWithTreeData(treeData,parentCompanyId){
        treeData.forEach((item,index)=>{
          let isCompany = item.id.substring(0,1);
          if(isCompany==='c'){
            item.companyId = item.id.substring(1);
          }
          else if(isCompany==='d'&& parentCompanyId){
            item.companyId = parentCompanyId;
          }
          if(item.children){
            this.dealWithTreeData(item.children,item.companyId);
          }
        })

      },
      getTreeList(){
        const sendId = 888888;
        API.getOrgTreeList(sendId).then((response)=>{
          if(response.data.code ==='200'){
            const treeData = response.data.data;
            this.treeData = eval('('+treeData+')');
            console.log(this.treeData )
          }
          else{
            if(response.data.message){
              this.$alert(response.data.message);
            }
            else{
              this.$alert('code:'+response.data.code+'success:'+response.data.success);
            }
          }
        });
      },
      handleNodeClick(data){
        const activeData = data;
        console.log("点击",data.departmentType)
        this.activeNode = jdyFn.deepCopy(activeData);
        this.activeNode.companyId = Number(activeData.companyId);
        this.activeNode.orgId = Number(activeData.id.substring(1));
        this.activeNode.parentId =Number( activeData.parentId.substring(1));
        this.activeNode.parentType = activeData.parentId.substring(0,1);
        this.activeNode.type = activeData.id.substring(0,1);
      },
      renderContent(h, { node, data, store }) {
        const vm = this;
        let btnArr = [];
        let firstClass= '';
        const type = data.id.substring(0,1);
        let labelName = type==='c'?'公司':'部门';
        let labelNameC = type==='c'?'公司/部门':'部门';
        const fistBtnArr = [
          h('el-button',{on:{click:function (event) {
            vm.handleNodeClick(data);
            vm.showChargePersonDia();
            event.stopPropagation();
          }}},"设置负责人"),
          h('el-button',{on:{click:function (event) {
            vm.orgDialogType = 'add';
            vm.aorgDiaTitle = '新增';
            vm.handleNodeClick(data);
            vm.showOrgDia();
            event.stopPropagation();
          }}},"新增下级"+labelNameC),
          h('el-button',{on:{click:function (event) {
            vm.orgDialogType = 'edit';
            vm.aorgDiaTitle = '编辑';
            vm.handleNodeClick(data);
            vm.showOrgDia();
            event.stopPropagation();
          }}},"修改"+labelName+"名称")];
        const lastBtnArr = [
         /* h('el-button',{on:{click:function (event) {
            vm.$refs.adjustDepartment.showDeparmentDia(data);
            event.stopPropagation();
          }}},"调整"+labelName),*/
          h('el-button',{on:{click:function (event) {
            vm.handleNodeClick(data);
            vm.deleteFn();
            event.stopPropagation();
          }}},"撤销"+labelName)];
          const leaderArr = [
              h('el-button',{on:{click:function (event) {
              vm.handleNodeClick(data);
              vm.showChargeLeaderDia();
              event.stopPropagation();
            }}},"设置指导员"),
          ]
        if(node.level === 1){
          btnArr = fistBtnArr;
          firstClass = 'level level0';
        }
        else if(data.children && data.children.length > 0){
            btnArr = fistBtnArr.concat(leaderArr);
            firstClass = 'level';
        }
        else{
            btnArr = fistBtnArr.concat(lastBtnArr,leaderArr);
            firstClass = 'level';
        }

        let personInCharge = (data.personInCharge ==='null' || !data.personInCharge)?'暂无':data.personInCharge;
        let leaderInCharge = (data.leaderName ==='null' || !data.leaderName)?'暂无':data.leaderName;
        let bgClass = type==='c'?'bg companyBg':'bg departmentBg';
        let iconClass = type==='c'?'iconClass companyIcon':'iconClass departmentIcon';
       // console.log(node);
        let levelN = node.level;
        return h('div',{attrs:{'class':firstClass}}, [
          h('div',{attrs:{'class':bgClass}}),
          h('div',{attrs:{'class':'txtCont'}}, [
            h('span',{attrs:{'class':iconClass}}),
            h('span',{attrs:{'class':'labelName'}},node.label),
            h('span',{attrs:{'class':'greyFont'}},'负责人：'+personInCharge),
            h('span',{attrs:{'class':data.leaderName ? 'greyFontTwo':'showLeader'}},'指导员：'+leaderInCharge),
            h('div',{attrs:{'class':this.activeNode.id === data.id ? 'btnWrap showBtn':'btnWrap'}},btnArr)
          ])
        ]);

      },
      showOrgDia(data){
        //清空form
        this.orgForm.name='';
        this.orgForm.typeId='';
        this.orgForm.departmentType='';
        const diaType = this.orgDialogType;
        const activeNode = this.activeNode;
        if(diaType ==='add'){
          if(this.activeNode.type === 'd') {
            this.orgForm.typeId = 'd';
          }
        }
        else if(diaType ==='edit'){
          this.orgForm.name=activeNode.text;
          this.orgForm.typeId=activeNode.type;
          this.orgForm.departmentType=activeNode.departmentType;
        }
        this.orgDialogFlag=true;
        this.$nextTick(function() {
          jdyFn.setAlertStyle("diaOrgAddOrEdit");
        });
      },
      saveOrgFn(){
        this.$refs.orgForm.validate((valid)=>{
          if(valid){
            this.btnFlag = true;
            const diaType = this.orgDialogType;
            if(diaType ==='add'){
              if(this.activeNode.type === 'c' && this.orgForm.typeId === 'c'){
                this.saveAddCompanyFn();
              }
              else if(this.activeNode.type === 'd' || this.orgForm.typeId === 'd'){
                this.saveAddDepartmentFn();
              }
            }
            else if(diaType ==='edit'){
              this.saveEditOrgFn();
            }
          }
          else{
            console.log('error submit!!');
            return false;
          }
        })
      },
      saveAddCompanyFn(){
        let sendData = {
          companyName :this.orgForm.name,
          parentCompanyId :this.activeNode.companyId,
        };
        sendData = filterSendData(sendData);
        API.addCompany(sendData).then((response)=>{
          this.btnFlag = false;
          if(response.data.code ==='0'){
            this.getTreeList();
            this.closeAlert();
          }
          else{
            this.$alert(response.data.message);
          }
        });
      },
      saveAddDepartmentFn(){
        let sendData = {
          companyId: this.activeNode.companyId,
          departmentName :this.orgForm.name,
          parentDepartmentId:this.activeNode.type === 'c'?0:this.activeNode.orgId ,
          dType:this.orgForm.departmentType
        };
        sendData = filterSendData(sendData);
        API.addDepartment(sendData).then((response)=>{
          this.btnFlag = false;
          if(response.data.code ==='0'){
            this.getTreeList();
            this.closeAlert();
          }
          else{
            this.$alert(response.data.message);
          }
        });
      },
      //编辑保存
      saveEditOrgFn(){
        let sendData = {
          companyId : this.activeNode.companyId,
          id:this.activeNode.orgId,
          name:this.orgForm.name,
          type:this.orgForm.typeId === 'c'?0:1,
          dType:this.orgForm.departmentType
        };
        sendData = filterSendData(sendData);
        API.editOrgName(sendData).then((response)=>{
          this.btnFlag = false;
          if(response.data.code ==='0'){
            this.getTreeList();
            this.closeAlert();
          }
          else{
            this.$alert(response.data.message);
          }
        });
      },
      closeAlert(){
        this.btnFlag = false;
        $('.alertbgg').remove();
        this.orgDialogFlag=false;
        this.chargePersonFlag=false;
        this.chargeLeaderFlag=false;
      },
      //负责人
      showChargePersonDia(){
        const vm = this;
        this.chargePersonFlag=true;
        this.chargePersonForm.personId = '';
        this.$nextTick(function() {
          jdyFn.setAlertStyle("chargePersonDia");
          vm.searchChargePerson(null);
        });
      },
      saveChargePersonFn(){
        this.btnFlag = true;
        this.$refs.chargePersonForm.validate((valid)=>{
          if(valid){
            this.saveChargePersonAjax();
          }
          else{
            this.btnFlag = false;
            console.log('error submit!!');
            return false;
          }
        })
      },
      saveChargePersonAjax(){
        let sendData = {
          managerId :this.chargePersonForm.personId,
          companyId:this.activeNode.companyId ,
          orgId:this.activeNode.orgId,
          type: this.activeNode.type === 'c'?0:1,
        };
        sendData = filterSendData(sendData);
        API.saveChargePersonList(sendData).then((response)=>{
          this.btnFlag = false;
          console.log(response.data.list)
          if(response.data.code ==='0'){
            this.getTreeList();
            this.closeAlert();
          }
          else{
            this.$alert(response.data.message);
          }
        });
      },
      searchChargePerson(val){
        let sendData = {
          name:val,
          companyId:this.activeNode.companyId,
          departmentId:this.activeNode.type === 'd'?this.activeNode.orgId:null,
        };
        sendData = filterSendData(sendData);
        API.getChargePersonList(sendData).then((response)=>{
          if(response.data.code ==='0'){
            let data =  response.data.body;
            this.userList = data;
          }
          else{
            vm.$alert(response.data.message);
          }
        });
      },
      //指导员
      showChargeLeaderDia(){
        const vm = this;
        this.chargeLeaderFlag=true;
        this.chargeLeaderForm.leaderId = '';
        this.$nextTick(function() {
          jdyFn.setAlertStyle("chargePersonDia");
          vm.searchChargeLeader(null);
        });
      },
      saveChargeLeaderFn(){
        this.btnFlag = true;
        this.$refs.chargeLeaderForm.validate((valid)=>{
          if(valid){
            this.saveChargeLeaderAjax();
          }
          else{
            this.btnFlag = false;
            console.log('error submit!!');
            return false;
          }
        })
      },
      saveChargeLeaderAjax(){
        let sendData = {
          leader :this.chargeLeaderForm.leaderId,
          id:this.activeNode.orgId,
        };
        sendData = filterSendData(sendData);
        API.saveChargeLeaderList(sendData).then((response)=>{
          this.btnFlag = false;
          console.log(response.data.list)
          if(response.data.code ==='0'){
            this.getTreeList();
            this.closeAlert();
          }
          else{
            this.$alert(response.data.message);
          }
        });
      },
      searchChargeLeader(val){
        let sendData = {
          // name:val,
          companyId:this.activeNode.companyId,
          // departmentId:this.activeNode.type === 'd'?this.activeNode.orgId:null,
        };
        sendData = filterSendData(sendData);
        API.getChargeLeaderList(sendData).then((response)=>{
          if(response.data.code ==='0'){
            let data =  response.data.body;
            this.leaderList = data;
          }
          else{
            vm.$alert(response.data.message);
          }
        });
      },
      deleteFn(data){
        this.$confirm('确定撤销该项？撤销后不可恢复!', '撤销部门', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.deleteAjax();
        }).catch(() => {});
      },
      deleteAjax(){
        const vm = this;
        let sendData = {
          orgId:this.activeNode.orgId,
          type: this.activeNode.type === 'c'?0:1,
        };
        sendData = filterSendData(sendData);
        API.deleteOrg(sendData).then((response)=>{
          if(response.data.code ==='0'){
            this.getTreeList();
          }
          else if(response.data.code ==='-1'){
            setTimeout(function () {
              vm.cantDeleteFn();
            },250);
          }
          else{
            this.$alert(response.data.message);
          }
        });
      },
      cantDeleteFn(){
        this.$alert('该部门/子公司下有用户，不可撤销！', '撤销部门', {
          confirmButtonText: '确定',
          type: 'warning',
          callback: action => {}
        });
      },
    },

}
</script>

<style lang="less" scoped>
  .jdy-content-inner{
    .content{
      overflow-x: hidden;
    }
  }
  .dialog-lv{
    width: 400px;
    .dialog-form{
      padding-top: 10px;
      .form-title{
        color:#48576a;
        line-height: 36px;
        margin-top: -20px;
        padding-bottom: 5px;
      }
      .el-select{
        width: 100%;
      }
    }
  }

</style>
