package com.jdy.b2b.api.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.common.EncodingObjectWithMd5Utils;
import com.jdy.b2b.api.common.HttpClientUtils;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.*;
import com.jdy.b2b.api.dao.alterTicket.OrderAlterTicketRecordMapper;
import com.jdy.b2b.api.dao.alterTicket.OrderAlterTicketTouristRecordMapper;
import com.jdy.b2b.api.dao.diy.OrderPriceDetailMapperDiy;
import com.jdy.b2b.api.dao.diy.OrderTouristMapperDiy;
import com.jdy.b2b.api.dao.diy.ScheduleTicketMapperDiy;
import com.jdy.b2b.api.dao.schedule.ScheduleSettingMapper;
import com.jdy.b2b.api.dao.ticket.TicketMapper;
import com.jdy.b2b.api.dao.user.UserMapper;
import com.jdy.b2b.api.model.*;
import com.jdy.b2b.api.model.alterTicket.*;
import com.jdy.b2b.api.model.diy.*;
import com.jdy.b2b.api.model.schedule.ScheduleSetting;
import com.jdy.b2b.api.model.ticket.Ticket;
import com.jdy.b2b.api.model.user.User;
import com.jdy.b2b.api.service.OrderAlterTicketService;
import com.jdy.b2b.api.service.OrderOperationService;
import com.jdy.b2b.api.service.OrderService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

import static com.jdy.b2b.api.enums.OrderStatusEnum.PAYED;
import static org.apache.commons.lang3.StringUtils.isBlank;

/**
 * Created by strict on 2018/4/20.
 */
@Service
public class OrderAlterTicketServiceImpl extends BaseService implements OrderAlterTicketService {
    @Value("${changsha.tuijieqianzhui2}")
    String tuijieqianzhui2;

    @Autowired
    private OrderAlterTicketRecordMapper orderAlterTicketRecordMapper;
    @Autowired
    private OrderAlterTicketTouristRecordMapper recordTouristMapper;
    @Autowired
    private OrderMapper orderMapper;
    @Autowired
    private OrderOperationService orderOperationService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private OrderLogsMapper orderLogsMapper;
    @Autowired
    private OrderTouristMapper orderTouristMapper;
    @Autowired
    private OrderTouristMapperDiy orderTouristMapperDiy;
    @Autowired
    private OrderPriceDetailMapperDiy orderPriceDetailMapperDiy;
    @Autowired
    private OrderPayMapper orderPayMapper;
    @Autowired
    private OrderNegMapper orderNegMapper;
    @Autowired
    private ScheduleTicketMapperDiy scheduleTicketMapperDiy;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private OrderAlterTicketTouristRecordMapper orderAlterTicketTouristRecordMapper;
    @Autowired
    private ScheduleSettingMapper scheduleSettingMapper;
    @Autowired
    private TicketMapper ticketMapper;

    @Override
    public ResultBean getAlterTicketList(OrderAlterTicketRecord vo) {
        if (vo.getCurrPage() != null && vo.getPageSize() != null) {
            PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
        } else {
            PageHelper.startPage(1, 20);
        }
        PageInfo<OrderAlterTicketWithTouristDTO> pageInfo = new PageInfo<>(orderAlterTicketRecordMapper.selectWithTouristInfoByOrderId(vo));

        return ResultBean.getSuccessResult(pageInfo);
    }

    /**
     * 确认改签
     */
    @Override
    @Transactional
    public ResultBean changeTicket(OrderAlterVo vo) {
        logger.info("订单确认改签：" + JSON.toJSONString(vo));
        OrderAlterTicketRecord r = orderAlterTicketRecordMapper.selectByPrimaryKey(vo.getAlterId());
        Assert.isTrue(r != null && 0 == r.getStatus(), "改签记录异常");

        //取消
        if (vo.getStatus() == 2) {
            OrderAlterTicketRecord newR = new OrderAlterTicketRecord();
            newR.setId(r.getId());
            newR.setStatus(2);
            int i = orderAlterTicketRecordMapper.updateByPrimaryKeySelective(newR);
            if (i > 0) {
                return ResultBean.getSuccessResult();
            } else {
                return ResultBean.getErrorResult("取消改签记录失败");
            }
        }

        Order o = orderMapper.selectByPrimaryKey(r.getOrderId());
        Assert.isTrue(o != null && PAYED.equals(o.getoStatus()) && BigDecimal.ZERO.compareTo(o.getoUnPay()) == 0, "订单状态异常");
        Assert.isTrue(o.getSrcOrderId() == null, "订单暂时仅支持改签一次");
        ScheduleSetting ss = scheduleSettingMapper.selectByGroup_no(o.getoGroupOrderNo());
        Assert.isTrue(ss != null && (ss.getDepartureStatus() == 0 || ss.getDepartureStatus() == -1), "团期不是未发团或待确认出行状态！");

        List<OrderAlterTicketTouristRecord> alterTourists = recordTouristMapper.selectListByRecordId(r.getId());
        for (OrderAlterTicketTouristRecord tr : alterTourists) {
            if (!tr.getNowPrice().equals(tr.getOldPrice())) {
                return ResultBean.getErrorResult("改签票价与原价不一致！");
            }
            if (isBlank(tr.getTouristName()) || isBlank(tr.getTouristLincese())) {
                return ResultBean.getErrorResult("改签游客信息不完善！");
            }
        }
        //相关记录修改
        updateRelates(vo, o, r, alterTourists);

        return ResultBean.getSuccessResult("确认改签成功！");
    }

    private void updateRelates(OrderAlterVo vo, Order o, OrderAlterTicketRecord r, List<OrderAlterTicketTouristRecord> alterTourists) {
        Map mmp = new HashMap();
        mmp.put("touristIds", alterTourists.stream().map(t -> t.getTouristId()).collect(Collectors.toList()));
        mmp.put("extStatus", 2);//改签
        Assert.isTrue(orderTouristMapper.updateExtStatus(mmp) == alterTourists.size(), "修改源订单游客扩展状态失败");

        List<OrderPriceDetailDTO> prices = orderPriceDetailMapperDiy.selectOrderPriceListByOrder(o);
        for (OrderAlterTicketTouristRecord t : alterTourists) {
            List<Map> schTk = new ArrayList<>();
            Map map = new HashMap<>();
            map.put("stockChange", -1);
            map.put("scheduleId", o.getoScheduleId());
            map.put("ticketId", t.getTicketId());
            schTk.add(map);
            scheduleTicketMapperDiy.updateTicketStock(schTk);
        }

        saveOrderLog(o, alterTourists);
        OrderTourist ot = new OrderTourist();
        ot.setOtOrderId(o.getId());
        List<OrderTourist> otList = orderTouristMapperDiy.selectList(ot);

        //下新订单
        OrderAddDTO dto = constructNewOrder(o, r, alterTourists, otList, prices);
        ResultBean bean = orderOperationService.addOrder(dto);
        if (bean.isFail()) {
            throw new RuntimeException(bean.getMessage());
        }
        Long newOrderId = bean.getId()[0];

        //更新新订单
        updateNewOrder(newOrderId, r, o);

        Order od = new Order();
        od.setId(newOrderId);
        OrderDetailDTO orderDetail = orderService.getOrderDetail(od);

        //生成负订单
        Order negOrder = genNegOrder(o, orderDetail);

        //生成新订单支付记录
        insertNewOrderPay(orderDetail, o);
        //更新改签记录
        updateAlterRecord(r, orderDetail, vo.getStatus(), negOrder);
        //远程退票,改签
        synchChangeTicketForFxMall(o, orderDetail,negOrder, alterTourists, r);
    }

    @Override
    public Order genNegOrder(Order o, OrderDetailDTO orderDetail) {

        //负订单关系记录
        OrderNeg negRecord = genOrderNegRecord(o);

        Order negOrder = new Order();
        BeanUtils.copyProperties(o, negOrder);
        negOrder.setId(null);
        negOrder.setoOrderNo(OrderOperationServiceImpl.generateOrderNo());
        negOrder.setoRemark("系统自动生成的负订单");
        negOrder.setoPeopleNum(-orderDetail.getoPeopleNum());
        negOrder.setoTotalPrice(orderDetail.getoTotalPrice().negate());
        negOrder.setoRealPrice(orderDetail.getoRealPrice().negate());
        negOrder.setoMarketPrice(orderDetail.getoMarketPrice().negate());
        negOrder.setoRealPay(orderDetail.getoRealPay().negate());
        negOrder.setAlterTicketId(null);
        negOrder.setOrderNegId(negRecord.getId());
        negOrder.setSrcOrderId(o.getSrcOrderId()==null?o.getId():o.getSrcOrderId());//如果是改签过的订单，生成负订单也需要指向源订单
        negOrder.setCreateTime(new Date());
        orderMapper.insertSelective(negOrder);

        genNegOrderLog(negOrder);
        genNegOrderPay(negOrder);
        genNegOrderPriceDetail(negOrder, orderDetail);
        genNegOrderTourists(negOrder, orderDetail);

        //更新负订单记录里的订单id
        updateOrderNegRecord(negOrder, negRecord);

        return negOrder;
    }

    private void genNegOrderTourists(Order negOrder, OrderDetailDTO orderDetail) {
        List<OrderTouristAddVO> ts = orderDetail.getTourists().stream().map(t -> {
            OrderTouristAddVO t2 = new OrderTouristAddVO();
            BeanUtils.copyProperties(t, t2);
            t2.setId(null);
            t2.setOtExtStatus(1);//退票状态
            return t2;
        }).collect(Collectors.toList());
        ts.forEach(t -> t.setOtOrderId(negOrder.getId()));
        int i = orderTouristMapperDiy.batchInsertOrderTourist(ts);
        if (i != ts.size()) {
            throw new RuntimeException("保存负订单游客信息失败！");
        }
    }

    private void genNegOrderPriceDetail(Order negOrder, OrderDetailDTO orderDetail) {
        List<OrderPriceDetailVO> pd = orderDetail.getPriceDetails().stream().map(p -> {
            OrderPriceDetailVO p2 = new OrderPriceDetailVO();
            BeanUtils.copyProperties(p, p2);
            p2.setOpPrice(p2.getOpPrice().negate());
            p2.setOpTotalPrice(p2.getOpTotalPrice().negate());
            p2.setId(null);
            return p2;
        }).collect(Collectors.toList());
        pd.forEach(d -> d.setOpOrderId(negOrder.getId()));
        int i = orderPriceDetailMapperDiy.batchInsertOrderPriceDetails(pd);
        if (i != pd.size()) {
            throw new RuntimeException("保存负订单价格详情失败！");
        }
    }

    private void genNegOrderPay(Order negOrder) {
        OrderPay pay = new OrderPay();
        pay.setOpOrderId(negOrder.getId());
        pay.setOpComments("负订单生成支付记录");
        pay.setoIsmerge(true);
        pay.setOpPayTime(new Date());
        pay.setOpOprater("system");
        pay.setOpPayMethod(negOrder.getoPayMethod());
        pay.setOpPayAmount(negOrder.getoRealPay());
        orderPayMapper.insertSelective(pay);
    }

    private void genNegOrderLog(Order negOrder) {
        OrderLogs log = new OrderLogs();
        log.setOlOrderId(negOrder.getId());
        log.setOlRemark("负订单生成");
        log.setOlOperater("system");
        log.setOlOrderStatus(negOrder.getoStatus());
        log.setOlStatus(true);
        log.setOlCompanyName(negOrder.getoSalerCompanyName());
        Assert.isTrue(orderLogsMapper.insertSelective(log) == 1, "负订单日志保存失败");
    }

    //更新负订单关系记录
    private void updateOrderNegRecord(Order negOrder, OrderNeg orderNegRecord) {
        OrderNeg neg = new OrderNeg();
        neg.setId(orderNegRecord.getId());
        neg.setNegOrderId(negOrder.getId());
        neg.setNegOrderNo(negOrder.getoOrderNo());
        orderNegMapper.updateByPrimaryKeySelective(neg);
    }

    private OrderNeg genOrderNegRecord(Order o) {
        OrderNeg neg = new OrderNeg();
        neg.setOrderId(o.getId());
        neg.setType(2);
        orderNegMapper.insertSelective(neg);
        return neg;
    }

    private void insertNewOrderPay(OrderDetailDTO orderDetail, Order o) {
        OrderPay pay = new OrderPay();
        pay.setOpOrderId(orderDetail.getId());
        pay.setOpComments("改签生成支付记录");
        pay.setoIsmerge(true);
        pay.setOpPayTime(new Date());
        pay.setOpOprater("system");
        pay.setOpPayMethod(o.getoPayMethod());
        pay.setOpPayAmount(orderDetail.getoRealPay());
        orderPayMapper.insertSelective(pay);
    }

    private void synchChangeTicketForFxMall(Order o, OrderDetailDTO orderDetail, Order negOrder, List<OrderAlterTicketTouristRecord> alterTourists, OrderAlterTicketRecord r) {
        User refunder = userMapper.queryForUserByIdSingle(r.getCreateUser());

        Map map = new HashMap();
        map.put("orderNo", o.getoOrderNo());
        map.put("refundMoney", "0");
        map.put("refundType", 3);
        map.put("rescheduleOrderNo", orderDetail.getoOrderNo());
        map.put("refundUserId", r.getCreateUser());
        map.put("refundUserName", refunder != null ? refunder.getuRealName() : "");
        map.put("refundDate", new Date());
        map.put("refundDesc", "退票");

        List<Map> list = ticketMapper.getCategoryAndNameByTickets(alterTourists.stream().map(t -> t.getTicketId()).collect(Collectors.toList()));
        List<Map> tickets = new ArrayList<>(alterTourists.size());
        for (OrderAlterTicketTouristRecord t : alterTourists) {
            Map tour = new HashMap();
            tour.put("ticketId", t.getTicketId());
            tour.put("priceName", t.getTicketName());
            tour.put("num", "1");
            tour.put("price", t.getOldPrice().toString());
            Optional<Map> op = list.stream().filter(c -> t.getTicketId().equals(c.get("ticketId"))).findFirst();
            tour.put("categoryId", op.isPresent() ? op.get().get("categoryId") : "");
            tour.put("categoryName", op.isPresent() ? op.get().get("categoryName") : "");
            tickets.add(tour);
        }
        map.put("ticket", tickets);

        //新订单
        Map rescheduleOrder = transOrderFromDetail(orderDetail);
        map.put("rescheduleOrder", rescheduleOrder);

        //负订单
        OrderDetailDTO negOrderDetail = orderService.getOrderDetail(negOrder);
        Map refundOrder = transOrderFromDetail(negOrderDetail);
        map.put("refundOrder", refundOrder);

        JSONObject jsonObject = EncodingObjectWithMd5Utils.encoding(map);
        logger.info("改签同步接口，入参：" + jsonObject.toJSONString());
        String url = tuijieqianzhui2 + "order-service/order/refundOrder";
        JSONObject result = HttpClientUtils.httpPost(url, (Map) jsonObject);
        logger.info("改签同步接口，返回：" + JSON.toJSONString(result));
        if (!"200".equals(result.get("code"))) {
            throw new RuntimeException("改签同步商城失败！");
        }

    }

    private Map transOrderFromDetail(OrderDetailDTO orderDetail) {
        Map<String,Object> order = new HashMap();
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
            Map<String,Object> pdt = new HashMap();
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
            Map<String,Object> t = new HashMap();
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

    private void updateNewOrder(Long id, OrderAlterTicketRecord r, Order o) {
        Order od = new Order();
        od.setId(id);
        od.setoStatus(PAYED.getValue());
        od.setAlterTicketId(r.getId());
        od.setSrcOrderId(o.getId());
        od.setoPayMethod(o.getoPayMethod());
        od.setoPayTime(new Date());
        od.setoSynchro(true);
        od.setoUnPay(BigDecimal.ZERO);//如果新生成的订单是首付款方式，尾款设置成0
        orderMapper.updateByPrimaryKeySelective(od);
    }

    private void updateAlterRecord(OrderAlterTicketRecord r, OrderDetailDTO newOrder, Integer status, Order negOrder) {
        OrderAlterTicketRecord newR = new OrderAlterTicketRecord();
        newR.setId(r.getId());
        newR.setNewOrderId(newOrder.getId());
        newR.setNewOrderNo(newOrder.getoOrderNo());
        newR.setNegOrderId(negOrder.getId());
        newR.setNegOrderNo(negOrder.getoOrderNo());
        newR.setStatus(status);
        orderAlterTicketRecordMapper.updateByPrimaryKeySelective(newR);
    }

    private OrderAddDTO constructNewOrder(Order o, OrderAlterTicketRecord r, List<OrderAlterTicketTouristRecord> alterTourists, List<OrderTourist> otList, List<OrderPriceDetailDTO> prices) {
        OrderAddDTO dto = new OrderAddDTO();
        dto.setoScheduleId(r.getTargetScheduleId());
        dto.setoBuyerId(o.getoBuyerId());
        dto.setoBuyerName(o.getoBuyerName());
        dto.setoBuyerCompanyId(o.getoBuyerCompanyId());
        dto.setoBuyerCompanyName(o.getoBuyerCompanyName());
        dto.setoRemark("改签订单");
        List<OrderPriceDetailVO> odPrices = contructPrices(prices, alterTourists);
        List<OrderTouristAddVO> odTourts = constructTourists(alterTourists, otList);
        dto.setPriceDetails(odPrices);
        dto.setTourists(odTourts);
        return dto;
    }

    private List<OrderTouristAddVO> constructTourists(List<OrderAlterTicketTouristRecord> alterTourists, List<OrderTourist> otList) {
        List<OrderTouristAddVO> newList = new ArrayList<>(alterTourists.size());
        for (OrderAlterTicketTouristRecord tr : alterTourists) {
            for (OrderTourist t : otList) {
                if (tr.getTouristId().equals(t.getId())) {
                    OrderTouristAddVO newT = new OrderTouristAddVO();
                    BeanUtils.copyProperties(t, newT);
                    newT.setId(null);
                    newT.setOtOrderId(null);
                    newT.setOtStatus(0);
                    newT.setOtExtStatus(0);
                    newList.add(newT);
                }
            }
        }
        return newList;
    }

    private List<OrderPriceDetailVO> contructPrices(List<OrderPriceDetailDTO> prices, List<OrderAlterTicketTouristRecord> alterTourists) {
        List<OrderPriceDetailVO> newDetails = new ArrayList<>();
        for (OrderAlterTicketTouristRecord t : alterTourists) {
            for (OrderPriceDetailDTO detail : prices) {
                if (detail.getOpTicketId().equals(t.getTicketId())) {
                    for (OrderPriceDetailVO vo : newDetails) {
                        if (vo.getOpTicketId().equals(t.getTicketId())) {
                            vo.setOpNum(vo.getOpNum() + 1);
                            break;
                        }
                    }
                    OrderPriceDetailVO pd = new OrderPriceDetailVO();
                    pd.setOpTicketId(t.getTicketId());
                    pd.setOpPriceName(detail.getOpPriceName());
                    pd.setOpType(0);
                    pd.setOpNum(1);
                    pd.setOpPrice(BigDecimal.ZERO);
                    pd.setOpTotalPrice(BigDecimal.ZERO);
                    newDetails.add(pd);
                }
            }
        }
        return newDetails;
    }

    private void saveOrderLog(Order o, List<OrderAlterTicketTouristRecord> alterTourists) {
        OrderLogs log = new OrderLogs();
        log.setOlOrderId(o.getId());
        log.setOlRemark("订单改签");
        log.setOlOperateDetail("游客改签：[" + alterTourists.stream().map(t -> t.getTouristName()).collect(Collectors.joining(",")) + "]");
        log.setOlOperater("system");
        log.setOlOrderStatus(o.getoStatus());
        log.setOlStatus(true);
        log.setOlCompanyName(o.getoSalerCompanyName());
        Assert.isTrue(orderLogsMapper.insertSelective(log) == 1, "订单日志保存失败");
    }

    @Override
    public ResultBean getAlterTicketRecord(Long alterId) {
        return ResultBean.getSuccessResult(orderAlterTicketRecordMapper.selectRecordWithTouristByAlterId(alterId));
    }

    @Override
    @Transactional
    public ResultBean applyAlterTicketRecord(OrderAlterTicketWithTouristDTO vo) {
        //1 根据游客信息+目标班期id 查找目标团期
        if (vo.getTouristInfo() != null && vo.getTouristInfo().size() > 0) {
            OrderAlterTicketTouristRecord firstTourist = vo.getTouristInfo().get(0);
            Ticket ticket = ticketMapper.selectByIdOnly(firstTourist.getTicketId());
            if (ticket == null) {
                return ResultBean.getErrorResult("不存在的票无法改签！");
            }
            ScheduleSetting scheduleSetting = scheduleSettingMapper.selectByScheduleIdAndCompanyId(vo.getTargetScheduleId(), null);
            vo.setTargetGroupNo(scheduleSetting.getGroupNo());
            vo.setCreateTime(new Date());
            vo.setCreateUser(vo.getPuserId());
            vo.setStatus(0);
            int flag = orderAlterTicketRecordMapper.insertByDTO(vo);
            if (flag > 0) {
                //2 查询改签的人的姓名，证件号，票名，原价，现价
                Map<Long, OrderAlterTicketPriceChangeDTO> pMap = orderAlterTicketRecordMapper.selectPriceChangeInfoByTouristId(vo);
                for (OrderAlterTicketTouristRecord t : vo.getTouristInfo()) {
                    OrderAlterTicketPriceChangeDTO dto = pMap.get(t.getTouristId());
                    if (dto != null) {
                        if (dto.getOldPrice().compareTo(dto.getNewPrice()) != 0) {
                            throw new RuntimeException("当前改签票价与原票价不一致，不支持改签");
                        }

                        t.setAlterTicketId(vo.getId());
                        t.setTouristName(dto.getTouristName());
                        t.setTouristLincese(dto.getLincese());
                        t.setTicketName(dto.getTicketName());
                        t.setOldPrice(dto.getOldPrice());
                        t.setNowPrice(dto.getNewPrice());
                    }
                }
                orderAlterTicketTouristRecordMapper.batchInsert(vo.getTouristInfo());
                return ResultBean.getSuccessResult();
            }
        }
        return ResultBean.getErrorResult("没有选中改签的票！");
    }
}
