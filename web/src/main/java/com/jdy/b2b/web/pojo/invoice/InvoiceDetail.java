package com.jdy.b2b.web.pojo.invoice;

import java.util.Date;

public class InvoiceDetail {
    private Long id;

    private Long idInvoiceId;

    private Long idOrderId;

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

    public Long getIdInvoiceId() {
        return idInvoiceId;
    }

    public void setIdInvoiceId(Long idInvoiceId) {
        this.idInvoiceId = idInvoiceId;
    }

    public Long getIdOrderId() {
        return idOrderId;
    }

    public void setIdOrderId(Long idOrderId) {
        this.idOrderId = idOrderId;
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