package com.jdy.b2b.web.pojo.require;

import javax.validation.constraints.NotNull;

import com.jdy.b2b.web.annotation.EnumValue;
import com.jdy.b2b.web.util.BaseVO;

import io.swagger.annotations.ApiModelProperty;

public class DesignProject extends BaseVO {
	@ApiModelProperty("方案编号")
    private Long id;
    @NotNull(message="定制id不能为空")
    @ApiModelProperty("定制id")
    private Long designId;
    @NotNull(message="操作类型不能为空")
    @EnumValue(enums={"0","1"})
    @ApiModelProperty("操作类型,0:保存，1：提交")
    private Long operationType;
    @NotNull(message="需求id不能为空")
    @ApiModelProperty("需求id")
    private Long rId;

    @ApiModelProperty(hidden=true)
    private Long dpCompanyId;

    @NotNull(message="线路名称不能为空")
    @ApiModelProperty("线路名称")
    private String dpLineName;
    @ApiModelProperty("订单报价")
    private String dpOrderAmount;

    @ApiModelProperty("核心景点")
    private String dpCoreScenic;

    @ApiModelProperty("住宿标准")
    private String dpStandardAccommodation;

    @ApiModelProperty("最低成团人数")
    private String dpMinClusteringNum;

    public Long getDesignId() {
		return designId;
	}

	public void setDesignId(Long designId) {
		this.designId = designId;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getrId() {
		return rId;
	}

	public void setrId(Long rId) {
		this.rId = rId;
	}

	public Long getDpCompanyId() {
		return dpCompanyId;
	}

	public void setDpCompanyId(Long dpCompanyId) {
		this.dpCompanyId = dpCompanyId;
	}

	public String getDpLineName() {
		return dpLineName;
	}

	public void setDpLineName(String dpLineName) {
		this.dpLineName = dpLineName;
	}

	public String getDpOrderAmount() {
        return dpOrderAmount;
    }

    public void setDpOrderAmount(String dpOrderAmount) {
        this.dpOrderAmount = dpOrderAmount == null ? null : dpOrderAmount.trim();
    }

    public String getDpCoreScenic() {
        return dpCoreScenic;
    }

    public void setDpCoreScenic(String dpCoreScenic) {
        this.dpCoreScenic = dpCoreScenic == null ? null : dpCoreScenic.trim();
    }

    public String getDpStandardAccommodation() {
        return dpStandardAccommodation;
    }

    public void setDpStandardAccommodation(String dpStandardAccommodation) {
        this.dpStandardAccommodation = dpStandardAccommodation == null ? null : dpStandardAccommodation.trim();
    }

    public String getDpMinClusteringNum() {
        return dpMinClusteringNum;
    }

    public void setDpMinClusteringNum(String dpMinClusteringNum) {
        this.dpMinClusteringNum = dpMinClusteringNum == null ? null : dpMinClusteringNum.trim();
    }

	public Long getOperationType() {
		return operationType;
	}

	public void setOperationType(Long operationType) {
		this.operationType = operationType;
	}
}