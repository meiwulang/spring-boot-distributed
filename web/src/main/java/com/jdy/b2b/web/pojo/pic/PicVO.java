package com.jdy.b2b.web.pojo.pic;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.URL;

import com.jdy.b2b.web.annotation.EnumValue;
import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Delete;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @Description 图片vo
 * @author 王斌
 * @date 2017年7月11日 下午1:43:25
 * @version V1.0
 */
@ApiModel("图片")
public class PicVO extends BaseVO {
	@NotNull(message = "文件编号不能为空", groups = { Update.class, Delete.class })
	@ApiModelProperty(value = "编号 update、delete必填")
	private Long id;
	@NotNull(message = "附件类型不能为空", groups = { Save.class })
	@EnumValue(message = "附件类型可选值", enums = { "0", "1", "2", "3", "4",
			"5" }, groups = { Save.class })
	@ApiModelProperty(value = "附件类型 save必填,可选值[0,1,2,3,4,5]0:线路 1:行程 2:酒店 3:景点4:广告5:品牌")
	private Integer pType;

	@NotNull(message = "所属编号不能为空", groups = { Save.class })
	@ApiModelProperty(value = "编号 save必填")
	private Long pPid;

	@NotNull(message = "相册编号不能为空", groups = { Save.class })
	@ApiModelProperty(value = "相册编号  save必填")
	private Long pAlbumId;

	@NotNull(message = "文件名称不能为空", groups = { Save.class, Update.class })
	@Length(message = "文件名称最大长度50", groups = { Save.class,
			Update.class }, max = 50)
	@ApiModelProperty(value = "文件名称  save、update必填")
	private String pRealName;

	@NotBlank(message = "oss路径不能为空", groups = { Save.class, Update.class })
	@ApiModelProperty(value = "oss路径  save必填")
	@URL(message = "图片地址地址不合法", groups = { Save.class, Update.class })
	private String pOssName;

	@NotNull(message = "文件大小不能为空", groups = { Save.class, Update.class })
	@Max(message = "文件最大值999999999999L", value = 999999999999L, groups = {
			Save.class, Update.class })
	@ApiModelProperty(value = "文件大小  save、update必填")
	private Long pSize;

	@NotBlank(message = "文件类型不能为空", groups = { Save.class })
	@EnumValue(message = "文件类型可选值", enums = { "jpg", "gif", "png", "bmp",
			"jpeg" }, groups = { Save.class })
	@ApiModelProperty(value = "文件类型  save必填，可选值[jpg,gif,png,bmp,jpeg]")
	private String pPicType;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getpType() {
		return pType;
	}

	public void setpType(Integer pType) {
		this.pType = pType;
	}

	public Long getpPid() {
		return pPid;
	}

	public void setpPid(Long pPid) {
		this.pPid = pPid;
	}

	public Long getpAlbumId() {
		return pAlbumId;
	}

	public void setpAlbumId(Long pAlbumId) {
		this.pAlbumId = pAlbumId;
	}

	public String getpRealName() {
		return pRealName;
	}

	public void setpRealName(String pRealName) {
		this.pRealName = pRealName;
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

	public String getpPicType() {
		return pPicType;
	}

	public void setpPicType(String pPicType) {
		this.pPicType = pPicType;
	}
}
