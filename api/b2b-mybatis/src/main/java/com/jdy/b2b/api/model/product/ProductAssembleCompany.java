package com.jdy.b2b.api.model.product;

import java.util.Date;

public class ProductAssembleCompany {
    private Long id;

    private Long productId;

    private Long companyId;

    private Byte assembleStatus;

    private Long assembleUser;

    private Long assembleLinkUser;

    private Date createTime;

    private Long createUser;

    public ProductAssembleCompany() {
    }

    public ProductAssembleCompany(Long productId, Long companyId) {
        this.productId = productId;
        this.companyId = companyId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Byte getAssembleStatus() {
        return assembleStatus;
    }

    public void setAssembleStatus(Byte assembleStatus) {
        this.assembleStatus = assembleStatus;
    }

    public Long getAssembleUser() {
        return assembleUser;
    }

    public void setAssembleUser(Long assembleUser) {
        this.assembleUser = assembleUser;
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

    public Long getAssembleLinkUser() {
        return assembleLinkUser;
    }

    public void setAssembleLinkUser(Long assembleLinkUser) {
        this.assembleLinkUser = assembleLinkUser;
    }
}