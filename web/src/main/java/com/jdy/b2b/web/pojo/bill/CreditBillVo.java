package com.jdy.b2b.web.pojo.bill;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * Created by strict on 2017/9/6.
 */
@ApiModel
public class CreditBillVo extends BaseVO {
    @ApiModelProperty(value = "账单日期开始时间",required = false)
    private String createTimeS;
    @ApiModelProperty(value = "账单日期结束时间",required = false)
    private String createTimeE;
    @ApiModelProperty(value = "结算周期",required = false)
    private Integer cSettlementCycle;
    @ApiModelProperty(value = "全局搜索",required = false)
    private String searchKey;
    @ApiModelProperty(value = "是否启用'不包含已撤销'",required = false)
    private Integer excludeRevoked; //不包括已撤销的 1表示启用  0表示不启用
    @ApiModelProperty(value = "是否是上级单位",required = false)
    private Integer isSup; // 是否是上级部门(即有子公司) 1是  0否
    @ApiModelProperty(value = "付款单位",required = false)
    private Long bBuyerCompanyId;
    @ApiModelProperty(value = "收款单位",required = false)
    private Long bSalerCompanyId;
    @ApiModelProperty(value = "账单类型",required = false)
    private Integer bType;
    @ApiModelProperty(value = "账单生成方式",required = false)
    private Byte bBillType;
    @ApiModelProperty(value = "账单状态",required = false)
    private Integer bStatus;

    public Integer getExcludeRevoked() {
        return excludeRevoked;
    }

    public void setExcludeRevoked(Integer excludeRevoked) {
        this.excludeRevoked = excludeRevoked;
    }

    public Integer getIsSup() {
        return isSup;
    }

    public void setIsSup(Integer isSup) {
        this.isSup = isSup;
    }

    public String getCreateTimeS() {
        return createTimeS;
    }

    public void setCreateTimeS(String createTimeS) {
        this.createTimeS = createTimeS;
    }

    public String getCreateTimeE() {
        return createTimeE;
    }

    public void setCreateTimeE(String createTimeE) {
        this.createTimeE = createTimeE;
    }

    public Integer getcSettlementCycle() {
        return cSettlementCycle;
    }

    public void setcSettlementCycle(Integer cSettlementCycle) {
        this.cSettlementCycle = cSettlementCycle;
    }

    public String getSearchKey() {
        return searchKey;
    }

    public void setSearchKey(String searchKey) {
        this.searchKey = searchKey;
    }

    public Long getbBuyerCompanyId() {
        return bBuyerCompanyId;
    }

    public void setbBuyerCompanyId(Long bBuyerCompanyId) {
        this.bBuyerCompanyId = bBuyerCompanyId;
    }

    public Long getbSalerCompanyId() {
        return bSalerCompanyId;
    }

    public void setbSalerCompanyId(Long bSalerCompanyId) {
        this.bSalerCompanyId = bSalerCompanyId;
    }

    public Integer getbType() {
        return bType;
    }

    public void setbType(Integer bType) {
        this.bType = bType;
    }

    public Byte getbBillType() {
        return bBillType;
    }

    public void setbBillType(Byte bBillType) {
        this.bBillType = bBillType;
    }

    public Integer getbStatus() {
        return bStatus;
    }

    public void setbStatus(Integer bStatus) {
        this.bStatus = bStatus;
    }
}
