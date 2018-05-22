<template>
  <div class="jdy-content jdy-transfer fleft noborder jl-schedule jl-information">
    <div class="jdy-content-inner-trip">
      <el-row class="jdy-content-inner-trip border p15 pl25">
        <el-col :span="16">
          <div class="jdy-content-trip">
            <el-steps :center="true" :align-center="true" :active="4">
              <el-step title="线路信息" icon="edit"></el-step>
              <el-step title="行程信息" icon="upload"></el-step>
              <el-step title="票价管理" icon="picture"></el-step>
              <el-step title="班期管理" icon="picture"></el-step>
            </el-steps>
          </div>
        </el-col>
        <el-col :span="8">
          <el-button class="fright mt10" @click="goback('List')">返回</el-button>
          <el-button type="primary" @click="upJia" class="fright mr10 mt10" v-show="showstatue!=0">入库</el-button>
          <!-- <a><el-button class="fright mt10 mr10 ml10" @click="gotoH5()">预览</el-button></a> -->
          <el-button type="primary" class="fright mt10 mr10 ml10" @click="gotoH5">预览</el-button>
          <el-button class="fright mt10" @click="goLast('Ticketprice')">上一步</el-button>
        </el-col>
      </el-row>
      <!--jdy-content-trip end-->
      <div class="h20 mainbg"></div>
      <div class="ticketprice clearfix border relative">
        <div class="jdy-search jdy-search-bg2 clearfix">
          <div class="p20 clearfix c5e fleft">
            <span class="c1f blod">产品名称：{{ProductInfo.pName}}</span>
            <span class="pl10 ">产品编号：{{ProductInfo.pNo}}</span>
            <span class="pl10 ">类型：{{productType[ProductInfo.pType]}}</span>
            <span class="pl10 mr10">计调人员：{{ProductInfo.createUser}}</span>
          </div>
        </div>
        <!--jdy-search end-->
        <div class=" p10">
          <div class="inlineblock mr10">
            <span class="demonstration">查询日期：</span>
            <el-date-picker v-model="datePicker" type="daterange" placeholder="选择日期范围" @change="dateRangeChange">
            </el-date-picker>
            <span class="demonstration ml10">状态选择：</span>
            <el-select v-model="schedulesStatus" placeholder="请选择" @change="changeSelectStatus">
              <el-option label="全部" value="" key=""></el-option>
              <el-option label="正常" value="0" key="0"></el-option>
              <el-option label="暂停" value="1" key="1"></el-option>
              <el-option label="已过期" value="3" key="3"></el-option>
            </el-select>
          </div>
          <div class="fright">
            <!-- <el-select v-model="search.orderBy" clearable placeholder="按班期编号分组" class="jdy-search-edit hasbg mr10" @change="orderByChange">
              <el-option :key="value" :label="key" v-for="(value,key) in orderByList" :value="value">
              </el-option>
            </el-select> -->
            <el-dropdown split-button type="default" @click="addBanqi(1)" trigger="click" @command="addBanqi">
              添加班期
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">添加班期</el-dropdown-item>
                <el-dropdown-item command="2">批量添加班期</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button type="default" class="btnbg" @click="refreshBtn" v-loading.fullscreen.lock="fullscreenLoading">刷新</el-button>
            <el-button type="default" class="btnbg" @click="alertJournal">日志</el-button>
          </div>
        </div>

        <!--table begin-->
        <div class="jdy-table p10">
          <el-table :data="tableData" border class=" all" highlight-current-row @row-click="rowclickHandler">
            <el-table-column label="序号" type="index" width="60">
            </el-table-column>
            <el-table-column label="状态" width="">
              <template scope="scope">
                <el-tag closeTransition v-if="scope.row.sStatus === 3">已过期</el-tag>
                <el-switch v-else v-model="scope.row.sStatus" :on-value="0" :off-value="1" @click.native="getRowId(scope.row.id)" @change="changeStatus" on-color="#71dc1c" on-text="正常" off-text="暂停">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="班期编号" width="100">
              <template scope="scope">
                {{ scope.row.sScheduleNo }}
              </template>
            </el-table-column>
            <el-table-column label="团号" width="150">
              <template scope="scope">
                {{ scope.row.sGroupOrderNo }}
              </template>
            </el-table-column>
            <el-table-column label="班期名称" width="">
              <template scope="scope">
                {{ scope.row.sScheduleName }}
              </template>
            </el-table-column>
            <el-table-column label="出发日期" width="100">
              <template scope="scope">
                {{formatDate(scope.row.sCalendar)}}
              </template>
            </el-table-column>
            <el-table-column label="停售时间" width="150">
              <template scope="scope">
                {{getStopSaleDate(scope.row.sCalendar,scope.row.sLeaveTime, scope.row.sStopType, scope.row.sStopSale)}}
              </template>
            </el-table-column>
            <el-table-column label="座位数/车辆数" width="120">
              <template scope="scope">
                {{ scope.row.sSeatTotal }}/{{scope.row.sCarNum}}
              </template>
            </el-table-column>
            <el-table-column label="已售" width="">
              <template scope="scope">
                {{ scope.row.sSeatSold || 0 }}
              </template>
            </el-table-column>
            <el-table-column label="成团人数" width="">
              <template scope="scope">
                {{ scope.row.sGroupNum }}
              </template>
            </el-table-column>
            <el-table-column label="虚占" width="">
              <template scope="scope">
                {{ scope.row.sShamNum }}
              </template>
            </el-table-column>
            <el-table-column label="余座" width="">
              <template scope="scope">
                {{ scope.row.sSeatLeft }}
              </template>
            </el-table-column>
            <el-table-column label="预留" width="">
              <template scope="scope">
                {{ scope.row.sSeatHold }}
              </template>
            </el-table-column>
            <el-table-column label="锁定" width="">
              <template scope="scope">
                {{ scope.row.sSeatLock }}
              </template>
            </el-table-column>
            <el-table-column label="星期" width="">
              <template scope="scope">
                {{WeekDay[scope.row.sWeekDay - 1]}}
              </template>
            </el-table-column>
            <el-table-column label="对号入座" width="">
              <template scope="scope">
                {{ scope.row.sSitType != null ? (scope.row.sSitType == 0 ? "不对号入座" : "对号入座") : '' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="105" fixed="right">
              <template scope="scope">
                <el-button type="default" size="mini" @click="editBanqi(scope.row.id)">
                  编辑
                </el-button>
                <!-- <el-button type="default" size="mini" @click="editSeat(scope.row.id)">
                  清除自定义票价
                </el-button> -->
                <el-button type="default" class="red" @click="delBanqi(scope.row.id)" size="mini">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页   begin-->
          <div class="clearfix">
            <el-pagination class="fright mt20" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="search.pageSize" layout="prev, pager, next, jumper" :total="search.tableDataTotal">
            </el-pagination>
          </div>
          <!-- 分页   end-->

        </div>
        <!--jdy-table end-->
      </div>
      <!--ticketprice end-->

    </div>
    <!--jdy-content-inner end-->
    <!--系统日志查看 弹窗  begin-->
        <jdy-alert title="系统日志查看" v-if="alertJournalFlag" @closeAlert="alertJournal" class="alertJournal">
            <jdy-log :alertJournalFlag="alertJournalFlag" :journalCurrentData="journalCurrentData" :journalTotal="journalTotal" :pid="pid" :module="module" @listenToChildEvent="alertJournal"></jdy-log>
        </jdy-alert>
        <!--系统日志查看 弹窗  begin-->
  </div>
  <!--jdy-content end-->
</template>

<script>
import jdyAlert from '@/components/Alert';
import jdyLog from '@/components/Log';
import sData from './s.js';
export default {
  name: 'Schedule',
  data() {
    return {
      datePicker: '', //查询日期框值
      schedulesStatus:'',
      msg: 'Schedule',
      booleanValue: { on: 0, off: 1 }, //状态控制on/off 的value
      search: {
        currPage: 1,// 分页参数：当前页 ,
        pageSize: 20,// 分页参数：每页条数 ,
        sCalendarEnd: null,// 查询结束时间,yyyy-MM-dd ,
        sCalendarStart: null,//查询开始时间,yyyy-MM-dd ,
        sProductId: this.$route.query.id,// 产品id
        flag:null,
        orderBy: 1,//分组，
        tableDataTotal: 0 //总行数
      },
      ProductInfo: {  //产品信息
        pName: '',// 产品名称,save、update必填，长度限制 = ['1-50'],
        pNo: '',// 产品编号,save、update必填，长度限制 = ['1-20'],
        pType: '',// 产品类型编号,save、update必填，可选值 = ['10', '11', '20', '30', '40', '50'],
        createUser: ""
      },
      productType: {   //产品类型
        //        "0": "全部类型",
        10: "周边短线",
        11: "国内长线",
        20: "出境旅游",
        30: "邮轮",
        40: "特色游",
        50: "自助游",
        67: "单一资源+拍"
      },
      ScheduleListUrl: api_prefix + '/Schedule/list',
      tableData:[], //列表数据 array
      banqiForm: sData.banqiForm,
      banqiForm2: sData.banqiForm2,
      banqiRule: sData.banqiRule,
      banqiRule2: sData.banqiRule2,
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      journalCurrentData: {}, //日志数据ww
      currentPage: 1, //列表当前所在页,
      pageSize: 100,
      multipleSelection: [],
      multipleSelection3: [],
      addBanqiFlag1: false,
      addBanqiFlag2: false,
      addBanqiFlag3: false,
      stopSalesType: {    //计算停售时间使用
        "0": function (value) {
          return value * 60 * 1000;
        }, //分
        "1": function (value) {
          return value * 60 * 60 * 1000;
        }, //小时
        "2": function (value) {
          return value * 24 * 60 * 60 * 1000
        }  //天
      },
      WeekDay: ["一", "二", "三", "四", "五", "六", "日"],   //格式化星期显示使用
      orderByList: {      //分组选择下拉框的值 ：：后台参数：1/2-班期编号升序/降序，3/4-出发日期升序/降序，5/6=出发时分升序/降序，7/8-星期几升序/降序
        "按班期编号分组": 1,
        "按出发日期分组": 3,
        "按出发时分分组": 5,
        "按星期几分组": 7,
      },
      updateStatusUrl: api_prefix + "/Schedule/updateStatus",   //跟新状态url
      fullscreenLoading: false,
      clearCustomTicketsUrl: api_prefix + "/Schedule/clearCustomTickets/",  //清除自定义票价url
      alertJournalFlag: false,
      h5Url:"",
      rowId:'',
      //日志相关参数
      pid: null,
      module: "Schedule",
      journalTotal: 0,
      journalCurrentData: [], //日志数据
      showstatue:0,

    }
  },
  methods: {
    getRowId(id){
        this.rowId = id;
        console.log(this.rowId,'this.rowId')
      },
    //产品预览
    gotoH5(){
      var id = this.$route.query.id;
      var urlHead = '';
      if(location.host == 'b2b.fingercrm.cn'){
        urlHead = 'http://b2b.fingercrm.cn'
      }else{
        urlHead = 'http://b2b.test.fingercrm.cn'
      }
      this.h5Url = urlHead + '/wap/m/detail.html?' + 'p_id=' + id +'&from=preview'
      console.log(this.h5Url,'this.h5Url')
      window.open(this.h5Url);
    },
    goback(value) {
      this.$router.push({ name: value });
    },
    goLast(value) {
      this.$router.push({ name: value, query: { id: this.$route.query.id } });
    },
    look() {
      this.$alert("该功能暂未开放,敬请期待", "温馨提示", { type: 'warning' });
    },
    refreshBtn() {  //刷新
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
        this.$message({
          showClose: true,
          message: '刷新成功',
          type: 'success'
        });
        this.getTableData();
      }, 1000);
    },
    orderByChange: function () {   //修改排序方式
      this.getTableData();
    },
    dateRangeChange(value) {   //日期搜索框改变
      if (value) {
        let values = value.split(" - ");
        this.search.sCalendarStart = values[0];
        this.search.sCalendarEnd = values[1];
      } else {
        this.search.sCalendarStart = null;
        this.search.sCalendarEnd = null;
      }
      this.getTableData();
    },
    changeSelectStatus(val){
      if(val!==''){
        this.search.flag = Number(val);
      }
      else{
        this.search.flag = null;
      }
      this.getTableData();
    },
    formatDate(value) {  //出发日期格式转变
      if (Number.isInteger(value)) {
        let date = new Date(parseFloat(value));
        let month = date.getMonth() + 1;
        return date.getFullYear() + "/" + month + "/" + date.getDate();
      }
      return "";
    },
    getStopSaleDate(value, time, type, num) { //计算停售时间    根据出发时间和停售间隔以及间隔类型计算停售时间
      if (type >= 0 && type <= 2 && Number.isInteger(value)) {
        let preTime = this.stopSalesType[type](num);
        let year = new Date(value).getFullYear();
        let month =  new Date(value).getMonth();
        let day =  new Date(value).getDate();
        let hour =  new Date(time).getHours();
        let minutes =  new Date(time).getMinutes();
        let date = new Date(year,month,day,hour,minutes,0);
        date = new Date(date.getTime()-preTime);
        return date.format("yyyy-MM-dd hh:mm");
      }
      return "";
    },
    editBanqi(id) {
      if (!id) {
        this.$message.error("请选择班期");
      }
      this.$router.push({ name: 'editSchedule', query: { id: this.search.sProductId, banqi: id } })
    },
    editSeat(id) {   //清除自定义票价
      this.$confirm('你确定要删除该内容？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!id) {
          this.$message.error("请选择班期");
          return;
        }
        this.$http.get(this.clearCustomTicketsUrl + id).then(response => {
          console.log(response);
          try {
            this.$message.success("操作成功");
          } catch (e) {
            this.$message.error(response.body.message);
          }
        }, response => {
          this.$alert("网络错误", '温馨提示', 'error');
        });
      }).catch(() => {

      });
    },
    delBanqi(id) {    //删除班期
      this.$confirm('你确定要删除该内容？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!id) {
          this.$message.error("请选择班期");
          return;
        }else{
          this.$http.post(this.updateStatusUrl,{
          "id": id,
          "sStatus": 2
          }).then(
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
          }
        }).catch(() => {
      });
    },
    updateStatus(value) {    //修改状态请求处理  ： 删除班期以及修改状态公用方法
      console.log('status: '+value);
      if (!this.rowId) {
        this.$message.error("请选择班期");
        return;
      }
      this.dealHttpReseponse(this.updateStatusUrl, {
        "id": this.rowId,
        "sStatus": value
      }, () => {
        fun && fun()
      });
    },
    changeStatus(value){
      this.updateStatus(value);
    },
    getTableData() {   //加载列表数据
      this.dealHttpReseponse(this.ScheduleListUrl, this.search, (response) => {
        var data = response.body.body;
        this.tableData = data.list;
        this.search.tableDataTotal = data.total
      });
    },
    //产品上架，先判断能否上架
    upJia() {
      this.dealHttpReseponse(this.ScheduleListUrl, {
        currPage: 1,// 分页参数：当前页 ,
        pageSize: 5,// 分页参数：每页条数 ,
        sProductId: this.$route.query.id,// 产品id
      }, (response) => {
        let list = response.body.body.list;
        if (list.length > 0) {
          this.effect(this.ProductInfo.companyId, this.ProductInfo.id, this.ProductInfo.updateUser);
        } else {
          this.$alert("请先维护好线路，行程，票价，班期等信息", "温馨提示", { type: 'warning' });
        }
      });
    },
    //产品请求上架
    effect(companyId, id, updateUser) {
      this.$http.post(api_prefix + 'product/effect',
        {
          "companyId": companyId,
          "id": id,
          "puserId": updateUser
        }
      ).then(response => {
        if (response.body.code == 0) {
          this.$message.success("入库成功");
          setTimeout(() => {
            this.$router.push({ name: "list" });
          }, 1000)
        } else {
          this.$message.error("入库失败");
        }
      }, response => {
        this.$message.error("入库失败");
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    addSingleTicket() {//添加单票

    },
    removeSingleTicket() {

    },
    addTr() {
      this.ruleForm3.push(this.ruleForm3Obj);
      console.log(this.ruleForm3)
    },
    removeTr() {
      var len = this.multipleSelection3.length;
      if (len == 0) {
        alert('请选择要删除的行!');
      } else {
        //this.ruleForm3[this.multipleSelection3]
        console.log(this.multipleSelection3)
      }
    },
    cloneTr() {

    },
    handleCurrentJournalChange(index) { //日志  page
      var index = index - 1;
      //this.journalCurrentData = listData.journalData[index]
    },
    handleSizeChange(val) {
      //      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      if (val && val != this.search.currPage) {
        this.search.currPage = val;
        this.getTableData();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
    ,
    handleSelectionChange3(val) {
      this.multipleSelection3 = val;
    },
    addBanqi(value) {    //添加班期
      this.$router.push({ name: 'ScheduleOne', query: { id: this.search.sProductId, type: value } })
    },
    defaultUserName(id) {   //获取用户姓名请求
      this.dealHttpReseponse(api_prefix + '/user/get/' + id, {}, (response) => {
        try {
          this.ProductInfo.createUser = response.body.body.uRealName;
          this.showstatue=response.body.body.uStatus
        } catch (e) {
          this.ProductInfo.createUser = "没有的用户"
        }
      }, "get");
    },

    defaultProductInfo() { //显示默认的产品信息
      this.dealHttpReseponse(api_prefix + '/product/detail', { "id": this.search.sProductId, "tType": 0, lineType: 0 },
        (response) => {
          this.ProductInfo = response.body.body.body.product;
          this.defaultUserName(this.ProductInfo.createUser);
        }, 'post', () => { this.$alert('不存在的产品', '温馨提示', 'error') });
    },
    dealHttpReseponse(url, data, fun, type, errorCodeFun) {    //post请求
      type || (type = 'post')
      this.$http[type](url, data).then(response => {
        if (response.body.code == 0) {
          fun(response);
        } else {
          errorCodeFun ? errorCodeFun() : this.$alert(response.body.message, '温馨提示', 'error');
        }
      }, response => {
        this.$alert("网络错误", '温馨提示', 'error');
      });
    },
    addBanqiClose() {
      this.addBanqiFlag1 = false;
      this.addBanqiFlag2 = false;
      this.addBanqiFlag3 = false;
      this.search.banqi = '';
      $('.alertbgg').remove();
    },
    //----------日志相关逻辑 start-----
    //关闭,打开日志弹窗
    alertJournal(alertJournalFlag) {
      if (!this.pid) { this.$alert("请选择用户"); return }
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
  },
  created() {
    if (!this.search.sProductId) {
      this.$message.error("请选择产品");
      return;
    }
    this.defaultProductInfo();
    this.getTableData();
  },
  components: {
    jdyAlert,
    jdyLog
  },
  computed: {
    /*journalTotal() { //日志页数
      return 50
    },*/
    /*tableDataTotal() { //列表页数
      return 500
    }*/
  }
}
</script>
<style scoped>
.jdy-transfer .el-dropdown .el-button-group {
  display: inline-block;
}
</style>


