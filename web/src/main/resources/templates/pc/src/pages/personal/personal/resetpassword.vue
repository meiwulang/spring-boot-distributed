<template>
  <div id="userinfo" class="jl-information">
    <div class="jdy-content jdy-transfer fleft noborder">
      <div class="jdy-content-inner-trip">
        <div class="gz-userinfo">
          <el-form ref="form" label-width="100px" :model="fromData" :rules="rules">
            <div class="f16 mt22 c1f blod">个人信息</div>
            <div class="mt30"></div>
            <el-form-item label="登录名：" style="margin-bottom: 10px;width:400px">
              <el-input v-model="loginName" :disabled="true">
              </el-input>
            </el-form-item>
            <el-form-item label="真实姓名：" style="margin-bottom: 10px;width:400px">
              <el-input v-model="realName" :disabled="true">
              </el-input>
            </el-form-item>
            <!-- <el-form-item label="旧密码：" style="margin-bottom: 10px;width:400px">
              <el-input type="password" v-model="fromData.uPassword">
              </el-input>
            </el-form-item> -->
            <el-form-item label="新密码：" prop="newPassword" style="margin-bottom: 10px;width:400px">
              <el-input type="password" v-model="fromData.newPassword" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码：" prop="checkPass" style="margin-bottom: 10px;width:400px">
              <el-input type="password" v-model="fromData.checkPass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item style="margin-bottom: 10px;width:400px">
              <el-button @click="saveFun" class="fr" type="primary" v-loading.fullscreen.lock="fullscreenLoading">修改密码</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.fromData.checkPass !== '') {
          this.$refs.fromData.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.fromData.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      fromData: {
        newPassword: '',
        checkPass: '',
        uPassword: ''
      },
      loginName: this.$route.query.loginname,
      realName: this.$route.query.realname,
      id: this.$route.query.id,
      rules: {
        newPassword: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
  },
  mounted() {

  },
  methods: {
    saveFun() {
      if(this.fromData.newPassword === ''){
        this.$message({
            showClose: true,
            message: '请输入新密码',
            type: 'error'
          });
      }else{
        if(this.fromData.checkPass === ''){
          this.$message({
            showClose: true,
            message: '请再次输入新密码',
            type: 'error'
          });
        }else{
          if(this.fromData.newPassword != this.fromData.checkPass){
            this.$message({
              showClose: true,
              message: '两次输入密码不一致!',
              type: 'error'
            });
          }else{
            this.$http.post(api_prefix + '/user/newPass', {
              id: this.$route.query.id,
              newPassword: this.fromData.newPassword,
              uAccount: this.$route.query.loginname,
              uPassword: this.fromData.uPassword,
              uRealName: this.$route.query.realname
            }).then(response => {
              if (response.data.code == 0) {
                this.$message({
                  showClose: true,
                  message: '修改成功,请重新登录！',
                  type: 'success'
                });
                setTimeout(() => {
                  this.$router.push({name:'personalinfo'})
                }, 500);
              } else {
                this.$alert(response.data.message, '温馨提示', {
                  confirmButtonText: '确定',
                  callback: action => { }
                });
              }
            }, response => {
              console.log('出错了');
            });
          }
        }
      }
    }
  }
}
</script>
<style scoped>
.gz-userinfo {
  width: 84%;
  margin: 35px auto 0px;
  padding: 0 40px 25px 0;
  position: relative
}

.gz-userInfoTitle {
  position: absolute;
  width: 150px;
  left: 0px;
  right: 0px;
  top: -8px;
  background: #fff;
  margin: auto;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fontmain {
  padding: 0px 6px;
}

.leftline,
.rightline {
  width: 10px;
  height: 2px;
  background: #1f2d3d
}

.gz-Block {
  display: block;
}

.el-date-editor.el-input {
  width: 100%
}
</style>
