<template>
  <div id="app" class="jdy-wrap">
    <jdy-nav></jdy-nav>
    <div id="jdyMain" class="jdy-main fleft">
      <div class="jdy-main-scroll">
      <jdy-header></jdy-header>
      <transition>
        <router-view></router-view>
      </transition>
      </div>
    </div>
  </div>
</template>

<script>
import jdyHeader from '@/components/Header'
import jdyNav from '@/components/Nav'
export default {
  name: 'app',
  components: {
    jdyHeader,
    jdyNav
  }
}
</script>
<style>
  /* 调整座位 */
  .dialog-seat-change{
    width: 500px;
  }
  .dialog-seat-change .jdyalert-title{
    margin-top: -1px;
  }
  .dialog-seat-change .dialog-title-custom{
    width: auto;
    max-width:480px ;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 36px;
    white-space: nowrap;
  }
  .dialog-seat-change .red-tag{
    padding: 10px;
    line-height: 22px;
    text-align: left;
    margin-bottom: 20px;
  }
  .seat-wrap{
    line-height: 38px;
  }
  .seat-wrap span{
    vertical-align: top;
    display: inline-block;
    width:43px;
    height: 38px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .seat-wrap span::selection { background-color:transparent; }
  .seat-wrap span::-moz-selection { background-color:transparent; }
  /* 接送站点选择 弹窗*/
  .dialog-pickup-station{
    width: 980px;
  }
  .pickupStationTable tr td:first-child .el-radio__label{
    display: none;
  }
  .pickupStationTable tr th:first-child,.pickupStationTable tr td:first-child{
    border-right: 0;
  }

  .pickupStationTable tr th:nth-child(3) .cell, .pickupStationTable tr td:nth-child(3) .cell{
    text-align: left;
  }
  .pickupStationTable tr th:nth-child(2) .cell,.pickupStationTable tr td:nth-child(2) .cell{
    padding-left: 4px;
    text-align: left;
  }
  .pickupStationTable .el-table__body-wrapper{
    overflow: hidden;
    overflow-y: auto;
  }

  .dialog-lv .el-radio__inner::after{
    transition:none;
  }
  /* 订单详情 -- 编辑游客信息 -- 弹窗 */
  .dialog-tourist{

  }
  .dialog-tourist .jdyalert-title{
    margin-top: -1px;
  }
  .dialog-tourist .el-form .el-select.id-select{
    width: 92px;
  }
  .dialog-tourist .id-select .el-input__icon{
    width: 20px;
  }
  .dialog-tourist .id-select .el-input__icon+.el-input__inner{
    padding-right: 16px;
    padding-left: 5px;
  }
  .dialog-tourist .el-form-item{
    margin-bottom: 0;
  }
  .dialog-tourist .el-table .cell{
    overflow: inherit;
  }
  .dialog-tourist .el-form-item__error{
    padding-top: 2px;
  }
  .error-padl .el-form-item__error{
    padding-left: 100px;
  }

 /*订单详情 价格明细*/
  .dialog-price-detail .el-table__footer-wrapper td:nth-child(2),.dialog-price-detail .el-table__footer-wrapper td:nth-child(3){
    border-right-color: transparent;
  }
  .dialog-price-detail .el-table__footer-wrapper td:nth-child(2) .cell,.dialog-price-detail .el-table__footer-wrapper td:nth-child(3) .cell{
    color: transparent;
  }
  .dialog-price-detail .el-table__body-wrapper{
    overflow: hidden;
    overflow-y: auto;
  }
  /*修改订单*/
  .table-border table th, .table-border table td{
    border-right:1px solid #dfe6ec;
  }
  .table-border table td{
    border-right:1px solid #dfe6ec;
  }
  .table-border table td{
    background-color: #f9fafc;
  }
  .table-border table td.el-table__expanded-cell{
    border:0;
    padding:0;
    height: auto;
    background-color: #fff;
  }
  .table-border table td.el-table__expanded-cell td{
    background-color: #fff;
  }
  .table-border table td .inner-table{
    border:0;
  }
  .table-border table td .inner-table::after{
    width: 0px;
  }
  .table-border table td .inner-table .el-table__body-wrapper{
    overflow: inherit;
  }
  .table-border table td .inner-table tr td:first-child{
    border-right:0;
  }
  .table-border table td .inner-table tr td:last-child{
    border-right:0;
  }
  .table-border table td .inner-table tr:last-child td{
    border-bottom: 0;
  }
  .table-border table .el-table__expand-column{
    border-right: 0;
    /*border-right-color: transparent;*/
  }
  .table-border table .el-table__expand-column{
    z-index: 1;
  }

  .table-border table td .border-table{
    border:0;
  }
  .table-border table td .border-table::after{
    width: 0px;
  }
  .table-border table td .border-table .el-table__body-wrapper{
    overflow: inherit;
  }
  .table-border table td .border-table tr td:last-child{
    border-right:0;
  }

  .table-heigt0 .el-table__empty-block{
    min-height: auto;
  }
  .table-heigt0 .el-table__body-wrapper{
    overflow-y: hidden;
  }

  .table-border table tr.no-expend-row td.el-table__expand-column .el-table__expand-icon{
    display: none;
  }

  .table-border table .el-table__expand-column .cell{
    overflow: inherit;
  }
  .table-border table .el-table__expand-icon{
    right:-10px
  }
  .lv-order-detail .table-expand{
    border: 0;
    border-left:1px solid #dfe6ec;
  }
  .lv-order-detail .table-expand .el-table__row.no-expend-row td{
    border-right: 0;
  }

  /*接送站点在table的文字布局*/
  .pickupStationTxt{
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  .touristTable td .el-form-item{
    margin-bottom: 2px;
  }

</style>
