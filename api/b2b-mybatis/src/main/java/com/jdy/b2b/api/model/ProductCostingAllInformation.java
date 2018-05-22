package com.jdy.b2b.api.model;

import java.util.Date;
import java.util.List;

/**
 * Created by zhangfofa on 2018/2/6.
 */
public class ProductCostingAllInformation {
    private Long id;

    private String productName;

    private Integer peopleNum;

    private String peopleNumExplain;

    private Byte isExempt;

    private String isExemptExplain;

    private Date beginTime;

    private Date endTime;

    private Short percentage;

    private List<ProductCostingCategoryInformation> productCostingCategoryInformationList;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
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
        this.isExemptExplain = isExemptExplain;
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

    public List<ProductCostingCategoryInformation> getProductCostingCategoryInformationList() {
        return productCostingCategoryInformationList;
    }

    public void setProductCostingCategoryInformationList(List<ProductCostingCategoryInformation> productCostingCategoryInformationList) {
        this.productCostingCategoryInformationList = productCostingCategoryInformationList;
    }
}
