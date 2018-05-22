package com.jdy.b2b.web.pojo.admission;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;
import java.util.Date;

@ApiModel
public class AdmissionBase {
    @NotNull
    @ApiModelProperty(value = "门票产品id")
    private Long id;

    @Max(value = 20,message="编码最大长度为：20")
    @ApiModelProperty(value = "编码")
    private String ticketProductCode;

    @Max(value = 20,message="门票产品名称最大长度为：20")
    @ApiModelProperty(value = "门票产品名称")
    private String ticketProductName;

    @ApiModelProperty(value = "1:成人票 0：儿童票")
    private Byte ticketProductType;

    @Max(value = 50,message="图片地址最大长度为：50")
    @ApiModelProperty(value = "图片地址")
    private String picture;

    @ApiModelProperty(value = "产品经理id")
    private Long productManager;

    @Max(value = 300,message="费用包含最大长度为：300")
    @ApiModelProperty(value = "费用包含")
    private String costInclude;

    @Max(value = 300,message="预定规则最大长度为：300")
    @ApiModelProperty(value = "预定规则")
    private String reservationRule;

    @Max(value = 300,message="退票规则最大长度为：300")
    @ApiModelProperty(value = "退票规则")
    private String refundRules;

    @Max(value = 300,message="补充说明最大长度为：300")
    @ApiModelProperty(value = "补充说明")
    private String explanation;

    @ApiModelProperty(value = "0:无效（未完成设置） 1：设置完成(待申报) 2：申报确认（已完成） 3：入库（未上架） 4：上架  -1：删除'")
    private Byte admissionStatus;

    private Date createrTime;

    private Long createrUser;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTicketProductCode() {
        return ticketProductCode;
    }

    public void setTicketProductCode(String ticketProductCode) {
        this.ticketProductCode = ticketProductCode == null ? null : ticketProductCode.trim();
    }

    public String getTicketProductName() {
        return ticketProductName;
    }

    public void setTicketProductName(String ticketProductName) {
        this.ticketProductName = ticketProductName == null ? null : ticketProductName.trim();
    }

    public Byte getTicketProductType() {
        return ticketProductType;
    }

    public void setTicketProductType(Byte ticketProductType) {
        this.ticketProductType = ticketProductType;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture == null ? null : picture.trim();
    }

    public Long getProductManager() {
        return productManager;
    }

    public void setProductManager(Long productManager) {
        this.productManager = productManager;
    }

    public String getCostInclude() {
        return costInclude;
    }

    public void setCostInclude(String costInclude) {
        this.costInclude = costInclude == null ? null : costInclude.trim();
    }

    public String getReservationRule() {
        return reservationRule;
    }

    public void setReservationRule(String reservationRule) {
        this.reservationRule = reservationRule == null ? null : reservationRule.trim();
    }

    public String getRefundRules() {
        return refundRules;
    }

    public void setRefundRules(String refundRules) {
        this.refundRules = refundRules == null ? null : refundRules.trim();
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation == null ? null : explanation.trim();
    }

    public Byte getAdmissionStatus() {
        return admissionStatus;
    }

    public void setAdmissionStatus(Byte admissionStatus) {
        this.admissionStatus = admissionStatus;
    }

    public Date getCreaterTime() {
        return createrTime;
    }

    public void setCreaterTime(Date createrTime) {
        this.createrTime = createrTime;
    }

    public Long getCreaterUser() {
        return createrUser;
    }

    public void setCreaterUser(Long createrUser) {
        this.createrUser = createrUser;
    }
}