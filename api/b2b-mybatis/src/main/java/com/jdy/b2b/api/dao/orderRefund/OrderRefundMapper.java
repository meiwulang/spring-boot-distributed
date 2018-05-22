package com.jdy.b2b.api.dao.orderRefund;

import com.jdy.b2b.api.model.orderRefund.OrderRefund;
import com.jdy.b2b.api.model.orderRefund.OrderRefundResult;
import com.jdy.b2b.api.model.orderRefund.OrderRefundResultDO;
import com.jdy.b2b.api.model.orderRefund.OrderRefundQueryDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
@Mapper
public interface OrderRefundMapper {
    int deleteByPrimaryKey(Long id);

    int insert(OrderRefund record);

    int insertSelective(OrderRefund record);

    OrderRefund selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(OrderRefund record);

    int updateByPrimaryKey(OrderRefund record);

    List<OrderRefundResultDO> queryOrderRefundListForPage(OrderRefundQueryDTO dto);

    List<OrderRefundResult> queryOrderRefundStatus(OrderRefundQueryDTO dto);
}