package com.jdy.b2b.web.pojo.station;

import java.math.BigDecimal;
import java.util.Date;

import javax.validation.constraints.NotNull;

import org.springframework.format.annotation.DateTimeFormat;

import com.jdy.b2b.web.annotation.EffortDay;
import com.jdy.b2b.web.annotation.EnumValue;
import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Delete;
import com.jdy.b2b.web.util.annotations.Query;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @Description 班次vo
 * @author 王斌
 * @date 2017年7月13日 上午10:16:39
 * @version V1.0
 */
@ApiModel
public class StationPriceVO extends BaseVO {
	@NotNull(message = "车次策略编号不能为空", groups = { Update.class, Delete.class })
	@ApiModelProperty(value = "车次策略主键，update、delete必填")
	private Long id;
	@NotNull(message = "出发地编号不能为空", groups = { Save.class, Query.class })
	@ApiModelProperty(value = "出发地编号，save、list必填")
	private Long sbDepartureId;
	@NotNull(message = "终点站不能为空", groups = { Save.class, Update.class })
	@ApiModelProperty(value = "终点站编号，save、list必填")
	private Long sbShuttleStopId;
	// @NotNull(groups = { Save.class })
	@DateTimeFormat(pattern = "HH:mm")
	@ApiModelProperty(value = "出发时间，save必填")
	private Date sbTime;

	@NotNull(message = "交通类别不能为空", groups = { Save.class })
	@EnumValue(message = "交通类别可选值", enums = { "0", "1", "2", "3" }, groups = {
			Save.class, Update.class })
	@ApiModelProperty(value = "交通类别 0:飞机 1:火车 2:汽车 3:邮轮，save必填")
	private Integer sbTraffic;
	@NotNull(message = "往返情况不能为空", groups = { Save.class })
	@ApiModelProperty(value = "往返0去程 1返程，save必填")
	@EnumValue(message = "往返情况可选值", enums = { "0", "1" }, groups = {
			Save.class })
	private Integer sbReturn;
	@NotNull(message = "时差不能为空", groups = { Save.class })
	@ApiModelProperty(value = "时差（单位：分钟），save必填")
	private Integer sbTimeLength;

	// @NotNull(message = "结算价不能为空", groups = { Save.class })
	@ApiModelProperty(value = "结算价，save必填")
	private BigDecimal sbPrice;

	@NotNull(message = "始（终）站点不能为空", groups = { Save.class })
	@ApiModelProperty(value = "始（终）站点，save必填")
	private String sbStartPoint;

	@NotNull(message = "开始时间不能为空", groups = { Save.class })
	@DateTimeFormat(pattern = "yyyyMMdd")
	@ApiModelProperty(value = "开始时间，save必填")
	private Date sbStartTime;

	@NotNull(message = "结束时间不能为空", groups = { Save.class })
	@DateTimeFormat(pattern = "yyyyMMdd")
	@ApiModelProperty(value = "结束时间，save必填")
	private Date sbEndTime;

	@NotNull(groups = { Save.class })
	@EffortDay(groups = { Save.class })
	@ApiModelProperty(value = "周几有效，save必填。用7位数字表示7天，0、1来表示状态，例如：0010001 表示周三和周日有效")
	private String sbEffectWeek;

	private Integer sbStatus = 0;
	@ApiModelProperty(hidden = true)
	private Date createTime;
	@ApiModelProperty(hidden = true)
	private Long createUser;
	@ApiModelProperty(hidden = true)
	private Date updateTime;
	@ApiModelProperty(hidden = true)
	private Long updateUser;
	@ApiModelProperty(value = "应用到返程  传1生效")
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

	public Integer getSbReturn() {
		return sbReturn;
	}

	public void setSbReturn(Integer sbReturn) {
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
