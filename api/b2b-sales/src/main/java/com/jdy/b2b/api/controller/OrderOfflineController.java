package com.jdy.b2b.api.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.OrderMapper;
import com.jdy.b2b.api.dao.orderOffline.OrderOfflineMapper;
import com.jdy.b2b.api.dto.OrderOfflineSaveVO;
import com.jdy.b2b.api.enums.OrderOfflineStatusEnum;
import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.orderOffline.OrderOffline;
import com.jdy.b2b.api.service.OrderOfflineService;

/**
 * Created by yangcheng on 2018/1/23.
 */

@RestController
@RequestMapping("orderOffline")
public class OrderOfflineController extends BaseController {
	@Autowired
	private OrderOfflineService orderOfflineService;
	@Autowired
	private OrderOfflineMapper orderOfflineMapper;
	@Autowired
	private OrderMapper orderMapper;
	@Autowired
	@Qualifier("customRestTemplate")
	private RestTemplate restTemplate;
	@Value("${changsha.tuijieqianzhui}")
	private String fenxiaoqianzhui;// 分销系统前缀

	// 保存凭证
	@Transactional
	@PostMapping("saveOrderOffline")
	public ResultBean saveOrderOffline(@RequestBody OrderOfflineSaveVO vo) {
		Order singleOrder = null;
		String orderNo = vo.getOrderNo();
		Long userId = vo.getUserId();
		if (vo.getOrderId() != null) {
			singleOrder = orderMapper.selectByPrimaryKey(vo.getOrderId());
			orderNo = singleOrder.getoOrderNo();
			userId = singleOrder.getCreateUser();
		}
		if (singleOrder == null) {// 分销会传orderNo 但不会传 orderId
			singleOrder = orderMapper.selectOrderByOrderNo(orderNo);
			userId = singleOrder.getCreateUser();
		}
		if (singleOrder == null) {
			return new ResultBean("-1", "订单不存在!");
		}
		/*
		 * int flag = getIsBuyerVoucher(singleOrder); if (flag == 0) { return
		 * new ResultBean("-1", "该状态下不允许上传凭证!"); }
		 */

		// 如果是首款支付,要限制所有未确认的凭证的总金额 加上 输入的金额 不超过 订单总金额
		BigDecimal vomoney = vo.getMoney();
		if (vo.getType().equals(Integer.valueOf(1))) {
			Boolean canUploadMoney = getFirstMoneyFlag(singleOrder, vomoney);
			if (!canUploadMoney) {
				return new ResultBean("-1", "上传凭证总金额过大,已超过订单总金额!");
			}
		}

		// 如果是尾款支付,要限制未确认的凭证的总金额 加上 输入的金额 不超过 未支付的剩余金额
		if (vo.getType().equals(Integer.valueOf(2))) {
			Boolean canUploadMoney = getLastMoneyFlag(singleOrder, vomoney);
			if (!canUploadMoney) {
				return new ResultBean("-1", "上传凭证总金额过大,已超过订单总金额!");
			}
		}

		OrderOffline orderOffline = JSONUtil.trans(vo, OrderOffline.class);
		orderOffline.setOrderId(singleOrder.getId());
		orderOffline.setCreateTime(new Date());
		orderOffline.setCreateUser(vo.getPuserId());
		orderOffline
				.setfStatus(OrderOfflineStatusEnum.TOBECONFIRMED.getValue());
		// 设置trans_no
		// XXZF+支付日期（20180201）+8位随机数
		// if (orderOffline.getTransNo() == null) {// 长沙调用会传该参数
		String transNo = getTransNo();
		orderOffline.setTransNo(transNo);
		// }
		// `type` '0-全款 1-首款 2-尾款',
		if (orderOffline.getType().equals(Integer.valueOf(0))) {// 全款
			// 如果是全款,并且支付金额等于订单金额,更新offlineStatus为0
			BigDecimal maxMoney = orderOfflineService
					.selectMaxMoney(singleOrder.getId(), 0);// 总计线下支付金额
			if (singleOrder.getoRealPay()
					.compareTo(maxMoney.add(vomoney)) == 0) {
				Order order = new Order();
				order.setId(orderOffline.getOrderId());
				order.setOfflineStatus(Integer.valueOf(0));
				order.setoPayMethod(Integer.valueOf(2));
				orderMapper.updateByPrimaryKeySelective(order);
			}
		} else if (orderOffline.getType().equals(Integer.valueOf(1))) {// 首款
			BigDecimal maxMoney = orderOfflineService
					.selectMaxMoney(singleOrder.getId(), 1);// 总计线下支付金额
			BigDecimal sumMoney = maxMoney.add(vomoney);
			if (sumMoney.compareTo(singleOrder.getoFirstPay()) >= 0) {
				Order order = new Order();
				order.setId(orderOffline.getOrderId());
				order.setoPayMethod(Integer.valueOf(2));
				order.setOfflineStatus(Integer.valueOf(0));
				orderMapper.updateByPrimaryKeySelective(order);
			}
		} else {// 尾款
			// 如果是尾款,等到金额达到订单金额, 更新offlineStatus为3
//			BigDecimal maxMoney = orderOfflineService
//					.selectMaxMoney(singleOrder.getId(), 2);
//			BigDecimal sumMoney = maxMoney.add(vomoney);
//			if (singleOrder.getoUnPay().compareTo(sumMoney) == 0) {
				Order order = new Order();
				order.setId(orderOffline.getOrderId());
				order.setOfflineStatus(Integer.valueOf(3));
				logger.error("#####更新订单支付审核状态为3####");
				orderMapper.updateByPrimaryKeySelective(order);
//			}
		}

		Long saveOrderOffline = orderOfflineService
				.saveOrderOffline(orderOffline);
		ResultBean<Long> successResult = ResultBean
				.getSuccessResult(saveOrderOffline);
		successResult.setId(saveOrderOffline);
		//
		// 同步数据到长沙
		final HashMap<String, Object> changshaParams = new HashMap<>();
		changshaParams.put("orderNo", orderNo);
		changshaParams.put("url", orderOffline.getUrl());
		changshaParams.put("inputMoney", orderOffline.getMoney());
		changshaParams.put("payId", orderOffline.getId());
		changshaParams.put("transNo", orderOffline.getTransNo());
		changshaParams.put("money", orderOffline.getMoney());
		changshaParams.put("type", orderOffline.getType());
		changshaParams.put("createUser", userId);
		changshaParams.put("uploadDesc", orderOffline.getUploadDesc());
		new java.lang.Thread() {
			@Override
			public void run() {
				logger.error(
						"同步上传支付凭证信息到长沙，参数如下：\n" + changshaParams.toString());
				ResponseEntity<ResultBean> result = restTemplate.postForEntity(
						fenxiaoqianzhui
								+ "order-service/orderOffLine/orderoffLine/callBack",
						changshaParams, ResultBean.class);
				ResultBean body = result.getBody();
				logger.error("同步上传支付凭证信息到长沙，返回参数如下：\n" + body);
				if (!"200".equals(body.getCode())) {
					logger.error("同步上传支付凭证信息到长沙操作失败，进行回滚");
					// orderOfflineMapper.deleteByPrimaryKey(saveOrderOffline);
					// return ResultBean.getErrorResult();
					throw new RuntimeException("同步上传支付凭证信息到长沙操作失败");
				}
			}
		}.start();
		return successResult;
	}

	public String getTransNo() {
		String format = LocalDate.now()
				.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
		int result = new Random().nextInt(100000000);
		String num = String.format("%08d", result);
		return "XXZF" + format + num;
	}

	/*
	 * public Integer getIsBuyerVoucher(Order order) { Integer offSt =
	 * order.getOfflineStatus(); if (2 == order.getoType()) { //offSt为0 if (1 ==
	 * order.getoStatus() && (offSt == null || Objects.equals(1,offSt))) return
	 * 1; // if ( 4 == order.getoSource() && (3 == order.getoStatus() || 10 ==
	 * order.getoStatus() || 11 == order.getoStatus()) &&
	 * (Objects.equals(2,offSt) || Objects.equals(3,offSt) ||
	 * Objects.equals(4,offSt)) && (order.getoUnPay()!=null)) return 1; } return
	 * 0; }
	 */

	public Boolean getLastMoneyFlag(Order order, BigDecimal money) {
		BigDecimal unPay = order.getoUnPay();
		// 计算该订单下 尾款中 未确认的凭证 总金额
		BigDecimal maxMoney = orderOfflineService.selectMaxMoney(order.getId(),
				2);
		return order.getoUnPay().compareTo(maxMoney) >= 0;
//		if (maxMoney == null && order.getoUnPay().compareTo(money) >= 0) {
//			return true;
//		} else {
//			return unPay.subtract(maxMoney).compareTo(money) >= 0;
//		}
	}

	public Boolean getFirstMoneyFlag(Order order, BigDecimal money) {
		BigDecimal realPay = order.getoRealPay();
		// 计算该订单下 首款中 未确认的凭证 总金额
		BigDecimal maxMoney = orderOfflineService.selectMaxMoney(order.getId(),
				1);

		if (maxMoney == null) {
			return true;
		} else {
			Boolean flag = realPay
					.subtract(
							maxMoney == null ? BigDecimal.valueOf(0) : maxMoney)
					.compareTo(money) >= 0;
			return flag;
		}
	}

}
