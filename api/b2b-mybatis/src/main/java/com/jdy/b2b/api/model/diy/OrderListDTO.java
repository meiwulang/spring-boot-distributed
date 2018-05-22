package com.jdy.b2b.api.model.diy;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.OrderPay;
import com.jdy.b2b.api.model.OrderPriceDetail;
import com.jdy.b2b.api.model.OrderTourist;

import java.util.Date;
import java.util.List;
import java.util.Objects;

import static java.util.Objects.nonNull;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.springframework.util.CollectionUtils.isEmpty;

/**
 * @Description 订单列表返回对象
 * @Author yyf
 * @DateTime 2017/8/30 11:07
 */
public class OrderListDTO extends Order {
    //产品类型
    private Integer pType;
    private String pNo;
    private String pName;
    private Byte ascription; //产品归属地
    //行程天数
    private Integer pDays;
    //出发日期
    private Date sCalendar;
    private Date sLeaveTime;
    private String sGroupOrderNo;
    private String leaveCity;

    private Date sCalendarBack;

    private String createrURealName;

    private String salerPhone;
    private String buyerPhone;
    private Integer buyerStype;
    private String buyerProvince;
    private String buyerCity;
    private String salerProvince;
    private String salerCity;

    private List<OrderPriceDetail> priceDetails;

    private List<OrderTourist> tourists;
    private List<OrderPay> pays;
    private String buyerName;
    private String buyerDepartName;
    private String salerName;
    private String salerDepartName;
    private String firstPay;
    private String unPay;
    private String allPay;
    private String wxPayNum;
    private String orderType;
    @JsonFormat(timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    private Date payTime;

    private Integer refundRecordStatus;
    private Integer groupDeleteStatus;//团期是否有效 0 有效  1无效
    private Integer groupStatus;//团期状态 0：待发团 1：发团中 2：已结团 3：已回团 4：已取消

    private Integer applyRefundFlag;//能否申请退款的标识 0不行 1行

    //买家可上传支付凭证：0-否 1-是
    private Integer isBuyerVoucher;
    //卖家可确认支付凭证：0-否 1-是
    private Integer isSallerVoucher;

    private Integer childNum;
    private Integer adultNum;

    private Long lastAlterTicketId; //订单对应的最新的改签记录id
    private Integer lastAlterTicketStatus; //改签记录的状态 0待审核 1成功 2关闭

    private Boolean alterTicketFlag;//能否改签的标识。前提是 团期为已回团之前，没有在进行中的退款，没有在进行中的改签，订单为已支付
    private List<OrderListDTO> subOrders;//衍生出的新订单和负订单
    private String touristContactInfo;//游客联系人信息：姓名,电话

    public Boolean getAlterTicketFlag() {
        return alterTicketFlag;
    }

    public void setAlterTicketFlag(Boolean alterTicketFlag) {
        this.alterTicketFlag = alterTicketFlag;
    }

    public Long getLastAlterTicketId() {
        return lastAlterTicketId;
    }

    public void setLastAlterTicketId(Long lastAlterTicketId) {
        this.lastAlterTicketId = lastAlterTicketId;
    }

    public Integer getLastAlterTicketStatus() {
        return lastAlterTicketStatus;
    }

    public void setLastAlterTicketStatus(Integer lastAlterTicketStatus) {
        this.lastAlterTicketStatus = lastAlterTicketStatus;
    }

    public Date getsCalendarBack() {
        return sCalendarBack;
    }

    public void setsCalendarBack(Date sCalendarBack) {
        this.sCalendarBack = sCalendarBack;
    }

    public Integer getApplyRefundFlag() {
        return applyRefundFlag;
    }

    public void setApplyRefundFlag(Integer applyRefundFlag) {
        this.applyRefundFlag = applyRefundFlag;
    }

    public Integer getGroupDeleteStatus() {
        return groupDeleteStatus;
    }

    public void setGroupDeleteStatus(Integer groupDeleteStatus) {
        this.groupDeleteStatus = groupDeleteStatus;
    }

    public Integer getGroupStatus() {
        return groupStatus;
    }

    public void setGroupStatus(Integer groupStatus) {
        this.groupStatus = groupStatus;
    }

    public Byte getAscription() {
        return ascription;
    }

    public void setAscription(Byte ascription) {
        this.ascription = ascription;
    }

    public Integer getRefundRecordStatus() {
        return refundRecordStatus;
    }

    public void setRefundRecordStatus(Integer refundRecordStatus) {
        this.refundRecordStatus = refundRecordStatus;
    }

    public Integer getBuyerStype() {
        return buyerStype;
    }

    public void setBuyerStype(Integer buyerStype) {
        this.buyerStype = buyerStype;
    }

    public String getBuyerName() {
        return buyerName;
    }

    public void setBuyerName(String buyerName) {
        this.buyerName = buyerName;
    }

    public String getBuyerDepartName() {
        return buyerDepartName;
    }

    public void setBuyerDepartName(String buyerDepartName) {
        this.buyerDepartName = buyerDepartName;
    }

    public String getSalerName() {
        return salerName;
    }

    public void setSalerName(String salerName) {
        this.salerName = salerName;
    }

    public String getSalerDepartName() {
        return salerDepartName;
    }

    public void setSalerDepartName(String salerDepartName) {
        this.salerDepartName = salerDepartName;
    }

    public String getFirstPay() {
        return firstPay;
    }

    public void setFirstPay(String firstPay) {
        this.firstPay = firstPay;
    }

    public String getUnPay() {
        return unPay;
    }

    public void setUnPay(String unPay) {
        this.unPay = unPay;
    }

    public String getAllPay() {
        return allPay;
    }

    public void setAllPay(String allPay) {
        this.allPay = allPay;
    }

    public String getWxPayNum() {
        return wxPayNum;
    }

    public void setWxPayNum(String wxPayNum) {
        this.wxPayNum = wxPayNum;
    }

    public String getOrderType() {
        return orderType;
    }

    public void setOrderType(String orderType) {
        this.orderType = orderType;
    }

    public Integer getpType() {
        return pType;
    }

    public void setpType(Integer pType) {
        this.pType = pType;
    }

    public List<OrderPriceDetail> getPriceDetails() {
        return priceDetails;
    }

    public void setPriceDetails(List<OrderPriceDetail> priceDetails) {
        this.priceDetails = priceDetails;
    }

    public List<OrderTourist> getTourists() {
        return tourists;
    }

    public void setTourists(List<OrderTourist> tourists) {
        this.tourists = tourists;
    }

    public String getLeaveCity() {
        return leaveCity;
    }

    public void setLeaveCity(String leaveCity) {
        this.leaveCity = leaveCity;
    }

    public String getSalerPhone() {
        return salerPhone;
    }

    public void setSalerPhone(String salerPhone) {
        this.salerPhone = salerPhone;
    }

    public String getBuyerPhone() {
        return buyerPhone;
    }

    public void setBuyerPhone(String buyerPhone) {
        this.buyerPhone = buyerPhone;
    }

    public String getBuyerProvince() {
        return buyerProvince;
    }

    public void setBuyerProvince(String buyerProvince) {
        this.buyerProvince = buyerProvince;
    }

    public String getBuyerCity() {
        return buyerCity;
    }

    public void setBuyerCity(String buyerCity) {
        this.buyerCity = buyerCity;
    }

    public String getSalerProvince() {
        return salerProvince;
    }

    public void setSalerProvince(String salerProvince) {
        this.salerProvince = salerProvince;
    }

    public String getSalerCity() {
        return salerCity;
    }

    public void setSalerCity(String salerCity) {
        this.salerCity = salerCity;
    }

    public String getCreaterURealName() {
        return createrURealName;
    }

    public void setCreaterURealName(String createrURealName) {
        this.createrURealName = createrURealName;
    }

    public String getpNo() {
        return pNo;
    }

    public void setpNo(String pNo) {
        this.pNo = pNo;
    }

    public String getpName() {
        return pName;
    }

    public void setpName(String pName) {
        this.pName = pName;
    }

    public Integer getpDays() {
        return pDays;
    }

    public void setpDays(Integer pDays) {
        this.pDays = pDays;
    }

    public Date getsCalendar() {
        return sCalendar;
    }

    public void setsCalendar(Date sCalendar) {
        this.sCalendar = sCalendar;
    }

    public Date getsLeaveTime() {
        return sLeaveTime;
    }

    public void setsLeaveTime(Date sLeaveTime) {
        this.sLeaveTime = sLeaveTime;
    }

    public String getsGroupOrderNo() {
        return sGroupOrderNo;
    }

    public void setsGroupOrderNo(String sGroupOrderNo) {
        this.sGroupOrderNo = sGroupOrderNo;
    }

    public Date getPayTime() {
        if (!isEmpty(pays)) {
            pays.stream().filter(p -> nonNull(p.getOpPayTime())).sorted((p1, p2) -> p2.getOpPayTime().compareTo(p1.getOpPayTime())).findFirst().ifPresent(pay -> this.payTime = pay.getOpPayTime());
        }
        return payTime;
    }

    public void setPayTime(Date payTime) {
        this.payTime = payTime;
    }

    public List<OrderPay> getPays() {
        return pays;
    }

    public void setPays(List<OrderPay> pays) {
        this.pays = pays;
    }

    public Integer getIsBuyerVoucher() {
        Integer offSt = getOfflineStatus();
        if (1 == getoStatus() && (offSt == null || Objects.equals(1,offSt))) return 1;
        if (4 == getoSource() && (3 == getoStatus() || 10 == getoStatus() || 11 == getoStatus()) && (offSt == null || Objects.equals(2,offSt) || Objects.equals(3,offSt) || Objects.equals(4,offSt)) && !isBlank(getUnPay())) return 1;
        return 0;
    }

    public Integer getIsSallerVoucher() {
        Integer offSt = getOfflineStatus();
        if ((1 == getoStatus() || 11 == getoStatus()) && (Objects.equals(0,offSt)|| (Objects.equals(2,offSt)))) return 1;
        if (4 == getoSource() && (3 == getoStatus() || 10 == getoStatus() || 11 == getoStatus()) && Objects.equals(3,offSt) && !isBlank(getUnPay())) return 1;
        return 0;
    }

    public Integer getChildNum() {
        return childNum;
    }

    public void setChildNum(Integer childNum) {
        this.childNum = childNum;
    }

    public Integer getAdultNum() {
        return adultNum;
    }

    public void setAdultNum(Integer adultNum) {
        this.adultNum = adultNum;
    }

    public List<OrderListDTO> getSubOrders() {
        return subOrders;
    }

    public void setSubOrders(List<OrderListDTO> subOrders) {
        this.subOrders = subOrders;
    }

    public String getTouristContactInfo() {
        return touristContactInfo;
    }

    public void setTouristContactInfo(String touristContactInfo) {
        this.touristContactInfo = touristContactInfo;
    }
}
