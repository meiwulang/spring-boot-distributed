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
public class BankManageUpdateVo extends BaseVO {
    @NotNull(message = "id不能为空")
    @ApiModelProperty(value = "银行卡id")
    private Long id;
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
    @NotNull(message = "开户证件不能为空")
    @ApiModelProperty(value = "开户证件 0:身份证 1:营业执照")
    @Min(value=0,message = "开户证件最小为0")
    @Max(value=1,message = "开户证件最大为1")
    private Integer bLicenceType;
    @NotNull(message = "证件号码不能为空")
    @ApiModelProperty(value = "证件号码")
    private String bLincese;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
}
