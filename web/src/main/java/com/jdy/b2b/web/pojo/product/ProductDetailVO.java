package com.jdy.b2b.web.pojo.product;

import javax.validation.constraints.NotNull;

import org.springframework.format.annotation.DateTimeFormat;

import com.jdy.b2b.web.annotation.EnumValue;
import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Save;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @Description 详情查询vo
 * @author 王斌
 * @date 2017年7月24日 下午2:08:23
 * @version V1.0
 */
@ApiModel
public class ProductDetailVO extends BaseVO {
	@NotNull(message = "产品编号不能为空")
	@ApiModelProperty(value = "产品主键")
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@ApiModelProperty(value = "线路类型 可选值：0：默认，1：补充")
	@EnumValue(enums = { "0", "1" }, groups = Save.class, message = "线路类型可选值")
	private Integer lineType;
	@ApiModelProperty(value = "开始时间，格式yyyyMMdd,查询补充线路信息必填")
	@DateTimeFormat(pattern = "yyyyMMdd")
	private String tcStartDay;
	@ApiModelProperty(value = "结束时间，格式yyyyMMdd,查询补充线路信息必填")
	@DateTimeFormat(pattern = "yyyyMMdd")
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
