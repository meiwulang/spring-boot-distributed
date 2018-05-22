package com.jdy.b2b.api.dao.factoryTicket;

import com.jdy.b2b.api.model.factoryTicket.FactoryTicket;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FactoryTicketMapper {
    int deleteByPrimaryKey(Long id);

    int insert(FactoryTicket record);

    int insertSelective(FactoryTicket record);

    FactoryTicket selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(FactoryTicket record);

    int updateByPrimaryKey(FactoryTicket record);

    List<FactoryTicket> selectList(FactoryTicket factoryTicket);

    int batchUpdateStatus(@Param("ids") List<Long> ids, @Param("status") Byte status);
}