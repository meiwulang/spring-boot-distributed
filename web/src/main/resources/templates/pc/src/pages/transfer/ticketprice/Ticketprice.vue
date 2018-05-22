<template>
  <div class="jdy-content jdy-transfer fleft noborder jl-information">
    <div class="jdy-content-inner-trip">
      <el-row class="jdy-content-inner-trip border p15 pl25">
        <el-col :span="16">
          <div class="jdy-content-trip">
            <el-steps :center="true" :align-center="true" :active="3">
              <el-step title="线路信息" icon="edit"></el-step>
              <el-step title="行程信息" icon="upload"></el-step>
              <el-step title="票价管理" icon="picture"></el-step>
              <el-step title="班期管理" icon="picture"></el-step>
            </el-steps>
          </div>
        </el-col>
        <el-col :span="8">
          <el-button class="fright mt10" @click="goback('List')">返回</el-button>
          <el-button type="primary" @click="onSubmitGo('Schedule')" class="fright mr10 mt10">下一步</el-button>
          <el-button class="fright mt10" @click="goback('Trip')">上一步</el-button>
        </el-col>
      </el-row>
      <!--jdy-content-trip end-->
      <div class="h20 mainbg"></div>
      <div class="ticketprice clearfix border relative">
        <div class="jdy-search jdy-search-bg2 clearfix ">
          <div class="p10 clearfix c5e">
            <p class="mt10 fleft">
              <span class="c1f blod">产品名称：{{productDetail.pName}}</span>
              <span class="pl10 ">产品编号：{{productDetail.pNo}}</span>
              <span class="pl10 ">类型：{{productDetail.pType | filterProType }}</span>
              <span class="pl10 mr10">计调人员：{{productDetail.pContactName}}</span>
            </p>
            <div class="fright">
              <div class="inlineblock mr10 w300 ">
                <el-input placeholder="票价名称" v-model="searchParams.tName" class="" @keyup.enter="searchTableData">
                  <!-- <el-button slot="append" icon="search" class="btnbg" @click="searchTableData" ></el-button> -->
                </el-input>
              </div>
              <el-button type="primary" @click="searchTableData" class="mr10 mt10">搜索</el-button>
             <!-- <el-button class="" @click="setDefaultPrice">设为默认价格</el-button>-->
              <el-button type="default" class="btnbg" @click="alertJournal">日志</el-button>
              <el-button type="default" class="btnbg" @click="updatePage" v-loading.fullscreen.lock="fullscreenLoading">刷新</el-button>
              <el-button type="primary" class="btnbg mr10" @click="addProduct(1)">添加票价</el-button>
              <!-- <el-dropdown split-button type="defult" class="mr10">
                <a id="to-line-page" href="javascript:;" @click="addProduct(1)">添加票价</a>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <span @click="addProduct(1)">单票添加</span>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <span @click="addProduct(2)">套票添加</span>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <span @click="addProduct(3)">批量添加</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
            </div>
          </div>
        </div>
        <!--jdy-search end-->

        <!--jdy-table begin-->
        <div class="jdy-table p10 jl-onlinebill jl-ticket">
          <el-table :data="tableData" style="text-again: center" class="mt20 all fatherList" default-expand-all>
            <el-table-column type="expand">
              <template scope="scope">
                <el-table :data="scope.row.tickList" border class="childBill inner-table" style="border:none" highlight-current-row @current-change="handleRowChange">
                  <el-table-column label="序号" type="index" width="109">
                  </el-table-column>
                  <el-table-column label="状态" min-width="80">
                   <template scope="scope">
                      <el-switch v-model="scope.row.tStatus" on-color="#71dc1c" :on-value="0" :off-value="1" on-text="" off-text="" @change="setStatus" @click.native="getRowId(scope.row.id)">
                      </el-switch>
                    </template>
                  </el-table-column>
                  <el-table-column label="票价名称" min-width="250">
                     <template scope="scope">
                      {{ scope.row.tName }}
                    </template>
                  </el-table-column>
                  <el-table-column label="类型" min-width="80">
                    <template scope="scope">
                      {{ scope.row.tTicketType==1?"套票":(scope.row.tType==0?"成人票":"儿童票") }}
                    </template>
                  </el-table-column>
                  <el-table-column label="门市价" min-width="80" v-if="productDetail.ascription==0">
                    <template scope="scope">
                      {{ scope.row.tMarketPrice }}
                    </template>
                  </el-table-column>
                  <el-table-column label="门市价/内部集结价" min-width="80" v-if="productDetail.ascription==1">
                    <template scope="scope">
                      {{ scope.row.tMarketPrice }}{{ "/"+scope.row.tGatherPrice }}
                    </template>
                  </el-table-column>
                  <el-table-column label="交通类目" min-width="80">
                    <template scope="scope">
                      {{ scope.row.tTicketType==0?scope.row.tTraffic:"---" }}
                    </template>
                  </el-table-column>
                  <el-table-column label="始发站" min-width="150">
                    <template scope="scope">
                      {{ scope.row.departureList }}
                    </template>
                  </el-table-column>
                  <el-table-column label="库存量" min-width="80">
                    <template scope="scope">
                      {{ scope.row.tStock==-1 ?"无限制" : scope.row.tStock}}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" min-width="140">
                    <template scope="scope">
                      <el-button type="default" size="mini" @click.native.prevent="editFare($route.query.id,scope.row.id,scope.row.tTicketType)">
                        编辑票价
                      </el-button>
                      <el-button type="default" class="red" size="mini" @click.native.prevent="deleteRow(scope.$index,tableData,scope.row.id)">
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column label="序号" width="60">
            </el-table-column>
            <el-table-column label="状态" min-width="80">
              <template scope="scope">
                <div style="display:inline-block;width:100%;text-align:left">
                  <span style="margin-right:10px" v-if="scope.row.amount > 0">{{scope.row.groupBy}}（{{scope.row.amount}}）</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="票价名称" min-width="250">
            </el-table-column>
            <el-table-column label="类型" min-width="80">
            </el-table-column>
            <el-table-column label="门市价/内部集结价" min-width="120" v-if="productDetail.ascription==1">
            </el-table-column>
            <el-table-column label="门市价" min-width="120" v-if="productDetail.ascription==0">
            </el-table-column>
            <el-table-column label="交通类目" min-width="80">
            </el-table-column>
            <el-table-column label="始发站" min-width="150">
            </el-table-column>
            <el-table-column label="库存量" min-width="80">
            </el-table-column>
            <el-table-column label="操作" min-width="140">
            </el-table-column>
          </el-table>
          <!-- 分页   begin-->
          <!-- <div class="clearfix">
            <el-pagination class="fright mt20" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="tableDataTotal">
            </el-pagination>
          </div> -->
          <!-- 分页   end-->

        </div>
        <!--jdy-table end-->
      </div>
      <!--ticketprice end-->

      <!--系统日志查看 弹窗  begin-->
      <jdy-alert title="系统日志查看" v-if="alertJournalFlag" @closeAlert="alertJournal" class="alertJournal">
        <jdy-log :alertJournalFlag="alertJournalFlag" :journalCurrentData="journalCurrentData" :journalTotal="journalTotal" :pid="focusPriceId" :module="module" @listenToChildEvent="alertJournal"></jdy-log>
      </jdy-alert>

    </div>
    <!--jdy-content-inner end-->
  </div>
  <!--jdy-content end-->
</template>

<script>
import jdyAlert from '@/components/Alert';
import jdyLog from '@/components/Log';
export default {
  name: 'ticketprice',
  data() {
    return {
      msg: 'Ticketprice',
      search: {
        "selectProduct": "",
        "addProduct": "",
        "selectProduct_select": ""
      },
      /*产品详情*/
      productDetail:{},
      /*限制条件*/
      limits:null,
      searchParams: {
        "currPage": 1,
        "pageSize": 100,
        "flag": 2,
        // "tCompanyId": 195,
        "tName": "",
        "tProductId": this.$route.query.id,
        tCompanyId:null
      },
      //用于传默认价格的票价id和oldid
      focusPriceId:null,
      tableDataTotal: 0,
      /*票价添加*/
      tickForm: {
        "userId": 123,
        "tCompanyId": 123,
        "tProductId": this.$route.query.id,
        "tTicketType": 0,
        "tType": '', //票价类型
        "tName": '',//票价名称
        "tLimitType": '',//限制类型
        "tLimitCondition": '',//限制条件
        "tCategory": "",//票价类目
        "tTraffic": "",//交通类目
        "tMarketPrice": '',//门市价
        "tPeerPrice": '',//同行价
        "tPriceAdd": '',//补房差
        "tPriceReduce": '',//退房差
        "tStock": '',//库存量
        "tIntroduction": '',//票价简介
        "ticketDepartureList": [
          {
            "ticketId": 1,
            "departueId": ''
          }
        ],
        "ticketAreaList": [
          {
            "taTicketId": 1,
            "taCountry": 'CN',
            "taProvince": '山东',
            "taCity": ''
          }
        ]
      },
      /*校验*/
      rules: {
        tName: [{ required: true, message: '请输入票价名称', trigger: 'blur' }],
        tType: [{ required: true, message: '请输入票价类型', trigger: 'change' }],
        tTraffic: [{ required: false, message: '请输入交通类目', trigger: 'change' }],
        tMarketPrice: [{ required: true, message: '请输入门市价', trigger: 'blur' }],
        tPeerPrice: [{ required: true, message: '请输入同行价', trigger: 'blur' }],
        tEffectWeek: [{ type: 'array', required: true, message: '请选择周几有效', trigger: 'change' }],
        /*校验list集合非空*/
        ticketAreaList: [{}],
        ticketDepartureList: [{}]
      },
      /*添加套票*/
      tickForm2: {
        "tType": "", //票价类型
        "tName": "",//票价名称
        "tLimitType": "",//限制类型
        "tCategory": "",//票价类目
        "tTraffic": "",//交通类目
        "tLimitCondition": "",//限制条件
        "tMarketPrice": 1,//门市价
        "tPeerPrice": 2,//同行价
        "tPriceAdd": 3,//补房差
        "tPriceReduce": 3,//退房差
        "tStock": 1,//库存量
        "tEffectWeek": [],//周几有效
        "sets": "",//投放市场
        "departureList": "",//始发站
        "tIntroduction": ""//票价简介
      },
      rules2: {
        tType: [{ required: true, message: '请输入票价类型', trigger: 'change' }],
        tName: [{ required: true, message: '请输入票价名称', trigger: 'blur' }],
        tTraffic: [{ required: true, message: '请输入交通类目', trigger: 'change' }],
        tPeerPrice: [{ required: true, message: '请输入同行价', trigger: 'blur' }],
        tEffectWeek: [{ required: true, message: '请选择周几有效', trigger: 'change' }],
        tMarketPrice: [{ required: true, message: '请输入门市价', trigger: 'blur' }],
        sets: [{ required: true, message: '请输入投放市场', trigger: 'blur' }]
      },
      /*批量添加*/
      tickForm3: [{
        "tType": "", //票价类型
        "tName": "",//票价名称
        "tLimitType": "",//限制类型
        "tCategory": "",//票价类目
        "tTraffic": "",//交通类目
        "tLimitCondition": "",//限制条件
        "tMarketPrice": 1,//门市价
        "tPeerPrice": 2,//同行价
        "tPriceAdd": 3,//补房差
        "tPriceReduce": 3,//退房差
        "tStock": 1,//库存量
        "tEffectWeek": [],//周几有效
        "sets": "",//投放市场
        "departureList": "",//始发站
        "tIntroduction": ""//票价简介
      }],
      /*批量添加一行*/
      tickForm3Obj: {
        "userId": 123,
        "tCompanyId": 123,
        "tProductId": 123,
        "tTicketType": 0,
        "tType": '', //票价类型
        "tName": '123',//票价名称
        "tLimitType": '',//限制类型
        "tLimitCondition": '',//限制条件
        "tCategory": "",//票价类目
        "tTraffic": "",//交通类目
        "tMarketPrice": '',//门市价
        "tPeerPrice": '',//同行价
        "tPriceAdd": '',//补房差
        "tPriceReduce": '',//退房差
        "tStock": '',//库存量
        "tEffectWeek": [],//周几有效
        "tIntroduction": '',//票价简介
        "ticketDepartureList": [
          {
            "ticketId": 1,
            "departueId": ''
          }
        ],
        "ticketAreaList": [
          {
            "taTicketId": 1,
            "taCountry": 'CN',
            "taProvince": '山东',
            "taCity": ''
          }
        ]
      },
      rules3: {},
      tableData: [], //列表数据 array
      // journalCurrentData: {}, //日志数据ww
      currentPage: 1, //列表当前所在页,
      pageSize: 100,

      addProductFlag1: false,
      addProductFlag2: false,
      addProductFlag3: false,

      /*添加套票列表数据*/
      tableData3: [{
        tStatus: '1',
        tName: '王小虎',
        tsSeats: 3,
        tType: 1,
        tMarketPrice: 1,
        tPeerPrice: 1,
        tEffectWeek: '周一',
        tLimitType: '2',
        tLimitCondition: '1',
        updateTime: '2017-07-02'
      }],
      multipleSelection: [],
      multipleSelection3: [],
			// 刷新
			fullscreenLoading:false,
      /*票价类目(基础)*/
      baseCategory:[],
      /*日志相关*/
      module: "Ticket",
      journalTotal: 0,
      journalCurrentData: [], //日志数据
      alertJournalFlag: false, //系统日志查看 弹窗值
      journalStyle: { //系统日志弹窗位置
        top: '164px',
        left: '300px'
      },
      booleanValue: {on: 0, off: 1}, //状态控制on/off 的value
      logId:''
    }
  },
  mounted(){
    this.getTableData();
    this.getProductDetail();
    this.getCategory();
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 获取产品详情
    getProductDetail(){
        let httpdata={
          id: this.$route.query.id,
          lineType: 0
        }
        this.$http.post(api_prefix+'product/detail',httpdata).then(response => {
          if(response.data.code==0){
            this.productDetail=response.data.body.body.product
          }else{
            this.$alert(response.data.message);
          }
        }, response => {
          console.log('获取产品详情出错了');
        });
    },
    // 编辑票价  __tTicketType:0单票，1套票
    editFare(_id,_priceid,_tTicketType){
      if(_tTicketType==0){
          this.$router.push({name:'Addfare',query:{id: _id,priceId: _priceid,type:1}})
      }else{
          this.$router.push({name:'Ticketmanagement',query:{id: _id,priceId: _priceid,type:1}})
      }
    },
    //设置默认价格
    setDefaultPrice(){
      if(this.focusPriceId==null){
        this.$alert("请选择一个票价")
      } else{
        let httpdata={
          id:this.focusPriceId,
          tProductId: this.$route.query.id,
          // tStatus: 0
        }
        this.$http.post(api_prefix+'ticket/default',httpdata).then(response => {
          this.$alert(response.data.message);
          this.getTableData();
          // this.focusPriceId=null;
        }, response => {
          console.log('设置默认价格出错了');
        });
      }
    },
      // 获取票价类目
      getCategory(){
          this.$http.post(api_prefix + 'Dictionaries/dictList',{dGroupId: 111}).then(response => {
              if(response.data.code == 0){
                  let lists=response.body.body;
                  lists.forEach(data=>{
                      this.baseCategory.push({id:data.id,name:data.dName});
                  });
              }else{
                  this.$alert("获取票价类目失败");
              }
          },response=>{
              console.log("获取票价类目失败！")
          });
      },
      //票价类目转换
      filterCategory(value){
        var temp=[];
        if(value==""){
          value="---"
        }else{
          temp=this.baseCategory.filter(data=>{
              return value==data.id
          })
        }
        return temp.length!=0?temp[0].name:value
      },
      getRowId(id){
        this.focusPriceId = id;
        console.log(this.focusPriceId,'this.focusPriceId')
      },
    // 修改票价状态
    setStatus(value){
      console.log(value,'status')
        this.$http.post(api_prefix+'ticket/status',{
          id:this.focusPriceId,
          tStatus:value
        }).then(response => {
          if(response.data.code==0){
            this.getTableData();
          }else{
            this.$message.error('票价状态修改失败');
          }
        }, response => {
          console.log('修改票价状态出错了');
        });
    },
    // 获取限制条件
    getLimits(value){
        this.tickForm.tLimitCondition="";
        this.limits=value;
    },
    // 删除
    deleteRow(index,rows,_id) {
      this.$confirm('是否删除该票价？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        rows.splice(index, 1);
        let httpdata={
          id:_id,
          // tProductId: this.$route.query.id,
          tStatus:2,
        }
        this.$http.post(api_prefix+'ticket/status',httpdata).then(response => {
            if(response.data.code==0){
              this.getTableData();
            }else{
              this.$message.error('票价删除失败');
            }
          // this.$alert(response.data.message);
          this.getTableData();
        }, response => {
          console.log('票价删除出错了');
        });
      }).catch(() => {

      });
    },
    /*快速搜索*/
    searchTableData() {
      this.searchParams.currPage=1;
      this.currentPage=1;
      this.getTableData()
    },
    //----------日志相关逻辑 start-----
    //关闭,打开日志弹窗
    alertJournal(alertJournalFlag) {
      if (!this.logId) { this.$alert("请选择一个票价"); return }
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
        // this.journalCurrentData=response.data.body.list
      }, response => {
        console.log('获取日志出错了');
      });
    },
    //table行点击事件
    // rowclickHandler(row, event, column) {
    //   this.focusPriceId = row.id;
    //   //if (!this.companyId) { this.companyId = row.companyId }
    //   this.tripDays = row.pDays;
    //   this.getLogData(1)
    //   this.getProductsKeywords()
    //   this.getAllProductsKeywords()
    // },
    //----------日志相关逻辑 end-----
		// 刷新
		updatePage(){
			this.fullscreenLoading = true;
      this.searchParams={
        "currPage": 1,
        "pageSize": 100,
        "tName": "",
        "tProductId": this.$route.query.id,
        "flag": 2,
      },
			setTimeout(()=>{
				this.fullscreenLoading = false;
				this.$message({
					showClose: true,
					message: '刷新成功',
					type: 'success'
        });
        this.currentPage=1;
        this.getTableData();
			})
		},
    // 更新table数据
    getTableData() {
      this.searchParams.tCompanyId=JSON.parse(sessionStorage.loginData).uCompanyId;
      this.$http.post(api_prefix + 'ticket/outList', this.searchParams).then(response => {
        let data = response.data.body;
        data.list.forEach((date)=>{
          date.tickList.forEach((value)=>{
            // 票价类目转换
            value.tCategory=this.filterCategory(value.tCategory);
            // 套票中无数据部分设为---
            switch(value.tTraffic){
              case 0:
                value.tTraffic= "飞机";
                break;
              case 1:
                value.tTraffic= "火车";
                break;
              case 2:
                value.tTraffic= "汽车";
                break;
              case 3:
                value.tTraffic= "邮轮";
                break;
            }
            // 限制条件转换
            if(!value.tLimitType || value.tLimitType==""){
              value.tLimitType=99;
              value.tLimitCondition="---"
            }else{
              switch(value.tLimitType){
                case 0:
                  value.tLimitCondition="无"
                  break;
                case 1:
                  value.tLimitCondition="实名"
                  break;
                case 2:
                  if(value.tLimitCondition==0){
                    value.tLimitCondition="男"
                  }else{
                    value.tLimitCondition="女"
                  }
                  break;
                case 3:
                  break;
              };
            }
            //解析出始发站
            if(value.departureList.length==0){
              value.departureList="未设置"
            }else{
              let tempSF=[];
              value.departureList.forEach((data)=>{
                tempSF.push(data.dName)
              });
              value.departureList=tempSF.join(",");
            }
          })
        })
        this.tableData = data.list;
        this.tableDataTotal = data.total;
      }, response => {
        console.log('出错了');
      });
    },
    addProduct(value) {
      var alertClass = '';
      if (value == 1) {//1.票价添加 2.添加套票  3.批量添加
        //  location.href = api_prefix+'/transfer.html#/ticketprice/addfare';
         this.$router.push({name:'Addfare',query:{id: this.$route.query.id}})
      }
      if (value == 2) {
        // location.href = api_prefix+'/transfer.html#/ticketprice/tickedmange';
        this.$router.push({name:'Ticketmanagement',query:{id: this.$route.query.id}})
      }
      if (value == 3) {
        // location.href = api_prefix+'/transfer.html#/ticketprice/batchfare';
        this.$router.push({name:'Batchfare',query:{id: this.$route.query.id}})
      }
      if (this.addProductFlag1 || this.addProductFlag2 || this.addProductFlag3) {
        this.$nextTick(function () {
          jdyFn.setAlertStyle(alertClass);
          // this.search.addProduct = '';
        });
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName == 'tickForm') {
            /*console.log('this.tickForm.departureList[0].dName',this.tickForm.departureList[0].dName);
            console.log('this.tickForm.ticketAreaList[0].taCity',this.tickForm.ticketAreaList[0].taCity);*/
            this.$http.post(api_prefix+'/ticket/save', this.tickForm).then(response => {
              let code = response.data.code;
              alert(code);
              /*跳转页面*/
              this.$router.go({
                name: 'Ticketprice'
              })
            }, response => {
              console.log('添加票价出错了');
            });
          }
          if (formName == 'tickForm2') {
            this.$http.post(api_prefix+'/ticket/save', this.tickForm2).then(response => {
              let code = response.data.code;
              alert(code);
              this.$router.go({
                name: 'Ticketprice'
              })
            }, response => {
              console.log('添加套票出错了');
            });
          }
          if (formName == 'tickForm3') {
            this.$http.post(api_prefix+'/ticket/saveBash', this.tickForm3).then(response => {
              let code = response.data.code;
              alert(code);
              this.$router.go({
                name: 'Ticketprice'
              })
            }, response => {
              console.log('批量添加出错了');
            });
          }

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleCurrentJournalChange(index) { //日志  page
      var index = index - 1;
      //this.journalCurrentData = listData.journalData[index]
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // console.log("handleCurrentChange:",val)
      if (val) {
        this.searchParams.currPage = val;
        this.searchParams.pageNum = val;
        this.getTableData();
        //console.log(`当前页: ${val}`);
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
    ,
    handleSelectionChange3(val) {
      this.multipleSelection3 = val;
    },
    // 列表行选中事件 todo
    handleRowChange(val){
      this.logId = val.id;
      this.getLogData(1);
    },
    // 提交修改 todo
    onSubmitGo(url){
      this.$router.push({name:url,query:{id: this.$route.query.id}})
    },
    goback(url) {
      this.$router.push({name:url,query:{id: this.$route.query.id}})
    }

  },
  filters: {
    filterType(value){
      if(value==0){
        return "单票";
      }else if(value==1){
        return "套票";
      }else{
        return "未设置";
      }
    },
    filterProType(value){
      if(value==null|10|20|30|40|50){
        switch(value){
          case null:
            return "全部类型";
            break;
          case 10:
            return "周边短线";
            break;
          case 11:
            return "国内长线";
            break;
          case 20:
            return "出境旅游";
            break;
          case 30:
            return "邮轮";
            break;
          case 40:
            return "特色游";
            break;
          case 50:
            return "自助游";
            break;
          case 67:
            return "单一资源+拍";
            break;
        }
      }else{
        return "未设置"
      }
    },
    filterLimitType(value){
      if(value==0|1|2|3|99){
        switch(value){
          case 0:
            return "无限制";
            break;
          case 1:
            return "实名制";
            break;
          case 2:
            return "限制性别";
            break;
          case 3:
            return "限制年龄";
            break;
          case 99:
            return "---";
            break;
        }
      }else{
        return "未设置"
      }
    },
    filterEffectWeek(value){
      if(value=="0000000"){
        return "未设置"
      }else{
        let weekArray=[];
        let week_lib={
            0:"一",
            1:"二",
            2:"三",
            3:"四",
            4:"五",
            5:"六",
            6:"日"
        };
        let weeklist=value.split("");
        for(let k=0;k<weeklist.length;k++){
            weeklist[k]==1&&weekArray.push(week_lib[k])
        };
        return weekArray.join(" ")
      }
    },

  },
  computed: {
    // journalTotal() { //日志页数
    //   return 50
    // },
    // tableDataTotal() { //列表页数
    //   return 500
    // }
  },
  components: {
    jdyAlert,
    jdyLog
  },

}
</script>

<style>
.alertAddProduct{
  width: 1640px;
}
#to-line-page{
  color: #000;
  line-height: 14px;
  padding: 0;
}
</style>
