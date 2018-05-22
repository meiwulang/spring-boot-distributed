package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.electroniccontract.SignContract;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by zhangfofa on 2018/1/24.
 */
public interface ElectronicContractForPcService {

    ResultBean companyAndCustomerSignContract(SignContract signContract);
}
