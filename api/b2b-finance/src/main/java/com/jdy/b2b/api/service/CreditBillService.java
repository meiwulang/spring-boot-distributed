package com.jdy.b2b.api.service;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.bill.BillTotalInfoDTO;
import com.jdy.b2b.api.model.bill.CreditBillDTO;
import com.jdy.b2b.api.model.bill.CreditBillDetailDTO;
import com.jdy.b2b.api.model.bill.CreditBillVo;

import java.math.BigDecimal;

/**
 * Created by strict on 2017/9/5.
 */
public interface CreditBillService {
    PageInfo<CreditBillDTO> queryCreditBillList(CreditBillVo creditBillVo);

    BillTotalInfoDTO sumCreditBillTotal(CreditBillVo creditBillVo);

    CreditBillDetailDTO queryCreditBillDetail(String billNo);

    ResultBean writeOffBill(Long billId, BigDecimal reduction, BigDecimal payMoney);
}
