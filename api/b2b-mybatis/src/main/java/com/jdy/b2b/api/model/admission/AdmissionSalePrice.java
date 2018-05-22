package com.jdy.b2b.api.model.admission;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

public class AdmissionSalePrice {
    private Long id;

    //门票id
    private Long pid;

    //票价名称
    private String apName;

    //票价类型 0:单票,1:套票
    private Integer apType;

    //用三位数字字符标识票价时段,每位可选值0,1，其中 0表示未选中，1表示选中;3位依次标识:平日,周末,节假日；例如 111表示三个都选中
    private String suitRegion;

    //平日成本价 
    private BigDecimal workdayCostPrice;

    //平日销售价 
    private BigDecimal workdaySalePrice;

    //周末成本价 
    private BigDecimal weekendCostPrice;

    //周末出厂价 
    private BigDecimal weekendSalePrice;

    //节假日成本价 
    private BigDecimal festivalCostPrice;

    //节假日销售价 
    private BigDecimal festivalSalePrice;
    //平日出厂价
    private BigDecimal workdayFactoryPrice;
    //周末出厂价 
    private BigDecimal weekendFactoryPrice;
    //节假日出厂价 
    private BigDecimal festivalFactoryPrice;

    //库存
    private Integer apStock;

    @JsonFormat(pattern="yyyy-MM-dd",timezone = "GMT+8")
    @DateTimeFormat(pattern="yyyy-MM-dd")
    //生效日期
    private LocalDate lifeEndDate;

    @JsonFormat(pattern="yyyy-MM-dd",timezone = "GMT+8")
    @DateTimeFormat(pattern="yyyy-MM-dd")
    //失效日期
    private LocalDate lifeStartDate;

    //说明
    private String remark;

    //供应商
    private String supplier;

    //供应商电话
    private String supplierTel;

    //创建者
    private Long createUser;

    //创建时间
    private Date createTime;

    //更新时间
    private Date updateTime;

    //更新者
    private Long updateUser;
    //状态
    private Integer adStatus;
    
    public Integer getAdStatus() {
		return adStatus;
	}

	public void setAdStatus(Integer adStatus) {
		this.adStatus = adStatus;
	}

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPid() {
        return pid;
    }

    public void setPid(Long pid) {
        this.pid = pid;
    }

    public String getApName() {
        return apName;
    }

    public void setApName(String apName) {
        this.apName = apName == null ? null : apName.trim();
    }

    public Integer getApType() {
        return apType;
    }

    public void setApType(Integer apType) {
        this.apType = apType;
    }

    public String getSuitRegion() {
        return suitRegion;
    }

    public void setSuitRegion(String suitRegion) {
        this.suitRegion = suitRegion == null ? null : suitRegion.trim();
    }

    public BigDecimal getWorkdayCostPrice() {
        return workdayCostPrice;
    }

    public void setWorkdayCostPrice(BigDecimal workdayCostPrice) {
        this.workdayCostPrice = workdayCostPrice;
    }

    public BigDecimal getWorkdaySalePrice() {
        return workdaySalePrice;
    }

    public void setWorkdaySalePrice(BigDecimal workdaySalePrice) {
        this.workdaySalePrice = workdaySalePrice;
    }

    public BigDecimal getWeekendCostPrice() {
        return weekendCostPrice;
    }

    public void setWeekendCostPrice(BigDecimal weekendCostPrice) {
        this.weekendCostPrice = weekendCostPrice;
    }

    public BigDecimal getWeekendSalePrice() {
        return weekendSalePrice;
    }

    public void setWeekendSalePrice(BigDecimal weekendSalePrice) {
        this.weekendSalePrice = weekendSalePrice;
    }

    public BigDecimal getFestivalCostPrice() {
        return festivalCostPrice;
    }

    public void setFestivalCostPrice(BigDecimal festivalCostPrice) {
        this.festivalCostPrice = festivalCostPrice;
    }

    public BigDecimal getFestivalSalePrice() {
        return festivalSalePrice;
    }

    public void setFestivalSalePrice(BigDecimal festivalSalePrice) {
        this.festivalSalePrice = festivalSalePrice;
    }

    public Integer getApStock() {
        return apStock;
    }

    public void setApStock(Integer apStock) {
        this.apStock = apStock;
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

	public BigDecimal getWorkdayFactoryPrice() {
		return workdayFactoryPrice;
	}

	public void setWorkdayFactoryPrice(BigDecimal workdayFactoryPrice) {
		this.workdayFactoryPrice = workdayFactoryPrice;
	}

	public BigDecimal getWeekendFactoryPrice() {
		return weekendFactoryPrice;
	}

	public void setWeekendFactoryPrice(BigDecimal weekendFactoryPrice) {
		this.weekendFactoryPrice = weekendFactoryPrice;
	}

	public BigDecimal getFestivalFactoryPrice() {
		return festivalFactoryPrice;
	}

	public void setFestivalFactoryPrice(BigDecimal festivalFactoryPrice) {
		this.festivalFactoryPrice = festivalFactoryPrice;
	}
    
}