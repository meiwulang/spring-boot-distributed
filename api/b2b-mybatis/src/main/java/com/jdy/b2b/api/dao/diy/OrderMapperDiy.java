package com.jdy.b2b.api.dao.diy;

import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.diy.*;
import com.jdy.b2b.api.model.orderRefund.ContractOrder;
import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/8/30 16:37
 */
@Mapper
public interface OrderMapperDiy {

    List<Long> selectOrderIds(OrderSearchVo vo);

    List<OrderListDTO> searchOrders(OrderSearchVo vo);

    List<OrderListDTO> selectOrdersByIds(OrderSearchVo vo);

    OrderDetailDTO orderDetail(Order order);

    OrderGroupConfirmation groupConfirmationForm(Order order);

    OrderPayRecordsDTO orderPayRecords(Order order);

    OrderSMSDTO selectOrderSmsDTO(Order order);

    OrderStaticsDTO recentOrderInfo(OrderStaticsVO vo);

    OrderSynchroDTO selectOrderSynchroDTO(Map param);

    List<OrderStatusNumberDTO> selectOrderNumofStatuses(OrderSearchVo vo);

    Order selectOrderByOrderNo(String orderNo);

    List<Order> selectOrdersSelective(Order order);

    List<OrderTripDTO> selectTripsByOrder(Order order);

    List<Map> listUnpayOrders();

    int selectExperiencedOrderCount(Map map);

    Map selectAgentSuperUser(Long uid);

    Map selectSuperUser(Long uid);

    ContractOrder selectContractByOrderId(Integer orderId);

    List<OrderPay4H5DTO> selectOrderPayRecords(Order order);

    List<Map> selectTouristNum(Long scheduleId);
/*

    @MapKey("orderId")
    Map<Long,OrderFirstAgentDTO> selectFirstAgentByOrderIds(@Param("list") List<Long> ids);
*/

    int updatePeopleNumById(@Param("orderId") Long orderId,@Param("reduceNum") Integer reduceNum);

    int reducePeopleNum(@Param("orderId") long orderId,@Param("num") int num);

    List<Long> selectSubOrderIds(@Param("ids") List<Long> ids);
}
