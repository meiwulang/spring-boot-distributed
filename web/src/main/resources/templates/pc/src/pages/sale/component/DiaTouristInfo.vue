<template>
  <div>
    <el-dialog title="编辑游客信息" :visible.sync="alertTouristFlag" class="dialog-tourist">
      <el-row class="scroll-cont table-wrap">
        <el-form :model="touristForm" ref="touristForm">
          <table width="100%" cellpadding="0" cellspacing="0" class="table-custom">
            <tr>
              <th width="10%">票种</th>
              <th width="12%">游客姓名</th>
              <th width="13%">游客电话</th>
              <th width="25%">证件号码</th>
              <th width="20%">接送信息</th>
              <th width="10%">票价</th>
            </tr>
            <tr v-for="(item, index) in touristInfo.singleTicketData">
              <td>
                <p>{{ item.otTicketType | ticketType }}</p>
                <el-tag class="red-tag alignT" close-transition>{{ item.otType | ticketPriceType}}</el-tag>
              </td>
              <td>
                <el-form-item v-if="item.id === touristInfo.mainTouristData.id" :prop="'otName[' + item.id +']'"  :rules="touristFormRules.name">
                  <el-input placeholder="请输入姓名" v-model="touristForm.otName[item.id]" ></el-input>
                </el-form-item>
                <el-input placeholder="请输入姓名" v-model="touristForm.otName[item.id]" v-else></el-input>
              </td>
              <td>
                <el-form-item v-if="item.id === touristInfo.mainTouristData.id" :prop="'otPhone[' + item.id +']'"  :rules="touristFormRules.phone">
                  <el-input placeholder="请输入电话" v-model="touristForm.otPhone[item.id]" ></el-input>
                </el-form-item>
                <el-form-item v-else :prop="'otPhone[' + item.id +']'"  :rules="touristFormRules.phoneReg">
                  <el-input placeholder="请输入电话" v-model="touristForm.otPhone[item.id]" ></el-input>
                </el-form-item>
              </td>
              <td class="error-padl">
                <el-form-item v-if="item.id === touristInfo.mainTouristData.id" :prop="'otLincese[' + item.id +']'"  :rules="touristFormRules.licenceNumBlank">
                  <el-input placeholder="请输入证件号码" v-model="touristForm.otLincese[item.id]" >
                    <el-select v-model="touristForm.otLicenceType[item.id]" slot="prepend" placeholder="证件类型：" class="id-select" @change="selectLicenceChange(item.id)">
                      <el-option  v-for="per in LicenceTypeArr" :key="per.value" :label="per.label" :value="per.value"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
                <el-form-item v-else :prop="'otLincese[' + item.id +']'"  :rules="touristFormRules.licenceJustIdBlank">
                  <el-input placeholder="请输入证件号码" v-model="touristForm.otLincese[item.id]" >
                    <el-select v-model="touristForm.otLicenceType[item.id]" slot="prepend" placeholder="证件类型：" class="id-select" @change="selectLicenceChange(item.id)">
                      <el-option  v-for="per in LicenceTypeArr" :key="per.value" :label="per.label" :value="per.value"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </td>
              <td>
                <el-button @click="pickupStation(item)">选择</el-button>
                <el-row class="pickupStationTxt">
                  <div>
                    <span class="mr5" v-if="item.otLeaveType === 0">去程：{{ item.lvDepartureName }}</span>
                    <span class="mr5" v-else>去程：{{ item.lvStopName }} </span>
                  </div>
                  <div>
                    <span v-if="item.otReturnType === 0">返程：{{ item.rtDepartureName }}</span>
                    <span v-else>返程：{{ item.rtStopName }}</span>
                  </div>
                </el-row>
              </td>
              <td>
                {{ item.tPeerPrice | moneyTwoPoints}}
              </td>
            </tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" class="table-custom package-table" v-for="(item, index) in touristInfo.packageTicketData">
            <tr class="tr-head">
              <td width="10%">{{ item.otTicketType | ticketType }}</td>
              <td width="12%"></td>
              <td width="13%"></td>
              <td width="25%"></td>
              <td width="20%"></td>
              <td width="10%">{{ item.tPeerPrice | moneyTwoPoints }}</td>
            </tr>
            <tr v-for="(child, index) in item.children">
              <td>
                <p>{{ child.otTicketType | ticketType }}</p>
                <el-tag class="red-tag alignT" close-transition>{{ child.otType | ticketPriceType}}</el-tag>
              </td>
              <td>
                <el-form-item v-if="child.id === touristInfo.mainTouristData.id" :prop="'otName[' + child.id +']'"  :rules="touristFormRules.name">
                  <el-input placeholder="请输入姓名" v-model="touristForm.otName[child.id]" ></el-input>
                </el-form-item>
                <el-input placeholder="请输入姓名" v-model="touristForm.otName[child.id]" v-else></el-input>
              </td>
              <td>
                <el-form-item v-if="child.id === touristInfo.mainTouristData.id" :prop="'otPhone[' + child.id +']'"  :rules="touristFormRules.phone">
                  <el-input placeholder="请输入电话" v-model="touristForm.otPhone[child.id]" ></el-input>
                </el-form-item>
                <el-form-item v-else :prop="'otPhone[' + child.id +']'"  :rules="touristFormRules.phoneReg">
                  <el-input placeholder="请输入电话" v-model="touristForm.otPhone[child.id]" ></el-input>
                </el-form-item>
              </td>
              <td class="error-padl">
                <el-form-item v-if="child.id === touristInfo.mainTouristData.id" :prop="'otLincese[' + child.id +']'"  :rules="touristFormRules.licenceNumBlank">
                  <el-input placeholder="请输入证件号码" v-model="touristForm.otLincese[child.id]"  @blur="validate(child.id)">
                    <el-select v-model="touristForm.otLicenceType[child.id]" slot="prepend" placeholder="证件类型：" class="id-select" @change="selectLicenceChange(child.id)">
                      <el-option  v-for="per in LicenceTypeArr" :key="per.value" :label="per.label" :value="per.value"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
                <el-form-item v-else :prop="'otLincese[' + child.id +']'"  :rules="touristFormRules.licenceJustIdBlank">
                  <el-input placeholder="请输入证件号码" v-model="touristForm.otLincese[child.id]"  @blur="validate(child.id)">
                    <el-select v-model="touristForm.otLicenceType[child.id]" slot="prepend" placeholder="证件类型：" class="id-select" @change="selectLicenceChange(child.id)">
                      <el-option  v-for="per in LicenceTypeArr" :key="per.value" :label="per.label" :value="per.value"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </td>
              <td>
                <el-button @click="pickupStation(child)">选择</el-button>
                <el-row class="pickupStationTxt">
                  <div>
                    <span class="mr5" v-if="child.otLeaveType === 0">去程：{{ child.lvDepartureName }}</span>
                    <span class="mr5" v-else>去程：{{ child.lvStopName }} </span>
                  </div>
                  <div>
                    <span v-if="child.otReturnType === 0">返程：{{ child.rtDepartureName }}</span>
                    <span v-else>返程：{{ child.rtStopName }}</span>
                  </div>
                </el-row>
              </td>
              <td> </td>
            </tr>
          </table>


        </el-form>
      </el-row>
      <el-row class="btn-wrap">
        <el-button type="primary"  @click="saveTouristInfo">保存</el-button>
        <el-button @click="closeAlert">关闭</el-button>
      </el-row>
    </el-dialog>

    <!-- 接送站点选择 弹窗 begin  -->
    <PickupStation ref="pickupStation" :pickupPram="pickupPram" @></PickupStation>
    <!-- 接送站点选择 弹窗 end -->
  </div>
</template>

<script>
  import jdyAlert from '@/components/Alert';
  import orderApi from './../api/index';
  import PickupStation from './../component/DiaPickupStation';
  import {validatePhone,validateUserCard} from  '@/assets/js/validate';
  import {licenceTypeArr} from './../js/comData';
  import touristFormOption from './../js/touritInfoEdit';
  export default{
    components:{
      jdyAlert,
      PickupStation,
    },
    props:['touristInfo'],
    data(){
      return{
        alertTouristFlag:false,
        touristForm:touristFormOption.touristFormData,
        touristFormRules:touristFormOption.touristFormRulses,
        LicenceTypeArr:[{value:'',label:''}],
        pickupPram:{},
      }
    },
    mounted(){

    },
    methods:{
      closeAlert(){ //关闭弹出框
        this.alertTouristFlag =false;
        $('.alertbgg').remove();
      },
      showTouristInfoDia(){
        const vm = this;
        this.alertTouristFlag = true;
        this.$nextTick(function () {
          jdyFn.setAlertStyle('dialog-tourist');
          this.LicenceTypeArr = licenceTypeArr;
          vm.touristForm = touristFormOption.touristFormExecute(vm.touristInfo.allData);
        });

      },
      //选择证件类型
      selectLicenceChange(id){
        this.touristForm = touristFormOption.licenceTypeSelectChange(id);
        this.$refs.touristForm.validateField('otLincese['+id+']');
      },
      validate(id){
        console.log(999)
        this.$refs.touristForm.validateField('otLincese['+id+']');
      },
      //选择站点
      pickupStation(rowData){
        this.closeAlert();
        this.pickupPram = jdyFn.deepCopy(rowData);
        this.pickupPram.oScheduleId = this.touristInfo.oScheduleId;
        this.$refs.pickupStation.showPickUpStationDia();
      },
      //保存游客信息
      saveTouristInfo(){
        this.$refs.touristForm.validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        /* this.alertTouristFlag = false;
         $('.alertbgg').remove();*/
      },
    }

  }

</script>
<style scoped>
  .dialog-tourist{
    width: 1000px;
  }
  .dialog-tourist .dialog-title-custom{
    width: auto;
    max-width:850px ;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .table-custom td{
    padding: 5px;
    text-align: center;
  }
  .table-custom  .tr-head td{
    background-color: #f9fafc;
    border-right: 0;
  }
  .package-table  .tr-head td:last-child{
    border-right: 1px solid #d7dfe3;
  }
  .package-table{
    border-top:0;
  }
  .error-padl .el-form-item__error{
    padding-left: 100px;
  }
</style>

