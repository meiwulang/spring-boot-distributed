package com.jdy.b2b.web.pojo.credit;


import com.jdy.b2b.web.annotation.EnumValue;
import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * Created by yangcheng on 2017/8/30.
 */
@ApiModel
public class CreditUpdateVo extends BaseVO {
    @ApiModelProperty("授信id,不能为空")
    @NotNull(message = "id不能为空")
    private Long id;
    @NotNull(message = "产品类型不能为空")
    @EnumValue(message = "产品类型可选值",enums = {"10","11","20","30","40","50"})
    @ApiModelProperty(value="产品类型,不能为空")
    private String cProductType;
    @NotNull(message = "授信额度不能为空")
    @Min(value=0,message = "授信额度最小为0")
    @ApiModelProperty(value="授信额度,不能为空")
    private BigDecimal cCreditQuota;
    @NotNull(message = "结算周期不能为空")
    @Min(value=0,message = "结算周期最小为0")
    @Max(value=3,message = "结算周期最大为3")
    @ApiModelProperty(value="结算周期,不能为空")
    private Integer cSettlementCycle;
    //可以使用aop校验
    @ApiModelProperty(value="结算日")
    private Integer cSettlementDay;
    @NotNull(message = "已用额度不能为空")
    @Min(value=0,message = "已用额度最小为0")
    @ApiModelProperty(value="已用额度,如果修改了授信额度,此字段用来更新剩余额度,不能为空")
    private BigDecimal cCreditUsed;

    public Integer getcSettlementDay() {
        return cSettlementDay;
    }

    public void setcSettlementDay(Integer cSettlementDay) {
        this.cSettlementDay = cSettlementDay;
    }

    public BigDecimal getcCreditUsed() {
        return cCreditUsed;
    }

    public void setcCreditUsed(BigDecimal cCreditUsed) {
        this.cCreditUsed = cCreditUsed;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
}
