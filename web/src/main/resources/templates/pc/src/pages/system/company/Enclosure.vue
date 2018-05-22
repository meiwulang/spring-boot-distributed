<template>
    <div class="jdy-content jdy-transfer fleft">
        <div class="jdy-content-inner-trip">
            <div class="tripbox-tab clearfix">
              <router-link :to="{ name: 'companyInfo', query:{id: eForm.id}}" title="" class="relative inlineblock fleft">基本信息
                <span class="absolute inlineblock"></span>
              </router-link>

              <router-link title="" :to="{ name: 'companyEnclosure', query:{id: eForm.id}}" class="relative inlineblock  fleft active">附件信息
                <span class="absolute inlineblock"></span>
              </router-link>
              <router-link title="" :to="{name: 'companySetting', query:{id: eForm.id,type:$route.query.type}}" class="relative inlineblock  fleft" v-show="$route.query.type==0">设置
                <span class="absolute inlineblock"></span>
              </router-link>
            </div>
            <el-form :model="eForm" :rules="rules" ref="eForm" class="demo-form-inline" label-width="150px">
                <div class="p38">
                    <div class="f16 mt22 c1f blod">logo上传</div>
                    <el-upload class="upload-demo mt30 upload-enclosure" drag :action="uploadUrl" :data="fileType" :on-success="logoSuccess" :show-file-list="false" :on-error="logoError">
                        <img v-if="eForm.cLogo" :src="eForm.cLogo"/>
                     <div v-else>
                       <i class="el-icon-upload"></i>
                       <div class="el-upload__text">
                         <em>点击上传</em>
                       </div>
                     </div>
                    </el-upload>
                    <div class="eline mt37"></div>

                    <div class="f16 mt22 c1f blod">法人身份证上传</div>
                    <div class="w450 mt30">
                        <el-input class="" v-model="eForm.cIdcard" placeholder="请输入身份证号"></el-input>
                    </div>
                    <div class="clearfix">
                        <el-upload class="upload-demo mt30 upload-enclosure upload-enclosure2 fleft mr20"  drag :action="uploadUrl" :data="fileType" :show-file-list="false" :on-success="cardFrontSuccess" :on-error="cardFrontError">
                          <img v-if="eForm.cIdcardFront" :src="eForm.cIdcardFront"/>
                          <div v-else>
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">
                                <em>点击上传</em>
                                <div class="sfzbox">正面</div>
                            </div>
                          </div>
                        </el-upload>

                        <el-upload class="upload-demo mt30 upload-enclosure upload-enclosure2 fleft mr20" drag :action="uploadUrl" :show-file-list="false" :data="fileType" :on-success="cardBackSuccess" :on-error="cardBackError">
                          <img v-if="eForm.cIdcardBack" :src="eForm.cIdcardBack"/>
                          <div v-else>
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">
                                <em>点击上传</em>
                                <div class="sfzbox">反面</div>
                            </div>
                          </div>
                        </el-upload>
                    </div>

                  <div class="eline mt37"></div>

                  <div class="f16 mt22 c1f blod">营业执照证上传</div>
                  <div class="w450 mt30">
                    <el-input class="" v-model="eForm.cLicenseCode" placeholder="请输入营业执照证"></el-input>
                  </div>
                  <div class="clearfix">
                    <el-upload class="upload-demo mt30 upload-enclosure upload-enclosure2 fleft mr20"  drag :action="uploadUrl" :data="fileType" :show-file-list="false" :on-success="LicenseSuccess" :on-error="LicenseError">
                      <img v-if="eForm.cLicense" :src="eForm.cLicense"/>
                      <div v-else>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                          <em>点击上传</em>
                          <div class="sfzbox">营业执照证</div>
                        </div>
                      </div>
                    </el-upload>
                  </div>

                    <div class="eline mt37"></div>


                    <div class="f16 mt22 c1f blod">印章上传</div>
                    <el-upload class="upload-demo mt30 upload-enclosure" drag :action="uploadUrl" :data="fileType" :show-file-list="false" :on-success="sealSuccess" :on-error="sealError">
                      <img v-if="eForm.cSeal" :src="eForm.cSeal"/>
                      <div v-else>
                      <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            <em>点击上传</em>
                            <div class="mt5 blue">（上传图片为白底，且图片小于500kb)</div>
                        </div>
                      </div>
                    </el-upload>
                    <div class="mt20">
<p v-if="$route.query.type==1">印章上传后默认会被用于【组团确认单】中作为单位印章，如有顾虑请勿上传</p>
<p v-else>印章上传后默认会被用于【出团通知书】与【组团确认单】中作为单位印章，如有顾虑请勿上传</p>
                    </div>
                    <div class="mt20">
                        <el-button class="" type="primary" @click="onSubmit">保存</el-button>
                        <el-button class="" type="default" @click="goback">返回</el-button>
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
            fileType:{fileType:"jpg"},
            uploadUrl:api_prefix+"/common/file/upload.vue",
            eForm: {
              id: this.$route.query.id,
              cSeal:"",//印章
              cLogo:"",//logo
              cIdcard:"",//身份证编号
              cIdcardFront:"",//身份证正面
              cIdcardBack:"",//身份证反面
              cLicenseCode:"",//营业执照号码
              cLicense:""//营业执照图片
            },
            rules: {

            }
        }
    },
    methods: {
        goback(){
            this.$confirm('数据未保存，是否返回？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                 this.$router.push({ name: 'company' })
            }).catch(() => {

            });

        },
        onSubmit(){
           if(this.eForm.id){
             this.$http.post(api_prefix + '/Company/saveAttach',this.eForm).then(response => {
                 if(response.body.code!='0'){
                   this.$alert(response.body.message,"温馨提示",{type: 'error'});
                 }else{
                   this.$alert("保存成功","温馨提示",{type: 'success'});
                 }
             },response => {})
           }else{
               this.$alert("请先保存基本信息","温馨提示",{type: 'warning'});
           }
        },
      logoSuccess(response){
          if(response.code != 0){
              this.$alert(response.message,"温馨提示","error");
          }else{
              this.eForm.cLogo = response.body.key
          }
      },
      logoError(response){
        this.eForm.cLogo = "";
        this.$alert(response.message,"温馨提示","error");
      },
      cardFrontSuccess(response){
        if(response.code != '0'){
          this.$alert(response.message,"温馨提示","error");
        }else{
          this.eForm.cIdcardFront = response.body.key
        }
      },
      cardFrontError(response){
        this.eForm.cIdcardFront = "";
        this.$alert(response.message,"温馨提示","error");
      },
      cardBackSuccess(response){
        if(response.code != '0'){
          this.$alert(response.message,"温馨提示","error");
        }else{
          this.eForm.cIdcardBack = response.body.key
        }
      },
      cardBackError(response){
        this.eForm.cIdcardBack = "";
        this.$alert(response.message,"温馨提示","error");
      },
      LicenseSuccess(response){
        if(response.code != '0'){
          this.$alert(response.message,"温馨提示","error");
        }else{
          this.eForm.cLicense = response.body.key
        }
      },
      LicenseError(response){
        this.eForm.cLicense = "";
        this.$alert(response.message,"温馨提示","error");
      },
      sealSuccess(response){
        if(response.code != '0'){
          this.$alert(response.message,"温馨提示","error");
        }else{
          this.eForm.cSeal = response.body.key
        }
      },
      sealError(response){
        this.eForm.cSeal = "";
        this.$alert(response.message,"温馨提示","error");
      },
      defaultDate(){
        var id = this.$route.query.id;
        if(id){
          this.$http.post(api_prefix + '/Company/selectCompany',{companyId:id},{emulateJSON:true}).then(response => {
              let oldDate =response.body.body;
              this.eForm.cSeal = oldDate.cSeal
              this.eForm.cLogo = oldDate.cLogo
              this.eForm.cIdcard = oldDate.cIdcard
              this.eForm.cIdcardFront = oldDate.cIdcardFront
              this.eForm.cIdcardBack = oldDate.cIdcardBack
              this.eForm.cLicenseCode = oldDate.cLicenseCode
              this.eForm.cLicense = oldDate.cLicense
          });
        }
      }
    },
    mounted(){
        this.defaultDate();
    }
}
</script>

<style>

</style>
