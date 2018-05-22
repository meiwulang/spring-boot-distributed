package com.jdy.b2b.web.pojo.order;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/8/29 16:49
 */
@ApiModel(description = "订单搜索导出VO")
public class OrderSearchVO extends BaseVO {

    @ApiModelProperty(value = "0-卖家订单，1-买家订单")
    @NotNull
    @Range(min = 0, max = 1)
    private Integer orderType;

    @ApiModelProperty(value = "是否导出接口")
    @NotNull
    private Boolean export;

    @ApiModelProperty(value = "状态 0:待确认 1:待付款 2:收款中 3:已付款 4:已退票 6:已驳回 10:已首款 11:待确认")
    private Integer oStatus;

    @ApiModelProperty(value = "时间范围类型，1-出团时间，2-交易时间,3-付款时间")
    @Range(min = 1, max = 3)
    private Integer dateType;

    @ApiModelProperty(value = "开始日期")
    private Date dateStart;

    @ApiModelProperty(value = "结束日期")
    private Date dateEnd;

    @ApiModelProperty(value = "快速查询关键字")
    private String searchKey;

    @ApiModelProperty(value = "品牌")
    private Integer pBrand;

    @ApiModelProperty(value = "产品")
    private Long oProductId;

    @ApiModelProperty(value = "产品类型")
    private List<Integer> pTypes;

    @ApiModelProperty(value = "报名人")
    private Long oBuyerId;

    @ApiModelProperty(value = "报名社")
    private Long oBuyerCompanyId;

    @ApiModelProperty(value = "供应商计调人员（创建产品的用户）")
    private Long oSalerId;

    @ApiModelProperty(value = "供应商")
    private Long oSalerCompanyId;

    @ApiModelProperty(value = "支付方式 2:线下支付 3:微信")
    @Range(min = 0, max = 4)
    private Integer oPayMethod;

    @ApiModelProperty(value = "订单类型：1-个人，2-企业")
    @Range(min = 1, max = 2)
    private Integer oType;

    private Boolean withOutContract;

    @ApiModelProperty(value = "1-待审核 2-已通过 3-未通过")
    private Integer contractStatus;

    @ApiModelProperty(value = "改签状态  0进行中 1成功 2关闭")
    private Integer alterTicketStatus;

    private List<Long> buyerCompanyIds;

    public Integer getAlterTicketStatus() {
        return alterTicketStatus;
    }

    public void setAlterTicketStatus(Integer alterTicketStatus) {
        this.alterTicketStatus = alterTicketStatus;
    }

    public List<Long> getBuyerCompanyIds() {
        return buyerCompanyIds;
    }

    public void setBuyerCompanyIds(List<Long> buyerCompanyIds) {
        this.buyerCompanyIds = buyerCompanyIds;
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

    public Integer getoStatus() {
        return oStatus;
    }

    public void setoStatus(Integer oStatus) {
        this.oStatus = oStatus;
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

    public Integer getoType() {
        return oType;
    }

    public void setoType(Integer oType) {
        this.oType = oType;
    }

    public Integer getContractStatus() {
        return contractStatus;
    }

    public void setContractStatus(Integer contractStatus) {
        this.contractStatus = contractStatus;
    }
}
