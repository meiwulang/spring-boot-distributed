package com.jdy.b2b.api.model.station;

import java.math.BigDecimal;
import java.util.Date;

public class ShuttleBusDTO {
	private Long id;

	private Long companyId;

	private Long sbDepartureId;
	private Long sbShuttleStopId;
	private Date sbTime;

	private Integer sbTraffic;

	private Byte sbReturn;

	private Integer sbTimeLength;

	private BigDecimal sbPrice;

	private String dName;
	private String sbStartPoint;

	private Date sbStartTime;

	private Date sbEndTime;

	private String sbEffectWeek;

	private Integer sbStatus;
	protected Date createTime;
	protected Date updateTime;
	protected Long updateUser;
	protected Long createUser;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getCompanyId() {
		return companyId;
	}

	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
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

	public String getdName() {
		return dName;
	}

	public void setdName(String dName) {
		this.dName = dName;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
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

	public Long getCreateUser() {
		return createUser;
	}

	public void setCreateUser(Long createUser) {
		this.createUser = createUser;
	}

	public Long getSbShuttleStopId() {
		return sbShuttleStopId;
	}

	public void setSbShuttleStopId(Long sbShuttleStopId) {
		this.sbShuttleStopId = sbShuttleStopId;
	}

}