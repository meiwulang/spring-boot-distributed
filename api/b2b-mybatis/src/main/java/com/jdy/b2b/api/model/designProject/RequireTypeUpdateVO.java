package com.jdy.b2b.api.model.designProject;

import com.jdy.b2b.api.common.BaseVO;

public class RequireTypeUpdateVO extends BaseVO {
	private Long id;
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