package com.jdy.b2b.api.dao.orderRefund;

import com.jdy.b2b.api.model.orderRefund.OrderRefundsRecord;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface OrderRefundsRecordMapper {
    int deleteByPrimaryKey(Long id);

    int insert(OrderRefundsRecord record);

    int insertSelective(OrderRefundsRecord record);

    OrderRefundsRecord selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(OrderRefundsRecord record);

    int updateByPrimaryKey(OrderRefundsRecord record);

    Long selectMaxIdByOrderId(Long orderId);

    List<OrderRefundsRecord> selectByOrderId(Long orderId);

    int selectOtherTypeRefundRecordNum(Long orderId);
}