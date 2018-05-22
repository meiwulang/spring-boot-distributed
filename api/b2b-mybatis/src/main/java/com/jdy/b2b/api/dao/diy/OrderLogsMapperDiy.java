package com.jdy.b2b.api.dao.diy;

import com.jdy.b2b.api.model.OrderLogs;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/13 15:25
 */
@Mapper
public interface OrderLogsMapperDiy {
    List<OrderLogs> operLogs(Long orderId);
}
