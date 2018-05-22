package com.jdy.b2b.web.pojo.product;

import java.util.Date;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Delete;
import com.jdy.b2b.web.util.annotations.Query;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel
public class KeysVO extends BaseVO {
	@ApiModelProperty("主键")
	@NotNull(message = "关键词编号不能为空", groups = { Update.class, Query.class,
			Delete.class })
	private Long id;
	@ApiModelProperty("企业编号必填")
	@NotNull(message = "企业编号不能为空", groups = { Save.class, Update.class,
			Query.class })
	private Long companyId;
	@ApiModelProperty("关键词名称,新增、编辑必填，长度范围[1-5]")
	@Length(min = 1, max = 5, message = "关键词名称长度范围[1-5]", groups = { Save.class,
			Update.class })
	@NotBlank(message = "关键词名称不能为空", groups = { Save.class, Update.class })
	private String kName;
	@ApiModelProperty("颜色,新增、编辑必填")
	@NotBlank(message = "颜色不能为空", groups = { Save.class, Update.class })
	private String kColor;
	@ApiModelProperty(hidden = true)
	private Date createTime;
	@ApiModelProperty(hidden = true)
	private Long createUser;
	@ApiModelProperty(hidden = true)
	private Date updateTime;
	@ApiModelProperty(hidden = true)
	private Long updateUser;
	@ApiModelProperty(hidden = true)
	private Integer status;
	@ApiModelProperty("排序字段")
	private Integer lSort;

	public Integer getlSort() {
		return lSort;
	}

	public void setlSort(Integer lSort) {
		this.lSort = lSort;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getCompanyId() {
		return companyId;
	}

	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
	}

	public String getkName() {
		return kName;
	}

	public void setkName(String kName) {
		this.kName = kName == null ? null : kName.trim();
	}

	public String getkColor() {
		return kColor;
	}

	public void setkColor(String kColor) {
		this.kColor = kColor == null ? null : kColor.trim();
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Long getCreateUser() {
		return createUser;
	}

	public void setCreateUser(Long createUser) {
		this.createUser = createUser;
	}

	public Date getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	public Long getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(Long updateUser) {
		this.updateUser = updateUser;
	}
}