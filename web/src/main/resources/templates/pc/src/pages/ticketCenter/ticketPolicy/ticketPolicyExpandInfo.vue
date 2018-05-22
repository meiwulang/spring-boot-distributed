<template>
  <div class="jdy-content jdy-transfer fleft">

    <div class="jdy-content-inner">
      <inner-header :activename="headerData.name" :savebtn="headerData.btnFlag" @savedata="onSubmit('lineForm')" :title="headerData.title"></inner-header>
      <!--jdy-content-trip end-->
      <el-form class="" :model="lineForm" :rules="rules" ref="lineForm" label-width="100px">
        <el-row>
          <div class="priceTitle">供应商信息：</div>
          <el-col :span="8">
            <el-form-item label="供应商：">
              <el-input v-model="lineForm.supplier" placeholder=" 请填写供应商名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话：">
              <el-input v-model="lineForm.supplierTel" placeholder="请填写供应商联系电话"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="priceTitle">价格信息：</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="预算成本：">
              <el-input v-model="lineForm.costPrice" placeholder=" 请填写供应商名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出厂价：">
              <el-input v-model="lineForm.factoryPrice" placeholder="请填写供应商联系电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有效日期：">
              <el-date-picker v-model="usefulDate" type="daterange" placeholder="选择票有效日期范围" @change="dateRangeChange"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格说明：">
              <el-input v-model="lineForm.remark" type="textarea" autosize></el-input>
            </el-form-item>
          </el-col>
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
        name:"ticketPolicyExpandInfo",
        btnFlag:true,
      },
      lineForm:{
        supplier:'',
        supplierTel:'',
        costPrice:'',
        factoryPrice:'',
        lifeStartDate:'',
        lifeEndDate:'',
        remark:'',
        pid:1
      },
      usefulDate:'',
      btnFlag:false,
      rules: {
        tNo: [{ required: true, message: '请输入产品编号', trigger: 'blur' },
        { min: 1, max: 20, message: '长度在 1 到 20 个字', trigger: 'blur' }],
        tName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字', trigger: 'blur' }
        ],
        pManager: [
          { required: true, message: '请输入产品经理', trigger: 'blur' },
        ],
        tType: [
          { required: true, message: '请选择类型', trigger: 'change', type: "number" }
        ],
        cover: [
          { required: true, message: '请上传门票图片', trigger: 'change' }
        ]
      },
    }
  },
  methods: {
    //获取当前已选中的合同信息
    getCost(){
      this.$http.post(api_prefix + '/admission/cost-info',1).then(response => {
        if (response.data.code == 0) {
          let data=response.data.body;
          this.lineForm = data;
          this.usefulDate = [data.lifeStartDate,data.lifeEndDate]
        } else {
          this.$alert(response.data.message)
        }
      }, response => {
        console.log('出错了');
      });
    },
    dateRangeChange(value){
        console.log(this.tickForm.usefulDate,'09090909')
        if (value) {
            let values = value.split(" - ");
            this.lineForm.lifeStartDate = values[0];
            this.lineForm.lifeEndDate = values[1];
        }
    },
    onSubmit(formName, successFun) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
              this.btnFlag = true;
              this.$http.post(api_prefix + '/admission/save-cost', this.lineForm).then(response => {
                if (response.body.code == 0) {
                  this.btnFlag = false;
                  this.$message.success("保存成功");
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
    this.getCost()
  }
}
</script>
<style lang="less" scoped>
.priceTitle{
  line-height: 30px;
  height: 30px;
  margin: 0 0 15px 10px;
  font-weight: 500;
}
</style>


