package com.jdy.b2b.web.pojo.product;

import java.util.ArrayList;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.format.annotation.DateTimeFormat;

import com.jdy.b2b.web.annotation.EnumValue;
import com.jdy.b2b.web.annotation.MyValidator;
import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Delete;
import com.jdy.b2b.web.util.annotations.Query;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @Description 产品行程vo
 * @author 王斌
 * @date 2017年7月3日 下午5:48:23
 * @version V1.0
 */
@ApiModel
public class TripsVO extends BaseVO {
	@NotNull(message = "行程天数，天数范围1-99", groups = { Save.class, Update.class })
	@Max(value = 99L, message = "行程天数，天数范围1-99", groups = { Save.class,
			Update.class })
	@Min(value = 1L, message = "行程天数，天数范围1-99", groups = { Save.class,
			Update.class })
	@ApiModelProperty(value = "行程天数，天数范围1-99，save、update必填")
	private Integer pDays;
	@NotNull(message = "行程类型不能为空", groups = { Save.class, Update.class,
			Query.class, Delete.class })
	@EnumValue(message = "行程类型可选值", enums = { "0", "1" }, groups = { Save.class,
			Update.class, Delete.class })
	@ApiModelProperty(value = "行程类型 可选值：0,1。其中0表示默认行程、1表示补充行程，save、update必填")
	private Integer tType;
	@MyValidator
	@Size(message = "行程对象数组大小范围[1-99]", max = 99, min = 1, groups = {
			Save.class, Update.class })
	@NotEmpty(message = "行程对象数组不能为空", groups = { Save.class, Update.class })
	@ApiModelProperty(value = "行程对象数组 数组大小范围在[1-99]，save、update必填")
	private ArrayList<TripVO> trips;
	@NotNull(message = "产品编号不能为空", groups = { Save.class, Update.class,
			Delete.class, Query.class })
	@ApiModelProperty(value = "产品编号", required = true)
	private Long tProductId;
	@ApiModelProperty(value = "补充行程开始时间,添加、查询、删除、修改补充行程必传")
	@DateTimeFormat(pattern = "yyyyMMdd")
	private String tcStartDay;
	@ApiModelProperty(value = "补充行程结束时间,添加、查询、删除、修改补充行程必传")
	@DateTimeFormat(pattern = "yyyyMMdd")
	private String tcEndDay;
	@Length(message = "行程名称最大长度50", max = 50, groups = { Save.class,
			Update.class })
	@ApiModelProperty(value = "行程名称，update、save必填，默认值：默认行程")
	private String tTitle = "";

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

	public String gettTitle() {
		return tTitle;
	}

	public void settTitle(String tTitle) {
		this.tTitle = tTitle;
	}

}
