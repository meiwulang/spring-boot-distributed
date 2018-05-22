package com.jdy.b2b.api.service;

import java.util.List;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dto.OrderRefundRecordConfirmVO;
import com.jdy.b2b.api.model.orderRefund.OrderRefundsRecord;
import com.jdy.b2b.api.model.orderRefund.OrderRefundsRecordVO;
import com.jdy.b2b.api.model.orderRefund.TouristTicketDTO;

/**
 * Created by yangcheng on 2018/2/27.
 */
public interface OrderRefundRecordService {
    int updateOrderRefund(OrderRefundsRecord record);

    Long selectMaxIdByOrderId(Long orderId);

    OrderRefundsRecord selectByPrimaryKey(Long id);

    List<TouristTicketDTO> getTouristTicketList(Long orderId);

    List<OrderRefundsRecord> getRefundRecord(Long orderId);

    ResultBean applyOrderRefund(OrderRefundsRecordVO vo);

    ResultBean selectOtherTypeRefundRecordNum(Long orderId);
    /** 
     * @Description: 确认退款
     * @author 王斌
     * @date 2018年3月23日 上午10:59:51
     * @param vo
     * @return
     */
    ResultBean confirmOrderRefund( OrderRefundRecordConfirmVO vo);
}
