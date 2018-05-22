package com.jdy.b2b.web.pojo.orderTouristConfirm;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Date;

@ApiModel
public class OrderTouristConfirm {
    private Long id;

    @ApiModelProperty(value = "原游客id")
    @NotNull
    private Long touristId;

    @ApiModelProperty(value = "对应订单ID")
    @NotNull
    private Long otOrderId;

    @ApiModelProperty(value = "票种ID")
    private Long otTicketId;

    @ApiModelProperty(value = "票类型0:单票 1:套票")
    @NotNull
    private Integer otTicketType;

    @ApiModelProperty(value = "票价类型 0:成人票 1:儿童票")
    @NotNull
    private Integer otType;

    @Max(value = 45,message="游客姓名最大长度为：45")
    @NotNull
    private String otName;

    @Max(value = 45,message="最大长度为：45")
    private String otPhone;

    @ApiModelProperty(value = "证件类型 0:身份证 1:护照 2:军官证 3:回乡证 4:台胞证 5:国际海员证 6:港澳通行证 7:赴台证 8:其他")
    @NotNull
    private Integer otLicenceType;

    @Max(value = 45,message="证件信息最大长度为：45")
    private String otLincese;

    @ApiModelProperty(value = "是否游客代表:0-否，1-是")
    private Integer otRep;

    @ApiModelProperty(value = "出发站id（如果是始发站则指向departure，如果不是则指向shuttle_bus）")
    @NotNull
    private Long otLeaveId;

    @ApiModelProperty(value = "去程区分 类型 0:始发站 1:顺路站 2:班车站")
    @NotNull
    private Byte otLeaveType;

    private BigDecimal otLeavePrice;

    @ApiModelProperty(value = "返回站id（如果是始发站则指向departure，如果不是则指向shuttle_bus）")
    @NotNull
    private Long otReturnId;

    @ApiModelProperty(value = "返程区分 类型 0:始发站 1:顺路站 2:班车站")
    @NotNull
    private Byte otReturnType;

    private BigDecimal otReturnPrice;

    @ApiModelProperty(value = "游客状态 0: 有效 1 :无效")
    private Integer otStatus;

    @ApiModelProperty(value = "0-未确认，1-退票，2-改签 ，3- 已经确认")
    private Integer otExtStatus;

    @Max(value = 20,message="取消原因最大长度为：20")
    private String otCancelReason;

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

    public Long getTouristId() {
        return touristId;
    }

    public void setTouristId(Long touristId) {
        this.touristId = touristId;
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

    public Integer getOtRep() {
        return otRep;
    }

    public void setOtRep(Integer otRep) {
        this.otRep = otRep;
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

    public String getOtCancelReason() {
        return otCancelReason;
    }

    public void setOtCancelReason(String otCancelReason) {
        this.otCancelReason = otCancelReason == null ? null : otCancelReason.trim();
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