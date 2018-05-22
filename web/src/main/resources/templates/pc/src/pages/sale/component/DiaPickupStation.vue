<template>
  <div>
    <jdy-alert title="接送站点选择" v-if="alertStationFlag" @closeAlert="closeStation" class="dialog-lv dialog-pickup-station">
      <el-row class="border-blue">
        <el-col :span="12" class="border-right lv-wrap">
          <el-row class="head-sec" type="flex" justify="space-between">
            <div class="ele-wrap">
              <span class="aircraft-icon fly-go"></span>
              去程
            </div>
            <div class="ele-wrap">
              <el-input placeholder="上车站点" v-model="lvSearchTxt">
                <el-button slot="append" icon="search" @click="lvSearchFn"></el-button>
              </el-input>
            </div>
          </el-row>
          <div class="content-sec tab-wrap">
            <el-tabs v-model="activeTabLv" type="border-card" @tab-click="handleClickGo">
              <el-tab-pane label="全部" name="3"></el-tab-pane>
              <el-tab-pane label="始发站" name="0"><span slot="label">始发站<i>[{{ typeNumLv[0] }}]</i> </span></el-tab-pane>
              <el-tab-pane label="班车站" name="2"><span slot="label">班车站<i>[{{ typeNumLv[2] }}]</i> </span></el-tab-pane>
              <el-tab-pane label="顺路站" name="1"><span slot="label">顺路站<i>[{{ typeNumLv[1] }}]</i> </span></el-tab-pane>
            </el-tabs>
            <div class="table-sec">
              <el-table ref="lvTable" :data="lvTableData"  max-height="280" class="pickupStationTable" border style="width: 100%">
                <el-table-column prop="dId" width="32">
                  <template scope="scope">
                    <el-radio class="radio" v-model="lvRadioVal" :label="scope.row.dId" @change="lvRadioChange(scope.row)"></el-radio>
                  </template>
                </el-table-column>
                <el-table-column prop="dTime" label="上车时间" width="150">
                  <template scope="scope">
                    {{ scope.row.dTime | dateFormat('time','--') }}
                  </template>
                </el-table-column>
                <el-table-column prop="dName" label="上车站点">
                  <template scope="scope">
                    <el-tag class="green-tag" close-transition>{{scope.row.dType | stationType}}</el-tag>
                    <span>{{ scope.row.dName }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="dFee" label="接送费用" class-name="red-font" width="90">
                  <template scope="scope">
                    {{ scope.row.dFee | moneyTwoPoints}}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>

        <el-col :span="12" class="rt-wrap">
          <el-row class="head-sec" type="flex" justify="space-between">
            <div>
              <span class="aircraft-icon fly-back"></span>
              返程
            </div>
            <div>
              <el-input placeholder="上车站点" v-model="rtSearchTxt">
                <el-button slot="append" icon="search" @click="rtSearchFn"></el-button>
              </el-input>
            </div>
          </el-row>
          <div class="content-sec tab-wrap">
            <el-tabs v-model="activeTabRt" type="border-card" @tab-click="handleClickBack">
              <el-tab-pane label="全部" name="3"></el-tab-pane>
              <el-tab-pane label="始发站" name="0"><span slot="label">始发站<i>[{{ typeNumRt[0] }}]</i> </span></el-tab-pane>
              <el-tab-pane label="班车站" name="2"><span slot="label">班车站<i>[{{ typeNumRt[2] }}]</i> </span></el-tab-pane>
              <el-tab-pane label="顺路站" name="1"><span slot="label">顺路站<i>[{{ typeNumRt[1] }}]</i> </span></el-tab-pane>
            </el-tabs>
            <div class="table-sec" >
              <el-table ref="rtTable" :data="rtTableData" border class="pickupStationTable" max-height="280">
                <el-table-column prop="dId" width="32">
                  <template scope="scope">
                    <el-radio class="radio" v-model="rtRadioVal" :label="scope.row.dId" @change="rtRadioChange(scope.row)"></el-radio>
                  </template>
                </el-table-column>
                <el-table-column prop="dTime" label="上车时间" width="150">
                  <template scope="scope">
                    {{ scope.row.dTime | dateFormat('time','--') }}
                  </template>
                </el-table-column>
                <el-table-column prop="dName" label="上车站点" width="150">
                  <template scope="scope">
                    <el-tag class="green-tag" close-transition>{{scope.row.dType | stationType}}</el-tag>
                    <span>{{ scope.row.dName }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="backCount" label="接送费用" class-name="red-font">
                  <template scope="scope">
                    {{ scope.row.dFee | moneyTwoPoints}}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>

      <div  class="btn-wrap">
        <el-row class="bgWhite">
          <el-col :span="12" class="flex-wrap">
            <div class="ele-wrap">
              <span class="aircraft-icon fly-go"></span>
              <span class="mr5" v-if="pickupPram.otLeaveType == '0'">去程: {{ pickupPram.lvDepartureName }} </span>
              <span class="mr5" v-else>去程:{{ pickupPram.lvStopName }} </span>
            </div>
            <div class="ele-wrap">
              <span class="aircraft-icon fly-back"></span>
              <span v-if="pickupPram.otReturnType == '0'" >返程: {{ pickupPram.rtDepartureName }}</span>
              <span v-else>返程: {{ pickupPram.rtStopName }}</span>
            </div>
          </el-col>
          <el-col :span="12" class="flex-wrap">
            <el-radio class="radio" v-model="radioOfUser" label="1">仅当前游客使用</el-radio>
            <el-radio class="radio" v-model="radioOfUser" label="2">仅相同票价点游客使用</el-radio>
            <el-radio class="radio" v-model="radioOfUser" label="3">应用到所有游客</el-radio>
          </el-col>
        </el-row>
        <el-row class="bottom-sum">
          <p >接送单价：<span>{{ (pickupPram.otLeavePrice + pickupPram.otReturnPrice) | moneyTwoPoints }}</span></p>
          <el-button type="primary" class="fright">确认</el-button>
        </el-row>
      </div>

    </jdy-alert>
  </div>
</template>

<script>
  import jdyAlert from '@/components/Alert';
  import orderApi from './../api/index';
  export default{
    name: 'pickupStation',
    props:['pickupPram'],
    components:{
      jdyAlert,
    },
    data(){
      return{
        alertStationFlag:false,
        radio:'',
        lvSearchTxt:'',
        rtSearchTxt:'',
        activeTabLv:'3',
        activeTabRt:'3',
        typeNumLv:[],
        typeNumRt:[],
        parameter:{currPage:1,pageSize:1000,dType:'',id:''},
        departuresData:[],
        lvTableData:[],
        rtTableData:[],
        radioOfUser:'1',
        lvRadioVal:'',
        rtRadioVal:''
      }
    },
    mounted(){
      console.log(999999)

    },

    methods:{
      closeStation(){
        $('.alertbgg').remove();
        this.alertStationFlag= false;
        this.touristInfoEditFun();
      },
      showPickUpStationDia(){
        const vm = this;
        this.alertStationFlag = true;
        this.$nextTick(function () {
          jdyFn.setAlertStyle('dialog-pickup-station');
          vm.parameter.id = vm.pickupPram.oScheduleId ;
          vm.lvRadioVal =  vm.pickupPram.otLeaveId;
          vm.rtRadioVal =  vm.pickupPram.otReturnId;
          vm.getPickupStationData('init');
        });
      },
      getTypeLen(data){
        const arr = [];
        if(data.length == 0) return ['0','0','0'];
        let TypeNum0 = data.filter((item,index)=>{
         return (item.dType == 0);
        });
         arr.push(TypeNum0.length);
         let TypeNum1 = data.filter((item,index)=>{
           return (item.dType == 1);
         });
         arr.push(TypeNum1.length);
         let TypeNum2 = data.filter((item,index)=>{
           return (item.dType == 2);
         });
         arr.push(TypeNum2.length);
         return arr;
      },
      getPickupStationData(condition){
        const vm = this;
        const sendData = vm.parameter;
        orderApi.departuresWithStops(sendData).then((response)=>{
          if(response.data.code == '0')
          {
            const responseData = response.data.body;
            let departuresData = (responseData.departures) ? responseData.departures :[];
            let stopsData = (responseData.departuresWithStops) ?responseData.departuresWithStops :[];
            vm.departuresData = departuresData.map((item)=>{
              return {dType:item.dType,dId:item.id,dName:item.dName,dTime:'',dFee:'0'}
            });
            let stopsDataLv = [];
            let stopsDataRt = [];
            stopsData.forEach((item)=>{
              const perData = {sbReturn:item.sbReturn,dType:item.dType,dId:item.sbShuttleStopId,dName:item.stopName,dTime:item.sbTime,dFee:item.sbPrice};
              if(item.sbReturn == '0'){
                stopsDataLv.push(perData);
              }
              else if(item.sbReturn == '1'){
                stopsDataRt.push(perData);
              }
            });
            if(condition == 'lv'){
              vm.lvTableData = vm.departuresData.concat(stopsDataLv);
            }
            else if(condition == 'rt'){
              vm.rtTableData = vm.departuresData.concat(stopsDataRt);
            }
            else if(condition == 'init'){
              vm.lvTableData = vm.departuresData.concat(stopsDataLv);
              vm.typeNumLv = vm.getTypeLen(vm.lvTableData);
              vm.rtTableData = vm.departuresData.concat(stopsDataRt);
              vm.typeNumRt = vm.getTypeLen(vm.rtTableData);
            }
          }else{
            vm.$alert(response.data.message)
          }
        })
      },
      handleClickGo(tab, event) {
        this.activeTabLv = tab.name;
        $('.lv-wrap .el-table__body-wrapper').scrollTop(0);
        this.getLvStationData();
      },
      lvSearchFn(){
        this.getLvStationData();
      },
      getLvStationData(){
        const vm = this;
        vm.parameter.dType = (Number(vm.activeTabLv) != 3) ? Number(vm.activeTabLv):'';
        vm.parameter.name = vm.lvSearchTxt;
        vm.getPickupStationData('lv');
      },
      lvRadioChange(row){

      },
      handleClickBack(tab, event) {
        this.activeTabRt = tab.name;
        $('.rt-wrap .el-table__body-wrapper').scrollTop(0);
        this.getRtStationData();
      },
      rtSearchFn(){
        this.getRtStationData();
      },
      getRtStationData(){
        const vm = this;
        vm.parameter.dType = (Number(vm.activeTabRt) != 3) ? Number(vm.activeTabRt):'';
        vm.parameter.name = vm.rtSearchTxt;
        vm.getPickupStationData('rt');
      },
      rtRadioChange(row){

      },
    }

  }

</script>
<style scoped>
  .dialog-pickup-station{
    background-color: #fff;
  }
  .head-sec{
    padding: 10px 0;
    line-height: 35px;
  }
  .el-tabs i{
    font-style: normal;
    color:#ff4949;
    font-size: 12px;
    margin-left: 2px;
  }
.border-blue{
  border-bottom:5px solid #467cd4;
}
  .border-blue .el-col{
    padding:0 10px 10px;
  }
.border-blue .el-col.border-right{
  border-right:5px solid #467cd4;
}
  .tab-wrap{
    border:1px solid #d7dfe3;
   border-top:0;
  }
  .tab-wrap .table-sec{
    padding: 10px;
    height: 280px;
    overflow: hidden;
  }
.btn-wrap{
  padding:0;
}
.flex-wrap{
  display: flex;
  display: -webkit-flex;
  height: 60px;
  align-items: center;
  justify-content: start;
  text-align: left;
}
.flex-wrap .ele-wrap{
  min-width: 35%;
  max-width: 40%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-left: 20px;
}
.flex-wrap .el-radio{
  width: 30%;
}
.el-radio__label{
  line-height: 20px;
}
.flex-wrap .el-radio:nth-child(2){
  width: 40%;
}
.bottom-sum{
  background-color: #f9fafc;
  border-top:1px solid #d7dfe3;
  padding:0 20px 11px;
}
  .bottom-sum p{
    text-align: right;
    line-height: 40px;
  }
.bottom-sum p span{
  color:#ff4949;
}
.aircraft-icon{
  display: inline-block;
  height: 25px;
  width: 20px;
  vertical-align: middle;
}
.fly-go{
  background-position: -40px 0;
}
.fly-back{
  background-position: -40px -23px;
}
</style>

