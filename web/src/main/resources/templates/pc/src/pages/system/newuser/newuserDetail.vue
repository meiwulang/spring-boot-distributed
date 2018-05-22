<template>
  <div class="jdy-content fleft jl-information lv-order-detail">
    <div class="jdy-content-inner">
      <!--jdy-tab begin-->
      <div class="jdy-tab">
        <el-button type="default" class="fright mt10 mr10" @click="goback('sellerOrderAll')" >返回</el-button>
      </div>
      <!--jdy-tab end-->

      <!--table begin-->
      <!--table begin-->
      <div class="jdy-table-wrap pt20 pb20">
          <table width="100%" cellpadding="0" cellspacing="0" class="table-custom">
            <tr>
              <th>用户账号</th>
              <td>{{ tableData.uAccount }}</td>
              <th>真实姓名</th>
              <td>{{ tableData.uRealName }}</td>
              <th>员工编号</th>
              <td>{{ tableData.uNo }}</td>
            </tr>
            <tr>
              <th>职务</th>
              <td>{{ tableData.uPost }}</td>
              <th>单位名称</th>
              <td>{{ tableData.cName }}</td>
              <th>部门名称</th>
              <td>{{ tableData.dName }}</td>
            </tr>
            <tr>
              <th>地址</th>
              <td>{{ tableData.uAddress }}</td>
              <th>手机号</th>
              <td>{{ tableData.uTel }}</td>
              <th>身份证</th>
              <td>{{ tableData.uIdcard }}</td>
            </tr>
            <tr>
              <th>性别</th>
              <td>{{ tableData.uSex | sexName }}</td>
              <th>出生年月</th>
              <td>{{ tableData.uBirthday| dateFormat }}</td>
              <th>文化程度</th>
              <td>{{ tableData.degreeName }}</td>
            </tr>
            <tr>
              <th>负责人</th>
              <td>{{ tableData.uDtype |chargePersonType }}</td>
              <th>电话</th>
              <td>{{ tableData.uPhone }}</td>
              <th>QQ</th>
              <td>{{ tableData.uQq  }}</td>
            </tr>
            <tr>
              <th>微信号</th>
              <td>{{ tableData.uWxname }}</td>
              <th>紧急联系人</th>
              <td>{{ tableData.uContacts }}</td>
              <th>邮箱</th>
              <td>{{ tableData.uEmail }}</td>
            </tr>
            <tr>
              <th>备注</th>
              <td colspan="5">{{ tableData.uRemark }}</td>
            </tr>
          </table>
      </div>
      <!--table end-->
    </div>
  </div>
  <!--jdy-content end-->
</template>

<script>
  import ApiSystem from '@/pages/system/api/index';
  export default {
    name: 'orderDetail',
    data() {
      return {
        tableData:[],
      }
    },
    mounted(){
      this.getTableData();
    },
    filters:{
      degreeFormat:function(value){
       // return value.substring(0,7);
        return value
      },
      sexName: function (value) {
        return value ? '女':'男'
      },
      chargePersonType:function(value){
        const val= Number(value);
        let returnVal = '';
        if(value === 0){
          returnVal='普通代理人'
        }
        else if(value === 1){
          returnVal='负责人+部门领导'
        }
        else if(value === 2){
          returnVal='法人'
        }
        else if(value === 3){
          returnVal='法人+部门领导'
        }
        else if(value === 4){
          returnVal='部门领导'
        }
        else if(value === 5){
          returnVal='法人+负责人+部门领导'
        }

        return returnVal;
      }
    },
    methods: {
      goback(url) {
        window.history.go(-1);
        //this.$router.push({name:url});
      },
      //获取列表数据
      getTableData(){
        const vm = this;
        const sendData = this.$route.query.id;
        ApiSystem.getUserDetail(sendData).then((response) => {
          if(response.data.code == '0')
          {
            let data = response.data.body;
            vm.tableData = data;
          }else{
            vm.$alert(response.data.message)
          }
        });
      },

    },
  }


</script>
<style scoped>
  .jdy-content{
    height: 90%;
  }
  .table-custom th{
    width: 15%;
  }
  .table-custom tr td{
    width: 18%;
  }

  .jdy-title{
    padding: 20px 0 15px;
  }
  .dialog-tourist{
    width: 1000px;
  }
  .dialog-tourist .dialog-title-custom{
    width: auto;
    max-width:850px ;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .dialog-price-detail{
    width: 900px;
  }


</style>



