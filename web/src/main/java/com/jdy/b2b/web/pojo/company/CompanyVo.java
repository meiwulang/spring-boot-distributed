package com.jdy.b2b.web.pojo.company;

import com.jdy.b2b.web.annotation.Phone;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * Created by dugq on 2017/7/12.
 */
@ApiModel
public class CompanyVo implements Serializable {
    private static final long serialVersionUID = 6565881004614964260L;

    @ApiModelProperty(value = "主键")
    @Null(message = "用户已经存在",groups = Save.class)
    @NotNull(message = "请选择用户",groups = {Update.class,CompanyBasicInfoVo.Attach.class})
    private Long id;

    @ApiModelProperty(value = "父级单位id")
    private Long cPid;

    @ApiModelProperty(value = "单位名称")
    @NotBlank(message = "单位名称不可为空")
    @Length(max = 100,message = "单位名称最多100个字符，或者50个汉子组成")
    private String cName;

    @ApiModelProperty(value = "单位类型：0:供应商,1:分销商,2:管理公司",required = false,dataType = "int")
    private Integer cType;

    @ApiModelProperty(value = "单位地址")
    @NotBlank(message = "单位地址不可为空")
    @Length(max = 100,message = "单位地址最多200个字符，或者100个汉子组成")
    private String cAddress;

    @ApiModelProperty(value = "单位编号")
    @NotBlank(message = "编号不可为空")
    @Length(max = 20,message = "单位编号最多20个字符")
    private String cNo;

    @ApiModelProperty(value = "传真")
    private String cFax;

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
    @Length(max = 100,message = "负责人姓名最多10个字符，或者5个汉子组成")
    private String cChargeName;

    @ApiModelProperty(value = "手机号码")
    @Phone
    private String cTel;

    @ApiModelProperty(value = "联系电话")
    private String cPhone;

    @ApiModelProperty(value = "单位介绍")
    @Length(max = 2000,message="单位介绍最多2000字符，或者1000个汉子")
    private String cIntroduce;



    @ApiModelProperty(value = "电子印章图片地址")
    private String cSeal;


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
    @NotNull(message = "是否独立结算可不为空")
    private Boolean cSettlement;





    @ApiModelProperty(value = "logo地址")
    @NotNull(groups = {CompanyBasicInfoVo.Attach.class},message = "logo不可为空")
    @Length(groups = {CompanyBasicInfoVo.Attach.class},max = 255,message = "logo地址不可超过255个字符")
    private String cLogo;


    @ApiModelProperty(value = "身份证编号")
    @NotNull(groups = {CompanyBasicInfoVo.Attach.class},message = "身份证不可为空")
    @Length(groups = {CompanyBasicInfoVo.Attach.class},max = 45,message = "身份证编号不可超过45个字符")
    private String cIdcard;

    @ApiModelProperty(value = "身份证正面图片地址")
    @NotNull(groups = {CompanyBasicInfoVo.Attach.class},message = "身份证正面不可为空")
    @Length(groups = {CompanyBasicInfoVo.Attach.class},max = 255,message = "身份证正面地址不可超过255个字符")
    private String cIdcardFront;

    @ApiModelProperty(value = "身份证反面图片地址")
    @NotNull(groups = {CompanyBasicInfoVo.Attach.class},message = "身份证反面不可为空")
    @Length(groups = {CompanyBasicInfoVo.Attach.class},max = 255,message = "身份证反面地址不可超过255个字符")
    private String cIdcardBack;



    @ApiModelProperty(value = "营业执照编号")
    @Length(max = 100,message = "营业执照最多50个字符",groups = {CompanyBasicInfoVo.Attach.class})
    private String cLicenseCode;

    @ApiModelProperty(value = "logo图片地址")
    @NotNull(groups = {CompanyBasicInfoVo.Attach.class},message = "logo不可为空")
    @Length(groups = {CompanyBasicInfoVo.Attach.class},max = 45,message = "营业执照编号不可超过455个字符")
    private String cLicense;



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


    public String getcSeal() {
        return cSeal;
    }

    public void setcSeal(String cSeal) {
        this.cSeal = cSeal == null ? null : cSeal.trim();
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

    public String getcLogo() {
        return cLogo;
    }

    public void setcLogo(String cLogo) {
        this.cLogo = cLogo;
    }

    public String getcIdcard() {
        return cIdcard;
    }

    public void setcIdcard(String cIdcard) {
        this.cIdcard = cIdcard;
    }

    public String getcIdcardFront() {
        return cIdcardFront;
    }

    public void setcIdcardFront(String cIdcardFront) {
        this.cIdcardFront = cIdcardFront;
    }

    public String getcIdcardBack() {
        return cIdcardBack;
    }

    public void setcIdcardBack(String cIdcardBack) {
        this.cIdcardBack = cIdcardBack;
    }

    public String getcLicenseCode() {
        return cLicenseCode;
    }

    public void setcLicenseCode(String cLicenseCode) {
        this.cLicenseCode = cLicenseCode;
    }

    public String getcLicense() {
        return cLicense;
    }

    public void setcLicense(String cLicense) {
        this.cLicense = cLicense;
    }

}

