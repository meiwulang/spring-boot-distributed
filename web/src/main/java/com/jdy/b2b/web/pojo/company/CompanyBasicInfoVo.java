package com.jdy.b2b.web.pojo.company;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jdy.b2b.web.annotation.Phone;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;

/**
 * Created by dugq on 2017/7/12.
 */
@ApiModel
public class CompanyBasicInfoVo implements Serializable {
    private static final long serialVersionUID = 6565881004614964260L;

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private  Date endDate;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private  Date startDate;

    @ApiModelProperty(value = "主键")
//    @Null(message = "用户已经存在",groups = Save.class)
    @NotNull(message = "请选择单位",groups = {Update.class,Attach.class})
    private Long id;

    @ApiModelProperty(value = "父级单位id")
    private Long cPid;

    @ApiModelProperty(value = "单位名称")
    @NotBlank(message = "单位名称不可为空")
    @Length(max = 20,message = "单位名称最多20个字")
    private String cName;

    @ApiModelProperty(value = "单位类型：0:供应商,1:分销商,2:管理公司",required = false,dataType = "int")
    private Integer cType;

    @ApiModelProperty(value = "单位地址")
    @NotBlank(message = "单位地址不可为空")
    @Length(max = 50,message = "单位地址最多50个字")
    private String cAddress;

    @ApiModelProperty(value = "单位编号")
    @NotBlank(message = "编号不可为空")
    @Length(max = 20,message = "单位编号最多20个字")
    private String cNo;

    @ApiModelProperty(value = "传真")
    private String cFax;

    @ApiModelProperty(value = "服务电话")
    private String cSevicePhone;

    @ApiModelProperty(value = "国家")
    private String cCountry;

    @ApiModelProperty(value = "省")
    @NotBlank(message = "单位省份不可为空")
    private String cProvince;

    @ApiModelProperty(value = "城市")
    @NotBlank(message = "单位城市不可为空")
    private String cCity;

    @ApiModelProperty(value = "县区")
    @NotBlank(message = "单位区县不可为空")
    private String cArea;



    @ApiModelProperty(value = "负责人姓名")
    @NotBlank(message = "负责人姓名不可为空")
    @Length(max = 45,message = "负责人姓名最多45个字")
    private String cChargeName;

    @ApiModelProperty(value = "手机号码")
    @Phone
    private String cTel;

    @ApiModelProperty(value = "联系电话")
    private String cPhone;

    @ApiModelProperty(value = "单位介绍")
    @Length(max = 2000,message="单位介绍最多2000字")
    private String cIntroduce;


    @ApiModelProperty(value = "是否开户 (0:未开户), (1,付款账户), (2,收款账户),(3,双开);",allowableValues = "0,1,2,3",hidden = true)
    private Integer cOpenAccount;

    @ApiModelProperty(value = "单位状态：状态 0:待审核 1:审核通过 2:审核不通过 3： del",allowableValues = "0,1,2,3",hidden = true)
    private Integer cStatus;

    @ApiModelProperty(value = "创建时间",hidden = true)
    private Date createTime;

    @ApiModelProperty(value = "创建人",hidden = true)
    private Long createUser;

    @ApiModelProperty(value = "跟新时间",hidden = true)
    private Date updateTime;
    @ApiModelProperty(value = "跟新人",hidden = true)
    private Long updateUser;

    @ApiModelProperty(value = "是否独立结算",allowableValues = "true,false")
    private Boolean cSettlement = true;

    @ApiModelProperty(value = "产品类型",notes = "id的字符串，多个时以逗号隔开。10:周边短线,11:国内长线,20:出境旅游,30:邮轮,40:特色游,50自助游")
    private String cProductType;
    @ApiModelProperty(value = "投放城市",notes="城市名称，多个时用逗号隔开")
    private String sets;

    private Integer searchType;

    public Integer getSearchType() {
        return searchType;
    }

    public void setSearchType(Integer searchType) {
        this.searchType = searchType;
    }

    public String getcSevicePhone() {
        return cSevicePhone;
    }

    public void setcSevicePhone(String cSevicePhone) {
        this.cSevicePhone = cSevicePhone;
    }

    public String getcProductType() {
        return cProductType;
    }

    public void setcProductType(String cProductType) {
        this.cProductType = cProductType;
    }

    public String getSets() {
        return sets;
    }

    public void setSets(String sets) {
        this.sets = sets;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getcPid() {
        return cPid;
    }

    public void setcPid(Long cPid) {
        this.cPid = cPid;
    }

    public String getcName() {
        return cName;
    }

    public void setcName(String cName) {
        this.cName = cName == null ? null : cName.trim();
    }

    public Integer getcType() {
        return cType;
    }

    public void setcType(Integer cType) {
        this.cType = cType;
    }

    public String getcAddress() {
        return cAddress;
    }

    public void setcAddress(String cAddress) {
        this.cAddress = cAddress == null ? null : cAddress.trim();
    }

    public String getcNo() {
        return cNo;
    }

    public void setcNo(String cNo) {
        this.cNo = cNo == null ? null : cNo.trim();
    }

    public String getcFax() {
        return cFax;
    }

    public void setcFax(String cFax) {
        this.cFax = cFax == null ? null : cFax.trim();
    }

    public String getcCountry() {
        return cCountry;
    }

    public void setcCountry(String cCountry) {
        this.cCountry = cCountry == null ? null : cCountry.trim();
    }

    public String getcProvince() {
        return cProvince;
    }

    public void setcProvince(String cProvince) {
        this.cProvince = cProvince == null ? null : cProvince.trim();
    }

    public String getcCity() {
        return cCity;
    }

    public void setcCity(String cCity) {
        this.cCity = cCity == null ? null : cCity.trim();
    }

    public String getcArea() {
        return cArea;
    }

    public void setcArea(String cArea) {
        this.cArea = cArea == null ? null : cArea.trim();
    }


    public String getcChargeName() {
        return cChargeName;
    }

    public void setcChargeName(String cChargeName) {
        this.cChargeName = cChargeName == null ? null : cChargeName.trim();
    }

    public String getcTel() {
        return cTel;
    }

    public void setcTel(String cTel) {
        this.cTel = cTel == null ? null : cTel.trim();
    }

    public String getcPhone() {
        return cPhone;
    }

    public void setcPhone(String cPhone) {
        this.cPhone = cPhone == null ? null : cPhone.trim();
    }

    public String getcIntroduce() {
        return cIntroduce;
    }

    public void setcIntroduce(String cIntroduce) {
        this.cIntroduce = cIntroduce == null ? null : cIntroduce.trim();
    }




    public Boolean getcSettlement() {
        return cSettlement;
    }

    public void setcSettlement(Boolean cSettlement) {
        this.cSettlement = cSettlement;
    }

    public Integer getcOpenAccount() {
        return cOpenAccount;
    }

    public void setcOpenAccount(Integer cOpenAccount) {
        this.cOpenAccount = cOpenAccount;
    }

    public Integer getcStatus() {
        return cStatus;
    }

    public void setcStatus(Integer cStatus) {
        this.cStatus = cStatus;
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

    public interface Attach {}

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }
}

