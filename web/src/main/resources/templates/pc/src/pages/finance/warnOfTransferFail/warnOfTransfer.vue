<template>
    <div class="jl-information">
      <div class="jdy-content jdy-transfer fleft jl-creditBill">
        <div class="jdy-content-inner">
          <el-row class="search-row">
            <el-form :model="ruleForm" :inline="true" :rules="rules" ref="ruleForm" class="mt10">
              <el-row>
                <el-form-item label="类型状态：：" prop="type">
                  <el-select v-model="ruleForm.type" placeholder="全部" class="select-m mr10">
                    <!--<el-option v-for="item in companiesOptions" :label="item.cName" :value="item.id" :key="item.id">
                    </el-option>-->
                    <el-option  label="gong1" value="gong1" key="gong1">
                    </el-option>
                  </el-select>
                  <el-select v-model="ruleForm.type" placeholder="全部" class="select-m">
                    <!--<el-option v-for="item in companiesOptions" :label="item.cName" :value="item.id" :key="item.id">
                    </el-option>-->
                    <el-option  label="gong1" value="gong1" key="gong1">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="转账日期：" prop="type">
                  <el-date-picker v-model="ruleForm.dateRange" :picker-options="pickerOptions" type="daterange"  placeholder="选择时间范围" class="input-date-l"></el-date-picker>
                </el-form-item>
                <el-form-item label="快速搜索：" prop="quickSearch">
                  <el-input placeholder="发票抬头/申请人/处理人" @change="searchKeyWords" v-model="searchValue">
                  </el-input>
                </el-form-item>
                <el-button type="primary" class="btnbg" @click="alertJournal">搜索</el-button>
                <div class="btn-wrap fright">
                  <el-button @click="updatePage" v-loading.fullscreen.lock="fullscreenLoading">刷新</el-button>
                  <el-button @click="alertJournal">日志</el-button>
                </div>
              </el-row>
            </el-form>
          </el-row>
          <div class="jdy-table pt10">
            <el-table :data="tableData" style="width: 100%"  border>
              <el-table-column label="序号" type="index"  width="60"></el-table-column>
              <el-table-column label="转账状态" prop="ticketType" width="80">
                <template scope="scope">
                  <el-tag class="yellow-tag">处理中</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="转出单位" prop="ticketPrice"  min-width="140"></el-table-column>
              <el-table-column label="转入单位" prop="ticketNum" min-width="140"></el-table-column>
              <el-table-column label="转账类型" prop="bedNum" width="90"></el-table-column>
              <el-table-column label="转账编号" prop="stock" min-width="110"></el-table-column>
              <el-table-column label="转账金额 " prop="ticketPrice" width="100"></el-table-column>
              <el-table-column label="失败原因 " prop="ticketPrice" min-width="160"></el-table-column>
              <el-table-column label="创建时间 " prop="ticketPrice" width="100"></el-table-column>
              <el-table-column label="转账时间 " prop="ticketPrice" width="100"></el-table-column>
              <el-table-column label="完成时间 " prop="ticketPrice" width="100"></el-table-column>
              <el-table-column label="处理备注 " prop="ticketPrice" min-width="180"></el-table-column>
              <el-table-column label="操作" prop="ticketPrice"  width="70">
                <template scope="scope">
                  <el-button @click="dealFu(scope.row.id)" class="td-btn">处理</el-button>
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

      <!-- 转账失败处理 弹窗 begin-->
      <jdy-alert title="转账失败处理" @closeAlert="closeAlert" v-if="alertDealFlag" class="dialog-lv dialog-credit">
        <el-row class="scroll-cont form-wrap p20 pb0">
          <div class="sec-wrap">
            <div class="sec-title"><span>基本信息</span></div>
            <el-form label-width="120px" :model="creditForm">
              <el-form-item label="转账类型：">
                <el-input v-model="creditForm.name" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="转账编号：">
                <el-input v-model="creditForm.region" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="转账金额：">
                <el-input v-model="creditForm.name" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="转出单位：">
                <el-input v-model="creditForm.region" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="转入单位：">
                <el-input v-model="creditForm.name" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="失败原因：">
                <el-input v-model="creditForm.region" :disabled="true"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="sec-wrap">
            <div class="sec-title"> <span>温馨提示</span> </div>
            <div class="tips">
              <p>1、该功能建议只由技术操作，或在技术指导下操作；</p>
              <p>2、转账失败处理会将原单置为失败已处理状态，并生成新的队列数据交由定时任务执行。</p>
              <p>3、该操作无法更改如金额、转出方、转入方等数据，严格按照原单数据处理。</p>
            </div>
          </div>
        </el-row>
        <el-row class="btn-wrap">
          <el-button type="primary"  @click="dealWithFn">处理</el-button>
          <el-button @click="closeAlert">关闭</el-button>
        </el-row>
      </jdy-alert>
      <!-- 转账失败处理 弹窗 end-->

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
export default  {
    components: {
        jdyAlert,
        jdyLog
    },
    name: 'information',
    data() {
        return {
          alertDealFlag:false,
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
        this.alertDealFlag = false;
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

      //转账失败处理
      dealFu(listId){
        this.alertDealFlag = true;
        this.$nextTick(function () {
          jdyFn.setAlertStyle('dialog-lv');
        })
      },
      //处理
      dealWithFn(num){
        const that = this;
        let tips ='处理成功，已生成新的转账队列，单号为'+num+',请稍后查看转账结果';
        that.$alert(tips, '温馨提示', {
          confirmButtonText: '确定',
          callback: action => {
            that.closeAlert();
          }
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
<style>


</style>
