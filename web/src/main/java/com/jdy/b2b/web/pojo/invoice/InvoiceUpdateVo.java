package com.jdy.b2b.web.pojo.invoice;


import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
@ApiModel
public class InvoiceUpdateVo extends BaseVO{
    @ApiModelProperty(value="发票id")
    @NotNull(message = "发票id不能为空")
    private Long id;
    @ApiModelProperty(value="开票项目")
    @NotNull(message = "不能为空")
    private Integer iType;
    @ApiModelProperty(value="发票号")
    @NotNull(message = "不能为空")
    private String iInvoiceNo;
    @ApiModelProperty(value="供应商联系人")
    private String iSupplierContacts;
    @ApiModelProperty(value="供应商电话")
    private String iSupplierPhone;
    @ApiModelProperty(value="处理备注")
    @Length(max = 250,message = "处理备注超过250个字")
    private String iHandleRemark;
    @ApiModelProperty(value="快递公司名称")
    private String iExpressCompany;
    @ApiModelProperty(value="快递单号")
    private String iExpressNo;
    @ApiModelProperty(value="付费方式")
    private Integer iExpressMethod;
    @ApiModelProperty(value="快递金额")
    @Min(value=0,message = "金额不能为负")
    private BigDecimal iExpressAmount;

    public Integer getiType() {
        return iType;
    }

    public void setiType(Integer iType) {
        this.iType = iType;
    }

    public String getiInvoiceNo() {
        return iInvoiceNo;
    }

    public void setiInvoiceNo(String iInvoiceNo) {
        this.iInvoiceNo = iInvoiceNo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getiSupplierContacts() {
        return iSupplierContacts;
    }

    public void setiSupplierContacts(String iSupplierContacts) {
        this.iSupplierContacts = iSupplierContacts;
    }

    public String getiSupplierPhone() {
        return iSupplierPhone;
    }

    public void setiSupplierPhone(String iSupplierPhone) {
        this.iSupplierPhone = iSupplierPhone;
    }

    public String getiHandleRemark() {
        return iHandleRemark;
    }

    public void setiHandleRemark(String iHandleRemark) {
        this.iHandleRemark = iHandleRemark;
    }

    public String getiExpressCompany() {
        return iExpressCompany;
    }

    public void setiExpressCompany(String iExpressCompany) {
        this.iExpressCompany = iExpressCompany;
    }

    public String getiExpressNo() {
        return iExpressNo;
    }

    public void setiExpressNo(String iExpressNo) {
        this.iExpressNo = iExpressNo;
    }

    public Integer getiExpressMethod() {
        return iExpressMethod;
    }

    public void setiExpressMethod(Integer iExpressMethod) {
        this.iExpressMethod = iExpressMethod;
    }

    public BigDecimal getiExpressAmount() {
        return iExpressAmount;
    }

    public void setiExpressAmount(BigDecimal iExpressAmount) {
        this.iExpressAmount = iExpressAmount;
    }
}