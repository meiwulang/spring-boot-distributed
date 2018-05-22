package com.jdy.b2b.api.model.designProject;

import java.util.Date;

import com.jdy.b2b.api.common.BaseVO;

public class DesignProject extends BaseVO {
    private Long designId;
    private Long operationType;
    private Long id;

    private Long rId;

    private Long dpCompanyId;

    private String dpLineName;

    private Date createTime;

    private Date updateTime;
    private Integer  status;

    private Long productId;

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public Long getDesignId() {
		return designId;
	}

	public void setDesignId(Long designId) {
		this.designId = designId;
	}

	public Long getOperationType() {
		return operationType;
	}

	public void setOperationType(Long operationType) {
		this.operationType = operationType;
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
        this.dpLineName = dpLineName == null ? null : dpLineName.trim();
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
}