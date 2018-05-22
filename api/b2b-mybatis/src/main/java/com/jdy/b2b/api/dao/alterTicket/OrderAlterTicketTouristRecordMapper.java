package com.jdy.b2b.api.dao.alterTicket;

import com.jdy.b2b.api.model.alterTicket.OrderAlterTicketTouristRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
@Mapper
public interface OrderAlterTicketTouristRecordMapper {
    int deleteByPrimaryKey(Long id);

    int insert(OrderAlterTicketTouristRecord record);

    int insertSelective(OrderAlterTicketTouristRecord record);

    OrderAlterTicketTouristRecord selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(OrderAlterTicketTouristRecord record);

    int updateByPrimaryKey(OrderAlterTicketTouristRecord record);

    List<OrderAlterTicketTouristRecord> selectListByRecordId(Long recordId);

    int batchInsert(@Param("list") List<OrderAlterTicketTouristRecord> touristInfo);
}