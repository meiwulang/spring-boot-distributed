package com.jdy.b2b.api.model;

import com.jdy.b2b.api.common.BaseVO;

import java.math.BigDecimal;
import java.util.Date;

public class ScheduleTicket extends BaseVO{
    private Long id;

    private Long stProductId;

    private Long stScheduleId;

    private Long stTicketId;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    private Long srcCompanyId;
    private Long dstCompanyId;
    private BigDecimal tMarketPrice;
    private Integer tStock;
    
    public BigDecimal gettMarketPrice() {
		return tMarketPrice;
	}

	public void settMarketPrice(BigDecimal tMarketPrice) {
		this.tMarketPrice = tMarketPrice;
	}

	public Integer gettStock() {
		return tStock;
	}

	public void settStock(Integer tStock) {
		this.tStock = tStock;
	}

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStProductId() {
        return stProductId;
    }

    public void setStProductId(Long stProductId) {
        this.stProductId = stProductId;
    }

    public Long getStScheduleId() {
        return stScheduleId;
    }

    public void setStScheduleId(Long stScheduleId) {
        this.stScheduleId = stScheduleId;
    }

    public Long getStTicketId() {
        return stTicketId;
    }

    public void setStTicketId(Long stTicketId) {
        this.stTicketId = stTicketId;
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

    public Long getSrcCompanyId() {
        return srcCompanyId;
    }

    public void setSrcCompanyId(Long srcCompanyId) {
        this.srcCompanyId = srcCompanyId;
    }

    public Long getDstCompanyId() {
        return dstCompanyId;
    }

    public void setDstCompanyId(Long dstCompanyId) {
        this.dstCompanyId = dstCompanyId;
    }
}