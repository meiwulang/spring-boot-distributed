package com.jdy.b2b.api.vo.product;

import javax.validation.constraints.NotNull;

import com.jdy.b2b.api.common.BaseVO;
import com.jdy.b2b.api.common.constants.annotations.EnumValue;

/**
 * @Description 产品确认状态vo
 * @author 王斌
 * @date 2017年7月3日 下午5:48:23
 * @version V1.0
 */
public class UpdateConfirmVO extends BaseVO {
	@NotNull
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@NotNull
	@EnumValue(enums = { "0", "1" })
	private Integer pConfirm;

	public Integer getpConfirm() {
		return pConfirm;
	}

	public void setpConfirm(Integer pConfirm) {
		this.pConfirm = pConfirm;
	}
}
