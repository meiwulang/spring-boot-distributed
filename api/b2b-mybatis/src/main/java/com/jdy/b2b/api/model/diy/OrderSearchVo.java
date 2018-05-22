package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.common.BaseVO;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/8/29 16:49
 */
public class OrderSearchVo extends BaseVO {

    //用于根据ids列表查询准确的列表
    private List<Long> ids;

    //0-卖家订单，1-买家订单
    private Integer orderType;

    //是否导出接口
    private Boolean export;

    //状态 0:待确认 1:待付款 2:收款中 3:已付款 4:已退票 6:已驳回 10:已首款 11:待确认
    private Integer oStatus;

    //时间范围类型，1-出团时间，2-下单时间,3-付款时间
    private Integer dateType;

    //开始日期
    private Date dateStart;

    //结束日期
    private Date dateEnd;

    //快速查询关键字
    private String searchKey;

    //品牌
    private Integer pBrand;

    //产品
    private Long oProductId;
    private List<Long> productIds;

    //产品类型
    private List<Integer> pTypes;
    private Byte ascription;  //产品归属

    //报名人
    private Long oBuyerId;
    private List<Long> buyerUserIds;

    //报名社
    private Long oBuyerCompanyId;
    private List<Long> buyerCompanyIds;

    private Long buyerDepartId;
    private List<Long> buyerDepartIds;

    //供应商计调人员（创建产品的用户）
    private Long oSalerId;

    //供应商
    private Long oSalerCompanyId;
    private List<Long> salerCompanyIds;

    private List<Long> salerDepartIds;

    private Integer oPayMethod;

    //-1:null|0, 0:0, 1:>0
    private BigDecimal unPay;

    private Boolean withOutContract;

    //订单类型：1-个人，2-企业
    private Integer oType;
    private List<Integer> offlineStatuses;

    //1-待审核 2-已通过 3-未通过
    private Integer contractStatus;
    //改签状态  0进行中 1成功 2关闭
    private Integer alterTicketStatus;

    private Integer refundStatus;
    private Integer searchSrcOrder;//只搜索原订单（针对改签和退票单）

    public Integer getAlterTicketStatus() {
        return alterTicketStatus;
    }

    public void setAlterTicketStatus(Integer alterTicketStatus) {
        this.alterTicketStatus = alterTicketStatus;
    }

    public Boolean getWithOutContract() {
        return withOutContract;
    }

    public void setWithOutContract(Boolean withOutContract) {
        this.withOutContract = withOutContract;
    }

    public Boolean getExport() {
        return export;
    }

    public void setExport(Boolean export) {
        this.export = export;
    }

    public Integer getOrderType() {
        return orderType;
    }

    public void setOrderType(Integer orderType) {
        this.orderType = orderType;
    }

    public Integer getDateType() {
        return dateType;
    }

    public void setDateType(Integer dateType) {
        this.dateType = dateType;
    }

    public Date getDateStart() {
        return dateStart;
    }

    public void setDateStart(Date dateStart) {
        this.dateStart = dateStart;
    }

    public Date getDateEnd() {
        return dateEnd;
    }

    public void setDateEnd(Date dateEnd) {
        this.dateEnd = dateEnd;
    }

    public String getSearchKey() {
        return searchKey;
    }

    public void setSearchKey(String searchKey) {
        this.searchKey = searchKey;
    }

    public Integer getpBrand() {
        return pBrand;
    }

    public void setpBrand(Integer pBrand) {
        this.pBrand = pBrand;
    }

    public Long getoProductId() {
        return oProductId;
    }

    public void setoProductId(Long oProductId) {
        this.oProductId = oProductId;
    }

    public List<Integer> getpTypes() {
        return pTypes;
    }

    public void setpTypes(List<Integer> pTypes) {
        this.pTypes = pTypes;
    }

    public Long getoBuyerId() {
        return oBuyerId;
    }

    public void setoBuyerId(Long oBuyerId) {
        this.oBuyerId = oBuyerId;
    }

    public Long getoSalerId() {
        return oSalerId;
    }

    public void setoSalerId(Long oSalerId) {
        this.oSalerId = oSalerId;
    }

    public Integer getoPayMethod() {
        return oPayMethod;
    }

    public void setoPayMethod(Integer oPayMethod) {
        this.oPayMethod = oPayMethod;
    }

    public List<Long> getIds() {
        return ids;
    }

    public void setIds(List<Long> ids) {
        this.ids = ids;
    }

    public List<Long> getBuyerCompanyIds() {
        return buyerCompanyIds;
    }

    public void setBuyerCompanyIds(List<Long> buyerCompanyIds) {
        this.buyerCompanyIds = buyerCompanyIds;
    }

    public List<Long> getSalerCompanyIds() {
        return salerCompanyIds;
    }

    public void setSalerCompanyIds(List<Long> salerCompanyIds) {
        this.salerCompanyIds = salerCompanyIds;
    }

    public List<Long> getBuyerDepartIds() {
        return buyerDepartIds;
    }

    public void setBuyerDepartIds(List<Long> buyerDepartIds) {
        this.buyerDepartIds = buyerDepartIds;
    }

    public List<Long> getSalerDepartIds() {
        return salerDepartIds;
    }

    public void setSalerDepartIds(List<Long> salerDepartIds) {
        this.salerDepartIds = salerDepartIds;
    }

    public Long getoBuyerCompanyId() {
        return oBuyerCompanyId;
    }

    public void setoBuyerCompanyId(Long oBuyerCompanyId) {
        this.oBuyerCompanyId = oBuyerCompanyId;
    }

    public Long getoSalerCompanyId() {
        return oSalerCompanyId;
    }

    public void setoSalerCompanyId(Long oSalerCompanyId) {
        this.oSalerCompanyId = oSalerCompanyId;
    }

    public void setBuyerDepartId(Long buyerDepartId) {
        this.buyerDepartId = buyerDepartId;
    }

    public Long getBuyerDepartId() {
        return buyerDepartId;
    }

    public void setBuyerUserIds(List<Long> buyerUserIds) {
        this.buyerUserIds = buyerUserIds;
    }

    public List<Long> getBuyerUserIds() {
        return buyerUserIds;
    }

    public Integer getoType() {
        return oType;
    }

    public void setoType(Integer oType) {
        this.oType = oType;
    }

    public List<Integer> getOfflineStatuses() {
        return offlineStatuses;
    }

    public void setOfflineStatuses(List<Integer> offlineStatuses) {
        this.offlineStatuses = offlineStatuses;
    }

    public Integer getoStatus() {
        return oStatus;
    }

    public void setoStatus(Integer oStatus) {
        this.oStatus = oStatus;
    }

    public BigDecimal getUnPay() {
        return unPay;
    }

    public void setUnPay(BigDecimal unPay) {
        this.unPay = unPay;
    }

    public Integer getContractStatus() {
        return contractStatus;
    }

    public void setContractStatus(Integer contractStatus) {
        this.contractStatus = contractStatus;
    }

    public Integer getRefundStatus() {
        return refundStatus;
    }

    public void setRefundStatus(Integer refundStatus) {
        this.refundStatus = refundStatus;
    }

    public List<Long> getProductIds() {
        return productIds;
    }

    public void setProductIds(List<Long> productIds) {
        this.productIds = productIds;
    }

    public Byte getAscription() {
        return ascription;
    }

    public void setAscription(Byte ascription) {
        this.ascription = ascription;
    }

    public Integer getSearchSrcOrder() {
        return searchSrcOrder;
    }

    public void setSearchSrcOrder(Integer searchSrcOrder) {
        this.searchSrcOrder = searchSrcOrder;
    }
}
