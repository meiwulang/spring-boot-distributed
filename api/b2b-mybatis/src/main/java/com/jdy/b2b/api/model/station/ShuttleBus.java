package com.jdy.b2b.api.model.station;

import com.jdy.b2b.api.model.product.BaseDO;

import java.math.BigDecimal;
import java.util.Date;

public class ShuttleBus extends BaseDO {
    private Long id;

    private Long sbShuttleStopId;

    private Long sbDepartureId;

    private Date sbTime;

    private Integer sbTraffic;

    private Byte sbReturn;

    private Integer sbTimeLength;

    private BigDecimal sbPrice;

    private String sbStartPoint;

    private Date sbStartTime;

    private Date sbEndTime;

    private String sbEffectWeek;

    private Integer sbStatus;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSbDepartureId() {
        return sbDepartureId;
    }

    public void setSbDepartureId(Long sbDepartureId) {
        this.sbDepartureId = sbDepartureId;
    }

    public Date getSbTime() {
        return sbTime;
    }

    public void setSbTime(Date sbTime) {
        this.sbTime = sbTime;
    }

    public Integer getSbTraffic() {
        return sbTraffic;
    }

    public void setSbTraffic(Integer sbTraffic) {
        this.sbTraffic = sbTraffic;
    }

    public Byte getSbReturn() {
        return sbReturn;
    }

    public void setSbReturn(Byte sbReturn) {
        this.sbReturn = sbReturn;
    }

    public Integer getSbTimeLength() {
        return sbTimeLength;
    }

    public void setSbTimeLength(Integer sbTimeLength) {
        this.sbTimeLength = sbTimeLength;
    }

    public BigDecimal getSbPrice() {
        return sbPrice;
    }

    public void setSbPrice(BigDecimal sbPrice) {
        this.sbPrice = sbPrice;
    }

    public String getSbStartPoint() {
        return sbStartPoint;
    }

    public void setSbStartPoint(String sbStartPoint) {
        this.sbStartPoint = sbStartPoint == null ? null : sbStartPoint.trim();
    }

    public Date getSbStartTime() {
        return sbStartTime;
    }

    public void setSbStartTime(Date sbStartTime) {
        this.sbStartTime = sbStartTime;
    }

    public Date getSbEndTime() {
        return sbEndTime;
    }

    public void setSbEndTime(Date sbEndTime) {
        this.sbEndTime = sbEndTime;
    }

    public String getSbEffectWeek() {
        return sbEffectWeek;
    }

    public void setSbEffectWeek(String sbEffectWeek) {
        this.sbEffectWeek = sbEffectWeek == null ? null : sbEffectWeek.trim();
    }

    public Integer getSbStatus() {
        return sbStatus;
    }

    public void setSbStatus(Integer sbStatus) {
        this.sbStatus = sbStatus;
    }

    @Override
    public Date getCreateTime() {
        return createTime;
    }

    @Override
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    @Override
    public Long getCreateUser() {
        return createUser;
    }

    @Override
    public void setCreateUser(Long createUser) {
        this.createUser = createUser;
    }

    @Override
    public Date getUpdateTime() {
        return updateTime;
    }

    @Override
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    @Override
    public Long getUpdateUser() {
        return updateUser;
    }

    @Override
    public void setUpdateUser(Long updateUser) {
        this.updateUser = updateUser;
    }

    public void initCreateTime() {
        this.createTime = new Date();
    }

    public void initUpdateTime() {
        this.updateTime = new Date();
    }

    public void initCreatetimeAndUpdateTime() {
        this.createTime = new Date();
        this.updateTime = new Date();
    }

    public Long getSbShuttleStopId() {
        return sbShuttleStopId;
    }

    public void setSbShuttleStopId(Long sbShuttleStopId) {
        this.sbShuttleStopId = sbShuttleStopId;
    }
}