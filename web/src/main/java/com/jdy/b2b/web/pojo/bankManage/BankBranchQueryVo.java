package com.jdy.b2b.web.pojo.bankManage;


import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

@ApiModel
public class BankBranchQueryVo extends BaseVO {
    @ApiModelProperty(value="总行id")
    @NotNull(message = "总行id不能为null")
    private Integer bbBaId;
    @ApiModelProperty(value="省id")
    @NotNull(message = "省id不能为null")
    private Integer bbPId;
    @ApiModelProperty(value="市id")
    @NotNull(message = "市id不能为null")
    private Integer bbCId;

    public Integer getBbPId() {
        return bbPId;
    }

    public void setBbPId(Integer bbPId) {
        this.bbPId = bbPId;
    }

    public Integer getBbCId() {
        return bbCId;
    }

    public void setBbCId(Integer bbCId) {
        this.bbCId = bbCId;
    }

    public Integer getBbBaId() {
        return bbBaId;
    }

    public void setBbBaId(Integer bbBaId) {
        this.bbBaId = bbBaId;
    }

}