package com.jdy.b2b.web.service.frontService;

import com.jdy.b2b.web.pojo.order.h5.OrderH5Vo;
import com.jdy.b2b.web.pojo.order.h5.OrderUpdateContractAgreementDO;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by strict on 2017/10/9.
 */
public interface FrontOrderService {
    ResultBean queryOrderInfoForH5(OrderH5Vo orderH5Vo);
    ResultBean queryOrderDetailForH5(OrderH5Vo orderH5Vo);
    ResultBean searchOrderListForH5(OrderH5Vo orderH5Vo);
    ResultBean queryOrderListForH5(OrderH5Vo orderH5Vo);

    ResultBean confirmOrderInfo(String no);

    ResultBean updateContractAgreement(OrderUpdateContractAgreementDO order);
}
