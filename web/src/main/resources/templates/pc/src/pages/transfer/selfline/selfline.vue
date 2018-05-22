<template>
  <div class="jdy-content jdy-transfer jl-selfLine fleft">
    <div class="jdy-content-inner">
      <el-row class="jdy-content-inner-trip">
          <el-button class="fright mt10 btnInTab" @click="goback" style="margin-right:-10px;margin-left:20px;">返回</el-button>
          <el-button @click="onSubmit('lineForm')" class="fright mt10 btnInTab" :disabled="btnFlag" v-if="this.$route.query.status != 3">提交</el-button>
          <el-button @click="onSave('lineForm')" class="fright mt10 mr10 btnInTab" :disabled="btnFlag" >保存</el-button>
      </el-row>
      <!--jdy-content-trip end-->
      <div class="h20 mt10"></div>
      <el-form class="" :model="lineForm" :rules="rules" ref="lineForm" label-width="100px">
        <el-row :gutter="20">
          <el-col>
            <el-row>
              <el-form-item label="标题：" prop="dpLineName" label-width="90px">
                <el-input v-model="lineForm.dpLineName" placeholder="标题"></el-input>
              </el-form-item>
            </el-row>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="订单报价：" prop="dpOrderAmount">
            <jdy-editor :content="lineForm.dpOrderAmount" attr="dpOrderAmount" @input="editorUpdate"></jdy-editor>
            <!-- <el-input v-model="lineForm.characteristic" type="textarea"></el-input> -->
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="最低成团：">
            <jdy-editor :content="lineForm.dpMinClusteringNum" attr="dpMinClusteringNum" @input="editorUpdate"></jdy-editor>
            <!-- <el-input v-model="lineForm.characteristic" type="textarea"></el-input> -->
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="核心景点：">
            <jdy-editor :content="lineForm.dpCoreScenic" attr="dpCoreScenic" @input="editorUpdate"></jdy-editor>
            <!-- <el-input v-model="lineForm.characteristic" type="textarea"></el-input> -->
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="住宿标准：">
            <jdy-editor :content="lineForm.dpStandardAccommodation" attr="dpStandardAccommodation" @input="editorUpdate"></jdy-editor>
            <!-- <el-input v-model="lineForm.characteristic" type="textarea"></el-input> -->
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import jdyEditor from "@/components/Quilleditor";
import ElFormItem from "../../../../node_modules/element-ui/packages/form/src/form-item";
import ElInputNumber from "../../../../node_modules/element-ui/packages/input-number/src/input-number";
export default {
  name: "line",
  data() {
    return {
      btnFlag: false,
      lineForm: {
        designId: this.$route.query.designId,//定制ID
        dpCoreScenic: null,
        dpLineName: null,
        dpMinClusteringNum: null,
        dpOrderAmount: null,
        dpStandardAccommodation: null,
        operationType: 0,
        rId: this.$route.query.rId, //需求ID
        id: this.$route.query.id///方案ID
      },
      rules: {
        dpLineNo: [
          { required: true, message: "请输入产品编号", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字", trigger: "blur" }
        ],
        dpLineName: [
          { required: true, message: "请输入产品名称", trigger: "blur" },
          { min: 1, max: 50, message: "长度在 1 到 50 个字", trigger: "blur" }
        ],
        dpSubheading: [
          { min: 1, max: 20, message: "长度在 1 到 20 个字", trigger: "blur" }
        ],
        dpLineType: [
          {
            required: true,
            message: "请选择线路类型",
            trigger: "change",
            type: "number"
          }
        ],
        dpType: [
          {
            required: true,
            message: "请选择产品业务分类",
            trigger: "change",
            type: "number"
          }
        ],
        dpBrand: [
          {
            type: "number",
            required: true,
            message: "请输入品牌",
            trigger: "change"
          }
        ],
        dpPageUrl: [{ required: true, message: "请上传封面", trigger: "change" }]
      }
    };
  },
  methods: {
    //定制游
    editorUpdate(value, attr) {
      this.lineForm[attr] = value;
    },
    getSelfLineDetail(){
      this.btnFlag = true;
      this.$http
        .post(api_prefix + "require/queryProjectDetail",{
          projectId: this.$route.query.id,
          edit: true
        })
        .then(
          response => {
            if (response.body.code == 200) {
              this.btnFlag = false;
              this.lineForm.dpCoreScenic = response.body.body.dpCoreScenic;
              this.lineForm.dpLineName = response.body.body.dpLineName;
              this.lineForm.dpMinClusteringNum = response.body.body.dpMinClusteringNum;
              this.lineForm.dpOrderAmount = response.body.body.dpOrderAmount;
              this.lineForm.dpStandardAccommodation = response.body.body.dpStandardAccommodation;
            } else {
              this.btnFlag = false;
              this.defalutErrorMessage(response.body.message);
            }
          },
          response => {
            this.defalutErrorMessage();
          }
        );
    },
    //
    onSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.lineForm.operationType = 0;
          console.log("保存", this.lineForm);
          if (this.lineForm.dpLineName) {
            this.lineForm.dpLineName = $.trim(this.lineForm.dpLineName);
          }
          this.btnFlag = true;
          if(this.pid){
            this.lineForm.id = this.pid
          }
          this.$http
            .post(api_prefix + "/require/project/save", this.lineForm)
            .then(
              response => {
                if (response.body.code == 0) {
                  this.btnFlag = false;
                  console.log(response.body.id[0],'ooooo')
                  this.pid = response.body.id[0]
                  console.log(this.pid,'pid')
                  this.$message.success("保存到草稿箱成功");
                } else {
                  this.btnFlag = false;
                  this.defalutErrorMessage(response.body.message);
                }
              },
              response => {
                this.defalutErrorMessage();
              }
            );
        } else {
          this.$message.error("保存失败");
          return false;
        }
      });
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.lineForm.operationType = 1;
          console.log("提交", this.lineForm);
          if (this.lineForm.dpLineName) {
            this.lineForm.dpLineName = $.trim(this.lineForm.dpLineName);
          }
          this.btnFlag = true;
          if(this.pid){
            this.lineForm.id = this.pid
          }
          this.$http
            .post(api_prefix + "/require/project/save", this.lineForm)
            .then(
              response => {
                if (response.body.code == 0) {
                  this.btnFlag = false;
                  this.$message.success("提交成功");
                  setTimeout(() => {
                    this.$router.push({name:'selfTravelList'})
                  }, 200)
                } else {
                  this.btnFlag = false;
                  this.defalutErrorMessage(response.body.message);
                }
              },
              response => {
                this.defalutErrorMessage();
              }
            );
        } else {
          this.$message.error("保存失败");
          return false;
        }
      });
    },
    goback() {
      this.$router.push({name:'selfTravelList'})
    },
    defalutErrorMessage(message) {
      //失败提示
      if (message) {
        this.$alert(message, "温馨提示", { type: "error" });
      } else {
        this.$alert("网络出错了~", "温馨提示", { type: "error" });
      }
    }
  },
  components: {
    ElInputNumber,
    ElFormItem,
    jdyEditor
  },
  mounted() {
    console.log("登录", JSON.parse(sessionStorage.loginData));
    if(this.$route.query.id){
      this.getSelfLineDetail()
    }
  }
};
</script>

