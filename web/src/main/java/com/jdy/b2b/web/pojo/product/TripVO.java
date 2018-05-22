package com.jdy.b2b.web.pojo.product;

import java.util.List;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;
import org.springframework.format.annotation.DateTimeFormat;

import com.jdy.b2b.web.annotation.EnumValue;
import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Delete;
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
public class TripVO extends BaseVO {
	@NotNull(message = "行程主键不能为空", groups = { Update.class, Delete.class })
	@ApiModelProperty(value = "行程主键，update、batchDelete必填")
	private Long id;

	@NotBlank(message = "行程名称不能为空", groups = { Save.class, Update.class })
	@Length(message = "行程名称最大长度100", max = 100, groups = { Save.class,
			Update.class })
	@ApiModelProperty(value = "行程名称，update、save必填，默认值：默认行程")
	private String tTitle = "默认行程";

	@Length(message = "行程始终站最大长度100", max = 100, groups = { Save.class,
			Update.class })
	@ApiModelProperty(value = "行程始终站，update、save必填")
	private String tFromTo;
	@DateTimeFormat(pattern = "yyyyMMdd")
	@ApiModelProperty(value = "有效日期，格式yyyyMMdd，默认行程不需要")
	private String tcEffectDay;
	// @NotNull(message = "行程主键不能为空")
	@ApiModelProperty(value = "酒店编号数组")
	private List<Long> phHotelIds;
	// @NotNull
	@ApiModelProperty(value = "景点编号数组")
	private List<Long> phScenicIds;
	@ApiModelProperty(value = "图片url数组")
	private List<String> attachs;
	@ApiModelProperty(value = "周几 可选值[1-7],:1代表周一以此类推")
	@EnumValue(message = "周几 可选值，默认行程不需要", enums = { "1", "2", "3", "4", "5",
			"6", "7" }, groups = { Save.class, Update.class })
	private Integer tcEffectWeek;
	@EnumValue(message = "用餐情况可选值", enums = { "000", "100", "110", "111", "010",
			"011" }, groups = { Save.class, Update.class })
	@ApiModelProperty(value = "用餐情况,用0和1表示是否包含，长度为3位。例如010表示包含午餐，111包含早中晚三餐")
	private String tMeals;
	@ApiModelProperty(value = "用餐备注")
	private String tMealsRemark;
	@ApiModelProperty(value = "住宿备注")
	private String tHotelRemark;
	@ApiModelProperty(value = "简易行程描述")
	private String tSimpleTrip;
	@ApiModelProperty(value = "详细行程描述")
	private String tDetailTrip;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String gettTitle() {
		return tTitle;
	}

	public void settTitle(String tTitle) {
		this.tTitle = tTitle;
	}

	public String gettFromTo() {
		return tFromTo;
	}

	public void settFromTo(String tFromTo) {
		this.tFromTo = tFromTo;
	}

	public String gettMeals() {
		return tMeals;
	}

	public void settMeals(String tMeals) {
		this.tMeals = tMeals;
	}

	public String gettMealsRemark() {
		return tMealsRemark;
	}

	public void settMealsRemark(String tMealsRemark) {
		this.tMealsRemark = tMealsRemark;
	}

	public String gettHotelRemark() {
		return tHotelRemark;
	}

	public void settHotelRemark(String tHotelRemark) {
		this.tHotelRemark = tHotelRemark;
	}

	public String gettSimpleTrip() {
		return tSimpleTrip;
	}

	public void settSimpleTrip(String tSimpleTrip) {
		this.tSimpleTrip = tSimpleTrip;
	}

	public String gettDetailTrip() {
		return tDetailTrip;
	}

	public void settDetailTrip(String tDetailTrip) {
		this.tDetailTrip = tDetailTrip;
	}

	public String getTcEffectDay() {
		return tcEffectDay;
	}

	public void setTcEffectDay(String tcEffectDay) {
		this.tcEffectDay = tcEffectDay;
	}

	public Integer getTcEffectWeek() {
		return tcEffectWeek;
	}

	public void setTcEffectWeek(Integer tcEffectWeek) {
		this.tcEffectWeek = tcEffectWeek;
	}

	public List<Long> getPhHotelIds() {
		return phHotelIds;
	}

	public void setPhHotelIds(List<Long> phHotelIds) {
		this.phHotelIds = phHotelIds;
	}

	public List<Long> getPhScenicIds() {
		return phScenicIds;
	}

	public void setPhScenicIds(List<Long> phScenicIds) {
		this.phScenicIds = phScenicIds;
	}

	public List<String> getAttachs() {
		return attachs;
	}

	public void setAttachs(List<String> attachs) {
		this.attachs = attachs;
	}

}
