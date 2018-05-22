package com.jdy.b2b.web.controll.electroniccontract;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jdy.b2b.web.pojo.electroniccontract.SignContract;
import com.jdy.b2b.web.service.ElectronicContractForPcService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by zhangfofa on 2018/1/22.
 */
@Controller
@RequestMapping("electronicContractForPc")
public class ElectronicContractForPcController extends BaseController {
    private final Logger logger = LoggerFactory.getLogger(ElectronicContractController.class);

    @Autowired
    private ElectronicContractForPcService electronicContractForPcService;

    @RequestMapping(value = "/companyAndCustomerSignContract", method = RequestMethod.POST)
    @ResponseBody
    public ResultBean companyAndCustomerSignContract(@RequestBody SignContract signContract) {
        return electronicContractForPcService.companyAndCustomerSignContract(signContract);
    }
}
