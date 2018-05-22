package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.pojo.orderRefund.OrderRefundsRecordVO;
import com.jdy.b2b.web.service.OrderRefundRecordService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

/**
 * Created by strict on 2018/2/28.
 */
@Service
public class OrderRefundRecordServiceImpl extends BaseService implements OrderRefundRecordService {

    private String touristListUrl;
    private String applyRefundUrl;
    private String refundRecordUrl;
    private String otherTypeNumUrl;

    @PostConstruct
    private void initUrl() {
        touristListUrl = salesCenterUrl + "orderRefundRecord/getTouristListForRefund/";
        applyRefundUrl = salesCenterUrl +"orderRefundRecord/applyOrderRefund";
        refundRecordUrl = salesCenterUrl +"orderRefundRecord/getRefundRecord/";
        otherTypeNumUrl = salesCenterUrl +"orderRefundRecord/getOtherRefundTypeForOrder/";
    }

    @Override
    public ResultBean getTouristListForRefund(Long orderId) {
        return restTemplate.getForObject(touristListUrl+orderId,ResultBean.class);
    }

    @Override
    public ResultBean getRefundRecord(Long orderId, Integer flag) {

        return restTemplate.getForObject(refundRecordUrl+orderId+"/"+flag,ResultBean.class);
    }

    @Override
    public ResultBean applyOrderRefund(OrderRefundsRecordVO vo) {
        return restTemplate.postForObject(applyRefundUrl,vo,ResultBean.class);
    }

    @Override
    public ResultBean selectOtherTypeRefundRecordNum(Long orderId) {
        return restTemplate.getForObject(otherTypeNumUrl+orderId,ResultBean.class);
    }
}
