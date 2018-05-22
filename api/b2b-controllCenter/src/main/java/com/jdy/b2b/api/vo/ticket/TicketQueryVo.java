package com.jdy.b2b.api.vo.ticket;

import com.jdy.b2b.api.common.BaseVO;
import com.jdy.b2b.api.model.station.Departure;
import com.jdy.b2b.api.model.ticket.TicketSingle;
import com.jdy.b2b.api.model.ticketarea.TicketArea;
import com.jdy.b2b.api.model.ticketdeparture.TicketDeparture;
import com.jdy.b2b.api.model.ticketset.TicketSet;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by yangcheng on 2017/7/3.
 */
public class TicketQueryVo extends BaseVO{
    private Long id;

    private Integer flag;

    private Long tCompanyId;

    private Long tProductId;

    private Integer tTicketType;

    private Integer tType;

    private String tName;

    private Integer tLimitType;

    private String tLimitCondition;

    private String tCategory;

    private Integer tTraffic;

    private BigDecimal tMarketPrice;

    private BigDecimal tPeerPrice;

    private BigDecimal tPriceAdd;

    private BigDecimal tPriceReduce;

    private Integer tStock;

    private String tEffectWeek;

    private String tIntroduction;

    private Long tSourceId;

    private Boolean tDefaultPrice;

    private Integer tStatus;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    private String ticketCity;

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }

    public Boolean gettDefaultPrice() {
        return tDefaultPrice;
    }

    public void settDefaultPrice(Boolean tDefaultPrice) {
        this.tDefaultPrice = tDefaultPrice;
    }

    public String getTicketCity() {
        return ticketCity;
    }

    public void setTicketCity(String ticketCity) {
        this.ticketCity = ticketCity;
    }

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
        this.tName = tName == null ? null : tName.trim();
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
        this.tLimitCondition = tLimitCondition == null ? null : tLimitCondition.trim();
    }

    public String gettCategory() {
        return tCategory;
    }

    public void settCategory(String tCategory) {
        this.tCategory = tCategory == null ? null : tCategory.trim();
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
        this.tEffectWeek = tEffectWeek == null ? null : tEffectWeek.trim();
    }

    public String gettIntroduction() {
        return tIntroduction;
    }

    public void settIntroduction(String tIntroduction) {
        this.tIntroduction = tIntroduction == null ? null : tIntroduction.trim();
    }

    public Long gettSourceId() {
        return tSourceId;
    }

    public void settSourceId(Long tSourceId) {
        this.tSourceId = tSourceId;
    }

    public Integer gettStatus() {
        return tStatus;
    }

    public void settStatus(Integer tStatus) {
        this.tStatus = tStatus;
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
}
