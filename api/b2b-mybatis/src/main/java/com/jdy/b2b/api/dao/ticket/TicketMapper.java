package com.jdy.b2b.api.dao.ticket;

import com.jdy.b2b.api.model.front.FrontTicket;
import com.jdy.b2b.api.model.ticket.Ticket;
import com.jdy.b2b.api.model.ticket.TicketListDO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Mapper
public interface TicketMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Ticket record);

    int insertSelective(Ticket record);

    Ticket selectByPrimaryKey(@Param("id") Long id,Integer single);

    int updateByPrimaryKeySelective(Ticket record);

    int updateByPrimaryKey(Ticket record);
	
	/*自定义*/

    List<TicketListDO> queryForOutTicketList(Ticket ticket);

    int saveTicketBash(List<Ticket> list);

    Ticket selectByIdOnly(Long id);

    Long queryDefaultPrice(Long id);

    List<FrontTicket> frontTicketListOfSchedule(Long id);

    List<Ticket> ticketListOfSchedule(@Param("id") Long id,@Param("userId") Long userId,@Param("from") String from,@Param("areaProductFlag")int areaProductFlag,@Param("companyId") Long companyId);

    List<Ticket> selectListByIds(Map map);

    List<TicketListDO> querySingleTicketList(Long id);

    List<Ticket> getTicketList(Long productId);

    Set<Long> selectEffictiveTicketIdList(@Param("list") List<Long> orginTId);

    Set<Long> selectEffictiveByPIdAndCatagroyId(@Param("productId") Long productId, @Param("categoryId") Long categoryId,@Param("companyId") Long companyId);

    List<Ticket> selectEffictiveTicketByPIdExcludeCategoryId(@Param("productId") Long productId,@Param("categoryId") Long categoryId);

    List<Ticket> selectTicketListByProductId(@Param("productId") Long productId,@Param("companyId") Long companyId);

    int deleteByFromTicketId(Long id);

    List<Ticket> selectGatherTicketList(Long id);

    int updateTicketBash(List<Ticket> newList);

    List<Ticket> queryTicketListByCompanyId(@Param("companyId") Long companyId,@Param("list") List<Long> ids);

    List<Long> selectOldTicketIdsByCompanyIdAndScheduleId(@Param("pcompanyId") Long pcompanyId, @Param("id") Long id);

	/**
	 * @Description: 通过游客id获取票的总人数
	 * @author 王斌
	 * @date 2018年3月21日 下午3:54:05
	 * @param touristIds
	 * @return
	 */
	int getUserCountByTouristsId(@Param("list")List<String> touristIds);

	List<Map> getCategoryAndNameByTickets(@Param("ticketIds") List<Long> ticketIds);
}