package com.jdy.b2b.web.pojo.order;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/19 13:56
 */
@ApiModel(description = "新增订单游客信息dto")
public class OrderAddTouristDTO extends BaseVO {

    @NotNull
    @ApiModelProperty(value = "票记录ID")
    private Long otTicketId;

    @ApiModelProperty(value = "子票ID")
    private Long subTicketId;

    @NotNull
    @Range(min = 0, max = 1)
    @ApiModelProperty(value = "票类型0:单票 1:套票")
    private Integer otTicketType;

    @NotNull
    @Range(min = 0, max = 1)
    @ApiModelProperty(value = "票价类型 0:成人票 1:儿童票")
    private Integer otType;

    @NotNull
    @ApiModelProperty(value = "游客姓名")
    private String otName;

    @ApiModelProperty(value = "游客电话")
    private String otPhone;

    @NotNull
    @Range(min = 0, max = 8)
    @ApiModelProperty(value = "证件类型 0:身份证 1:护照 2:军官证 3:回乡证 4:台胞证 5:国际海员证 6:港澳通行证 7:赴台证 8:其他")
    private Integer otLicenceType;

    @NotNull
    @ApiModelProperty(value = "证件号")
    private String otLincese;

    @ApiModelProperty(value = "是否游客代表：0-否，1-是")
    private Integer otRep;

    @ApiModelProperty(value = "出发去程id(班车站和顺路站传shuttle_bus记录id)")
    @NotNull
    private Long otLeaveId;

    @ApiModelProperty(value = "去程区分 0:始发站 1:顺路站 2:班车站")
    @NotNull
    private Byte otLeaveType;

    @ApiModelProperty(value = "去程接送费")
    @NotNull
    @Min(0)
    private BigDecimal otLeavePrice;

    @NotNull
    @ApiModelProperty(value = "回程站点id(班车站和顺路站传shuttle_bus记录id)")
    private Long otReturnId;

    @ApiModelProperty(value = "回程区分 0:始发站 1:顺路站 2:班车站")
    @NotNull
    private Byte otReturnType;

    @ApiModelProperty(value = "回程接送费")
    @NotNull
    @Min(0)
    private BigDecimal otReturnPrice;

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
        this.otName = otName;
    }

    public String getOtPhone() {
        return otPhone;
    }

    public void setOtPhone(String otPhone) {
        this.otPhone = otPhone;
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
        this.otLincese = otLincese;
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

    public BigDecimal getOtLeavePrice() {
        return otLeavePrice;
    }

    public void setOtLeavePrice(BigDecimal otLeavePrice) {
        this.otLeavePrice = otLeavePrice;
    }

    public BigDecimal getOtReturnPrice() {
        return otReturnPrice;
    }

    public void setOtReturnPrice(BigDecimal otReturnPrice) {
        this.otReturnPrice = otReturnPrice;
    }

    public Long getSubTicketId() {
        return subTicketId;
    }

    public void setSubTicketId(Long subTicketId) {
        this.subTicketId = subTicketId;
    }

    public Integer getOtRep() {
        return otRep;
    }

    public void setOtRep(Integer otRep) {
        this.otRep = otRep;
    }
}

