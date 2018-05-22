<template>
    <div class="jl-information">
      <div class="jdy-content fleft jl-creditBill">
        <div class="jdy-content-inner">
          <el-row class="search-row">
            <el-form :model="ruleForm" :inline="true" :rules="rules" ref="ruleForm" class="mt10">
              <el-row>
                <el-form-item label="所属单位：" prop="type">
                  <el-select v-model="ruleForm.type" placeholder="全部供应商" class="select-m">
                    <!--<el-option v-for="item in companiesOptions" :label="item.cName" :value="item.id" :key="item.id">
                    </el-option>-->
                    <el-option  label="gong1" value="gong1" key="gong1">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="余额状态：" prop="type">
                  <el-select v-model="ruleForm.type" placeholder="全部" class="select-m">
                    <!--<el-option v-for="item in companiesOptions" :label="item.cName" :value="item.id" :key="item.id">
                    </el-option>-->
                    <el-option  label="gong1" value="gong1" key="gong1">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="快速搜索：" prop="quickSearch">
                  <el-input placeholder="分销商/法人/手机号" @change="searchKeyWords" v-model="searchValue">
                  </el-input>
                </el-form-item>
                <el-button type="primary" class="btnbg" @click="alertJournal">搜索</el-button>
                <div class="btn-wrap fright">
                  <el-button @click="updatePage" v-loading.fullscreen.lock="fullscreenLoading">刷新</el-button>
                  <el-button @click="alertJournal">日志</el-button>
                  <el-button @click="addCreditFn">新增授信</el-button>
                </div>
              </el-row>
            </el-form>
          </el-row>
          <div class="jdy-table pt10">
            <el-table :data="tableData" style="width: 100%"  border>
              <el-table-column label="序号" type="index"  width="60"></el-table-column>
              <el-table-column label="供应商" prop="ticketType" min-width="220"></el-table-column>
              <el-table-column label="分销商" prop="ticketPrice"  min-width="220"></el-table-column>
              <el-table-column label="分销商区域" prop="ticketNum" min-width="220"></el-table-column>
              <el-table-column label="产品类型" prop="bedNum" min-width="90"></el-table-column>
              <el-table-column label="信用额度" prop="stock" min-width="100"></el-table-column>
              <el-table-column label="信用余额 " prop="ticketPrice" min-width="100"></el-table-column>
              <el-table-column label="结算周期 " prop="ticketPrice" min-width="90"></el-table-column>
              <el-table-column label="结算日 " prop="ticketPrice" min-width="90"></el-table-column>
              <el-table-column label="操作" prop="ticketPrice"  min-width="70">
                <template scope="scope">
                  <el-button @click="editCredit(scope.row.id)" class="td-btn">编辑</el-button>
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

      <!-- 编辑授信 弹窗 begin-->
      <jdy-alert title="编辑授信" @closeAlert="closeAlert" v-if="alertCreditFlag" class="dialog-lv dialog-credit">
        <el-row class="scroll-cont form-wrap p20 pb0">
          <div class="sec-wrap">
            <div class="sec-title"><span>授信信息 </span></div>
            <el-form label-width="120px" :model="creditForm">
              <el-form-item label="账户编号：">
                <el-input v-model="creditForm.name" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="账户名称：">
                <el-input v-model="creditForm.region" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="产品类型：">
                <el-checkbox-group v-model="creditForm.type">
                  <el-checkbox label="周边短线" name="type"></el-checkbox>
                  <el-checkbox label="国内长线" name="type"></el-checkbox>
                  <el-checkbox label="出境旅游" name="type"></el-checkbox>
                  <el-checkbox label="邮轮" name="type"></el-checkbox>
                  <el-checkbox label="特色游" name="type"></el-checkbox>
                  <el-checkbox label="自助游" name="type"></el-checkbox>
                  <el-checkbox label="单一资源+拍" name="type"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="信用额度：">
                <el-select v-model="creditForm.region">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="结算周期：">
                <el-select v-model="creditForm.region">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="sec-wrap">
            <div class="sec-title"> <span>温馨提示</span> </div>
            <div class="tips">
              <p>1、手动则账单日为9999-99-99，即不自动生成账单；</p>
              <p>2、日结、周结、月结会根据各自规则计算账单日，并在每日凌晨自动生成账单，您也可以到【生成信用账单】功能里手动
                生成。</p>
              <p>3、日结按付款日期计算账单日；</p>
              <p>4、周结、月结按出团日期计算账单日 ；</p>
              <p>5、出境游和邮轮无论选择何种方式，都按付款日期计算账单日。</p>
            </div>
          </div>
        </el-row>
        <el-row class="btn-wrap">
          <el-button type="primary"  @click="saveSeatChange">保存</el-button>
          <el-button @click="closeAlert">关闭</el-button>
        </el-row>
      </jdy-alert>
      <!-- 编辑授信 弹窗 end-->

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
          alertCreditFlag:false,
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
        this.alertCreditFlag = false;
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
      //新增授信
      addCreditFn(){
        this.$router.push({name: 'creditAdd'});
      },
      //编辑授信
      editCredit(listId){
        this.alertCreditFlag = true;
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
