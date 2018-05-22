package com.jdy.b2b.api.vo.pic;

import com.jdy.b2b.api.common.BaseVO;

/**
 * @Description 图片vo
 * @author 王斌
 * @date 2017年7月11日 下午1:43:25
 * @version V1.0
 */
public class QueryPicAlbumListVO extends BaseVO {
	private Long aPid;
	private Integer aType;
	private String atName;
	private String atStatus = "ok";
	private String city;

	public Long getaPid() {
		return aPid;
	}

	public void setaPid(Long aPid) {
		this.aPid = aPid;
	}

	public Integer getaType() {
		return aType;
	}

	public void setaType(Integer aType) {
		this.aType = aType;
	}

	public String getAtName() {
		return atName;
	}

	public void setAtName(String atName) {
		this.atName = atName;
	}

	public String getAtStatus() {
		return atStatus;
	}

	public void setAtStatus(String atStatus) {
		this.atStatus = atStatus;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

}
