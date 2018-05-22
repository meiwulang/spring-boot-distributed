package com.jdy.b2b.api.model.ticket;

import org.springframework.util.ObjectUtils;

import java.io.Serializable;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;

/**
 * @author chris
 * @since Apr 25.18
 */
public class TicketInfoDTO implements Serializable{
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long tCompanyId;
    /**
     * 产品线路ID
     */
    private Long tProductId;
    /**
     * 票类型0:单票 1:套票
     */
    private Integer tTicketType;
    /**
     * 票价类型 0:成人票 1:儿童票
     */
    private Integer tType;
    /**
     * 票价名称
     */
    private String tName;
    /**
     * 限制类型 0:无限制 1:实名票 2:限制性别 3:限制年龄
     */
    private Integer tLimitType;
    /**
     * 限制条件
     */
    private String tLimitCondition;
    /**
     * 票价类目
     */
    private String tCategory;
    /**
     * 交通类别 0:飞机 1:火车 2:汽车 3:邮轮
     */
    private Integer tTraffic;
    /**
     * 门市价
     */
    private BigDecimal tMarketPrice;
    /**
     * 同行价
     */
    private BigDecimal tPeerPrice;
    /**
     * 内部集结价
     */
    private BigDecimal tGatherPrice;
    /**
     * 出厂价
     */
    private BigDecimal factoryPrice;
    /**
     * 补房差
     */
    private BigDecimal tPriceAdd;
    /**
     * 退房差
     */
    private BigDecimal tPriceReduce;
    /**
     * 库存
     */
    private Integer tStock;
    /**
     * 周几有效0000000
     */
    private String tEffectWeek;
    /**
     * 票价简介
     */
    private String tIntroduction;
    /**
     * 源票价ID
     */
    private Long tSourceId;
    /**
     * 集结原始票id
     */
    private Long tFromTicketId;
    /**
     * 默认票价 0:非默认 1:默认票价
     */
    private Integer tDefaultPrice;
    /**
     * 成人数
     */
    private Integer tAdultNum;
    /**
     * 儿童数
     */
    private Integer tChildNum;
    /**
     * 状态 0:有效 1:无效 2:删除
     */
    private Integer tStatus;
    /**
     * 适用开始时间
     */
    private String suitableStartTime;
    /**
     * 适用结束时间
     */
    private String suitableEndTime;
    private String createTime;
    private Long createUser;
    private Date updateTime;
    private Long updateUser;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long gettCompanyId() {
        return tCompanyId;
    }

    public void settCompanyId(Long tCompanyId) {
        this.tCompanyId = tCompanyId;
    }

    public Long gettProductId() {
        return tProductId;
    }

    public void settProductId(Long tProductId) {
        this.tProductId = tProductId;
    }

    public Integer gettTicketType() {
        return tTicketType;
    }

    public void settTicketType(Integer tTicketType) {
        this.tTicketType = tTicketType;
    }

    public Integer gettType() {
        return tType;
    }

    public void settType(Integer tType) {
        this.tType = tType;
    }

    public String gettName() {
        return tName;
    }

    public void settName(String tName) {
        this.tName = tName;
    }

    public Integer gettLimitType() {
        return tLimitType;
    }

    public void settLimitType(Integer tLimitType) {
        this.tLimitType = tLimitType;
    }

    public String gettLimitCondition() {
        return tLimitCondition;
    }

    public void settLimitCondition(String tLimitCondition) {
        this.tLimitCondition = tLimitCondition;
    }

    public String gettCategory() {
        return tCategory;
    }

    public void settCategory(String tCategory) {
        this.tCategory = tCategory;
    }

    public Integer gettTraffic() {
        return tTraffic;
    }

    public void settTraffic(Integer tTraffic) {
        this.tTraffic = tTraffic;
    }

    public BigDecimal gettMarketPrice() {
        return tMarketPrice;
    }

    public void settMarketPrice(BigDecimal tMarketPrice) {
        this.tMarketPrice = tMarketPrice;
    }

    public BigDecimal gettPeerPrice() {
        return tPeerPrice;
    }

    public void settPeerPrice(BigDecimal tPeerPrice) {
        this.tPeerPrice = tPeerPrice;
    }

    public BigDecimal gettGatherPrice() {
        return tGatherPrice;
    }

    public void settGatherPrice(BigDecimal tGatherPrice) {
        this.tGatherPrice = tGatherPrice;
    }

    public BigDecimal getFactoryPrice() {
        return factoryPrice;
    }

    public void setFactoryPrice(BigDecimal factoryPrice) {
        this.factoryPrice = factoryPrice;
    }

    public BigDecimal gettPriceAdd() {
        return tPriceAdd;
    }

    public void settPriceAdd(BigDecimal tPriceAdd) {
        this.tPriceAdd = tPriceAdd;
    }

    public BigDecimal gettPriceReduce() {
        return tPriceReduce;
    }

    public void settPriceReduce(BigDecimal tPriceReduce) {
        this.tPriceReduce = tPriceReduce;
    }

    public Integer gettStock() {
        return tStock;
    }

    public void settStock(Integer tStock) {
        this.tStock = tStock;
    }

    public String gettEffectWeek() {
        return tEffectWeek;
    }

    public void settEffectWeek(String tEffectWeek) {
        this.tEffectWeek = tEffectWeek;
    }

    public String gettIntroduction() {
        return tIntroduction;
    }

    public void settIntroduction(String tIntroduction) {
        this.tIntroduction = tIntroduction;
    }

    public Long gettSourceId() {
        return tSourceId;
    }

    public void settSourceId(Long tSourceId) {
        this.tSourceId = tSourceId;
    }

    public Long gettFromTicketId() {
        return tFromTicketId;
    }

    public void settFromTicketId(Long tFromTicketId) {
        this.tFromTicketId = tFromTicketId;
    }

    public Integer gettDefaultPrice() {
        return tDefaultPrice;
    }

    public void settDefaultPrice(Integer tDefaultPrice) {
        this.tDefaultPrice = tDefaultPrice;
    }

    public Integer gettAdultNum() {
        return tAdultNum;
    }

    public void settAdultNum(Integer tAdultNum) {
        this.tAdultNum = tAdultNum;
    }

    public Integer gettChildNum() {
        return tChildNum;
    }

    public void settChildNum(Integer tChildNum) {
        this.tChildNum = tChildNum;
    }

    public Integer gettStatus() {
        return tStatus;
    }

    public void settStatus(Integer tStatus) {
        this.tStatus = tStatus;
    }

    public String getSuitableStartTime() {
        return suitableStartTime;
    }

    public void setSuitableStartTime(String suitableStartTime) {
        this.suitableStartTime = suitableStartTime;
    }

    public String getSuitableEndTime() {
        return suitableEndTime;
    }

    public void setSuitableEndTime(String suitableEndTime) {
        this.suitableEndTime = suitableEndTime;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
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

    public TicketInfoDTO(Ticket ticket) {
        this.id = ticket.getId();
        this.tCompanyId = ticket.gettCompanyId();
        this.tProductId = ticket.gettProductId();
        this.tTicketType = ticket.gettTicketType();
        this.tType = ticket.gettType();
        this.tName = ticket.gettName();
        this.tLimitType = ticket.gettLimitType();
        this.tLimitCondition = ticket.gettLimitCondition();
        this.tCategory = ticket.gettCategory();
        this.tTraffic = ticket.gettTraffic();
        this.tMarketPrice = ticket.gettMarketPrice();
        this.tPeerPrice = ticket.gettPeerPrice();
        this.tGatherPrice = ticket.gettGatherPrice();
        this.factoryPrice = ticket.getFactoryPrice();
        this.tPriceAdd = ticket.gettPriceAdd();
        this.tPriceReduce = ticket.gettPriceReduce();
        this.tStock = ticket.gettStock();
        this.tEffectWeek = ticket.gettEffectWeek();
        this.tIntroduction = ticket.gettIntroduction();
        this.tSourceId = ticket.gettSourceId();
        this.tFromTicketId = ticket.gettFromTicketId();
        this.tDefaultPrice = null != ticket.gettDefaultPrice() ? (ticket.gettDefaultPrice() ? 1 : 0) : null;
        this.tAdultNum = ticket.gettAdultNum();
        this.tChildNum = ticket.gettChildNum();
        this.tStatus = ticket.gettStatus();
        this.suitableStartTime = this.convertLocalDate2Str(ticket.getSuitableStartTime());
        this.suitableEndTime = this.convertLocalDate2Str(ticket.getSuitableEndTime());
        this.createTime = this.convertDate2Str(ticket.getCreateTime());
        this.createUser = ticket.getCreateUser();
        this.updateTime = ticket.getUpdateTime();
        this.updateUser = ticket.getUpdateUser();
    }

    private String convertDate2Str(Date date) {
        if (ObjectUtils.isEmpty(date)) {
            return "";
        }
        return new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS").format(date);
    }

    private String convertLocalDate2Str(LocalDate localDate) {
        if (ObjectUtils.isEmpty(localDate)) {
            return "";
        }
        DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return localDate.format(df);
    }

}
