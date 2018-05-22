package com.jdy.b2b.web.pojo.require;


import com.jdy.b2b.web.annotation.Phone;
import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.Length;
import org.springframework.validation.ValidationUtils;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.util.Date;
@ApiModel
public class RequireSaveVO extends BaseVO {
    @ApiModelProperty(value = "方案id")
    private Long dId;
    @ApiModelProperty(value = "需求编号",hidden = true)
    private String requireNo;
    @ApiModelProperty(value = "公司id",hidden = true)
    private Long rCompanyId;
    @ApiModelProperty(value = "创建时间",hidden = true)
    private Date createTime;

    @Min(value = 0,message = "出游类型最小为0 最大为1")
    @Max(value = 1,message = "出游类型最小为0 最大为1")
    @ApiModelProperty(value = "出游类型 0个人 1企业")
    private Integer rType;
    @Length(max = 50)
    @ApiModelProperty(value = "出发城市名称")
    private String rStartCity;
    @Length(max = 150)
    @ApiModelProperty(value = "多个目的地城市 逗号分隔")
    private String rDestinationCitys;
    @ApiModelProperty(value = "出发时间 头 八位数字")
    private Integer rStartDateHead;
    @ApiModelProperty(value = "出发时间 尾 八位数字")
    private Integer rStartDateTail;
    @ApiModelProperty(value = "出游天数 最少天数")
    private Integer rPlayDaysMin;
    @ApiModelProperty(value = "出游天数 最多天数")
    private Integer rPlayDaysMax;
    @ApiModelProperty(value = "出游成人数")
    private Integer rAdultNum;
    @ApiModelProperty(value = "出游儿童数")
    private Integer rChildNum;
    @ApiModelProperty(value = "出游婴儿数")
    private Integer rBabyNum;
    @ApiModelProperty(value = "人均预算")
    private Integer rPerBudget;
    @Length(max = 80)
    @ApiModelProperty(value = "可选服务 多个服务之间逗号分隔")
    private String rOptionalServices;
    @Length(max = 2000)
    @ApiModelProperty(value = "其他需求")
    private String rOtherRequire;
    @ApiModelProperty(value = "负责人姓名")
    private String rHeadName;
    @Min(value = 0,message = "性别最小为0 最大为1")
    @Max(value = 1,message = "性别最小为0 最大为1")
    @ApiModelProperty(value = "性别 0:男 1:女")
    private Integer rHeadSex;
    @Phone
    @ApiModelProperty(value = "手机号")
    private String rHeadPhone;
    @ApiModelProperty(value = "微信号")
    private String rHeadWx;
    @Email
    @ApiModelProperty(value = "邮箱")
    private String rHeadEmail;



    public Long getdId() {
        return dId;
    }

    public void setdId(Long dId) {
        this.dId = dId;
    }

    public String getRequireNo() {
        return requireNo;
    }

    public void setRequireNo(String requireNo) {
        this.requireNo = requireNo;
    }

    public Long getrCompanyId() {
        return rCompanyId;
    }

    public void setrCompanyId(Long rCompanyId) {
        this.rCompanyId = rCompanyId;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Integer getrType() {
        return rType;
    }

    public void setrType(Integer rType) {
        this.rType = rType;
    }

    public String getrStartCity() {
        return rStartCity;
    }

    public void setrStartCity(String rStartCity) {
        this.rStartCity = rStartCity;
    }

    public String getrDestinationCitys() {
        return rDestinationCitys;
    }

    public void setrDestinationCitys(String rDestinationCitys) {
        this.rDestinationCitys = rDestinationCitys;
    }

    public Integer getrStartDateHead() {
        return rStartDateHead;
    }

    public void setrStartDateHead(Integer rStartDateHead) {
        this.rStartDateHead = rStartDateHead;
    }

    public Integer getrStartDateTail() {
        return rStartDateTail;
    }

    public void setrStartDateTail(Integer rStartDateTail) {
        this.rStartDateTail = rStartDateTail;
    }

    public Integer getrPlayDaysMin() {
        return rPlayDaysMin;
    }

    public void setrPlayDaysMin(Integer rPlayDaysMin) {
        this.rPlayDaysMin = rPlayDaysMin;
    }

    public Integer getrPlayDaysMax() {
        return rPlayDaysMax;
    }

    public void setrPlayDaysMax(Integer rPlayDaysMax) {
        this.rPlayDaysMax = rPlayDaysMax;
    }

    public Integer getrAdultNum() {
        return rAdultNum;
    }

    public void setrAdultNum(Integer rAdultNum) {
        this.rAdultNum = rAdultNum;
    }

    public Integer getrChildNum() {
        return rChildNum;
    }

    public void setrChildNum(Integer rChildNum) {
        this.rChildNum = rChildNum;
    }

    public Integer getrBabyNum() {
        return rBabyNum;
    }

    public void setrBabyNum(Integer rBabyNum) {
        this.rBabyNum = rBabyNum;
    }

    public Integer getrPerBudget() {
        return rPerBudget;
    }

    public void setrPerBudget(Integer rPerBudget) {
        this.rPerBudget = rPerBudget;
    }

    public String getrOptionalServices() {
        return rOptionalServices;
    }

    public void setrOptionalServices(String rOptionalServices) {
        this.rOptionalServices = rOptionalServices;
    }

    public String getrOtherRequire() {
        return rOtherRequire;
    }

    public void setrOtherRequire(String rOtherRequire) {
        this.rOtherRequire = rOtherRequire;
    }

    public String getrHeadName() {
        return rHeadName;
    }

    public void setrHeadName(String rHeadName) {
        this.rHeadName = rHeadName;
    }

    public Integer getrHeadSex() {
        return rHeadSex;
    }

    public void setrHeadSex(Integer rHeadSex) {
        this.rHeadSex = rHeadSex;
    }

    public String getrHeadPhone() {
        return rHeadPhone;
    }

    public void setrHeadPhone(String rHeadPhone) {
        this.rHeadPhone = rHeadPhone;
    }

    public String getrHeadWx() {
        return rHeadWx;
    }

    public void setrHeadWx(String rHeadWx) {
        this.rHeadWx = rHeadWx;
    }

    public String getrHeadEmail() {
        return rHeadEmail;
    }

    public void setrHeadEmail(String rHeadEmail) {
        this.rHeadEmail = rHeadEmail;
    }
}