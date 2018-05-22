<template>
  <div class="jdy-content jdy-transfer fleft noborder jl-information">
    <div class="jdy-content-inner-trip">
      <el-row class="jdy-content-inner-trip border pt10 pl10 pr10">
        <inner-header :activename="headerData.name" :savebtn="headerData.btnFlag" :showTripTab="headerData.showBtnInTabFlag"></inner-header>
      </el-row>
      <!--jdy-content-trip end-->
      <div class="h20 mainbg"></div>
      <div class="ticketprice clearfix border relative">
        <div class="jdy-search jdy-search-bg2 clearfix ">
          <div class="p20 clearfix c5e fleft">
              <span class="c1f blod">产品名称：{{productDetail.pName}}</span>
              <span class="pl10 ">产品编号：{{productDetail.pNo}}</span>
              <span class="pl10 ">类型：{{productDetail.pType | filterProType }}</span>
              <span class="pl10 mr10">计调人员：{{productDetail.pContactName}}</span>
          </div>
        </div>
        <!--jdy-search end-->

        <!--jdy-table begin-->
        <div class="jdy-table p10 jl-onlinebill jl-ticket">
          <el-table :data="tableData" border class="all">
            <el-table-column label="序号" type="index" width="60">
            </el-table-column>
            <el-table-column label="出厂价类型" min-width="150">
              <template scope="scope">
                 {{ scope.row.type == 0?"成人票":"儿童票" }}
              </template>
            </el-table-column>
            <el-table-column label="出厂价名称" min-width="150">
              <template scope="scope">
                {{ scope.row.ticketName }}
              </template>
            </el-table-column>
            <el-table-column label="预算成本" min-width="150">
              <template scope="scope">
                {{ scope.row.costPrice }}
              </template>
            </el-table-column>
            <el-table-column label="出厂价" min-width="150">
              <template scope="scope">
                {{ scope.row.price }}
              </template>
            </el-table-column>
            <el-table-column label="适用时间" min-width="150">
              <template scope="scope">
                {{ scope.row.suitableStartTime }} - {{ scope.row.suitableEndTime }}
              </template>
            </el-table-column>
            <el-table-column label="始发站" min-width="350">
              <template scope="scope">
                {{ scope.row.departureNames | filterDeparture }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--jdy-table end-->
      </div>
      <!--ticketprice end-->
    </div>
    <!--jdy-content-inner end-->
  </div>
  <!--jdy-content end-->
</template>

<script>
// 通用tab页
import innerHeader from './header';
export default {
  name: 'ticketprice',
  data() {
    return {
      headerData:{
				name:"ProductDeployExfactoryPrice",
        btnFlag:false,
        showBtnInTabFlag:this.$route.query.tripFlag,
			},
      tableData: [], //列表数据 array
      currentPage: 1, //列表当前所在页,
      pageSize: 100,
      productDetail:{},
    }
  },
  mounted(){
    this.getTableData();
    this.getProductDetail();
  },
  methods: {
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
    // 更新table数据
    getTableData() {
      this.$http.post(api_prefix + '/factoryTicket/list',{
        productId: this.$route.query.id
      }).then(response => {
        let data = response.data.body;
        this.tableData = data.list;
        this.tableDataTotal = data.total;
      }, response => {
        console.log('出错了');
      });
    },
    goback(url) {
      this.$router.push({name:url,query:{id: this.$route.query.id}})
    }

  },
  filters: {
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
    filterDeparture(value){
      let stationName="";
      value.forEach((data)=>{
      stationName+=data+"，"
      })
      stationName=stationName.substr(0,stationName.length-1)
      return stationName;
      },
    },
  components: {
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
