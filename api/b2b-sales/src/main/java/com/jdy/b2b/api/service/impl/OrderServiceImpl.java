package com.jdy.b2b.api.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.LocalDateTimeUtils;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.*;
import com.jdy.b2b.api.dao.diy.OrderLogsMapperDiy;
import com.jdy.b2b.api.dao.diy.OrderMapperDiy;
import com.jdy.b2b.api.dao.diy.OrderPriceDetailMapperDiy;
import com.jdy.b2b.api.dao.diy.OrderTouristMapperDiy;
import com.jdy.b2b.api.dao.orderOffline.OrderOfflineMapper;
import com.jdy.b2b.api.dao.product.ProductMapper;
import com.jdy.b2b.api.dao.schedule.ScheduleSettingMapper;
import com.jdy.b2b.api.dao.user.UserMapper;
import com.jdy.b2b.api.dto.PageInfoExt;
import com.jdy.b2b.api.dto.SyncOrderOfflineResult;
import com.jdy.b2b.api.dto.SyncOrderOfflineVO;
import com.jdy.b2b.api.enums.OrderPayMethodEnum;
import com.jdy.b2b.api.enums.OrderStatusEnum;
import com.jdy.b2b.api.model.*;
import com.jdy.b2b.api.model.company.CompanyTreeDTO;
import com.jdy.b2b.api.model.department.DepartmentTreeDTO;
import com.jdy.b2b.api.model.diy.*;
import com.jdy.b2b.api.model.orderOffline.OrderOffline;
import com.jdy.b2b.api.model.orderRefund.ContractOrder;
import com.jdy.b2b.api.model.schedule.ScheduleSetting;
import com.jdy.b2b.api.service.OrderOperationService;
import com.jdy.b2b.api.service.OrderService;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static com.github.pagehelper.PageHelper.startPage;
import static com.jdy.b2b.api.common.ResultBean.getSuccessResult;
import static com.jdy.b2b.api.enums.OrderStatusEnum.*;
import static com.jdy.b2b.api.enums.UserDataLimitEnum.DATA_LIMIT_SYSTEM;
import static java.util.Objects.nonNull;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.time.DateFormatUtils.format;
import static org.apache.commons.lang3.time.DateUtils.addDays;
import static org.springframework.util.CollectionUtils.isEmpty;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/8/30 11:22
 */
@SuppressWarnings({"unchecked","rawtypes"})
@Service
public class OrderServiceImpl extends BaseService implements OrderService {

	@Autowired
	OrderMapperDiy orderMapperDiy;
	@Autowired
	OrderLogsMapperDiy orderLogsMapperDiy;
	@Autowired
	OrderTouristMapperDiy orderTouristMapperDiy;
	@Autowired
    OrderTouristMapper orderTouristMapper;
	@Autowired
	OrderPriceDetailMapperDiy orderPriceDetailMapperDiy;
	@Autowired
	CompanyMapper companyMapper;
	@Autowired
	DepartmentMapper departmentMapper;
    @Autowired
    private OrderMapper orderMapper;
    @Autowired
    OrderCardMapper orderCardMapper;
    @Autowired
	OrderOfflineMapper orderOfflineMapper;
	@Autowired
	OrderOperationService orderOperationService;
    @Autowired
    private UserMapper userMapper;
    @Autowired
	private ScheduleSettingMapper scheduleSettingMapper;
    @Autowired
    ProductMapper productMapper;

    @Autowired
    @Qualifier("customRestTemplate")
    protected RestTemplate restTemplate;

    @Value("${changsha.tuijieqianzhui}")
    private String fxUrl;

    private static final String EXIST_TOURIST = "游客已添加";
    private static final String NOT_EXIST_ORDER = "该订单不存在";
    private static final String ID_STR = "id";
    private static final String ERROR_ID = "游客id不能为空";
    private static final String ERROR_FIRST_PAY = "支付金额与首付款金额不匹配";
    private static final String ERROR_ALL_PAY = "支付金额与全款金额不匹配";
    private static final String ERROR_LAST_PAY = "支付金额与尾款金额不匹配";
    private static final String REMARK = "线下支付审核调用";
    private static final String ZERO_STR = "0";
    private static final Long specialUserId = 36641l;

    @Override
    public ResultBean searchOrders(OrderSearchVo vo, boolean fromContract) {

        Assert.isTrue(vo.getPcompanyId() != null, "登陆者公司信息错误");
        Long compId;
        // 卖家订单(按公司级别)
        if (vo.getOrderType().equals(0)) {
            if (DATA_LIMIT_SYSTEM.equals(vo.getPuDataLimit())) {
                compId = vo.getoSalerCompanyId();
            } else {
                compId = vo.getPcompanyId();
            }
            if(fromContract) {//合同审核订单列表,这里只显示本公司卖出的订单
                vo.setSalerCompanyIds(Arrays.asList(compId));
            } else {
                //集结产品被集结后，订单的卖家公司可能为其他公司，这里为包含这样的订单
                List<Long> ids = productMapper.selectProductsByCompanyIds(compId);
                if(CollectionUtils.isEmpty(ids)) return ResultBean.getSuccessResult();
                vo.setProductIds(ids);
            }
        }
        // 买家订单(按公司级别)
        if (vo.getOrderType().equals(1)) {
            if (!DATA_LIMIT_SYSTEM.equals(vo.getPuDataLimit())) {
                vo.setoBuyerCompanyId(vo.getPcompanyId());
            }
        }

        if (!vo.getExport() && nonNull(vo.getCurrPage()) && nonNull(vo.getPageSize())) {
            startPage(vo.getCurrPage(), vo.getPageSize());
        }

        /**这里设置的条件需要在selectOrderNumofStatuses归类查询前清空*/
        if (nonNull(vo.getoStatus())) {
            switch (vo.getoStatus()) {
                case 10: {//已首款
                    vo.setoStatus(PAYED.getValue());
                    vo.setUnPay(new BigDecimal(1));
                    break;
                }
                case 3: {//已全款
                    vo.setUnPay(new BigDecimal(-1));
                    break;
                }
                case 11: {//待确认收款
                    vo.setOfflineStatuses(Arrays.asList(0, 3));
                    break;
                }
            }
        }

        Integer cStatus = vo.getContractStatus();
        if (cStatus != null) {
            if (cStatus == 1) {
                vo.setoStatus(TO_CONFIRM.getValue());
            }
            if (cStatus == 3) {
                vo.setoStatus(REJECT.getValue());
            }
        }

		/* 导出不需要分页 */
        if (vo.getExport()) {
            return getSuccessResult(new OrderSearchDTO(orderMapperDiy.searchOrders(vo)));
        } else {
            // 分页在这里进行
            vo.setSearchSrcOrder(1);
            PageInfoExt p = new PageInfoExt(orderMapperDiy.selectOrderIds(vo));
            if (!isEmpty(p.getList())) {
                logger.info("订单列表 ID 集合------------>" + JSONObject.toJSONString(p.getList()));
                vo.setIds(p.getList());
                //查询由原订单衍生出的新订单和负订单
                List<Long> subOrderIds = orderMapperDiy.selectSubOrderIds(vo.getIds());
                vo.getIds().addAll(subOrderIds);
                List<OrderListDTO> list = orderMapperDiy.selectOrdersByIds(vo);

                for (OrderListDTO d : list) {
                    if (vo.getOrderType().equals(1)) {//买家订单
                        d.setApplyRefundFlag(setApplyRefundFlag(d));
                        if(d.getSrcOrderId() == null){//只有源订单才有改签的权限
                            //计算 能否改签标识
                            d.setAlterTicketFlag(setAlterTicketFlag(d));
                        }
                    }
                    //已首款
                    if (PAYED.equals(d.getoStatus()) && d.getoUnPay().compareTo(BigDecimal.ZERO) > 0) {
                        d.setoStatus(BOOK.getValue());
                    }
                    d.setAdultNum(d.getPriceDetails().stream().mapToInt(dp -> dp.getOpAdultNum() * dp.getOpNum()).reduce((a, b) -> a + b).getAsInt());//订单成人数
                    d.setChildNum(d.getPriceDetails().stream().mapToInt(dp -> dp.getOpChildNum() * dp.getOpNum()).reduce((a, b) -> a + b).getAsInt());//订单儿童数
                }
                //衍生订单
                list.forEach(d -> d.setSubOrders(list.stream().filter(sub -> d.getId().equals(sub.getSrcOrderId())).collect(Collectors.toList())));
                List finalList = list.stream().filter(d -> d.getSrcOrderId() == null).collect(Collectors.toList());
                p.setList(finalList);
            }
            p.setExtObj(selectOrderNumofStatuses(vo));
            return getSuccessResult(p);
        }

    }

    private Boolean setAlterTicketFlag(OrderListDTO d){
        if (d.getGroupStatus() <= 0 && !(d.getRefundRecordStatus()!=null && d.getRefundRecordStatus()==1) && !(d.getLastAlterTicketStatus()!=null && 0 == d.getLastAlterTicketStatus()) && (3 == d.getoStatus() && d.getoUnPay().compareTo(BigDecimal.ZERO)==0)){
            return true;
        }else{
            return false;
        }
    }

    /**
     * @Description: 当数据库不存在上级信息，采用这种处理方式 设置退款标识
     * @author 王斌
     * @date 2018年4月3日 下午4:24:45
     * @param d
     * @return
     */
    private int setApplyRefundFlag(OrderListDTO d){
    	if (d.getGroupStatus() != 2 && d.getoStatus() == 3 && d.getRefundStatus() != 3 && !(d.getRefundRecordStatus() != null && d.getRefundRecordStatus() == 1)) {
            return 1;
        } else {
        	return 0;
        }
    }

    @Override
    public OrderDetailDTO getOrderDetail(Order order) {
        OrderDetailDTO dt = orderMapperDiy.orderDetail(order);
        if (dt != null) {
            ScheduleSetting scheduleSetting = scheduleSettingMapper.selectByGroup_no(order.getoGroupOrderNo());
            if (!Objects.isNull(scheduleSetting)) {
                dt.setsCalendar(LocalDateTimeUtils.LocalDateTime2Date(scheduleSetting.getStartDate()));
                dt.setsCalendarBack(LocalDateTimeUtils.LocalDateTime2Date(scheduleSetting.getReturnDate()));
            } else {
                dt.setsCalendarBack(DateUtils.addDays(dt.getsCalendar(), dt.getpDays() - 1));
            }
            List<OrderTouristDTO> list = orderTouristMapperDiy
                    .selectOrderTouristDTOList(order);

            List<OrderPriceDetailDTO> prices = orderPriceDetailMapperDiy
                    .selectOrderPriceListByOrder(order);
            for (OrderPriceDetailDTO p : prices){
                if (p.getOpType() == 5){// 核损金额类型
                    dt.setLossMoney(p.getOpTotalPrice());
                    break;
                }
            }

            dt.setTourists(list);
            dt.setPriceDetails(prices);
            //已首款
            if (PAYED.equals(dt.getoStatus()) && dt.getoUnPay().compareTo(BigDecimal.ZERO) > 0) {
                dt.setoStatus(BOOK.getValue());
            }
        }
        return dt;
    }

    /* 组团社确认单、出团通知书 */
    @Override
    public OrderGroupConfirmation groupConfirmationForm(Order order) {
        OrderGroupConfirmation con = orderMapperDiy
                .groupConfirmationForm(order);
        List<OrderTouristDTO> list = orderTouristMapperDiy
                .selectOrderTouristDTOList(order);
        List<OrderPriceDetailDTO> prices = orderPriceDetailMapperDiy
                .selectOrderPriceListByOrder(order);
        con.setTourists(list);
        con.setPriceDetails(prices);
        List<OrderTripDTO> trips = orderMapperDiy.selectTripsByOrder(order);
        List<OrderTripDTO> nTrips = trips.stream().filter(t -> {
            String calendar = format(con.getsCalendar(), "yyyy-MM-dd");
            return t.gettType() == 1
                    && t.getTcStartDay().compareTo(calendar) <= 0
                    && t.getTcEndDay().compareTo(calendar) >= 0;
        }).collect(Collectors.toList());// 判断是否存在生效的补充行程
        if (!isEmpty(nTrips)) {// 如果存在则使用该系列补充行程
            con.setTrips(nTrips);
        } else {// 如果不存在则使用默认行程
            con.setTrips(trips.stream().filter(t -> t.gettType() == 0)
                    .collect(Collectors.toList()));
        }
        if (!isEmpty(con.getTrips())) {
            List<OrderTripDTO> tps = con.getTrips();
            for (int i = 0; i < tps.size(); i++) {
                if (isBlank(tps.get(i).getTcStartDay())
                        && isBlank(tps.get(i).getTcEndDay())) {
                    tps.get(i).setTcStartDay(format(
                            addDays(con.getsCalendar(), i), "yyyy-MM-dd"));
                    tps.get(i).setTcEndDay(tps.get(i).getTcStartDay());
                }
            }
        }
        return con;
    }

    @Override
    public OrderPayRecordsDTO orderPayRecords(Order order) {
        OrderPayRecordsDTO dto = orderMapperDiy.orderPayRecords(order);
        if(dto == null) return null;
        if (!isEmpty(dto.getPays())) {
            dto.setPays(dto.getPays().stream().filter(pay -> pay.getOpPayAmount().signum() > 0).collect(Collectors.toList()));
        }
        dto.setOrderCards(orderCardMapper.selectCardsByOrderId(dto.getId()));
        return dto;
    }

    @Override
    public OrderPlanDetailDTO planDetails(Order order) {
        List<OrderTouristDTO> list = orderTouristMapperDiy
                .selectOrderTouristDTOList(order);
        OrderPlanDetailDTO plan = new OrderPlanDetailDTO();
        plan.setTourists(list);
        return plan;
    }

    @Override
    public List<OrderLogs> operLogs(Order order) {
        return orderLogsMapperDiy.operLogs(order.getId());
    }

    @Override
    public OrderStaticsDTO recentOrderInfo(OrderStaticsVO vo) {
        vo.setCompanyIds(selectSubCompanyIdsWithOwn(vo.getPcompanyId()));
        return orderMapperDiy.recentOrderInfo(vo);
    }

    @Override
    public List<OrderStatusNumberDTO> selectOrderNumofStatuses(OrderSearchVo vo) {
        //这里总计的时候，这些条件必须是清空的
        vo.setoStatus(null);
        vo.setUnPay(null);
        vo.setOfflineStatuses(null);
        vo.setContractStatus(null);
        vo.setRefundStatus(null);
        List<OrderStatusNumberDTO> list = orderMapperDiy.selectOrderNumofStatuses(vo);
        if (isEmpty(list))
            list = new ArrayList<>();
        List<OrderStatusNumberDTO> finalList = list;
        Arrays.stream(OrderStatusEnum.values())
                .filter(e -> finalList.stream().noneMatch(t -> t.getStatus().equals(e.getValue())))
                .forEach(e -> finalList.add(new OrderStatusNumberDTO(e.getValue(), 0)));
        //已预订+待确认,放进1和11列表
        finalList.stream().filter(t -> t.getStatus().equals(20)).findFirst().ifPresent(t -> {
            finalList.stream().filter(a -> a.getStatus().equals(TO_PAY.getValue())).findFirst().ifPresent(a -> a.setNumber(a.getNumber() + t.getNumber()));
            finalList.stream().filter(a -> a.getStatus().equals(TO_COLLECT.getValue())).findFirst().ifPresent(a -> a.setNumber(a.getNumber() + t.getNumber()));
        });
        //已首款+待确认,放进10和11列表
        finalList.stream().filter(t -> t.getStatus().equals(21)).findFirst().ifPresent(t -> {
            finalList.stream().filter(a -> a.getStatus().equals(BOOK.getValue())).findFirst().ifPresent(a -> a.setNumber(a.getNumber() + t.getNumber()));
            finalList.stream().filter(a -> a.getStatus().equals(TO_COLLECT.getValue())).findFirst().ifPresent(a -> a.setNumber(a.getNumber() + t.getNumber()));
        });
        return finalList.stream().filter(t -> (t.getStatus() != 20 && t.getStatus() != 21)).collect(Collectors.toList());
    }

    @Override
    public Order selectOrderByOrderNo(String orderNo) {
        return orderMapperDiy.selectOrderByOrderNo(orderNo);
    }

    @Override
    public List<Long> selectSubCompanyIdsWithOwn(Long id) {
        if (id == null)
            return null;
        List<CompanyTreeDTO> list = companyMapper.selectAllCompanies();
        if (isEmpty(list))
            return null;
        if (list.stream().noneMatch(c -> c.getId().equals(id)))
            return null;
        list.forEach(c -> c.setChildren(
                list.stream().filter(sub -> c.getId().equals(sub.getcPid()))
                        .collect(Collectors.toList())));
        List<Long> ids = new ArrayList<>();
        AtomicInteger i = new AtomicInteger(0);
        list.stream().filter(c -> c.getId().equals(id)).findFirst()
                .ifPresent(c -> addIdToList(c, ids, i));
        return ids;
    }

    private void addIdToList(CompanyTreeDTO c, List<Long> ids,
                             AtomicInteger i) {
        if (ids.contains(c.getId())) {
            int temp = i.getAndAdd(1);
            if (temp > 10)
                throw new RuntimeException("用户公司层级信息存在错误！");// 控制死循环
        }
        ids.add(c.getId());
        if (!isEmpty(c.getChildren())) {
            c.getChildren().forEach(child -> addIdToList(child, ids, i));
        }
    }

    @Override
    public List<Long> selectSubDepartmentIdsWithOwn(Long id) {
        if (id == null)
            return null;
        List<DepartmentTreeDTO> list = departmentMapper.selectAllDepartments();
        if (isEmpty(list))
            return null;
        if (list.stream().noneMatch(d -> d.getId().equals(id)))
            return null;
        list.forEach(d -> d.setChildren(
                list.stream().filter(sub -> d.getId().equals(sub.getdPid()))
                        .collect(Collectors.toList())));
        List<Long> ids = new ArrayList<>();
        AtomicInteger i = new AtomicInteger(0);
        list.stream().filter(d -> d.getId().equals(id)).findFirst()
                .ifPresent(d -> addIdToList(d, ids, i));
        return ids;
    }

    @Override
    public ContractOrder selectContractByOrderId(Integer orderId) {
        return orderMapperDiy.selectContractByOrderId(orderId);
    }

    private void addIdToList(DepartmentTreeDTO d, List<Long> ids,
                             AtomicInteger i) {
        if (ids.contains(d.getId())) {
            int temp = i.getAndAdd(1);
            if (temp > 10)
                throw new RuntimeException("用户部门层级信息存在错误！");// 控制死循环
        }
        ids.add(d.getId());
        if (!isEmpty(d.getChildren())) {
            d.getChildren().forEach(child -> addIdToList(child, ids, i));
        }
    }

    @Override
    public PayNeedInfo queryPayNeedInfoByOrderNo(String orderNo) {
        return orderMapper.selectPayNeedInfoByOrderNo(orderNo);
    }

    @Override
    @Transactional(readOnly = true)
    public ResultBean getTourists(Long orderId, int pageNo, int pageSize) {
        pageNo = (pageNo - 1) * pageSize;
        final int finalPageNo = pageNo;
        final int finalPageSize = pageSize;

        Map<String, Object> resultMap = new HashMap();
        List<OrderTouristForCS> touristsForChangsha = orderTouristMapperDiy.getTouristsForChangsha(orderId, true,finalPageNo, finalPageSize);
        List<OrderTouristForCS> touristsAll = orderTouristMapperDiy.getTouristsForChangsha(orderId, false,finalPageNo, finalPageSize);
        Map<Long,TicketInOrderDTO> ticketMap = new HashMap<>();
        for (OrderTouristForCS cs : touristsAll){//循环所有游客检查该订单下对应的多种票及数量，给到前端
            Long otTicketId = cs.getOtTicketId();
            if (ticketMap.containsKey(otTicketId)){
                TicketInOrderDTO ticketDto = ticketMap.get(otTicketId);
                ticketDto.setNum(ticketDto.getNum()+1);
            }else{
                TicketInOrderDTO ticketDto = new TicketInOrderDTO();
                ticketDto.setTicketId(cs.getOtTicketId());
                ticketDto.setTitle(cs.getCategoryName()+"-"+cs.getTicketTypeName()+"-"+cs.getOtTicketName());
                ticketDto.setTicketType(cs.getOtTicketType());
                ticketDto.setType(cs.getOtType());
                ticketMap.put(otTicketId,ticketDto);
            }
        }
        resultMap.put(Constants.Result.RESULT_LIST, touristsForChangsha);
        resultMap.put(Constants.Result.TOTAL_NUM, touristsAll.size());
        resultMap.put("ticketInfo",ticketMap);
        return ResultBean.getSuccessResult(resultMap);
    }

    @Override
    @Transactional
    public ResultBean<Object> saveTourist(OrderTourist touristInfo) {

        // 检查订单是否存在 失败返回
        Long otOrderId = touristInfo.getOtOrderId();
        Order orderInfo = orderMapper.selectByPrimaryKey(otOrderId);
        if (orderInfo == null) {
            return ResultBean.getErrorResult(NOT_EXIST_ORDER);
        }
        // 检查游客是否已经存在  失败返回
        List<Map> tourists = orderTouristMapperDiy.selectTouristByOrderIdAndIDcardInfo(otOrderId, touristInfo.getOtName(), touristInfo.getOtLicenceType(), touristInfo.getOtLincese());
        Long id = touristInfo.getId();
        if (id == null) {
            return ResultBean.getErrorResult(ERROR_ID);
        }
        int size = tourists.size();
        if (tourists != null && size > 0) {//存在该游客信息
            boolean firstIsNotNull = tourists.get(0) != null;
            if (size > 1 || (size == 1 && firstIsNotNull && !id.equals(tourists.get(0).get(ID_STR)))) {
                return ResultBean.getErrorResult(EXIST_TOURIST);
            }
        }
        //检查当前游客的票id和页面传值的票id是否相等，如果变了，则拒绝请求
        //原因：一个订单生成时固定了A票有几张，B票有几张，C票有几张，游客表中记录都生成占了坑。把一个游客原来是A票改成B票，必须把一个是B票的游客改成A票，释放一个坑位，单个保存是不符合这个逻辑的，只能通过批量保存修改
        OrderTourist oldTourist = orderTouristMapper.selectByPrimaryKey(id);
        if (!Objects.equals(oldTourist.getOtTicketId(), touristInfo.getOtTicketId())){
            return ResultBean.getErrorResult("当前单个游客不能单独修改所选票,请通过批量保存修改票");
        }

        orderTouristMapper.updateByPrimaryKeySelective(touristInfo);

        return ResultBean.getSuccessResultForLog(otOrderId);
    }

    @Override
    @Transactional
    public ResultBean<Object> reviewVoucher(List<OrderOffline> orderOffline) {
        BigDecimal realpayMoney = new BigDecimal(ZERO_STR);
        List<Long> ids=new ArrayList<>();
        for (OrderOffline item : orderOffline) {
            realpayMoney = realpayMoney.add(item.getMoney());
            ids.add(item.getId());
//			orderOfflineMapper.updateByPrimaryKey(item);
        }
        OrderOffline firstItem = orderOffline.get(0);
        Integer type = firstItem.getType();//type 0-全款 1-首款 2-尾款
        Integer status = orderOffline.get(0).getfStatus();//f_status '0-待确认 1-无效 2-已确认',
        Long id = firstItem.getOrderId();
        Order record = new Order(id);
        //查询订单信息
        Order currentOrder = orderMapper.selectByPrimaryKey(id);
        if (currentOrder == null) {
            throw new RuntimeException(NOT_EXIST_ORDER);
        }

        BigDecimal getoFirstPay = currentOrder.getoFirstPay();
        String getoOrderNo = currentOrder.getoOrderNo();
        Integer offlinePay = OrderPayMethodEnum.OFF_LINE.getValue();
        BigDecimal getoRealPay = currentOrder.getoRealPay();
        switch (type) {
            // offline_status 0-待确认 1-驳回 2-已确认 3-二次支付待确认 4-二次支付驳回 5-二次支付已确认
            case 0:
                if (Integer.valueOf(1).equals(status)) {
                    record.setOfflineStatus(1);
                } else if (Integer.valueOf(2).equals(status)) {
                    BigDecimal realPay = getoRealPay;
                    if (realPay == null || realPay.compareTo(realpayMoney) != 0) {
                        throw new RuntimeException(ERROR_ALL_PAY);
                    }
                    record.setOfflineStatus(2);
                }
                break;
            case 1:
                if (Integer.valueOf(1).equals(status)) {
                    record.setOfflineStatus(1);
                } else if (Integer.valueOf(2).equals(status)) {
                    BigDecimal firstPay = getoFirstPay;
                    if (firstPay == null || firstPay.compareTo(realpayMoney) > 0) {
                        throw new RuntimeException(ERROR_FIRST_PAY);
                    }
                    if (realpayMoney.equals(getoRealPay)) {
                        record.setOfflineStatus(5);
                    } else {
                        record.setOfflineStatus(2);
                    }
//				record.setoFirstPay(realpayMoney);
//				record.setoUnPay(getoRealPay.subtract(realpayMoney));
                }
                break;
            case 2:
                if (Integer.valueOf(1).equals(status)) {
                    if(orderOfflineMapper.getExistRecordByIds(ids,id)>0){
                    	record.setOfflineStatus(3);
                    }else{
                    	record.setOfflineStatus(2);
                    }
                } else if (Integer.valueOf(2).equals(status)) {
                    BigDecimal unpay = null;
                    if (getoFirstPay == null) {
                        unpay = new BigDecimal(ZERO_STR);
                    } else {
//					unpay = getoRealPay.subtract(getoFirstPay);
                        unpay = currentOrder.getoUnPay();
                    }
                    if (unpay.compareTo(realpayMoney) > 0) {
//                        throw new RuntimeException(ERROR_LAST_PAY);
                        if(orderOfflineMapper.getExistRecordByIds(ids,id)>0){
                        	record.setOfflineStatus(3);
                        }else{
                        	record.setOfflineStatus(2);
                        }
                        
                    }else{
                    	record.setOfflineStatus(5);
                    	
                    }
                }
                break;

            default:
                break;
        }
        Long payId = null;
        if (status == 2) {//确认通过才调用线下支付接口
            //调用订单后续流程
        	 for (OrderOffline item : orderOffline) {
        		 item.setUpdateUser(firstItem.getUpdateUser());
        	 
	            OrderWxPayVO pay = new OrderWxPayVO();
	            pay.setOrderNo(getoOrderNo);
	            pay.setRemark(REMARK);
	            pay.setToPay(item.getMoney());
	            pay.setPayMethod(offlinePay);
	            pay.setTransactionId(item.getTransNo());
	            ResultBean wxPay = orderOperationService.wxPay(pay);
	            if (wxPay.isSuccess()) {
	                payId = (Long) ((Map) wxPay.getBody()).get("payId");
	            }
	            item.setPayId(payId);
	            item.setUpdateUser(firstItem.getUpdateUser());
	            orderOfflineMapper.updateByPrimaryKey(item);
        	 }
        }else{
       	 for (OrderOffline item : orderOffline) {
    		 item.setUpdateUser(firstItem.getUpdateUser());
            orderOfflineMapper.updateByPrimaryKey(item);
    	 }
        }
        
        orderMapper.updateByPrimaryKeySelective(record);
        ResultBean<Object> successResultForLog = ResultBean.getSuccessResultForLog(id);
        successResultForLog.setBody(getoOrderNo);

        // 审核完成之后异步通知审核结果
        new Thread() {
            @Override
            public void run() {
                syncOrderOffline(orderOffline, currentOrder);
            }

            ;
        }.start();

        return successResultForLog;
    }

    private ResultBean syncOrderOffline(List<OrderOffline> list, Order order) {
        SyncOrderOfflineVO vo = new SyncOrderOfflineVO();
        String url = fxUrl
                + "order-service/orderOffLine/acceptCheckOrderOffLine";
        vo.setOrderNo(order.getoOrderNo());
        Integer status = list.get(0).getfStatus();
        if (status.equals(Integer.valueOf(1))) {
            vo.setAuditDesc("审核不通过!");
        } else if (status.equals(Integer.valueOf(2))) {
            vo.setAuditDesc("审核通过!");
        }
        vo.setfStatus(status);
        vo.setUserId(list.get(0).getUpdateUser());
        List<Long> ids = new ArrayList<>();
        list.stream().forEach(s -> {
            ids.add(s.getId());
        });
        vo.setPayId(ids);
        logger.error("通知审核结果 入参 url=" + url);
        logger.error("通知审核结果 入参 " + vo);
        SyncOrderOfflineResult result = restTemplate
                .postForEntity(url, vo, SyncOrderOfflineResult.class).getBody();
        logger.error("通知审核结果 出参 " + result);
        ResultBean resultBean = new ResultBean();
        resultBean.setCode(result.getCode());
        resultBean.setMessage(result.getMsg());
        resultBean.setData(result.getData());
        return resultBean;
    }

    @Override
    public ResultBean getVouchers(OrderOffline orderOffline) {
        return ResultBean.getSuccessResult(orderOfflineMapper.selectByEntity(orderOffline));
    }

    @Override
    public ResultBean<Object> exportCancelTourists(Long scheduleId) {
        return ResultBean.getIndexSuccessResult(orderMapper.exportCancelTourists(scheduleId));
    }

    @Override
    public ResultBean<Object> getNeedToDealCount() {

        return ResultBean.getSuccessResult(orderMapper.getNeedToDealCount());
    }

    @Override
    public ResultBean batchSaveTourist(OrderTouristForBatch vo) {
        if (vo.getTouristInfo()!=null && vo.getTouristInfo().size()>0){
            Long orderId = vo.getOtOrderId();
            List<OrderTouristForCS> touristsAll = orderTouristMapperDiy.getTouristsForChangsha(orderId, false,0, 0);
            if (vo.getTouristInfo().size() != touristsAll.size()){
                return ResultBean.getErrorResult("补录的游客数量与订单应有的游客数量不一致!");
            }
            //获取当前订单 具有哪些票  每种票在这个订单有几张
            Map<Long,TicketInOrderDTO> ticketDBData = new HashMap<>();
            for (OrderTouristForCS cs : touristsAll){//循环所有游客检查该订单下对应的多种票及数量，给到前端
                Long otTicketId = cs.getOtTicketId();
                if (ticketDBData.containsKey(otTicketId)){
                    TicketInOrderDTO ticketDto = ticketDBData.get(otTicketId);
                    ticketDto.setNum(ticketDto.getNum()+1);
                }else{
                    TicketInOrderDTO ticketDto = new TicketInOrderDTO();
                    ticketDto.setTicketId(cs.getOtTicketId());
                    ticketDto.setTitle(cs.getCategoryName()+"-"+cs.getTicketTypeName()+"-"+cs.getOtTicketName());
                    ticketDto.setTicketType(cs.getOtTicketType());
                    ticketDBData.put(otTicketId,ticketDto);
                }
            }
            Map<Long,TicketInOrderDTO> ticketPageMap = new HashMap<>();
            for (OrderTouristAddInfo info : vo.getTouristInfo()){
                Long ticketId = info.getOtTicketId();
                if (ticketPageMap.containsKey(ticketId)){
                    TicketInOrderDTO ticketDto = ticketPageMap.get(ticketId);
                    ticketDto.setNum(ticketDto.getNum()+1);
                }else{
                    TicketInOrderDTO ticketDto = new TicketInOrderDTO();
                    ticketDto.setTicketId(info.getOtTicketId());
                    //ticketDto.setTitle(cs.getCategoryName()+"-"+cs.getTicketTypeName()+"-"+cs.getOtTicketName());
                    //ticketDto.setTicketType(cs.getOtTicketType());
                    ticketPageMap.put(ticketId,ticketDto);
                }
            }
            StringBuilder sb = new StringBuilder();
            boolean isOk = true;
            //两个map整理好后，以数据库获取的map为准，进行比较
            for (Map.Entry<Long,TicketInOrderDTO> standData :ticketDBData.entrySet()){//标准数据
                Long key = standData.getKey();
                TicketInOrderDTO value = standData.getValue();
                if (ticketPageMap.containsKey(key)){
                    TicketInOrderDTO compareValue = ticketPageMap.get(key);
                    if (!Objects.equals(compareValue.getNum(), value.getNum())){
                        isOk = false;
                        sb.append(value.getTitle()+" 应有 "+value.getNum()+" 张,现有 "+compareValue.getNum()+" 张\n");
                    }
                }else{
                    isOk = false;
                    sb.append(value.getTitle()+" 应有 "+value.getNum()+" 张,现一张都没\n");
                }
            }
            if (!isOk){
                return ResultBean.getErrorResult(sb.toString());
            }
            vo.setUpdateTime(new Date());
            vo.setUpdateUser(vo.getPuserId());
            orderTouristMapperDiy.batchUpdateTourist(vo);
            return ResultBean.getSuccessResult();
        }else{
            return ResultBean.getErrorResult("没有游客信息");
        }
    }
}
