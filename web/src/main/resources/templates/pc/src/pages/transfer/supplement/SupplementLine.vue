<template>
  <div class="jdy-content jdy-transfer jl-addTrip fleft jl-trip">
    <div class="jdy-content-inner">
      <div class="jdy-tab">
        <el-button class="fright mt10" @click="goback('list')">返回</el-button>
        <el-button type="primary" @click="onSubmit" class="fright mt10 mr10">保存</el-button>
      </div>

      <div class="tripbox clearfix border relative mt30">
        <div class="tripbox-tab">
          <a title="" class="relative inlineblock fleft active">线路信息
            <span class="absolute inlineblock"></span>
          </a>
          <router-link title="" :to="{name:'Supplement',query:this.$route.query}" class="relative inlineblock fleft">
            行程信息
            <span class="absolute inlineblock"></span>
          </router-link>
        </div>
        <div class="h20 mt10"></div>
        <el-form class="" :model="lineForm" ref="lineForm" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="18">
              <el-row>
                <el-form-item label="产品编号:">
                  <el-input v-model="lineForm.pNo" placeholder="请填写字母、数字" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="产品名称:">
                  <el-input v-model="lineForm.pName" placeholder="产品名称" :disabled="true"></el-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="产品简称:">
                    <el-input v-model="lineForm.pShortName" placeholder="产品简称" :disabled="true"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="所属品牌:" placeholder="请选择所属品牌">
                    <el-select v-model="lineForm.pBrand" class="all" :disabled="true">
                      <el-option :key="brand.id" v-for="brand in brandList" :label="brand.bName" :value="brand.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="产品类型:" placeholder="请选择产品类型">
                    <el-select v-model="lineForm.pType" class="all" @change="productTypeChange" :disabled="true">
                      <el-option v-for="(value,key) in productType" :key="key" :label="value" :value="key">
                      </el-option>

                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系人:">
                    <el-select v-model="lineForm.pContacts" class="all" :disabled="true">
                      <el-option :key="person.puserId" :label="person.uRealName" v-for="person in peopleList"
                                 :value="person.userId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="产品排序:">
                    <el-input v-model="lineForm.pSort" type="number" placeholder="产品排序" :disabled="true"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系方式:">
                    <el-row :gutter="10">
                      <el-col :span="10">
                        <el-input data="pQq" v-model="lineForm.pQq" placeholder="qq" :disabled="true"></el-input>
                      </el-col>
                      <el-col :span="10">
                        <el-input v-model="lineForm.pPhone" placeholder="tel" :disabled="true"></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="cover">
                <el-upload class="upload-demo" drag multiple :action='action' :data="fileType" :show-file-list="false"
                           :disabled="true">
                  <img :src="lineForm.cover" v-if="lineForm.cover"/>
                  <div v-else>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将封面拖到此处，或
                      <em>点击上传</em>
                    </div>
                  </div>
                  <div class="el-upload__tip tc" slot="tip">建议尺寸:最小(550*350)，一般(715*455)，大小:不超过(5M)</div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="线路特色:">
              <jdy-editor :content="lineForm.pSpecial" attr="pSpecial" @input="editorUpdate"></jdy-editor>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="费用包含:">
              <jdy-editor :content="lineForm.pCostInclude" attr="pCostInclude" @input="editorUpdate"></jdy-editor>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="费用不包含:">
              <jdy-editor :content="lineForm.pCostExclude" attr="pCostExclude" @input="editorUpdate"></jdy-editor>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="预订须知:">
              <jdy-editor :content="lineForm.pNotes" attr="pNotes" @input="editorUpdate"></jdy-editor>
            </el-form-item>
          </el-row>
          <el-row :gutter="20" v-if="lineForm.pType==20">
            <el-form-item label="签证信息:">
              <jdy-editor :content="lineForm.pVisa" attr="pVisa" @input="editorUpdate"></jdy-editor>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import jdyEditor from '@/components/Quilleditor';
  import ElFormItem from "../../../../node_modules/element-ui/packages/form/src/form-item";

  export default {
    name: 'line',
    data() {
      return {
        fileType: {fileType: "jpg"},
        action: '/common/file/upload',
        productType: {
//        "0": "全部类型",
          10: "周边短线",
          11: "国内长线",
          20: "出境旅游",
          30: "邮轮",
          40: "特色游",
          50: "自助游",
          67: "单一资源+拍"
        },
        modifyAttr: {},
        copyLineForm:null,
        brandList: [], //品牌列表
        peopleList: [], //联系人列表
        lineForm: {
          companyId: JSON.parse(sessionStorage.loginData).uCompanyId,// 公司编号 ,
          cover: null,//产品封面url,save必填 ,
          pBrand: null,//产品品牌编号,save、update必填 ,
          pConfirm: null,// 产品确认状态,可选值 ,
          pContacts: null,// 产品联系人编号,save、update必填，大小范围 ,
          pCostExclude: null,// 费用不包含 ,
          pCostInclude: null,// 费用包含 ,
          pName: null,// 产品名称,save、update必填，长度限制 = ['1-50'],
          pNo: null,// 产品编号,save、update必填，长度限制 = ['1-20'],
          pNotes: null,// 预订须知 ,
          pPhone: null,// 产品联系人手机号,save、update必填，数字长度范围 = ['8-20'],
          pQq: null,// 产品联系人qq,save、update必填，数字长度范围5-20位 ,
          pRecommend: null,// 产品推荐状态,可选值 推荐 0:不推荐 1:推荐普通 2:推荐精选 ,
          pShortName: null,// 产品简称,save、update必填，长度限制 ,
          pSort: null, //产品排序
          pSpecial: null,// 线路特色 ,
          pStatus: null,//
          pType: null,// 产品类型编号,save、update必填，可选值 = ['10', '11', '20', '30', '40', '50'],
          pVisa: null,// 签证信息
          puserId: JSON.parse(sessionStorage.loginData).userId,
        }
      }
    },

    computed: {},
    methods: {
      //获取联系人列表
      queryUserList(companyId){
        this.$http.post(api_prefix + '/user/list', {"uCompanyId": companyId}).then(rsp => {
          if (rsp.body.code == 0) {
            this.peopleList = rsp.body.body.list;
          } else {
            this.defalutErrorMessage(rsp.body.message);
          }
        }, rsp => {
          this.defalutErrorMessage();
        });
      },
      //获取品牌
      queryBrandList(companyId){
        this.$http.post(api_prefix + '/brand/list', {"bCompanyId": companyId}).then(rsp => {
          if (rsp.body.code == 0) {
            this.brandList = rsp.body.body.resultList;
          } else {
            this.defalutErrorMessage(rsp.body.message);
          }
        }, rsp => {
          this.defalutErrorMessage();
        });
      },

      productTypeChange(value){
        this.lineForm.pType = value.toString();
      },

      onSubmit() {
        let formDate = Object.assign(this.copyLineForm,this.modifyAttr,{line:null,lineType:1,tcEndDay:this.$route.query.tcEndDay,tcStartDay :this.$route.query.tcStartDay});
        this.$http.post(api_prefix + '/product/update', formDate).then(response => {
          if (response.body.code == 0) {
            this.$message.success("保存成功");
          } else {
            this.defalutErrorMessage(response.body.message);
          }
        }, response => {
          this.defalutErrorMessage();
        });
      },
      goback(){
        this.$confirm('数据未保存，是否关闭？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          location.href = '/transfer.html#/list'
        }).catch(() => {

        });
      },
      editorUpdate(value, attr) {
        this.modifyAttr[attr] = value;
      },
      defaultProcut(pdtid){
        this.loadDefaultLineInfo(pdtid,1,(lineForm)=>{ //先尝试加载补充行程的线路信息
          console.log(lineForm.line);
          if(lineForm.line){              //判断是否已经存在线路信息
          lineForm.cover = lineForm.attach;
          Object.assign(lineForm,lineForm.line)            //补充行程的线路信息只修改五个特性，这里进行覆盖
          this.lineForm = lineForm;
            for(let p in lineForm){
              if(lineForm[p] == ''){
                lineForm[p] = null;
              }
            }
            this.copyLineForm = JSON.parse(JSON.stringify(this.lineForm));
          }else{                      //如果没有线路信息，加载默认行程信息，作为补充行程的线路信息
              this.loadDefaultLineInfo(pdtid,0,(lineForm)=>{
                lineForm.cover = lineForm.attach;
                let line = lineForm.line;
                delete line.id;
                lineForm.line = null;
                Object.assign(this.lineForm,lineForm,line);
                for(let p in lineForm){
                  if(lineForm[p] == ''){
                    lineForm[p] = null;
                  }
                }
                this.copyLineForm = JSON.parse(JSON.stringify(this.lineForm));
              })
          }
        });
      },
      loadDefaultLineInfo(pdtid,type,fun){
        this.$http.post(api_prefix + '/product/detail', {id: pdtid, lineType: type,tcEndDay:this.$route.query.tcEndDay,tcStartDay :this.$route.query.tcStartDay}).then(response => {
          if (response.body.code == 0) {
            let lineForm = response.data.body.body.product;
            fun && fun(lineForm)
          } else {
            this.defalutErrorMessage(response.body.message);
          }
        }, response => {
          this.defalutErrorMessage(response.body.message);
        });
      },
      defaultProductType(){  //加载默认产品类型
        this.$http.post(api_prefix + '/product/get_product_type').then(rsp => {
          if (rsp.body.code == 0) {
            this.productType = rsp.body.body;
          } else {
            this.defalutErrorMessage(rsp.body.message);
          }
        }, rsp => {
          this.defalutErrorMessage();
        });
      },
      defalutErrorMessage(message){ //失败提示
        if (message) {
          this.$alert(message, "温馨提示", {type: "error"});
        } else {
          this.$alert("网络出错了~", "温馨提示", {type: "error"});
        }
      }
    },
    components: {
      ElFormItem,
      jdyEditor
    },
    created()
    {
      this.queryBrandList(JSON.parse(sessionStorage.loginData).uCompanyId);
      this.queryUserList(JSON.parse(sessionStorage.loginData).uCompanyId);
      if (this.$route.query.id) {
        this.defaultProcut(this.$route.query.id);
      }else{
        this.$alert("请返回产品列表选择产品后操作！","温馨提示",{type:"error"});
      }
      //获取产品类型
      this.defaultProductType();
    }
  }
</script>
