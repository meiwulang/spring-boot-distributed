<template>
    <!--系统日志查看 弹窗  begin-->
    <div>
        <el-table :data="LjournalCurrentData" height="250" @row-click="rowclickHandler" border style="width: 100%">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="blDescription" label="事件描述" width="180">
            </el-table-column>
            <el-table-column prop="blIp" label="来源" width="180">
            </el-table-column>
            <el-table-column prop="blAccount" label="操作人">
            </el-table-column>
            <el-table-column label="时间">
                <template scope="scope">
                    <span>{{ scope.row.createTime|changeCreate }}</span>
                </template>
            </el-table-column>
        </el-table>

        <el-row class="journalpage clearfix tc">
            <el-pagination small layout="prev, pager, next" :page-size="pageSize" :total="LjournalTotal" @current-change="handleCurrentJournalChange" class="">
            </el-pagination>
        </el-row>

        <el-row class="f12 p30 cp">
            <p class="mt25 ctitle ctitle">操作人基本信息</p>
            <p class="mt15">单位：{{blCompany}}</p>
            <p class="mt15">姓名：{{blUsername}}</p>
            <p class="mt15">账号：{{blAccount}}</p>
            <p class="mt25 ctitle ctitle">日志信息</p>
            <p class="mt15">描述：{{blDescription}}</p>
            <p class="mt15">模块：{{blModule}}</p>
            <p class="mt15">方法：{{blMethod}}</p>
        </el-row>
    </div>
    <!--系统日志查看 弹窗  end-->
</template>
<script>
import jdyAlert from '@/components/Alert';

export default {
    data() {
        return {
            pageSize: 10,
            LjournalCurrentData: this.journalCurrentData,//日志数据
            LjournalTotal: this.journalTotal, //日志总数
            LalertJournalFlag: this.alertJournalFlag,
            blCompany: null,
            blUsername: null,
            blAccount: null,
            blDescription: null,
            blModule: null,
            blMethod: null,
            bpid: this.pid,
            bmodule: this.module

        }
    },
    props: {
        alertJournalFlag: Boolean,
        journalTotal: Number,
        journalCurrentData: Array,
        pid: Number,
        module: String
    },
    components: {
        jdyAlert
    }, methods: {
        alertJournal() {//关闭,打开日志弹窗
            this.LalertJournalFlag = !this.LalertJournalFlag;
            if (this.LalertJournalFlag) {
                this.$nextTick(function () {
                    jdyFn.setAlertStyle('alertJournal');
                });
            }
            this.$emit('listenToChildEvent', this.LalertJournalFlag)
        },
        //table行点击事件
        rowclickHandler(row, event, column) {
            this.blCompany = row.blCompany
            this.blUsername = row.blUsername
            this.blAccount = row.blAccount
            this.blDescription = row.blDescription
            this.blModule = row.blModule
            this.blMethod = row.blMethod
        },
        getData(index) {
            //获取日志数据
            this.$http.post(api_prefix + '/logs/selectLogs?pageIndex=' + index + '&module=' + this.bmodule + '&pid=' + this.pid
            ).then(response => {
                this.LjournalTotal = response.data.body.total;
                this.LjournalCurrentData = response.data.body.list;
            }, response => {
                console.log('获取日志出错了');
            });
            // this.$nextTick(function () {
            //     jdyFn.setAlertStyle('alertJournal');
            // });
        },
        handleCurrentJournalChange(index) {
            //this.getData(index);
            //this.$emit("getData",index)
            this.getData(index)
        }
    },
    filters: {
        changeCreate: function (value) {
            var unixTimestamp = new Date(value);
            var oYear = unixTimestamp.getFullYear();
            var oMonth = unixTimestamp.getMonth() + 1;
            var oDay = unixTimestamp.getDate();
            var oHour = unixTimestamp.getHours();
            var oMin = unixTimestamp.getMinutes();
            var oSen = unixTimestamp.getSeconds();
            var oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen);//最后拼接时间  
            //补0操作  
            function getzf(num) {
                if (parseInt(num) < 10) {
                    num = '0' + num;
                }
                return num;
            }
            return value = oTime.substr(0, 10);
        }
    }
}
</script>
