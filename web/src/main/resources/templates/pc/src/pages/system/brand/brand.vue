<template>
    <div class="jl-information">
        <div class="jdy-content jdy-transfer fleft noborder jl-recommend">
            <div class="jdy-content-inner-trip">
                <el-form :model="ruleForm" :inline="true" :rules="rules" ref="ruleForm" label-width="80px" class="mt15">
                    <el-row>
                        <el-form-item label="所属单位：" prop="type" label-width="90px" style="margin-left:10px;" v-if='uDataLimit == 3'>
                            <el-select v-model="ruleForm.bCompanyId" @change="changeID" clearable placeholder="请选择">
                                <el-option v-for="item in type" :key="item.id" :label="item.cName" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="快速搜索：" prop="quickSearch" label-width="100px">
                            <el-input placeholder="品牌名称" v-model="ruleForm.bName">
                            </el-input>
                        </el-form-item>
                        <el-button type="primary" @click="searchKeyWords" class="el-button btnbg el-button--primary">搜索</el-button>
                        <el-button type="primary" class="btnbg fr addBtn" @click="alertBrand">添加</el-button>
                        <el-button type="default" class="btnbg fr" @click="alertJournal">日志</el-button>
                        <el-button type="default" class="btnbg fr" @click="updatePage" v-loading.fullscreen.lock="fullscreenLoading">刷新</el-button>
                    </el-row>
                </el-form>
            </div>
            <div class="jdy-table">
                <el-table :data="tableData" border style="text-again: center" class="all" @row-click="rowclickHandler" highlight-current-row>
                    <el-table-column type='index' label="序号" width="65">
                    </el-table-column>
                    <el-table-column label="品牌名称">
                        <template scope="scope">
                            <span class="jl-noticeTitle" style="display: inline-block;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;margin-top: 8px;">{{scope.row.bName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="品牌LOGO" width="165">
                        <template scope="scope">
                            <img :src="scope.row.pOssName" alt="" style="width:100px;height:100px;margin-top:8px;">
                        </template>
                    </el-table-column>
                    <el-table-column label="是否显示" width="95">
                        <template scope="scope">
                            <el-switch v-model="scope.row.bStatus" :on-value="0" :off-value="1" @change='isShow(scope.row)' on-color="#71dc1c" on-text="显示" off-text="不显示" :width='75'>
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="所属单位" width="200">
                        <template scope="scope">
                            <span>{{scope.row.companyName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="添加人" width="105">
                        <template scope="scope">
                            <span>{{scope.row.createUserName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="添加时间" width="150">
                        <template scope="scope">
                            <span>{{scope.row.createTime | createTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="排序" width="65">
                        <template scope="scope">
                            <span>{{scope.row.bSort}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template scope="scope">
                            <el-button type="default" size="mini" @click="editBrand(scope.row)">编辑
                            </el-button>
                            <el-button type="default" size="mini" @click="deleteInfor(scope.row.id,scope.row.bCompanyId)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页   begin-->
                <div class="clearfix">
                    <el-pagination class="fright mt20" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSizeAll" layout="prev, pager, next, jumper" :total="tableDataTotal">
                    </el-pagination>
                </div>
                <!-- 分页   end-->
            </div>
        </div>
        <!--jdy-content end-->
        <jdy-alert title="新增/编辑品牌" v-if="alertBrandFlag" @closeAlert="alertBrand" class="alertJournal alertBrand">
            <el-form ref="brandFrom" :model="brandFrom" label-width="100px" style="padding:15px" :rules="rules">
                <el-form-item label="所属单位：" style="margin-left:10px;" v-if='uDataLimit == 3'>
                    <el-select v-model="brandFrom.bCompanyId" clearable placeholder="请选择">
                        <el-option v-for="item in type" :key="item.id" :label="item.cName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品牌名称：" prop="bName" style="margin-left:10px;" :width="400">
                    <el-input v-model="brandFrom.bName" placeholder="请输入品牌名称" :maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="排序：" prop="bSort" style="margin-left:10px;">
                    <el-input type='number' min='0' v-model.number="brandFrom.bSort" placeholder="请输入数字"></el-input>
                </el-form-item>
                <el-form-item label="上传LOGO：" style="margin-left:10px;">
                    <div class="mt10 clearfix">
                        <div class="jl-localPic">
                            <label for="fileUpload">
                                <div class="el-upload el-upload--picture-card">
                                    <input type="file" name="file" id="fileUpload" class="el-upload__input" v-on:change="changecover($event)">
                                    <i class="el-icon-plus"></i>
                                </div>
                            </label>
                        </div>
                        <div class="jl-upLoadPic">
                            <img :src="brandFrom.pOssName" class="ifImg" v-show="brandFrom.pOssName">
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="是否显示：" prop="bStatus " style="margin-left:10px;">
                    <el-radio-group v-model="brandFrom.bStatus ">
                        <template scope="scope">
                            <el-radio :label="0">显示</el-radio>
                            <el-radio :label="1">不显示</el-radio>
                        </template>
                    </el-radio-group>
                </el-form-item>
                <el-button type="primary" class="fr ml20 mt20" @click="saveNotice('brandFrom')" style="margin-left: 10px;margin-bottom:40px;" :disabled="btnFlag">保存</el-button>
            </el-form>
        </jdy-alert>
        <!--系统日志查看 弹窗  begin-->
        <jdy-alert title="系统日志查看" v-if="alertJournalFlag" @closeAlert="alertJournal" class="alertJournal">
            <jdy-log :alertJournalFlag="alertJournalFlag" :journalCurrentData="journalCurrentData" :journalTotal="journalTotal" :pid="pid" :module="module" @listenToChildEvent="alertJournal"></jdy-log>
        </jdy-alert>
        <!--系统日志查看 弹窗  begin-->
    </div>
</template>

<script>
import jdyAlert from "@/components/Alert";
import jdyLog from "@/components/Log";
export default {
  components: {
    jdyAlert,
    jdyLog
  },
  name: "information",
  data() {
    return {
      currentId: "", //当前数据的id
      alertJournalFlag: false,
      alertBrandFlag: false,
      currentPage: 1, //列表当前所在页,
      pageSizeAll: 20,
      ruleForm: {
        bCompanyId: "",
        bName: "",
        bSort: "",
        pOssName: "",
        // bStatus: 0,
        bDel:0,
        currPage: 1,
        pageSize: 20,
      },
      rules: {
        bName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        bSort: [
          { required: true, message: "请输入数字" },
          { type: "number", message: "排序必须为数字值" }
        ]
      },
      type: [],
      tableData: [],
      fullscreenLoading: false,
      tableDataTotal: 0,
      getType: 0,
      //日志相关参数
      pid: null,
      module: "brand",
      journalTotal: 0,
      journalCurrentData: [], //日志数据
      getCid: null,
      brandFrom: {
        bCompanyId: "",
        bName: "",
        bSort: "",
        pOssName: "",
        bStatus: 0,
      },
      isAddBrand: false,
      companyType: null,
      btnFlag: false,
      uDataLimit:''
    };
  },
  filters: {
    createTime: function(value) {
      console.log(1);
      var unixTimestamp = new Date(value);
      var oYear = unixTimestamp.getFullYear();
      var oMonth = unixTimestamp.getMonth() + 1;
      var oDay = unixTimestamp.getDate();
      var oHour = unixTimestamp.getHours();
      var oMin = unixTimestamp.getMinutes();
      var oSen = unixTimestamp.getSeconds();
      var oTime =
        oYear +
        "-" +
        getzf(oMonth) +
        "-" +
        getzf(oDay) +
        " " +
        getzf(oHour) +
        ":" +
        getzf(oMin) +
        ":" +
        getzf(oSen); //最后拼接时间
      //补0操作
      function getzf(num) {
        if (parseInt(num) < 10) {
          num = "0" + num;
        }
        return num;
      }
      return (value = oTime.substr(0, 10));
    }
  },
  mounted() {
    //初始化公司列表
    let logindata = JSON.parse(sessionStorage.loginData);
    // this.getCid = logindata.uCompanyId
    this.uDataLimit = logindata.uDataLimit;
    this.brandFrom.bCompanyId = logindata.uCompanyId;
    this.ruleForm.bCompanyId = logindata.uCompanyId;
    console.log(this.brandFrom.bCompanyId,'this.brandFrom.bCompanyId')
    this.$http
      .post(
        api_prefix + "/Company/index?pageIndex=1",
        {
        //   fastSearchStr: logindata.cName
        },
        { emulateJSON: true }
      )
      .then(
        response => {
          this.type = response.body.body.list;
        },
        response => {
          console.log("出错了");
        }
      );
    this.getTableData();
    console.log(this.brandFrom, "brandFrom");
  },
  methods: {
    changeID(value) {
      console.log(value, "cID");
    },

    getTableData(opt) {
      //更新table数据
      console.log(this.ruleForm,'this.ruleForm')
      this.$http
        .post(api_prefix + "/brand/list", this.ruleForm)
        .then(
          response => {
            let data = response.data.body;
            this.tableData = data.resultList;
            this.tableDataTotal = data.totalNum;
          },
          response => {
            console.log("出错了");
          }
        );
    },
    updatePage() {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
        this.$message({
          showClose: true,
          message: "刷新成功",
          type: "success"
        });
      }, 1000);
      this.getTableData();
    },
    //搜索公司列表
    searchCompanies: function(val) {
      if (!val) {
        this.ruleForm.bCompanyId = null;
      }
      this.type = null;
      this.$http
        .post(
          api_prefix + "/Company/index?pageIndex=1",
          {
            fastSearchStr: $.trim(val),
            pid:343 ,
            searchType:1
          },
          { emulateJSON: true }
        )
        .then(
          response => {
            this.type = response.body.body.list;
          },
          response => {
            console.log("出错了");
          }
        );
    },
    getKeyValue(value) {
      this.bName = value;
    },
    searchKeyWords() {
      this.getTableData();
    },
    changeType(value) {
      //类型
    //   this.getCid = value;
    console.log(value,'id')
    },
    changeCid(value) {
      this.getAddCid = value;
    },
    handleCurrentChange(val) {
      if (val) {
        this.ruleForm.currPage = val;
        this.getTableData();
      }
    },
    isShow(val) {
      console.log(val, "isShow");
      if (val.bStatus == 0) {
        val.bStatus = 1;
      } else {
        val.bStatus = 0;
      }
      this.$http.post(api_prefix + "/brand/update", val).then(
        response => {
          if (response.data.code != 0) {
            this.$alert(response.data.message);
          }
        },
        response => {
          console.log("出错了");
        }
      );
    },
    editBrand(item) {
      this.isAddBrand = false;
      console.log(item, "asjdfaksdjfhadsjko");
      this.brandFrom = item;
      this.alertBrandFlag = !this.alertBrandFlag;
      if (this.alertBrandFlag) {
        this.$nextTick(function() {
          jdyFn.setAlertStyle("alertJournal");
        });
      }
    },
    deleteInfor(id, cid) {
      this.$confirm("你确定要删除该内容？", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post(api_prefix + "/brand/delete", {
              bCompanyId: cid,
              id: id
            })
            .then(
              response => {
                this.fullscreenLoading = true;
                this.getTableData();
                setTimeout(() => {
                  this.fullscreenLoading = false;
                  this.$message({
                    showClose: true,
                    message: "删除成功",
                    type: "success"
                  });
                }, 1000);
              },
              response => {
                console.log("出错了");
              }
            );
        })
        .catch(() => {});
    },
    alertBrand() {
      this.isAddBrand = true;
      this.brandFrom.id = "";
      this.brandFrom.bName = "";
      this.brandFrom.bSort = "";
      this.brandFrom.pOssName = "";
      this.brandFrom.bStatus = 0;
      this.alertBrandFlag = !this.alertBrandFlag;
      if (this.alertBrandFlag) {
        this.$nextTick(function() {
          jdyFn.setAlertStyle("alertJournal");
        });
      }
    },
    changecover($event) {
      console.log($event);
      var files = event.currentTarget.files || event.dataTransfer.files;
      var fileSize = files[0].size / 1024;
      var fileType = files[0].type.startsWith("image/");
      console.log(fileSize, "fileSize");
      for (let i = 0; i < files.length; i++) {
        if (!fileType) {
          this.$alert("请选择图片上传！", "温馨提示", {
            confirmButtonText: "确定",
            callback: action => {}
          });
        } else if (fileSize > 5120) {
          this.$alert("图片大小不能超过5M！", "温馨提示", {
            confirmButtonText: "确定",
            callback: action => {}
          });
        } else {
          this.createImage(files[i]);
        }
      }
      event.currentTarget.value = "";
    },
    createImage(file) {
      let formData = new FormData();
      formData.append("fileType", "jpg");
      formData.append("file", file);
      this.$http
        .post(api_prefix + "/common/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          console.log(res);
          console.log(this.brandFrom.pOssName, "this.brandFrom.pOssName1");
          let picUrl = res.body.body.key;
          this.brandFrom.pOssName = picUrl;
          console.log(this.brandFrom.pOssName, "this.brandFrom.pOssName2");
        });
    },
    saveNotice(formName) {
      //点击保存
      this.btnFlag = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isAddBrand) {
            // if (!this.brandFrom.bCompanyId) {
            //   this.brandFrom.bCompanyId = '0';
            // }
            this.$http.post(api_prefix + "/brand/save", this.brandFrom).then(
              response => {
                if (response.data.code == 0) {
                  this.alertBrandFlag = false;
                  $(".alertbgg").remove();
                  this.getTableData();
                  this.$message({
                    showClose: true,
                    message: "保存成功",
                    type: "success"
                  });
                } else {
                  this.$alert(response.data.message, "温馨提示", {
                    confirmButtonText: "确定",
                    callback: action => {}
                  });
                }
                this.btnFlag = false;
              },
              response => {
                console.log("出错了");
                this.btnFlag = false;
              }
            );
          } else {
            this.$http.post(api_prefix + "/brand/update", this.brandFrom).then(
              response => {
                if (response.data.code == 0) {
                  this.alertBrandFlag = false;
                  $(".alertbgg").remove();
                  this.getTableData();
                  this.$message({
                    showClose: true,
                    message: "编辑成功",
                    type: "success"
                  });
                } else {
                  this.$alert(response.data.message, "温馨提示", {
                    confirmButtonText: "确定",
                    callback: action => {}
                  });
                }
                this.btnFlag = false;
              },
              response => {
                console.log("出错了");
                this.btnFlag = false;
              }
            );
          }
        } else {
          this.$message.error("提交失败了");
          this.btnFlag = false;
        }
      });
    },
    //----------日志相关逻辑 start-----
    //关闭,打开日志弹窗
    alertJournal(alertJournalFlag) {
      if (!this.pid) {
        this.$alert("请选择产品");
        return;
      }
      this.alertJournalFlag = !this.alertJournalFlag;
      if (this.alertJournalFlag) {
        this.$nextTick(function() {
          jdyFn.setAlertStyle("alertJournal");
        });
      }
    },
    //获取日志数据
    getLogData(index) {
      this.$http
        .post(
          api_prefix +
            "/logs/selectLogs?pageIndex=" +
            index +
            "&module=" +
            this.module +
            "&pid=" +
            this.pid
        )
        .then(
          response => {
            let _self = this;
            this.journalTotal = response.data.body.total;
            this.journalCurrentData = [];
            response.data.body.list.forEach(function(value) {
              _self.journalCurrentData.push(value);
            });
            // this.journalCurrentData=response.data.body.list
          },
          response => {
            console.log("获取日志出错了");
          }
        );
    },
    //table行点击事件
    rowclickHandler(row, event, column) {
      this.pid = row.id;
      if (!this.companyId) {
        this.companyId = row.companyId;
      }
      this.getLogData(1);
    }
    //----------日志相关逻辑 end-----
  }
};
</script>

