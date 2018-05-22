<template>
  <div class="jdy-content fleft">
    <div class="jdy-content-inner">
      <div class="jdy-tab">
        <el-form :model="searchForm" :inline="true" :rule="ruleSearchForm" ref="searchForm" class="ml10">
          <el-row class="search-row pt10">
            <el-form-item label="返佣等级：" prop="level">
              <el-select v-model="searchForm.level" placeholder="选择" class="select-m">
                <el-option v-for="item in levels" :key="item.value" :label="item.label" :value="item.value" >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="查询时间：" prop="dateRange">
              <el-date-picker v-model="searchForm.dateRange" type="datetimerange" placeholder="开始时间 - 结束时间" class="input-date-range" >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="快速搜索：" prop="searchValue">
              <el-input placeholder="手机号/姓名" v-model="searchForm.searchValue"></el-input>
            </el-form-item>
            <el-button type="primary" class="ml10 btnbg" @click="searchFn">搜索</el-button>
            <el-button type="default" class="ml10" @click="exportFn" :disabled="tableData.length==0 ?true:false">导出</el-button>
            <el-button type="default" class="ml10" @click="goBack" >返回</el-button>
          </el-row>
        </el-form>
      </div>

      <div class="jdy-table pt20">
        <el-table class="table-alignC" :data="tableData" border>
          <el-table-column type='index' label="序号" width="50"></el-table-column>
          <el-table-column label="姓名" prop="name" min-width="70"></el-table-column>
          <el-table-column label="手机号码" prop="phone" min-width="110"></el-table-column>
          <el-table-column label="返佣编号"  prop="code" min-width="130"></el-table-column>
          <el-table-column label="订单编号"  prop="orderNumber" min-width="190"></el-table-column>
          <el-table-column label="商品名称"  prop="productName" min-width="160"></el-table-column>
          <el-table-column label="数量"  prop="qty" min-width="50"></el-table-column>
          <el-table-column label="商品单价"  prop="price" min-width="100">
            <template scope="scope">
              {{ scope.row.price | moneyTwoPoints }}
            </template>
          </el-table-column>
          <el-table-column label="规则编号"  prop="promotionCode" min-width="120"></el-table-column>
          <el-table-column label="返佣类型"  prop="rebateTypeName" min-width="80"></el-table-column>
          <el-table-column label="返佣等级"  prop="level" min-width="80">
            <template scope="scope">
              {{ scope.row.level | levelTxt }}
            </template>
          </el-table-column>
          <el-table-column label="返佣金额"  prop="amount" min-width="80">
            <template scope="scope">
             {{ scope.row.amount | moneyTwoPoints }}
            </template>
          </el-table-column>
          <el-table-column label="百分比/金额"  prop="amountSuffix" min-width="100">
            <template scope="scope">
              <span v-if="scope.row.rebateType == '0'">百分比</span>
              <span v-if="scope.row.rebateType == '1'">金额</span>
            </template>
          </el-table-column>
          <el-table-column label="成交时间"  prop="tranTimeFormat" min-width="160"></el-table-column>
          <el-table-column label="结算状态"  prop="statusName" min-width="80">
            <template scope="scope">
              {{ scope.row.statusName }}
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
</template>

<script>
  import reportApi from './../api/index';
  import api_prefix from '@/assets/js/apiUrl';

  export default {
    name: 'agentReturnReport',
    data() {
      return {
        currentPage:1,
        pageSizeAll:15,
        tableDataTotal:0,
        levels:[{label:'选择',value:""},{label:'一级',value:1},{label:'二级',value:2},{label:'三级',value:3}],
        searchForm:{
          level:'',
          dateRange:[null,null],//时间范围初始为null
          dateStart:'',
          dateEnd:'',
          searchValue:''
        },
        ruleSearchForm:{

        },
        tableData:[],
        publicId:'',
        pid:'',
        accesstoken:'',
        time:''
      }
    },
    computed:{
      formDataStart:function(){
        const vm = this;
        const dateTimeRange = vm.searchForm.dateRange[0];
        if(dateTimeRange != null && typeof dateTimeRange != 'undefined' && dateTimeRange !='' ){
          return dateTimeRange.FormatDate('yyyy-MM-dd hh:mm:ss');
        }
        return '';
      },
      formDataEnd:function(){
        const vm = this;
        const dateTimeRange = vm.searchForm.dateRange[1];
        if(dateTimeRange != null && typeof dateTimeRange != 'undefined' && dateTimeRange !=''){
          return dateTimeRange.FormatDate('yyyy-MM-dd hh:mm:ss');
        }
        return '';
      }
    },
    mounted() {
      this.getTableData();
    },
    methods: {
      goBack(){
        this.$router.back(-1);
      },
      getSendData(){
        const vm = this;
        let sendData = {
          openId:vm.$route.query.openId,
          curPage:vm.currentPage,
          pageSize:vm.pageSizeAll,
          searchParam:vm.searchForm.searchValue.trim(),
        };
        if(vm.searchForm.level != ''){
          sendData.level = vm.searchForm.level;
        }
        if(vm.formDataStart != ''){
          sendData.startDate = vm.formDataStart;
        }
        if(vm.formDataEnd != ''){
          sendData.endDate = vm.formDataEnd;
        }
        return filterSendData(sendData,'delete');
      },
      exportFn() {
        const vm = this;
        let sendData =  vm.getSendData();
        sendData.url = '/zjqd-web/channels/sp/rebate/getRebateDetailList.do';
        sendData.curPage =1;
        sendData.pageSize = 10000;
        let prams = '';
        for(var key in sendData) {
          if(Object.prototype.hasOwnProperty.call(sendData,key)) { //过滤
            prams += key+'='+sendData[key]+'&';
          }
        } 
        prams = prams.substring(0, prams.length-1);
        let url = api_prefix.api_prefix+"exportRebateDetailList?"+prams;
        window.location.href=url;
      },
      //翻页
      handleCurrentChange(val){
        this.currentPage = val;
        this.getTableData();
      },
      searchFn(){
        this.getTableData();
      },
      getTableData(){
        const vm = this;
        let sendData =  vm.getSendData();
        sendData.url = '/zjqd-web/channels/sp/rebate/getRebateDetailList.do';
        reportApi.getEncodingParam(sendData).then((response) => {
          if(response.data.code == '0')
          {
            let data = response.data.body;
            if(data.resultList){
              vm.tableDataTotal = Number(data.rowsCount);
              vm.tableData = data.resultList;
            }
            else{
              vm.$alert('error')
            }
          }else{
            vm.$alert(response.data.message)
          }
        });
      },
    }

  }


</script>
<style scoped>



</style>



