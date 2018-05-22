package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.bill.CreditBillVo;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by strict on 2017/9/19.
 */
public interface CreditBillService {
    ResultBean queryCreditBillList(CreditBillVo creditBillVo);

    ResultBean queryOweList(CreditBillVo creditBillVo);
}
