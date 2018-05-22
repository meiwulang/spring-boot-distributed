package com.jdy.b2b.web.pojo.agentNumberStatistics;

import com.jdy.b2b.web.pojo.StatisticsType;
import com.jdy.b2b.web.pojo.user.UserResultDTO;
import com.jdy.b2b.web.util.exception.ParamUnExpectException;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;

import java.util.Objects;

/**
 * Created by dugq on 2017/12/5.
 */
public enum TableTypeEnum {

    //单位级 按部门分组 无条件
    ONE_ONE_FIVE(115,2) {
        @Override
        public void initParam(AgentStatisticsPram param) {
            if(getUser().getuDataLimit() == 2){
                param.setCompanyId(getUser().getuCompanyId());
            }else if(getUser().getuDataLimit() == 3) {

            }else{
                param.setCompanyId(null);
            }
            param.setTimeLevel(null);
            param.setDepartmentId(null);
            param.setAgentId(null);
            super.initParam(param);
        }
    },

    //单位级 按时间分组 无条件
    ONE_TWO_FIVE(125,2) {

        @Override
        public void initParam(AgentStatisticsPram param) {
            ONE_ONE_FIVE.initParam(param);
        }
    },

    // 部门级 按人员（销售经理）分组  条件为部门id
    TWO_THREE_ONE(231,1) {

        @Override
        public void initParam(AgentStatisticsPram param) {
            param.setCompanyId(null);
            if(getUser().getuDataLimit() == 1){
                param.setDepartmentId(getUser().getuDepartmentId());
            }
            param.setAgentId(null);
            param.setTimeLevel(null);
            super.initParam(param);
        }
    },

    //部门级 按时间分组  条件为部门id
    TWO_TWO_ONE(221,1) {

        @Override
        public void initParam(AgentStatisticsPram param) {
            TWO_THREE_ONE.initParam(param);
        }
    },
    //单位级 按部门分组  条件为单位id和时间段
    ONE_ONE_SIX(116,2) {

        @Override
        public void initParam(AgentStatisticsPram param) {
            if(Objects.isNull(param.getTimeLevel())){
                throw new ParamUnExpectException("no timeLevel");
            }
            if(getUser().getuDataLimit() == 2){
                param.setCompanyId(getUser().getuCompanyId());
            }
            param.setDepartmentId(null);
            param.setAgentId(null);
            super.initParam(param);
        }
    },

    //单位级 按 人员（销售经理）分组  条件为单位id和时间段
    ONE_THREE_SIX(136,1) {

        @Override
        public void initParam(AgentStatisticsPram param) {
            ONE_ONE_SIX.initParam(param);
        }
    },

    //部门级 按人员（销售经理）分组  条件为部门+时间断
    TWO_THREE_FOUR(234,1){
        @Override
        public void initParam(AgentStatisticsPram param) {
            if(Objects.isNull(param.getTimeLevel())){
                throw new ParamUnExpectException("no timeLevel");
            }
            if(getUser().getuDataLimit() == 1){
                param.setDepartmentId(getUser().getuDepartmentId());
            }
            param.setCompanyId(null);
            param.initTimeOrDateByLevel();
            param.setAgentId(null);
        }
    },

    //用户级 按时间段分组  条件为人员（销售经理）
    THREE_TWO_TWO(322,0){
        @Override
        public void initParam(AgentStatisticsPram param) {
            param.setCompanyId(null);
            param.initDateByType();
            if(getUser().getuDataLimit() == 0){
                param.setAgentId(getUser().getUserId());
            }
            param.setDepartmentId(null);
        }
    },
    //系统级 按子公司/部门分组  无条件
    //startDate type tableType
    FOUR_FOUR_ZERO(440,3){
        @Override
        public void initParam(AgentStatisticsPram param) {
            param.initDateByType();
            param.setCompanyId(null);
            param.setDepartmentId(null);
            param.setAgentId(null);
            param.setStartTime(null);
            param.setEndTime(null);
            param.setTimeLevel(null);
        }
    },

    //系统级 时间  无条件
    //startDate type tableType
    FOUR_TWO_ZERO(420,3){
        @Override
        public void initParam(AgentStatisticsPram param) {
            FOUR_FOUR_ZERO.initParam(param);
        }
    }
    ;

    /**
     * 用以区分查询类型
     * 共分三位
     * 第一位表示最小权限：1：单位级 2：部门级 3：用户级   注意和dataLimit不一样，dataLimit和数据库意义相同。这里由于在第一位不能用0 所以自定义了
     * 添加系统级数据权限 --- 4:系统级
     * 第二位表示分组条件：1：部门： 2：时间  3： 人员（销售经理）
     * 添加系统级分组条件 --- 4:子公司/一级部门
     * 第三位表示由上层传下来的条件：1：部门： 2：人员（销售经理）  3： 时间段  4:部门+时间段 5：单位 6：时间+单位  无条件的用0
     *
     */
    private int value;

    /**
     * 用以判断该查询所需要的最小数据权限等级
     * 数据级别0:用户级 1:部门级2:单位级 3:系统级
     */
    private int dataLimit;

    TableTypeEnum(int value,int dataLimit) {
        this.value = value;
        this.dataLimit = dataLimit;
    }

    public int getValue() {
        return value;
    }

    /**
     * 根据不同的接口，需求不同的参数，控制不需要的参数
     * @param param
     */
    protected void initParam(AgentStatisticsPram param){
        param.initDateByType();
        param.initTimeOrDateByLevel();
    }

    @Deprecated
    protected void initParamByType(AgentStatisticsPram param){
        if(param.getType() == StatisticsType.DAY.getValue()){
            initParam(param);
        }else if(param.getType() == StatisticsType.WEEK.getValue()){
            param.setStartDate(param.getStartDate().plusDays(param.getTimeLevel()));
            param.setEndDate(param.getStartDate().plusDays(1));
        }else if(param.getType() == StatisticsType.MONTH.getValue()){
            param.setStartDate(param.getStartDate().plusDays(param.getTimeLevel()));
            param.setEndDate(param.getStartDate().plusDays(1));
        }else if(param.getType() == StatisticsType.SEASON.getValue()){
            param.setStartDate(param.getStartDate().plusMonths(param.getTimeLevel()));
            param.setEndDate(param.getStartDate().plusMonths(1));
        }else{
            param.setStartDate(param.getStartDate().plusMonths(param.getTimeLevel()*3));
            param.setEndDate(param.getStartDate().plusMonths(3));
        }
    }

    public boolean hasPermissions(){
        System.out.println("udatalimit : "+getUser().getuDataLimit());
        System.out.println("this.datalimit : "+this.dataLimit);
        return getUser().getuDataLimit() >= this.dataLimit;
    }

    public static TableTypeEnum ofValue(int type){
        for(TableTypeEnum tableType : TableTypeEnum.values()){
            if(tableType.getValue() == type){
                return tableType;
            }
        }
        throw new ParamUnExpectException("no such tableType :"+type);
    }

    protected UserResultDTO getUser(){
        Subject subject = SecurityUtils.getSubject();
        UserResultDTO user = (UserResultDTO)subject.getPrincipal();
        return user;
    }
}
