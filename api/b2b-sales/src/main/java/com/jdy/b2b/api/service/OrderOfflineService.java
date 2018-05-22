package com.jdy.b2b.api.service;

import java.math.BigDecimal;

import com.jdy.b2b.api.model.orderOffline.OrderOffline;

/**
 * Created by yangcheng on 2018/1/23.
 */
public interface OrderOfflineService {
	Long saveOrderOffline(OrderOffline orderOffline);

	BigDecimal selectMaxMoney(Long id, Integer type);

	BigDecimal selectSumFirstPay(Long id, BigDecimal money);
}
