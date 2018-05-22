package com.jdy.b2b.web.pojo.order;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.math.BigDecimal;
import java.util.Date;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/5 11:32
 */
@ApiModel(description = "游客信息dto")
public class OrderTouristDTO extends OrderTourist {

    @ApiModelProperty(value = "去程始发站名称")
    private String lvDepartureName;
    @ApiModelProperty(value = "去程接送站名称")
    private String lvStopName;
    @ApiModelProperty(value = "去程接送时间")
    private Date lvSbTime;
    @ApiModelProperty(value = "去程接送时差")
    private Integer lvSbTimeLength;

    @ApiModelProperty(value = "回程始发站名称")
    private String rtDepartureName;
    @ApiModelProperty(value = "回程接送站名称")
    private String rtStopName;
    @ApiModelProperty(value = "回程接送时间")
    private Date rtSbTime;
    @ApiModelProperty(value = "回程接送时差")
    private Integer rtSbTimeLength;

    @ApiModelProperty(value = "票价")
    private BigDecimal tPeerPrice;
    @ApiModelProperty(value = "票价类目id")
    private String category;
    @ApiModelProperty(value = "票价类目名称")
    private String categoryName;
    @ApiModelProperty(value = "票价名称")
    private String tName;

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
