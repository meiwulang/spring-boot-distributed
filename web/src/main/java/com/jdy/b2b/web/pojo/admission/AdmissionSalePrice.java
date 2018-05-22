package com.jdy.b2b.web.pojo.admission;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;

@ApiModel
public class AdmissionSalePrice {
    private Long id;

    @ApiModelProperty(value = "门票id")
    @NotNull
    private Long pid;

    @Max(value = 30,message="票价名称最大长度为：30")
    @NotNull
    private String apName;

    @ApiModelProperty(value = "票价类型 0:单票,1:套票")
    private Integer apType;

    @Max(value = 3,message="用三位数字字符标识票价时段,每位可选值0,1，其中 0表示未选中，1表示选中; 3位依次标识:平日,周末,节假日；例如 111表示三个都选中最大长度为：3")
    @ApiModelProperty(value = "用三位数字字符标识票价时段,每位可选值0,1，其中 0表示未选中，1表示选中; 3位依次标识:平日,周末,节假日；例如 111表示三个都选中最大长度为：3 ")
    private String suitRegion;

    @ApiModelProperty(value = "平日成本价 ")
    @NotNull
    private BigDecimal workdayCostPrice;

    @ApiModelProperty(value = "平日出厂价 ")
    @NotNull
    private BigDecimal workdaySalePrice;

    @ApiModelProperty(value = "周末成本价 ")
    @NotNull
    private BigDecimal weekendCostPrice;

    @ApiModelProperty(value = "周末出厂价 ")
    @NotNull
    private BigDecimal weekendSalePrice;

    @ApiModelProperty(value = "节假日成本价 ")
    @NotNull
    private BigDecimal festivalCostPrice;

    @ApiModelProperty(value = "节假日出厂价 ")
    @NotNull
    private BigDecimal festivalSalePrice;

    @ApiModelProperty(value = "库存")
    @NotNull
    private Integer apStock;

    @JsonFormat(pattern="yyyy-MM-dd",timezone = "GMT+8")
    @DateTimeFormat(pattern="yyyy-MM-dd")
    @ApiModelProperty(value = "生效日期" ,example = "2018-04-16")
    private LocalDate lifeEndDate;

    @JsonFormat(pattern="yyyy-MM-dd",timezone = "GMT+8")
    @DateTimeFormat(pattern="yyyy-MM-dd")
    @ApiModelProperty(value = "失效日期" ,example = "2018-04-16")
    private LocalDate lifeStartDate;

    @Max(value = 30,message="说明最大长度为：30")
    @NotNull
    private String remark;

    @Max(value = 30,message="供应商最大长度为：30")
    @NotNull
    private String supplier;

    @Max(value = 30,message="供应商电话最大长度为：30")
    @NotNull
    private String supplierTel;

    @ApiModelProperty(value = "创建者")
    private Long createUser;

    @ApiModelProperty(value = "创建时间")
    private Date createTime;

    @ApiModelProperty(value = "更新时间")
    private Date updateTime;

    @ApiModelProperty(value = "更新者")
    private Long updateUser;
    //状态
    private Integer adStatus;
    @ApiModelProperty(value = "平日出厂价")
    private BigDecimal workdayFactoryPrice;
    @ApiModelProperty(value = "周末出厂价") 
    private BigDecimal weekendFactoryPrice;
    @ApiModelProperty(value = "节假日出厂价 ")
    private BigDecimal festivalFactoryPrice;
    
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
}