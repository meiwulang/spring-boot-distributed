package com.jdy.b2b.api.model.product;

import com.jdy.b2b.api.model.scenicspot.ScenicSpot;
import com.jdy.b2b.api.model.ticketarea.TicketArea;

import java.util.*;

/**
 * Created by yangcheng on 2017/8/14.
 */
public class ProductRecommendDTO {
    private Long id;
    private String pNo;
    private String pName;
    private Integer pDays;
    private String cName;
    private Byte pRecommend;
    private String uRealName;
    private List<TicketArea> areaList = new ArrayList<TicketArea>();
    private List<ScenicSpot> spots = new ArrayList<ScenicSpot>();
    private Set<String> appliStrList = new TreeSet<String>();
    private Set<String> destStrList = new TreeSet<String>();

    //适用城市
    private String appliCitys;
    //目的地
    private String destCitys;

    public Set<String> getAppliStrList() {
        return appliStrList;
    }

    public void setAppliStrList(Set<String> appliStrList) {
        this.appliStrList = appliStrList;
    }

    public Set<String> getDestStrList() {
        return destStrList;
    }

    public void setDestStrList(Set<String> destStrList) {
        this.destStrList = destStrList;
    }

    public List<ScenicSpot> getSpots() {
        return spots;
    }

    public void setSpots(List<ScenicSpot> spots) {
        this.spots = spots;
    }

    public List<TicketArea> getAreaList() {
        return areaList;
    }

    public void setAreaList(List<TicketArea> areaList) {
        this.areaList = areaList;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Integer getpDays() {
        return pDays;
    }

    public void setpDays(Integer pDays) {
        this.pDays = pDays;
    }

    public String getcName() {
        return cName;
    }

    public void setcName(String cName) {
        this.cName = cName;
    }

    public Byte getpRecommend() {
        return pRecommend;
    }

    public void setpRecommend(Byte pRecommend) {
        this.pRecommend = pRecommend;
    }

    public String getuRealName() {
        return uRealName;
    }

    public void setuRealName(String uRealName) {
        this.uRealName = uRealName;
    }

    public String getAppliCitys() {
        return appliCitys;
    }

    public void setAppliCitys(String appliCitys) {
        this.appliCitys = appliCitys;
    }

    public String getDestCitys() {
        return destCitys;
    }

    public void setDestCitys(String destCitys) {
        this.destCitys = destCitys;
    }
}
