package com.jdy.b2b.web.service.impl.frontService;

import com.jdy.b2b.web.controll.electroniccontract.ElectronicContractController;
import com.jdy.b2b.web.pojo.order.h5.OrderH5Vo;
import com.jdy.b2b.web.pojo.order.h5.OrderUpdateContractAgreementDO;
import com.jdy.b2b.web.service.frontService.FrontOrderService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

/**
 * Created by strict on 2017/10/9.
 */
@Service
public class FrontOrderServiceImpl extends BaseService implements FrontOrderService {

    private String queryOrderInfoUrl;
    private String queryOrderDetailUrl;
    private String searchOrderListUrl;
    private String queryOrderListUrl;
    private String confirmOrderInfoUrl;
    private String updateOrderContractAgreementUrl;

    @Autowired
    ElectronicContractController electronicContractController;

    @PostConstruct
    public void init() {
        queryOrderInfoUrl = salesCenterUrl + "Order/m/orderInfo";
        queryOrderDetailUrl = salesCenterUrl + "Order/m/orderDetail";
        searchOrderListUrl = salesCenterUrl + "Order/m/searchList";
        queryOrderListUrl = salesCenterUrl + "Order/m/queryList";
        confirmOrderInfoUrl = salesCenterUrl + "Order/m/orderBeforeConfirm/";
        updateOrderContractAgreementUrl = salesCenterUrl + "Order/m/updateContractAgreement";
    }

    @Override
    public ResultBean queryOrderInfoForH5(OrderH5Vo orderH5Vo) {
        return restTemplate.postForObject(queryOrderInfoUrl, orderH5Vo, ResultBean.class);
    }

    @Override
    public ResultBean queryOrderDetailForH5(OrderH5Vo orderH5Vo) {
        return restTemplate.postForObject(queryOrderDetailUrl, orderH5Vo, ResultBean.class);
    }

    @Override
    public ResultBean searchOrderListForH5(OrderH5Vo orderH5Vo) {
        return restTemplate.postForObject(searchOrderListUrl, orderH5Vo, ResultBean.class);
    }

    @Override
    public ResultBean queryOrderListForH5(OrderH5Vo orderH5Vo) {
        return restTemplate.postForObject(queryOrderListUrl, orderH5Vo, ResultBean.class);
    }

    @Override
    public ResultBean confirmOrderInfo(String no) {
        return restTemplate.getForObject(confirmOrderInfoUrl + no, ResultBean.class);
    }

    @Override
    public ResultBean updateContractAgreement(OrderUpdateContractAgreementDO order) {
        ResultBean res = restTemplate.postForObject(updateOrderContractAgreementUrl, order, ResultBean.class);
        electronicContractController.generateContract(order.getoOrderNo());
        return res;
    }

}
