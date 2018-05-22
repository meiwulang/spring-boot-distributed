package com.jdy.b2b.web.pojo.company;

import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.Pattern;
import java.io.Serializable;

/**
 * Created by dugq on 2017/8/3.
 */
@ApiModel
public class CompanyAttachInfoVo implements Serializable {
    private static final long serialVersionUID = 9061315278181807853L;
    @ApiModelProperty(value = "主键")
    @Null(message = "用户已经存在",groups = Save.class)
    @NotNull(message = "请选择用户",groups = {Update.class,CompanyBasicInfoVo.Attach.class})
    private Long id;

    @ApiModelProperty(value = "电子印章图片地址")
    private String cSeal;


    @ApiModelProperty(value = "logo地址")
//    @NotNull(groups = {CompanyBasicInfoVo.Attach.class},message = "logo不可为空")
    @Length(groups = {CompanyBasicInfoVo.Attach.class},max = 255,message = "logo地址不可超过255个字")
    private String cLogo;


    @ApiModelProperty(value = "身份证编号")
//    @NotNull(groups = {CompanyBasicInfoVo.Attach.class},message = "身份证不可为空")
    @Pattern(regexp = "^$|^(^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$)|(^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])((\\d{4})|\\d{3}[Xx])$)$",message = "请输入合法的身份证号",groups = {CompanyBasicInfoVo.Attach.class})
//    @Length(groups = {CompanyBasicInfoVo.Attach.class},max = 45,message = "身份证编号不可超过45个字")
    private String cIdcard;

    @ApiModelProperty(value = "身份证正面图片地址")
//    @NotNull(groups = {CompanyBasicInfoVo.Attach.class},message = "身份证正面不可为空")
    @Length(groups = {CompanyBasicInfoVo.Attach.class},max = 255,message = "身份证正面地址不可超过255个字")
    private String cIdcardFront;

    @ApiModelProperty(value = "身份证反面图片地址")
//    @NotNull(groups = {CompanyBasicInfoVo.Attach.class},message = "身份证反面不可为空")
    @Length(groups = {CompanyBasicInfoVo.Attach.class},max = 255,message = "身份证反面地址不可超过255个字")
    private String cIdcardBack;



    @ApiModelProperty(value = "营业执照编号")
    @Length(max = 50,message = "营业执照最多50个字符",groups = {CompanyBasicInfoVo.Attach.class})
    private String cLicenseCode;

    @ApiModelProperty(value = "营业执照图片地址")
//    @NotNull(groups = {CompanyBasicInfoVo.Attach.class},message = "营业执照不可为空")
    @Length(groups = {CompanyBasicInfoVo.Attach.class},max = 455,message = "营业执照图片地址不可超过455个字")
    private String cLicense;


    public String getcSeal() {
        return cSeal;
    }

    public void setcSeal(String cSeal) {
        this.cSeal = cSeal == null ? null : cSeal.trim();
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
