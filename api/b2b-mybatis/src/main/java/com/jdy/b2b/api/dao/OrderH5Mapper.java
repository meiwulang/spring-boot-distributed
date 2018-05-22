package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.diy.*;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * Created by strict on 2017/9/22.
 */
@Mapper
public interface OrderH5Mapper {

    List<OrderH5DTO> selectOrderList(OrderH5Vo orderH5Vo);

    List<OrderH5DTO> selectSimpleOrderList(OrderH5Vo orderH5Vo);

    OrderH5DetailDTO selectOrderDetail(OrderH5Vo orderH5Vo);

    OrderInfoH5DTO selectOrderInfo(OrderH5Vo orderH5Vo);

    OrderSimpleH5DTO queryOrderSimpleInfo(String no);
}
