<template>
  <div class="jl-addnotice jl-information">
    <div class="jdy-content jdy-transfer fleft jl-ad">
      <div class="jdy-content-inner-trip">
        <div class="jdy-tab">
            <el-button @click="addInfoRouter" type="default" class="btnbg fr mt10">返回</el-button>
            <el-button @click="save('ruleForm')" type="primary" :disabled="btnFlag" class="btnbg fr mt10">保存</el-button>
        </div>
        <div class="mt30"></div>
        <div style="min-height:600px;padding-top:30px" class="jl-addnoticeWrap">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="mt30">
            <el-row>
              <el-col :span="24">
                  <el-form-item label="表单名称：" prop="mName">
                    <el-input v-model="ruleForm.mName" placeholder="请输入表单名称"></el-input>
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                  <el-form-item label="class名：" prop="mEnName">
                    <el-input v-model="ruleForm.mEnName" placeholder="请输入class名"></el-input>
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                  <el-form-item label="模块类型：" prop="mType">
                    <el-select v-model="ruleForm.mType" placeholder="请选择菜单类型" size='200'>
                      <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value">
                        <div @click="changeFirstList(item.value)">{{item.label}}</div>
                      </el-option>
                    </el-select>
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                  <el-form-item label="上级菜单：" prop="mPid">
                    <el-select v-model="ruleForm.mPid" placeholder="请选择上级菜单" size='200'>
                      <el-option v-for="item in topTypeList" :key="item.id" :label="item.mName" :value="item.id" v-if="ruleForm.mType != 0">
                      </el-option>
                      <el-option v-for="item in pidType" :key="item.value" :label="item.label" :value="item.value" v-if="ruleForm.mType == 0">
                      </el-option>
                    </el-select>
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                  <el-form-item label="排序：" prop="mSort">
                    <el-input v-model="ruleForm.mSort" placeholder="请输入排序"></el-input>
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                  <el-form-item label="菜单url：" prop="mUrl">
                    <el-input v-model="ruleForm.mUrl" placeholder="请输入菜单url"></el-input>
                  </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>
    <!--jdy-content end-->
  </div>
</template>

<script>
import jdyAlert from "@/components/Alert";
export default {
  components: {
    jdyAlert
  },
  name: "information",
  data() {
    return {
      menuId: "",
      ruleForm: {
        id: null,
        mMode: "",
        mUrl: "",
        mType: 0,
        mSort: "1",
        mPid: '',
        mEnName: "",
        mName: ""
      },
      topTypeList: [],
      pidType: [
        {
          value: 0,
          label: "顶级模块"
        },
      ],
      type: [
        {
          value: 0,
          label: "一级菜单"
        },
        {
          value: 1,
          label: "二级菜单"
        },
        {
          value: 2,
          label: "三级菜单"
        },
        {
          value: 3,
          label: "选项卡"
        },
        {
          value: 4,
          label: "按钮"
        },
        {
          value: 5,
          label: "链接"
        }
      ],
      rules: {
        mName: [{ required: true, message: "请输入模块名称", trigger: "blur" }],
        mEnName: [{ required: true, message: "请输入class名", trigger: "blur" }],
        mUrl: [{ required: true, message: "请输入菜单url", trigger: "blur" }]
      },
      btnFlag:false,
    };
  },
  mounted() {
      if (this.$route.query.isAdd == true) {
        this.menuId = null;
      } else if (this.$route.query.isAdd == false) {
        this.menuId = null;
        this.getTableData();
      }
  },
  methods: {
    changeFirstList(value){
      console.log(value)
      if(value != 0){
        console.log('不是一级菜单')
        
        this.getFirstList(value);
        console.log(this.ruleForm.mType,'this.ruleForm.mType')
        // this.ruleForm.mPid = '';
      }else{
        console.log('一级菜单')
        this.topTypeList = [];
        this.ruleForm.mPid = 0;
      }
    },
    getFirstList(val) {
      console.log(this.ruleForm.mType,'this.ruleForm.mType2')
      this.$http
        .post(api_prefix + "/module/list", {
          id: this.menuId,
          mType: val
        })
        .then(
          response => {
            console.log(this.ruleForm.mType,'this.ruleForm.mType3')
            let data = response.data.body;
            this.topTypeList = data;
            if(data){
              this.ruleForm.mPid = data[0].id;
            }else{
              this.ruleForm.mPid = '';
            }
          },
          response => {
            console.log("出错了");
          }
        );
    },
    getTableData() {
      //更新table数据
      this.$http.get(api_prefix + "/module/get/" + this.$route.query.id).then(
        response => {
          let data = response.data.body;
          this.topTypeList = data.list
          this.ruleForm = data.module;
          console.log(this.ruleForm.mPid,'this.ruleForm.mPid2')
          console.log(this.ruleForm.mType,'this.ruleForm.mType2')
        },
        response => {
          console.log("出错了");
        }
      );
    },
    addInfoRouter() {
      this.$router.push({ path: "/module" });
    },
    save(formName) {
      this.btnFlag=true;
      this.$refs[formName].validate(valid => {
        if (valid) {
        if (this.$route.query.isAdd == true) {
          let url = "module/save";
          this.$http.post(api_prefix + url, this.ruleForm).then(
            response => {
              if (response.data.code == 0) {
                this.$message({
                  showClose: true,
                  message: "保存成功",
                  type: "success"
                });
                setTimeout(() => {
                  this.btnFlag=false;                  
                  this.$router.push({ path: "/module" });
                }, 500);
              } else {
                this.$alert(response.data.message, "友情提示", {
                  confirmButtonText: "确定",
                  callback: action => {}
                });
                this.btnFlag=false;
              }
            },
            response => {
              console.log("出错了");
              this.btnFlag=false;
            }
          );
        } else if (this.$route.query.isAdd == false) {
          let url = "module/update";
          this.$http.post(api_prefix + url, this.ruleForm).then(
            response => {
              if (response.data.code == 0) {
                this.$message({
                  showClose: true,
                  message: "保存成功",
                  type: "success"
                });
                setTimeout(() => {
                  this.btnFlag=false;
                  this.$router.push({ path: "/module" });
                }, 500);
              } else {
                this.btnFlag=false;
                this.$alert(response.data.message, "友情提示", {
                  confirmButtonText: "确定",
                  callback: action => {}
                });
              }
            },
            response => {
              console.log("出错了");
              this.btnFlag=false;
            }
          );
        }
        }else{
          this.$message.error("保存失败");
          this.btnFlag=false;
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.gz-itemMragin {
  margin-top: 10px;
}

.gz-Bg {
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  z-index: 99;
}

.alertAddProduct {
  left: 0px;
  right: 0px;
  margin: auto;
}

.gz-smallWidth {
  width: 122px;
}

.gz-largeWidth {
  width: 300px;
}

.jdy-content {
  min-height: initial;
  padding: 10px;
  box-sizing: border-box;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

