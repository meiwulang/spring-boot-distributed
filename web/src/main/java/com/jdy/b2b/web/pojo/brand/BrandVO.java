package com.jdy.b2b.web.pojo.brand;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.Range;
import org.hibernate.validator.constraints.URL;

import com.jdy.b2b.web.annotation.EnumValue;
import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Delete;
import com.jdy.b2b.web.util.annotations.Query;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel
public class BrandVO extends BaseVO {
	@ApiModelProperty("品牌编号，编辑和删除必填")
	@NotNull(message = "品牌编号不能为空", groups = { Update.class, Delete.class })
	private Integer id;
	@ApiModelProperty("公司编号，保存、编辑和删除必填")
	// @NotNull(groups = { Save.class, Update.class, Delete.class })
	private Long bCompanyId;
	@ApiModelProperty("品牌名称，保存、编辑必填")
	@NotBlank(message = "品牌名称不能为空", groups = { Update.class, Save.class })
	@Length(max = 10, groups = { Update.class, Save.class })
	private String bName;

	@EnumValue(message = "首页是否显示可选值", enums = { "0", "1" }, groups = {
			Update.class, Save.class })
	@ApiModelProperty("首页是否显示，查询时可选字段 0:显示，1不显示")
	private Integer bStatus;
	@EnumValue(message = "品牌状态可选值", enums = { "0", "1" }, groups = {
			Query.class })
	@ApiModelProperty("品牌状态，查询时可选字段 0：未删除，1：已删除")
	private Integer bDel;
	@Range(message = "排序字段范围[0 ,2147483647]", min = 0, max = Integer.MAX_VALUE, groups = {
			Update.class, Save.class })
	@ApiModelProperty("排序字段")
	private Integer bSort;
	@ApiModelProperty("品牌logo,保存、编辑必填")
	// @NotBlank(message = "品牌logo地址不能为空", groups = { Save.class, Update.class
	// })
	@URL(message = "品牌logo地址不合法", groups = { Save.class, Update.class })
	private String pOssName;

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

	public String getpOssName() {
		return pOssName;
	}

	public void setpOssName(String pOssName) {
		this.pOssName = pOssName;
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