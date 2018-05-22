package com.jdy.b2b.api.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 产品成本DTO
 * @author chris
 * @since Apr 26.18
 */
public class ProductCostDTO implements Serializable{

    private static final long serialVersionUID = 1L;

    /**
     * 产品ID
     */
    private Long prodId;
    /**
     * 公司ID
     */
    private Long companyId;
    /**
     * 类型(1:产品; 2:班期)
     */
    private Integer type;
    /**
     * 核算人数
     */
    private Integer peopleNum;
    /**
     * 核算人数说明
     */
    private String peopleNumExplain;
    /**
     * 领队/全陪是否免(0:否;1:是)
     */
    private Integer isExempt;
    /**
     * 领队/全陪是否免说明
     */
    private String isExemptExplain;
    /**
     * 价格适用期开始时间
     */
    private String beginTime;
    /**
     * 价格适用期结束时间
     */
    private String endTime;
    /**
     * 保底成本增加比例
     */
    private Integer percentage;
    /**
     * 产品类型(1:非集结产品;2:集结产品)
     */
    private Integer productType;
    /**
     * 状态(0:正常)
     */
    private Integer status;
    /**
     * 创建人
     */
    private Long createUser;
    /**
     * 修改人
     */
    private Long updateUser;
    /**
     * 创建时间
     */
    private String createTime;
    /**
     * 创建时间
     */
    private String updateTime;
    /**
     * 成本
     */
    private BigDecimal costAmt;
    /**
     * 各人成本
     */
    private BigDecimal costPersonAmt;

    public Long getProdId() {
        return prodId;
    }

    public void setProdId(Long prodId) {
        this.prodId = prodId;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getPeopleNum() {
        return peopleNum;
    }

    public void setPeopleNum(Integer peopleNum) {
        this.peopleNum = peopleNum;
    }

    public String getPeopleNumExplain() {
        return peopleNumExplain;
    }

    public void setPeopleNumExplain(String peopleNumExplain) {
        this.peopleNumExplain = peopleNumExplain;
    }

    public Integer getIsExempt() {
        return isExempt;
    }

    public void setIsExempt(Integer isExempt) {
        this.isExempt = isExempt;
    }

    public String getIsExemptExplain() {
        return isExemptExplain;
    }

    public void setIsExemptExplain(String isExemptExplain) {
        this.isExemptExplain = isExemptExplain;
    }

    public String getBeginTime() {
        return beginTime;
    }

    public void setBeginTime(String beginTime) {
        this.beginTime = beginTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public Integer getPercentage() {
        return percentage;
    }

    public void setPercentage(Integer percentage) {
        this.percentage = percentage;
    }

    public Integer getProductType() {
        return productType;
    }

    public void setProductType(Integer productType) {
        this.productType = productType;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Long getCreateUser() {
        return createUser;
    }

    public void setCreateUser(Long createUser) {
        this.createUser = createUser;
    }

    public Long getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(Long updateUser) {
        this.updateUser = updateUser;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(String updateTime) {
        this.updateTime = updateTime;
    }

    public BigDecimal getCostAmt() {
        return costAmt;
    }

    public void setCostAmt(BigDecimal costAmt) {
        this.costAmt = costAmt;
    }

    public BigDecimal getCostPersonAmt() {
        return costPersonAmt;
    }

    public void setCostPersonAmt(BigDecimal costPersonAmt) {
        this.costPersonAmt = costPersonAmt;
    }

}
