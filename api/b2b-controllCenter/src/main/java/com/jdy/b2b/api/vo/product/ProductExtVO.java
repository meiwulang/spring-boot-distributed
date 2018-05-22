package com.jdy.b2b.api.vo.product;

import java.util.Date;

import javax.validation.constraints.NotNull;

import com.jdy.b2b.api.common.BaseVO;
import com.jdy.b2b.api.common.constants.annotations.Delete;
import com.jdy.b2b.api.common.constants.annotations.Query;
import com.jdy.b2b.api.common.constants.annotations.Save;
import com.jdy.b2b.api.common.constants.annotations.Update;

/**
 * @Description 线路信息vo
 * @author 王斌
 * @date 2017年9月14日 上午10:51:33
 * @version V1.0
 */
public class ProductExtVO extends BaseVO {
	private String pSpecial;

	private String pCostInclude;

	private String pCostExclude;

	private String pNotes;

	private String pVisa;

	public String getpSpecial() {
		return pSpecial;
	}

	public void setpSpecial(String pSpecial) {
		this.pSpecial = pSpecial;
	}

	public String getpCostInclude() {
		return pCostInclude;
	}

	public void setpCostInclude(String pCostInclude) {
		this.pCostInclude = pCostInclude;
	}

	public String getpCostExclude() {
		return pCostExclude;
	}

	public void setpCostExclude(String pCostExclude) {
		this.pCostExclude = pCostExclude;
	}

	public String getpNotes() {
		return pNotes;
	}

	public void setpNotes(String pNotes) {
		this.pNotes = pNotes;
	}

	public String getpVisa() {
		return pVisa;
	}

	public void setpVisa(String pVisa) {
		this.pVisa = pVisa;
	}

	@NotNull(message = "线路编号不能为空", groups = { Update.class })
	private Long id;
	@NotNull(message = "产品编号不能为空", groups = { Delete.class, Query.class,
			Save.class })
	private Long tProductId;
	@NotNull(message = "开始时间不能为空", groups = { Update.class, Delete.class,
			Query.class, Save.class })
	private String tcStartDay;
	@NotNull(message = "结束时间不能为空", groups = { Update.class, Delete.class,
			Query.class, Save.class })
	private String tcEndDay;
	private Date createTime;

	private Long createUser;

	private Date updateTime;

	private Long updateUser;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long gettProductId() {
		return tProductId;
	}

	public void settProductId(Long tProductId) {
		this.tProductId = tProductId;
	}

	public String getTcStartDay() {
		return tcStartDay;
	}

	public void setTcStartDay(String tcStartDay) {
		this.tcStartDay = tcStartDay;
	}

	public String getTcEndDay() {
		return tcEndDay;
	}

	public void setTcEndDay(String tcEndDay) {
		this.tcEndDay = tcEndDay;
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
