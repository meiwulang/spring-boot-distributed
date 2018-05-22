<template>
  <div class="jl-information jl-onlinebill">
    <div class="jdy-content jdy-transfer fleft jl-ad">
      <div class="jdy-content-inner-trip">
        <div class="jdy-tab">
          <a href="javascript:;" title="" @click="jdytab(null)" :class="{ active: jdytabActive==null }">全部
            <span></span>
          </a>
          <a href="javascript:;" title="" @click="jdytab(0)" :class="{ active: jdytabActive==0 }">未提交
            <span></span>
          </a>
          <a href="javascript:;" title="" @click="jdytab(1)" :class="{ active: jdytabActive==1 }">已提交
            <span></span>
          </a>
          <a href="javascript:;" title="" @click="jdytab(4)" :class="{ active: jdytabActive==4 }">销售中
            <span></span>
          </a>
          <el-button type="default" class="fr mt10 mr10 btnInTab" @click="refreshBtn">
            刷新
          </el-button>          
        </div>
        <div class="jdy-searchPart">
          <el-form :model="ruleForm" :inline="true" ref="ruleForm" label-width="100px">
              <el-row style="width: 100%;">
                  <el-form-item>
                    <el-button type="primary" icon="plus" @click="addTicket">创建门票</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-select v-model="ruleForm.admissionType" clearable placeholder="请选择门票类型" style="width: 100%;">
                      <el-option :key="value.id" v-for="value in ticketList" :label="value.tName" :value="value.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="" label-width="100px">
                    <el-input placeholder="请输入产品名称、产品编号" v-model.trim="ruleForm.searchString" class=""></el-input>
                  </el-form-item>
                  <el-button type="primary" @click="firstSearch" class="btnInTab">搜索</el-button>
              </el-row>
          </el-form>
        </div>
      </div>
      <div class="jdy-table p10">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="序号" type="index">
          </el-table-column>
          <el-table-column label="门票编号" min-width="150px">
              <template scope="scope">
                  <span class="jl-noticeTitle">{{scope.row.ticketProductCode}}</span>
              </template>
          </el-table-column>
          <el-table-column label="门票名称" min-width="350px">
            <template scope="scope">
              <div style="text-align:left;padding:10px 0 10px 30px;">
              <span>{{scope.row.ticketProductName}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="门票类型" min-width="150px">
            <template scope="scope">
              <span class="jl-noticeTitle" v-if="scope.row.ticketProductType == 1">成人票</span>
              <span class="jl-noticeTitle" v-if="scope.row.ticketProductType == 0">儿童票</span>
            </template>
          </el-table-column>
          <el-table-column label="产品经理" min-width="150px">
            <template scope="scope">
              <span class="jl-noticeTitle">{{scope.row.productManagerName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="150px">
            <template scope="scope">
              <span class="jl-noticeTitle" v-if="scope.row.admissionStatus == 4">销售中</span>
              <span class="jl-noticeTitle" v-if="scope.row.admissionStatus == 1">已提交</span>
              <span class="jl-noticeTitle" v-if="scope.row.admissionStatus == 0">未提交</span>
              <span class="jl-noticeTitle" v-if="scope.row.admissionStatus == 2">已完成</span>
              <span class="jl-noticeTitle" v-if="scope.row.admissionStatus == 3">已入库</span>
            </template>
          </el-table-column>
          <el-table-column label="编辑时间" min-width="150px">
            <template scope="scope">
              <span class="jl-noticeTitle">{{scope.row.createrTime | dateFormat('time')}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template scope="scope">
              <el-button type="primary" :disabled="scope.row.admissionStatus >= 1" @click="declaration(scope.row.id)" size="mini">提交</el-button>
              <el-button type="primary" @click="editTicket(scope.row.id)" size="mini">编辑票信息</el-button>
              <el-button type="default" @click="deleteTicket(scope.row.id)" size="mini" class="red">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页   begin-->
        <div class="clearfix">
          <el-pagination class="fright pageMargin" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSizeAll" :total="tableDataTotal">
          </el-pagination>
        </div>
        <!-- 分页end-->        
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
      currentPage:1,
      pageSizeAll:20,
      tableDataTotal:0,
      tableData: [
        {
          ticketProductCode: 'SC20180305',
          ticketProductName: '雪乡梦幻家园门票',
          ticketProductType: 1,
          productManagerName: '李小鹏',
          admissionStatus: 1,
          createrTime: '2018-03-24 18:24',
        }
      ],
      fullscreenLoading: false, //默认关闭的loadding框
      jdytabActive: null,
      ruleForm: {
        admissionType:'',
        searchString: '',
        pageSize: 20,
        pageIndex : 1,
      },
      //门票类型
      ticketList:[
        {
          id: 1,
          tName: "成人票"
        },
        {
          id: 0,
          tName: "儿童票"
        }
      ],
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      //更新table数据
      this.$http
        .post(api_prefix + "/admission/base/list", this.ruleForm)
        .then(
          response => {
            let data = response.body.body;
            this.tableData = data.list;
            this.tableDataTotal = data.total;
          },
          response => {
            console.log("出错了");
          }
        );
    },
    jdytab(index) {
      this.jdytabActive = index;
      console.log(index, "index");
      if(index == null){
        this.ruleForm.status = null;
      }else{
        this.ruleForm.status = [index]
      }
      this.getTableData();
    },
    //currentPage 改变时会触发
    handleCurrentChange(val) {
      console.log(val, 'val')
      this.ruleForm.pageIndex = val;
      this.getTableData()
    },
    firstSearch(){
        this.getTableData();
    },
    //刷新页面
    refreshBtn() {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
        this.$message({
          showClose: true,
          message: "刷新成功",
          type: "success"
        });
        this.getTableData();
      }, 1000);
    },
    //申报
    declaration(id){
      this.$http.get(api_prefix + '/admission/base/commit/' + id).then(response => {
        if (response.data.code == 0) {
          this.$message({
            showClose: true,
            message: "提交成功",
            type: "success"
          });
          this.getTableData();
        } else {
          this.$alert(response.data.message,'温馨提示')
        }
      }, response => {
        console.log('出错了');
      });
    },
    addTicket(id){
      this.$router.push({ name:'ticketDeclarationInformation'})
    },
    //编辑票信息
    editTicket(id){
      this.$router.push({ name:'ticketDeclarationInformation',query:{id:id}})
    },
    //删除行
    deleteTicket(index) {
      //点击删除
      let url = api_prefix + "/admission/base/deleteAdmissionBase/" + index;
      this.$confirm("你确定要删除该门票？", "温馨提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.$http.get(url).then(
            response => {
              if (response.data.code == 0) {
                this.getTableData();
                setTimeout(() => {
                  this.$message({
                    showClose: true,
                    message: "删除成功",
                    type: "success"
                  });
                }, 500);
              } else {
                this.$alert(response.data.message);
              }
            },
            response => {
              console.log("出错了");
            }
          );
        })
        .catch(() => {});
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
  box-sizing: border-box;
}
.orderout{
  margin: 10px -10px 0 0;
}
</style>

