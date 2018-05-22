package com.jdy.b2b.web.pojo.order;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.math.BigDecimal;
import java.util.Date;

@ApiModel(description = "订单vo")
public class Order extends BaseVO {
    private Long id;
    @ApiModelProperty(value = "订单编号")
    private String oOrderNo;

    @ApiModelProperty(value = "产品id")
    private Long oProductId;
    @ApiModelProperty(value = "班期id")
    private Long oScheduleId;
    @ApiModelProperty(value = "确认时间")
    private Date oConfirmTime;
    @ApiModelProperty(value = "外部订单号")
    private String oExternalNo;
    @ApiModelProperty(value = "合同号")
    private String oContractNo;
    @ApiModelProperty(value = "备注")
    private String oRemark;
    @ApiModelProperty(value = "供应商公司id")
    private Long oSalerCompanyId;
    @ApiModelProperty(value = "供应商公司名称")
    private String oSalerCompanyName;
    @ApiModelProperty(value = "供应商计调人员id")
    private Long oSalerId;
    @ApiModelProperty(value = "供应商计调人员名称")
    private String oSalerName;
    @ApiModelProperty(value = "分销商公司id")
    private Long oBuyerCompanyId;
    @ApiModelProperty(value = "分销商公司名称")
    private String oBuyerCompanyName;
    @ApiModelProperty(value = "分销商下单人id")
    private Long oBuyerId;
    @ApiModelProperty(value = "分销商下单人名称")
    private String oBuyerName;
    @ApiModelProperty(value = "客服")
    private String oServicer;
    @ApiModelProperty(value = "客服电话")
    private String oServicerPhone;
    @ApiModelProperty(value = "订单人数")
    private Integer oPeopleNum;
    @ApiModelProperty(value = "订单床位数")
    private Integer oBedNum;
    @ApiModelProperty(value = "房差金额")
    private BigDecimal oRoomAdjust;
    @ApiModelProperty(value = "销售总金额")
    private BigDecimal oMarketPrice;
    @ApiModelProperty(value = "订单优惠")
    private BigDecimal oPreferentialAmount;
    @ApiModelProperty(value = "结算优惠")
    private BigDecimal oSettlementReferences;
    @ApiModelProperty(value = "结算总价（不算结算优惠）")
    private BigDecimal oTotalPrice;
    @ApiModelProperty(value = "实际结算价")
    private BigDecimal oRealPrice;
    @ApiModelProperty(value = "实际支付价")
    private BigDecimal oRealPay;
    @ApiModelProperty(value = "待支付")
    private BigDecimal oToPay;
    @ApiModelProperty(value = "支付方式 0:在线支付 1:信用支付 2:线下支付")
    private Integer oPayMethod;
    @ApiModelProperty(value = "是否加入到账单 0:未加入 1:加入 2:部分加入")
    private Byte oIsmerge;
    @ApiModelProperty(value = "计划生成 0:未生成 1:生成")
    private Boolean oPlan;
    @ApiModelProperty(value = "状态 0:待确认 1:待付款 2:收款中 3:已付款 4:已退票")
    private Integer oStatus;
    @ApiModelProperty(value = "失效时间")
    private Date oInvalidTime;
    @ApiModelProperty(value = "可开发票金额")
    private BigDecimal oInvoiceAmount;
    @ApiModelProperty(value = "车辆座位json：[{\"busId\":1,\"seat\":\"1,2,3\",\"busNo\":1}]")
    private String oBusSeat;
    @ApiModelProperty(value = "订单来源：1-pc，2-h5")
    private Byte oSource;
    @ApiModelProperty(value = "订单类型：1-个人，2-企业")
    private Integer oType;
    @ApiModelProperty(value = "线下支付凭证状态：0-待确认 1-驳回 2-已确认 3-二次支付待确认 4-二次支付驳回 5-二次支付已确认")
    private Integer offlineStatus;
    @ApiModelProperty(value = "改签记录Id")
    private Long alterTicketId;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    private BigDecimal refundAmount;

    private Integer refundStatus;

    public Order() {
    }

    public BigDecimal getRefundAmount() {
        return refundAmount;
    }

    public void setRefundAmount(BigDecimal refundAmount) {
        this.refundAmount = refundAmount;
    }

    public Integer getRefundStatus() {
        return refundStatus;
    }

    public void setRefundStatus(Integer refundStatus) {
        this.refundStatus = refundStatus;
    }

    public Order(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getoOrderNo() {
        return oOrderNo;
    }

    public void setoOrderNo(String oOrderNo) {
        this.oOrderNo = oOrderNo == null ? null : oOrderNo.trim();
    }

    public Long getoProductId() {
        return oProductId;
    }

    public void setoProductId(Long oProductId) {
        this.oProductId = oProductId;
    }

    public Long getoScheduleId() {
        return oScheduleId;
    }

    public void setoScheduleId(Long oScheduleId) {
        this.oScheduleId = oScheduleId;
    }

    public Date getoConfirmTime() {
        return oConfirmTime;
    }

    public void setoConfirmTime(Date oConfirmTime) {
        this.oConfirmTime = oConfirmTime;
    }

    public String getoExternalNo() {
        return oExternalNo;
    }

    public void setoExternalNo(String oExternalNo) {
        this.oExternalNo = oExternalNo == null ? null : oExternalNo.trim();
    }

    public String getoContractNo() {
        return oContractNo;
    }

    public void setoContractNo(String oContractNo) {
        this.oContractNo = oContractNo == null ? null : oContractNo.trim();
    }

    public String getoRemark() {
        return oRemark;
    }

    public void setoRemark(String oRemark) {
        this.oRemark = oRemark == null ? null : oRemark.trim();
    }

    public Long getoSalerCompanyId() {
        return oSalerCompanyId;
    }

    public void setoSalerCompanyId(Long oSalerCompanyId) {
        this.oSalerCompanyId = oSalerCompanyId;
    }

    public String getoSalerCompanyName() {
        return oSalerCompanyName;
    }

    public void setoSalerCompanyName(String oSalerCompanyName) {
        this.oSalerCompanyName = oSalerCompanyName == null ? null : oSalerCompanyName.trim();
    }

    public Long getoSalerId() {
        return oSalerId;
    }

    public void setoSalerId(Long oSalerId) {
        this.oSalerId = oSalerId;
    }

    public String getoSalerName() {
        return oSalerName;
    }

    public void setoSalerName(String oSalerName) {
        this.oSalerName = oSalerName == null ? null : oSalerName.trim();
    }

    public Long getoBuyerCompanyId() {
        return oBuyerCompanyId;
    }

    public void setoBuyerCompanyId(Long oBuyerCompanyId) {
        this.oBuyerCompanyId = oBuyerCompanyId;
    }

    public String getoBuyerCompanyName() {
        return oBuyerCompanyName;
    }

    public void setoBuyerCompanyName(String oBuyerCompanyName) {
        this.oBuyerCompanyName = oBuyerCompanyName == null ? null : oBuyerCompanyName.trim();
    }

    public Long getoBuyerId() {
        return oBuyerId;
    }

    public void setoBuyerId(Long oBuyerId) {
        this.oBuyerId = oBuyerId;
    }

    public String getoBuyerName() {
        return oBuyerName;
    }

    public void setoBuyerName(String oBuyerName) {
        this.oBuyerName = oBuyerName == null ? null : oBuyerName.trim();
    }

    public String getoServicer() {
        return oServicer;
    }

    public void setoServicer(String oServicer) {
        this.oServicer = oServicer == null ? null : oServicer.trim();
    }

    public String getoServicerPhone() {
        return oServicerPhone;
    }

    public void setoServicerPhone(String oServicerPhone) {
        this.oServicerPhone = oServicerPhone == null ? null : oServicerPhone.trim();
    }

    public Integer getoPeopleNum() {
        return oPeopleNum;
    }

    public void setoPeopleNum(Integer oPeopleNum) {
        this.oPeopleNum = oPeopleNum;
    }

    public Integer getoBedNum() {
        return oBedNum;
    }

    public void setoBedNum(Integer oBedNum) {
        this.oBedNum = oBedNum;
    }

    public BigDecimal getoRoomAdjust() {
        return oRoomAdjust;
    }

    public void setoRoomAdjust(BigDecimal oRoomAdjust) {
        this.oRoomAdjust = oRoomAdjust;
    }

    public BigDecimal getoMarketPrice() {
        return oMarketPrice;
    }

    public void setoMarketPrice(BigDecimal oMarketPrice) {
        this.oMarketPrice = oMarketPrice;
    }

    public BigDecimal getoPreferentialAmount() {
        return oPreferentialAmount;
    }

    public void setoPreferentialAmount(BigDecimal oPreferentialAmount) {
        this.oPreferentialAmount = oPreferentialAmount;
    }

    public BigDecimal getoSettlementReferences() {
        return oSettlementReferences;
    }

    public void setoSettlementReferences(BigDecimal oSettlementReferences) {
        this.oSettlementReferences = oSettlementReferences;
    }

    public BigDecimal getoTotalPrice() {
        return oTotalPrice;
    }

    public void setoTotalPrice(BigDecimal oTotalPrice) {
        this.oTotalPrice = oTotalPrice;
    }

    public BigDecimal getoRealPrice() {
        return oRealPrice;
    }

    public void setoRealPrice(BigDecimal oRealPrice) {
        this.oRealPrice = oRealPrice;
    }

    public BigDecimal getoRealPay() {
        return oRealPay;
    }

    public void setoRealPay(BigDecimal oRealPay) {
        this.oRealPay = oRealPay;
    }

    public Integer getoPayMethod() {
        return oPayMethod;
    }

    public void setoPayMethod(Integer oPayMethod) {
        this.oPayMethod = oPayMethod;
    }

    public Byte getoIsmerge() {
        return oIsmerge;
    }

    public void setoIsmerge(Byte oIsmerge) {
        this.oIsmerge = oIsmerge;
    }

    public Boolean getoPlan() {
        return oPlan;
    }

    public void setoPlan(Boolean oPlan) {
        this.oPlan = oPlan;
    }

    public Integer getoStatus() {
        return oStatus;
    }

    public void setoStatus(Integer oStatus) {
        this.oStatus = oStatus;
    }

    public Date getoInvalidTime() {
        return oInvalidTime;
    }

    public void setoInvalidTime(Date oInvalidTime) {
        this.oInvalidTime = oInvalidTime;
    }

    public BigDecimal getoInvoiceAmount() {
        return oInvoiceAmount;
    }

    public void setoInvoiceAmount(BigDecimal oInvoiceAmount) {
        this.oInvoiceAmount = oInvoiceAmount;
    }

    public String getoBusSeat() {
        return oBusSeat;
    }

    public void setoBusSeat(String oBusSeat) {
        this.oBusSeat = oBusSeat == null ? null : oBusSeat.trim();
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

    public Byte getoSource() {
        return oSource;
    }

    public void setoSource(Byte oSource) {
        this.oSource = oSource;
    }

    public BigDecimal getoToPay() {
        return oToPay;
    }

    public void setoToPay(BigDecimal oToPay) {
        this.oToPay = oToPay;
    }

    public Integer getoType() {
        return oType;
    }

    public void setoType(Integer oType) {
        this.oType = oType;
    }

    public Integer getOfflineStatus() {
        return offlineStatus;
    }

    public void setOfflineStatus(Integer offlineStatus) {
        this.offlineStatus = offlineStatus;
    }

    public Long getAlterTicketId() {
        return alterTicketId;
    }

    public void setAlterTicketId(Long alterTicketId) {
        this.alterTicketId = alterTicketId;
    }
}