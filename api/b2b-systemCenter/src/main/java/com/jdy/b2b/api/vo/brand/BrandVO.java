package com.jdy.b2b.api.vo.brand;

import javax.validation.constraints.NotNull;

import com.jdy.b2b.api.common.BaseVO;
import com.jdy.b2b.api.common.constants.annotations.Delete;
import com.jdy.b2b.api.common.constants.annotations.Save;
import com.jdy.b2b.api.common.constants.annotations.Update;

public class BrandVO extends BaseVO {
	@NotNull(groups = { Update.class, Delete.class })
	private Integer id;

	@NotNull(groups = { Update.class, Delete.class })
	private Long bCompanyId;

	@NotNull(groups = { Update.class, Save.class })
	private String bName;

	private Integer bStatus;
	private Integer bDel;
	private Integer bSort;
	// @NotBlank(groups = { Save.class, Update.class })
	private String pOssName;

	public String getpOssName() {
		return pOssName;
	}

	public void setpOssName(String pOssName) {
		this.pOssName = pOssName;
	}

	public Integer getbSort() {
		return bSort;
	}

	public void setbSort(Integer bSort) {
		this.bSort = bSort;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Long getbCompanyId() {
		return bCompanyId;
	}

	public void setbCompanyId(Long bCompanyId) {
		this.bCompanyId = bCompanyId;
	}

	public String getbName() {
		return bName;
	}

	public void setbName(String bName) {
		this.bName = bName == null ? null : bName.trim();
	}

	public Integer getbStatus() {
		return bStatus;
	}

	public void setbStatus(Integer bStatus) {
		this.bStatus = bStatus;
	}

	public Integer getbDel() {
		return bDel;
	}

	public void setbDel(Integer bDel) {
		this.bDel = bDel;
	}

	private String companyName;
	private String createUserName;

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getCreateUserName() {
		return createUserName;
	}

	public void setCreateUserName(String createUserName) {
		this.createUserName = createUserName;
	}
}