package com.jdy.b2b.api.vo.pic;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import com.jdy.b2b.api.common.BaseVO;
import com.jdy.b2b.api.common.constants.annotations.Delete;
import com.jdy.b2b.api.common.constants.annotations.EnumValue;
import com.jdy.b2b.api.common.constants.annotations.Save;
import com.jdy.b2b.api.common.constants.annotations.Update;

/**
 * @Description 图片vo
 * @author 王斌
 * @date 2017年7月11日 下午1:43:25
 * @version V1.0
 */
public class PicVO extends BaseVO {
	@NotNull(groups = { Update.class, Delete.class })
	private Long id;
	@NotNull(groups = { Save.class })
	@EnumValue(enums = { "0", "1", "2", "3", "4", "5" }, groups = {
			Save.class })
	private Integer pType;

	@NotNull(groups = { Save.class })
	private Long pPid;

	@NotNull(groups = { Save.class })
	private Long pAlbumId;

	@NotNull(groups = { Save.class, Update.class })
	@Length(groups = { Save.class, Update.class }, max = 50)
	private String pRealName;

	@NotBlank(groups = { Save.class })
	private String pOssName;

	@NotNull(groups = { Save.class, Update.class })
	@Max(value = 999999999999L, groups = { Save.class, Update.class })
	private Long pSize;

	@NotBlank(groups = { Save.class })
	@EnumValue(enums = { "jpg", "gif", "png", "bmp", "jpeg" }, groups = {
			Save.class })
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
