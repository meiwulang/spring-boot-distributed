package com.jdy.b2b.api.dao.alterTicket;

import com.jdy.b2b.api.model.alterTicket.OrderAlterTicketPriceChangeDTO;
import com.jdy.b2b.api.model.alterTicket.OrderAlterTicketRecord;
import com.jdy.b2b.api.model.alterTicket.OrderAlterTicketWithTouristDTO;
import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface OrderAlterTicketRecordMapper {
    int deleteByPrimaryKey(Long id);

    int insert(OrderAlterTicketRecord record);

    int insertSelective(OrderAlterTicketRecord record);

    OrderAlterTicketRecord selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(OrderAlterTicketRecord record);

    int updateByPrimaryKey(OrderAlterTicketRecord record);

    List<OrderAlterTicketWithTouristDTO> selectWithTouristInfoByOrderId(OrderAlterTicketRecord vo);

    OrderAlterTicketWithTouristDTO selectRecordWithTouristByAlterId(Long alterId);

    int insertByDTO(OrderAlterTicketWithTouristDTO vo);
    @MapKey("touristId")
    Map<Long,OrderAlterTicketPriceChangeDTO> selectPriceChangeInfoByTouristId(OrderAlterTicketWithTouristDTO vo);
}