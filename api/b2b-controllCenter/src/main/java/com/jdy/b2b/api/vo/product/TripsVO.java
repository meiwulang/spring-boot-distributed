package com.jdy.b2b.api.vo.product;

import java.util.ArrayList;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;

import com.jdy.b2b.api.common.BaseVO;
import com.jdy.b2b.api.common.constants.annotations.Collection;
import com.jdy.b2b.api.common.constants.annotations.Delete;
import com.jdy.b2b.api.common.constants.annotations.EnumValue;
import com.jdy.b2b.api.common.constants.annotations.Query;
import com.jdy.b2b.api.common.constants.annotations.Save;
import com.jdy.b2b.api.common.constants.annotations.Update;

/**
 * @Description 产品行程vo
 * @author 王斌
 * @date 2017年7月3日 下午5:48:23
 * @version V1.0
 */
public class TripsVO extends BaseVO {
	@NotNull(groups = { Save.class, Update.class })
	@Max(value = 99L, groups = { Save.class, Update.class })
	@Min(value = 1L, groups = { Save.class, Update.class })
	private Integer pDays;
	@NotNull(groups = { Save.class, Update.class, Query.class, Delete.class })
	@EnumValue(enums = { "0", "1" })
	private Integer tType;
	@Collection
	@Size(max = 99, min = 1, groups = { Save.class, Update.class })
	@NotEmpty
	private ArrayList<TripVO> trips;
	@NotNull(groups = { Save.class, Update.class, Delete.class, Query.class })
	private Long tProductId;
	private String tcStartDay;
	private String tcEndDay;
	@Length(message = "行程名称最大长度50", max = 50, groups = { Save.class,
			Update.class })
	private String tTitle = "";

	public String getTcStartDay() {
		return tcStartDay;
	}

	public void setTcStartDay(String tcStartDay) {
		this.tcStartDay = tcStartDay;
	}

	public String getTcEndDay() {
		return tcEndDay;
	}

	public void setTcEndDay(String tcEndDay) {
		this.tcEndDay = tcEndDay;
	}

	public Long gettProductId() {
		return tProductId;
	}

	public void settProductId(Long tProductId) {
		this.tProductId = tProductId;
	}

	public Integer getpDays() {
		return pDays;
	}

	public void setpDays(Integer pDays) {
		this.pDays = pDays;
	}

	public ArrayList<TripVO> getTrips() {
		return trips;
	}

	public void setTrips(ArrayList<TripVO> trips) {
		this.trips = trips;
	}

	public Integer gettType() {
		return tType;
	}

	public void settType(Integer tType) {
		this.tType = tType;
	}

	public String gettTitle() {
		return tTitle;
	}

	public void settTitle(String tTitle) {
		this.tTitle = tTitle;
	}

}
