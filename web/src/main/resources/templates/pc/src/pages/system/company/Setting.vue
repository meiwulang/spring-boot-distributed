<template>
    <div class="jdy-content jdy-transfer fleft">
        <div class="jdy-content-inner-trip">
            <div class="tripbox-tab clearfix">
              <router-link :to="{ name: 'companyInfo', query:{id: eForm.csCompanyId}}" title="" class="relative inlineblock fleft">基本信息
                <span class="absolute inlineblock"></span>
              </router-link>

              <router-link title="" :to="{ name: 'companyEnclosure', query:{id: eForm.csCompanyId,type:$route.query.type}}" class="relative inlineblock  fleft ">附件信息
                <span class="absolute inlineblock"></span>
              </router-link>
              <router-link title="" :to="{name: 'companySetting', query:{id: eForm.csCompanyId,type:$route.query.type}}" class="relative inlineblock  fleft active">设置
                <span class="absolute inlineblock"></span>
              </router-link>
            </div>
            <el-form :model="eForm" :rules="rules" ref="eForm" class="demo-form-inline" label-width="200px">
                <div class="tripbox clearfix  relative mt60 p10">
                    <div class="clearfix p10 border pb30">
                        <div class="ticketmanage-title tc">
                            <span>--结算设置--</span>
                        </div>
                        <el-row class="mt30">
                            <el-col :span="12">
                                <el-form-item label="网银支付手续费率(%):" prop="rate">
                                  <el-input-number v-model="eForm.csBankRate" :step="0.01" :min="0" :max="100" style="width: 100%"></el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="扫码支付手续费率(%):" prop="rate">
                                  <el-input-number v-model="eForm.csQrRate" style="width: 100%" :step="0.01" :min="0" :max="100"></el-input-number>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="settingrow">
                            <el-col :span="12">
                                <el-form-item label="提现结算类型:" prop="csSettlement" class="relative">
                                  <el-tooltip content="按付款日表示付款后即开始结算其结算日，按出团日表示出游回团后再计算其结算日" placement="top">
                                    <i class='el-icon-information absolute' style="left:-115px;top: 11px;" ></i>
                                  </el-tooltip>
                                    <el-select v-model="eForm.csSettlement" placeholder="请选择单位类型" class="all" @change="settlementChange">
                                      <el-option :key="0" label="按付款日" value="0">
                                      </el-option>
                                      <el-option :key="1" label="按出团日" value="1">
                                      </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="提现结算周期:" prop="csCycle" class="relative">
                                  <el-tooltip content="系统内生成账单时间。提现到帐时间为T+N，例如需次日到帐，设置为1，即T+1" placement="top">
                                    <i class='el-icon-information absolute' style="left:-115px;top: 11px;"></i>
                                  </el-tooltip>
                                     <el-select v-model="eForm.csCycle" placeholder="请选择提现结算周期" class="all">
                                      <el-option :key="item" :label="item" v-for="item in csCycleList" :value="item">
                                      </el-option>
                                     </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="settingrow">
                            <el-col :span="12">
                                <el-form-item label="提现费率(%):" prop="rate" class="relative">
                                  <el-tooltip content="尚品需要抽佣的比例。实际支付给供应商金额=订单金额*（1-手续费率-结算费率）" placement="top" >
                                    <i class='el-icon-information absolute' style="left:-111px;top: 11px;" ></i>
                                  </el-tooltip>
                                  <el-input-number v-model="eForm.csSettlementRate" style="width: 100%" :step="0.01" :min="0" :max="100"></el-input-number>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="clearfix pb30">
                        <el-button class="fright mt10 mr10" @click="goback()">返回</el-button>
                        <el-button type="primary" @click="onSubmit('tickForm2')" class="fright mt10 mr10">保存</el-button>
                    </div>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: "",
    data() {
        return {
            eForm: {
                csCompanyId:this.$route.query.id,
                csBankRate:"0.00",
                csQrRate:"0",
                csCycle:"",
                csSettlement:"",
                csSettlementRate:""
            },
            csCycleList:[0,1,3,5,7,15,30],
            rules: {
              csCycle:[{required: true, message: '请选择提现结算类型',type:'number',  trigger: 'change'}],
              csSettlement:[{required: true, message: '提现结算周期', trigger: 'change'}],

            }
        }
    },
    methods: {
         goback(url) {
            this.$confirm('数据未保存，是否关闭？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$router.push({ name: 'company' })
            }).catch(() => {

            });

        },
      settlementChange(value){
             if(value || value == 0){
                this.eForm.csSettlement= value.toString();
             }
      },
        onSubmit(){
         this.$refs["eForm"].validate(valid => {
             console.log(this.eForm);
           if (valid) {
             if(this.eForm.csCompanyId){
               this.$http.post(api_prefix + '/Company/saveCompanySetting',this.eForm).then(response => {
                 if(response.body.code!='0'){
                   this.$alert(response.body.message,"温馨提示",{type: 'error'});
                 }else{
                   this.$alert("保存成功","温馨提示",{type: 'success'});
                 }
               },response => {})
             }else{
               this.$alert("请先保存基本信息","温馨提示",{type: 'warning'});
             }
           }else{
               this.$message.error("保存失败");
           }
         });
        },
        openMessage(message){
          this.$message(message);
        },
        defaultSetting(){
          var id = this.$route.query.id;
          if(id){
            this.$http.post(api_prefix + '/Company/selectCompanySetting',{companyId:id},{emulateJSON:true}).then(response => {
                if(response.body.code == 0){
                  let formData =response.body.body;
                  this.eForm.csBankRate = formData.csBankRate
                  this.eForm.csQrRate = formData.csQrRate
                  this.eForm.csCycle = formData.csCycle
                  this.eForm.csSettlement = formData.csSettlement
                  this.eForm.csSettlementRate = formData.csSettlementRate
                }else if(response.body.code == -2){

                }else{
                  this.$alert(response.body.message,'温馨提示',{type: 'error'});
                }
            });
          }
        }
    },
    mounted(){
        this.defaultSetting();
    }
}
</script>
