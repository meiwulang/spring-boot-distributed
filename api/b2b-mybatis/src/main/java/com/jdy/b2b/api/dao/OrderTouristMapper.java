package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.OrderTourist;
import com.jdy.b2b.api.model.TouristCancelVO;
import com.jdy.b2b.api.model.diy.OrderPriceDetailDTO;
import com.jdy.b2b.api.model.orderRefund.TouristTicketDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface OrderTouristMapper {
    int deleteByPrimaryKey(Long id);

    int insert(OrderTourist record);

    int insertSelective(OrderTourist record);

    OrderTourist selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(OrderTourist record);

    int updateByPrimaryKey(OrderTourist record);

    OrderTourist selectOrderTourist(@Param("orderNo") String orderNo);

    int updateCancelTourist(TouristCancelVO touristCancelVO);

    int deleteList(List<Long> list);

    Integer selectTouristCount(Long orderId);

    List<TouristTicketDTO> selectTouristTicket(Long orderId);

    List<TouristTicketDTO> selectTouristTicketByIds(@Param("list") List<Long> touristIds);
    /** 
     * @Description: 查询订单全部游客信息
     * @author 王斌
     * @date 2018年3月23日 上午11:42:23
     * @param orderId
     * @return
     */
    List<TouristTicketDTO> selectTouristTicketByOrderId(@Param("orderId")  Long orderId);

    int updateExtStatus(Map map);

	List<OrderPriceDetailDTO> selectPriceDetailsByTids(@Param("tIds") List<Long> tids,@Param("orderId") Long orderId);
}