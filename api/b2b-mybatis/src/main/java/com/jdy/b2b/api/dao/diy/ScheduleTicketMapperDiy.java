package com.jdy.b2b.api.dao.diy;

import com.jdy.b2b.api.model.ScheduleTicket;
import com.jdy.b2b.api.model.diy.TicketDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/18 18:06
 */
@Mapper
public interface ScheduleTicketMapperDiy {

    List<TicketDTO> selectTicketListUnionAll(ScheduleTicket rec);

    int insertBatch(List<ScheduleTicket> stList);

    int deleteCustomTickets(ScheduleTicket st);

    int deleteScheduleTicketRecords(ScheduleTicket st);

    List<Map> selectScheduleTicketIdRelations(Long stId);

    int deleteGatherScheduleTicketRecords(@Param("id") Long id,@Param("list") List list);

    List<Long> selectTicketListByCompanyIdAndScheduleId(@Param("companyId") Long companyId, @Param("stScheduleId") Long stScheduleId);

    int updateTicketStock(List<Map> schTk);
}
