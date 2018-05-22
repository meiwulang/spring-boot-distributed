package com.jdy.b2b.web.pojo.admission;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.time.LocalDate;

/**
 * Created by dugq on 2018/4/17.
 */
@ApiModel("门票生产记录列表搜索条件")
public class AdmissionProduceListParam{

    @ApiModelProperty("门票id")
    private Long admissionBaseId;

    @ApiModelProperty(value = "搜索开始时间",example = "2018-04-16")
    private LocalDate searchStartDate;

    @ApiModelProperty(value = "搜索结束时间",example = "2018-04-16")
    private LocalDate searchEndDate;

    @ApiModelProperty(value = "销售状态 0:已上架 1:已下架")
    private Byte salesType;

    @ApiModelProperty(value = "搜索字符串")
    private String searchStr;

    public String getSearchStr() {
        return searchStr;
    }

    public void setSearchStr(String searchStr) {
        this.searchStr = searchStr;
    }

    public Byte getSalesType() {
        return salesType;
    }

    public void setSalesType(Byte salesType) {
        this.salesType = salesType;
    }

    public Long getAdmissionBaseId() {
        return admissionBaseId;
    }

    public void setAdmissionBaseId(Long admissionBaseId) {
        this.admissionBaseId = admissionBaseId;
    }

    public LocalDate getSearchStartDate() {
        return searchStartDate;
    }

    public void setSearchStartDate(LocalDate searchStartDate) {
        this.searchStartDate = searchStartDate;
    }

    public LocalDate getSearchEndDate() {
        return searchEndDate;
    }

    public void setSearchEndDate(LocalDate searchEndDate) {
        this.searchEndDate = searchEndDate;
    }
}
