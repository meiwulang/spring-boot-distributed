<template>
  <div class="jdy-content jdy-transfer fleft noborder jl-information">
    <div class="jdy-content-inner-trip">
      <el-row class="jdy-content-inner-trip border pl10 pt10 pr10">
        <inner-header :activename="headerData.name" :savebtn="headerData.btnFlag" :showTripTab="headerData.showBtnInTabFlag" title="添加出厂价" @savedata="addProduct(1)"></inner-header> 
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
              <!-- <div class="inlineblock mr10 w300 ">
                <el-input placeholder="票价名称" v-model="searchParams.tName" class="" @keyup.enter="searchTableData">
                </el-input>
              </div>
              <el-button type="primary" @click="searchTableData" class="mr10 mt10">搜索</el-button> -->
              <!-- <el-button type="primary" @click="addProduct(1)">添加出厂价</el-button> -->
            </div>
          </div>
        </div>
        <!--jdy-search end-->

        <!--jdy-table begin-->
        <div class="jdy-table p10 jl-onlinebill jl-ticket">
          <el-table :data="tableData" style="text-again: center">
            <el-table-column label="序号" type="index" width="60">
            </el-table-column>
            <el-table-column label="票价类型" width="">
                <template scope="scope">
                    {{ scope.row.type==1?"儿童票":"成人票" }}
                </template>
            </el-table-column>   
            <el-table-column label="票价名称" width="">
                <template scope="scope">
                    {{ scope.row.ticketName }}
                </template>
            </el-table-column> 
            <el-table-column label="预算成本" width="">
                <template scope="scope">
                    {{  scope.row.costPrice |moneyTwoPoints }}
                </template>
            </el-table-column>   
            <el-table-column label="出厂价" width="">
                <template scope="scope">
                    {{ scope.row.price |moneyTwoPoints }}
                </template>
            </el-table-column>  
            <el-table-column label="适用时间" min-width="120">
                <template scope="scope">
                    {{ scope.row.suitableStartTime==null?"未设置":scope.row.suitableStartTime+" 至 "+scope.row.suitableEndTime }}
                </template>
            </el-table-column>   
            <el-table-column label="始发站" min-width="150">
                <template scope="scope">
                    {{ scope.row.departureNames | filterDeparture }}
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
          <!-- 分页   begin-->
          <div class="clearfix">
            <el-pagination class="fright mt20" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="tableDataTotal">
            </el-pagination>
          </div>
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
// 通用tab页
import innerHeader from './header';

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
      logId:'',
      headerData:{
        name:"declareConfigTicketPrice",
        btnFlag:true,
        showBtnInTabFlag:this.$route.query.tripFlag,
      }        
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
      this.$router.push({name:'declareConfigAddfare',query:{id: _id,priceId: _priceid,type:1,c_id:this.$route.query.c_id}})
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
        this.$http.get(api_prefix+'factoryTicket/delete/'+_id).then(response => {
            if(response.data.code==0){
              this.getTableData();
            }else{
              this.$message.error('票价删除失败');
            }
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
      // this.searchParams.tCompanyId=JSON.parse(sessionStorage.loginData).uCompanyId;
      this.$http.post(api_prefix + 'factoryTicket/list', {productId:this.$route.query.id}).then(response => {
        let data = response.data.body;
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
         this.$router.push({name:'declareConfigAddfare',query:{id: this.$route.query.id,c_id:this.$route.query.c_id}})
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
    filterDeparture(value){
      let stationName="";
      value.forEach((data)=>{
        stationName+=data+"，"
      })
      stationName=stationName.substr(0,stationName.length-1)
      return stationName;
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

  },
  components: {
    jdyAlert,
    jdyLog,
    innerHeader
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
