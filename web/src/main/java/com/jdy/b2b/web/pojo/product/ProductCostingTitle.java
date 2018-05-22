package com.jdy.b2b.web.pojo.product;

import com.jdy.b2b.web.util.BaseVO;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

public class ProductCostingTitle extends BaseVO{

    private Long id;

    private Long relId;

    private Byte type;

    private Integer peopleNum;

    private String peopleNumExplain;

    private Byte isExempt;

    private String isExemptExplain;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date beginTime;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date endTime;

    private Short percentage;

    private Byte productType;

    private Long companyId;

    private Integer status;

    private String remark;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
}