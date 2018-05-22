package com.jdy.b2b.web.pojo.product;

import javax.validation.constraints.NotNull;

import com.jdy.b2b.web.annotation.EnumValue;
import com.jdy.b2b.web.util.BaseVO;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @Description 产品确认状态vo
 * @author 王斌
 * @date 2017年7月3日 下午5:48:23
 * @version V1.0
 */
@ApiModel("确认状态参数")
public class UpdateConfirmVO extends BaseVO {
	@NotNull
	@ApiModelProperty("产品编号")
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@NotNull
	@EnumValue(enums = { "0", "1" })
	@ApiModelProperty("确认状态，可选值[0,1]")
	private Integer pConfirm;

	public Integer getpConfirm() {
		return pConfirm;
	}

	public void setpConfirm(Integer pConfirm) {
		this.pConfirm = pConfirm;
	}
}
