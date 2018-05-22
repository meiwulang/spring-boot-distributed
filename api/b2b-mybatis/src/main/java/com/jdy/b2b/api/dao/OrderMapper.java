package com.jdy.b2b.api.dao;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.jdy.b2b.api.model.WechatPayRecord;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.PayNeedInfo;
import com.jdy.b2b.api.model.bill.OrderWithOrderPay;
import com.jdy.b2b.api.model.department.DepartmentSaleCountVO;
import com.jdy.b2b.api.model.department.DepartmentSaleInfoDTO;
import com.jdy.b2b.api.model.user.UserNoDTO;

@Mapper
public interface OrderMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Order record);

    int insertSelective(Order record);

    Order selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Order record);

    int updateByPrimaryKey(Order record);

    List<OrderWithOrderPay> selectOrderWithOrderPayListByBillId(Long id);

    List<DepartmentSaleInfoDTO> selectSaleInfoByDepartmentCode(DepartmentSaleCountVO departmentSaleCountVO);

    List<Order> selectExistGroupOrderNoByTime(Date date);

    Order selectOrderByOrderNo(@Param("orderNo") String orderNo);

    PayNeedInfo selectPayNeedInfoByOrderNo(@Param("orderNo") String orderNo);

    List<UserNoDTO> selectOldOrderIdNoList();

    int updateGroupOrderNoBash(List<UserNoDTO> orderIdNoList);
    int getNeedToDealCount();
    
    List<Map<String, Object>> exportCancelTourists(@Param("scheduleId") Long scheduleId);

    String selectByOrder(Long orderId);

    WechatPayRecord selectWechatPayInfoByOrderNo(@Param("orderNo") String orderNo);
    int updateRefundStatusById(Long orderId);

}