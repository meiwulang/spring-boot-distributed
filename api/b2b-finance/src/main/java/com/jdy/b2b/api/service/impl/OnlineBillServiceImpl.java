package com.jdy.b2b.api.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.dao.BillDetailMapper;
import com.jdy.b2b.api.dao.BillMapper;
import com.jdy.b2b.api.dao.OrderPayMapper;
import com.jdy.b2b.api.model.Company;
import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.bill.*;
import com.jdy.b2b.api.service.OnlineBillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by strict on 2017/8/31.
 */
@Service
@Transactional
public class OnlineBillServiceImpl implements OnlineBillService {

    @Autowired
    private BillMapper billMapper;
    @Autowired
    private OrderPayMapper orderPayMapper;
    @Autowired
    private BillDetailMapper billDetailMapper;

    private BigDecimal changeRate = BigDecimal.valueOf(0.01);

    @Override
    public PageInfo<OnlineBillParentDTO> queryOnlineBillList(OnlineBillVo onlineBillVo) {
        if (onlineBillVo.getCurrPage() != null && onlineBillVo.getPageSize() != null) {
            PageHelper.startPage(onlineBillVo.getCurrPage(), onlineBillVo.getPageSize());
        }
        return new PageInfo<OnlineBillParentDTO>(billMapper.selectOnlineBillList(onlineBillVo));
    }

    @Override
    public BillTotalInfoDTO sumOnlineBillTotal(OnlineBillVo onlineBillVo) {

        return billMapper.sumOnlineBillTotal(onlineBillVo);
    }

    @Override
    public void createOnlineBill() {
        String now  = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
        //查询出该生成账单的支付记录，OrderPayWithOrderDto，内部封装了order，因为从属关系，所以选择组合
        List<OrderPayWithOrderDto> orderPays = orderPayMapper.selectBeforeNowNotMergeList(now);
        //代码层的分组，将支付记录根据卖方（供应商）为key分组
        Map<Long, LinkedList<OrderPayWithOrderDto>> saleCompany2OrderPayWithOrderDtoList = orderPays.stream().collect(Collectors.toMap(orderPay -> orderPay.getOrder().getoSalerCompanyId(), orderpay -> {
            LinkedList<OrderPayWithOrderDto> orderpays = new LinkedList<>();
            orderpays.add(orderpay);
            return orderpays;
        },(left,right) -> {left.addAll(right); return left;}));
        //一个供应商生成一份账单
        saleCompany2OrderPayWithOrderDtoList.forEach((key,oderPayWithOrderDtoList)->{
            Bill bill = new Bill();
            bill.setbBillPid((long) 0);
            bill.setbBillNo("w"+LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))+Integer.toString((int) ((Math.random()+1) * 100000)));
            bill.setbBillType((byte) 0);
            bill.setbType(0);
            bill.setbAmount(BigDecimal.valueOf(0));
            bill.setbPayedAmount(BigDecimal.valueOf(0));
            Order firstOrder = oderPayWithOrderDtoList.get(0).getOrder();
            bill.setbSalerCompanyId(firstOrder.getoSalerCompanyId());
            bill.setbSalerCompanyName(firstOrder.getoSalerCompanyName());
            bill.setbSalerId(firstOrder.getoSalerId());
            bill.setbSalerName(firstOrder.getoSalerName());
            bill.setbStatus(0);
            LinkedList<BillDetail> billDetailList = new LinkedList();
            //一个支付记录生成一条它和账单的关联关系
            oderPayWithOrderDtoList.forEach(oderPayWithOrderDto -> {
                bill.setbAmount(bill.getbAmount().add(oderPayWithOrderDto.getOpPayAmount()));
                if(oderPayWithOrderDto.getOpPayMethod()!=1){ //除了信用支付以外都是已付金额。 但这是不准确的，因为不知道它到底有没有付
                    bill.setbPayedAmount(bill.getbPayedAmount().add(oderPayWithOrderDto.getOpPayAmount()));
                }
                Order order = oderPayWithOrderDto.getOrder();
                BillDetail billDetail = new BillDetail();
                billDetail.setbBuyerCompanyId(order.getoBuyerCompanyId());
                billDetail.setbBuyerCompanyName(order.getoBuyerCompanyName());
                billDetail.setbBuyerId(order.getoBuyerId());
                billDetail.setbBuyerName(order.getoBuyerName());
                billDetail.setCreateTime(new Date());
                billDetail.setDbOrderPayId(order.getId());
                billDetailList.add(billDetail);
            });
            //手续费 = 供应商的手续费率*总费用，目前只采用扫码支付手续费，后期需要修改这里
            bill.setbBrokerage(oderPayWithOrderDtoList.get(0).getCsQrRate().multiply(bill.getbAmount()).multiply(changeRate));
            billMapper.insert(bill);
            billDetailList.stream().forEach(billDetail -> billDetail.setDbBillId(bill.getId()));
            billDetailMapper.bathInsert(billDetailList);
        });
        //跟新支付记录和账单的状态  当前不在乎订单是否会修改，一律改为已处理
        orderPayMapper.updateBeforeNowNotMergeList(now);
    }

    @Override
    public BillWithOrderPayDto queryOnlineBillDetail(Long id) {
        BillWithOrderPayDto billWithOrderPayDto = billMapper.selectBillWithOrderPayDto(id);
        List<OrderWithOrderPay> orders = billWithOrderPayDto.getOrders();
        Map<Long,List<OrderWithOrderPay>> orderGroupByCompanyMap = new HashMap<>();
        orders.stream().forEach(order -> {
            List<OrderWithOrderPay> list = orderGroupByCompanyMap.get(order.getoBuyerCompanyId());
            if(Objects.isNull(list)){
                list = new LinkedList<>();
                orderGroupByCompanyMap.put(order.getoBuyerCompanyId(),list);
            }
            list.add(order);
        });
        List<OrderGroupByCompanyDto> orderGroupByCompanyList = orderGroupByCompanyMap.entrySet().stream().map(entry -> {
            List<OrderWithOrderPay> value = entry.getValue();
            OrderWithOrderPay firstValue = value.get(0);
            OrderGroupByCompanyDto dto = new OrderGroupByCompanyDto();
            Company company = new Company();
            company.setcName(firstValue.getoBuyerName());
            company.setcPhone(firstValue.getPhone());
            dto.setCompany(company);
            dto.setbPayedAmount(BigDecimal.valueOf(0));
            dto.setOpPayAmounts(BigDecimal.valueOf(0));
            value.forEach(order -> {
                order.setbPayedAmount(BigDecimal.valueOf(0));
                order.setOpPayAmounts(BigDecimal.valueOf(0));
                order.getOrderPayList().forEach(pay -> {
                    dto.setOpPayAmounts(dto.getOpPayAmounts().add(pay.getOpPayAmount()));
                    order.setOpPayAmounts(order.getOpPayAmounts().add(pay.getOpPayAmount()));
                    if(pay.getOpPayMethod()!=1){ //除了信用支付以外都是已付金额。 但这是不准确的，因为不知道它到底有没有付
                        dto.setbPayedAmount(dto.getbPayedAmount().add(pay.getOpPayAmount()));
                        order.setbPayedAmount(order.getbPayedAmount().add(pay.getOpPayAmount()));
                    }
                });
                order.setCommissions(order.getOpPayAmounts().multiply(billWithOrderPayDto.getCsSettlementRate()).multiply(changeRate));
                order.setbBrokerages(order.getOpPayAmounts().multiply(billWithOrderPayDto.getCsQrRate()).multiply(changeRate));
                order.setEndDate(order.getStartDate().plusDays(order.getDays()));
            });
            dto.setCommissions(dto.getOpPayAmounts().multiply(billWithOrderPayDto.getCsSettlementRate()).multiply(changeRate));
            dto.setbBrokerages(dto.getOpPayAmounts().multiply(billWithOrderPayDto.getCsQrRate()).multiply(changeRate));
            dto.setOrders(value);
            return dto;
        }).collect(Collectors.toList());
        billWithOrderPayDto.setOrderPayGroupByCompanyDtos(orderGroupByCompanyList);
        billWithOrderPayDto.setCommission(billWithOrderPayDto.getCommission().multiply(changeRate));
        billWithOrderPayDto.setOrders(null);
        return billWithOrderPayDto;
    }

    @Override
    public List<BillDto4ExportBillList> queryOnlineBillList4Export(ParamDto4ExportBillList param) {
        return billMapper.queryOnlineBillList4Export(param);
    }
}
