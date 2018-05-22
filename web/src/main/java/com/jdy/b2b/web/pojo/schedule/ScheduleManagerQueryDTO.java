package com.jdy.b2b.web.pojo.schedule;

import com.jdy.b2b.web.util.BaseVO;

/**
 * Created by zhangfofa on 2018/1/30.
 */
public class ScheduleManagerQueryDTO extends BaseVO {

    private Integer departureStatus;

    private String searchContent;

    private String outGroupTimeBeginStr;

    private String outGroupTimeEndStr;

    private String backGroupTimeBeginStr;

    private String backGroupTimeEndStr;

    private Integer otStatus;

    private Long companyId;

    private String scheduleTimeBeginStr;

    private String scheduleTimeEndStr;

    private Integer costResultStatus;//查询 最新成本审核的状态 待审核0 和 不通过的2

    public Integer getCostResultStatus() {
        return costResultStatus;
    }

    public void setCostResultStatus(Integer costResultStatus) {
        this.costResultStatus = costResultStatus;
    }

    public Integer getDepartureStatus() {
        return departureStatus;
    }

    public void setDepartureStatus(Integer departureStatus) {
        this.departureStatus = departureStatus;
    }

    public String getSearchContent() {
        return searchContent;
    }

    public void setSearchContent(String searchContent) {
        this.searchContent = searchContent;
    }

    public String getOutGroupTimeBeginStr() {
        return outGroupTimeBeginStr;
    }

    public void setOutGroupTimeBeginStr(String outGroupTimeBeginStr) {
        this.outGroupTimeBeginStr = outGroupTimeBeginStr;
    }

    public String getOutGroupTimeEndStr() {
        return outGroupTimeEndStr;
    }

    public void setOutGroupTimeEndStr(String outGroupTimeEndStr) {
        this.outGroupTimeEndStr = outGroupTimeEndStr;
    }

    public String getBackGroupTimeBeginStr() {
        return backGroupTimeBeginStr;
    }

    public void setBackGroupTimeBeginStr(String backGroupTimeBeginStr) {
        this.backGroupTimeBeginStr = backGroupTimeBeginStr;
    }

    public String getBackGroupTimeEndStr() {
        return backGroupTimeEndStr;
    }

    public void setBackGroupTimeEndStr(String backGroupTimeEndStr) {
        this.backGroupTimeEndStr = backGroupTimeEndStr;
    }

    public Integer getOtStatus() {
        return otStatus;
    }

    public void setOtStatus(Integer otStatus) {
        this.otStatus = otStatus;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getScheduleTimeBeginStr() {
        return scheduleTimeBeginStr;
    }

    public void setScheduleTimeBeginStr(String scheduleTimeBeginStr) {
        this.scheduleTimeBeginStr = scheduleTimeBeginStr;
    }

    public String getScheduleTimeEndStr() {
        return scheduleTimeEndStr;
    }

    public void setScheduleTimeEndStr(String scheduleTimeEndStr) {
        this.scheduleTimeEndStr = scheduleTimeEndStr;
    }
}
