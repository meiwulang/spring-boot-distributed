package com.jdy.b2b.api.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jdy.b2b.api.common.*;
import com.jdy.b2b.api.dao.*;
import com.jdy.b2b.api.dao.diy.*;
import com.jdy.b2b.api.dao.electroniccontract.ProductContractTemplateMapper;
import com.jdy.b2b.api.dao.electroniccontract.SignContractInfoMapper;
import com.jdy.b2b.api.dao.product.FrontProductMapper;
import com.jdy.b2b.api.dao.product.ProductAssembleCompanyMapper;
import com.jdy.b2b.api.dao.product.ProductMapper;
import com.jdy.b2b.api.dao.schedule.ScheduleSettingMapper;
import com.jdy.b2b.api.dao.station.ShuttleBusMapper;
import com.jdy.b2b.api.dao.ticket.TicketMapper;
import com.jdy.b2b.api.dao.ticketset.TicketSetMapper;
import com.jdy.b2b.api.dao.user.UserMapper;
import com.jdy.b2b.api.enums.*;
import com.jdy.b2b.api.model.*;
import com.jdy.b2b.api.model.diy.*;
import com.jdy.b2b.api.model.electroniccontract.ProductContractTemplate;
import com.jdy.b2b.api.model.electroniccontract.SignContractInfo;
import com.jdy.b2b.api.model.orderRefund.OrderConfirm;
import com.jdy.b2b.api.model.pexperience.ProductListDO;
import com.jdy.b2b.api.model.pexperience.ProductListDTO;
import com.jdy.b2b.api.model.product.Product;
import com.jdy.b2b.api.model.schedule.ScheduleSetting;
import com.jdy.b2b.api.model.station.Departure;
import com.jdy.b2b.api.model.ticket.Ticket;
import com.jdy.b2b.api.model.ticketset.TicketSet;
import com.jdy.b2b.api.model.ticketset.TicketSetVO;
import com.jdy.b2b.api.model.user.User;
import com.jdy.b2b.api.service.OrderOfflineService;
import com.jdy.b2b.api.service.OrderOperationService;
import com.jdy.b2b.api.util.MQAssembleService;
import com.jdy.b2b.api.util.MQTransformationUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

import static com.jdy.b2b.api.enums.OrderPayMethodEnum.MIX_PAY;
import static com.jdy.b2b.api.enums.OrderPayMethodEnum.WX_PAY;
import static com.jdy.b2b.api.enums.OrderSourceEnum.*;
import static com.jdy.b2b.api.enums.OrderStatusEnum.*;
import static com.jdy.b2b.api.enums.PriceDetailTypeEnum.*;
import static com.jdy.b2b.api.enums.UserDataLimitEnum.*;
import static java.time.format.DateTimeFormatter.BASIC_ISO_DATE;
import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;
import static org.apache.commons.lang3.StringUtils.*;
import static org.springframework.util.CollectionUtils.containsAny;
import static org.springframework.util.CollectionUtils.isEmpty;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/19 16:34
 */
@SuppressWarnings({"rawtypes", "unchecked"})
@Service
public class OrderOperationServiceImpl extends BaseService implements OrderOperationService {

    @Value("${order_invalid_hour}")
    Integer invalidHour;
    @Value("${order_sms_template_no}")
    String smsTemplateNo;
    @Value("${spring.wechat.publicId}")
    String publicId;
    @Value("${spring.orderUrl}")
    String orderUrl;
    @Value("${spring.order_group_advice_url}")
    String groupAdviceUrl;
    @Value("${spring.groupAdviceNoteForMessageKey}")
    String groupAdviceMessageKey;
    @Value("${shp_card_web_interface_url}")
    String shpCardInterfaceUrl;
    @Value("${changsha.tuijieqianzhui2}")
    String tuijieqianzhui2;

    @Autowired
    ScheduleMapper scheduleMapper;
    @Autowired
    ScheduleSettingMapper scheduleSettingMapper;
    @Autowired
    ScheduleMapperDiy scheduleMapperDiy;
    @Autowired
    ProductMapper productMapper;
    @Autowired
    TicketMapper ticketMapper;
    @Autowired
    TicketSetMapper ticketSetMapper;
    @Autowired
    ShuttleBusMapper shuttleBusMapper;
    @Autowired
    CompanyMapper companyMapper;
    @Autowired
    UserMapper userMapper;
    @Autowired
    OrderMapper orderMapper;
    @Autowired
    OrderMapperDiy orderMapperDiy;
    @Autowired
    OrderPriceDetailMapperDiy priceDetailMapperDiy;
    @Autowired
    OrderPriceDetailMapper priceDetailMapper;
    @Autowired
    OrderTouristMapperDiy touristMapperDiy;
    @Autowired
    OrderLogsMapper logsMapper;
    @Autowired
    OrderPayMapper payMapper;
    @Autowired
    SmsMapper smsMapper;
    @Autowired
    SmsMapperDiy smsMapperDiy;
    @Autowired
    TaskExecutor taskExecutor;
    @Autowired
    BusMapperExtDiy busMapperExtDiy;
    @Autowired
    FrontProductMapper frontProductMapper;
    @Autowired
    ProductContractTemplateMapper pctMapper;
    @Autowired
    ProductExperienceMapperDiy mapperDiy;
    @Autowired
    SignContractInfoMapper signContractInfoMapper;
    @Autowired
    OrderCardMapper orderCardMapper;
    @Autowired
    MQAssembleService mqAssembleService;
    @Autowired
    ProductAssembleCompanyMapper productAssembleCompanyMapper;
    @Autowired
    ScheduleTicketMapperDiy scheduleTicketMapperDiy;

    @Autowired
	private OrderOfflineService orderOfflineService;
    
    @Transactional
    @Override
    public ResultBean addOrder(OrderAddDTO order) {
        logger.info("下单参数：" + JSON.toJSONString(order));

        Schedule sch = scheduleMapper.selectByPrimaryKey(order.getoScheduleId());
        ResultBean bean = ResultBean.getSuccessResult();
        validateScheduleOverDue(sch, bean);
        if (bean.isFail()) return bean;

        Product pd = productMapper.selectByPrimaryKey(sch.getsProductId());
        validateProduct(pd, bean, order);
        if (bean.isFail()) return bean;

        //validateZiYanProdTouristsInfo(pd,order,bean);
        //if(bean.isFail()) return bean;//自研产品游客信息要填写完整

        // 不是小程序下单，需要校验体验规则
        if (isBlank(order.getAppletId())) {
            validateHasExperienced(order, pd, bean);
            if (bean.isFail()) return bean;
        }

        User servicer = userMapper.queryForUserByIdSingle(pd.getpContacts());
        if(servicer == null) throw new RuntimeException("产品联系人信息有误！");

        List<Long> ticketIds = order.getPriceDetails().stream().mapToLong(OrderPriceDetail::getOpTicketId).boxed().collect(Collectors.toList());
        ticketIds.addAll(order.getTourists().stream().filter(t -> t.getSubTicketId() != null).mapToLong(OrderTouristAddVO::getSubTicketId).boxed().collect(Collectors.toList()));

        Map map = new HashMap();
        map.put("scheduleId", sch.getId());
        map.put("ticketIds", ticketIds);
        List<Ticket> tickets = ticketMapper.selectListByIds(map);
        tickets.stream().forEach(t -> {
            t.settPeerPrice(t.getsMarketPrice());
            t.settMarketPrice(t.getsMarketPrice());//这里设置为班期票关系表的价格
        });

        setOrderPeopleNum(order, tickets);//设置订单总人数
        if(bean.isFail()) return bean;

        //validateSeat(order, sch, bean);
        //if (bean.isFail()) return bean;

        //validatePeopleNum(sch, order, bean);//验证座位售出情况
        //if (bean.isFail()) return bean;

        validateTickets(tickets, order.getPriceDetails(), order.getTourists(), sch, bean);
        if (bean.isFail()) return bean;

        ProductContractTemplate pdContract = pctMapper.selectByPid(pd.getId(), ticketIds.get(0));
        insertOrder(pd, sch, servicer, tickets, order, pdContract);

        //处理礼品卡游客下单逻辑
        logger.info("处理礼品卡游客下单逻辑:" + JSON.toJSONString(order));
        dealConsumerAddOrder(order);

        updateSchedule(sch, order);
        saveOrderPriceDetails(order);
        saveOrderTourists(order);
        saveOrderLog(order, "新增订单", "");

        bean.setMessage("订单添加成功！");

        Map data = new HashMap();
        data.put("status", TO_CONFIRM.equals(order.getoStatus())?"待确认":"已预约");
        data.put("statusValue", order.getoStatus());
        data.put("number", order.getoOrderNo());
        bean.setData(data);
        bean.setId(order.getId());
        logger.info("订单[" + order.getoOrderNo() + "]添加成功！");
        return bean;
    }

    private void validateZiYanProdTouristsInfo(Product pd, OrderAddDTO order, ResultBean bean) {
        if(0 == pd.getpFrom()) {
            if(order.getTourists().stream().anyMatch(t -> isBlank(t.getOtName()) || isBlank(t.getOtPhone()) || isBlank(t.getOtLincese()) || t.getOtLicenceType() == null)) {
                bean.setCode("-1");
                bean.setMessage("自研产品，请补全游客信息");
            }
        }
    }

    /*因为一票可能对应多人，这里根据订单的游客（代表），票的人数信息，设置订单的总人数*/
    private void setOrderPeopleNum(OrderAddDTO order, List<Ticket> tickets) {
        int people = 0;
        for (OrderTouristAddVO t : order.getTourists()) {
            Ticket tk = tickets.stream().filter(k -> k.getId().equals(t.getOtTicketId())).findFirst().get();
            Assert.isTrue(tk.gettAdultNum() != null && tk.gettChildNum() != null, "票【" + tk.getId() + "】的人数信息不正确！");
            people += tk.gettAdultNum() + tk.gettChildNum();
        }
        order.setoPeopleNum(people);
    }

    private void dealConsumerAddOrder(OrderAddDTO order) {
        //小程序下单
        if (isNotBlank(order.getAppletId())) {
            if (!isEmpty(order.getCardDOS())) {
                if (order.getCardDOS().size() > order.getTourists().size()) throw new RuntimeException("不能使用多于票数的礼品卡！");
                CardValidateVO cv = new CardValidateVO(order.getCardDOS(), order.getoProductId());
                cv.setAppletId(order.getAppletId());

                ResultBean vb = validateCard(cv);//验卡
                if (vb.isFail()) throw new RuntimeException(vb.getMessage());

                List<Map> datas = (List<Map>) vb.getBody();

                saveCards(order, datas);//里面会设置卡可抵扣的人数

                vb = validateCardOverUse(order);
                if (vb.isFail()) throw new RuntimeException(vb.getMessage());

                //计算剩余待支付
                BigDecimal toPay = calcOrderToPay(order);

                //锁定卡
                lockReleaseCards(order.getoOrderNo(), order.getCardDOS(), "1");

                Order newOrder = new Order();
                newOrder.setId(order.getId());
                newOrder.setoToPay(toPay);
                newOrder.setoSource(CS.getValue());
                orderMapper.updateByPrimaryKeySelective(newOrder);
            } else {
                Order newOrder = new Order();
                newOrder.setId(order.getId());
                newOrder.setoToPay(order.getoRealPay());
                newOrder.setoSource(CS.getValue());
                orderMapper.updateByPrimaryKeySelective(newOrder);
            }
        }
    }

    private ResultBean validateCardOverUse(OrderAddDTO order) {
        List<CardDO> cards = order.getCardDOS();
        if (!isEmpty(cards)) {
            switch (cards.get(0).getCardType()) {
                case 1: {//名额卡
                    cards = cards.stream().sorted((c1, c2) -> c2.getCardPerson().compareTo(c1.getCardPerson())).collect(Collectors.toList());
                    int touristNum = 0;
                    int cardNum = 0;
                    for (int i = 0; i < cards.size(); i++) {
                        if (touristNum < order.getoPeopleNum()) {
                            touristNum += cards.get(i).getCardPerson();
                            cardNum++;
                        }
                    }
                    if (cardNum < cards.size()) {
                        return ResultBean.getErrorResult("礼品卡抵用后还有剩余,请重新选择！");
                    }
                    break;
                }
                case 2: {//金额卡
                    cards = cards.stream().sorted((c1, c2) -> c2.getCardPrice().compareTo(c1.getCardPrice())).collect(Collectors.toList());
                    BigDecimal pay = BigDecimal.ZERO;
                    int cardNum = 0;
                    for (int i = 0; i < cards.size(); i++) {
                        if (pay.compareTo(order.getoRealPay()) < 0) {
                            pay = pay.add(cards.get(i).getCardPrice());
                            cardNum++;
                        }
                    }
                    if (cardNum < cards.size()) {
                        return ResultBean.getErrorResult("礼品卡抵用后还有剩余,请重新选择！");
                    }
                    break;
                }
                default:
                    break;
            }
        }
        return ResultBean.getSuccessResult();
    }

    private BigDecimal calcOrderToPay(OrderAddDTO order) {
        logger.info("calcOrderToPay:"+JSON.toJSONString(order));
        int cardType = order.getCardDOS().get(0).getCardType();
        if (cardType == 1) {//名额卡
            Map res = order.getTourists().stream().collect(Collectors.groupingBy(OrderTouristAddVO::getOtType));
            List<OrderTouristAddVO> adults = res.get(0) != null ? (List<OrderTouristAddVO>) res.get(0) : new ArrayList<>();
            List<OrderTouristAddVO> children = res.get(1) != null ? (List<OrderTouristAddVO>) res.get(1) : new ArrayList<>();
            adults.sort((t1, t2) -> t2.getOpPrice().compareTo(t1.getOpPrice()));
            children.sort((t1, t2) -> t2.getOpPrice().compareTo(t1.getOpPrice()));
            for (CardDO cardDO : order.getCardDOS()) {
                int prior = cardDO.getCardPersonPrior();
                if (prior == 1) {//成人优先
                    dealCardPerson(adults, order, cardDO);
                    dealCardPerson(children, order, cardDO);
                }
                if (prior == 2) {//儿童优先
                    dealCardPerson(children, order, cardDO);
                    dealCardPerson(adults, order, cardDO);
                }
            }
        }
        if (cardType == 2) {//金额卡
            for (CardDO cardDO : order.getCardDOS()) {
                dealCardPrice(order, cardDO.getCardPrice());
            }
        }
        if (cardType == 3) {//折扣卡,只能使用一张
            for (CardDO cardDO : order.getCardDOS()) {
                dealCardDiscount(order, cardDO);
            }
        }

        Assert.isTrue(order.getoRealPay().signum() >= 0, "计算金额订单金额出错了");
        return order.getoRealPay();
    }

    private void dealCardDiscount(OrderAddDTO order, CardDO cardDO) {
        BigDecimal realPay = order.getoRealPay();
        BigDecimal rate = cardDO.getCardDiscountRate();
        BigDecimal max = cardDO.getCardDiscountMax();
        Assert.isTrue(rate != null && rate.signum() > 0 && rate.compareTo(BigDecimal.ONE) <= 0, "折扣卡信息错误");
        Assert.isTrue(max != null && max.signum() > 0,"折扣卡信息错误！");
        BigDecimal payTemp = realPay.multiply(rate).setScale(2, BigDecimal.ROUND_HALF_UP);
        BigDecimal discount = realPay.subtract(payTemp);
        order.setoRealPay(discount.compareTo(max)>=0?realPay.subtract(max):payTemp);
    }

    private void dealCardPrice(OrderAddDTO order, BigDecimal cardPrice) {
        BigDecimal realPay = order.getoRealPay();
        if (realPay.signum() <= 0) return;
        Assert.isTrue(cardPrice.signum() > 0,"金额卡信息错误");
        if (realPay.compareTo(cardPrice) > 0) {
            realPay = realPay.subtract(cardPrice);
        } else {
            realPay = BigDecimal.ZERO;
        }
        order.setoRealPay(realPay);
    }

    private void dealCardPerson(List<OrderTouristAddVO> ts, OrderAddDTO order, CardDO cardDO) {
        BigDecimal realPay = order.getoRealPay();
        if (realPay.signum() <= 0) return;
        Integer cardPerson = cardDO.getCardPerson();
        if(cardPerson == 0) return;
        Iterator<OrderTouristAddVO> iterator = ts.iterator();
        while (iterator.hasNext() && cardPerson > 0) {
            OrderTouristAddVO ad = iterator.next();
            realPay = realPay.subtract(ad.getOpPrice());
            iterator.remove();
            cardPerson--;
        }
        cardDO.setCardPerson(cardPerson);
        order.setoRealPay(realPay);
    }

    private void lockReleaseCards(String orderNo, List<CardDO> cardDOS, String lock) {

        List<Map> cards = new ArrayList<>(cardDOS.size());
        for (CardDO c : cardDOS) {
            Map map = new HashMap();
            map.put("cardNo", c.getCardNo());
            map.put("cardPwd", c.getPass());
            map.put("orderNo", orderNo);
            map.put("lockType", lock);
            cards.add(map);
        }
        logger.info("组装好的卡：" + JSON.toJSONString(cards));
        Map cardNoList = new HashMap();
        cardNoList.put("cardNoList", cards);
        Map data = new HashMap();
        data.put("data", cardNoList);
        JSONObject jsonObject = EncodingObjectWithMd5Utils.encoding(data);
        logger.info("订单解锁礼品卡:" + jsonObject.toJSONString());
        String url = shpCardInterfaceUrl + "/card/batchAcceptLockCard";
        JSONObject result = HttpClientUtils.httpPost(url, (Map) jsonObject);
        logger.info("远程调用礼品卡lock：" + JSON.toJSONString(result));
        String code = (String) result.get("code");
        if (!"200".equals(code)) {
            throw new RuntimeException("下单礼品卡锁定错误！" + result.get("data"));
        }
    }

    private void saveCards(OrderAddDTO order, List<Map> datas) {
        List<CardDO> cardDOS = order.getCardDOS();
        List<OrderCard> ocs = new ArrayList<>(cardDOS.size());
        for (CardDO c : cardDOS) {
            OrderCard oc = new OrderCard();
            oc.setCardNo(c.getCardNo());
            oc.setCardPass(c.getPass());
            oc.setOrderId(order.getId());
            for (Map d : datas) {
                if (c.getCardNo().equals(d.get("cardNo").toString())) {
                    oc.setValidTime(d.get("endDate").toString());
                    oc.setUserUid(Long.parseLong(d.get("userSpUid").toString()));
                    oc.setCardType(Integer.parseInt(d.get("cardType").toString()));
                    if (d.get("cardPrice") != null) oc.setCardPrice(new BigDecimal(d.get("cardPrice").toString()));
                    if (d.get("cardPerson") != null) oc.setCardPerson(Integer.parseInt(d.get("cardPerson").toString()));
                    if (d.get("cardPersonPrior") != null)
                        oc.setCardPersonPrior(Integer.parseInt(d.get("cardPersonPrior").toString()));
                    if (d.get("cardDiscountRate") != null)
                        oc.setCardDiscountRate(new BigDecimal(d.get("cardDiscountRate").toString()));
                    if (d.get("cardDiscountMax") != null)
                        oc.setCardDiscountMax(new BigDecimal(d.get("cardDiscountMax").toString()));
                    if (d.get("costPrice") != null) oc.setCostPrice(new BigDecimal(d.get("costPrice").toString()));
                    if (d.get("marketingPrice") != null)
                        oc.setMarketingPrice(new BigDecimal(d.get("marketingPrice").toString()));
                    if (d.get("salePrice") != null) oc.setSalePrice(new BigDecimal(d.get("salePrice").toString()));

                    c.setCardType(oc.getCardType());
                    c.setCardPrice(oc.getCardPrice());
                    c.setCardPerson(oc.getCardPerson());
                    c.setCardPersonPrior(oc.getCardPersonPrior());
                    c.setCardDiscountMax(oc.getCardDiscountMax());
                    c.setCardDiscountRate(oc.getCardDiscountRate());
                }
            }
            ocs.add(oc);
        }
        if (!isEmpty(ocs)) {
            orderCardMapper.batchInsertOrderCards(ocs);
        }
    }

    private void validateHasExperienced(OrderAddDTO order, Product pd, ResultBean bean) {
        User u = userMapper.queryForUserByIdSingle(order.getoBuyerId());
        if(isNull(u))
            return;
        Integer posId = getPosIdByUser(u);
        if (!configContainsProduct(posId, pd)) return;

        if (touristsContainsUser(order.getTourists(), u)) return;
        Map map = new HashMap();
        map.put("pid", pd.getId());
        map.put("name", u.getuRealName());
        map.put("phone", u.getuTel());
        int i = orderMapperDiy.selectExperiencedOrderCount(map);
        if (i <= 0) {
            bean.setCode("-1");
            bean.setMessage("先体验，无法进行支付");
        }
    }

    private Integer getPosIdByUser(User u) {
        if(isNull(u)) return null;
        if (0 == u.getuStype()) return UserPosEnum.NON_SALE.getPosId();
        if (2 == u.getuStype()) return UserPosEnum.AGENT.getPosId();
        if (1 == u.getuStype()) {
            return UserPosEnum.getPosIdByDbid(u.getuPositionId());
        }
        return null;
    }

    private boolean configContainsProduct(Integer posId, Product pd) {
        if (posId == null) return false;
        ProductListDO vo = new ProductListDO();
        vo.setPosId(posId);
        List<ProductListDTO> list = mapperDiy.selectPosProductList(vo);
        if (!CollectionUtils.isEmpty(list)) {
            return list.stream().anyMatch(p -> pd.getId().equals(p.getPid()));
        } else {
            return false;
        }
    }

    private boolean touristsContainsUser(List<OrderTouristAddVO> tourists, User u) {
        return tourists.stream().anyMatch(t -> t.getOtName().equals(u.getuRealName()) && t.getOtPhone().equals(u.getuTel()));
    }

    private void validateVirtualGroup(OrderAddDTO order, Product pd, ResultBean bean) {
        User u = userMapper.queryForUserByIdSingle(order.getoBuyerId());
        if (u == null || isBlank(u.getuWxOpenId())) {
            bean.setCode("-1");
            bean.setMessage("用户信息有误，请联系管理员！");
            logger.error("用户信息有误，请联系管理员！用户为空，或者openid为空");
            return;
        }
        List<Long> pids = frontProductMapper.getProductIdsByOpenId(u.getuWxOpenId());
        if (isEmpty(pids) || !pids.contains(pd.getId())) {
            bean.setCode("-1");
            bean.setMessage("下单失败，您没有下单权限");
            return;
        }
    }

    private void deleteOldPriceDetails(Order order) {
        Map map = new HashMap();
        map.put("orderId", order.getId());
        map.put("status", 1);//1:删除
        priceDetailMapperDiy.updatePriceDetailStatusByOrderId(map);
    }

    private void updateScheduleSeatSold(Long scheduleId, Integer peoplenum) {
        Map sch = new HashMap();
        sch.put("id", scheduleId);
        sch.put("sold_change", peoplenum);
        scheduleMapperDiy.updateScheduleSeatSold(sch);
    }

    @Transactional
    @Override
    public ResultBean confirm(OrderConfirm order) {
        ResultBean bean = new ResultBean();
        Order od = orderMapper.selectByPrimaryKey(order.getId());
        SignContractInfo signContractInfo = signContractInfoMapper.selectByPrimaryKey(order.getContractId());
        if (od == null || !OrderStatusEnum.TO_CONFIRM.equals(od.getoStatus()) || Objects.isNull(signContractInfo) || !Objects.equals(signContractInfo.getOrderNo(), od.getoOrderNo())) {
            bean.setCode("-1");
            bean.setMessage("指定订单异常！");
            return bean;
        }
        isSalerCanDo(order, od, bean);//判断操作权限
        if (bean.isFail()) return bean;

        Order newOrder = new Order(order.getId());
        newOrder.setoConfirmTime(new Date());
        newOrder.setoStatus(order.getStatus() == 1 ? OrderStatusEnum.REJECT.getValue() : OrderStatusEnum.TO_PAY.getValue());
        orderMapper.updateByPrimaryKeySelective(newOrder);

        signContractInfo.setStatus(order.getStatus());
        signContractInfoMapper.updateByPrimaryKey(signContractInfo);

        od.setoStatus(newOrder.getoStatus());
        od.setpURealName(order.getpURealName() != null ? order.getpURealName() : (order.getPuAccount() != null ? order.getPuAccount() : ""));
        saveOrderLog(od, "审核订单", order.getStatus() == 1 ? "审核不通过" : "审核通过");
        bean.setCode("0");
        bean.setMessage("审核订单成功！");
        logger.error(JSON.toJSONString(bean));

        OrderFenxiaoUpdateDTO fx = new OrderFenxiaoUpdateDTO();
        fx.setOrderNo(od.getoOrderNo());
        fx.setOrderStatus(od.getoStatus());
        taskExecutor.execute(() -> syncTofenxiaoMall(fx));//同步到分销
        return bean;
    }

    @Override
    public ResultBean validateFailBeforPay(ValidateFailDO vo) {
        OrderCancelVO cancelVO = new OrderCancelVO();
        cancelVO.setMoney(BigDecimal.ZERO);
        cancelVO.setOrderId(vo.getOrderId());
        cancelVO.setRemark("支付时校验卡失败，取消订单。");
        cancelVO.setSaler(false);
        ResultBean bean = cancel(cancelVO);
        bean.setMessage("礼品卡校验失败，" + bean.getMessage());
        return bean;
    }

    @Transactional
    @Override
    public ResultBean wxPay(OrderWxPayVO wxPay) {
        //默认微信支付
        if(wxPay.getPayMethod() == null) wxPay.setPayMethod(WX_PAY.getValue());

        logger.info("订单支付入口进入：" + JSON.toJSONString(wxPay));
        Order od = orderMapperDiy.selectOrderByOrderNo(wxPay.getOrderNo());

        if (od == null) {
            return new ResultBean("-1", "指定订单异常！");
        }
        if (SF.equals(od.getoSource()) && (!TO_PAY.equals(od.getoStatus()) && !PAYED.equals(od.getoStatus()))) {
            return new ResultBean("-1", "订单状态异常！");
        }
        if (!SF.equals(od.getoSource()) && !TO_PAY.equals(od.getoStatus())) {
            return new ResultBean("-1", "订单状态异常！");
        }

        Long orderId = od.getId();
		Order newOrder = new Order(orderId);

        //保存支付记录
        OrderPay payRecord = savePayRecord(wxPay, orderId, wxPay.getpURealName());

        boolean finalPay = false;
        boolean firstPay = TO_PAY.equals(od.getoStatus());
        //分首次支付和二次支付
        if (TO_PAY.equals(od.getoStatus())) {
            newOrder.setoPayMethod(wxPay.getPayMethod());
            if (SF.equals(od.getoSource())) {
                Assert.isTrue(wxPay.getToPay().compareTo(od.getoFirstPay()) >= 0 && wxPay.getToPay().compareTo(od.getoRealPay()) <= 0, "支付金额错误");
                BigDecimal over = wxPay.getToPay().subtract(od.getoFirstPay());
                if(over.signum() > 0) {//首次支付超过首付金额
                    BigDecimal left = od.getoUnPay().subtract(over);
                    newOrder.setoUnPay(left);
                    if(left.signum() == 0) finalPay = true;//首次就付清
                }
            }
        } else if (PAYED.equals(od.getoStatus())) {
            BigDecimal left = od.getoUnPay().subtract(wxPay.getToPay());
            Assert.isTrue(left.signum() >= 0, "剩余支付金额错误");
            if(left.signum() == 0) finalPay = true;
            newOrder.setoUnPay(left);
            if(!od.getoPayMethod().equals(wxPay.getPayMethod()) && !MIX_PAY.equals(wxPay.getPayMethod())){
            	newOrder.setoPayMethod(MIX_PAY.getValue());//混合支付
            }
        }
        newOrder.setoStatus(PAYED.getValue());
        if (firstPay)
            newOrder.setoPayTime(new Date());
        if(needToChangeOfflineStatus(orderId,newOrder.getoUnPay())){
    		newOrder.setOfflineStatus(3);
    	}
        orderMapper.updateByPrimaryKeySelective(newOrder);

        MQTransformationUtils.transOrderAll(od,newOrder,payRecord,productMapper,priceDetailMapperDiy,taskExecutor,mqAssembleService);
        //taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncOrders(MQTransformationUtils.transOrder(orderMapper.selectByPrimaryKey(od.getId()), productMapper.selectByPrimaryKey(od.getoProductId()))));

        //taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncOrderPays(MQTransformationUtils.transOrderPay(payRecord)));

        //taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncOrderItem(MQTransformationUtils.transOrderItems(priceDetailMapperDiy.selectOrderPriceListByOrder(od))));

        if (CS.equals(od.getoSource())) {
            useOrderCard(od.getoOrderNo(), orderId);
            taskExecutor.execute(() -> doSynchroOrderToCard(orderId));//游客下单，同步订单至礼品卡
        } else if (finalPay) {//付了尾款再同步订单
            taskExecutor.execute(() -> doSynchroOrderToFenxiao(orderId));//公众号下单，同步订单至分销
        }

        if (firstPay) taskExecutor.execute(() -> sendSMS(od));//线程池异步执行，发送短信
        if(wxPay.getPayMethod()!=2){//线下支付审核，不需要调用paymentCallBack的同步接口
            taskExecutor.execute(() -> syncOrderPayRecord(od,wxPay));//同步支付信息给长沙
        }
        od.setoStatus(newOrder.getoStatus());//方便订单保存日志用

        String detail = OrderPayMethodEnum.getDescByValue(wxPay.getPayMethod());
        if(isBlank(od.getpURealName())) od.setpURealName(detail);
        saveOrderLog(od, detail, wxPay.getRemark());

        Map body = new HashMap();
        body.put("payId", payRecord.getId());
        return ResultBean.getSuccessResult(body);
    }

    private OrderPay savePayRecord(OrderWxPayVO wxPay, Long orderId, String realName) {
        OrderPay pay = new OrderPay();
        pay.setOpOrderId(orderId);
        pay.setOpPayNo(wxPay.getTransactionId());
        pay.setOpPayAmount(wxPay.getToPay());
        pay.setOpPayMethod(wxPay.getPayMethod());
        pay.setOpOprater(isBlank(realName) ? OrderPayMethodEnum.getDescByValue(wxPay.getPayMethod()) : realName);
        pay.setOpComments(wxPay.getRemark());
        pay.setOpPayTime(new Date());
        pay.setoIsmerge(false);
        payMapper.insertSelective(pay);
        return pay;
    }

    private void useOrderCard(String orderNo, Long id) {
        List<OrderCard> cards = orderCardMapper.selectCardsByOrderId(id);
        if (isEmpty(cards)) return;
        List<Map> cardList = new ArrayList<>(cards.size());
        for (OrderCard oc : cards) {
            Map<String, String> map = new HashMap<>();
            map.put("cardNo", oc.getCardNo());
            map.put("cardPwd", oc.getCardPass());
            map.put("orderNo", orderNo);
            cardList.add(map);
        }
        Map data = new HashMap();
        data.put("cardNoList", cardList);
        data.put("useDate", LocalDate.now().format(BASIC_ISO_DATE));
        Map param = new HashMap();
        param.put("data", data);

        JSONObject jsonObject = EncodingObjectWithMd5Utils.encoding(param);
        logger.info("订单使用卡:" + jsonObject.toJSONString());
        String url = shpCardInterfaceUrl + "/card/acceptCardUse";
        JSONObject result = HttpClientUtils.httpPost(url, (Map) jsonObject);
        logger.info("远程调用礼品卡use：" + JSON.toJSONString(result));
        String code = (String) result.get("code");
        if (!"200".equals(code)) {
            String msg = (String) result.get("msg");
            logger.error("[" + orderNo + "]礼品卡使用失败！");
            throw new RuntimeException(msg);
        }
    }

    /*定时任务：已预约订单，超出订购截止时间的（班期停售时间）自动取消预约*/
    @Scheduled(initialDelay = 1000 * 80, fixedDelay = 1000 * 60 * 3)//时间间隔(秒)
    public void autoCancelOverdueOrder() {
        List<Map> unpayOrders = orderMapperDiy.listUnpayOrders();
        if (isEmpty(unpayOrders)) return;
        for (Map map : unpayOrders) {
            Schedule s = new Schedule();
            s.setId(Long.parseLong(map.get("scheduleId").toString()));
            s.setsCalendar((Date) map.get("s_calendar"));
            s.setsLeaveTime((Date) map.get("s_leave_time"));
            s.setsStopSale(Integer.parseInt(map.get("s_stop_sale").toString()));
            s.setsStopType(Integer.parseInt(map.get("s_stop_type").toString()));
            s.setsStatus(Integer.parseInt(map.get("s_status").toString()));
            ResultBean bean = new ResultBean();
            validateScheduleOverDue(s, bean);
            if (bean.isFail()) {
                try {
                    autoCancel(map);
                    logger.info("自动取消订单【" + map.get("id") + "】成功！");
                } catch (Exception e) {
                    logger.error("自动取消订单失败：", e);
                }
            }
        }
    }

    @Transactional
    public void autoCancel(Map map) {
        logger.info("订单自动取消："+JSON.toJSONString(map));
        Order newOrder = new Order(Long.parseLong(map.get("id").toString()));
        newOrder.setoStatus(CANCEL.getValue());
        orderMapper.updateByPrimaryKeySelective(newOrder);

        Order od = new Order();
        od.setId(newOrder.getId());
        od.setoOrderNo(map.get("o_order_no").toString());
        od.setoScheduleId(Long.parseLong(map.get("scheduleId").toString()));
        od.setoStatus(CANCEL.getValue());
        od.setpURealName("system");
        od.setoSalerCompanyName((String) map.get("o_saler_company_name"));
        saveOrderLog(od, "订单自动取消", "");

        //如果是消费者下的单，可能需要解锁卡
        if (CS.equals(Byte.valueOf(map.get("o_source").toString()))) {
            releaseOrderCards(od.getId(), od.getoOrderNo());
        }

        int peopleNum = Integer.parseInt(map.get("o_people_num").toString());
        int seatSold = Integer.parseInt(map.get("s_seat_sold").toString());
        if (peopleNum > seatSold) {
            peopleNum = seatSold;
        }
        updateScheduleSeatSold(od.getoScheduleId(), -peopleNum);
        restoreTicketStock(newOrder, od.getoScheduleId());

        OrderFenxiaoUpdateDTO fx = new OrderFenxiaoUpdateDTO();
        fx.setOrderNo(od.getoOrderNo());
        fx.setOrderStatus(od.getoStatus());
        taskExecutor.execute(() -> syncTofenxiaoMall(fx));//同步到分销
    }

    /*恢复订单相关票的库存*/
    private void restoreTicketStock(Order od, Long scheduleId) {
        List<OrderPriceDetailDTO> pds = priceDetailMapperDiy.selectOrderPriceListByOrder(od);
        List<Map> list = new ArrayList<>();
        for(OrderPriceDetailDTO pd : pds) {
            if(TICKET_PRICE.equals(pd.getOpType())) {
                Map map = new HashMap();
                map.put("scheduleId", scheduleId);
                map.put("ticketId", pd.getOpTicketId());
                map.put("stockChange", -pd.getOpNum());
                list.add(map);
            }
        }
        if(!CollectionUtils.isEmpty(list)) {
            scheduleTicketMapperDiy.updateTicketStock(list);
        }
    }

    @Transactional
    @Override
    public ResultBean cancel(OrderCancelVO vo) {
        logger.info("订单取消："+JSON.toJSONString(vo));
        ResultBean bean = new ResultBean();
        Order od = vo.getOrderId()==null?orderMapper.selectOrderByOrderNo(vo.getoOrderNo()):orderMapper.selectByPrimaryKey(vo.getOrderId());
        if (od == null) {
            bean.setCode("-1");
            bean.setMessage("指定订单异常！");
            return bean;
        }

        if (vo.getSaler()) {
            isSalerCanDo(vo, od, bean);
        } else {
            isBuyerCanDo(vo, od, bean);
        }
        if (bean.isFail()) return bean;

        if (TO_CONFIRM.equals(od.getoStatus()) || TO_PAY.equals(od.getoStatus()) || REJECT.equals(od.getoStatus())) {
            Order newOrder = new Order(od.getId());
            newOrder.setoStatus(CANCEL.getValue());
            orderMapper.updateByPrimaryKeySelective(newOrder);

            od.setoStatus(newOrder.getoStatus());
            od.setpURealName(vo.getpURealName() != null ? vo.getpURealName() : (vo.getPuAccount() != null ? vo.getPuAccount() : ""));
            saveOrderLog(od, "订单取消", vo.getRemark());

            updateScheduleSeatSold(od.getoScheduleId(), -od.getoPeopleNum());
            restoreTicketStock(newOrder, od.getoScheduleId());
            deleteOldPriceDetails(od);

            OrderFenxiaoUpdateDTO fx = new OrderFenxiaoUpdateDTO();
            fx.setOrderNo(od.getoOrderNo());
            fx.setOrderStatus(od.getoStatus());
            taskExecutor.execute(() -> syncTofenxiaoMall(fx));//同步到分销

            //如果是消费者下的单，可能需要解锁卡
            if (CS.equals(od.getoSource())) releaseOrderCards(od.getId(), od.getoOrderNo());

        } else {
            bean.setCode("-1");
            bean.setMessage("订单状态异常！");
            return bean;
        }

        bean.setMessage("订单取消成功！");
        logger.info(vo.getoOrderNo()+"订单取消成功！");
        return bean;
    }

    private void releaseOrderCards(Long id, String orderNo) {
        List<OrderCard> cards = orderCardMapper.selectCardsByOrderId(id);
        if (isEmpty(cards)) return;
        List<CardDO> list = cards.stream().map(c -> {
            CardDO d = new CardDO();
            d.setCardNo(c.getCardNo());
            d.setPass(c.getCardPass());
            return d;
        }).collect(Collectors.toList());
        try {
            lockReleaseCards(orderNo, list, "0");
        } catch (Exception e) {
            logger.error("[" + orderNo + "]解锁卡失败！" + e.getMessage(), e);
        }
    }

    @Override
    public ResultBean sendSMS(Order order) {
        OrderSMSDTO od = orderMapperDiy.selectOrderSmsDTO(order);
        od.setpURealName("system");

        OrderTourist ot = new OrderTourist();
        ot.setOtOrderId(order.getId());
        List<OrderTouristDTO> tourists = touristMapperDiy.selectOrderTouristDTOList(od);
        for (OrderTouristDTO tourist : tourists) {

            od.setOtPhone(tourist.getOtPhone());
            HashMap<String, Object> map = new HashMap<>();
            map.put("#touristName#", tourist.getOtName());
            map.put("#peopleNum#", od.getoPeopleNum());
            map.put("#calendar#", DateFormatUtils.format(od.getsCalendar(), "yyyy-MM-dd"));
            map.put("#productName#", od.getpName());
            map.put("#servicePhone#", od.getoServicerPhone());
            map.put("#productPlace#", tourist.getLvDepartureName());

            try {
                String url = groupAdviceUrl + UrlUtil.getURLEncoderString(DesUtil.encrypt(od.getoOrderNo(), groupAdviceMessageKey));
                map.put("#groupAdviceNote#", url);
                sendSmsJob(map, od, tourist, smsTemplateNo);
            } catch (Exception e) {
                logger.error("转码失败：", e);
            }

        }

        saveOrderLog(od, "短信发送成功！", "");
        logger.info("短信发送成功！" + JSON.toJSONString(od));
        return ResultBean.getSuccessResult();
    }

    private void sendSmsJob(Map map, OrderSMSDTO od, OrderTouristDTO tourist, String templateNo) {
        String rawContent = JSONObject.toJSONString(map);
        try {
            String content = SMSUtil.urlencode(map);

            String strRes = SMSUtil.sendSMS(tourist.getOtPhone(), templateNo, content);
            Map result = (Map) JSONObject.parse(strRes);
            if ("0".equals(result.get("error_code").toString())) {
                saveSMS(od, rawContent, true, "");
                logger.info("短信发送成功！" + JSON.toJSONString(od) + "," + JSON.toJSONString(rawContent));
            } else {
                saveSMS(od, rawContent, false, result.get("reason").toString());
                saveOrderLog(od, "短信发送失败！", result.get("reason").toString());
                logger.error("短信发送失败!" + JSON.toJSONString(od));
            }
        } catch (Exception e) {
            saveSMS(od, rawContent, false, "出现异常");
            saveOrderLog(od, "短信发送失败！", "出现异常");
            logger.error("订单【" + od.getoOrderNo() + "】发送短信失败！" + rawContent, e);
        }
    }

    @Scheduled(initialDelay = 1000 * 60, fixedDelay = 1000 * 60 * 5)//时间间隔5分钟
    public void synchroOrdersToFenxiao() {
        while (true) {
            if (doSynchroOrderToFenxiao(null).isFail()) break;
        }
    }

    @Scheduled(initialDelay = 1000 * 120, fixedDelay = 1000 * 60 * 5)//时间间隔5分钟
    public void synchroOrdersToCard() {
        while (true) {
            if (doSynchroOrderToCard(null).isFail()) break;
        }
    }

    private ResultBean<Object> doSynchroOrderToCard(Long orderId) {
        if (orderId != null) {//如果是微信支付成功后来调用，先等待一定时间，等待订单状态的改变，再去查询并操作。
            try {
                Thread.sleep(5000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        Map param = new HashMap();
        param.put("orderId", orderId);
        param.put("oSource", CS.getValue());
        OrderSynchroDTO o = orderMapperDiy.selectOrderSynchroDTO(param);
        if (o == null) return ResultBean.getErrorResult();
        return synchroOrderRemote(o, CS);
    }

    private ResultBean doSynchroOrderToFenxiao(Long orderId) {
        if (orderId != null) {//如果是微信支付成功后来调用，先等待一定时间，等待订单状态的改变，再去查询并操作。
            try {
                Thread.sleep(5000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        Map param = new HashMap();
        param.put("orderId", orderId);
        param.put("oSource", H5.getValue());
        OrderSynchroDTO o = orderMapperDiy.selectOrderSynchroDTO(param);
        if (o == null) return ResultBean.getErrorResult();
        return synchroOrderRemote(o, H5);
    }

    private ResultBean synchroOrderRemote(OrderSynchroDTO o, OrderSourceEnum source) {
        String dest = H5.equals(source) ? "【分销系统】" : CS.equals(source) ? "【礼品卡系统】" : "【】";
        try {
            ResultBean res = null;
            if (H5.equals(source)) {//同步到分销
                // 查找上两级代理人信息
                Map secondLevel = getSuperLevel(o.getoBuyerId());
                if (secondLevel != null) {
                    o.setSecondLevel(secondLevel);
                    Map thirdLevel = getSuperLevel(Long.parseLong(secondLevel.get("id").toString()));
                    if (thirdLevel != null) o.setThirdLevel(thirdLevel);
                }
                res = synchroOrderRemoteToFenxiao(o);
            } else if (CS.equals(source)) {//同步到礼品卡
                res = synchroOrderRemoteToCard(o);
            }

            if (res.isSuccess()) {
                Order order = new Order(o.getId());
                order.setoSynchro(true);
                orderMapper.updateByPrimaryKeySelective(order);
                saveOrderLog(o, dest + "订单同步成功", dest + "订单同步成功");
                logger.info(dest + "订单【" + o.getId() + "】同步成功");
                return ResultBean.getSuccessResult();
            } else {
                saveOrderLog(o, dest + "订单同步失败", res.getMessage());
                return ResultBean.getErrorResult();
            }
        } catch (Exception e) {
            logger.error(dest + "同步订单失败！", e);
            saveOrderLog(o, dest + "订单同步", dest + "订单同步失败");
            return ResultBean.getErrorResult();
        }
    }

    /*查询上级代理人*/
    private Map getSuperLevel(Long uid) {
        Map u = orderMapperDiy.selectAgentSuperUser(uid);
        if (u != null) return u;
        u = orderMapperDiy.selectSuperUser(uid);
        return u;
    }

    private ResultBean synchroOrderRemoteToCard(OrderSynchroDTO o) {
        Map data = new HashMap();
        data.put("orderSrc", "10");
        data.put("orderNo", o.getoOrderNo());
        data.put("orderTime", DateFormatUtils.format(o.getCreateTime(), "yyyy-MM-dd HH:mm:ss"));
        data.put("custUid", o.getCreateUser().toString());
        data.put("totalAmount", o.getoRealPay().toString());
        data.put("actualAmount", o.getoToPay().toString());
        data.put("orderStatus", "10");
        data.put("productCode", o.getPid().toString());
        data.put("lastUpdatedDate", DateFormatUtils.format(new Date(), "yyyy-MM-dd HH:mm:ss"));
        data.put("yn", 1);
        List<OrderCard> cards = orderCardMapper.selectCardsByOrderId(o.getId());
        if (!isEmpty(cards)) {
            String cardNos = cards.stream().map(c -> c.getCardNo()).collect(Collectors.joining(","));
            data.put("cardList", cardNos);
        } else {
            data.put("cardList", "");
        }

        Map param = new HashMap();
        param.put("data", data);

        JSONObject jsonObject = EncodingObjectWithMd5Utils.encoding(param);
        logger.info("订单同步到礼品卡:" + jsonObject.toJSONString());
        String url = shpCardInterfaceUrl + "/lineOrder/acceptLineOrder";
        JSONObject result = HttpClientUtils.httpPost(url, (Map) jsonObject);
        logger.info("远程调用礼品卡,同步订单：" + JSON.toJSONString(result));
        String code = (String) result.get("code");
        if (!"200".equals(code)) {
            String msg = (String) result.get("msg");
            return new ResultBean("-1", msg);
        } else {
            return ResultBean.getSuccessResult();
        }
    }

    private ResultBean synchroOrderRemoteToFenxiao(OrderSynchroDTO o) {
        /**
         * 修改者：王斌
         * 时间：2017-12-28
         * 如果是游客订单，直接返回成功
         */
        Integer ObuyerUstype = o.getBuyerUstype();
        Integer buyerUstype = getStype(ObuyerUstype);
        if (buyerUstype.equals(Integer.valueOf(3))) {
            return ResultBean.getSuccessResult();
        }

        List<OrderPriceDetailDTO> details = priceDetailMapperDiy.selectOrderPriceListByOrder(new Order(o.getId()));

        Map order = new HashMap();
        /**
         * 修改者：王斌
         * 时间：2017-12-28
         * buyerUstype 买家类型  可选值说明 0:员工 1:非员工 2:未知
         * b2b系统中  0:非销售类 1:销售类 2:签约人员 3:路人甲 null 其他  ，与分销系统的对应关系   0，1表示系统员工 ，2表示非员工，null表示未知
         */
        Long buyerCompanyId = o.getBuyerCompanyId();
        order.put("buyerCompanyId", o.getBuyerCompanyId());
        order.put("buyerUstype", buyerUstype);

        order.put("order_no", o.getoOrderNo());
        order.put("buyer_openid", o.getBuyerOpenId());
        order.put("paid_time", DateUtils.addDays(o.getsCalendar(), o.getpDays()-1).getTime() / 1000);//传回团日期(结算日)
        order.put("add_time", o.getCreateTime().getTime() / 1000);
        order.put("seller_openid", publicId);
        order.put("status", 2);
        order.put("uid", "");
        order.put("orderSource", "b2b");
        order.put("pay_money", o.getoRealPay());
        order.put("total", o.getoRealPay());
        order.put("buyer_time", o.getPayTime().getTime() / 1000);

        List<Map> orderItemList = new ArrayList<>();
        for (OrderPriceDetailDTO dt : details) {
            for (int i = 0; i < dt.getOpNum(); i++) {
                if (dt.getOpType() != 0) continue;
                Map orderItem = new HashMap();
                orderItem.put("product_id", o.getoProductId().toString());
                orderItem.put("code", o.getpNo());
                orderItem.put("product_name", o.getpName());
                orderItem.put("qty", "1");
                orderItem.put("price", dt.getOpPrice().toString());
                orderItem.put("real_amount", dt.getOpPrice().toString());

                orderItem.put("categoryId", dt.getCategory());
                orderItem.put("category", dt.getCategoryName());
                orderItem.put("unitPriceId", dt.getOpTicketId().toString());
                orderItem.put("priceName", dt.getOpPriceName());
                orderItemList.add(orderItem);
            }
        }
        order.put("order_item", orderItemList);

        Map oneLevel = new HashMap();
        oneLevel.put("openId", o.getBuyerOpenId());
        oneLevel.put("phone", o.getBuyerPhone());
        oneLevel.put("name", o.getBuyerName());
        oneLevel.put("uid", o.getBuyerUid());
        oneLevel.put("companyId", buyerCompanyId);
        oneLevel.put("usType", buyerUstype);

        order.put("one_level", oneLevel);

        //二级返佣
        if (o.getSecondLevel() != null) {
            Map m = o.getSecondLevel();
            Map secondLevel = new HashMap();
            if (1 != Integer.parseInt(m.get("u_status").toString())) {//离职状态不能参与返佣
                secondLevel.put("openId", m.get("u_wx_openid"));
                secondLevel.put("phone", m.get("u_tel"));
                secondLevel.put("name", m.get("u_real_name"));
                secondLevel.put("uid", m.get("u_uid") != null ? m.get("u_uid") : m.get("id"));

                secondLevel.put("companyId", m.get("companyId"));
                secondLevel.put("usType", getStype(Integer.valueOf(String.valueOf(m.get("usType")))));
            }
            order.put("second_level", secondLevel);
        } else {
            order.put("second_level", new HashMap<>());
        }
        //三级返佣
        if (o.getThirdLevel() != null) {
            Map m = o.getThirdLevel();
            Map thirdLevel = new HashMap();
            if (1 != Integer.parseInt(m.get("u_status").toString())) {//离职状态不能参与返佣
                thirdLevel.put("openId", m.get("u_wx_openid"));
                thirdLevel.put("phone", m.get("u_tel"));
                thirdLevel.put("name", m.get("u_real_name"));
                thirdLevel.put("uid", m.get("u_uid") != null ? m.get("u_uid") : m.get("id"));

                thirdLevel.put("companyId", m.get("companyId"));
                thirdLevel.put("usType", getStype(Integer.valueOf(String.valueOf(m.get("usType")))));
            }
            order.put("third_level", thirdLevel);
        } else {
            order.put("third_level", new HashMap<>());
        }

        Map param = new HashMap();
        param.put("order", order);

        StringBuilder url = new StringBuilder(orderUrl);
        JSONObject jsonObject = EncodingObjectWithMd5Utils.encoding(param);
        logger.info("订单同步:" + jsonObject.toJSONString());
        JSONObject result = HttpClientUtils.httpPost(url.toString(), (Map) jsonObject);
        logger.info("订单同步result:" + jsonObject.toJSONString());
        if (result != null && result.get("result") != null) {
            String str = (String) result.get("result");
            if ("1".equalsIgnoreCase(str)) {
                return ResultBean.getSuccessResult();
            }
        }
        String msg = result == null ? "" : result.get("data") != null ? result.get("data").toString() : "";
        return new ResultBean("-1", msg);
    }

    private int getStype(Integer ObuyerUstype) {
        return ObuyerUstype == null ? 2 : (ObuyerUstype.equals(0) || ObuyerUstype.equals(1)) ? 0 : 1;
    }

    private void saveSMS(OrderSMSDTO od, String content, boolean success, String reason) {
        Sms sms = new Sms();
        sms.setsCompanyId(od.getoSalerCompanyId());
        sms.setsCompanyName(od.getoSalerCompanyName());
        sms.setsOrderId(od.getId());
        sms.setsTempId(Long.parseLong(smsTemplateNo));
        sms.setsTel(od.getOtPhone());
        sms.setsSms(content);
        if (success) {
            sms.setsStatus(1);
        } else {
            sms.setsStatus(2);
            sms.setsReason(reason);
        }
        smsMapper.insertSelective(sms);
    }

    private void isSalerCanDo(BaseVO vo, Order od, ResultBean bean) {
        if (DATA_LIMIT_USER.equals(vo.getPuDataLimit()) && !od.getoSalerId().equals(vo.getPuserId())) {
            bean.setCode("-1");
            bean.setMessage("您无权操作该订单！");
            return;
        }
        if (DATA_LIMIT_COMPANY.equals(vo.getPuDataLimit()) && !vo.getPcompanyId().equals(od.getoSalerCompanyId())) {
            bean.setCode("-1");
            bean.setMessage("您无权操作该订单！");
            return;
        }
        if (DATA_LIMIT_DEPART.equals(vo.getPuDataLimit())) {
            User saler = userMapper.queryForUserByIdSingle(od.getoSalerId());
            if (saler == null || !vo.getPuDepartmentId().equals(saler.getuDepartmentId())) {
                bean.setCode("-1");
                bean.setMessage("您无权操作该订单！");
                return;
            }
        }
    }

    private void isBuyerCanDo(BaseVO vo, Order od, ResultBean bean) {
        if (DATA_LIMIT_USER.equals(vo.getPuDataLimit()) && !od.getoBuyerId().equals(vo.getPuserId()) && !od.getCreateUser().equals(vo.getPuserId())) {
            bean.setCode("-1");
            bean.setMessage("您无权操作该订单！");
            return;
        }
        if (DATA_LIMIT_COMPANY.equals(vo.getPuDataLimit()) && !vo.getPcompanyId().equals(od.getoBuyerCompanyId())) {
            bean.setCode("-1");
            bean.setMessage("您无权操作该订单！");
            return;
        }
        if (DATA_LIMIT_DEPART.equals(vo.getPuDataLimit())) {
            User buyer = userMapper.queryForUserByIdSingle(od.getoBuyerId());
            if (buyer == null || !vo.getPuDepartmentId().equals(buyer.getuDepartmentId())) {
                bean.setCode("-1");
                bean.setMessage("您无权操作该订单！");
                return;
            }
        }
    }

    @Override
    public void saveOrderLog(Order order, String opd, String remark) {
        OrderLogs log = new OrderLogs();
        log.setOlOrderId(order.getId());
        log.setOlCompanyName(order.getoSalerCompanyName());
        log.setOlStatus(true);
        log.setOlOrderStatus(order.getoStatus());
        log.setOlOperater(order.getpURealName() != null ? order.getpURealName() : (order.getPuAccount() != null ? order.getPuAccount() : ""));
        log.setOlOperateDetail(opd);
        log.setOlRemark(remark);
        int i = logsMapper.insertSelective(log);
        if (i != 1) {
            throw new RuntimeException("保存订单日志失败！");
        }
    }

    private void saveOrderTourists(OrderAddDTO order) {
        List<OrderTouristAddVO> ts = order.getTourists();
        ts.forEach(t -> {
            t.setOtOrderId(order.getId());
            t.setOtExtStatus(0);
        });
        int i = touristMapperDiy.batchInsertOrderTourist(ts);
        if (i != ts.size()) {
            throw new RuntimeException("保存订单游客信息失败！");
        }
    }

    private void saveOrderPriceDetails(OrderAddDTO order) {
        List<OrderPriceDetailVO> pd = order.getPriceDetails();
        pd.forEach(d -> d.setOpOrderId(order.getId()));
        int i = priceDetailMapperDiy.batchInsertOrderPriceDetails(pd);
        if (i != pd.size()) {
            throw new RuntimeException("保存订单价格详情失败！");
        }
    }

    private void updateSchedule(Schedule sch, OrderAddDTO order) {
        Schedule newSch = new Schedule();
        Integer sold = sch.getsSeatSold();
        Integer sold2 = order.getoPeopleNum();
        newSch.setId(sch.getId());
        newSch.setsSeatSold(sold == null ? sold2 : sold + sold2);
        int i = scheduleMapper.updateByPrimaryKeySelective(newSch);
        if (i != 1) {
            throw new RuntimeException("更新班期信息失败！");
        }
    }

    private void insertOrder(Product pd, Schedule sch, User servicer, List<Ticket> tickets, OrderAddDTO order, ProductContractTemplate pdContract) {
        Long pCompId = null;
        Long salerId = null;
        if(0 == pd.getAscription()) {//非集结产品
            pCompId = pd.getCompanyId();
            salerId = pd.getCreateUser();
        } else {//集结产品，卖家为复制出相应的票的卖家
            pCompId = tickets.get(0).gettCompanyId();
            salerId = tickets.get(0).getCreateUser();
        }
        Company c = companyMapper.selectByPrimaryKey(pCompId);
        if(c == null) throw new RuntimeException("产品公司信息有误！");
        User saler = userMapper.queryForUserByIdSingle(salerId);
        if(saler == null) throw new RuntimeException("产品计调信息有误！");
        ScheduleSetting scheduleSetting = scheduleSettingMapper.selectByScheduleIdAndCompanyId(sch.getId(), pCompId);
        order.setoGroupOrderNo(scheduleSetting.getGroupNo());
        order.setoOrderNo(generateOrderNo());
        order.setoProductId(pd.getId());
        order.setoSalerCompanyId(c.getId());
        order.setoSalerCompanyName(c.getcName());
        order.setoSalerId(saler.getId());
        order.setoSalerName(saler.getuRealName());
        order.setoServicer(servicer.getuRealName());
        order.setoServicerPhone(isNotBlank(pd.getpPhone()) ? pd.getpPhone() : servicer.getuTel());
        order.setoBedNum(getBedNum(order));
        order.setoRoomAdjust(getRoomAdjust(order));
        order.setoMarketPrice(getMarketPrice(order, tickets));
        order.setoTotalPrice(getTotalPrice(order, tickets));
        order.setoRealPrice(getRealPrice(order));
        order.setoRealPay(getRealPay(order));
        order.setoIsmerge((byte) 0);
        order.setoPlan(false);
        if (Objects.equals(order.getBookType(), 1) && !Objects.isNull(pd.getpPayAmount())) {
            Assert.notNull(pd.getpFirstPayType(), "请指定首付款类型:1-固定金额(每人) 2-百分比(订单总额)");
            order.setoSource((byte) 4);
            if(1 == pd.getpFirstPayType()) {
                order.setoFirstPay(pd.getpPayAmount().multiply(new BigDecimal(order.getoPeopleNum())));
                Assert.isTrue(order.getoFirstPay().compareTo(order.getoRealPay()) <= 0, "订单固定首付款数额有误");
                order.setoUnPay(order.getoRealPay().subtract(order.getoFirstPay()));
            } else {
                order.setoFirstPay(order.getoRealPay().multiply(pd.getpPayAmount()).divide(new BigDecimal(100)).setScale(0, 0));
                order.setoUnPay(order.getoRealPay().subtract(order.getoFirstPay()));
            }
        }
        if (pdContract != null) {
            order.setoStatus(TO_CONFIRM.getValue());
        } else {
            order.setoStatus(TO_PAY.getValue());
        }
        order.setoInvoiceAmount(order.getoRealPay());
        order.setoInvalidTime(DateUtils.addHours(new Date(), invalidHour));//失效时间：小时
        int i = orderMapper.insertSelective(order);
        if (i != 1) {
            throw new RuntimeException("保存订单记录失败!");
        }
    }

    /*支付价：实际结算价-活动优惠*/
    private BigDecimal getRealPay(OrderAddDTO order) {
        return getRealPrice(order);
    }

    /*实际结算价=结算价总额-结算优惠*/
    private BigDecimal getRealPrice(OrderAddDTO order) {
        return order.getoSettlementReferences() == null ? order.getoTotalPrice() : order.getoTotalPrice().subtract(order.getoSettlementReferences());
    }

    /*结算价总额=同行总价+总房差+总接送*/
    private BigDecimal getTotalPrice(OrderAddDTO order, List<Ticket> tickets) {
        BigDecimal settTotal = order.getPriceDetails().stream().filter(p -> TICKET_PRICE.equals(p.getOpType())).map(p -> {
            Ticket tk = tickets.stream().filter(t -> t.getId().equals(p.getOpTicketId())).findFirst().get();
            return tk.gettPeerPrice().multiply(BigDecimal.valueOf(p.getOpNum()));
        }).reduce(BigDecimal::add).get();
        return settTotal.add(getTotalTransfer(order.getTourists())).add(getRoomAdjust(order));
    }

    /*市场价=市场总价+总房差+总接送-对顾客优惠价*/
    private BigDecimal getMarketPrice(OrderAddDTO order, List<Ticket> tickets) {
        BigDecimal marketTotal = order.getPriceDetails().stream().filter(p -> TICKET_PRICE.equals(p.getOpType())).map(p -> {
            Ticket tk = tickets.stream().filter(t -> t.getId().equals(p.getOpTicketId())).findFirst().get();
            return tk.gettMarketPrice().multiply(BigDecimal.valueOf(p.getOpNum()));
        }).reduce(BigDecimal::add).get();
        marketTotal = marketTotal.add(getTotalTransfer(order.getTourists())).add(getRoomAdjust(order));
        marketTotal = order.getoPreferentialAmount() == null ? marketTotal : marketTotal.subtract(order.getoPreferentialAmount());
        return marketTotal;
    }

    /*总接送费*/
    private BigDecimal getTotalTransfer(List<OrderTouristAddVO> tourists) {
        return tourists.stream().map(t -> {
            BigDecimal lv = t.getOtLeavePrice() != null ? t.getOtLeavePrice() : BigDecimal.ZERO;
            BigDecimal rt = t.getOtReturnPrice() != null ? t.getOtReturnPrice() : BigDecimal.ZERO;
            return lv.add(rt);
        }).reduce(BigDecimal::add).orElse(BigDecimal.ZERO);
    }

    /*总房差*/
    private BigDecimal getRoomAdjust(OrderAddDTO order) {
        final BigDecimal[] total = {BigDecimal.ZERO};
        order.getPriceDetails().stream().filter(p -> ROOM_DIFF.equals(p.getOpType())).forEach(p -> total[0] = total[0].add(p.getOpTotalPrice() != null ? p.getOpTotalPrice() : BigDecimal.ZERO));
        return total[0];
    }

    /*床位数*/
    private Integer getBedNum(OrderAddDTO order) {
        final int[] roomDiff = {0};
        order.getPriceDetails().stream().filter(p -> ROOM_DIFF.equals(p.getOpType())).forEach((P -> roomDiff[0] += P.getOpNum()));
        Long adult = order.getTourists().stream().filter(t -> t.getOtType().equals(0)).count();
        return adult.intValue() + roomDiff[0];
    }

    private void validatePeopleNum(Schedule sch, OrderAddDTO order, ResultBean bean) {
        if (nonNull(sch.getsSeatTotal()) && nonNull(sch.getsSeatSold())) {
            if (sch.getsSeatSold() + order.getoPeopleNum() > sch.getsSeatTotal()) {
                bean.setCode("-1");
                bean.setMessage(String.format("已超过班期人数总量【%d】限制!", sch.getsSeatTotal()));
                return;
            }
        }
    }

    private void validateTickets(List<Ticket> tickets, List<OrderPriceDetailVO> priceDetails, List<OrderTouristAddVO> tourists, Schedule sch, ResultBean bean) {
        if (isEmpty(tickets)) {
            bean.setCode("-1");
            bean.setMessage("指定票信息不存在!");
            return;
        }

        if(tickets.stream().anyMatch(t -> !t.gettCompanyId().equals(tickets.get(0).gettCompanyId()))) {
            bean.setCode("-1");
            bean.setMessage("您购买的票不是属于同一公司!");
            return;
        }

        if(tickets.stream().anyMatch(t -> isNull(t.getsMarketPrice()))) {
            bean.setCode("-1");
            bean.setMessage("该班期下有票未设置价格！");
            return;
        }

        List<Map> schTk = new ArrayList<>();
        for(OrderPriceDetailVO d : priceDetails) {
            if(TICKET_PRICE.equals(d.getOpType())) {
                for (Ticket t : tickets) {
                    if(t.getId().equals(d.getOpTicketId())) {
                        if(t.getsStock() != null && t.getsStock() != -1) {
                            if(d.getOpNum() > t.getsStock()) {
                                bean.setCode("-1");
                                bean.setMessage("您选择的票库存不够了！");
                                return;
                            } else {
                                Map map = new HashMap();
                                map.put("scheduleId", sch.getId());
                                map.put("ticketId", t.getId());
                                map.put("stockChange", d.getOpNum());
                                schTk.add(map);
                            }
                        }
                    }
                }
            }
        }
        //更新库存
        if(!CollectionUtils.isEmpty(schTk)) {
            logger.info("更新库存：" + JSON.toJSONString(schTk));
            scheduleTicketMapperDiy.updateTicketStock(schTk);
        }

        ScheduleDepartsSearchVO vo = new ScheduleDepartsSearchVO();
        vo.setId(sch.getId());
        List<Departure> dps = scheduleMapperDiy.selectDepartures(vo);
        if (isEmpty(dps)) {
            bean.setCode("-1");
            bean.setMessage("接送始发站信息有误！");
            return;
        }
        List<DepartureWithStopsDTO> dps2 = scheduleMapperDiy.selectDeparturesWithStops(vo);
        tourists.stream().forEach(r -> {
            Ticket tk = tickets.stream().filter(t -> t.getId().equals(r.getOtTicketId()) || t.getId().equals(r.getSubTicketId())).findFirst().orElse(null);
            if (tk == null) {
                bean.setCode("-1");
                bean.setMessage(String.format("指定id为【%d】票信息不存在!", r.getOtTicketId()));
                return;
            }
            r.setOtType(tk.gettType());
            r.setOpPrice(tk.gettPeerPrice());

            if (DepartureTypeEnum.ORIGINAL.equals(r.getOtLeaveType())) {
                if (dps.stream().filter(d -> d.getId().equals(r.getOtLeaveId())).findFirst().orElse(null) == null) {
                    bean.setCode("-1");
                    bean.setMessage(String.format("指定id为【%d】始发站不存在!", r.getOtLeaveId()));
                    return;
                } else {
                    r.setOtLeavePrice(BigDecimal.ZERO);
                }
            } else {
                if (isEmpty(dps2)) {
                    bean.setCode("-1");
                    bean.setMessage("接送站点信息有误！");
                    return;
                }
                DepartureWithStopsDTO p = dps2.stream().filter(d -> d.getId().equals(r.getOtLeaveId())).findFirst().orElse(null);
                if (p == null) {
                    bean.setCode("-1");
                    bean.setMessage(String.format("指定id为【%d】接送线路不存在!", r.getOtLeaveId()));
                    return;
                } else {
                    r.setOtLeavePrice(p.getSbPrice());
                }
            }

            if (DepartureTypeEnum.ORIGINAL.equals(r.getOtReturnType())) {
                if (dps.stream().filter(d -> d.getId().equals(r.getOtReturnId())).findFirst().orElse(null) == null) {
                    bean.setCode("-1");
                    bean.setMessage(String.format("指定id为【%d】始发站不存在!", r.getOtReturnId()));
                    return;
                } else {
                    r.setOtReturnPrice(BigDecimal.ZERO);
                }
            } else {
                if (isEmpty(dps2)) {
                    bean.setCode("-1");
                    bean.setMessage("接送站点信息有误！");
                    return;
                }
                DepartureWithStopsDTO p = dps2.stream().filter(d -> d.getId().equals(r.getOtReturnId())).findFirst().orElse(null);
                if (p == null) {
                    bean.setCode("-1");
                    bean.setMessage(String.format("指定id为【%d】接送线路不存在!", r.getOtReturnId()));
                    return;
                } else {
                    r.setOtReturnPrice(p.getSbPrice());
                }
            }
        });

        //套票
        List<Long> setIds = tourists.stream().filter(t -> t.getOtTicketType() == 1).map(OrderTouristAddVO::getOtTicketId).collect(Collectors.toList());
        TicketSetVO setVO = new TicketSetVO();
        setVO.setSetIds(setIds);
        List<TicketSet> sets = isEmpty(setIds) ? null : ticketSetMapper.selectListSelectiveByIds(setVO);
        List<OrderPriceDetailVO> remove = new ArrayList<>();
        OrderPriceDetailVO roomDiff = new OrderPriceDetailVO();
        roomDiff.setOpType(1);//房差
        roomDiff.setOpNum(1);
        roomDiff.setOpPriceName("房差");
        roomDiff.setOpPrice(BigDecimal.ZERO);
        priceDetails.stream()
                .filter(d -> TICKET_PRICE.equals(d.getOpType()) || ROOM_DIFF.equals(d.getOpType()))
                .forEach(d -> {
                    Ticket tk = tickets.stream().filter(t -> t.getId().equals(d.getOpTicketId())).findFirst().orElse(null);
                    if (tk == null) {
                        bean.setCode("-1");
                        bean.setMessage(String.format("指定id为【%d】票信息不存在!", d.getOpTicketId()));
                        return;
                    }
                    //计算套票数量
                    if (!isEmpty(sets) && tk.gettTicketType() == 1) {
                        int seatNum = sets.stream().filter(s -> s.getTsSetId().equals(d.getOpTicketId())).mapToInt(TicketSet::getTsSeats).reduce((i, j) -> i + j).getAsInt();
                        d.setOpNum(d.getOpNum() / seatNum);
                    }
                    if (TICKET_PRICE.equals(d.getOpType()) && d.getOpNum() != null && d.getOpNum() > 0) {
                        d.setOpPriceName(tk.gettName());
                        d.setOpPrice(tk.gettPeerPrice());
                        d.setOpTotalPrice(tk.gettPeerPrice().multiply(new BigDecimal(d.getOpNum())));
                        d.setOpAdultNum(tk.gettAdultNum());
                        d.setOpChildNum(tk.gettChildNum());
                    }

                    if (ROOM_DIFF.equals(d.getOpType())) {
                        if (tk.gettTicketType() == 1) {
                            remove.add(d);//套票没有房差
                            return;
                        }
                        if (tk.gettType() == 1) {//儿童票床位默认0
                            d.setRoomNum(d.getRoomNum() + d.getOpNum());
                        }
                        d.setOpNum(d.getRoomNum() - d.getOpNum());
                        if (d.getOpNum() != 0) {
                            d.setOpPrice(d.getOpNum() > 0 ? tk.gettPriceAdd() : tk.gettPriceReduce());
                            if(null==d.getOpPrice()){
                                d.setOpPrice(new BigDecimal("0"));
                            }
                            d.setOpTotalPrice(d.getOpPrice().multiply(new BigDecimal(d.getOpNum())));
                        }
                        //合并房差为一条
                        if (nonNull(d.getOpTotalPrice()) && d.getOpTotalPrice().compareTo(BigDecimal.ZERO) > 0) {
                            roomDiff.setOpPrice(roomDiff.getOpPrice().add(d.getOpTotalPrice()));
                        }
                        remove.add(d);
                    }
                });
        if (!isEmpty(remove)) priceDetails.removeAll(remove);
        if (roomDiff.getOpPrice().compareTo(BigDecimal.ZERO) > 0) {
            roomDiff.setOpTotalPrice(roomDiff.getOpPrice());
            priceDetails.add(roomDiff);
        }
        //接送费加到价格详情
        OrderPriceDetailVO pickUp = getPickUp(tourists);
        if (pickUp != null) {
            priceDetails.add(pickUp);
        }

    }

    private OrderPriceDetailVO getPickUp(List<OrderTouristAddVO> tourists) {
        BigDecimal price = getTotalTransfer(tourists);
        if (price == null || price.compareTo(BigDecimal.ZERO) == 0) return null;
        OrderPriceDetailVO pick = new OrderPriceDetailVO();
        pick.setOpNum(1);
        pick.setOpPrice(price);
        pick.setOpPriceName(PICKUP.getDesc());
        pick.setOpTotalPrice(price);
        pick.setOpType(PICKUP.getValue());
        return pick;
    }

    private void autoArrangeSeat(OrderAddDTO order, List<BusDTO> busDTOS, List<Order> soldSeats) {
        int num = order.getoPeopleNum();
        int count = num;
        List<Map> seatsMap = new ArrayList<>();

        //如果有预留，优先安排预留的座位
        for (BusDTO b : busDTOS) {
            List<BusHoldDTO> holds = b.getBusHolds();
            if (!isEmpty(holds)) {
                String seats = holds.stream().filter(h -> h.getbCompanyId().equals(order.getoBuyerCompanyId())).findFirst().map(BusHold::getbSeat).orElse("");
                if (isNotBlank(seats)) {
                    List<Integer> ss = Arrays.stream(seats.split(",")).mapToInt(Integer::parseInt).boxed().collect(Collectors.toList());
                    //售出的座位，不能安排
                    List<Integer> invalid = new ArrayList<>();
                    if (!isEmpty(soldSeats)) {
                        soldSeats.stream().filter(s -> !s.getId().equals(order.getId())).map(Order::getoBusSeat).forEach(s -> {
                            JSONArray objs = JSONObject.parseArray(s);
                            Arrays.stream(objs.toArray()).map(obj -> (Map) obj).filter(obj -> b.getId().equals(Long.parseLong(obj.get("busId").toString()))).forEach(obj ->
                                    invalid.addAll(Arrays.stream(split((String) obj.get("seat"), ",")).mapToInt(Integer::parseInt).boxed().collect(Collectors.toSet()))
                            );
                        });
                    }

                    List<Integer> insertSeats = new ArrayList<>();
                    if (count > 0) {
                        for (Integer s : ss) {
                            if (!invalid.contains(s)) {
                                insertSeats.add(s);
                                count--;
                            }
                            if (count <= 0) break;
                        }
                    }
                    Map map = new HashMap();
                    map.put("busId", b.getId());
                    map.put("busNo", b.getbNo());
                    map.put("seat", join(insertSeats, ","));
                    seatsMap.add(map);
                }
            }
            if (count <= 0) break;
        }

        if (count > 0) {
            for (BusDTO b : busDTOS) {
                TreeSet<Integer> invalid = new TreeSet<>();
                String lock = b.getbSeatsLock();
                //锁定的座位，不能安排
                if (isNotBlank(lock)) {
                    invalid.addAll(Arrays.stream(lock.split(",")).mapToInt(Integer::parseInt).boxed().collect(Collectors.toSet()));
                }
                //售出的座位，不能安排
                if (!isEmpty(soldSeats)) {
                    soldSeats.stream().filter(s -> !s.getId().equals(order.getId())).map(Order::getoBusSeat).forEach(s -> {
                        JSONArray objs = JSONObject.parseArray(s);
                        Arrays.stream(objs.toArray()).map(obj -> (Map) obj).filter(obj -> b.getId().compareTo(Long.parseLong(obj.get("busId").toString())) == 0).forEach(obj ->
                                invalid.addAll(Arrays.stream(split((String) obj.get("seat"), ",")).mapToInt(Integer::parseInt).boxed().collect(Collectors.toSet()))
                        );
                    });
                }
                //预留的座位，不能安排
                List<BusHoldDTO> hds = b.getBusHolds();
                if (!isEmpty(hds)) {
                    hds.forEach(h -> invalid.addAll(Arrays.stream(h.getbSeat().split(",")).mapToInt(Integer::parseInt).boxed().collect(Collectors.toList())));
                }
                Map map = seatsMap.stream().filter(m -> b.getId().equals(Long.parseLong(m.get("busId").toString()))).findFirst().orElse(new HashMap());
                if (map.isEmpty()) {
                    map.put("busId", b.getId());
                    map.put("busNo", b.getbNo());
                    map.put("seat", "");
                    seatsMap.add(map);
                }
                StringBuilder sb = new StringBuilder((String) map.get("seat"));
                //每辆车限定座位数范围内，除了不能安排的座位，安顺序执行
                for (int i = 1; i <= b.getbSeatsNum(); i++) {
                    if (!invalid.contains(i)) {
                        if (isBlank(sb.toString())) {
                            sb.append(i);
                        } else {
                            sb.append(',').append(i);
                        }
                        count--;
                        if (count <= 0) break;
                    }
                }
                map.put("seat", sb.toString());
                if (count <= 0) break;
            }
        }

        if (count > 0) throw new RuntimeException("该班期没有可用的空座位了！");
        order.setoBusSeat(JSONObject.toJSONString(seatsMap));
    }

    private void validateSeat(OrderAddDTO order, Schedule sch, ResultBean bean) {

        Bus bs = new Bus();
        bs.setbScheduleId(sch.getId());
        List<BusDTO> busDTOS = busMapperExtDiy.selectBusAndHolds(bs);
        if (isEmpty(busDTOS)) {
            bean.setCode("-1");
            bean.setMessage("车辆信息错误!");
            return;
        }
        List<Order> orderSoldSeats = scheduleMapperDiy.selectSoldSeats(sch.getId());
        //如果没有指定座位，由系统安排
        if (isBlank(order.getoBusSeat())) {
            autoArrangeSeat(order, busDTOS, orderSoldSeats);
            return;
        } else {
            order.setoBusSeat(order.getoBusSeat().replaceAll(" ", ""));
        }
        JSONArray busSeats = JSONObject.parseArray(order.getoBusSeat());
        for (Object bt : busSeats) {
            Map m = (Map) bt;
            Long busId = Long.parseLong(m.get("busId").toString());
            List<String> st = Arrays.asList(((String) m.get("seat")).split(","));
            BusDTO bus = busDTOS.stream().filter(b -> b.getId().equals(busId)).findFirst().get();
            if (isNotBlank(bus.getbSeatsLock())) {
                List<String> locked = Arrays.asList(split(bus.getbSeatsLock(), ","));
                if (containsAny(st, locked)) {
                    bean.setCode("-1");
                    bean.setMessage(String.format("车辆【%s】位置【%s】已被锁定。", m.get("busNo"), bus.getbSeatsLock()));
                    return;
                }
            }
            String holds = busDTOS.stream().filter(b -> b.getId().equals(busId)).filter(b -> !isEmpty(b.getBusHolds()))
                    .flatMap(b -> b.getBusHolds().stream().filter(bh -> !bh.getbCompanyId().equals(order.getoBuyerCompanyId())).map(BusHold::getbSeat))
                    .reduce((s, s2) -> s + "," + s2).orElse("");
            if (isNotBlank(holds)) {
                List<String> hl = Arrays.asList(split(holds, ","));
                if (!isEmpty(hl)) {
                    if (containsAny(st, hl)) {
                        bean.setCode("-1");
                        bean.setMessage(String.format("车辆【%s】位置【%s】已被预留。", m.get("busNo"), holds));
                        return;
                    }
                }
            }

            if (!isEmpty(orderSoldSeats)) {
                String sold = orderSoldSeats.stream().filter(o -> !o.getId().equals(order.getId())).map(Order::getoBusSeat).map(s -> {
                    JSONArray objs = JSONObject.parseArray(s);
                    for (Object obj : objs) {
                        Map map = (Map) obj;
                        if (busId.equals(Long.parseLong(map.get("busId").toString()))) {
                            return (String) map.get("seat");
                        }
                    }
                    return null;
                }).reduce((s1, s2) -> s1 + "," + s2).orElse("");
                if (isNotBlank(sold)) {
                    List<String> sl = Arrays.asList(split(sold, ","));
                    if (!isEmpty(sl)) {
                        if (containsAny(st, sl)) {
                            bean.setCode("-1");
                            bean.setMessage(String.format("车辆【%s】位置【%s】已出售。", m.get("busNo"), sold));
                            return;
                        }
                    }
                }
            }
        }
    }

    private void validateProduct(Product prd, ResultBean bean, OrderAddDTO order) {
        if (prd == null) {
            bean.setCode("-1");
            bean.setMessage("产品信息不存在！");
            return;
        }
        if (order.getBookType() != null && prd.getpPayWay() != null && order.getBookType() == 1 && prd.getpPayWay() != 1) {
            bean.setCode("-1");
            bean.setMessage("产品信息不支持首付方式！");
            return;
        }
    }

    private void validateScheduleOverDue(Schedule sch, ResultBean bean) {
        if (sch == null) {
            bean.setCode("-1");
            bean.setMessage("班期信息不存在！");
            return;
        }
        if (!sch.getsStatus().equals(0)) {
            bean.setCode("-1");
            bean.setMessage("班期状态异常！");
            return;
        }

        java.sql.Date lvDay = new java.sql.Date(sch.getsCalendar().getTime());
        java.sql.Time lvtime = new Time(sch.getsLeaveTime().getTime());
        LocalDate d = lvDay.toLocalDate();
        LocalTime t = lvtime.toLocalTime();
        LocalDateTime dt = LocalDateTime.of(d, t);

        LocalDate nowD = LocalDate.now();
        LocalDateTime nowDT = LocalDateTime.now();

        int i = d.compareTo(nowD);
        if (i < 0) {
            bean.setCode("-1");
            bean.setMessage("班期已经过期！");
            return;
        }
        if (nonNull(sch.getsStopSale()) && nonNull(sch.getsStopType())) {
            switch (sch.getsStopType()) {
                case 0: {//分钟
                    int j = nowDT.compareTo(dt.minusMinutes(sch.getsStopSale().longValue()));
                    if (j > 0) {
                        bean.setCode("-1");
                        bean.setMessage("班期已经过期！");
                        return;
                    }
                    break;
                }
                case 1: {//小时
                    int j = nowDT.compareTo(dt.minusHours(sch.getsStopSale().longValue()));
                    if (j > 0) {
                        bean.setCode("-1");
                        bean.setMessage("班期已经过期！");
                        return;
                    }
                    break;
                }
                case 2: {//天
                    int j = nowDT.compareTo(dt.minusDays(sch.getsStopSale().longValue()));
                    if (j > 0) {
                        bean.setCode("-1");
                        bean.setMessage("班期已经过期！");
                        return;
                    }
                    break;
                }
                default:
                    break;
            }
        }
    }

    public static String generateOrderNo() {
        return "JDY" + DateFormatUtils.format(new Date(), "yyyyMMddHHmmssSSSS");
    }

    @Override
    public ResultBean validateCard(CardValidateVO vo) {
        String url = shpCardInterfaceUrl + "/card/cardValidate";
        String productId = vo.getPid().toString();
        String agent = "";
        int cardTp = 0;
        List<Map> datas = new ArrayList<>();
        if (!isEmpty(vo.getCardList())) {
            boolean repeat = vo.getCardList().stream().collect(Collectors.groupingBy(CardDO::getCardNo)).values().stream().anyMatch(cards -> cards.size()>1);
            if(repeat) return ResultBean.getErrorResult("验证的卡存在重复");
            for (CardDO card : vo.getCardList()) {
                Map<String, String> dMap = new HashMap<>();
                dMap.put("cardNo", card.getCardNo());
                dMap.put("cardPwd", card.getPass());
                dMap.put("prodId", vo.getPid().toString());
                dMap.put("userOpenid", vo.getAppletId());
                Map param = new HashMap();
                param.put("data", dMap);
                JSONObject jsonObject = EncodingObjectWithMd5Utils.encoding(param);
                logger.info("校验礼品卡【"+card.getCardNo()+"】:" + jsonObject.toJSONString());
                JSONObject result = HttpClientUtils.httpPost(url, (Map) jsonObject);
                logger.info("校验礼品卡【"+card.getCardNo()+"】result：" + JSON.toJSONString(result));
                if (result != null && "200".equals(result.get("code")) && result.get("data") != null) {
                    Map data = (Map) result.get("data");
                    Object pid = data.get("productId");
                    datas.add(data);

                    if (!productId.equals(pid)) {
                        return new ResultBean("-1", "礼品卡[" + card.getCardNo() + "]不是属于指定产品！");
                    }

                    Object userUid = data.get("userSpUid");
                    if (isBlank(agent)) {
                        agent = (String) userUid;
                    } else if (!agent.equals(userUid)) {
                        return new ResultBean("-1", "礼品卡不属于同一代理人！");
                    }

                    Object obj = data.get("endDate");
                    if (null != obj) {
                        String endDate = (String) obj;
                        String now = LocalDate.now().format(BASIC_ISO_DATE);
                        if (endDate.compareTo(now) >= 0) {
                            continue;
                        }
                    }

                    int cardType = Integer.parseInt(data.get("cardType").toString());
                    if (cardType == 3) {
                        if (vo.getCardList().size() > 1) return new ResultBean("-1", "折扣礼品卡一次只能使用一张");
                    }
                    if (cardTp == 0) cardTp = cardType;
                    if (cardTp != cardType) {
                        return new ResultBean("-1", "礼品卡不属于同一类型！");
                    }

                }
                return new ResultBean("-1", "[" + card.getCardNo() + "]," + result.get("msg"));
            }
            return ResultBean.getSuccessResult(datas);
        } else {
            return ResultBean.getErrorResult("礼品卡为空！");
        }

    }

    private void syncOrderPayRecord(Order order, OrderWxPayVO orderWxPayVO) {
        logger.error("进入syncOrderPayRecord");
        WechatPayRecord wechatPayRecord = orderMapper.selectWechatPayInfoByOrderNo(orderWxPayVO.getOrderNo());
        wechatPayRecord.setChannelCode("shp");
        wechatPayRecord.setOrderNo(orderWxPayVO.getOrderNo());
        wechatPayRecord.setTotalFee(orderWxPayVO.getToPay());
        if(H5.equals(order.getoSource())) {
            wechatPayRecord.setPayType(2);
        }else if(CS.equals(order.getoSource())){
            wechatPayRecord.setPayType(2);
        } else if(SF.equals(order.getoSource())) {
            if(order.getoStatus().intValue() == 1) {
                wechatPayRecord.setPayType(1);
            } else if(order.getoStatus().intValue() == 3) {
                wechatPayRecord.setPayType(3);
            }
        }
        String url = tuijieqianzhui2+"payment-service/pay/paymentCallBack";
        JSONObject jsonObject = EncodingObjectWithMd5Utils.encoding(wechatPayRecord);
        JSONObject result = HttpClientUtils.httpPost(url, (Map) jsonObject);
        logger.error("输出回调长沙接口返回结果"+result.toJSONString());
    }

    public void syncTofenxiaoMall(OrderFenxiaoUpdateDTO order) {

        JSONObject jsonObject = EncodingObjectWithMd5Utils.encoding(order);
        logger.info("分销更新接口，入参：" + jsonObject.toJSONString());
        String url = tuijieqianzhui2 + "order-service/order/update";
        JSONObject result = HttpClientUtils.httpPost(url, (Map) jsonObject);
        logger.info("分销更新接口，返回：" + JSON.toJSONString(result));
    }
	/** 
	 * @Description: 检查订单是否需要修改线下支付确认状态
	 * @author 王斌
	 * @date 2018年4月20日 上午11:45:21
	 * @param orderId
	 * @param bigDecimal 
	 * @return
	 */
	private boolean needToChangeOfflineStatus(Long orderId, BigDecimal bigDecimal){
		if(bigDecimal!=null&&bigDecimal.equals( orderOfflineService
				.selectMaxMoney(orderId, 2))){
			return true;
		}
		return false;
	}
}
