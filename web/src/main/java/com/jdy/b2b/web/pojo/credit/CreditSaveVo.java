package com.jdy.b2b.web.pojo.credit;


import java.math.BigDecimal;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import com.jdy.b2b.web.util.BaseVO;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * Created by yangcheng on 2017/8/30.
 */
@ApiModel
public class CreditSaveVo extends BaseVO {
    @ApiModelProperty(value="信用余额,不能为空",hidden = true)
    private BigDecimal cCreditBalance;
    @ApiModelProperty(value="已用额度,不能为空",hidden = true)
    private BigDecimal cCreditUsed;
    @NotNull(message="供应商id不能为空!")
    @ApiModelProperty(value = "供应商id,不能为空")
    private Long cSupplierId;
    @NotNull(message="供应商名称不能为空!")
    @ApiModelProperty(value="供应商名称,不能为空")
    private String cSupplierName;
    @NotNull(message="分销商id不能为空!")
    @ApiModelProperty(value="分销商id,不能为空")
    private Long cDistributorId;
    @NotNull(message="分销商名称不能为空!")
    @ApiModelProperty(value="分销商名称,不能为空")
    private String cDistributorName;
    @NotNull(message="授信额度不能为空!")
    @Min(value=0,message = "授信额度最小为0")
    @ApiModelProperty(value="授信额度,不能为空")
    private BigDecimal cCreditQuota;
    @NotNull(message="结算周期不能为空!")
    @ApiModelProperty(value="结算周期 0:手动 1:日结(按付款日期) 2:周结(按出团日期,出境/邮轮按付款日期) 3:月结(按出团日期,出境/邮轮按付款日期),不能为空")
    @Min(value=0,message = "结算周期最小为0")
    @Max(value=3,message = "结算周期最大为3")
    private Integer cSettlementCycle;
    @NotNull(message="产品类型不能为空!")
    @ApiModelProperty(value="产品类型 10: 周边短线,11: 国内长线,20: 出境旅游,30: 邮轮,40: 特色游,50: 自助游, 不能为空")
    private String cProductType;
    @ApiModelProperty(value="结算日")
    private Integer cSettlementDay;

    public BigDecimal getcCreditBalance() {
        return cCreditBalance;
    }

    public void setcCreditBalance(BigDecimal cCreditBalance) {
        this.cCreditBalance = cCreditBalance;
    }

    public BigDecimal getcCreditUsed() {
        return cCreditUsed;
    }

    public void setcCreditUsed(BigDecimal cCreditUsed) {
        this.cCreditUsed = cCreditUsed;
    }

    public Long getcSupplierId() {
        return cSupplierId;
    }

    public void setcSupplierId(Long cSupplierId) {
        this.cSupplierId = cSupplierId;
    }

    public String getcSupplierName() {
        return cSupplierName;
    }

    public void setcSupplierName(String cSupplierName) {
        this.cSupplierName = cSupplierName;
    }

    public Long getcDistributorId() {
        return cDistributorId;
    }

    public void setcDistributorId(Long cDistributorId) {
        this.cDistributorId = cDistributorId;
    }

    public String getcDistributorName() {
        return cDistributorName;
    }

    public void setcDistributorName(String cDistributorName) {
        this.cDistributorName = cDistributorName;
    }

    public BigDecimal getcCreditQuota() {
        return cCreditQuota;
    }

    public void setcCreditQuota(BigDecimal cCreditQuota) {
        this.cCreditQuota = cCreditQuota;
    }

    public Integer getcSettlementCycle() {
        return cSettlementCycle;
    }

    public void setcSettlementCycle(Integer cSettlementCycle) {
        this.cSettlementCycle = cSettlementCycle;
    }

    public String getcProductType() {
        return cProductType;
    }

    public void setcProductType(String cProductType) {
        this.cProductType = cProductType;
    }

    public Integer getcSettlementDay() {
        return cSettlementDay;
    }

    public void setcSettlementDay(Integer cSettlementDay) {
        this.cSettlementDay = cSettlementDay;
    }
}
