package com.jdy.b2b.web.pojo.productRecommend;

import com.jdy.b2b.web.pojo.scenicspot.ScenicSpot;
import com.jdy.b2b.web.pojo.ticket.TicketArea;

import java.util.ArrayList;
import java.util.List;

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

    //适用城市
    private String appliCitys;
    //目的地
    private String destCitys;

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
