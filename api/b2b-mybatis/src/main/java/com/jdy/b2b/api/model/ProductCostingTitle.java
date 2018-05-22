package com.jdy.b2b.api.model;

import com.jdy.b2b.api.common.BaseVO;

import java.util.Date;

public class ProductCostingTitle extends BaseVO{
    private Long id;

    private Long relId;

    private Byte type;

    private Integer peopleNum;

    private String peopleNumExplain;

    private Byte isExempt;

    private String isExemptExplain;

    private Date beginTime;

    private Date endTime;

    private Short percentage;

    private Byte productType;

    private Long companyId;

    private Long createUser;

    private Date createTime;

    private Long updateUser;

    private Date updateTime;

    private Integer status;//审核状态 0待审核 1通过 2不通过

    private String remark;//审核不通过的原因

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRelId() {
        return relId;
    }

    public void setRelId(Long relId) {
        this.relId = relId;
    }

    public Byte getType() {
        return type;
    }

    public void setType(Byte type) {
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
        this.peopleNumExplain = peopleNumExplain == null ? null : peopleNumExplain.trim();
    }

    public Byte getIsExempt() {
        return isExempt;
    }

    public void setIsExempt(Byte isExempt) {
        this.isExempt = isExempt;
    }

    public String getIsExemptExplain() {
        return isExemptExplain;
    }

    public void setIsExemptExplain(String isExemptExplain) {
        this.isExemptExplain = isExemptExplain == null ? null : isExemptExplain.trim();
    }

    public Date getBeginTime() {
        return beginTime;
    }

    public void setBeginTime(Date beginTime) {
        this.beginTime = beginTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public Short getPercentage() {
        return percentage;
    }

    public void setPercentage(Short percentage) {
        this.percentage = percentage;
    }

    public Byte getProductType() {
        return productType;
    }

    public void setProductType(Byte productType) {
        this.productType = productType;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Long getCreateUser() {
        return createUser;
    }

    public void setCreateUser(Long createUser) {
        this.createUser = createUser;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Long getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(Long updateUser) {
        this.updateUser = updateUser;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }
}