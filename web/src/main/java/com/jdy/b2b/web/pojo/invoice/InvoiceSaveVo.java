package com.jdy.b2b.web.pojo.invoice;


import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Save;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
@ApiModel
public class InvoiceSaveVo  extends BaseVO{
    @ApiModelProperty(value="供应商名称")
    @NotNull(message = "供应商名称不能为空")
    private String iSupplierName;
    @ApiModelProperty(value="发票抬头,即分销商名称")
    @NotNull(message = "发票抬头不能为空")
    private String iInvoiceTitle;
    @ApiModelProperty(value="开票金额")
    @NotNull(message = "开票金额不能为空")
    @Min(value=0,message = "开票金额不能为负")
    private BigDecimal iAmount;
    @ApiModelProperty(value="收取方式")
    @NotNull(message = "收取方式不能为空")
    private Integer iReceiveMethod;
    @ApiModelProperty(value="开票项目")
    @NotNull(message = "开票项目不能为空")
    private Integer iType;
    @ApiModelProperty(value="分销商联系人")
    private String iBuyContacts;
    @ApiModelProperty(value="分销商电话")
    @Pattern(regexp = "(?:(\\(\\+?86\\))(0[0-9]{2,3}\\-?)?([2-9][0-9]{6,7})+(\\-[0-9]{1,4})?)|(?:(86-?)?(0[0-9]{2,3}\\-?)?([2-9][0-9]{6,7})+(\\-[0-9]{1,4})?)|^(1[34578]\\d{9})?$", groups = { Save.class},message = "手机号不符合规则")
    private String iBuyPhone;
    @ApiModelProperty(value="地址")
    @Length(max = 250,message = "地址不得超过250个字")
    private String iAddress;
    @ApiModelProperty(value="申请备注")
    @Length(max = 250,message = "申请备注不得超过250个字")
    private String iApplyRemark;
    @ApiModelProperty(value="供应商id")
    @NotNull(message = "供应商id不能为空")
    private Long iSupplierId;
    @ApiModelProperty(value="分销商id")
    @NotNull(message = "分销商id不能为空")
    private Long iBuyerId;
    @ApiModelProperty(value="发票所选订单id集合")
    @Valid
    @NotEmpty(message = "发票所选订单id集合")
    private List<Long> idList = new ArrayList<Long>();

    public String getiSupplierName() {
        return iSupplierName;
    }

    public void setiSupplierName(String iSupplierName) {
        this.iSupplierName = iSupplierName;
    }

    public String getiInvoiceTitle() {
        return iInvoiceTitle;
    }

    public void setiInvoiceTitle(String iInvoiceTitle) {
        this.iInvoiceTitle = iInvoiceTitle;
    }

    public BigDecimal getiAmount() {
        return iAmount;
    }

    public void setiAmount(BigDecimal iAmount) {
        this.iAmount = iAmount;
    }

    public Integer getiReceiveMethod() {
        return iReceiveMethod;
    }

    public void setiReceiveMethod(Integer iReceiveMethod) {
        this.iReceiveMethod = iReceiveMethod;
    }

    public Integer getiType() {
        return iType;
    }

    public void setiType(Integer iType) {
        this.iType = iType;
    }

    public String getiBuyContacts() {
        return iBuyContacts;
    }

    public void setiBuyContacts(String iBuyContacts) {
        this.iBuyContacts = iBuyContacts;
    }

    public String getiBuyPhone() {
        return iBuyPhone;
    }

    public void setiBuyPhone(String iBuyPhone) {
        this.iBuyPhone = iBuyPhone;
    }

    public String getiAddress() {
        return iAddress;
    }

    public void setiAddress(String iAddress) {
        this.iAddress = iAddress;
    }

    public String getiApplyRemark() {
        return iApplyRemark;
    }

    public void setiApplyRemark(String iApplyRemark) {
        this.iApplyRemark = iApplyRemark;
    }

    public Long getiSupplierId() {
        return iSupplierId;
    }

    public void setiSupplierId(Long iSupplierId) {
        this.iSupplierId = iSupplierId;
    }

    public Long getiBuyerId() {
        return iBuyerId;
    }

    public void setiBuyerId(Long iBuyerId) {
        this.iBuyerId = iBuyerId;
    }

    public List<Long> getIdList() {
        return idList;
    }

    public void setIdList(List<Long> idList) {
        this.idList = idList;
    }
}