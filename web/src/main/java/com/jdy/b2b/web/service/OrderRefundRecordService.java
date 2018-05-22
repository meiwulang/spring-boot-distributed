package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.orderRefund.OrderRefundsRecordVO;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by strict on 2018/2/28.
 */
public interface OrderRefundRecordService {

    ResultBean getTouristListForRefund(Long orderId);

    ResultBean getRefundRecord(Long orderId, Integer flag);

    ResultBean applyOrderRefund(OrderRefundsRecordVO vo);

    ResultBean selectOtherTypeRefundRecordNum(Long orderId);
}
