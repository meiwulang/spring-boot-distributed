package com.jdy.b2b.api.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.common.EncodingObjectWithMd5Utils;
import com.jdy.b2b.api.common.HttpClientUtils;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.*;
import com.jdy.b2b.api.dao.diy.ScheduleTicketMapperDiy;
import com.jdy.b2b.api.dao.orderRefund.OrderRefundsRecordMapper;
import com.jdy.b2b.api.dto.OrderRefundRecordConfirmVO;
import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.OrderLogs;
import com.jdy.b2b.api.model.diy.OrderDetailDTO;
import com.jdy.b2b.api.model.diy.OrderPriceDetailDTO;
import com.jdy.b2b.api.model.diy.OrderTouristDTO;
import com.jdy.b2b.api.model.orderRefund.OrderRefundsRecord;
import com.jdy.b2b.api.model.orderRefund.OrderRefundsRecordVO;
import com.jdy.b2b.api.model.orderRefund.TouristTicketDTO;
import com.jdy.b2b.api.service.OrderAlterTicketService;
import com.jdy.b2b.api.service.OrderRefundRecordService;
import com.jdy.b2b.api.service.OrderService;
import com.jdy.b2b.api.util.MQAssembleService;
import com.jdy.b2b.api.util.MQTransformationUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.TaskExecutor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Created by yangcheng on 2018/2/27.
 */
@Service
public class OrderRefundRecordServiceImpl extends BaseService implements OrderRefundRecordService {
    @Value("${changsha.tuijieqianzhui2}")
    String tuijieqianzhui2;
    @Autowired
    private OrderRefundsRecordMapper orderRefundsRecordMapper;
    @Autowired
    private OrderTouristMapper orderTouristMapper;
    @Autowired
    private OrderMapper orderMapper;
    @Autowired
    private ScheduleMapper scheduleMapper;
    @Autowired
    private ScheduleTicketMapperDiy scheduleTicketMapperDiy;
    @Autowired
    private OrderPriceDetailMapper orderPriceDetailMapper;
    @Autowired
    private OrderLogsMapper orderLogsMapper;
    @Autowired
    private OrderAlterTicketService orderAlterTicketService;
    @Autowired
    private OrderService orderService;
    @Autowired
    TaskExecutor taskExecutor;
    @Autowired
    MQAssembleService mqAssembleService;
    private static final String TICKET_ID_STR = "ticketId";
    private static final String STOCK_STR = "stockStr";
    @Override
    public int updateOrderRefund(OrderRefundsRecord record) {
        int result = orderRefundsRecordMapper.updateByPrimaryKeySelective(record);
        try {
            //更新退款订单记录同步到数据仓库
            taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncOrderRefundsRecord(MQTransformationUtils.transOrderRefundsRecord(record)));
        } catch (Exception e){
            e.printStackTrace();
            logger.error("同步退款订单记录异常，原因：" + e.getMessage());
        }
        return result;
    }

    @Override
    public Long selectMaxIdByOrderId(Long orderId) {
        return orderRefundsRecordMapper.selectMaxIdByOrderId(orderId);
    }

    @Override
    public OrderRefundsRecord selectByPrimaryKey(Long id) {
        return orderRefundsRecordMapper.selectByPrimaryKey(id);
    }

    @Override
    public List<TouristTicketDTO> getTouristTicketList(Long orderId) {
        List<TouristTicketDTO> list = orderTouristMapper.selectTouristTicket(orderId);
        return list;
    }

    @Override
    public List<OrderRefundsRecord> getRefundRecord(Long orderId) {
        List<OrderRefundsRecord> list = orderRefundsRecordMapper.selectByOrderId(orderId);
        return list;
    }

    @Override
    public ResultBean applyOrderRefund(OrderRefundsRecordVO vo) {
        //如果 touristIds 有值，则查找对应的票的信息
            //查到票的信息，计算申请退款的金额
            //以逗号相连游客表的 id
            //拼接 退票信息
        //如果没有 touristIds ，则检查 申请的退款金额是否有值
            //有申请退款金额，直接记录
        OrderRefundsRecord record = new OrderRefundsRecord();

        if (vo.getTouristIds()!=null && vo.getTouristIds().size() >0){
            List<TouristTicketDTO> ticketList = orderTouristMapper.selectTouristTicketByIds(vo.getTouristIds());
            Order order = orderMapper.selectByPrimaryKey(vo.getOrderId());
            record = initRecord(ticketList,order);
        } else{
            if (vo.getApplyRefundAmount() == null || vo.getApplyRefundAmount().compareTo(BigDecimal.ZERO) <= 0){
                return ResultBean.getErrorResult("请输入一个有效的退款金额");
            }else{
                record.setApplyAmount(vo.getApplyRefundAmount());
            }
        }
        record.setOrderId(vo.getOrderId());
        record.setApplyRefundTime(new Date());
        record.setRefundableBuyerId(vo.getPuserId());
        record.setRefundableBuyerName(vo.getpURealName());
        record.setRefundExplain(vo.getRefundExplain());
        record.setStatus(1);
        record.setType(vo.getType());
        int res = orderRefundsRecordMapper.insertSelective(record);
        final OrderRefundsRecord orderRefundsRecord = new OrderRefundsRecord();
        BeanUtils.copyProperties(record, orderRefundsRecord);
        taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncOrderRefundsRecord(MQTransformationUtils.transOrderRefundsRecord(orderRefundsRecord)));
        if (res > 0 ){
            //
            updateOrderRefundStatus(vo.getOrderId());

            return ResultBean.getSuccessResult();
        }
        return ResultBean.getErrorResult("申请退款失败");
    }

    @Override
    public ResultBean selectOtherTypeRefundRecordNum(Long orderId) {
        int num = orderRefundsRecordMapper.selectOtherTypeRefundRecordNum(orderId);
        if (num > 0){
            return ResultBean.getSuccessResult(1);
        }else{
            return ResultBean.getSuccessResult(0);
        }
    }

    private OrderRefundsRecord initRecord(List<TouristTicketDTO> ticketList,Order order) {
        OrderRefundsRecord record = new OrderRefundsRecord();
        StringBuilder sb = new StringBuilder();
        StringBuilder ticketInfoStr = new StringBuilder();
        BigDecimal applyAmount = BigDecimal.ZERO;
        for (TouristTicketDTO info : ticketList){
            sb.append(info.getTouristId()).append(",");
            applyAmount = applyAmount.add(info.getTicketPrice());
            ticketInfoStr.append(info.getTouristName()).append(" ").append(info.getCategoryName()).append("-").append(info.getTicketName()).append("  票价：￥").append(info.getTicketPrice()).append("<br>");
        }
        BigDecimal orderAlreadyPayAmount = order.getoRealPay().subtract(order.getoUnPay());
        applyAmount = orderAlreadyPayAmount.multiply(applyAmount).divide(order.getoRealPay(),2,RoundingMode.HALF_DOWN);
        record.setTicketInfo(ticketInfoStr.toString());
        record.setApplyAmount(applyAmount);
        record.setTouristsId(sb.substring(0,sb.length()-1));
        return record;
    }

    private void updateOrderRefundStatus(Long orderId){
        Order order = orderMapper.selectByPrimaryKey(orderId);
        if(order.getRefundStatus() == 0){
            orderMapper.updateRefundStatusById(orderId);
        }
    }

	/**
	 *	 退款退票模式按照订单所有票中选中票的比例退款，其他退款 按照固定金额退款
		
		 退票模式需要修改的点
		 订单表的订单人数、退款金额、退款状态、未付金额字段；
		订单退款申请表 该订单的最新申请记录的实际退款金额；
		  订单游客表的游客状态；
		 订单价格详情表 订单票的数量、总金额
		 班期表 余座
		 
		 其他模式需要修改的点
		 订单表的退款金额、退款状态、未付金额字段；（人数不动）
		 订单退款申请表 该订单的最新申请记录的实际退款金额；
		 
	 */
	@Override
	@Transactional
	public ResultBean confirmOrderRefund(OrderRefundRecordConfirmVO vo) {
		
		//获取相关数据
		Long orderId = vo.getOrderId();
		//根据orderId查询全部退款记录
		List<OrderRefundsRecord> orderRefundsRecords = orderRefundsRecordMapper.selectByOrderId(orderId);
    	//计算累计申请退款
		BigDecimal totalApplyrefundAmount= BigDecimal.ZERO;
    	for(OrderRefundsRecord orderRefundsRecord: orderRefundsRecords){
    		if(!orderRefundsRecord.getStatus().equals(Integer.valueOf(0))){
    			totalApplyrefundAmount=totalApplyrefundAmount.add(orderRefundsRecord.getApplyAmount());
    		}
    	}
		//通过订单id查询订单
		Order order =  orderMapper.selectByPrimaryKey(orderId);
        BigDecimal vosrefundAmount = vo.getRefundAmount();
		BigDecimal refundAmount = vosrefundAmount.add(order.getRefundAmount());
		BigDecimal getoUnPay = order.getoUnPay();
		BigDecimal orderArleadyPayAmount = order.getoRealPay().subtract(getoUnPay);
		if (refundAmount.compareTo(orderArleadyPayAmount)>0) {
            //如果退款金额大于实付金额 返回
            return new ResultBean("-1","确认退款金额过大!");
        }
        OrderRefundsRecord lastOrderRefundsRecord = orderRefundsRecords.get(0);
        //参数校验
        if(vosrefundAmount.compareTo(lastOrderRefundsRecord.getApplyAmount())>0){
        	//累计申请退款金额大于实付金额 返回
        	return new ResultBean("-1","确认退款金额过大!");
        }
        List<TouristTicketDTO> ticketList = null;
		if(lastOrderRefundsRecord.getTouristsId()!=null){//退票模式，此时有游客、票信息
            ticketList = refundAmountByTicket(orderId, order, getoUnPay,
					orderArleadyPayAmount, lastOrderRefundsRecord);
             
        }else{//其他模式
        	//更新订单表的退款金额、退款状态、未付金额字段；（人数不动）
        	//累计申请金额小于订单总金额 表示部分退款否则表示全退
        	if(totalApplyrefundAmount.equals(order.getoRealPay())){
        		order.setRefundStatus(3);
        	}else{
        		order.setRefundStatus(2);
        	}
        	BigDecimal needPay = getoUnPay.subtract(lastOrderRefundsRecord.getApplyAmount());
			order.setoUnPay(needPay.compareTo(BigDecimal.ZERO)>0?needPay:BigDecimal.ZERO);
        }
		//更新订单退款金额
		order.setRefundAmount(refundAmount);
		//更新订单退款申请表 该订单的最新申请记录的实际退款金额
		lastOrderRefundsRecord.setRefundAmount(vosrefundAmount);
		lastOrderRefundsRecord.setRefundableSalerId(vo.getPuserId());
		lastOrderRefundsRecord.setRefundableSalerName(vo.getpURealName());
		lastOrderRefundsRecord.setStatus(2);
		lastOrderRefundsRecord.setRefundableTime(new Date());
		//入库
		Order negOrder = persistenceData(vo, order, lastOrderRefundsRecord);

		syncRefundOrder(order,negOrder,lastOrderRefundsRecord,ticketList);

		return  ResultBean.getSuccessResult();
	}

    /**
     * 退票退款同步商城返佣信息
     * @param order
     * @param negOrder
     * @param lastOrderRefundsRecord
     * @param ticketList
     */
	private void syncRefundOrder(Order order, Order negOrder, OrderRefundsRecord lastOrderRefundsRecord, List<TouristTicketDTO> ticketList){
	    Map<String,Object> map = new HashMap<>();
        map.put("orderNo", order.getoOrderNo());
        map.put("refundUserId", lastOrderRefundsRecord.getRefundableBuyerId());
        map.put("refundUserName", lastOrderRefundsRecord.getRefundableBuyerName());
        map.put("refundDate", lastOrderRefundsRecord.getRefundableTime());
        map.put("refundMoney", lastOrderRefundsRecord.getRefundAmount());
        if (lastOrderRefundsRecord.getTouristsId()!=null){
            map.put("refundType", 1);
            map.put("refundDesc", "退票");
            OrderDetailDTO negOrderDetail = orderService.getOrderDetail(negOrder);
            Map refundOrder = transOrderFromDetail(negOrderDetail);
            map.put("refundOrder", refundOrder);
        }else{
            map.put("refundType", 2);
            map.put("refundDesc", "退款");
        }
        JSONObject jsonObject = EncodingObjectWithMd5Utils.encoding(map);
        logger.info("退票同步接口，入参：" + jsonObject.toJSONString());
        String url = tuijieqianzhui2 + "order-service/order/refundOrder";
        JSONObject result = HttpClientUtils.httpPost(url, (Map) jsonObject);
        logger.info("退票同步接口，返回：" + JSON.toJSONString(result));
        if (!"200".equals(result.get("code"))) {
            throw new RuntimeException("退票同步商城失败！");
        }
    }

    private Map transOrderFromDetail(OrderDetailDTO orderDetail) {
        Map order = new HashMap();
        order.put("system", 1);
        order.put("source", 1);
        order.put("orderNo", orderDetail.getoOrderNo());
        order.put("userUid", orderDetail.getoBuyerId());
        order.put("userName", orderDetail.getoBuyerName());
        order.put("orgId", orderDetail.getoBuyerCompanyId());
        order.put("shpOrderId", orderDetail.getId());

        Map orderExtend = new HashMap();
        orderExtend.put("peopleNum", orderDetail.getoPeopleNum());
        orderExtend.put("groupOrderNo", orderDetail.getoGroupOrderNo());
        orderExtend.put("startDate", orderDetail.getsCalendar());
        orderExtend.put("endDate", orderDetail.getsCalendarBack());
        orderExtend.put("salerId", orderDetail.getoSalerId());
        orderExtend.put("salerPhone", orderDetail.getSalerPhone());
        orderExtend.put("salerName", orderDetail.getoSalerName());
        orderExtend.put("salerCompanyId", orderDetail.getoSalerCompanyId());
        orderExtend.put("salerCompanyName", orderDetail.getoSalerCompanyName());
        orderExtend.put("contractAgreement", "");
        order.put("orderExtend", orderExtend);

        Map orderItem = new HashMap();
        orderItem.put("productCode", orderDetail.getpNo());
        orderItem.put("productName", orderDetail.getpName());
        orderItem.put("productId", orderDetail.getoProductId());
        orderItem.put("scheduleId", orderDetail.getoScheduleId());
        orderItem.put("num", orderDetail.getoPeopleNum());
        orderItem.put("price", orderDetail.getoRealPrice());
        List<Map> orderItems = Arrays.asList(orderItem);
        order.put("orderItems", orderItems);

        List<Map> priceDetails = new ArrayList<>();
        for (OrderPriceDetailDTO dtl : orderDetail.getPriceDetails()) {
            Map pdt = new HashMap();
            pdt.put("ticketId", dtl.getOpTicketId());
            pdt.put("priceName", dtl.getOpPriceName());
            pdt.put("categoryName", dtl.getCategoryName());
            pdt.put("categoryId", dtl.getCategory());
            pdt.put("num", dtl.getOpNum());
            pdt.put("price", dtl.getOpPrice());
            pdt.put("totalPrice", dtl.getOpTotalPrice());
            pdt.put("type", 1);
            priceDetails.add(pdt);
        }
        order.put("orderPriceDetailList", priceDetails);

        List<Map> tourists = new ArrayList<>();
        for (OrderTouristDTO tour : orderDetail.getTourists()) {
            Map t = new HashMap();
            t.put("ticketId", tour.getOtTicketId());
            t.put("ticketName", tour.gettName());
            t.put("ticketType", tour.getOtTicketType());
            t.put("type", tour.getOtType());
            t.put("name", tour.getOtName());
            t.put("phone", tour.getOtPhone());
            t.put("licenceType", tour.getOtLicenceType());
            t.put("lincese", tour.getOtLincese());
            t.put("rep", tour.getOtRep());
            t.put("leaveId", tour.getOtLeaveId());
            t.put("leaveName", tour.getLvDepartureName());
            t.put("leaveType", tour.getOtLeaveType());
            t.put("leavePrice", tour.getOtLeavePrice());
            t.put("returnId", tour.getOtReturnId());
            t.put("returnName", tour.getRtDepartureName());
            t.put("returnType", tour.getOtReturnType());
            t.put("returnPrice", tour.getOtReturnPrice());

            tourists.add(t);
        }
        order.put("orderTourists", tourists);

        order.put("remark", orderDetail.getoRemark());
        order.put("type", 1);
        order.put("totalAmount", orderDetail.getoRealPrice());
        return order;
    }

    /** 
	 * @Description: 数据入库
	 * @author 王斌
	 * @date 2018年3月23日 下午3:25:27
	 * @param vo
	 * @param order
	 * @param lastOrderRefundsRecord
	 */
	private Order persistenceData(OrderRefundRecordConfirmVO vo, Order order,
			OrderRefundsRecord lastOrderRefundsRecord) {
		orderMapper.updateByPrimaryKeySelective(order);
		//orderRefundsRecordMapper.updateByPrimaryKeySelective(lastOrderRefundsRecord);
        taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncOrderRefundsRecord(MQTransformationUtils.transOrderRefundsRecord(lastOrderRefundsRecord)));
        //添加订单日志
        insertOrderLogs(vo);
        Order negOrder=null;
        if(lastOrderRefundsRecord.getTouristsId()!=null){//退票模式，此时有游客、票信息
	        //生成负订单
	        OrderDetailDTO orderDetail = orderService.getOrderDetail(order);
	        //修改游客信息
	        List<Long> tids = Stream.of(lastOrderRefundsRecord.getTouristsId().split(",")).map(t->Long.valueOf(t)).collect(Collectors.toList());
	        List<OrderTouristDTO> tourists = orderDetail.getTourists().stream().filter(t->tids.contains(t.getId())).collect(Collectors.toList());
			orderDetail.setTourists(tourists);
	        //修改游客对应的票信息
	        List<OrderPriceDetailDTO> priceDetails  = orderTouristMapper.selectPriceDetailsByTids(tids,order.getId());
	        BigDecimal total=BigDecimal.ZERO;
	        for(OrderPriceDetailDTO pd:priceDetails ){
	        	for(OrderTouristDTO ot:tourists){
	        		if(pd.getOpTicketId().equals(ot.getOtTicketId())){
	        			pd.setOpNum(pd.getOpNum()+1);
	        			BigDecimal add = pd.getOpTotalPrice().add( pd.getOpPrice());
						pd.setOpTotalPrice(add);
	        			total= total.add(add);
	        		}
	        	}
	        }
			orderDetail.setPriceDetails(priceDetails);
			//设置订单人数 金额
			Integer peopleNum=0;
			for(OrderPriceDetailDTO item:priceDetails){
				peopleNum += item.getOpNum();
			}
			orderDetail.setoMarketPrice(total);
			orderDetail.setoRealPay(total);
			orderDetail.setoRealPrice(total);
			orderDetail.setoTotalPrice(total);
			orderDetail.setoPeopleNum(peopleNum);
			negOrder =  orderAlterTicketService.genNegOrder(order, orderDetail);
			lastOrderRefundsRecord.setNegOrderId(negOrder.getId());
			lastOrderRefundsRecord.setNegOrderNo(negOrder.getoOrderNo());
			 
        }
        this.updateOrderRefund(lastOrderRefundsRecord);
		return negOrder;
	}

	/** 
	 * @Description: 根据票退款逻辑处理
	 * @author 王斌
	 * @date 2018年3月23日 下午3:21:36
	 * @param orderId
	 * @param order
	 * @param getoUnPay
	 * @param orderArleadyPayAmount
	 * @param lastOrderRefundsRecord
     * @return 把票相关的信息返回 供同步使用
	 */
	private List<TouristTicketDTO>  refundAmountByTicket(Long orderId, Order order,
			BigDecimal getoUnPay, BigDecimal orderArleadyPayAmount,
			OrderRefundsRecord lastOrderRefundsRecord) {
		//查询退款游客信息
		List<Long> touristIds = new ArrayList<>();
		String[] TouristIdsString = lastOrderRefundsRecord.getTouristsId().split(",");
		 for(String id:TouristIdsString){
			 touristIds.add(Long.valueOf(id));
		 }
		 //游客票价信息
		 List<TouristTicketDTO> ticketList = orderTouristMapper.selectTouristTicketByIds(touristIds);
		 //查询订单的全部游客信息
		 List<TouristTicketDTO> allTicketList = orderTouristMapper.selectTouristTicketByOrderId(orderId);
		 //退款票数和总票数相同表示全退
		// 更新订单表的订单人数、退款金额、退款状态、未付金额字段；
		 //计算退款票的总人数
		 int refundPeopleNum=0;
	       List<Map> list = new ArrayList<>();
		 for(TouristTicketDTO touristTicketDTO : ticketList){
			 refundPeopleNum += touristTicketDTO.getPeopleNum();
			 Map map = new HashMap();
             map.put("scheduleId", touristTicketDTO.getScheduleId());
             map.put("ticketId", touristTicketDTO.getTicketId());
             map.put("stockChange", -1);
             list.add(map);
		 }
		 //设置  人数、退款状态
		 if(ticketList.size()==allTicketList.size()){
			 order.setoPeopleNum(0);//人数
			 order.setRefundStatus(3);//退款状态
		 }else{
			 order.setoPeopleNum(order.getoPeopleNum()- refundPeopleNum);//人数
			 order.setRefundStatus(2);//退款状态
		 }
		 //计算申请退款的票已付的金额
		 BigDecimal alreadyPayAmount=BigDecimal.ZERO;
		 /*设置
		  *订单游客表的游客状态；
		  *订单价格详情表 订单票的数量、总金额
		  *班期表 余座
		  */
		 orderTouristMapper.deleteList(touristIds);
		 //计算退款票合计
		 BigDecimal totalApplayrefundPriceTotal=BigDecimal.ZERO;
		for(TouristTicketDTO ticket:ticketList){
			totalApplayrefundPriceTotal= totalApplayrefundPriceTotal.add(ticket.getTicketPrice());
//			orderPriceDetailMapper.updateNumById(orderId, ticket.getTicketId(), 1);
		}
		//首付款类型 1:固定金额(每人) 2:百分比(订单总额)
		//计算已付金额中退款票所占的金额   =订单已付金额*(合计各张票退票*单价/订单已付金额)
		alreadyPayAmount=orderArleadyPayAmount.multiply(totalApplayrefundPriceTotal).divide(order.getoRealPay(),2,RoundingMode.HALF_DOWN);
		
		//设置 未付金额 未付金额=未付金额-（申请票退款金额-申请票已付金额）
		order.setoUnPay(getoUnPay.subtract(totalApplayrefundPriceTotal.subtract(alreadyPayAmount)));
		 //scheduleMapper.updateSeatSoldById(order.getoScheduleId(),refundPeopleNum);
		//减库存
		scheduleTicketMapperDiy.updateTicketStock(list);

		return ticketList;
	}
    /** 
     * @Description: 保存订单操作日志
     * @author 王斌
     * @date 2018年3月23日 下午4:24:35
     * @param vo
     */
    private void insertOrderLogs(OrderRefundRecordConfirmVO vo) {
        OrderLogs logs = new OrderLogs();
        logs.setOlOrderId(vo.getOrderId());
        //查询订单公司名称
        String cName = orderMapper.selectByOrder(vo.getOrderId());
        logs.setOlCompanyName(cName);
        logs.setOlStatus(true);
        logs.setOlOrderStatus(4);
        logs.setOlOperater(vo.getpURealName());
        logs.setOlOperateDetail("订单退款确认");
        orderLogsMapper.insert(logs);
    }
}
