package com.jdy.b2b.api.dao.diy;

import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.diy.OrderPriceDetailDTO;
import com.jdy.b2b.api.model.diy.OrderPriceDetailVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/21 17:11
 */
@Mapper
public interface OrderPriceDetailMapperDiy {

    int batchInsertOrderPriceDetails(List<OrderPriceDetailVO> details);

    int updatePriceDetailStatusByOrderId(Map map);

    List<OrderPriceDetailDTO> selectOrderPriceListByOrder(Order order);

}
