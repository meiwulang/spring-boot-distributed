<template>
  <div class="jdy-content jdy-transfer fleft">

    <div class="jdy-content-inner">
      <inner-header :activename="headerData.name" :savebtn="headerData.btnFlag" @savedata="saveContract" :title="headerData.title"></inner-header>
      <!--jdy-content-trip end-->
      <el-form class="formcenter" :model="lineForm" ref="lineForm" label-width="100px">
        <el-row>
          <div class="priceTitle">选择合同模板：</div>
          <div class="alertBody">
            <el-radio-group v-model="tempId">
              <el-radio :label="item.id" v-for="item in tempIdGroup" :key="item.id">{{item.templateTitle}}</el-radio>
            </el-radio-group>
          </div>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
// import lData from './data.js';
import jdyEditor from '@/components/Quilleditor';
import ElFormItem from "../../../../node_modules/element-ui/packages/form/src/form-item";
import ElInputNumber from "../../../../node_modules/element-ui/packages/input-number/src/input-number";
// 通用tab页
import innerHeader from './header';
export default {
  name: 'line',
  data() {
    return {
      headerData:{
        name:"ticketPolicyContract",
        btnFlag:true,
      },
      btnFlag:false,
      lineForm:{},
      usefulDate:'',
      btnFlag:false,
      // 合同模板相关
      contractFlag:false,
      tempId:null,
      tempIdGroup:[],
      searchParam:{
				companyId:JSON.parse(sessionStorage.loginData).uCompanyId,
				currPage: 1,
				pageSize: 20,				
			},
    }
  },
  methods: {
    // 合同模板-查询
    getContract(){
      this.$http.post(api_prefix + 'front/order/m/electronicContract/searchList',this.searchParam).then(response => {
        if (response.data.code == 0) {
          let data=response.data.body;
          // this.tempId=data.id;
          this.tempIdGroup=data.list
        } else {
          this.$alert(response.data.message)
        }
      }, response => {
        console.log('出错了');
      });
    },
    //获取当前已选中的合同信息
    editContract(){
      this.$http.post(api_prefix + '/admission/contract-info',this.$route.query.id ||7).then(response => {
        if (response.data.code == 0) {
          let data=response.data.body;
          this.tempId=data.tId;
        } else {
          this.$alert(response.data.message)
        }
      }, response => {
        console.log('出错了');
      });
    },
    // 合同模板-保存
    saveContract(){
      let param={
        pid: this.$route.query.id ||7,
        tid: this.tempId,
      };
      this.$http.post(api_prefix + '/admission/bind-contract',param).then(response => {
        if (response.data.code == 0) {
          this.$message.success("保存成功！");
          this.closeContract();
        } else {
          this.$alert(response.data.message)
        }
        // this.editContract();
      }, response => {
        console.log('出错了');
      });
    },
  },
  components: { 
    ElInputNumber,
    ElFormItem,
    jdyEditor,
    innerHeader
  },
  mounted(){
    this.getContract();
    this.editContract();
  }
}
</script>

<style lang="less" scoped>
.priceTitle{
  line-height: 30px;
  height: 30px;
  margin: 0 0 0 10px;
  font-weight: 500;
}
.alertBody{
  width: 100%-20px;
  padding: 10px;
  .el-radio-group .el-radio{
    display: block;
    margin: 10px 30px;
  }
}
.formcenter{
    width: 70%;
    min-width: 600px;
    margin: 0 auto;
}
.flexrow{
    width: 40%;
    min-width: 400px;
    margin: 0 auto;
}
</style>

