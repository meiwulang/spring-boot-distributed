package com.jdy.b2b.api.service.impl;

import java.math.BigDecimal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jdy.b2b.api.dao.orderOffline.OrderOfflineMapper;
import com.jdy.b2b.api.model.orderOffline.OrderOffline;
import com.jdy.b2b.api.service.OrderOfflineService;

/**
 * Created by yangcheng on 2018/1/23.
 */
@Service
public class OrderOfflineServiceImpl implements OrderOfflineService {
	@Autowired
	private OrderOfflineMapper orderOfflineMapper;

	@Override
	public Long saveOrderOffline(OrderOffline orderOffline) {
		orderOfflineMapper.insert(orderOffline);
		return orderOffline.getId();
	}

	@Override
	public BigDecimal selectMaxMoney(Long id, Integer type) {
		BigDecimal maxMoney = orderOfflineMapper.selectMaxMoney(id, type);
		return maxMoney == null ? BigDecimal.valueOf(0) : maxMoney;
	}

	@Override
	public BigDecimal selectSumFirstPay(Long id, BigDecimal money) {
		Map<String, BigDecimal> map = orderOfflineMapper.selectSumFirstPay(id);
		return map.get("sumMoney") == null ? BigDecimal.valueOf(0)
				: map.get("sumMoney").add(money);

	}
}
