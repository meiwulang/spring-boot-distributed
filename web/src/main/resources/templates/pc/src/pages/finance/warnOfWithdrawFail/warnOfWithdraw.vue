<template>
    <div class="jl-information">
      <div class="jdy-content jdy-transfer fleft jl-creditBill">
        <div class="jdy-content-inner">
          <el-row class="search-row">
            <el-form :model="ruleForm" :inline="true" :rules="rules" ref="ruleForm" class="mt10">
              <el-row>
                <el-form-item label="提现状态：" prop="type">
                  <el-select v-model="ruleForm.type" placeholder="请选择" class="select-m">
                    <!--<el-option v-for="item in companiesOptions" :label="item.cName" :value="item.id" :key="item.id">
                    </el-option>-->
                    <el-option  label="gong1" value="gong1" key="gong1">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="账单日期：">
                  <el-date-picker v-model="ruleForm.dateRange" :picker-options="pickerOptions" type="daterange" @change="datetimerange" placeholder="选择时间范围" class="input-date-l">
                  </el-date-picker>
                </el-form-item>
                <el-button type="primary" class="btnbg" @click="alertJournal">搜索</el-button>
                <div class="btn-wrap fright">
                  <el-button @click="updatePage" v-loading.fullscreen.lock="fullscreenLoading">刷新</el-button>
                  <el-button @click="alertJournal">日志</el-button>
                  <el-button @click="QueryNativeData">融数原生查询</el-button>
                </div>
              </el-row>
            </el-form>
          </el-row>
          <div class="jdy-table pt10">
            <el-table :data="tableData" style="width: 100%"  border>
              <el-table-column label="序号" type="index"  width="60"></el-table-column>
              <el-table-column label="提现状态" prop="ticketType" width="80">
                <template scope="scope">
                  <el-tag class="yellow-tag">处理中</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="账单编号" prop="ticketPrice"  min-width="160"></el-table-column>
              <el-table-column label="账单日" prop="ticketNum" min-width="80"></el-table-column>
              <el-table-column label="收款方单位名称" prop="bedNum" min-width="140"></el-table-column>
              <el-table-column label="账单金额" prop="stock" min-width="90"></el-table-column>
              <el-table-column label="提现手续费 " prop="ticketPrice" min-width="100"></el-table-column>
              <el-table-column label="实收金额 " prop="ticketPrice" min-width="90"></el-table-column>
              <el-table-column label="账单生成时间 " prop="ticketPrice" min-width="120"></el-table-column>
              <el-table-column label="请求提现时间 " prop="ticketPrice" min-width="120"></el-table-column>
              <el-table-column label="备注" prop="ticketPrice"  min-width="200"></el-table-column>
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

      <!-- 融数原生查询 弹窗 begin-->
      <jdy-alert title="查询融数提现、转账等数据" @closeAlert="closeAlert" v-if="alertNativeDataFlag" class="dialog-lv dialog-credit">
        <el-row class="scroll-cont form-wrap p20 pb0">
          <div class="sec-wrap">
            <div class="sec-title"><span>查询条件</span></div>
            <el-form label-width="120px" :model="creditForm">
              <el-form-item label="开始时间：">
                <el-input v-model="creditForm.name" placeholder="如2017-08-16 10:00:00"></el-input>
              </el-form-item>
              <el-form-item label="结束时间：">
                <el-input v-model="creditForm.region" placeholder="如2017-08-16 10:00:00"></el-input>
              </el-form-item>
              <el-form-item label="查询类型：">
                <el-select v-model="creditForm.region" placeholder="请选择类型">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="付款方ID：">
                <el-input v-model="creditForm.name" placeholder="单位ID：如尚品则填1"></el-input>
              </el-form-item>
              <el-form-item label="收款方ID：">
                <el-input v-model="creditForm.name" placeholder="单位ID，如南京时尚则填S5171"></el-input>
              </el-form-item>
              <el-form-item label="交易金额：">
                <el-input v-model="creditForm.region" placeholder="单位分，如100元则填写10000"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="sec-wrap">
            <div class="sec-title"> <span>返回数据 </span> </div>
            <div class="backData">

            </div>
          </div>
        </el-row>
        <el-row class="btn-wrap">
          <el-button type="primary"  @click="saveSeatChange">查询</el-button>
          <el-button type="primary"  @click="saveSeatChange">重置</el-button>
          <el-button @click="closeAlert">关闭</el-button>
        </el-row>
      </jdy-alert>
      <!-- 融数原生查询 弹窗 end-->

      <!--系统日志查看 弹窗  begin-->
      <jdy-alert title="系统日志查看" v-if="alertJournalFlag" @closeAlert="alertJournal" class="alertJournal">
          <jdy-log :alertJournalFlag="alertJournalFlag" :journalCurrentData="journalCurrentData" :journalTotal="journalTotal" :pid="pid" :module="module" @listenToChildEvent="alertJournal"></jdy-log>
      </jdy-alert>
      <!--系统日志查看 弹窗  begin-->
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
          alertNativeDataFlag:false,
          fullscreenLoading: false,
          creditForm:{},
          companiesOptions:[],
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
            includeRevoked: 0
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
      closeAlert(){
        this.alertNativeDataFlag = false;
        $('.alertbgg').remove();
      },
      handleIconClick(){

      },
      //刷新
      updatePage() {
        this.fullscreenLoading = true;
        setTimeout(() => {
          this.fullscreenLoading = false;
          this.$message({
            showClose: true,
            message: '刷新成功',
            type: 'success'
          });
          this.getTableData('all');
        }, 1000);
      },

      //编辑授信
      QueryNativeData(listId){
        this.alertNativeDataFlag = true;
        this.$nextTick(function () {
          jdyFn.setAlertStyle('dialog-lv');
        })
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
<style>


</style>
