<template>
    <div>
      <!--系统日志查看 弹窗  begin-->
      <jdy-alert title="系统日志查看" v-if="alertJournalFlag" @closeAlert="alertJournal" class="alertJournal">
        <jdy-log :alertJournalFlag="alertJournalFlag" :journalCurrentData="journalCurrentData" :journalTotal="journalTotal" :pid="logram.pid" :module="logram.module"></jdy-log>
      </jdy-alert>
      <!--系统日志查看 弹窗  begin-->
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
    props:{
      logram:Object
    },
    data(){
        return{
          alertJournalFlag: false, //系统日志查看 弹窗值
          journalStyle: { //系统日志弹窗位置
            top: '164px',
            left: '300px'
          },
          journalTotal: 0,
          journalCurrentData: [], //日志数据
        }
    },
    mounted(){

    },
    methods: {

      //关闭,打开日志弹窗
      alertJournal() {
        const pid = this.logram.pid;
        if (!pid) { this.$alert("请选择产品"); return }
        this.alertJournalFlag = !this.alertJournalFlag;
        if (this.alertJournalFlag) {
          this.$nextTick(function () {
            jdyFn.setAlertStyle('alertJournal');
          });
        }
      },
      //获取日志数据
      getLogData(index) {
        this.$http.post(api_prefix + '/logs/selectLogs?pageIndex=' + this.logram.index + '&module=' + this.logram.module + '&pid=' + this.logram.pid
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
    }
  }

</script>
