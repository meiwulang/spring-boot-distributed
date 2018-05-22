<template>
    <div class="jl-information">
        <div class="jdy-content fleft lv-creditBill">
            <div class="jdy-content-inner">
              <div class="jdy-tab">
                <el-button type="default" class="fright mt10 mr10" @click="goback('creditBill')">返回</el-button>
                <el-button type="default" class="fright mt10 mr10" @click="removeFn">移除订单</el-button>
              </div>
              <div id="ptintHtml">
                <div class="page-title">【杭州正太旅行社有限公司】信用对账单</div>
                <div class="table-wrap">
                  <table class="table-txt" cellspacing="0" cellpadding="0">
                    <tr>
                      <td>凭证编号：</td>
                      <td width="42%">W2017060742582693385</td>
                      <td>账单金额：</td>
                      <td width="42%">￥3000.00</td>
                    </tr>
                    <tr>
                      <td>单位名称：</td>
                      <td>15689784562</td>
                      <td>账单日期：</td>
                      <td>2016-12-12</td>
                    </tr>
                    <tr>
                      <td>应急电话：</td>
                      <td>尚品在线旅游(1)</td>
                      <td>账单日期：</td>
                      <td>2016-12-12</td>
                    </tr>
                    <tr>
                      <td>应急电话：</td>
                      <td>15689784562</td>
                      <td>查 看 者：</td>
                      <td>lvv</td>
                    </tr>
                    <tr>
                      <td>单位地址：</td>
                      <td>dniad f ad</td>
                      <td>打印时间：</td>
                      <td>2017-07-11 14:05:28</td>
                    </tr>
                  </table>
                </div>
                <div class="table-wrap">
                  <table class="table-custom detail-list" cellspacing="0" cellpadding="0">
                    <tr>
                      <th width="70%">订单详情</th>
                      <th width="20%">信用支付</th>
                      <th width="10%"></th>
                    </tr>
                    <tr class="tr-bg">
                      <td>金晶(金晶)18917548910</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        <p>
                          <span class="blue-font">JDY20178831011542</span><span class="green-font"> 订</span>：07-19 17：52
                          <span class="green-font"> 团</span>：2017-08-01 <span class="red-font">【退票】</span>
                        </p>
                        <p>1等1人报名参加2017-08-01出发的[jdyc204329732]韩国首尔4日自由行.初游推荐.经典热销.
                          赠接送1人</p>
                      </td>
                      <td>￥1990.00</td>
                      <td>
                        <el-checkbox></el-checkbox>
                      </td>
                    </tr>
                    <tr class="tr-bg">
                      <td >合计：
                        <span class="fr">大写：肆仟零壹拾圆整</span>
                      </td>
                      <td>￥4010.00</td>
                      <td></td>
                    </tr>
                  </table>
                </div>
                <p class="font-p">账单状态：已撤销</p>
              </div>
            </div>

        </div>
        <!--jdy-content end-->
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
      //返回
      goback(urlName) {
        this.$confirm('是否返回上一页？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({name:urlName,query:{id: this.$route.query.id}})
        }).catch(() => {

        });
      },
      //打印
      removeFn(){

      },
      getTableData(opt) {//更新table数据
          this.$http.post(api_prefix + '/News/list', {
              nType: this.changeTypeValue,
              searchKey: this.searchValue,
              pageSize: 20,
              currPage: this.currentPage
          }).then(response => {
              let data = response.data.body;
              this.tableData = data.list;
              this.tableDataTotal = data.total;
          }, response => {
              console.log('出错了');
          });
      },


    }
}
</script>

<style scoped>
  #ptintHtml{
    padding-top: 20px;
  }
  .page-title{
    text-align: center;
    font-size: 16px;
    color: #ffa600;
    padding: 10px 0;
  }
  .table-wrap{
  }
  .table-txt{
    width: 100%;
    margin: 20px 0;
    border: 0;
  }
  .table-txt tr td{
    border: 0;
    padding-top: 20px;
    color:#8691a1;
    line-height: 22px;
  }
  .table-txt tr td:first-child{
    width: 72px;
  }
  .table-txt tr td:nth-child(odd){
    text-align: right;
    min-width: 70px;
    border-color: #fff;
  }
  .table-txt tr td:nth-child(even){
    border-bottom: 1px solid #bfcbd9;
    padding-left: 5px;
    color: #1f2d3d;
  }
  .el-input.is-disabled .el-input__inner {
    background-color: #fff;
  }
  .table-wrap .table-title {
    line-height: 30px;
  }
  .table-custom td{
    vertical-align: middle;
  }
  .detail-list tr td{
    text-align: center;
  }
  .detail-list tr td:first-child{
    text-align: left;
  }
  .payRecord tr td:first-child{
    text-align: center;
  }
  .payRecord tr td:last-child{
    text-align: center;
  }
  .payRecord tr.tr-summary td:first-child{
    border-right:0;
    text-align: left;
  }
  .payRecord tr.tr-summary td:nth-child(2){
    border-right:0;
  }
  .font-p{
    margin-top: 20px;
    padding: 20px 0;
  }

</style>
