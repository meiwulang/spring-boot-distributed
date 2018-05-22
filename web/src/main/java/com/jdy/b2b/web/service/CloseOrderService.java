package com.jdy.b2b.web.service;

import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by zhangfofa on 2017/10/31.
 */
public interface CloseOrderService {
    ResultBean closeOrder(String orderNo) throws Exception;
}
