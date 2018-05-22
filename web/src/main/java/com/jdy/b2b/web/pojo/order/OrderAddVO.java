package com.jdy.b2b.web.pojo.order;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.NotEmpty;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/19 11:31
 */
@ApiModel(description = "新增订单VO")
public class OrderAddVO extends BaseVO {

    @NotNull
    @ApiModelProperty(value = "班期id")
    private Long oScheduleId;

    @ApiModelProperty(value = "外部订单号")
    private String oExternalNo;

    @ApiModelProperty(value = "合同号")
    private String oContractNo;

    @ApiModelProperty(value = "备注")
    private String oRemark;

    @NotNull
    @ApiModelProperty(value = "是否代办")
    private Boolean isAgent;

    @ApiModelProperty(value = "买家公司id")
    private Long oBuyerCompanyId;

    @ApiModelProperty(value = "买家公司名称")
    private String oBuyerCompanyName;

    @ApiModelProperty(value = "买家id")
    private Long oBuyerId;

    @ApiModelProperty(value = "买家姓名")
    private String oBuyerName;

    @ApiModelProperty(value = "优惠金额：手动输入给顾客的优惠")
    private BigDecimal oPreferentialAmount;

    @ApiModelProperty(value = "结算优惠价(供应商替分销商报名时,手动输入给他的优惠价)")
    private BigDecimal oSettlementReferences;

    @ApiModelProperty(value = "车辆id、车号、座位json：[{'busId':1,'seat':'1,2,3','busNo':1}]")
    private String oBusSeat;

    @NotNull
    @Range(min = 1, max = 3)
    @ApiModelProperty(value = "订单来源：1-pc,2-h5,3-cs")
    private Byte oSource;

    @ApiModelProperty(value = "合同补充约定")
    private String oContractAgreement;

    @ApiModelProperty(value = "价格详情列表")
    @NotNull
    @NotEmpty
    private List<OrderAddPriceDetailDTO> priceDetails;

    @ApiModelProperty(value = "游客信息列表")
    @NotNull
    @NotEmpty
    private List<OrderAddTouristDTO> tourists;

    @ApiModelProperty(value = "礼品卡")
    private List<CardDO> cardDOS;
    @ApiModelProperty(value = "小程序openid")
    private String appletId;

    @ApiModelProperty(value = "1-首付款方式下单")
    private Integer bookType;

    @ApiModelProperty(value = "订单类型：1-个人，2-企业")
    @Range(min = 1,max=2)
    private Integer oType;

    @ApiModelProperty(value = "线下支付凭证状态：0-待确认 1-驳回 2-已确认 3-二次支付待确认 4-二次支付驳回 5-二次支付已确认")
    private List<Integer> offlineStatuses;

    public Integer getoType() {
        return oType;
    }

    public void setoType(Integer oType) {
        this.oType = oType;
    }

    public Integer getBookType() {
        return bookType;
    }

    public void setBookType(Integer bookType) {
        this.bookType = bookType;
    }

    public Long getoScheduleId() {
        return oScheduleId;
    }

    public void setoScheduleId(Long oScheduleId) {
        this.oScheduleId = oScheduleId;
    }

    public String getoExternalNo() {
        return oExternalNo;
    }

    public void setoExternalNo(String oExternalNo) {
        this.oExternalNo = oExternalNo;
    }

    public String getoContractNo() {
        return oContractNo;
    }

    public void setoContractNo(String oContractNo) {
        this.oContractNo = oContractNo;
    }

    public String getoRemark() {
        return oRemark;
    }

    public void setoRemark(String oRemark) {
        this.oRemark = oRemark;
    }

    public Boolean getAgent() {
        return isAgent;
    }

    public void setAgent(Boolean agent) {
        isAgent = agent;
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
        this.oBuyerCompanyName = oBuyerCompanyName;
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
        this.oBuyerName = oBuyerName;
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

    public String getoBusSeat() {
        return oBusSeat;
    }

    public void setoBusSeat(String oBusSeat) {
        this.oBusSeat = oBusSeat;
    }

    public List<OrderAddPriceDetailDTO> getPriceDetails() {
        return priceDetails;
    }

    public void setPriceDetails(List<OrderAddPriceDetailDTO> priceDetails) {
        this.priceDetails = priceDetails;
    }

    public List<OrderAddTouristDTO> getTourists() {
        return tourists;
    }

    public void setTourists(List<OrderAddTouristDTO> tourists) {
        this.tourists = tourists;
    }

    public Byte getoSource() {
        return oSource;
    }

    public void setoSource(Byte oSource) {
        this.oSource = oSource;
    }

    public String getoContractAgreement() {
        return oContractAgreement;
    }

    public void setoContractAgreement(String oContractAgreement) {
        this.oContractAgreement = oContractAgreement;
    }

    public List<CardDO> getCardDOS() {
        return cardDOS;
    }

    public void setCardDOS(List<CardDO> cardDOS) {
        this.cardDOS = cardDOS;
    }

    public String getAppletId() {
        return appletId;
    }

    public void setAppletId(String appletId) {
        this.appletId = appletId;
    }

    public List<Integer> getOfflineStatuses() {
        return offlineStatuses;
    }

    public void setOfflineStatuses(List<Integer> offlineStatuses) {
        this.offlineStatuses = offlineStatuses;
    }
}
