package com.jdy.b2b.web.pojo.order.h5;

import com.jdy.b2b.web.util.BaseVO;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/19 20:02
 */
public class OrderUpdateContractAgreementDO extends BaseVO {

    private String oOrderNo;
    private String oContractAgreement;

    public String getoOrderNo() {
        return oOrderNo;
    }

    public void setoOrderNo(String oOrderNo) {
        this.oOrderNo = oOrderNo;
    }

    public String getoContractAgreement() {
        return oContractAgreement;
    }

    public void setoContractAgreement(String oContractAgreement) {
        this.oContractAgreement = oContractAgreement;
    }
}
