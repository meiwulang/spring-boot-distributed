<template>
  <div class="jdy-content jdy-transfer fleft">

    <div class="jdy-content-inner">
      <el-row class="jdy-content-inner-trip border p15 pl25">
        <el-col :span="16">
          <div class="jdy-content-trip">
            <el-steps :center="true" :align-center="true" :active="1">
              <el-step title="线路信息" icon="edit"></el-step>
              <el-step title="票价管理" icon="picture"></el-step>
              <el-step title="班期管理" icon="picture"></el-step>
            </el-steps>
          </div>
        </el-col>
        <el-col :span="8">
          <el-button class="fright mt10" @click="goback">返回</el-button>
          <el-button type="primary" @click="onSubmitGo" class="fright mr10 mt10" :disabled="btnFlag">下一步</el-button>
        </el-col>
      </el-row>
      <!--jdy-content-trip end-->
      <div class="h20 mt10"></div>
      <el-form :model="ruleForm" :inline="true" ref="ruleForm" label-width="100px">
          <el-row style="width: 100%;">
            <el-select v-model="ruleForm.pType" placeholder="请选择类型" class="jdy-search-edit hasbg mr10">
              <el-option v-for="(key,value) in typeList" :label="key" :value="value" :key="value">
              </el-option>
            </el-select>
                <!-- v-show='uDataLimit == 3' -->
            <el-select v-model="ruleForm.companyId" clearable placeholder="请选择单位名称" class="jdy-search-edit hasbg mr10">
              <el-option :key="value.id" v-for="value in selectList" :label="value.cName" :value="value.id">
              </el-option>
            </el-select>
            <el-input v-model.trim="ruleForm.pName" placeholder="请输入产品名称查询" class="jdy-search-edit hasbg mr10"></el-input>
            <el-input v-model.trim="ruleForm.startStation" placeholder="请输入出发地查询" class="jdy-search-edit hasbg mr10"></el-input>
            <el-button type="primary" @click="firstSearch" class="btnInTab">搜索</el-button>
          </el-row>
      </el-form>
      <div class="jdy-table">
        <el-table :data="tableData" border class="all" style="margin-top:20px;text-align:center" highlight-current-row @row-click="rowclickHandler">
          <el-table-column label="产品编号">
              <template scope="scope">
                  <span class="jl-noticeTitle">{{scope.row.pNo}}</span>
              </template>
          </el-table-column>
          <el-table-column prop="aTitle" label="产品名称">
            <template scope="scope">
              <div style="text-align:left;padding:10px 0 10px 30px;">
                <a :href="h5Url" target="_blank"><span @click="gotoH5(scope.row.id)" style="color:#20a0ff">{{ scope.row.pName }}</span></a>
                <span v-for="(item,index) in scope.row.productKeys" :key="item.id">
                  <span v-if="index==0">
                    <br/>
                  </span>
                  <span class="jl-noticeTitle bkone" v-if='item.kColor == 0'>{{item.kName}}</span>
                  <span class="jl-noticeTitle bktwo" v-if='item.kColor == 1'>{{item.kName}}</span>
                  <span class="jl-noticeTitle bkthree" v-if='item.kColor == 2'>{{item.kName}}</span>
                  <span class="jl-noticeTitle bkfour" v-if='item.kColor == 3'>{{item.kName}}</span>
                  <span class="jl-noticeTitle bkfive" v-if='item.kColor == 4'>{{item.kName}}</span>
                  <span class="jl-noticeTitle bksix" v-if='item.kColor == 5'>{{item.kName}}</span>
                  <span class="jl-noticeTitle bkseven" v-if='item.kColor == 6'>{{item.kName}}</span>
                  <span class="jl-noticeTitle bkeight" v-if='item.kColor == 7'>{{item.kName}}</span>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="templateTitle" label="电子合同">
            <template scope="scope">
              <span>{{ scope.row.templateTitle!=null?scope.row.templateTitle:(scope.row.offlineSignStatus==1?"线下签署":"--") }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pDays" label="天数" width="100">
            <template scope="scope">
              <span>{{scope.row.pDays}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pContacts" label="客服">
            <template scope="scope">
              <span class="jl-noticeTitle">{{scope.row.pContacts}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pType" label="产品类型">
            <template scope="scope">
              <span v-for="(key,value) in typeList" :key="key">
                <span v-if="scope.row.pType==value" >{{key}}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="pUpdateTime" label="编辑时间">
            <template scope="scope">
              <span class="jl-noticeTitle">{{scope.row.pUpdateTime | dateFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pStatus" label="状态">
            <template scope="scope">
              <span v-if="scope.row.pStatus==3">已入库</span>
              <span v-else-if="scope.row.pStatus==0">已发布</span>
              <span v-else>待入库</span>
            </template>
          </el-table-column>
          <el-table-column prop="pSort" label="排序">
            <template scope="scope">
              <span class="jl-noticeTitle">{{scope.row.pSort}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="companyName" label="产品所属">
            <template scope="scope">
              <span class="jl-noticeTitle">{{scope.row.companyName}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页   begin-->
      <div class="clearfix">
        <el-pagination class="fright mt20" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="tableDataTotal">
        </el-pagination>
      </div>
      <!-- 分页   end-->
    </div>
  </div>
</template>

<script>
export default {
  name: "line",
  data() {
    return {
      tableDataTotal:0,
      currentPage: 1, //列表当前所在页,
      pageSize: 10,
      h5Url:'',
      btnFlag: false,
      assemblyPid:'',
      currentRow:'',
      choseRow:'',
      ruleForm: {
        companyId: null,
        pName: null,
        pType: "0",
        pageSize: 10,
        currPage: 1,
        startStation:null
      },
      tableData:[],
      uDataLimit:'',
      //
      companyId:'',
      selectList:[],
      //
      typeList: {
        "0": "全部类型",
        "10": "周边短线",
        "11": "国内长线",
        "20": "出境长线",
        "21": "出境短线",
        "30": "邮轮",
        "50": "自由行",
        "51": "出境海岛",
        "52": "定制旅游",
        "54": "团队会奖",
        "55": "签证服务",
        "56": "机票预订",
        "57": "酒店预订",
        "58": "单项委托",
        "59": "其他服务",
        "60": "户外拓展",
        "61": "游学/研学",
        "62": "自驾游",
        "63": "全球旅拍",
        "64": "旅游金融",
        "65": "旅游地产",
        "66": "亲子",
        "67": "单一资源+拍"
      },
    };
  },
  methods: {
    //产品预览
    gotoH5(id) {
      var urlHead = "";
      if (location.host == "b2b.fingercrm.cn") {
        urlHead = "http://b2b.fingercrm.cn";
      } else {
        urlHead = "http://b2b.test.fingercrm.cn";
      }
      this.h5Url =
        urlHead + "/wap/m/detail.html?" + "p_id=" + id + "&from=preview";
      console.log(this.h5Url, "this.h5Url");
    },
    //初始化所属单位
    defaultSelectList(name) {
      let url = api_prefix + "/Company/index";
      let data = { pageIndex: 1 ,pid:343 ,searchType:1};
      this.$http.post(url, data, { emulateJSON: true }).then(response => {
        let listData = response.body.body.list;
        this.selectList = listData;
        console.log(this.selectList, "this.selectList");
      });
    },
    //选中某一行
    rowclickHandler(val) {
        // this.currentRow = val;
        console.log(val,'09090909')
        this.assemblyPid = val.id
        if(val){
          this.choseRow = 1;
        }else{
          this.choseRow = 0;
        }
    },
    handleCurrentChange(val) {
      if (val) {
        this.ruleForm.currPage = val;
        this.getTableData();
      }
    },
    //更新table数据
    getTableData() {
       let params= JSON.parse(JSON.stringify(this.ruleForm)) ;
        if( params.pType=='0'){
          delete params.pType
        }
      this.$http
        .post(api_prefix + "/aggr/area-productlist", params)
        .then(
          response => {
            let data = response.data.body;
          this.tableData = data.resultList;
          this.tableDataTotal = data.totalNum;
          },
          response => {
            console.log("出错了");
          }
        );
    },
    //查询
    firstSearch(){
      this.getTableData();
    },
    //返回
    goback() {
      this.$confirm("数据未保存，是否关闭？", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          location.href = "/transfer.html#/assemblylist";
        })
        .catch(() => {});
    },
    //下一步
    onSubmitGo() {
      if(this.choseRow == 1){
        this.btnFlag = true;
        this.$http
          .post(api_prefix + "/ticket/copyGatherTickets",{
            productId: this.assemblyPid
          })
          .then(
            response => {
              if (response.body.code == 0) {
                this.btnFlag = false;
                this.$router.push({ name: "assemblyTicketprice", query:{id:this.assemblyPid} });
              } else {
                this.btnFlag = false;
                this.$alert(response.data.message, "温馨提示", {
                  confirmButtonText: "确定",
                  callback: action => {}
                });
              }
            },
            response => {
              this.btnFlag = false;
              console.log("出错了");
            }
          );
      }else{
        this.$message.error('请先选择一个产品！');
      }
    }
  },
  mounted() {
    let logindata = JSON.parse(sessionStorage.loginData);
    this.uDataLimit = logindata.uDataLimit;
    console.log("登录", JSON.parse(sessionStorage.loginData));
    this.defaultSelectList();
    this.getTableData();
  }
};
</script>
