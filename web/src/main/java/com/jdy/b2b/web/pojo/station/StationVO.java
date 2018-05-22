package com.jdy.b2b.web.pojo.station;

import java.util.Date;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import com.jdy.b2b.web.annotation.EnumValue;
import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Delete;
import com.jdy.b2b.web.util.annotations.Query;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @Description 出发站vo
 * @author 王斌
 * @date 2017年7月13日 上午10:13:32
 * @version V1.0
 */
@ApiModel
public class StationVO extends BaseVO {
	@NotNull(message = "站点编号不能为空", groups = { Update.class, Delete.class })
	@ApiModelProperty(value = "站点主键。update、delete必填")
	private Long id;
	// @NotNull(message = "公司编号不能为空", groups = { Save.class, Update.class,
	// Query.class })
	@ApiModelProperty(value = "公司编号 。save、update、delete必填")
	private Long companyId;
	@NotBlank(message = "站点名称不能为空", groups = { Save.class, Update.class })
	@Length(message = "站点名称最长20位", max = 20, groups = { Save.class,
			Update.class })
	@ApiModelProperty(value = "站点名称 。save、update、delete必填")
	private String dName;
	@NotNull(message = "站点类型不能为空", groups = { Query.class, Save.class })
	@EnumValue(message = "站点类型可选值", enums = { "0", "1", "2", "3",
			"4" }, groups = { Save.class, Update.class, Query.class })
	@ApiModelProperty(value = "站点类型，save、update、delete必填。可选值[0,1，2，3，4]，其中0:始发站 1:顺路站 2:班车站，3：顺路站 +班车站,4:全部。")
	private Integer dType;

	@ApiModelProperty(value = "交通类别 0:飞机 1:火车 2:汽车 3:邮轮")
	@EnumValue(message = "交通类别可选值中", enums = { "0", "1", "2", "3" }, groups = {
			Save.class, Update.class })
	private Integer dTraffic;

	@ApiModelProperty(value = "三字码")
	private String dThree;

	@ApiModelProperty(value = "国家")
	private String dCountry = "";
	@NotBlank(message = "省不能为空", groups = { Save.class })
	@ApiModelProperty(value = "省，save必填")
	private String dProvince;
	@NotBlank(message = "市不能为空", groups = { Save.class })
	@ApiModelProperty(value = "市，save必填")
	private String dCity;
	@ApiModelProperty(value = "区县，save必填")
	@NotBlank(message = "区县不能为空", groups = { Save.class })
	private String dArea;

	@ApiModelProperty(value = "百度经度")
	private String dMapx;
	@ApiModelProperty(value = "百度维度")

	private String dMapy;

	private Integer dStatus = 0;
	@ApiModelProperty(hidden = true)
	private Date createTime;

	@ApiModelProperty(hidden = true)
	private Long createUser;

	@ApiModelProperty(hidden = true)
	private Date updateTime;

	@ApiModelProperty(hidden = true)
	private Long updateUser;

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

	public String getdName() {
		return dName;
	}

	public void setdName(String dName) {
		this.dName = dName == null ? null : dName.trim();
	}

	public Integer getdType() {
		return dType;
	}

	public void setdType(Integer dType) {
		this.dType = dType;
	}

	public Integer getdTraffic() {
		return dTraffic;
	}

	public void setdTraffic(Integer dTraffic) {
		this.dTraffic = dTraffic;
	}

	public String getdThree() {
		return dThree;
	}

	public void setdThree(String dThree) {
		this.dThree = dThree == null ? null : dThree.trim();
	}

	public String getdCountry() {
		return dCountry;
	}

	public void setdCountry(String dCountry) {
		this.dCountry = dCountry;
	}

	public String getdProvince() {
		return dProvince;
	}

	public void setdProvince(String dProvince) {
		this.dProvince = dProvince;
	}

	public String getdCity() {
		return dCity;
	}

	public void setdCity(String dCity) {
		this.dCity = dCity;
	}

	public String getdArea() {
		return dArea;
	}

	public void setdArea(String dArea) {
		this.dArea = dArea;
	}

	public String getdMapx() {
		return dMapx;
	}

	public void setdMapx(String dMapx) {
		this.dMapx = dMapx == null ? null : dMapx.trim();
	}

	public String getdMapy() {
		return dMapy;
	}

	public void setdMapy(String dMapy) {
		this.dMapy = dMapy == null ? null : dMapy.trim();
	}

	public Integer getdStatus() {
		return dStatus;
	}

	public void setdStatus(Integer dStatus) {
		this.dStatus = dStatus;
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
