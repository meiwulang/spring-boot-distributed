package com.jdy.b2b.web.pojo.attach;

import java.util.Date;

import javax.validation.constraints.NotNull;

import com.jdy.b2b.web.annotation.EnumValue;
import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Delete;
import com.jdy.b2b.web.util.annotations.Query;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @Description 保存图册
 * @author 王斌
 * @date 2017年7月18日 上午10:08:45
 * @version V1.0
 */
@ApiModel
public class AlbumVO extends BaseVO {
	@NotNull(message = "图片编号不能为空", groups = { Update.class, Delete.class })
	@ApiModelProperty(value = "相册编号 update、delete必填")
	private Long id;

	@NotNull(message = "公司编号不能为空", groups = { Save.class, Query.class,
			Update.class, Delete.class })
	@ApiModelProperty(value = "公司编号", required = true)
	private Long companyId;

	@NotNull(message = "城市名称不能为空", groups = { Save.class })
	@ApiModelProperty(value = "城市名称，save必填")
	private String aCity;
	@EnumValue(message = "相册类型可选值", enums = { "0", "1" }, groups = Save.class)
	@NotNull(message = "相册类型不能为空", groups = { Save.class })
	@ApiModelProperty(value = "相册类型，save必填。 0:酒店 1:景点")
	private Integer aType;

	@NotNull(message = "酒店ID/景点ID不能为空", groups = { Save.class })
	@ApiModelProperty(value = "酒店ID/景点ID，save必填")
	private Long aPid;

	@NotNull(message = "相册名称不能为空", groups = { Save.class, Update.class })
	@ApiModelProperty(value = "相册名称，save，update必填")
	private String aName;
	@NotNull(message = "封面url不能为空", groups = { Save.class, Update.class })
	@ApiModelProperty(value = "封面url，save，update必填")
	private String pOssName;
	@NotNull(message = "封面大小不能为空", groups = { Save.class, Update.class })
	@ApiModelProperty(value = "封面大小，save，update必填")
	private Long pSize;
	@ApiModelProperty(hidden = true)
	private Integer aStatus = 0;
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

	public String getaCity() {
		return aCity;
	}

	public void setaCity(String aCity) {
		this.aCity = aCity == null ? null : aCity.trim();
	}

	public Integer getaType() {
		return aType;
	}

	public void setaType(Integer aType) {
		this.aType = aType;
	}

	public Long getaPid() {
		return aPid;
	}

	public void setaPid(Long aPid) {
		this.aPid = aPid;
	}

	public String getaName() {
		return aName;
	}

	public void setaName(String aName) {
		this.aName = aName == null ? null : aName.trim();
	}

	public Integer getaStatus() {
		return aStatus;
	}

	public void setaStatus(Integer aStatus) {
		this.aStatus = aStatus;
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

	public String getpOssName() {
		return pOssName;
	}

	public void setpOssName(String pOssName) {
		this.pOssName = pOssName;
	}

	public Long getpSize() {
		return pSize;
	}

	public void setpSize(Long pSize) {
		this.pSize = pSize;
	}

}
