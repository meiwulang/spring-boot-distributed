package com.jdy.b2b.api.vo.bankManage;

import com.jdy.b2b.api.common.BaseVO;

public class BankBranchQueryVo extends BaseVO{
    private Integer bbBaId;

    private Integer bbPId;

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