package com.jdy.b2b.api.model.diy;

import java.util.Date;
import java.util.Map;

import com.jdy.b2b.api.model.Order;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/10/11 11:14
 */
public class OrderSynchroDTO extends Order {

    private String salerOpenId;
    private String buyerOpenId;
    private String buyerName;
    private String buyerPhone;
    private String buyerUid;
    private Long pid;
    private String pNo;
    private String pName;
    private String opPayNo;
    private Date payTime;
    private Integer pDays;
    private Date sCalendar;

    private Map secondLevel;
    private Map thirdLevel;
    private Long buyerCompanyId;
    private Integer buyerUstype;
    
    public Long getBuyerCompanyId() {
		return buyerCompanyId;
	}

	public void setBuyerCompanyId(Long buyerCompanyId) {
		this.buyerCompanyId = buyerCompanyId;
	}

	public Integer getBuyerUstype() {
		return buyerUstype;
	}

	public void setBuyerUstype(Integer buyerUstype) {
		this.buyerUstype = buyerUstype;
	}

	public String getSalerOpenId() {
        return salerOpenId;
    }

    public void setSalerOpenId(String salerOpenId) {
        this.salerOpenId = salerOpenId;
    }

    public String getBuyerOpenId() {
        return buyerOpenId;
    }

    public void setBuyerOpenId(String buyerOpenId) {
        this.buyerOpenId = buyerOpenId;
    }

    public String getpNo() {
        return pNo;
    }

    public void setpNo(String pNo) {
        this.pNo = pNo;
    }

    public String getpName() {
        return pName;
    }

    public void setpName(String pName) {
        this.pName = pName;
    }

    public String getOpPayNo() {
        return opPayNo;
    }

    public void setOpPayNo(String opPayNo) {
        this.opPayNo = opPayNo;
    }

    public Date getPayTime() {
        return payTime;
    }

    public void setPayTime(Date payTime) {
        this.payTime = payTime;
    }

    public Integer getpDays() {
        return pDays;
    }

    public void setpDays(Integer pDays) {
        this.pDays = pDays;
    }

    public Date getsCalendar() {
        return sCalendar;
    }

    public void setsCalendar(Date sCalendar) {
        this.sCalendar = sCalendar;
    }

    public String getBuyerName() {
        return buyerName;
    }

    public void setBuyerName(String buyerName) {
        this.buyerName = buyerName;
    }

    public String getBuyerPhone() {
        return buyerPhone;
    }

    public void setBuyerPhone(String buyerPhone) {
        this.buyerPhone = buyerPhone;
    }

    public String getBuyerUid() {
        return buyerUid;
    }

    public void setBuyerUid(String buyerUid) {
        this.buyerUid = buyerUid;
    }

    public Map getSecondLevel() {
        return secondLevel;
    }

    public void setSecondLevel(Map secondLevel) {
        this.secondLevel = secondLevel;
    }

    public Map getThirdLevel() {
        return thirdLevel;
    }

    public void setThirdLevel(Map thirdLevel) {
        this.thirdLevel = thirdLevel;
    }

    public Long getPid() {
        return pid;
    }

    public void setPid(Long pid) {
        this.pid = pid;
    }
}
