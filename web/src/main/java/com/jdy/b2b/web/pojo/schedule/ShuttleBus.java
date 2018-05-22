package com.jdy.b2b.web.pojo.schedule;

import com.jdy.b2b.web.pojo.order.BaseDO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.math.BigDecimal;
import java.util.Date;

@ApiModel(description = "班次信息")
public class ShuttleBus extends BaseDO {
    private Long id;

    @ApiModelProperty(value = "出发地id")
    private Long sbShuttleStopId;
    @ApiModelProperty(value = "始发站id")
    private Long sbDepartureId;
    @ApiModelProperty(value = "时间间隔")
    private Date sbTime;
    @ApiModelProperty(value = "交通类别 0:飞机 1:火车 2:汽车 3:邮轮")
    private Integer sbTraffic;
    @ApiModelProperty(value = "往返0去程 1返程")
    private Byte sbReturn;

    @ApiModelProperty(value = "时差(分钟)")
    private Integer sbTimeLength;
    @ApiModelProperty(value = "接送价格")
    private BigDecimal sbPrice;
    @ApiModelProperty(value = "起(终)点站")
    private String sbStartPoint;
    private Date sbStartTime;
    private Date sbEndTime;
    @ApiModelProperty(value = "生效周几")
    private String sbEffectWeek;
    @ApiModelProperty(value = "状态 0:有效 1:无效")
    private Integer sbStatus;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSbShuttleStopId() {
        return sbShuttleStopId;
    }

    public void setSbShuttleStopId(Long sbShuttleStopId) {
        this.sbShuttleStopId = sbShuttleStopId;
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
        this.sbStartPoint = sbStartPoint;
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
        this.sbEffectWeek = sbEffectWeek;
    }

    public Integer getSbStatus() {
        return sbStatus;
    }

    public void setSbStatus(Integer sbStatus) {
        this.sbStatus = sbStatus;
    }
}