package com.jdy.b2b.web.pojo.require;

import javax.validation.constraints.NotNull;

import com.jdy.b2b.web.annotation.EnumValue;
import com.jdy.b2b.web.util.BaseVO;

import io.swagger.annotations.ApiModelProperty;

public class RequireTypeUpdateVO extends BaseVO {
	@NotNull(message="主键不能为空")
	private Long id;
	@ApiModelProperty("1待受理 2定制中 3已反馈 4已确认")
	@EnumValue(enums = { "1", "2", "3", "4" })
	@NotNull(message="状态不能为空")
	private Long dStatus;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getdStatus() {
		return dStatus;
	}

	public void setdStatus(Long dStatus) {
		this.dStatus = dStatus;
	}

}