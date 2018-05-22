package com.jdy.b2b.api.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.BillMapper;
import com.jdy.b2b.api.model.bill.*;
import com.jdy.b2b.api.service.CreditBillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * Created by strict on 2017/9/6.
 */
@Service
public class CreditBillServiceImpl implements CreditBillService {

    @Autowired
    private BillMapper billMapper;
    @Override
    public PageInfo<CreditBillDTO> queryCreditBillList(CreditBillVo creditBillVo) {
        if (creditBillVo.getCurrPage() != null && creditBillVo.getPageSize() != null) {
            PageHelper.startPage(creditBillVo.getCurrPage(), creditBillVo.getPageSize());
        }
        return new PageInfo<>(billMapper.selectCreditBillList(creditBillVo));
    }

    @Override
    public BillTotalInfoDTO sumCreditBillTotal(CreditBillVo creditBillVo) {
        return billMapper.sumCreditBillTotal(creditBillVo);
    }

    @Override
    public CreditBillDetailDTO queryCreditBillDetail(String billNo) {
        return billMapper.selectCreditBillDetail(billNo);
    }

    @Override
    public ResultBean writeOffBill(Long billId, BigDecimal reduction, BigDecimal payMoney) {
        Bill bill = billMapper.selectByPrimaryKey(billId);
        ResultBean resultBean = new ResultBean();
        if (bill == null){
            resultBean.setCode("-1");
            resultBean.setMessage("账单不存在");
        }else{
            BigDecimal notRepayment = bill.getbAmount().subtract(bill.getbPayedAmount());//未还
            if (notRepayment.compareTo(payMoney.add(reduction))>=0) { // 未还 要 >= (此次还款的数值+减免优惠)  减免优惠只有在一次性还款时才生效，一般情况下为 0

            }else{
                resultBean.setCode("-1");
                resultBean.setMessage("还款金额超过未还款金额");
            }
        }
        return resultBean;
    }
}
