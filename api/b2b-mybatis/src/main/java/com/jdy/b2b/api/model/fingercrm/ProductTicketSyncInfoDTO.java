package com.jdy.b2b.api.model.fingercrm;

import com.jdy.b2b.api.model.product.ProductKeySynDTO;

import java.util.List;

/**
 * Created by strict on 2017/10/10.
 */
public class ProductTicketSyncInfoDTO {
    private Long product_id;
    private Long companyId;//产品的所在公司
    private String productNo;
    private String name;//产品名称
    private String buy_url;//购买地址
    private String image;         //产品图片
    private String group;//产品分组名称
    private Long categoryId;
    private String category;
    private Integer sort;



    private List<TicketInfo> priceList;
    private List<ProductKeySynDTO> productKeys;

    private String product_code;
    private String product_type_name;
    private String product_type_value;

    private String contractName;

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

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public List<ProductKeySynDTO> getProductKeys() {
        return productKeys;
    }

    public void setProductKeys(List<ProductKeySynDTO> productKeys) {
        this.productKeys = productKeys;
    }

    public String getProductNo() {
        return productNo;
    }

    public void setProductNo(String productNo) {
        this.productNo = productNo;
    }

    public String getContractName() {
        return contractName;
    }

    public void setContractName(String contractName) {
        this.contractName = contractName;
    }

    public List<TicketInfo> getPriceList() {
        return priceList;
    }

    public void setPriceList(List<TicketInfo> priceList) {
        this.priceList = priceList;
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
