package com.jdy.b2b.web.pojo.agentNumberStatistics;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jdy.b2b.web.pojo.StatisticsType;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.exception.ParamUnExpectException;
import com.jdy.b2b.web.util.exceptions.NoPermissionException;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Objects;
import java.util.function.Function;

/**
 * Created by dugq on 2017/11/9.
 */
public class AgentStatisticsPram implements Serializable{

    private static final long serialVersionUID = -1293703356062285753L;


    public static final int TIME_INTERVAL = 1;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;//开始日期
    @JsonFormat(pattern = "yyyy-MM-dd")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;//结束日期
    private Long companyId;//公司id
    private Long departmentId;//部门id
    @NotNull
    private Integer type;//日期类型
    private Long agentId;//代理人id
    @DateTimeFormat(pattern = "HH:mm")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;//分组开始时间
    @JsonFormat(pattern = "HH:mm")
    @DateTimeFormat(pattern = "HH:mm")
    private LocalTime endTime;//分组截止时间
    private Integer timeLevel;
    //按照设计图  矩阵表示
    private int tableType;//三个维度  权限,分组条件,上级参数类型



    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public void defaultValue(){
        startDate = null;
        endDate = null;
        companyId = null;
        departmentId = null;
    }


    @Deprecated
    public ResultBean excute(Function<AgentStatisticsPram,ResultBean> dayFun, Function<AgentStatisticsPram,ResultBean> monthFun, Function<AgentStatisticsPram,ResultBean> totalFun){
        if(Objects.isNull(this.type)){
            return ResultBean.getErrorResult("请传入类型");
        }
        if(this.type == 0){
            return dayFun.apply(this);
        }else if(this.type == 1){
            return monthFun.apply(this);
        }else if(this.type == 2){
            return totalFun.apply(this);
        }else{
            return monthFun.apply(this);
        }
    }
    @Deprecated
    //TODO : 添加两个参数及判断
    public ResultBean excute(Function<AgentStatisticsPram,ResultBean> ONE_ONE_O,
                             Function<AgentStatisticsPram,ResultBean> TWO_THREE_ONE,
                             Function<AgentStatisticsPram,ResultBean> TWO_TWO_ONE,
                             Function<AgentStatisticsPram,ResultBean> ONE_TWO_O,
                             Function<AgentStatisticsPram,ResultBean> ONE_ONE_SIX,
                             Function<AgentStatisticsPram,ResultBean> ONE_THREE_SIX,
                             Function<AgentStatisticsPram,ResultBean> FOUR_FOUR_ZERO,
                             Function<AgentStatisticsPram,ResultBean> FOUR_TWO_ZERO){
        if(this.tableType == TableTypeEnum.ONE_ONE_FIVE.getValue()){
            return ONE_ONE_O.apply(this);
        }
        else if(this.tableType == TableTypeEnum.TWO_THREE_ONE.getValue()){
            return TWO_THREE_ONE.apply(this);
        }
        else if(this.tableType == TableTypeEnum.TWO_TWO_ONE.getValue()){
            return TWO_TWO_ONE.apply(this);
        }
        else if(this.tableType == TableTypeEnum.ONE_TWO_FIVE.getValue()){
            return ONE_TWO_O.apply(this);
        }
        else if(this.tableType == TableTypeEnum.ONE_ONE_SIX.getValue()){
            return ONE_ONE_SIX.apply(this);
        }
        else if(this.tableType == TableTypeEnum.ONE_THREE_SIX.getValue()){
            return ONE_THREE_SIX.apply(this);
        }
        else if(this.tableType == TableTypeEnum.TWO_THREE_FOUR.getValue()){
            return ONE_THREE_SIX.apply(this);
        }
        else if(this.tableType == TableTypeEnum.THREE_TWO_TWO.getValue()) {
            return TWO_TWO_ONE.apply(this);
        }else if(this.tableType == TableTypeEnum.FOUR_FOUR_ZERO.getValue()){
            return FOUR_FOUR_ZERO.apply(this);
        }else if(this.tableType == TableTypeEnum.FOUR_TWO_ZERO.getValue()){
            return FOUR_TWO_ZERO.apply(this);
        }
        else{
            throw new ParamUnExpectException("no such tableType:"+tableType);
        }
    }


    public void initDateByType(){
        if(Objects.isNull(this.type)){
            throw new ParamUnExpectException("type is null");
        }
        if(this.type == StatisticsType.DAY.getValue()){
            this.endDate = this.startDate.plusDays(1);
        }else if(this.type == StatisticsType.WEEK.getValue()){
            this.endDate = this.startDate.plusDays(7);
        }else if(this.type == StatisticsType.MONTH.getValue()){
            this.endDate = this.startDate.plusMonths(1);
        }else if(this.type == StatisticsType.SEASON.getValue()){
            this.endDate = this.startDate.plusMonths(3);
        }else if (this.type == StatisticsType.YEAR.getValue()){
            this.endDate = this.startDate.plusYears(1);
        }else{
            this.endDate = null;
            this.startDate = null;
        }
    }

    public void initTimeOrDateByLevel(){
        if(Objects.isNull(this.timeLevel)){
            this.startTime = null;
            this.endTime = null;
            return;
        }
        if(this.type == StatisticsType.DAY.getValue()){
            this.initDateByType();
            this.startTime = LocalTime.of(timeLevel*TIME_INTERVAL,0);
            this.endTime = LocalTime.of((timeLevel+1)*TIME_INTERVAL,0);
        }else if(this.type == StatisticsType.WEEK.getValue()){
            this.startDate = this.startDate.plusDays(timeLevel-1);
            this.endDate = this.startDate.plusDays(1);
            this.startTime = null;
            this.endTime = null;
        }else if(this.type == StatisticsType.MONTH.getValue()){
            this.startDate = this.startDate.plusDays(timeLevel-1);
            this.endDate = this.startDate.plusDays(1);
            this.startTime = null;
            this.endTime = null;
        }else if(this.type == StatisticsType.SEASON.getValue()){
            this.startDate = this.startDate.plusMonths(timeLevel);
            this.endDate = this.startDate.plusMonths(1);
            this.startTime = null;
            this.endTime = null;
        }else{
            this.startDate = this.startDate.plusMonths(timeLevel*3);
            this.endDate = this.startDate.plusMonths(3);
            this.startTime = null;
            this.endTime = null;
        }
    }
    //Controller中调用
    public void initByTableType(){
        TableTypeEnum tableTypeEnum = TableTypeEnum.ofValue(this.tableType);
        if(tableTypeEnum.hasPermissions()){
            tableTypeEnum.initParam(this);
        }else {
            throw new NoPermissionException("no Permissions!");
        }
    }


    public Long getAgentId() {
        return agentId;
    }

    public void setAgentId(Long agentId) {
        this.agentId = agentId;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public Integer getTimeLevel() {
        return timeLevel;
    }

    public void setTimeLevel(Integer timeLevel) {
        this.timeLevel = timeLevel;
    }

    public int getTableType() {
        return tableType;
    }

    public void setTableType(int tableType) {
        this.tableType = tableType;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

}
