package com.jdy.b2b.web.pojo.bankManage;


import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

/**
 * Created by yangcheng on 2017/8/31.
 */
@ApiModel
public class BankManageSaveVo extends BaseVO {
    @ApiModelProperty(value = "单位id,同时传递单位名称和简称")
    @NotNull(message = "单位id不能为空")
    private Long bCompanyId;
    @NotNull(message = "单位名称不能为空")
    @ApiModelProperty(value = "单位名称")
    private String bCompanyName;
    @NotNull(message = "单位简称不能为空")
    @ApiModelProperty(value = "单位简称")
    private String bShortName;
    @NotNull(message = "支行名称不能为空")
    @ApiModelProperty(value = "支行名称")
    private String bBankName;
    @NotNull(message = "支行id不能为空")
    @ApiModelProperty(value = "支行id")
    private Long bBbid;
    @NotNull(message = "账户类型不能为空")
    @ApiModelProperty(value = "账户类型 false:对公 true:对私")
    private Boolean bType;
    @ApiModelProperty(value = "持卡人")
    @NotNull(message = "持卡人不能为空")
    private String bBankPeople;
    @ApiModelProperty(value = "银行卡号")
    @NotNull(message = "银行卡号不能为空")
    private String bBankNo;
    @ApiModelProperty(value = "币种",hidden = true)
    private String bCurrency;
    @NotNull(message = "开户证件不能为空")
    @ApiModelProperty(value = "开户证件 0:身份证 1:营业执照")
    @Min(value=0,message = "开户证件最小为0")
    @Max(value=1,message = "开户证件最大为1")
    private Integer bLicenceType;
    @NotNull(message = "证件号码不能为空")
    @ApiModelProperty(value = "证件号码")
    private String bLincese;
    @ApiModelProperty(value = "状态 false:生效 true:无效",hidden = true)
    private Boolean bStatus = false;

    public Long getbCompanyId() {
        return bCompanyId;
    }

    public void setbCompanyId(Long bCompanyId) {
        this.bCompanyId = bCompanyId;
    }

    public String getbCompanyName() {
        return bCompanyName;
    }

    public void setbCompanyName(String bCompanyName) {
        this.bCompanyName = bCompanyName;
    }

    public String getbShortName() {
        return bShortName;
    }

    public void setbShortName(String bShortName) {
        this.bShortName = bShortName;
    }

    public String getbBankName() {
        return bBankName;
    }

    public void setbBankName(String bBankName) {
        this.bBankName = bBankName;
    }

    public Long getbBbid() {
        return bBbid;
    }

    public void setbBbid(Long bBbid) {
        this.bBbid = bBbid;
    }

    public Boolean getbType() {
        return bType;
    }

    public void setbType(Boolean bType) {
        this.bType = bType;
    }

    public String getbBankPeople() {
        return bBankPeople;
    }

    public void setbBankPeople(String bBankPeople) {
        this.bBankPeople = bBankPeople;
    }

    public String getbBankNo() {
        return bBankNo;
    }

    public void setbBankNo(String bBankNo) {
        this.bBankNo = bBankNo;
    }

    public String getbCurrency() {
        return bCurrency;
    }

    public void setbCurrency(String bCurrency) {
        this.bCurrency = bCurrency;
    }

    public Integer getbLicenceType() {
        return bLicenceType;
    }

    public void setbLicenceType(Integer bLicenceType) {
        this.bLicenceType = bLicenceType;
    }

    public String getbLincese() {
        return bLincese;
    }

    public void setbLincese(String bLincese) {
        this.bLincese = bLincese;
    }

    public Boolean getbStatus() {
        return bStatus;
    }

    public void setbStatus(Boolean bStatus) {
        this.bStatus = bStatus;
    }
}
