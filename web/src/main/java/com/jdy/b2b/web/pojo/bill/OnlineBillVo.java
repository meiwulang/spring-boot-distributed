package com.jdy.b2b.web.pojo.bill;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * 应收在线账单搜索入参类
 * Created by guyong on 2017/8/30.
 */
@ApiModel
public class OnlineBillVo extends BaseVO{
    @ApiModelProperty(value="账单日期开始")
    private String createTimeS;
    @ApiModelProperty(value="账单日期结束")
    private String createTimeE;
    @ApiModelProperty(value="账单状态")
    private Integer bStatus;
    @ApiModelProperty(value="收款单位 id")
    private Long bSalerCompanyId;
    @ApiModelProperty(value="账单生成方式")
    private Byte bBillType;
    @ApiModelProperty(value="账单编号")
    private String bBillNo;

    public Integer getbStatus() {
        return bStatus;
    }

    public void setbStatus(Integer bStatus) {
        this.bStatus = bStatus;
    }

    public Long getbSalerCompanyId() {
        return bSalerCompanyId;
    }

    public void setbSalerCompanyId(Long bSalerCompanyId) {
        this.bSalerCompanyId = bSalerCompanyId;
    }

    public Byte getbBillType() {
        return bBillType;
    }

    public void setbBillType(Byte bBillType) {
        this.bBillType = bBillType;
    }

    public String getbBillNo() {
        return bBillNo;
    }

    public void setbBillNo(String bBillNo) {
        this.bBillNo = bBillNo;
    }

    public String getCreateTimeE() {
        return createTimeE;
    }

    public void setCreateTimeE(String createTimeE) {
        this.createTimeE = createTimeE;
    }

    public String getCreateTimeS() {
        return createTimeS;
    }

    public void setCreateTimeS(String createTimeS) {
        this.createTimeS = createTimeS;
    }
}
