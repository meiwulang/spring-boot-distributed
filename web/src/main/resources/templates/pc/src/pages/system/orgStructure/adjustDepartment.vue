<template>
  <div>
    <!-- 调整部门 begin-->
    <jdy-alert title="调整部门" @closeAlert="closeAlert" v-if="departmentDiaFlag" class="dialog-lv departmentDia" >
      <el-row class="scroll-cont p20">
        <p class="form-title red-font">请选择公司，再选择公司下相应的部门</p>
        <el-form  :model="departmentForm"  label-width="60px" class="dialog-form">
          <el-form-item label="调整至:">
            <el-cascader v-model="departmentForm.unitId" :options="cascaderData" :props="defaultProps"  clearable change-on-select placeholder="请选择"></el-cascader>
          </el-form-item>

        </el-form>
      </el-row>
      <div class="alertfoot1 clearfix">
        <el-button type="primary" class="fright mt10 mr10" @click="saveDepartmentFn()">确定</el-button>
        <el-button class="fright mt10 mr10" @click="closeAlert">取消</el-button>
      </div>
    </jdy-alert>
    <!-- 调整部门 end-->

  </div>
</template>

<script>
import jdyAlert from "@/components/Alert";
import API from '@/pages/system/api/index';
export default {
    name:"",
    components: {
      jdyAlert,
    },
    data() {
        return {
          //调整部门
          departmentDiaFlag:false,
          unitList:{},
          departmentList:{},
          departmentForm:{},
          cascaderData:[],
          defaultProps: {
            value: 'id',
            label: 'text',
            children: 'children'
          },
        }
    },
    mounted(){

    },
    methods: {
      closeAlert() {
        $('.alertbgg').remove();
        this.departmentDiaFlag = false;
      },

      showDeparmentDia(data,treeData) {
        this.cascaderData = treeData;
        this.departmentDiaFlag = true;
        this.$nextTick(function () {
          jdyFn.setAlertStyle("departmentDia");
        });
      },
      saveDepartmentFn() {
        this.closeAlert();
        this.$emit('refreshData');
      },
    },

}
</script>

<style lang="less" scoped>
.departmentDia{
  width: 700px;
  .form-title{
    color:#48576a;
    line-height: 36px;

    padding-left: 60px;
    padding-bottom: 5px;
  }
  .red-font{
    color: red;
  }

}

</style>
