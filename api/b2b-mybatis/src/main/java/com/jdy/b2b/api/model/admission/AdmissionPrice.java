package com.jdy.b2b.api.model.admission;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

public class AdmissionPrice {
	private Long id;

	// 供应商
	private String supplier;

	// 供应商电话
	private String supplierTel;

	// 成本价
	private BigDecimal costPrice;

	// 出厂价
	private BigDecimal factoryPrice;

	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	// 生效日期
	private LocalDate lifeEndDate;

	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	// 失效日期
	private LocalDate lifeStartDate;

	// 说明
	private String remark;

	// 门票id
	private Long pid;

	// 创建者
	private Long createUser;

	// 创建时间
	private Date createTime;

	// 更新时间
	private Date updateTime;

	// 更新者
	private Long updateUser;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getSupplier() {
		return supplier;
	}

	public void setSupplier(String supplier) {
		this.supplier = supplier == null ? null : supplier.trim();
	}

	public String getSupplierTel() {
		return supplierTel;
	}

	public void setSupplierTel(String supplierTel) {
		this.supplierTel = supplierTel == null ? null : supplierTel.trim();
	}

	public BigDecimal getCostPrice() {
		return costPrice;
	}

	public void setCostPrice(BigDecimal costPrice) {
		this.costPrice = costPrice;
	}

	public BigDecimal getFactoryPrice() {
		return factoryPrice;
	}

	public void setFactoryPrice(BigDecimal factoryPrice) {
		this.factoryPrice = factoryPrice;
	}

	public LocalDate getLifeEndDate() {
		return lifeEndDate;
	}

	public void setLifeEndDate(LocalDate lifeEndDate) {
		this.lifeEndDate = lifeEndDate;
	}

	public LocalDate getLifeStartDate() {
		return lifeStartDate;
	}

	public void setLifeStartDate(LocalDate lifeStartDate) {
		this.lifeStartDate = lifeStartDate;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark == null ? null : remark.trim();
	}

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}

	public Long getCreateUser() {
		return createUser;
	}

	public void setCreateUser(Long createUser) {
		this.createUser = createUser;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
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