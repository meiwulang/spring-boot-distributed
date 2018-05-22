package com.jdy.b2b.api.vo.product;

import javax.validation.constraints.NotNull;

import com.jdy.b2b.api.common.BaseVO;
import com.jdy.b2b.api.common.constants.annotations.EnumValue;
import com.jdy.b2b.api.common.constants.annotations.Save;

/**
 * @Description 详情查询vo
 * @author 王斌
 * @date 2017年7月24日 下午2:08:23
 * @version V1.0
 */
public class ProductDetailVO extends BaseVO {
	@NotNull
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@EnumValue(enums = { "0", "1" }, groups = Save.class, message = "线路类型可选值")
	private Integer lineType;
	private String tcStartDay;
	private String tcEndDay;

	public Integer getLineType() {
		return lineType;
	}

	public void setLineType(Integer lineType) {
		this.lineType = lineType;
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

}
