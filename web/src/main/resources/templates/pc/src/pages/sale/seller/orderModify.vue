<template>
  <div class="jl-information">
    <div class="jdy-content jdy-sale fleft noborder">
      <div class="'idy-content-inner-trip">
        <el-row class="jdy-title">
          <div>青岛基地海洋世界青岛基地海洋世界11111</div>
          <el-tag class="red-tag">周边短线</el-tag>
          <div>订单号：<span>JDY201707031256</span></div>
          <div>预订时间： <span>2017-07-24 19:52</span></div>
        </el-row>
        <div class="info-wrap">
          <div class="title">产品信息</div>
          <div class="cont">
            <el-row class="info-pro" type="flex" justify="start">
              <el-col :span="5">
                <image src=""/>
              </el-col>
              <el-col :span="7">
                <div class="row">【CHENJIAQI】青岛极地海洋世界</div>
                <el-row class="row" type="flex">
                  <div class="el-wrap el-wrap-l">
                    卖家：<span>章涛 【18345121234】 </span>
                  </div>
                  <div class="el-wrap el-wrap-s">
                    品牌：<span> 苏之旅 </span>
                  </div>
                </el-row>
              </el-col>
              <el-col :span="6">
                <div class="row">
                  <div class="el-wrap">
                    出团：<span> 2017-06-30 </span>
                  </div>
                  <div class="el-wrap">
                    回团：<span> 2017-07-02 </span>
                  </div>
                </div>
                <div class="row">
                  <div class="el-wrap">
                    出发城市：杭州
                  </div>
                  <div class="el-wrap">
                    天数：3日
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="row">已定：2大/ 1小</div>
                <div class="row">余座：10</div>
              </el-col>
            </el-row>
          </div>
        </div>
        <el-row class="jdy-sec" type="flex" justify="start">
          <el-col :span="18" class="jdy-l">
            <div class="info-wrap">
              <div class="title">票价信息</div>
              <div class="cont">
                <div class="tag-wrap">
                  <el-button :class="{active:starActive==0}" @click="ticketStarTab(0)">全部</el-button>
                  <el-button :class="{active:starActive==1}" @click="ticketStarTab(1)">五星</el-button>
                  <el-button :class="{active:starActive==2}" @click="ticketStarTab(2)">四星</el-button>
                </div>

                <div class="table-wrap" v-if="starActive==0|| starActive == 1">
                  <div class="table-title">五星</div>
                  <el-table :data="tableData4" class="table-border"  default-expand-all   :row-class-name="tableRowClassName">
                    <el-table-column  type="expand" width="2" :formatter="formatter">
                      <template scope="scope" >
                        <div v-if="scope.row.type==0">
                          <el-table :data="scope.row.children" class="inner-table" :showHeader="false" >
                            <el-table-column width="22"></el-table-column>
                            <el-table-column label="票种名称" prop="ticketName"  width="120"></el-table-column>
                            <el-table-column label="票种类型" prop="ticketType" width="120"></el-table-column>
                            <el-table-column label="门市价" prop="ticketPrice"  min-width="120"></el-table-column>
                            <el-table-column label="人数" prop="ticketNum" width="220"></el-table-column>
                            <el-table-column label="床位" prop="bedNum" width="220">
                              <template scope="scopeChild">
                                <el-input-number v-model="scopeChild.row.bedNum" :min="0" :max="10"></el-input-number>
                              </template>
                            </el-table-column>
                            <el-table-column label="库存" prop="stock" min-width="130"></el-table-column>
                            <el-table-column label="小计" prop="sumPrice" min-width="130"></el-table-column>
                          </el-table>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="票种名称" prop="ticketName" width="140"></el-table-column>
                    <el-table-column label="票种类型" prop="ticketType" width="120"></el-table-column>
                    <el-table-column label="门市价" prop="ticketPrice"  min-width="120"></el-table-column>
                    <el-table-column label="人数" prop="ticketNum" width="220">
                      <template scope="scope">
                        <el-input-number v-model="scope.row.ticketNum"  :min="0" :max="10"></el-input-number>
                      </template>
                    </el-table-column>
                    <el-table-column label="床位" prop="bedNum" width="220">
                      <template scope="scope">
                        <el-input-number v-model="scope.row.bedNum"  :min="0" :max="10"></el-input-number>
                      </template>
                    </el-table-column>
                    <el-table-column label="库存" prop="stock" min-width="130"></el-table-column>
                    <el-table-column label="小计" prop="sumPrice" min-width="130"></el-table-column>
                  </el-table>
                </div>

                <div class="table-wrap" v-if="starActive==0|| starActive == 2">
                  <div class="table-title">四星</div>
                  <el-table :data="tableData4" class="table-border"  default-expand-all   :row-class-name="tableRowClassName">
                    <el-table-column  type="expand" width="2" :formatter="formatter">
                      <template scope="scope" >
                        <div v-if="scope.row.type==0">
                          <el-table :data="scope.row.children" class="inner-table" :showHeader="false" >
                            <el-table-column width="22"></el-table-column>
                            <el-table-column label="票种名称" prop="ticketName"  width="120"></el-table-column>
                            <el-table-column label="票种类型" prop="ticketType" width="120"></el-table-column>
                            <el-table-column label="门市价" prop="ticketPrice"  min-width="120"></el-table-column>
                            <el-table-column label="人数" prop="ticketNum" width="220"></el-table-column>
                            <el-table-column label="床位" prop="bedNum" width="220">
                              <template scope="scopeChild">
                                <el-input-number v-model="scopeChild.row.bedNum" :min="0" :max="10"></el-input-number>
                              </template>
                            </el-table-column>
                            <el-table-column label="库存" prop="stock" min-width="130"></el-table-column>
                            <el-table-column label="小计" prop="sumPrice" min-width="130"></el-table-column>
                          </el-table>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="票种名称" prop="ticketName" width="140"></el-table-column>
                    <el-table-column label="票种类型" prop="ticketType" width="120"></el-table-column>
                    <el-table-column label="门市价" prop="ticketPrice"  min-width="120"></el-table-column>
                    <el-table-column label="人数" prop="ticketNum" width="220">
                      <template scope="scope">
                        <el-input-number v-model="scope.row.ticketNum"  :min="0" :max="10"></el-input-number>
                      </template>
                    </el-table-column>
                    <el-table-column label="床位" prop="bedNum" width="220">
                      <template scope="scope">
                        <el-input-number v-model="scope.row.bedNum"  :min="0" :max="10"></el-input-number>
                      </template>
                    </el-table-column>
                    <el-table-column label="库存" prop="stock" min-width="130"></el-table-column>
                    <el-table-column label="小计" prop="sumPrice" min-width="130"></el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
            <div class="info-wrap">
              <div class="title">游客信息
                <el-button class="fright">批量添加游客</el-button>
              </div>
              <div class="cont">
                <div class="table-info">
                  <el-table :data="tableData6" style="width: 100%">
                    <el-table-column label="序号" type="index"></el-table-column>
                    <el-table-column label="票价名称" prop="id">
                      <template scope="scope">
                        <span>name</span>
                        <el-tag>成人票</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column label="姓名" prop="name">
                      <template scope="props">
                        <el-input v-model="name"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="联系电话" prop="telephone">
                      <template scope="props">
                        <el-input-number v-model="telephone" value="number" minlength="11" maxlength="11" ></el-input-number>
                      </template>
                    </el-table-column>
                    <el-table-column label="证件号码" prop="cardId">
                      <template scope="props">
                        <el-input v-model="cardId">
                          <el-select v-model="select" slot="prepend" placeholder="请选择">
                            <el-option label="身份证" value="1"></el-option>
                            <el-option label="订单号" value="2"></el-option>
                            <el-option label="用户电话" value="3"></el-option>
                          </el-select>
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="去程返程" prop="desc">
                      <template scope="props">
                        <el-row>去程
                          <el-button>选择站点</el-button>
                        </el-row>
                        <el-row>返程
                          <el-button>选择站点</el-button>
                        </el-row>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" prop="desc">
                      <template scope="props">
                        <el-button>删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
            <div class="info-wrap">
              <div class="title">其他信息
                <span class="hide">V</span>
              </div>
              <div class="cont other-info">
                <el-form ref="form" :model="formData" label-width="140px" >
                  <el-row type="flex" justify="space-between" >
                    <el-col :span="12">
                      <el-form-item label="优惠金额：" :span="4">
                        <el-input v-model="formData.name"></el-input>
                      </el-form-item>
                      <el-form-item label="结算优惠：">
                        <el-input v-model="formData.name"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="外部订单号：" :span="4">
                        <el-input v-model="formData.name"></el-input>
                      </el-form-item>
                      <el-form-item label="合同号：">
                        <el-input v-model="formData.name"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-form-item label="备注：">
                      <el-input type="textarea" v-model="formData.name"></el-input>
                    </el-form-item>
                  </el-row>

                </el-form>
              </div>
            </div>
            <div class="sum-wrap">
              <el-row>调整金额：
                <span>¥2000.00</span>
              </el-row>
              <el-row>订单总额：
                <span>¥10000.00</span>
              </el-row>
              <div class="border-grey"></div>
              <el-button type="primary">修改订单</el-button>
            </div>
          </el-col>

          <el-col  :span="6" class="jdy-r">
            <div class="info-wrap sum-info">
              <div class="title">结算信息
                <span class="hide">V</span>
              </div>
              <div class="cont">
                <div class="sum-detail">
                  <div class="title">结算明细</div>
                  <p class="row">
                    <label>票价金额：</label>
                    <span>¥2000.00</span>
                  </p>
                  <p class="row">
                    <label>实际结算：</label>
                    <span>¥2000.00</span>
                  </p>
                  <p class="row">
                    <label>佣金：</label>
                    <span>¥2000.00</span>
                  </p>
                </div>
                <div class="sec">
                  <div class="title">儿童</div>
                  <div class="row">
                    <label>报名：1人 × 100.00</label>
                    <span>¥2000.00</span>
                  </div>
                </div>
                <div class="sec">
                  <div class="title">儿童</div>
                  <div class="row">
                    <label>报名：1人 × 100.00</label>
                    <span>¥2000.00</span>
                  </div>
                </div>
                <div class="sec">
                  <el-row class="title" type="flex" justify="space-between">应付金额：
                    <span class="fright"> ¥6000.00</span>
                  </el-row>
                </div>
                <el-row class="btn-wrap">
                  <el-button type="primary" @click="submitFn">提交订单</el-button>
                </el-row>

              </div>
            </div>

            <div class="info-wrap seat-info">
              <div class="title">客车1
                <span class="hide">V</span>
                <span class="fright">请选择座位</span>
              </div>
              <div class="cont seat-wrap">
                <el-row type="flex" >
                  <el-col :span="12">
                    <span>1</span>
                    <span>2</span>
                  </el-col>
                  <el-col :span="12">
                    <span>3</span>
                    <span>4</span>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>

        </el-row>

      </div>
    </div>

    <!-- 接送站点选择 弹窗 begin -->
    <jdy-alert title="接送站点选择" v-if="alertStationFlag" @closeAlert="" class="dialog-lv dialog-pickup-station">
      <PickupStation></PickupStation>
    </jdy-alert>
    <!-- 接送站点选择 弹窗 end -->
  </div>
</template>

<script>
  import jdyAlert from '@/components/Alert';
  import PickupStation from './../component/DiaPickupStation';
  export default{
    name: 'orderInfo',
    components:{
      jdyAlert,
      PickupStation
    },
    data(){
      return{
        alertStationFlag:false,
        formData:{name:''},
        starActive:0,
        tableData5:[
          {type:0,ticketName:'成人双飞',ticketType:"成人票",ticketPrice:'￥1000.00',ticketNum:2,bedNum:2,stock:89,children:[{bedNum:1},{bedNum:1}]},
          {type:1,ticketName:'成人单飞',ticketType:"",ticketPrice:'￥1000.00',ticketNum:2,bedNum:2,stock:89,children:[{bedNum:1},{bedNum:1}]}
        ],
        tableData4:[
          {type:0,ticketName:'成人双飞',ticketType:"成人票",ticketPrice:'￥1000.00',ticketNum:2,bedNum:2,stock:89,children:[{bedNum:1},{bedNum:1}]},
          {type:1,ticketName:'成人单飞',ticketType:"",ticketPrice:'￥1000.00',ticketNum:2,bedNum:2,stock:89,children:[{bedNum:1},{bedNum:1}]}
        ],
        tableData6:[]


      }
    },
    created(){
      const vm =this;

      setTimeout(function () {
        //vm.ticketPriceForm = jdyFn.deepCopy(vm.tableData5);
      },2000)

    },
    mounted(){
      this.$nextTick(function(){

      });
    },
    methods:{
      submitFn(){
        console.log('this.tableData4')
        console.log(this.tableData4)
      },
      ticketStarTab(index){
        this.starActive = index;
      },
      formatter:function (row,column) {
        return '';
      },
      tableRowClassName(row, index) {
        if (row.type != 0) {
          return 'no-expend-row';
        }
        return '';
      }
    }

  }

</script>
<style scoped>
  .jdy-sale{
    background-color: #edf4f8;
  }
  .jdy-title .el-tag{
    margin-right: 30px;
    background-color: transparent;
  }
  .info-pro{
    border: 1px solid #d7dfe3;
    border-left:0;
  }
  .info-pro .el-col{
    border-left: 1px solid #d7dfe3;
    padding: 22px 1.2%;
  }
  .info-pro image{
    background-color: red;
  }
  .info-pro .row{
    padding:16px 0;
    line-height: 28px;
    border-bottom: 1px solid #f5f5f5;
    display: flex;
  }
  .info-pro .row:last-child{
    border: 0;
  }
  .info-pro .row .el-wrap{
    min-width: 50%;
    overflow: hidden;
    white-space: nowrap;
  }
  .info-pro .row .el-wrap-l{
    min-width: 70%;
  }
  .info-pro1 .row .el-wrap-s{
    min-width: 30%;
  }
  .info-pro .el-col:last-child .row{
    justify-content: center;
  }

  .jdy-sec .jdy-l{

  }
  .jdy-sec .jdy-r{
    margin-left: 10px;
  }
  .tag-wrap .el-button{
    width:150px;
    text-align: center;
    margin-right: 10px;
    cursor: pointer;
  }
  .tag-wrap .el-button.active{
    border-color:#20a0ff;
    color:#20a0ff;
  }
  .table-wrap{
    margin-top: 20px;
  }
  .table-wrap .table-title{
    padding: 10px 0;
  }
  .table-info{
    margin-top: 10px;
  }
  .table-info:first-child{
    margin-top: 0;
  }
  .other-info .el-form {
    padding: 20px 40px 20px 0;
  }
  .sum-wrap{
    padding: 10px 0;
    text-align: right;
    line-height: 30px;
  }
  .sum-wrap .el-row span{
    color:#ff4949;
  }
  .sum-wrap .el-button{
    margin-top: 20px;
  }
  .sum-wrap .border-grey{
    margin-top:10px;
    border-top:1px dotted #d7dfe3;
  }
  .sum-info .row{
    display: flex;
    display:-webkit-flex;
    justify-content: space-between;
    line-height: 36px;
    padding: 0 20px;
  }
  .sum-info .row span{
    color:#ff4949;
    margin-right: 20px;
  }
  .sum-info .row label{
    color:#5e6d82;
    text-align: right;
    min-width: 90px;
  }
  .sum-info .cont{
    padding: 0;
  }
  .sum-info .cont .sec{
    border-top: 1px solid #d7dfe3;
    padding: 10px 0;
  }
  .sum-info .cont .sec .title{
    background-color: #fff;
    border-bottom: 0;
    padding:0 0 0 20px;
  }
  .sum-info .cont .sum-detail{
    background-color: #f9fafc;
  }
  .sum-info .cont .sum-detail .title{
    border-bottom: 0;
    padding-left: 20px;
  }
  .sum-info .title .fright{
    color:#ff4949;
    margin-right: 40px;
  }
  .sum-info .btn-wrap{
    padding: 10px;
  }
  .sum-info .el-button{
    width: 100%;
  }
  .seat-wrap span{
    display: inline-block;
    width: 42px;
    height: 42px;
    background-color: #ccc;
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .seat-info .seat-wrap{
    padding: 70px 10px;
  }
  .seat-wrap .el-col{
    text-align: center;
    line-height: 42px;
  }

</style>

