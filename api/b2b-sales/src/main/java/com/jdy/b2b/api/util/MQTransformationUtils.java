package com.jdy.b2b.api.util;

import cn.jdytrip.sp.data.warehouse.entity.*;
import com.alibaba.fastjson.JSONObject;
import com.jdy.b2b.api.dao.diy.OrderPriceDetailMapperDiy;
import com.jdy.b2b.api.dao.product.ProductMapper;
import com.jdy.b2b.api.model.OrderPay;
import com.jdy.b2b.api.model.brand.Brand;
import com.jdy.b2b.api.model.diy.OrderPriceDetailDTO;
import com.jdy.b2b.api.model.orderRefund.OrderRefundsRecord;
import com.jdy.b2b.api.model.product.Product;
import com.jdy.b2b.api.model.user.User;
import org.apache.log4j.Logger;
import org.springframework.core.task.TaskExecutor;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import sun.rmi.runtime.Log;

import java.util.ArrayList;
import java.util.List;

/**
 * MQ对象装换类
 * @author Darker on 2018/01/19
 */
public class MQTransformationUtils {

    static Logger logger = Logger.getLogger(MQTransformationUtils.class);

    public static void transOrderAll(com.jdy.b2b.api.model.Order order, com.jdy.b2b.api.model.Order orderNew,OrderPay payRecord,
                                     ProductMapper productMapper, OrderPriceDetailMapperDiy priceDetailMapperDiy,
                                     TaskExecutor taskExecutor, MQAssembleService mqAssembleService) {
        if (!ObjectUtils.isEmpty(order.getAlterTicketId()) || !ObjectUtils.isEmpty(order.getOrderNegId())) {
            logger.error("改签记录或负订单ID不为空，不能同步订单。");
            return;
        }
        try {
            if (orderNew.getoPayMethod() != null) {
                order.setoPayMethod(orderNew.getoPayMethod());
            }
            if (orderNew.getoPayMethod() != null) {
                order.setoUnPay(orderNew.getoUnPay());
            }
            if (orderNew.getoPayMethod() != null) {
                order.setoStatus(orderNew.getoStatus());
            }
            if (orderNew.getoPayMethod() != null) {
                order.setoPayTime(orderNew.getoPayTime());
            }
            Product product = null;
            try {
                product = productMapper.selectByPrimaryKey(order.getoProductId());
            } catch (Exception e) {
                logger.error("MQTransformationUtils-->Get Product", e);
            }
            List<OrderPriceDetailDTO> orderPriceDetailDTOS = null;
            try {
                orderPriceDetailDTOS = priceDetailMapperDiy.selectOrderPriceListByOrder(order);
            } catch (Exception e) {
                logger.error("MQTransformationUtils-->Get orderPriceDetail", e);
            }
            final Product finalProduct = product;
            final List<OrderPriceDetailDTO> finalOrderPriceDetail = orderPriceDetailDTOS;
            final com.jdy.b2b.api.model.Order od = order;
            final OrderPay orderPay = payRecord;
            taskExecutor.execute(() ->transOrderSend(mqAssembleService,od, finalProduct,orderPay,finalOrderPriceDetail));
        } catch (Exception e) {
            logger.error("MQTransformationUtils-->transOrderAll", e);
        }
    }

    public static void transOrderSend(MQAssembleService mqAssembleService,com.jdy.b2b.api.model.Order order,
                                      Product product,OrderPay payRecord,List<OrderPriceDetailDTO> orderPriceDetailDTOS){
        try{
            mqAssembleService.getMQClinet().syncOrders(transOrder(order,product));
        } catch (Exception e) {
            logger.error("MQTransformationUtils-->transOrder", e);
        }
        try{
            mqAssembleService.getMQClinet().syncOrderPays(transOrderPay(payRecord));
        } catch (Exception e) {
            logger.error("MQTransformationUtils-->transOrderPay", e);
        }
        try{
            mqAssembleService.getMQClinet().syncOrderItem(transOrderItems(orderPriceDetailDTOS));
        } catch (Exception e) {
            logger.error("MQTransformationUtils-->transOrderItems", e);
        }
    }
    public static List<OrderVO> transOrder(com.jdy.b2b.api.model.Order order, Product product){
        try {
            List<OrderVO> orders = new ArrayList<>();
            OrderVO o = new OrderVO();
            o.setOrderNo(order.getId());
            o.setSmOrderNo(order.getoOrderNo());
            o.setProdId(product.getId());
            o.setProdName(product.getpName());
            o.setProdShortName(product.getpShortName());
            o.setVisitorNums(order.getoPeopleNum());
            o.setOrderAmt(order.getoRealPrice());
            if(order.getoSource()==3) {
                o.setOrderAmt(order.getoToPay());
            }
            o.setUnPay(order.getoUnPay());
            o.setOrderTime(order.getoPayTime());
            o.setSource(1);
            o.setUserIdLevel5(order.getoBuyerId());
            o.setStatus(order.getoStatus());
            o.setScheduleId(order.getoScheduleId());
            o.setPayTime(order.getoPayTime());
            orders.add(o);
            return orders;
        } catch (Exception e) {
            logger.error("",e);
            return null;
        }
    }

    public static List<PayVO> transOrderPay(OrderPay orderPay){
        try {
            List<PayVO> orderPays = new ArrayList<>();
            PayVO op = new PayVO();
            op.setPayId(orderPay.getId());
            op.setOpOrderId(orderPay.getOpOrderId());
            op.setOpPayNo(orderPay.getOpPayNo());
            op.setOpPayAmount(orderPay.getOpPayAmount());
            op.setOpPayMethod(orderPay.getOpPayMethod()+"");
            op.setOpComments(orderPay.getOpComments());
            op.setOpOprater(orderPay.getOpOprater());
            op.setOpPayTime(orderPay.getOpPayTime());
            if(orderPay.getoIsmerge()){
                op.setoIsmerge(1);
            }else{
                op.setoIsmerge(0);
            }
            op.setSource(1);
            orderPays.add(op);
            return orderPays;
        } catch (Exception e) {
            logger.error("",e);
            return null;
        }
    }

    public static OrderRefundsRecordVO transOrderRefundsRecord(OrderRefundsRecord orderRefundsRecord){
        try {
            OrderRefundsRecordVO orderRefundsRecordVO = new OrderRefundsRecordVO();
            orderRefundsRecordVO.setId(orderRefundsRecord.getId());
            orderRefundsRecordVO.setRefundAmount(orderRefundsRecord.getRefundAmount());
            orderRefundsRecordVO.setOrderId(orderRefundsRecord.getOrderId());
            orderRefundsRecordVO.setApplyAmount(orderRefundsRecord.getApplyAmount());
            orderRefundsRecordVO.setRefundableBuyerId(orderRefundsRecord.getRefundableBuyerId());
            orderRefundsRecordVO.setApplyRefundTime(orderRefundsRecord.getApplyRefundTime());
            orderRefundsRecordVO.setRefundableBuyerName(orderRefundsRecord.getRefundableBuyerName());
            orderRefundsRecordVO.setRefundableSalerId(orderRefundsRecord.getRefundableSalerId());
            orderRefundsRecordVO.setRefundableSalerName(orderRefundsRecord.getRefundableSalerName());
            orderRefundsRecordVO.setRefundableTime(orderRefundsRecord.getRefundableTime());
            orderRefundsRecordVO.setRefundExplain(orderRefundsRecord.getRefundExplain());
            orderRefundsRecordVO.setStatus(orderRefundsRecord.getStatus());
            orderRefundsRecordVO.setTicketInfo(orderRefundsRecord.getTicketInfo());
            orderRefundsRecordVO.setTouristsId(orderRefundsRecord.getTouristsId());
            orderRefundsRecordVO.setType(orderRefundsRecord.getType());
            orderRefundsRecordVO.setSource(1);
            orderRefundsRecordVO.setNegOrderId(orderRefundsRecord.getNegOrderId());
            orderRefundsRecordVO.setNegOrderNo(orderRefundsRecord.getNegOrderNo());
            logger.info("transOrderRefundsRecord JSON = " + JSONObject.toJSONString(orderRefundsRecordVO));
            return orderRefundsRecordVO;
        } catch (Exception e) {
            logger.error("",e);
            return null;
        }
    }

    public static ProductVO transProduct(Product product,Brand brand){
        try {
            ProductVO productVO = new ProductVO();
            productVO.setId(product.getId());
            productVO.setCompanyId(product.getCompanyId());
            productVO.setpNo(product.getpNo());
            productVO.setpName(product.getpName());
            productVO.setpShortName(product.getpShortName());
            productVO.setpPym(product.getpPym());
            productVO.setpBrand(brand==null?null:brand.getbName());
            productVO.setpType(product.getpType()+"");
            productVO.setpSort(product.getpSort());
            productVO.setpFrom(product.getpFrom());
            productVO.setpStatus(product.getpStatus());
            productVO.setpPayWay(product.getpPayWay());
            productVO.setCreateTime(product.getCreateTime());
            productVO.setUpdateTime(product.getUpdateTime());
            productVO.setSource(1);
            return productVO;
        } catch (Exception e) {
            logger.error("",e);
            return null;
        }
    }

    public static List<OrderItemVO> transOrderItems(List<OrderPriceDetailDTO> orderPriceDetailDTOS){
        try {
            List<OrderItemVO> orderItemVOList = new ArrayList<>();
            for(OrderPriceDetailDTO orderPriceDetailDTO : orderPriceDetailDTOS){
                OrderItemVO orderItemVO = new OrderItemVO();
                orderItemVO.setId(orderPriceDetailDTO.getId());
                orderItemVO.setOrderId(orderPriceDetailDTO.getOpOrderId());
                orderItemVO.setTicketId(orderPriceDetailDTO.getOpTicketId());
                orderItemVO.setTicketName(orderPriceDetailDTO.getOpPriceName());
                orderItemVO.setTicketNum(orderPriceDetailDTO.getOpNum());
                orderItemVO.setTicketPrice(orderPriceDetailDTO.getOpPrice());
                orderItemVO.setTotalAmount(orderPriceDetailDTO.getOpTotalPrice());
                orderItemVO.setRemark(orderPriceDetailDTO.getOpRemark());
                orderItemVO.setType(orderPriceDetailDTO.getOpType());
                orderItemVO.setActivityId(orderPriceDetailDTO.getOpActivityId());
                orderItemVO.setCreateTime(orderPriceDetailDTO.getCreateTime());
                orderItemVO.setSource(1);
                Integer adultNum = orderPriceDetailDTO.getOpAdultNum()==null?0:orderPriceDetailDTO.getOpAdultNum();
                Integer childNum = orderPriceDetailDTO.getOpChildNum()==null?0:orderPriceDetailDTO.getOpChildNum();
                Integer personNum = adultNum+childNum == 0?1:adultNum+childNum;
                orderItemVO.setPersonNum(personNum);
                orderItemVO.setChildNum(childNum);
                orderItemVOList.add(orderItemVO);
            }
            return orderItemVOList;
        } catch (Exception e) {
            logger.error("",e);
            return null;
        }
    }

}
