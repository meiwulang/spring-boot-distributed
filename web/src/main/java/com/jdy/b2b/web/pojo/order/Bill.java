package com.jdy.b2b.web.pojo.order;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.math.BigDecimal;
import java.util.Date;

@ApiModel(description = "通用账单信息")
public class Bill extends BaseVO {
    private Long id;

    @ApiModelProperty(value = "账单编号")
    private String bBillNo;

    @ApiModelProperty(value = "供应商公司id")
    private Long bSalerCompanyId;

    @ApiModelProperty(value = "供应商公司名称")
    private String bSalerCompanyName;

    @ApiModelProperty(value = "供应商计调人id")
    private Long bSalerId;

    @ApiModelProperty(value = "供应商计调人名称")
    private String bSalerName;

    @ApiModelProperty(value = "分销商公司id")
    private Long bBuyerCompanyId;

    @ApiModelProperty(value = "分销商公司名称")
    private String bBuyerCompanyName;

    @ApiModelProperty(value = "分销商购买人id")
    private Long bBuyerId;

    @ApiModelProperty(value = "分销商购买人名称")
    private String bBuyerName;

    @ApiModelProperty(value = "账单金额")
    private BigDecimal bAmount;

    @ApiModelProperty(value = "已付金额")
    private BigDecimal bPayedAmount;

    @ApiModelProperty(value = "手续费")
    private BigDecimal bBrokerage;

    @ApiModelProperty(value = "信用账单一次性销帐时可减免一定的费用")
    private BigDecimal bDeduction;

    @ApiModelProperty(value = "提现时间")
    private Date bCashTime;

    @ApiModelProperty(value = "还款时间")
    private Date bRepaymentTime;

    @ApiModelProperty(value = "账单类型 0:线上账单 1:信用账单")
    private Integer bType;

    @ApiModelProperty(value = "信用账单状态 0:未还款 1:未还完 2:已还完 3:已撤销\n" +
            "在线账单状态 0:生成 1:处理中 2:已受理 3:已提现 4:失败")
    private Integer bStatus;

    @ApiModelProperty(value = "备注")
    private String bRemark;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    @ApiModelProperty(value = "父账单id")
    private Long bBillPid;

    @ApiModelProperty(value = "0:自动账单 1:手动账单")
    private Byte bBillType;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getbBillNo() {
        return bBillNo;
    }

    public void setbBillNo(String bBillNo) {
        this.bBillNo = bBillNo;
    }

    public Long getbSalerId() {
        return bSalerId;
    }

    public void setbSalerId(Long bSalerId) {
        this.bSalerId = bSalerId;
    }

    public String getbSalerName() {
        return bSalerName;
    }

    public void setbSalerName(String bSalerName) {
        this.bSalerName = bSalerName;
    }

    public Long getbBuyerId() {
        return bBuyerId;
    }

    public void setbBuyerId(Long bBuyerId) {
        this.bBuyerId = bBuyerId;
    }

    public String getbBuyerName() {
        return bBuyerName;
    }

    public void setbBuyerName(String bBuyerName) {
        this.bBuyerName = bBuyerName;
    }

    public BigDecimal getbAmount() {
        return bAmount;
    }

    public void setbAmount(BigDecimal bAmount) {
        this.bAmount = bAmount;
    }

    public BigDecimal getbPayedAmount() {
        return bPayedAmount;
    }

    public void setbPayedAmount(BigDecimal bPayedAmount) {
        this.bPayedAmount = bPayedAmount;
    }

    public BigDecimal getbBrokerage() {
        return bBrokerage;
    }

    public void setbBrokerage(BigDecimal bBrokerage) {
        this.bBrokerage = bBrokerage;
    }

    public BigDecimal getbDeduction() {
        return bDeduction;
    }

    public void setbDeduction(BigDecimal bDeduction) {
        this.bDeduction = bDeduction;
    }

    public Date getbCashTime() {
        return bCashTime;
    }

    public void setbCashTime(Date bCashTime) {
        this.bCashTime = bCashTime;
    }

    public Date getbRepaymentTime() {
        return bRepaymentTime;
    }

    public void setbRepaymentTime(Date bRepaymentTime) {
        this.bRepaymentTime = bRepaymentTime;
    }

    public Integer getbType() {
        return bType;
    }

    public void setbType(Integer bType) {
        this.bType = bType;
    }

    public Integer getbStatus() {
        return bStatus;
    }

    public void setbStatus(Integer bStatus) {
        this.bStatus = bStatus;
    }

    public String getbRemark() {
        return bRemark;
    }

    public void setbRemark(String bRemark) {
        this.bRemark = bRemark;
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

    public Long getbBillPid() {
        return bBillPid;
    }

    public void setbBillPid(Long bBillPid) {
        this.bBillPid = bBillPid;
    }

    public Byte getbBillType() {
        return bBillType;
    }

    public void setbBillType(Byte bBillType) {
        this.bBillType = bBillType;
    }

    public Long getbSalerCompanyId() {
        return bSalerCompanyId;
    }

    public void setbSalerCompanyId(Long bSalerCompanyId) {
        this.bSalerCompanyId = bSalerCompanyId;
    }

    public String getbSalerCompanyName() {
        return bSalerCompanyName;
    }

    public void setbSalerCompanyName(String bSalerCompanyName) {
        this.bSalerCompanyName = bSalerCompanyName;
    }

    public Long getbBuyerCompanyId() {
        return bBuyerCompanyId;
    }

    public void setbBuyerCompanyId(Long bBuyerCompanyId) {
        this.bBuyerCompanyId = bBuyerCompanyId;
    }

    public String getbBuyerCompanyName() {
        return bBuyerCompanyName;
    }

    public void setbBuyerCompanyName(String bBuyerCompanyName) {
        this.bBuyerCompanyName = bBuyerCompanyName;
    }
}