package com.jdy.b2b.api.model.fingercrm;

import java.math.BigDecimal;

/**
 * Created by strict on 2017/10/10.
 */
public class ProductSyncInfoDTO {
    private Long product_id;
    private String productNo;//产品编号
    private Long companyId;//票所属公司
    private Long productCompanyId;
    private String companyName;//所属公司的名字
    private String name;//产品名称
    private String buy_url;//购买地址
    private String image;         //产品图片
    private BigDecimal unit_pirce;//票单价  销售价
    private BigDecimal gatherPrice;//集结价格
    private Integer stock;//库存
    private String group;//产品分组名称
    private String product_code;

    private Long categoryId;
    private String category;//价格类目
    private Long unitPriceId;
    private String priceName;
    private Integer ticketType;//票价类型
    private Integer trafficType;//交通方式
    private String trafficName;
    private String lastUpdateTime;
    private String product_type_name;
    private String product_type_value;
    private String startPlace;//产品的出发地
    private Long startPlaceId;
    private String endPlace;//产品的目的地
    private Long endPlaceId;

    private String contractName;

    private Integer isGather;//是否是集结出来的票
    private Long fromTicketId;

    private Integer sort;
    private BigDecimal factoryPrice;

    private String pContactsEn;
    private String pCreativeOfficerCn;
    private String pCreativeOfficerEn;
    private String pTopicCn;
    private String pTopicEn;

    public String getpContactsEn() {
        return pContactsEn;
    }

    public void setpContactsEn(String pContactsEn) {
        this.pContactsEn = pContactsEn;
    }

    public String getpCreativeOfficerCn() {
        return pCreativeOfficerCn;
    }

    public void setpCreativeOfficerCn(String pCreativeOfficerCn) {
        this.pCreativeOfficerCn = pCreativeOfficerCn;
    }

    public String getpCreativeOfficerEn() {
        return pCreativeOfficerEn;
    }

    public void setpCreativeOfficerEn(String pCreativeOfficerEn) {
        this.pCreativeOfficerEn = pCreativeOfficerEn;
    }

    public String getpTopicCn() {
        return pTopicCn;
    }

    public void setpTopicCn(String pTopicCn) {
        this.pTopicCn = pTopicCn;
    }

    public String getpTopicEn() {
        return pTopicEn;
    }

    public void setpTopicEn(String pTopicEn) {
        this.pTopicEn = pTopicEn;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public BigDecimal getFactoryPrice() {
        return factoryPrice;
    }

    public void setFactoryPrice(BigDecimal factoryPrice) {
        this.factoryPrice = factoryPrice;
    }

    public Long getProductCompanyId() {
        return productCompanyId;
    }

    public void setProductCompanyId(Long productCompanyId) {
        this.productCompanyId = productCompanyId;
    }

    public Long getStartPlaceId() {
        return startPlaceId;
    }

    public void setStartPlaceId(Long startPlaceId) {
        this.startPlaceId = startPlaceId;
    }

    public Long getEndPlaceId() {
        return endPlaceId;
    }

    public void setEndPlaceId(Long endPlaceId) {
        this.endPlaceId = endPlaceId;
    }

    public Long getFromTicketId() {
        return fromTicketId;
    }

    public void setFromTicketId(Long fromTicketId) {
        this.fromTicketId = fromTicketId;
    }

    public Integer getIsGather() {
        return isGather;
    }

    public void setIsGather(Integer isGather) {
        this.isGather = isGather;
    }

    public BigDecimal getGatherPrice() {
        return gatherPrice;
    }

    public void setGatherPrice(BigDecimal gatherPrice) {
        this.gatherPrice = gatherPrice;
    }

    public String getProductNo() {
        return productNo;
    }

    public void setProductNo(String productNo) {
        this.productNo = productNo;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Integer getTicketType() {
        return ticketType;
    }

    public void setTicketType(Integer ticketType) {
        this.ticketType = ticketType;
    }

    public Integer getTrafficType() {
        return trafficType;
    }

    public void setTrafficType(Integer trafficType) {
        this.trafficType = trafficType;
    }

    public String getTrafficName() {
        if (null!=trafficType){
            switch (trafficType){
                case 0:
                    return "飞机";
                case 1:
                    return "火车";
                case 2:
                    return "汽车";
                case 3:
                    return "游轮";
                default:
                    return "交通方式未填写";
            }
        }else{
            return "交通方式未填写";
        }
    }

    public void setTrafficName(String trafficName) {
        this.trafficName = trafficName;
    }

    public String getStartPlace() {
        return startPlace;
    }

    public void setStartPlace(String startPlace) {
        this.startPlace = startPlace;
    }

    public String getEndPlace() {
        return endPlace;
    }

    public void setEndPlace(String endPlace) {
        this.endPlace = endPlace;
    }

    public String getContractName() {
        return contractName;
    }

    public void setContractName(String contractName) {
        this.contractName = contractName;
    }

    public String getProduct_type_name() {
        return product_type_name;
    }

    public void setProduct_type_name(String product_type_name) {
        this.product_type_name = product_type_name;
    }

    public String getProduct_type_value() {
        return product_type_value;
    }

    public void setProduct_type_value(String product_type_value) {
        this.product_type_value = product_type_value;
    }

    public String getLastUpdateTime() {
        return lastUpdateTime;
    }

    public void setLastUpdateTime(String lastUpdateTime) {
        this.lastUpdateTime = lastUpdateTime;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Long getUnitPriceId() {
        return unitPriceId;
    }

    public void setUnitPriceId(Long unitPriceId) {
        this.unitPriceId = unitPriceId;
    }

    public String getPriceName() {
        return priceName;
    }

    public void setPriceName(String priceName) {
        this.priceName = priceName;
    }

    public Long getProduct_id() {
        return product_id;
    }

    public void setProduct_id(Long product_id) {
        this.product_id = product_id;
    }

    public String getBuy_url() {
        return buy_url;
    }

    public void setBuy_url(String buy_url) {
        this.buy_url = buy_url;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public BigDecimal getUnit_pirce() {
        return unit_pirce;
    }

    public void setUnit_pirce(BigDecimal unit_pirce) {
        this.unit_pirce = unit_pirce;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getGroup() {
        return group;
    }

    public void setGroup(String group) {
        this.group = group;
    }

    public String getProduct_code() {
        return product_code;
    }

    public void setProduct_code(String product_code) {
        this.product_code = product_code;
    }
}
