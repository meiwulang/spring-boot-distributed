package com.jdy.b2b.api.model;

import com.jdy.b2b.api.common.BaseVO;

import java.math.BigDecimal;
import java.util.Date;

public class Order extends BaseVO{
    private Long id;

    private String oOrderNo;

    private Long oProductId;

    private Long oScheduleId;

    private Date oConfirmTime;

    private String oGroupOrderNo;

    private String oExternalNo;

    private String oContractNo;

    private String oContractAgreement;

    private String oRemark;

    private Long oSalerCompanyId;

    private String oSalerCompanyName;

    private Long oSalerId;

    private String oSalerName;

    private Long oBuyerCompanyId;

    private String oBuyerCompanyName;

    private Long oBuyerId;

    private String oBuyerName;

    private String oServicer;

    private String oServicerPhone;

    private Integer oPeopleNum;

    private Integer oBedNum;

    private BigDecimal oRoomAdjust;

    private BigDecimal oMarketPrice;

    private BigDecimal oPreferentialAmount;

    private BigDecimal oSettlementReferences;

    private BigDecimal oTotalPrice;

    private BigDecimal oRealPrice;

    private BigDecimal oRealPay;

    private Integer oPayMethod;

    private Date oPayTime;

    private BigDecimal oToPay;

    private Byte oIsmerge;

    private Boolean oPlan;

    private Integer oStatus;

    private Integer oType;// 订单类型：1-个人，2-企业

    private Integer offlineStatus;//  线下支付凭证状态：0-待确认 1-驳回 2-已确认 3-二次支付待确认 4-二次支付驳回 5-二次支付已确认

    private Date oInvalidTime;

    private BigDecimal oInvoiceAmount;
    private BigDecimal refundAmount;
    private Integer refundStatus;

    /*[{"busId":1,"seat":"1,2,3","busNo":1}]*/
    private String oBusSeat;

    /*来源：1:pc, 2:h5*/
    private Byte oSource;

    private Boolean oSynchro;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    private BigDecimal oFirstPay;

    private BigDecimal oUnPay;

    private Long alterTicketId;
    private Long orderNegId;
    private Long srcOrderId;

    public Order() {
    }

    public Order(Long id) {
        this.id = id;
    }

    public BigDecimal getoFirstPay() {
        return oFirstPay;
    }

    public void setoFirstPay(BigDecimal oFirstPay) {
        this.oFirstPay = oFirstPay;
    }

    public BigDecimal getoUnPay() {
        return oUnPay;
    }

    public void setoUnPay(BigDecimal oUnPay) {
        this.oUnPay = oUnPay;
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

    public Boolean getoSynchro() {
        return oSynchro;
    }

    public void setoSynchro(Boolean oSynchro) {
        this.oSynchro = oSynchro;
    }

    public String getoGroupOrderNo() {
        return oGroupOrderNo;
    }

    public void setoGroupOrderNo(String oGroupOrderNo) {
        this.oGroupOrderNo = oGroupOrderNo;
    }

    public String getoContractAgreement() {
        return oContractAgreement;
    }

    public void setoContractAgreement(String oContractAgreement) {
        this.oContractAgreement = oContractAgreement;
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

    public Date getoPayTime() {
        return oPayTime;
    }

    public void setoPayTime(Date oPayTime) {
        this.oPayTime = oPayTime;
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

    public Long getAlterTicketId() {
        return alterTicketId;
    }

    public void setAlterTicketId(Long alterTicketId) {
        this.alterTicketId = alterTicketId;
    }

    public Long getOrderNegId() {
        return orderNegId;
    }

    public void setOrderNegId(Long orderNegId) {
        this.orderNegId = orderNegId;
    }

    public Long getSrcOrderId() {
        return srcOrderId;
    }

    public void setSrcOrderId(Long srcOrderId) {
        this.srcOrderId = srcOrderId;
    }
}