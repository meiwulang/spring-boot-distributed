<template>
  <div class="jl-information">
    <div class="jdy-content jdy-lv fleft jl-creditBill">
      <div class="jdy-content-inner">
        <el-form :model="ruleForm" :inline="true" :rules="rules" ref="ruleForm" class="mt10">
          <el-row class="search-row" style="width: 70%;">
            <el-form-item label="付款单位：" prop="type">
              <el-select v-model="ruleForm.type" placeholder="全部" @change="changeType" class="select-m">
                <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收款单位：" prop="type">
              <el-select v-model="ruleForm.type" placeholder="全部" @change="changeType" class="select-m">
                <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间类型：" prop="type">
              <el-select v-model="ruleForm.type" placeholder="请选择" @change="changeType" class="select-m">
                <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="截至日期：">
              <el-date-picker v-model="ruleForm.dateRange" :picker-options="pickerOptions" type="daterange" @change="datetimerange" placeholder="选择时间范围" class="input-date-l">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="快速搜索：" prop="quickSearch" class="creditBillSearch">
              <el-input placeholder="账单号/分销商名称/编号/法人姓名/手机号" @change="searchKeyWords" v-model="searchValue">
              </el-input>
            </el-form-item>
            <el-button type="primary" class="btnbg" @click="alertJournal">搜索</el-button>
            <el-button type="default"  @click="mergeCreditBill">合并账单</el-button>
            <el-button type="default" @click="generateCreditBill">生成账单</el-button>
          </el-row>
        </el-form>
        <div class="jdy-table pt10">
          <el-table :data="tableData" border style="text-again: center" class="all" @row-click="rowclickHandler" highlight-current-row>
            <el-table-column type='selection' width="25" class-name="borderR0"></el-table-column>
            <el-table-column type='index' label=" " min-width="8" class-name="alignL"></el-table-column>
            <el-table-column label="付款单位" min-width="120">
              <template scope="scope">
                <!-- {{scope.row.nType}} -->
                2017-07-23
              </template>
            </el-table-column>
            <el-table-column label="账单日期" min-width="120">
              <template scope="scope">
                <!-- {{scope.row.nType}} -->
                2017-07-23
              </template>
            </el-table-column>
            <el-table-column label="结算总额" min-width="100">杭州22德嘉旅行社有限公司</el-table-column>
            <el-table-column label="人数" min-width="60">￥2448.00</el-table-column>
            <el-table-column label="产品名称" min-width="320" class-name="txtHide">
              <template scope="scope">
                <!-- {{scope.row.nType}} -->
                魅力纯青岛.相约极地.温德姆
              </template>
            </el-table-column>
            <el-table-column label="订单编号" min-width="150" class-name="blue-font">
              <template scope="scope">
                <!-- {{scope.row.nType}} -->
                JDY20178801010933
              </template>
            </el-table-column>
            <el-table-column label="交易时间" min-width="150">
              <template scope="scope">
                <!-- {{scope.row.nType}} -->
                2017-06-22 11:07:48
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
    </div>
    <!--jdy-content end-->

    <!-- 合并账单-手动合并账单 弹窗 begin-->
    <jdy-alert title="手动合并账单" @closeAlert="closeAlert" v-if="alertMergeBillFlag" class="dialog-lv dialog-credit">
      <el-row class="scroll-cont p20">
        <el-form :model ="alertMergeBillSearchData" :inline="true">
          <el-row class="">
            <el-form-item label="账单日期：">
              <el-date-picker type="daterange" placeholder="选择交易时间范围" v-model="value6" style="width: 210px;"></el-date-picker>
            </el-form-item>
            <el-form-item label="快速搜索：" prop="quickSearch">
              <el-input placeholder="账单编号" @change="searchKeyWords" style="width: 180px;" v-model="alertMergeBillSearchData.searchValue">
              </el-input>
            </el-form-item>
            <el-button type="primary" class="btnbg fr" @click="alertJournal">搜索</el-button>
          </el-row>
        </el-form>
        <el-row class="table-wrap">
          <el-table :data="tableData" border style="text-again: center" class="all" @row-click="rowclickHandler" highlight-current-row>
            <el-table-column type='index' label=" " min-width="8" ></el-table-column>
            <el-table-column label="账单编号" min-width="200">
              <template scope="scope">
                <!-- {{scope.row.nType}} -->
                2017-07-23
              </template>
            </el-table-column>
            <el-table-column label="账单日期" min-width="120">
              <template scope="scope">
                <!-- {{scope.row.nType}} -->
                2017-07-23
              </template>
            </el-table-column>
            <el-table-column label="账单金额" min-width="90">
              <template scope="scope">
                <!-- {{scope.row.nType}} -->
                2017-07-23
              </template>
            </el-table-column>
            <el-table-column label="账单状态" min-width="90">
              <template scope="scope">
                <!-- {{scope.row.nType}} -->
                2017-07-23
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="80">
              <template scope="scope">
                <el-button type="text">确认合并</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-row>

    </jdy-alert>
    <!-- 合并账单-手动合并账单 弹窗 end-->


  </div>
</template>

<script>
  import jdyAlert from '@/components/Alert';
  import jdyLog from '@/components/Log';
  export default {
    components: {
      jdyAlert,
      jdyLog
    },
    name: 'information',
    data() {
      return {
        value6:'',
        alertMergeBillFlag:false,
        alertMergeBillSearchData:{},
        creditForm:{},
        msg: 'pivilege',
        commonTime: '',
        currentId: '',//当前数据的id
        changeTypeValue: '',//选择类型的值
        searchValue: '',//搜索框的值
        isRecommendValue: '',//是否推荐的值
        currentStatus: '',//当前选择后的状态
        alertNoticeFlag: false,
        alertJournalFlag: false,
        currentPage: 1, //列表当前所在页,
        alertTitle: '',//查看公告标题
        alertContent: '',//查看公告内容
        pageSizeAll: 20,
        journalCurrentData: {}, //日志数据ww
        ruleForm: {
          dateRange: ''
        },
        searchInput: '',
        rules: {},
        type: [{
          value: '1',
          label: '资讯'
        }, {
          value: '2',
          label: '公告'
        }, {
          value: '3',
          label: '全部类型'
        }],
        tableData: [],
        fullscreenLoading: false,
        tableDataTotal: 0,
        //日志相关参数
        pid: null,
        module: "News",
        journalTotal: 0,
        journalCurrentData: [], //日志数据


        //
        includeRevoked: 0,
        percentage:80
      }
    },
    mounted() {
      this.$http.post(api_prefix + '/News/list', {
        nType: '',
        searchKey: this.searchValue,
        currPage: this.currentPage,
        pageSize: 20
      }).then(response => {
        let data = response.data.body;
        this.tableData = data.list;
        this.tableDataTotal = data.total;
      }, response => {
        console.log('出错了');
      });
    },
    computed: {
      journalTotal() { //日志页数
        return listData.journalData.length * 10
      }
    },
    methods: {
      getTableData(opt) {//更新table数据
        this.$http.post(api_prefix + '/News/list', {
          nType: this.changeTypeValue,
          searchKey: this.searchValue,
          pageSize: 20,
          currPage: this.currentPage
        }).then(response => {
          let data = response.data.body;
          this.tableData = data.list;
          this.tableDataTotal = data.total;
        }, response => {
          console.log('出错了');
        });
      },


      //
      isRevoked(value) {
        this.includeRevoked = value;
        console.log(this.includeRevoked, 'this.includeRevoked')
      },
      //生成信用账单
      generateCreditBill(){
        this.$confirm('你确定要将选中的订单生成账单吗？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '生成成功!'
          });
        }).catch(() => { });
      },
      //合并账单
      mergeCreditBill(){
        this.alertMergeBillFlag = true;
        this.$nextTick(function () {
          jdyFn.setAlertStyle('dialog-lv');
        })
      },
      closeAlert(){
        this.alertMergeBillFlag = false;
        $('.alertbgg').remove();
      },


      changeType(value) {//获取选择类型的值
        console.log(value)
        this.changeTypeValue = value;
        console.log(this.changeTypeValue)
      },
      searchKeyWords(value) {//获取快速搜索的值
        console.log(value)
        this.searchValue = value;
      },
      handleIconClick(ev) {//快速搜索点击搜索后请求服务器
        this.getNoticeData();
      },
      getNoticeData() {//选择类型或搜索后的请求事件
        if (this.changeTypeValue != 3) {
          this.$http.post(api_prefix + '/News/list', {
            nType: this.changeTypeValue,
            searchKey: this.searchValue,
            currPage: this.currentPage,
            pageSize: 20
          }).then(response => {
            let data = response.data.body;
            this.tableData = data.list;
            this.tableDataTotal = data.total;
          }, response => {
            console.log('出错了');
          });
        } else {
          this.$http.post(api_prefix + '/News/list', {
            searchKey: this.searchValue,
            currPage: this.currentPage,
            pageSize: 20
          }).then(response => {
            let data = response.data.body;
            this.tableData = data.list;
          }, response => {
            console.log('出错了');
          });
        }
      },
      deleteInfor(id) {//点击删除
        this.currentId = id;
        console.log('当前ID', this.currentId)
        this.$confirm('你确定要删除该内容？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(api_prefix + '/News/updateStatus', {
            id: this.currentId,
            nStatus: 2,
          }).then(response => {
            this.fullscreenLoading = true;
            this.getTableData();
            setTimeout(() => {
              this.fullscreenLoading = false;
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              });
            }, 1000);
          }, response => {
            console.log('出错了');
          });
        }).catch(() => {

        });
      },
      handleCurrentChange(val) {
        if (val) {
          var obj = { 'currentPage': val }
          this.getNewPage();
          this.currentPage = val;
        }
      },
      getNewPage() {
        this.$http.post(api_prefix + '/News/list', {
          nType: this.changeTypeValue,
          searchKey: this.searchValue,
          currPage: this.currentPage,
          pageSize: 20
        }).then(response => {
          let data = response.data.body;
          this.tableData = data.list;
          this.tableDataTotal = data.total;
        }, response => {
          console.log('出错了');
        });
      },
      //----------日志相关逻辑 start-----
      //关闭,打开日志弹窗
      alertJournal(alertJournalFlag) {
        if (!this.pid) { this.$alert("请选择产品"); return }
        this.alertJournalFlag = !this.alertJournalFlag
        if (this.alertJournalFlag) {
          this.$nextTick(function () {
            jdyFn.setAlertStyle('alertJournal');
          });
        }
      },
      //获取日志数据
      getLogData(index) {
        this.$http.post(api_prefix + '/logs/selectLogs?pageIndex=' + index + '&module=' + this.module + '&pid=' + this.pid
        ).then(response => {
          let _self = this;
          this.journalTotal = response.data.body.total;
          this.journalCurrentData = []
          response.data.body.list.forEach(function (value) {
            _self.journalCurrentData.push(value);
          });
          // this.journalCurrentData=response.data.body.list
        }, response => {
          console.log('获取日志出错了');
        });
      },
      //table行点击事件
      rowclickHandler(row, event, column) {
        this.pid = row.id;
        if (!this.companyId) { this.companyId = row.companyId }
        this.getLogData(1)
      },
      //----------日志相关逻辑 end-----
    }
  }
</script>
<style scoped>
  .dialog-lv td{
    background-color: #fff;;
  }
</style>
