package com.jdy.b2b.api.model;

import com.jdy.b2b.api.common.BaseVO;

import java.math.BigDecimal;
import java.util.Date;

public class OrderTourist extends BaseVO {
    private Long id;

    private Long otOrderId;

    private Long otTicketId;

    private Integer otTicketType;

    private Integer otType;

    private String otName;

    private String otPhone;

    private Integer otLicenceType;

    private String otLincese;

    private Integer otRep;

    private Long otLeaveId;

    private Byte otLeaveType;

    private BigDecimal otLeavePrice;

    private Long otReturnId;

    private Byte otReturnType;

    private BigDecimal otReturnPrice;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    private Integer tAdultNum;//成人数

    private Integer tChildNum;//  儿童数
    private Integer otStatus;//游客状态 0: 有效 1 :无效
    private Integer otExtStatus;//0-正常，1-退票，2-改签

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOtOrderId() {
        return otOrderId;
    }

    public void setOtOrderId(Long otOrderId) {
        this.otOrderId = otOrderId;
    }

    public Long getOtTicketId() {
        return otTicketId;
    }

    public void setOtTicketId(Long otTicketId) {
        this.otTicketId = otTicketId;
    }

    public Integer getOtTicketType() {
        return otTicketType;
    }

    public void setOtTicketType(Integer otTicketType) {
        this.otTicketType = otTicketType;
    }

    public Integer getOtType() {
        return otType;
    }

    public void setOtType(Integer otType) {
        this.otType = otType;
    }

    public String getOtName() {
        return otName;
    }

    public void setOtName(String otName) {
        this.otName = otName == null ? null : otName.trim();
    }

    public String getOtPhone() {
        return otPhone;
    }

    public void setOtPhone(String otPhone) {
        this.otPhone = otPhone == null ? null : otPhone.trim();
    }

    public Integer getOtLicenceType() {
        return otLicenceType;
    }

    public void setOtLicenceType(Integer otLicenceType) {
        this.otLicenceType = otLicenceType;
    }

    public String getOtLincese() {
        return otLincese;
    }

    public void setOtLincese(String otLincese) {
        this.otLincese = otLincese == null ? null : otLincese.trim();
    }

    public Long getOtLeaveId() {
        return otLeaveId;
    }

    public void setOtLeaveId(Long otLeaveId) {
        this.otLeaveId = otLeaveId;
    }

    public Byte getOtLeaveType() {
        return otLeaveType;
    }

    public void setOtLeaveType(Byte otLeaveType) {
        this.otLeaveType = otLeaveType;
    }

    public BigDecimal getOtLeavePrice() {
        return otLeavePrice;
    }

    public void setOtLeavePrice(BigDecimal otLeavePrice) {
        this.otLeavePrice = otLeavePrice;
    }

    public Long getOtReturnId() {
        return otReturnId;
    }

    public void setOtReturnId(Long otReturnId) {
        this.otReturnId = otReturnId;
    }

    public Byte getOtReturnType() {
        return otReturnType;
    }

    public void setOtReturnType(Byte otReturnType) {
        this.otReturnType = otReturnType;
    }

    public BigDecimal getOtReturnPrice() {
        return otReturnPrice;
    }

    public void setOtReturnPrice(BigDecimal otReturnPrice) {
        this.otReturnPrice = otReturnPrice;
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

    public Integer getOtRep() {
        return otRep;
    }

    public void setOtRep(Integer otRep) {
        this.otRep = otRep;
    }

	@Override
	public String toString() {
		return "OrderTourist {id:" + id + ", otOrderId:" + otOrderId
				+ ", otTicketId:" + otTicketId + ", otTicketType:"
				+ otTicketType + ", otType:" + otType + ", otName:" + otName
				+ ", otPhone:" + otPhone + ", otLicenceType:" + otLicenceType
				+ ", otLincese:" + otLincese + ", otRep:" + otRep
				+ ", otLeaveId:" + otLeaveId + ", otLeaveType:" + otLeaveType
				+ ", otLeavePrice:" + otLeavePrice + ", otReturnId:"
				+ otReturnId + ", otReturnType:" + otReturnType
				+ ", otReturnPrice:" + otReturnPrice + ", createTime:"
				+ createTime + ", createUser:" + createUser + ", updateTime:"
				+ updateTime + ", updateUser:" + updateUser + "}";
	}


    public Integer gettAdultNum() {
        return tAdultNum;
    }

    public void settAdultNum(Integer tAdultNum) {
        this.tAdultNum = tAdultNum;
    }

    public Integer gettChildNum() {
        return tChildNum;
    }

    public void settChildNum(Integer tChildNum) {
        this.tChildNum = tChildNum;
    }

    public Integer getOtStatus() {
        return otStatus;
    }

    public void setOtStatus(Integer otStatus) {
        this.otStatus = otStatus;
    }

    public Integer getOtExtStatus() {
        return otExtStatus;
    }

    public void setOtExtStatus(Integer otExtStatus) {
        this.otExtStatus = otExtStatus;
    }
}