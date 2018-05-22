package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.pojo.bill.CreditBillVo;
import com.jdy.b2b.web.service.CreditBillService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

/**
 * Created by strict on 2017/9/19.
 */
@Service
public class CreditBillServiceImpl extends BaseService implements CreditBillService {


    private String creditBillPageUrl;

    private String companyOweAmountUrl;

    @PostConstruct
    private void initUrl(){
        creditBillPageUrl =  financeCenterUrl + "CreditBill/list";
        companyOweAmountUrl = financeCenterUrl + "CreditBill/queryOweList";
    }

    @Override
    public ResultBean queryCreditBillList(CreditBillVo creditBillVo) {

        return restTemplate.postForObject(creditBillPageUrl,creditBillVo,ResultBean.class);
    }

    @Override
    public ResultBean queryOweList(CreditBillVo creditBillVo) {
        return restTemplate.postForObject(companyOweAmountUrl,creditBillVo,ResultBean.class);
    }
}
