package com.jdy.b2b.web.pojo.company;

import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.Future;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import java.math.BigDecimal;
import java.util.Date;
@ApiModel
public class CompanySetting {

    @ApiModelProperty(value = "id",hidden = true)
    @Null( message = "单位已存在")
    private Long id;

    @ApiModelProperty(value = "单位id",required = true)
    @NotNull(message = "请选择单位")
    private Long csCompanyId;

    @ApiModelProperty(value = "网银支付手续费")
    private BigDecimal csBankRate;

    @ApiModelProperty(value = "二维码支付手续费")
    private BigDecimal csQrRate;
    @ApiModelProperty(value = "结算续费")
    private BigDecimal csSettlementRate;

    @ApiModelProperty(value = "结算类型0：按付款日，1，按出团日",allowableValues ="0,1")
    private Integer csSettlement;

    @ApiModelProperty(value = "结算周期",allowableValues = "0,1,3,5,7,15,30")
    private Integer csCycle;

    @ApiModelProperty(value = "是否允许分销商编辑发票抬头 true,false",allowableValues = "true,false")
    private Boolean csInvoiceEdit;

    @ApiModelProperty(value = "是否开启二维码扫描",allowableValues = "true,false")
    private Boolean csQr;

    @ApiModelProperty(value = "合并金额数量",allowableValues = "500,3000,5000,10000,20000,30000,50000,100000")
    private Integer csAmount;

    @ApiModelProperty(value = "出团计划排序 false:订单顺序 true：作为排序",allowableValues = "true,false")
    private Boolean csSortBy;

    @ApiModelProperty(value = "班车停手设置 出发前N天")
    @Min(0)
    private Integer csStopDay;

    @ApiModelProperty(value = "班车停手设置 停手时分")
    @Future
    private Date csStopTime;

    @ApiModelProperty(value = "创建时间，创建跟新时不许设置",hidden = true)
    private Date createTime;

    @ApiModelProperty(value = "创建人，，创建跟新时不许设置",hidden = true)
    private Long createUser;

    @ApiModelProperty(value = "跟新时间，，创建跟新时不许设置",hidden = true)
    private Date updateTime;

    @ApiModelProperty(value = "跟新人，创建跟新时不许设置",hidden = true)
    private Long updateUser;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCsCompanyId() {
        return csCompanyId;
    }

    public void setCsCompanyId(Long csCompanyId) {
        this.csCompanyId = csCompanyId;
    }

    public BigDecimal getCsBankRate() {
        return csBankRate;
    }

    public void setCsBankRate(BigDecimal csBankRate) {
        this.csBankRate = csBankRate;
    }

    public BigDecimal getCsQrRate() {
        return csQrRate;
    }

    public void setCsQrRate(BigDecimal csQrRate) {
        this.csQrRate = csQrRate;
    }

    public Integer getCsSettlement() {
        return csSettlement;
    }

    public void setCsSettlement(Integer csSettlement) {
        this.csSettlement = csSettlement;
    }

    public Integer getCsCycle() {
        return csCycle;
    }

    public void setCsCycle(Integer csCycle) {
        this.csCycle = csCycle;
    }

    public Boolean getCsInvoiceEdit() {
        return csInvoiceEdit;
    }

    public void setCsInvoiceEdit(Boolean csInvoiceEdit) {
        this.csInvoiceEdit = csInvoiceEdit;
    }

    public Boolean getCsQr() {
        return csQr;
    }

    public void setCsQr(Boolean csQr) {
        this.csQr = csQr;
    }

    public Integer getCsAmount() {
        return csAmount;
    }

    public void setCsAmount(Integer csAmount) {
        this.csAmount = csAmount;
    }

    public Boolean getCsSortBy() {
        return csSortBy;
    }

    public void setCsSortBy(Boolean csSortBy) {
        this.csSortBy = csSortBy;
    }

    public Integer getCsStopDay() {
        return csStopDay;
    }

    public void setCsStopDay(Integer csStopDay) {
        this.csStopDay = csStopDay;
    }

    public Date getCsStopTime() {
        return csStopTime;
    }

    public void setCsStopTime(Date csStopTime) {
        this.csStopTime = csStopTime;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Long getCreateUser() {
        return createUser;
    }

    public void setCreateUser(Long createUser) {
        this.createUser = createUser;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public Long getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(Long updateUser) {
        this.updateUser = updateUser;
    }

    public BigDecimal getCsSettlementRate() {
        return csSettlementRate;
    }

    public void setCsSettlementRate(BigDecimal csSettlementRate) {
        this.csSettlementRate = csSettlementRate;
    }
}