package com.jdy.b2b.api.vo.station;

import java.math.BigDecimal;
import java.util.Date;

import javax.validation.constraints.NotNull;

import org.springframework.format.annotation.DateTimeFormat;

import com.jdy.b2b.api.common.BaseVO;
import com.jdy.b2b.api.common.constants.annotations.Delete;
import com.jdy.b2b.api.common.constants.annotations.EffortDay;
import com.jdy.b2b.api.common.constants.annotations.Query;
import com.jdy.b2b.api.common.constants.annotations.Save;
import com.jdy.b2b.api.common.constants.annotations.Update;

/**
 * @Description 班次vo
 * @author 王斌
 * @date 2017年7月13日 上午10:16:39
 * @version V1.0
 */
public class StationPriceVO extends BaseVO {
	@NotNull(groups = { Update.class, Delete.class })
	private Long id;
	@NotNull(groups = { Save.class, Query.class })
	private Long sbDepartureId;
	@NotNull(groups = { Save.class, Update.class })
	private Long sbShuttleStopId;

	// @NotNull(groups = { Save.class })
	@DateTimeFormat(pattern = "HH:mm")
	private Date sbTime;

	@NotNull(groups = { Save.class })
	private Integer sbTraffic;
	@NotNull(groups = { Save.class })
	private Byte sbReturn;
	@NotNull(groups = { Save.class })
	private Integer sbTimeLength;

	// @NotNull(groups = { Save.class })
	private BigDecimal sbPrice;

	@NotNull(groups = { Save.class })
	private String sbStartPoint;

	@NotNull(groups = { Save.class })
	@DateTimeFormat(pattern = "yyyyMMdd")
	private Date sbStartTime;

	@NotNull(groups = { Save.class })
	@DateTimeFormat(pattern = "yyyyMMdd")
	private Date sbEndTime;

	@NotNull(groups = { Save.class })
	@EffortDay(groups = { Save.class })
	private String sbEffectWeek;

	private Integer sbStatus = 0;

	private Date createTime;

	private Long createUser;

	private Date updateTime;

	private Long updateUser;
	private int useForBack;// 应用到返程

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

	public int getUseForBack() {
		return useForBack;
	}

	public void setUseForBack(int useForBack) {
		this.useForBack = useForBack;
	}

	public Long getSbShuttleStopId() {
		return sbShuttleStopId;
	}

	public void setSbShuttleStopId(Long sbShuttleStopId) {
		this.sbShuttleStopId = sbShuttleStopId;
	}

}
