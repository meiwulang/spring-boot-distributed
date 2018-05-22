package com.jdy.b2b.api.vo.product;

import java.util.List;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import com.jdy.b2b.api.common.BaseVO;
import com.jdy.b2b.api.common.constants.annotations.Delete;
import com.jdy.b2b.api.common.constants.annotations.Save;
import com.jdy.b2b.api.common.constants.annotations.Update;

/**
 * @Description 产品行程vo
 * @author 王斌
 * @date 2017年7月3日 下午5:48:23
 * @version V1.0
 */
public class TripVO extends BaseVO {
	@NotNull(groups = { Update.class, Delete.class })
	private Long id;

	@NotBlank(groups = { Save.class, Update.class })
	@Length(max = 100, groups = { Save.class, Update.class })
	private String tTitle;

	@Length(max = 100, groups = { Save.class, Update.class })
	private String tFromTo;
	@NotNull
	private List<Long> phHotelIds;
	@NotNull
	private List<Long> phScenicIds;
	private List<String> attachs;
	private String tMeals;
	private String tMealsRemark;
	private String tHotelRemark;
	private String tSimpleTrip;
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
