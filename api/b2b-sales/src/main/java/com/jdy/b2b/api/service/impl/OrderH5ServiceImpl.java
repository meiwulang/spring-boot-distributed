package com.jdy.b2b.api.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.OrderCardMapper;
import com.jdy.b2b.api.dao.OrderH5Mapper;
import com.jdy.b2b.api.dao.OrderMapper;
import com.jdy.b2b.api.dao.OrderTouristMapper;
import com.jdy.b2b.api.dao.diy.OrderMapperDiy;
import com.jdy.b2b.api.dao.electroniccontract.ProductContractTemplateMapper;
import com.jdy.b2b.api.dao.electroniccontract.SignContractInfoMapper;
import com.jdy.b2b.api.dao.orderOffline.OrderOfflineMapper;
import com.jdy.b2b.api.dao.user.UserMapper;
import com.jdy.b2b.api.enums.OrderOfflineStatusEnum;
import com.jdy.b2b.api.enums.OrderPayMethodEnum;
import com.jdy.b2b.api.enums.OrderStatusEnum;
import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.OrderContract;
import com.jdy.b2b.api.model.OrderTourist;
import com.jdy.b2b.api.model.diy.*;
import com.jdy.b2b.api.model.electroniccontract.ProductContractTemplate;
import com.jdy.b2b.api.model.orderOffline.OrderOffline;
import com.jdy.b2b.api.model.user.User;
import com.jdy.b2b.api.service.OrderH5Service;
import com.jdy.b2b.api.service.OrderOperationService;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.springframework.util.CollectionUtils.isEmpty;

/**
 * Created by strict on 2017/9/21.
 */
@Service
@Transactional
public class OrderH5ServiceImpl implements OrderH5Service {

	protected final org.slf4j.Logger logger = LoggerFactory
			.getLogger(this.getClass());

	@Autowired
	private OrderH5Mapper orderH5Mapper;
	@Autowired
	SignContractInfoMapper signContractInfoMapper;
	@Autowired
	OrderTouristMapper orderTouristMapper;
	@Autowired
	OrderMapper orderMapper;
	@Autowired
	OrderMapperDiy orderMapperDiy;
	@Autowired
	OrderOperationService orderOperationService;
	@Autowired
	private ProductContractTemplateMapper pctMapper;
	@Autowired
	UserMapper userMapper;
	@Autowired
	OrderCardMapper orderCardMapper;
	@Autowired
	OrderOfflineMapper orderOfflineMapper;

	@Override
	public Map<String, Object> queryOrderList(OrderH5Vo orderH5Vo) {
		logger.info("订单列表queryOrderList参数：" + JSON.toJSONString(orderH5Vo));
		PageHelper.startPage(orderH5Vo.getPage(), orderH5Vo.getLimit());
		PageInfo<OrderH5DTO> pageInfo = new PageInfo(
				orderH5Mapper.selectOrderList(orderH5Vo));
		if(pageInfo.getList() != null && pageInfo.getList().size()>0){
			for (OrderH5DTO d : pageInfo.getList()){
				logger.info("订单【"+d.getOrder_id()+"】申请退款权限条件:"+ JSONObject.toJSONString(d));
				Integer groupStatus = d.getGroupStatus();
				Integer orderStatus = d.getOrderStatus();
				BigDecimal realPay = d.getRealPay();
				Integer refundStatus = d.getRefundStatus();


				// 团期有效 且 不为 结团 状态 才能申请退款
				if(groupStatus != 2 &&groupStatus != 3 && orderStatus == 3 && realPay.compareTo(BigDecimal.ZERO)>0 && !(refundStatus !=null && refundStatus == 1)){
					d.setApplyRefundFlag(1);
				}else{
					d.setApplyRefundFlag(0);
				}
			}
		}

		Map<String, Object> res = new HashMap<>();
		res.put("total", pageInfo.getTotal());
		res.put("page", pageInfo.getPageNum());
		res.put("code", "200");
		res.put("message", "ok");
		res.put("data", new HashMap<String, Object>() {
			{
				put("pageInfo", pageInfo);
			}
		});
		return res;
	}

	@Override
	public Map<String, Object> querySimpleOrderList(OrderH5Vo orderH5Vo) {
		List<OrderH5DTO> list = orderH5Mapper.selectSimpleOrderList(orderH5Vo);
		Map<String, Object> res = new HashMap<>();
		res.put("code", "200");
		res.put("message", "ok");
		res.put("data", list);
		return res;
	}

	@Override
	public Map<String, Object> queryOrderDetail(OrderH5Vo orderH5Vo) {
		OrderH5DetailDTO orderH5DetailDTO = orderH5Mapper
				.selectOrderDetail(orderH5Vo);
		if (orderH5DetailDTO != null) {
			orderH5DetailDTO.setOrderCards(orderCardMapper.selectCardsByOrderId(
					orderH5DetailDTO.getOrder_detail().getOrder_id()));
			Map<String, Object> res = new HashMap<>();
			OrderH5DTO orderH5DTO = orderH5DetailDTO.getOrder_detail();
			if (orderH5DTO != null) {
				if (orderH5DTO.getS_sit_type() != 0) {
					String seatStr = orderH5DTO.getSeat_detail();
					if (seatStr != null) {
						List<Map<String, Object>> list = JSON.parseObject(
								seatStr,
								new TypeReference<List<Map<String, Object>>>() {
								});
						StringBuffer sb = new StringBuffer();
						Object busNo = list.get(0).get("busNo");
						String seatNo = String.valueOf(list.get(0).get("seat"));
						String[] seatArr = seatNo.split(",");
						sb.append(busNo).append("号车");
						for (String seatId : seatArr) {
							sb.append("【").append(seatId).append("】");
						}
						orderH5DTO.setSeat_detail(sb.toString());
					}
				}
			}

			// add by zhaoxiaouan 获取电子合同信息
			List<OrderContract> contractList = signContractInfoMapper
					.selectSignContractInfoListByOrderNo(orderH5Vo.getNo());
			if (!isEmpty(contractList)) {
				OrderContract orderContract = contractList
						.get(contractList.size() - 1);
				orderH5DetailDTO.setOrderContract(orderContract);
				OrderTourist orderTourist = orderTouristMapper
						.selectOrderTourist(orderH5Vo.getNo());
				if (orderTourist != null)
					orderContract.setSignName(orderTourist != null
							? orderTourist.getOtName() : "");
			}

			res.put("code", "200");
			res.put("message", "ok");
			res.put("data", orderH5DetailDTO);
			return res;
		}
		return null;
	}

	@Override
	public Map<String, Object> queryOrderInfo(OrderH5Vo orderH5Vo) {

		logger.info("queryOrderInfo 查询条件：" + JSON.toJSONString(orderH5Vo));
		OrderInfoH5DTO orderInfo = orderH5Mapper.selectOrderInfo(orderH5Vo);
		Map<String, Object> res = new HashMap<>();
		if (orderInfo != null) {
			ProductContractTemplate chosen = pctMapper
					.selectByPid(orderInfo.getP_id(), orderH5Vo.getTickets().get(0));
			orderInfo.setContractTemplate(chosen);
			List<TicketDetailH5DTO> orgData = orderInfo.getTicketList();
			if (orgData != null) {
				Map<String, TicketDetailH5DTO> map = new HashMap<>();
				for (TicketDetailH5DTO ticket : orgData) {
					if (ticket.getChildList() != null
							&& ticket.getChildList().size() > 0) {
						Integer ts_seats = 0;
						Map<String, TicketDetailH5DTO> childMap = new HashMap<>();
						for (TicketDetailH5DTO childTicket : ticket
								.getChildList()) {
							ts_seats += childTicket.getNum();
							if ("儿童票".equals(childTicket.getT_preset_type())) {
								childTicket.setRoom_num(0);
							} else {
								childTicket.setRoom_num(childTicket.getNum());
							}
							childTicket.setT_out_room_price(BigDecimal.ZERO);
							childTicket.setT_spread_price(BigDecimal.ZERO);
							Long t_id = childTicket.getT_id();
							if (t_id != null) {
								childMap.put(t_id.toString(), childTicket);
							}
						}
						ticket.setNum(ts_seats);
						ticket.setRoom_num(ts_seats);
						ticket.setList(childMap);
						ticket.setChildList(null);
					} else {
						ticket.setNum(1);
						if (ticket.getT_preset_type().equals("儿童票")) {
							ticket.setRoom_num(0);
						} else {
							ticket.setRoom_num(1);
						}
					}
					map.put(ticket.getT_id().toString(), ticket);
				}
				orderInfo.setTicket(map);
				orderInfo.setTicketList(null);
			}
			// 下单前页面信息，加入游客用户信息

			if(orderH5Vo.getIsVisitor() != null && orderH5Vo.getIsVisitor() == 1){
				orderInfo.setuStype(3);	//游客
			}else{
				User user = userMapper.queryForUserByIdSingle(orderH5Vo.getPuserId());
				orderInfo.setuStype(user.getuStype());
			}

			res.put("code", "200");
			res.put("message", "ok");
			res.put("data", orderInfo);
		} else {
			res.put("code", "404");
			res.put("message", "您定位的城市没有投放所选的票");
		}

		return res;
	}

	@Override
	public Map<String, Object> queryOrderInfoBeforeConfirm(String no) {
		Map<String, Object> res = new HashMap<>();
		res.put("code", "200");
		res.put("message", "ok");
		OrderSimpleH5DTO orderSimpleH5DTO = orderH5Mapper
				.queryOrderSimpleInfo(no);
		res.put("data", new HashMap<String, OrderSimpleH5DTO>() {
			{
				put("payment_info", orderSimpleH5DTO);
			}
		});
		return res;
	}

	@Transactional
	@Override
	public ResultBean updateContractAgreement(Order order) {
		Order od = orderMapperDiy.selectOrderByOrderNo(order.getoOrderNo());
		if (!OrderStatusEnum.REJECT.equals(od.getoStatus())) {
			return new ResultBean("-1", "订单不是已驳回状态");
		}
		if (isBlank(order.getoContractAgreement())) {
			return new ResultBean("-1", "请输入合同补充约定");
		}
		Order newOrder = new Order();
		newOrder.setId(od.getId());
		newOrder.setoStatus(OrderStatusEnum.TO_CONFIRM.getValue());
		newOrder.setoContractAgreement(order.getoContractAgreement());
		orderMapper.updateByPrimaryKeySelective(newOrder);

		od.setoStatus(newOrder.getoStatus());
		orderOperationService.saveOrderLog(od, "更新合同补充约定", "");

		return new ResultBean("200", "提交成功");
	}

	@Override
	public List<OrderPayLine> orderPayList(Order order) {
		List<OrderPay4H5DTO> pays = orderMapperDiy.selectOrderPayRecords(order);
		if (pays != null) {
			for (OrderPay4H5DTO dto : pays) {
				convertOrderPay4H5DTO2Str(dto);
				for (OrderOffline line : dto.getOrderOfflineList()) {
					line.setStatusStr(OrderOfflineStatusEnum
							.getDescByValue(line.getfStatus()));
				}
			}
		}
		List<OrderPayOfflineDto> offlineDtos = orderOfflineMapper
				.selectOrderPayOfflineDtoByOrderId(order.getId());
		if (pays != null) {
			for (OrderPayOfflineDto dto : offlineDtos) {
				convertOrderPayOfflineDto2Str(dto);
			}
		}
		List<OrderPayLine> list = new ArrayList(pays);
		list.addAll(offlineDtos);
		list.sort(Comparator
				.comparing(orderPayLine -> orderPayLine.getCreateTime()));
		return list;
	}

	private void convertOrderPayOfflineDto2Str(OrderPayOfflineDto dto) {
		dto.setStatusStr(
				OrderOfflineStatusEnum.getDescByValue((int) dto.getStatus()));
		dto.setMoneyStr(dto.getMoney().setScale(2).toString());
	}

	private void convertOrderPay4H5DTO2Str(OrderPay4H5DTO dto) {
		dto.setOrderStatusStr(
				OrderStatusEnum.getDescByValue((int) dto.getOrderStatus()));
		dto.setPayMethodStr(
				OrderPayMethodEnum.getDescByValue((int) dto.getPayMethod()));
		dto.setMoneyStr(dto.getMoney().setScale(2).toString());
	}

}
