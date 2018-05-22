<template>
<div class="jl-information">
    <div class="jdy-content jdy-transfer yjk-fleft noborder">
        <div class="jdy-tab" style="margin:0;padding-right:0">
            <!-- 0：待发团 1：发团中 2：已结团 3：已回团 4：已取消' -->
            <a href="javascript:;" title="" @click="jdytab(null)" :class="{ active: jdytabActive==null }">全部
                <span></span>
            </a>
            <a href="javascript:;" title="" @click="jdytab(5)" :class="{ active: jdytabActive==5 }">待确认出行
                <span></span>
            </a>            
            <a href="javascript:;" title="" @click="jdytab(0)" :class="{ active: jdytabActive==0 }">待发团
                <span></span>
            </a>
            <a href="javascript:;" title="" @click="jdytab(1)" :class="{ active: jdytabActive==1 }">发团中
                <span></span>
            </a>
            <a href="javascript:;" title="" @click="jdytab(3)" :class="{ active: jdytabActive==3 }">已回团
                <span></span>
            </a>
            <a href="javascript:;" title="" @click="jdytab(2)" :class="{ active: jdytabActive==2 }">已结团
                <span></span>
            </a>
            <a href="javascript:;" title="" @click="jdytab(4)" :class="{ active: jdytabActive==4 }">已取消&nbsp;&nbsp;<div class="yjk-number">{{orderTotal}}</div>
                <span></span>
            </a>
            <el-button @click="alertJournal" class="fright mr20 mt10">日志</el-button>
        </div>
        <div>
            <el-form :model="ruleform" :inline="true" ref="ruleform" class="demo-form" label-width="150px">
                <el-row class="mt10">
                    <el-form-item label="" prop="uCompanyId" v-show='uDataLimit == 3' class="yjk-mb10 paddLeft">
                        <el-select v-model="ruleform.companyId" clearable placeholder="请选择单位名称" style="width: 100%;">
                            <el-option :key="value.id" v-for="value in selectList" :label="value.cName" :value="value.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="yjk-mb10">
                        <el-select v-model="dataParam.dateType" @change="getTableData">
                            <el-option :key="0" label="出团时间" :value="0">
                            </el-option>
                            <el-option :key="1" label="回团时间" :value="1">
                            </el-option>
                            <el-option :key="2" label="创建团期时间" :value="2">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="yjk-mb10">
                        <el-date-picker v-model="datePicker" type="daterange" placeholder="选择日期范围" @change="dateRangeChange">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item class="yjk-mb10" v-if="jdytabActive == 3">
                        <el-select v-model="ruleform.costResultStatus" @change="getTableData">
                            <el-option :key="0" label="待审核" :value="0">
                            </el-option>
                            <el-option :key="2" label="不通过" :value="2">
                            </el-option>
                            <el-option :key="null" label="全部" :value="null">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="yjk-mb10 yjk-search" style="width:380px">
                        <el-input v-model.trim="ruleform.searchContent" placeholder="请输入线路名称、团号、产品经理、产品编号搜索" style="width:380px"></el-input>
                    </el-form-item>
                    <el-form-item class="yjk-ml100 yjk-mb10">
                        <el-checkbox v-model="checkedOtStatus" @change="changeOtStatus" class="mr10" v-show="jdytabActive==4">游客未被全部取消</el-checkbox>
                        <el-button type="primary" @click="getTableData()">确认查询</el-button>
                        <el-button type="primary" @click="changeHref">导出成本损益表</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
        </div>
        <!--jdy-table begin-->
        <div class="jdy-table p10 yjksell">
            <el-table :data="tableData" border class="all" @row-click="handleRowChange" highlight-current-row>
                <el-table-column label="序号" type="index" width="60">
                </el-table-column>
                <el-table-column label="状态" width="">
                    <template scope="scope">
                        {{ scope.row.departureStatus |filterStatus }}
                    </template>
                </el-table-column>
                <el-table-column label="出团日期" width="">
                    <template scope="scope">
                        {{ scope.row.outGroupTime | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="回团日期" width="">
                    <template scope="scope">
                        {{ scope.row.backGroupTime| dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="创建团期时间" width="">
                    <template scope="scope">
                        {{ scope.row.scheduleTime| dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="线路名称" width="">
                    <template scope="scope">
                    {{ scope.row.routeName }}
                    </template>
                </el-table-column>
                <el-table-column label="团号" width="">
                    <template scope="scope">
                        {{ scope.row.groupNo }}
                    </template>
                </el-table-column>
                <el-table-column label="成团人数" width="">
                    <template scope="scope">
                    {{ scope.row.groupPeopleNum }}
                    </template>
                </el-table-column>
                <el-table-column label="收客数" width="">
                    <template scope="scope">
                        <span class="colorSpan" @click="getTouristInfo(scope.row.scheduleSettingId)">{{ scope.row.touristsNum }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="行程天数" width="">
                    <template scope="scope">
                    {{ scope.row.tripDays }}
                    </template>
                </el-table-column>
                <el-table-column label="目的地" width="">
                    <template scope="scope">
                        {{ scope.row.destination }}
                    </template>
                </el-table-column>
                <el-table-column label="线路类型" width="">
                    <template scope="scope">
                        {{ scope.row.routeType|lineType }}
                    </template>
                </el-table-column>
                <el-table-column label="产品经理" width="">
                    <template scope="scope">
                        {{ scope.row.productManager }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="150">
                    <template scope="scope">
                        <el-select @change="orderChange" v-model="orderChangeType[scope.row.scheduleId]" size="mini" class="goto-update" placeholder="操作">
                            <el-option key="1" value="1" label="发团" v-show="scope.row.departureStatus==0"></el-option>
                            <!-- <el-option key="2" value="2" label="结团" v-show="scope.row.departureStatus==3"></el-option> -->
                            <el-option key="3" value="3" label="取消客人" v-show="scope.row.departureStatus != 2"></el-option>
                            <el-option key="4" value="4" label="取消团期" v-show="scope.row.departureStatus==0"></el-option>
                            <el-option key="5" value="5" label="核算成本管理" v-if="showCostList == true && scope.row.departureStatus == 3"></el-option>
                            <el-option key="6" value="6" label="审核核算成本" v-if="showConfirmCost == true && scope.row.costingStatus == 0"></el-option>
                            <el-option key="7" value="7" label="核算成本管理" v-if="scope.row.departureStatus == 2"></el-option>
                            <el-option key="8" value="8" label="确认出行游客" v-if="scope.row.departureStatus == -1"></el-option>
                            <el-option key="9" value="9" label="查看出行游客名单" v-if="scope.row.departureStatus != -1"></el-option>
                        </el-select>
                        <el-button type="default" @click="gotoNotice(scope.row.scheduleSettingId)" size="mini" >
                            出团通知书
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页   begin-->
            <div class="clearfix">
                <el-pagination class="fright mt20" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="tableDataTotal">
                </el-pagination>
            </div>
            <!-- 分页   end-->
        </div>
    </div>
    <!--取消团期 弹窗-->
    <jdy-alert title="取消团期" @closeAlert="closeAlertBtn" v-if="cancelGroupObj.flag" class="alertCityList showtfcity">
        <div class="yjk-alertInner">
            <div>
                <span class="yjk-innerTitle">团号:</span>
                <span class="w70per inlineblock">{{cancelGroupObj.groupNo}}</span>
            </div>
            <div>
                <span class="yjk-innerTitle">线路名称:</span>
                <span class="w70per inlineblock">{{cancelGroupObj.line}}</span>
            </div>
            <div>
                <span class="yjk-innerTitle redstar fleft">取消原因:</span>
                <span class="w70per inlineblock">
                    <el-input type="textarea" v-model="cancelGroupObj.reason"></el-input>
                </span>
            </div>
        </div>
        <div class="alertfoot1 clearfix">
            <el-button type="primary" class="fright mt10 mr10" :disabled="btnFlag" @click="cancelGroup_submit">提交</el-button>
            <el-button class="fright mt10 mr10" @click="closeAlertBtn">关闭</el-button>
        </div>
    </jdy-alert>
    <!--系统日志查看 弹窗  begin-->
    <jdy-alert title="系统日志查看" v-if="alertJournalFlag" @closeAlert="alertJournal" class="alertJournal">
        <jdy-log :alertJournalFlag="alertJournalFlag" :journalCurrentData="journalCurrentData" :journalTotal="journalTotal" :pid="focusPriceId" :module="module" @listenToChildEvent="alertJournal"></jdy-log>
    </jdy-alert>

</div>
</template>

<script>
import jdyAlert from "@/components/Alert";
import jdyLog from '@/components/Log';

export default {
  name: "groupManage",
  data() {
    return {
      downLoadHref:'',
      btnFlag: false,
      //日期相关参数
      dataParam:{
        dateType: 0, //日期类型
        dateStart: dateChange(1), //起始日期
        dateEnd: dateChange(15), //结束日期
      },
      datePicker: [
        new Date().setTime(new Date().getTime() + 3600 * 1000 * 24 * 1),
        new Date().setTime(new Date().getTime() + 3600 * 1000 * 24 * 15)
      ],
      // 用于搜索条件筛选
      ruleform: {
        currPage: 1,
        pageSize: 10,
        departureStatus:null,
        searchContent: "", //快速查询
        outGroupTimeBeginStr:dateChange(1),
        outGroupTimeEndStr:dateChange(15),
        backGroupTimeBeginStr:null,
        backGroupTimeEndStr:null,
        scheduleTimeBeginStr:null,
        scheduleTimeEndStr:null,
        companyId:'',
        otStatus: null,
        costResultStatus:null,
      },

      tableData: [], //表格
      jdytabActive: null, //是否被选中
      orderChangeType: [], //订单修改按钮
      orderTotal:null,
      // 分页
      currentPage: 1, //列表当前所在页,
      pageSize: 10,
      tableDataTotal: 0,
      fullscreenLoading: false, //加载
      loading: false, //select远程查询加载
      logindata: '', //登陆数据
      rowData: null, //被选中数据

      //发团
      startGroupObj:{
        // flag:false,
        infoList:[{
            days:null,
            info:null,
            start:null,
            destination:null,
            starttime:null,
            endtime:null,
            planes:null
        }]
      },
      //取消团期
      cancelGroupObj:{
        flag:false,
        reason:"",
        groupNo:null,
        line:null
      },
      //数据权限管理相关
      uDataLimit:'',
      selectedOptions:'',
      selectList: [], //单位选择
      //
      checkedOtStatus:false,
      //
      showConfirmCost:false,
      showCostList:false,
      menuData:null,
      /*日志相关*/
      module: "schedule",
      journalTotal: 0,
      journalCurrentData: [], //日志数据
      alertJournalFlag: false, //系统日志查看 弹窗值
      logId:'',
      journalStyle: { //系统日志弹窗位置
        top: '164px',
        left: '300px'
      },

    };
  },
  mounted() {
      setTimeout(()=>{
          console.log(window.menuData,'menuData')
          this.menuData = window.menuData;
          if(this.menuData.indexOf("confirmCost") != -1){
              this.showConfirmCost = true;
          }
          if(this.menuData.indexOf("costList") != -1){
              this.showCostList = true;
          }
      },500)
    let logindata = JSON.parse(sessionStorage.loginData);
    this.uDataLimit = logindata.uDataLimit;
    this.ruleform.companyId = JSON.parse(sessionStorage.loginData).uCompanyId;
    this.getTableData();
    this.defaultSelectList();
  },
  methods: {
    changeHref(){
        if(this.dataParam.dateStart == null){
            this.dataParam.dateStart = ''
        }
        if(this.dataParam.dateEnd == null){
            this.dataParam.dateEnd = ''
        }
        this.downLoadHref = api_prefix + 'productCost/exportProductCostLossExcel?'
        + 'flag=' + this.dataParam.dateType
        + '&beginDate=' + this.dataParam.dateStart
        + '&endDate=' + this.dataParam.dateEnd
        + '&searchStr=' + this.ruleform.searchContent
        + '&companyId=' + this.ruleform.companyId
        console.log(this.downLoadHref,'downLoadHref')
        location.href = this.downLoadHref;
    },
    //数据权限
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
    //游客未被全部取消
    changeOtStatus(){
        console.log(this.checkedOtStatus,'09090')
        if(this.checkedOtStatus == true){
            this.ruleform.otStatus = 0;
        }else{
            this.ruleform.otStatus = null;
        }
        this.getTableData();
    },
    // 获取表格
    getTableData() {
        this.getCancelNum();
        this.getSession();
        // 由dataParam.dateType判断回团还是出团(0出团)
        if(this.dataParam.dateType == 1){
            this.ruleform.outGroupTimeBeginStr=null;
            this.ruleform.outGroupTimeEndStr=null;
            this.ruleform.backGroupTimeBeginStr=this.dataParam.dateStart;
            this.ruleform.backGroupTimeEndStr=this.dataParam.dateEnd;
            this.ruleform.scheduleTimeBeginStr=null;
            this.ruleform.scheduleTimeEndStr=null;
        }else if(this.dataParam.dateType == 0){
            this.ruleform.backGroupTimeBeginStr=null;
            this.ruleform.backGroupTimeEndStr=null;
            this.ruleform.outGroupTimeBeginStr=this.dataParam.dateStart;
            this.ruleform.outGroupTimeEndStr=this.dataParam.dateEnd;
            this.ruleform.scheduleTimeBeginStr=null;
            this.ruleform.scheduleTimeEndStr=null;
        }else{
            this.ruleform.backGroupTimeBeginStr=null;
            this.ruleform.backGroupTimeEndStr=null;
            this.ruleform.outGroupTimeBeginStr=null;
            this.ruleform.outGroupTimeEndStr=null;
            this.ruleform.scheduleTimeBeginStr=this.dataParam.dateStart;
            this.ruleform.scheduleTimeEndStr=this.dataParam.dateEnd;
        }
        this.$http.post(api_prefix + "Schedule/queryScheduleManagerList",this.ruleform).then(response => {
        let data = response.body;
        if(data.code == "0"){
            this.tableData=data.body.list;
            this.tableDataTotal = data.body.total;
        }else{
            this.$alert(data.message,"温馨提示",{type: 'error'});
        }
        },response => {
            this.$alert("获取表格数据失败","温馨提示",{type: 'error'});
        });
    },
    // 读取session(查询参数先从session里读取，如果没有则用默认参数)
    getSession(){
        if(window.sessionStorage.getItem("searchParams")!=null){
            let searchParams=JSON.parse(window.sessionStorage.getItem("searchParams"));
            this.dataParam.dateStart=searchParams.start;
            this.dataParam.dateEnd=searchParams.end;
            this.dataParam.dateType=searchParams.dataType;
            this.jdytabActive=searchParams.jdytabActive;
            this.ruleform.departureStatus=searchParams.jdytabActive;
            this.ruleform.searchContent=searchParams.keys;
            this.ruleform.currPage=searchParams.currPage;
            this.ruleform.pageSize=searchParams.pageSize;
            this.datePicker=[searchParams.start,searchParams.end];
            window.sessionStorage.removeItem("searchParams");
        }
    },
    // 页头切换
    jdytab(index) {
      if (index == null) {
        this.ruleform.departureStatus = '';
      } else {
        if(index == 5){
            this.ruleform.departureStatus = -1
        }else{
            this.ruleform.departureStatus = index;
        }
      }
      this.ruleform.costResultStatus = null;
      this.jdytabActive = index;
      this.getTableData();
    },
    //日期切换
    dateRangeChange(value) {
        if (value) {
            let values = value.split(" - ");
            this.dataParam.dateStart = values[0];
            this.dataParam.dateEnd = values[1];
        }else{
            this.dataParam.dateStart = null;
            this.dataParam.dateEnd = null;
        }
    },
    //分页
    handleCurrentChange(val) {
      if (val) {
        this.ruleform.currPage = val;
        this.ruleform.pageNum = val;
        this.getTableData();
      }
    },
    // 团期修改
    orderChange(val) {
      switch (val) {
        case "1":
            this.startGroup_submit();
            break;
        case "2":
            this.doneGroup_submit();
            break;
        case "3":
            this.getGroupCancel();
            break;
        case "4":
            this.cancelGroupObj.groupNo=this.rowData.groupNo;
            this.cancelGroupObj.line=this.rowData.routeName;
            this.cancelGroupObj.flag=true;
            break;
        case "5":
            this.getCostKeepingList();
            break;
        case "6":
            this.getCostKeeping();
            break;
        case "7":
            this.getCostKeepingList(7);
            break;
        case "8":
            this.getConfirmTourist(0)
            break;
        case "9":
            this.getConfirmTourist(1)
            break;            
      }
      this.$nextTick(function() {
        jdyFn.setAlertStyle("showtfcity");
      });
    },
    closeAlertBtn() {
        this.btnFlag = false;
        this.orderChangeType = [];
        this.cancelGroupObj.flag=false;
        this.cancelGroupObj.reason = null;
        this.cancelGroupObj.groupNo =null;
        $(".alertbgg").remove();
        this.getTableData();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    // 行点击事件
    handleRowChange(row) {
      console.log("行点击事件", row);
      this.logId = row.scheduleId;
      this.getLogData(1);
      this.rowData = row;
    },
    // 游客跳转
    getTouristInfo(id){
        // 保存查询参数
        let params={
            jdytabActive:this.jdytabActive,
            dataType:this.dataParam.dateType,
            start:this.dataParam.dateStart,
            end:this.dataParam.dateEnd,
            keys:this.ruleform.searchContent,
            currPage:this.ruleform.currPage,
            pageSize:this.ruleform.pageSize
        }
        window.sessionStorage.setItem("searchParams",JSON.stringify(params))
        this.$router.push({ name: "touristInfo", query: { sId: id } });
    },
    // 取消游客跳转
    getGroupCancel(){
        this.$router.push({ name: "groupCancel", query: { id: this.rowData.scheduleSettingId } });
    },
    // 取消游客跳转
    getCostKeeping(){
        this.$router.push({ name: "costKeeping", query: { scheduleId: this.rowData.scheduleId,scheduleSettingId:this.rowData.scheduleSettingId,productId:this.rowData.productId,c_id:this.ruleform.companyId,flag:2,status:0} });
    },
    //核算成本管理跳转
    getCostKeepingList(status){
        this.$router.push({ name: "costList", query: { scheduleId: this.rowData.scheduleId,productId:this.rowData.productId,c_id:this.ruleform.companyId,status:status } });
    },
    // type 0：确认出行游客  1：查看出行游客
    getConfirmTourist(type){
        this.$router.push({name:"touristConfirm",query:{type:type,id:this.rowData.scheduleSettingId}})
    },
    // 已取消数字
    getCancelNum(){
        this.$http.get(api_prefix + "Order/getNeedToDealCount").then(response => {
        let data = response.body;
        if(data.code == "0"){
            this.orderTotal=data.body;
        }else{
            this.$alert(data.message,"温馨提示",{type: 'error'});
        }
        },response => {
            this.$alert("获取已取消数量失败","温馨提示",{type: 'error'});
        });
    },
    /**@description 发团模块相关
     *
    */
    startGroup_submit(){
        this.$confirm('确认进行发团操作？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$http.get(api_prefix + "Schedule/startSchedule/"+this.rowData.scheduleSettingId).then(response => {
                let data = response.body;
                if(data.code == "0"){
                    this.getTableData();
                    this.$message.success("发团成功！");
                }else{
                    this.$alert(data.message,"温馨提示",{type: 'error'});
                }
                this.orderChangeType = [];
                },response => {
                    this.orderChangeType = [];
                    this.$alert("发团失败！","温馨提示",{type: 'error'});
                });
        }).catch(() => {
            this.orderChangeType = [];
        });
    },
    /**@description 取消团期模块相关
     *
    */
    cancelGroup_submit(){
        this.btnFlag = true;
        //取消原因为必填
        if (!this.cancelGroupObj.reason) {
            this.btnFlag = false;
            return this.$message.info("请填写取消团期原因！");
        } else {
            if (this.cancelGroupObj.reason.length > 100) {
                this.btnFlag = false;
                return this.$message.info("取消团期原因不要超过100个字！");
            }
        }
        let param={
            scheduleSettingId:this.rowData.scheduleSettingId,
            cancelComment:this.cancelGroupObj.reason
        }
        this.$http.post(api_prefix + "Schedule/cancelSchedule",param).then(response => {
            let data = response.body;
            if(data.code == "0"){
                this.$message.success("取消团期操作成功");
                this.getTableData();
            }else{
                this.$alert(data.message,"温馨提示",{type: 'error'});
            }
            this.closeAlertBtn();
        },response => {
            this.btnFlag = false;
            this.$alert("取消团期操作失败!","温馨提示",{type: 'error'});
        });
    },
    // 结团
    doneGroup_submit(){
        this.$confirm('确认进行结团操作？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$http.get(api_prefix + "Schedule/finishSchedule/"+this.rowData.scheduleSettingId).then(response => {
            let data = response.body;
            if(data.code == "0"){
                this.getTableData();
                this.$message.success("结团成功！");
                setTimeout(()=>{
                    this.$router.push({ name: "costKeeping", query: { scheduleId: this.rowData.scheduleId,scheduleSettingId:this.rowData.scheduleSettingId,productId:this.rowData.productId,c_id:this.ruleform.companyId } });
                },300)
            }else{
                this.$alert(data.message,"温馨提示",{type: 'error'});
            }
            this.orderChangeType = [];
            },response => {
                this.orderChangeType = [];
                this.$alert("结团失败！","温馨提示",{type: 'error'});
            });
        }).catch(() => {
            this.orderChangeType = [];
        });
    },
    gotoNotice(id){
        this.$router.push({ name: "groupNotice", query: { sId: id } });
    },
    /**@description 日志模块
     *
     */
    //关闭,打开日志弹窗
    alertJournal(alertJournalFlag) {
      if (!this.logId) { this.$alert("请选择一个团期"); return }
      this.alertJournalFlag = !this.alertJournalFlag
      if (this.alertJournalFlag) {
        this.$nextTick(function () {
          jdyFn.setAlertStyle('alertJournal');
        });
      }
    },
    //获取日志数据
    getLogData(index) {
      this.$http.post(api_prefix + 'logs/selectLogs?pageIndex=' + index + '&module=' + this.module + '&pid=' + this.logId
      ).then(response => {
        let _self = this;
        this.journalTotal = response.data.body.total;
        this.journalCurrentData = []
        response.data.body.list.forEach(function (value) {
          _self.journalCurrentData.push(value);
        });
      }, response => {
        console.log('获取日志出错了');
      });
    },
  },
    components: {
        jdyAlert,
        jdyLog
    },
    filters:{
        filterStatus(val){
            switch(val){
                case -1:
                    return "待确认出行";
                    break;
                case 0:
                    return "待发团";
                    break;
                case 1:
                    return "发团中";
                    break;
                case 2:
                    return "已结团";
                    break;
                case 3:
                    return "已回团";
                    break;
                case 4:
                    return "已取消";
                    break;
                default:
                    return "未获得数据"
            }
        }
    }
};
</script>

<style>
.jdy-tab div.yjk-number {
  display: inline-block;
  color: #ff7a33;
  height: inherit;
  position: absolute;
  bottom: 0;
  left: 70%;
}
.sPadding {
  padding: 20px 15px 0 15px;
  margin-bottom: 0;
}
.paddLeft {
  padding-left: 10px;
}
.flight{
    margin-bottom: 15px;
}
.flight>span{
    margin-right: 20px;
}
.sPadding .el-row{
    display: flex;
    justify-content: space-around;
}
.colorSpan{
    color: #467cd4;
    cursor: pointer;
}
</style>
