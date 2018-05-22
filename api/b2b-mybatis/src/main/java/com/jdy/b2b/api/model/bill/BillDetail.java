package com.jdy.b2b.api.model.bill;

import java.util.Date;

public class BillDetail {
    private Long id;

    private Long dbBillId;

    private Long dbOrderPayId;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    private Long bBuyerCompanyId;

    private String bBuyerCompanyName;

    private Long bBuyerId;

    private String bBuyerName;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDbBillId() {
        return dbBillId;
    }

    public void setDbBillId(Long dbBillId) {
        this.dbBillId = dbBillId;
    }

    public Long getDbOrderPayId() {
        return dbOrderPayId;
    }

    public void setDbOrderPayId(Long dbOrderPayId) {
        this.dbOrderPayId = dbOrderPayId;
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

    public Long getbBuyerCompanyId() {
        return bBuyerCompanyId;
    }

    public void setbBuyerCompanyId(Long bBuyerCompanyId) {
        this.bBuyerCompanyId = bBuyerCompanyId;
    }

    public String getbBuyerCompanyName() {
        return bBuyerCompanyName;
    }

    public void setbBuyerCompanyName(String bBuyerCompanyName) {
        this.bBuyerCompanyName = bBuyerCompanyName;
    }

    public Long getbBuyerId() {
        return bBuyerId;
    }

    public void setbBuyerId(Long bBuyerId) {
        this.bBuyerId = bBuyerId;
    }

    public String getbBuyerName() {
        return bBuyerName;
    }

    public void setbBuyerName(String bBuyerName) {
        this.bBuyerName = bBuyerName;
    }
}