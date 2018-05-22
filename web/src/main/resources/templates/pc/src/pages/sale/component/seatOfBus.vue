<template>
  <div>
    <el-row id="seatWrap" v-for="(perBusInfo,$index) in seatsListData" :key="perBusInfo.bNo">
      <p class="car-title">第{{ perBusInfo.bNo }}号车</p>
      <el-row class="seat-list" >
        <span v-for="item in perBusInfo.seatData" :key="item.type" :class="seatClass | seatClassInit(item)" @click="chooseSeat(item,$index)">
          <a href="javascript:void(0)" :title= "item.bookComp" v-if="item.bookComp !=''"> {{ item.seatNo }} </a>
          <a href="javascript:void(0)" v-else> {{ item.seatNo }} </a>
        </span>
      </el-row>
    </el-row>
  </div>
</template>

<script>
  import busApi from "./../api/index"
  /*seatTemporary:{seatLen:'3',oScheduleId:285,oBuyerCompanyId:419,changeSeatArr:[{ "busId":491,"busNo":1,"seat":"4,5"}}]}*/
  export default{
    name: 'orderInfo',
    props:['seatTemporary'],
    data(){
      return{
        seatClass:'icon3 icon3-seat-blank',
        seatsList: [],
        busSeatData:[],
        successSeatLen:0,
        successSeatArr:[],
        busInitData:[{bNo:0,seatData:[{seatNo:'',type:'blank'}] }]
      }
    },
    computed:{
      seatsListData:function () {
        const vm = this;
        if(vm.seatsList.length==0){
          return vm.busInitData ;
        }
        let returnData = jdyFn.deepCopy(vm.seatsList);
        returnData.forEach((item,index,arr)=>{
          const perBusData = jdyFn.deepCopy(item);
          const perBusSeatData = vm.getPerBusSeatData(perBusData);
          item.seatData = perBusSeatData ;
        });
        vm.busSeatData = returnData;
        return returnData;
      }
    },
    mounted(){
      this.getSeatsListData();
    },
    filters:{
      seatClassInit(val,item){
        const vm = this;
        const selfType = item.type;
        let seatClass = '';
        if(selfType == 'blank'){
          seatClass ='icon3 icon3-seat-blank';
        }
        else if(selfType == 'lock'){
          seatClass ='icon3 icon3-seat-lock';
        }
        else if(selfType == 'booked'){
          seatClass='icon3 icon3-seat-booked';
        }
        else if(selfType == 'temporary'){
          seatClass='icon3 icon3-seat-temporary';
        }
        else if(selfType == 'success'){
          seatClass='icon3 icon3-seat-success';
        }
        return seatClass;
      }
    },
    methods:{
      getSuccessSeatData(){
        const vm = this;
        const seatsListData = vm.seatsListData;
        vm.successSeatArr = [];
        seatsListData.forEach((item,index,array)=>{
          const perBusSeat = item.seatData;
          perBusSeat.forEach((perSeat,ind,arr)=>{
            if(perSeat.type == 'success'){
              vm.successSeatArr.push(perSeat);
            }
          })
        });
      },
      chooseSeat(perSeat,busInd){
        const vm = this;
        const curBusSeatData = vm.busSeatData[busInd].seatData;
        const selfType = perSeat.type;
        const selfInde = perSeat.seatNo - 1;
        const selftemporary = perSeat.temporary;
        const temoprarySeatLen = vm.seatTemporary.seatLen;
        if(temoprarySeatLen < vm.successSeatLen){
          return false;
        }
        else if(temoprarySeatLen == vm.successSeatLen){
          if(selfType == 'success' ){
            if(selftemporary == ''){
              curBusSeatData[selfInde].type='blank';
            }
            else if(selftemporary == 'true'){
              curBusSeatData[selfInde].type='temporary';
            }
            vm.successSeatLen--;
          }
          return false;
        }
        if(selfType == 'blank'){
          curBusSeatData[selfInde].type='success';
          vm.successSeatLen++;
        }
        else if(selfType == 'lock'){
          return false;
        }
        else if(selfType == 'booked'){
          return false;
        }
        else if(selfType == 'temporary'){
          curBusSeatData[selfInde].type='success';
          vm.successSeatLen++;
        }
        else if(selfType == 'success' ){
          if(selftemporary == ''){
            curBusSeatData[selfInde].type='blank';
          }
          else if(selftemporary == 'true'){
            curBusSeatData[selfInde].type='temporary';
          }
          vm.successSeatLen--;
        }
      },
      getPerBusSeatData(item){
        const vm = this;
        var seatArr = [];
        const seatLen = Number(item.bSeatsNum);
        for(var i=0;i< seatLen;i++){
          const arr = {bNo:item.bNo,busId:item.busId,seatNo:i+1,type:'blank',bookComp:'',temporary:''};
          seatArr.push(arr);
        }
        //锁住的座位
        if(item.bSeatsLock !==''){
          const lockSeatArr =  item.bSeatsLock.split(',');
          lockSeatArr.forEach((item,index,arr)=>{
            seatArr[item-1].type = 'lock';
          });
        }
        //所有预订的座位
        item.busHolds.forEach((per,index,arr)=>{
          if( per.seat !==''){
            per.seat = per.seat.split(',');
            for(var i=0;i<per.seat.length;i++){
              const seatNo = per.seat[i];
              if(vm.seatTemporary.oBuyerCompanyId == per.bCompanyId){
                seatArr[seatNo-1].type = 'blank';
              }
              else{
                //seatArr[seatNo-1].type = 'booked';
                seatArr[seatNo-1].type = 'lock';
              }
              seatArr[seatNo-1].bookComp = per.companyName;
            }
          }
        });
        //入口数据过滤 已经占用的座位
        const seatTemporaryData = jdyFn.deepCopy(vm.seatTemporary.changeSeatArr);
        seatTemporaryData.forEach((per,ind,arr)=>{
          if (item.bNo == per.busNo && per.seat !== ''){
            per.seat = per.seat.split(',');
            for(var i=0;i<per.seat.length;i++){
              const seatNo = per.seat[i];
              seatArr[seatNo-1].type = 'temporary';
              seatArr[seatNo-1].temporary = 'true';
              //seatArr[seatNo-1].bookComp = 'temporary';
            }
          }
        });
        return seatArr;
      },
      getSeatsListData(){
        const vm = this;
        const sendData = {
          "bScheduleId": vm.seatTemporary.bScheduleId
        }
        busApi.selectBusList(sendData).then((response) => {
          if(response.data.code == '0')
          {
            let data = response.data.body;
            vm.seatsList = data;
          }else{
            vm.$alert(response.data.message)
          }
        });
      },
    }

  }

</script>
<style scoped>
  #seatWrap p.car-title{
    padding: 2px;
    text-align: center;
    background-color: #edf4f8;
    margin-top: 10px;
    margin-bottom: 20px;
  }
  #seatWrap span{
    vertical-align: top;
    display: inline-block;
    width:43px;
    height: 38px;
    line-height: 38px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
  #seatWrap span::selection { background-color:transparent; }
  #seatWrap span::-moz-selection { background-color:transparent; }
  #seatWrap .seat-list{
    text-align: center;
    padding-left:50px;
  }
  #seatWrap .seat-list span.icon3:nth-child(even){
    margin-right: 60px;
  }

  #seatWrap .seat-list span a{
    display: inline-block;
    width: 100%;
    height: 100%;
    color:#caccd3;
  }
  #seatWrap .seat-list span.icon3-seat-temporary a{
    color:#fff;
  }
  #seatWrap .seat-list span.icon3-seat-success a{
    color:#fff;
  }
  #seatWrap .seat-list span.icon3 a{
    cursor: pointer;
  }
  #seatWrap .seat-list span.icon3-seat-lock a{
    cursor: not-allowed;
  }
  #seatWrap .seat-list span.icon3-seat-booked a{
    cursor: not-allowed;
  }
</style>

