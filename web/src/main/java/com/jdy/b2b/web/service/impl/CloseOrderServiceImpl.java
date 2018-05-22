package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.config.wechat.WechatConfiguration;
import com.jdy.b2b.web.enums.WechatCloseOrderErrorEnum;
import com.jdy.b2b.web.pojo.order.OrderPrePayDO;
import com.jdy.b2b.web.service.CloseOrderService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.wechat.wxpay.sdk.WXPay;
import com.jdy.b2b.web.util.wechat.wxpay.sdk.WXPayConfigImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Created by zhangfofa on 2017/10/31.
 */
@Service
public class CloseOrderServiceImpl extends BaseService implements CloseOrderService {
    @Autowired
    private WechatConfiguration wechatConfiguration;

    @Value("${salesCenterUrl}Order")
    String ORDER_URL;

    @Value("${salesCenterUrl}orderPrePay")
    String ORDER_PREPAY_URL;

    private static WXPay wxpay;

    @Override
    public ResultBean closeOrder(String orderNo) throws Exception {
        if (null == wxpay) {
            WXPayConfigImpl wxPayConfig = WXPayConfigImpl.getInstance(wechatConfiguration);
            wxpay = wxPayConfig.wxpay;
        }

        String queryOrderPrePayRecord = ORDER_PREPAY_URL + "/queryByOrderNo";
        ResultBean<OrderPrePayDO> queryOrderPrePayRecordResultBean = restTemplate.postForObject(queryOrderPrePayRecord, orderNo, ResultBean.class);
        OrderPrePayDO orderPrePayDO = queryOrderPrePayRecordResultBean.getParsedEnitity(OrderPrePayDO.class);
        if (!Objects.equals(orderPrePayDO, null)) {
            if (null == wxpay) {
                WXPayConfigImpl wxPayConfig = WXPayConfigImpl.getInstance(wechatConfiguration);
                wxpay = wxPayConfig.wxpay;
            }
            Map<String, String> closeOrderData = new HashMap<>();
            closeOrderData.put("out_trade_no", orderPrePayDO.getPpOrderRandom());
            Map<String, String> closeOrderResult = wxpay.closeOrder(closeOrderData);
            String returnCode = closeOrderResult.get("return_code");
            String resultCode = closeOrderResult.get("result_code");
            if (Objects.equals(returnCode, "FAIL")) {
                logger.error(closeOrderResult.get("return_msg"));
                return ResultBean.getIndexFailResult(closeOrderResult.get("return_msg"));
            }
            if (Objects.equals(returnCode, "SUCCESS") && Objects.equals(resultCode, "FAIL")) {
                logger.error(closeOrderResult.get("err_code_des"));
                boolean errResult1 = closeOrderResult.get("err_code").equalsIgnoreCase(WechatCloseOrderErrorEnum.ORDERCLOSED.getValue());
                boolean errResult2 = closeOrderResult.get("err_code").equalsIgnoreCase(WechatCloseOrderErrorEnum.ORDERPAID.getValue());
                if (!(errResult1 || errResult2)) {
                    return ResultBean.getIndexFailResult(closeOrderResult.get("err_code_des"));
                }
            }
            String deleteOrderPrePayRecord = ORDER_PREPAY_URL + "/delete";
            restTemplate.postForObject(deleteOrderPrePayRecord, orderPrePayDO.getPpOrderRandom().split("-")[0], ResultBean.class);
            return ResultBean.getSuccessResult();
        }
        return ResultBean.getIndexFailResult("未查询到该订单的预支付记录!");
    }
}
