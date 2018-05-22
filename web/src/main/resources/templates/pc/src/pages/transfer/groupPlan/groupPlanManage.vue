<template>
  <div class="jl-information jl-onlinebill">
    <div class="jdy-content jdy-transfer fleft jl-ad">
      <div class="jdy-content-inner-trip">
        <div class="jdy-tab">
          <a href="javascript:;" title="" @click="jdytab(null)" :class="{ active: jdytabActive==null }">全部
            <span></span>
          </a>
          <a href="javascript:;" title="" @click="jdytab(1)" :class="{ active: jdytabActive==1 }">已预约
            <span></span>
          </a>
          <a href="javascript:;" title="" @click="jdytab(2)" :class="{ active: jdytabActive==2 }">已订购
            <span></span>
          </a>
          <el-button type="default" class="fr mt10 mr10 btnInTab" @click="changeHref">
            导出
          </el-button>          
        </div>
        <div class="jdy-searchPart">
          <el-form :model="ruleForm" :inline="true" ref="ruleForm" label-width="100px">
              <el-row style="width: 100%;">
                  <el-form-item label="单位名称：" prop="uCompanyId" v-show='uDataLimit == 3'>
                    <el-select v-model="ruleForm.companyId" clearable placeholder="请选择单位名称" style="width: 100%;">
                      <el-option :key="value.id" v-for="value in selectList" :label="value.cName" :value="value.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="" label-width="100px">
                      <el-date-picker v-model="ruleForm.dateRange" type="daterange" @change="datetimerange" placeholder="选择时间范围" style="width:100%;">
                      </el-date-picker>
                  </el-form-item>
                  <el-button type="primary" @click="firstSearch" class="btnInTab">搜索</el-button>
              </el-row>
          </el-form>
        </div>
      </div>
      <div class="jdy-table p10">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="线路编号">
              <template scope="scope">
                  <span class="jl-noticeTitle">{{scope.row.pNO}}</span>
              </template>
          </el-table-column>
          <el-table-column prop="aTitle" label="线路行程名称">
            <template scope="scope">
              <span class="jl-noticeTitle">{{scope.row.pName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="areaList" label="产品经理">
            <template scope="scope">
              <span class="jl-noticeTitle">{{scope.row.pManager}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="aEndTime" label="天数" width="100">
            <template scope="scope">
              <span>{{scope.row.pDays}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="aStatus" label="预约人数合计" v-if="jdytabActive != 2">
            <template scope="scope">
                <router-link :to="{ name:'groupSheet',query:{beginDate:ruleForm.beginDate,endDate:ruleForm.endDate,jdytabActive: 1,name:scope.row.pName,dateRange:ruleForm.dateRange,productId:scope.row.productId}}">
                    <span style="color:#20a0ff" v-if="scope.row.reserveNums">{{scope.row.reserveNums}}</span>
                </router-link>
                <span style="color:#20a0ff" v-if="!scope.row.reserveNums">0</span>
            </template>
          </el-table-column>
          <el-table-column prop="aStatus" label="订购人数合计" v-if="jdytabActive != 1">
            <template scope="scope">
                <router-link :to="{ name:'groupSheet',query:{beginDate:ruleForm.beginDate,endDate:ruleForm.endDate,jdytabActive: 2,name:scope.row.pName,dateRange:ruleForm.dateRange,productId:scope.row.productId}}">
                    <span style="color:#20a0ff" v-if="scope.row.payedNum">{{scope.row.payedNum}}</span>
                </router-link>
                <span style="color:#20a0ff" v-if="!scope.row.payedNum">0</span>
            </template>
          </el-table-column>
          <el-table-column prop="aStatus" label="人数合计" v-if="jdytabActive == null">
            <template scope="scope">
                <router-link :to="{ name:'groupSheet',query:{beginDate:ruleForm.beginDate,endDate:ruleForm.endDate,jdytabActive: 0,name:scope.row.pName,dateRange:ruleForm.dateRange,productId:scope.row.productId}}">
                    <span style="color:#20a0ff" v-if="scope.row.totalNums">{{scope.row.totalNums}}</span>
                </router-link>
                <span style="color:#20a0ff" v-if="!scope.row.totalNums">0</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="tableDataOne" border style="width: 100%;border-top:none" class="childBill">
          <el-table-column label="线路编号">
              <template scope="scope">本页合计：</template>
          </el-table-column>
          <el-table-column prop="aTitle" label="线路行程名称">
          </el-table-column>
          <el-table-column prop="areaList" label="产品经理">
          </el-table-column>
          <el-table-column prop="aEndTime" label="天数" width="100">
          </el-table-column>
          <el-table-column prop="aStatus" label="预约人数合计" v-if="jdytabActive != 2">
            <template scope="scope">
              <span>{{scope.row.pageReserve}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="aStatus" label="订购人数合计" v-if="jdytabActive != 1">
            <template scope="scope">
              <span>{{scope.row.pagePayed}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="aStatus" label="人数合计" v-if="jdytabActive == null">
            <template scope="scope">
              <span>{{scope.row.pageTotalNums}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="tableDataTwo" border style="width: 100%;border-top:none" class="childBill">
          <el-table-column label="线路编号">
              <template scope="scope">合计：</template>
          </el-table-column>
          <el-table-column prop="aTitle" label="线路行程名称">
          </el-table-column>
          <el-table-column prop="areaList" label="产品经理">
          </el-table-column>
          <el-table-column prop="aEndTime" label="天数" width="100">
          </el-table-column>
          <el-table-column prop="aStatus" label="预约人数合计" v-if="jdytabActive != 2">
            <template scope="scope">
              <span>{{scope.row.totalReserve}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="aStatus" label="订购人数合计" v-if="jdytabActive != 1">
            <template scope="scope">
              <span>{{scope.row.totalPayed}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="aStatus" label="人数合计" v-if="jdytabActive == null">
            <template scope="scope">
              <span>{{scope.row.totalNums}}</span>
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
      downLoadHref: '',
      currentPage:1,
      pageSizeAll:20,
      tableDataTotal:0,
      tableData: [],
      tableDataOne: [],
      tableDataTwo: [],
      firstMenuList: [],
      fullscreenLoading: false, //默认关闭的loadding框
      jdytabActive: null,
      menuId: null,
      flag:'',
      ruleForm: {
        dateRange: [new Date().setTime(new Date().getTime() + 3600 * 1000 * 24 * 1),new Date().setTime(new Date().getTime() + 3600 * 1000 * 24 * 16)],
        beginDate: dateChange(1),
        endDate: dateChange(16),
        pageSize: 20,
        currPage: 1,
        companyId: null
      },
      selectList:[],
      uDataLimit:''
    };
  },
  mounted() {
    let logindata = JSON.parse(sessionStorage.loginData);
    this.uDataLimit = logindata.uDataLimit;
    this.ruleForm.companyId = JSON.parse(sessionStorage.loginData).uCompanyId;
    this.getTableData();
    this.defaultSelectList();
  },
  methods: {
    changeHref(){
      if(this.jdytabActive == 1){
        this.flag = 0
      }
      if(this.jdytabActive == 2){
        this.flag = 1
      }
      if(this.jdytabActive == null){
        this.flag = ''
      }
      var id = this.$route.query.id
        this.downLoadHref = api_prefix + '/SchedulePlan/export'+ 
        '?beginDate=' + this.ruleForm.beginDate + 
        '&endDate=' + this.ruleForm.endDate + 
        '&flag=' + this.flag +
        '&companyId=' + this.ruleForm.companyId
        location.href=this.downLoadHref;
        console.log(this.downLoadHref,'downLoadHref')
      },
      //初始化所属单位
    defaultSelectList(name) {
      let url = api_prefix + "/Company/index";
      let data = { pageIndex: 1 ,pid:343 ,searchType:1};
      // if (name) {
      //   data["fastSearchStr"] = $.trim(name);
      // }
      this.$http.post(url, data, { emulateJSON: true }).then(response => {
        let listData = response.body.body.list;
        this.selectList = listData;
        console.log(this.selectList, "this.selectList");
      });
    },
    getTableData() {
      //更新table数据
      this.$http
        .post(api_prefix + "/SchedulePlan/manageList", this.ruleForm)
        .then(
          response => {
            let data = response.body.body;
            this.tableData = data.pageInfo.list;
            this.tableDataOne = data.pageTotalInfo.list;
            this.tableDataTwo = data.totalInfo.list;
            this.tableDataTotal = data.pageInfo.total;
          },
          response => {
            console.log("出错了");
          }
        );
    },
    jdytab(index) {
      this.jdytabActive = index;
      console.log(index, "index");
      this.getTableData();
    },
    datetimerange(value) {
        if(value){
            console.log(value, "时间范围");
            var oneTime = new Date().setTime(new Date(this.ruleForm.dateRange[0]).getTime());
            var twoTime = new Date().setTime(new Date(this.ruleForm.dateRange[1]).getTime());
            console.log(oneTime,twoTime,'555555555555555555555555')
            if( oneTime + 3600 * 1000 * 24 * 30 < twoTime){
              this.ruleForm.dateRange = [];
              this.$alert('日期范围最大为30天', '温馨提示', {
                confirmButtonText: '确定',
                type: 'info'
              })
            }else{
              this.ruleForm.beginDate = value.substring(0, 10);
              this.ruleForm.endDate = value.substring(13);
              console.log(this.ruleForm.beginDate, "this.ruleForm.createTimeS");
              console.log(this.ruleForm.endDate, "this.ruleForm.createTimeE");
              this.ruleForm.dateRange = [
                new Date().setTime(new Date(this.ruleForm.dateRange[0]).getTime()),
                new Date().setTime(new Date(this.ruleForm.dateRange[1]).getTime())]
                console.log(this.ruleForm.dateRange,'dataRange')
            }
        }
    },
    //currentPage 改变时会触发
    handleCurrentChange(val) {
      console.log(val, 'val')
      this.ruleForm.currPage = val;
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
    //删除行
    deleteRow(index) {
      //点击删除
      let url = api_prefix + "/module/delete/" + index;
      this.currentId = index;
      console.log("当前ID", this.currentId);
      this.$confirm("你确定要删除该内容？", "友情提示", {
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

