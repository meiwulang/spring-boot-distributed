package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.model.OrderTourist;

import java.math.BigDecimal;
import java.util.Date;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/5 11:32
 */
public class OrderTouristDTO extends OrderTourist {

    //去程信息
    private String lvDepartureName;
    private String lvStopName;
    private Date lvSbTime;
    private Integer lvSbTimeLength;

    //票价
    private BigDecimal tPeerPrice;
    private String category;
    private String categoryName;
    private String tName;

    //回程信息
    private String rtDepartureName;
    private String rtStopName;
    private Date rtSbTime;
    private Integer rtSbTimeLength;

    private Integer otStatus;

    public Integer getOtStatus() {
        return otStatus;
    }

    public void setOtStatus(Integer otStatus) {
        this.otStatus = otStatus;
    }

    public Date getLvSbTime() {
        return lvSbTime;
    }

    public void setLvSbTime(Date lvSbTime) {
        this.lvSbTime = lvSbTime;
    }

    public Date getRtSbTime() {
        return rtSbTime;
    }

    public void setRtSbTime(Date rtSbTime) {
        this.rtSbTime = rtSbTime;
    }

    public String getLvDepartureName() {
        return lvDepartureName;
    }

    public void setLvDepartureName(String lvDepartureName) {
        this.lvDepartureName = lvDepartureName;
    }

    public String getLvStopName() {
        return lvStopName;
    }

    public void setLvStopName(String lvStopName) {
        this.lvStopName = lvStopName;
    }

    public String getRtDepartureName() {
        return rtDepartureName;
    }

    public void setRtDepartureName(String rtDepartureName) {
        this.rtDepartureName = rtDepartureName;
    }

    public String getRtStopName() {
        return rtStopName;
    }

    public void setRtStopName(String rtStopName) {
        this.rtStopName = rtStopName;
    }

    public Integer getLvSbTimeLength() {
        return lvSbTimeLength;
    }

    public void setLvSbTimeLength(Integer lvSbTimeLength) {
        this.lvSbTimeLength = lvSbTimeLength;
    }

    public Integer getRtSbTimeLength() {
        return rtSbTimeLength;
    }

    public void setRtSbTimeLength(Integer rtSbTimeLength) {
        this.rtSbTimeLength = rtSbTimeLength;
    }

    public BigDecimal gettPeerPrice() {
        return tPeerPrice;
    }

    public void settPeerPrice(BigDecimal tPeerPrice) {
        this.tPeerPrice = tPeerPrice;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String gettName() {
        return tName;
    }

    public void settName(String tName) {
        this.tName = tName;
    }
}
