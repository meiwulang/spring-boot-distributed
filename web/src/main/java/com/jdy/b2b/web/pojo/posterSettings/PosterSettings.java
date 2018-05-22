package com.jdy.b2b.web.pojo.posterSettings;

import java.math.BigDecimal;

/**
 * Created by dengbo on 2018/1/4.
 *  喜报配置实体类
 */
public class PosterSettings {

    private Long id;
    private String posterUrl;//海报地址（oss地址，全路径）
    private String groupNo;//组no
    private Long companyId;//公司id
    private BigDecimal groupMonthLimit;//销售组每月销售额起始值
    private Integer groupNum;//销售组每月计数器 1起始值
    private BigDecimal companyDayLimit;//公司每日销售额起始值
    private Integer companyDayNum;//公司每日计数器 1起始值
    private BigDecimal companyMonthLimit;//公司每月销售额起始值
    private Integer companyMonthNum;//公司每月计数器 1起始值

    //查询字段
    private String startDate;
    private String endDate;
    private Long saleId;//

    //查询返回字段
    private BigDecimal amount;//金额
    private String companyName;//公司名称
    private String groupName;//销售组名称
    private String userName;//销售姓名
    private String productName;//产品名称
    private String openIds;//员工openId字符串，以","号分隔
    private String date;//出单日期/月份
    private String type;//10 个人 20 销售组  30 公司
    private String pUserName;//代理人姓名
    private String pSaleManager;//所属销售经理

    public String getpSaleManager() {
        return pSaleManager;
    }

    public void setpSaleManager(String pSaleManager) {
        this.pSaleManager = pSaleManager;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }

    public String getGroupNo() {
        return groupNo;
    }

    public void setGroupNo(String groupNo) {
        this.groupNo = groupNo;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public BigDecimal getGroupMonthLimit() {
        return groupMonthLimit;
    }

    public void setGroupMonthLimit(BigDecimal groupMonthLimit) {
        this.groupMonthLimit = groupMonthLimit;
    }

    public Integer getGroupNum() {
        return groupNum;
    }

    public void setGroupNum(Integer groupNum) {
        this.groupNum = groupNum;
    }

    public BigDecimal getCompanyDayLimit() {
        return companyDayLimit;
    }

    public void setCompanyDayLimit(BigDecimal companyDayLimit) {
        this.companyDayLimit = companyDayLimit;
    }

    public Integer getCompanyDayNum() {
        return companyDayNum;
    }

    public void setCompanyDayNum(Integer companyDayNum) {
        this.companyDayNum = companyDayNum;
    }

    public BigDecimal getCompanyMonthLimit() {
        return companyMonthLimit;
    }

    public void setCompanyMonthLimit(BigDecimal companyMonthLimit) {
        this.companyMonthLimit = companyMonthLimit;
    }

    public Integer getCompanyMonthNum() {
        return companyMonthNum;
    }

    public void setCompanyMonthNum(Integer companyMonthNum) {
        this.companyMonthNum = companyMonthNum;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getOpenIds() {
        return openIds;
    }

    public void setOpenIds(String openIds) {
        this.openIds = openIds;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getSaleId() {
        return saleId;
    }

    public void setSaleId(Long saleId) {
        this.saleId = saleId;
    }

    public String getpUserName() {
        return pUserName;
    }

    public void setpUserName(String pUserName) {
        this.pUserName = pUserName;
    }
}
