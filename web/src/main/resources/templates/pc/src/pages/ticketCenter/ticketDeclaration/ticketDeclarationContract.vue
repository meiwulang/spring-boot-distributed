<template>
  <div class="jdy-content jdy-transfer fleft">

    <div class="jdy-content-inner">
      <inner-header :activename="headerData.name" :savebtn="headerData.btnFlag" :savebtnTwo="headerData.btnFlagTwo" @savedata="saveContract"  @savedataTwo="declaration" :title="headerData.title" :titleTwo="headerData.titleTwo"></inner-header>
      <!--jdy-content-trip end-->
      <el-form class="" :model="lineForm" ref="lineForm" label-width="100px">
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
        name:"ticketDeclarationContract",
        btnFlag:true,
        btnFlagTwo:true,
        title:'保存',
        titleTwo:'申报'
      },
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
    dateRangeChange(value){
        console.log(this.tickForm.usefulDate,'09090909')
        if (value) {
            let values = value.split(" - ");
            // this.tickForm.suitableStartTime = values[0];
            // this.tickForm.suitableEndTime = values[1];
        }
    },
     //申报
    declaration(){
      let id = this.$route.query.id
      this.$http.get(api_prefix + '/admission/base/declare/' + id).then(response => {
        if (response.data.code == 0) {
          this.$message({
            showClose: true,
            message: "申报成功",
            type: "success"
          });
        } else {
          this.$alert(response.data.message)
        }
      }, response => {
        console.log('出错了');
      });
    },
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
      this.$http.post(api_prefix + '/admission/contract-info',this.$route.query.id).then(response => {
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
        currPage: 1,
        pageSize: 20,
        pid: this.$route.query.id,
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
    onSubmit(formName, successFun) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
              this.btnFlag = true;
              this.$http.post(api_prefix + '/product/save', this.lineForm).then(response => {
                if (response.body.code == 0) {
                  this.btnFlag = false;
                  this.$message.success("保存成功");
                  this.lineForm.id = response.body.id[0];
                  successFun && successFun(response.body.id[0]);
                } else {
                  this.btnFlag = false;
                  this.defalutErrorMessage(response.body.message);
                }
              }, response => {
                this.defalutErrorMessage();
              });
        } else {
          this.$message.error("保存失败");
          return false;
        }
      });
    },
    defalutErrorMessage(message) { //失败提示
      if (message) {
        this.$alert(message, "温馨提示", { type: "error" });
      } else {
        this.$alert("网络出错了~", "温馨提示", { type: "error" });
      }
    },
  },
  components: { 
    ElInputNumber,
    ElFormItem,
    jdyEditor,
    innerHeader
  },
  mounted(){
    if(this.$route.query.id){
      this.getContract();
      this.editContract();
    }
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
</style>


