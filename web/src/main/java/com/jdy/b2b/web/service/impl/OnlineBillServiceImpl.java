package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.pojo.bill.OnlineBillVo;
import com.jdy.b2b.web.pojo.bill.ParamDto4ExportBillList;
import com.jdy.b2b.web.service.OnlineBillService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

/**
 * Created by strict on 2017/9/23.
 */
@Service
public class OnlineBillServiceImpl extends BaseService implements OnlineBillService {

    private String onlineBillPageUrl;
    private String queryOnlineBillUrl;
    private String queryOnlineBillList4ExportUrl;
    @PostConstruct
    private void initUrl(){
        onlineBillPageUrl =  financeCenterUrl + "OnlineBill/list";
        queryOnlineBillUrl = financeCenterUrl + "OnlineBill/";
        queryOnlineBillList4ExportUrl = financeCenterUrl + "OnlineBill/queryOnlineBillList4Export";
    }

    @Override
    public ResultBean queryOnlineBillList(OnlineBillVo onlineBillVo) {
        return restTemplate.postForObject(onlineBillPageUrl,onlineBillVo,ResultBean.class);
    }

    @Override
    public ResultBean queryOnlineBill(Long id) {
        return restTemplate.getForObject(queryOnlineBillUrl+id,ResultBean.class);
    }

    @Override
    public ResultBean queryOnlineBillList4Export(ParamDto4ExportBillList param) {
        return restTemplate.postForObject(queryOnlineBillList4ExportUrl,param,ResultBean.class);
    }
}
