<template>
  <div>
    <jdy-alert title="订单价格明细" @closeAlert="closeAlert" v-if="alertPriceDetailFlag" class="dialog-lv dialog-price-detail">
      <el-row class="scroll-cont table-wrap p10">
        <el-table :data="priceDetail"  border height="206" :summary-method="getSummaries" show-summary sum-text="小计">
          <el-table-column label="价格名称" prop="opPriceName"  width="140"></el-table-column>
          <el-table-column label="个数" prop="opNum" width="70"></el-table-column>
          <el-table-column label="单价" prop="opPrice" width="160" class-name="red-font">
            <template scope="scope">
              {{ scope.row.opPrice | moneyTwoPoints }}
            </template>
          </el-table-column>
          <el-table-column label="金额" prop="opTotalPrice" width="160" class-name="red-font">
            <template scope="scope">
              {{ scope.row.opTotalPrice | moneyTwoPoints }}
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="opRemark"></el-table-column>
        </el-table>
      </el-row>
    </jdy-alert>
  </div>
</template>

<script>
  import jdyAlert from '@/components/Alert';
  import orderApi from './../api/index';
  export default{
    components:{
      jdyAlert
    },
    props:['priceDetail'],
    data(){
      return{
        alertPriceDetailFlag:false,
      }
    },
    created(){
      const vm = this;
    },
    methods:{
      closeAlert(){ //关闭弹出框
        this.alertPriceDetailFlag = false;
        $('.alertbgg').remove();
      },
      priceDetailDialogShow(){
        this.alertPriceDetailFlag = true;
        this.$nextTick(function () {
          jdyFn.setAlertStyle('dialog-price-detail');
        })
      },
      //订单价格明细 弹窗
      getSummaries(param){
        const vm = this;
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '小计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              const prev1= Number(prev);
              if (!isNaN(value)) {
                return jdyFn.moneyTwoPoints(prev1 + curr);
              } else {
                return jdyFn.moneyTwoPoints(prev1);
              }
            }, 0);
            sums[index] = '￥' + sums[index];
          } else {
            sums[index] = '';
          }
        });
        return sums;
      },
    }

  }

</script>
<style scoped>
  .dialog-price-detail{
    width: 900px;
  }

</style>

