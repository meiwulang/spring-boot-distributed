package com.jdy.b2b.api.dao.agentinfo;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.jdy.b2b.api.model.agentinfo.AgentInfo;
import com.jdy.b2b.api.model.agentinfo.AgentInfoDTO;
import com.jdy.b2b.api.model.agentinfo.OrderInfoDTO;
import com.jdy.b2b.api.model.agentinfo.UserOrderInfoDTO;

/**
 * @Description 代理人信息
 * @author 王斌
 * @date 2017年10月20日 上午11:38:21
 * @version V1.0
 */
@Mapper
public interface AgentInfoMapper {
	public List<AgentInfoDTO> list(AgentInfo info);

	public List<OrderInfoDTO> getOrderInfo(@Param("minDate") String minDate,
			@Param("maxDate") String maxDate, @Param("ids") String ids);

	public int count(AgentInfo info);

	public String getIds(@Param("id") Long id);

	public List<LinkedHashMap<String, Object>> detail(@Param("ids") String ids,
			@Param("minDate") String minDate, @Param("maxDate") String maxDate);

	public List<AgentInfoDTO> export(@Param("minDate") String minDate,
			@Param("maxDate") String maxDate,
			@Param("searchStr") String searchStr);

	public int deleteByDate(@Param("date") String date);

	public List<Map<String, Object>> getAllUsers();

	public Map<String, Object> getUserWxIdByPid(
			@Param("pids") List<String> pids,
			@Param("yesterday") String yesterday);

	public UserOrderInfoDTO getUsersOrderSub(@Param("userId") Long userId,
			@Param("userNum") int userNum, @Param("userIds") String userIds,
			@Param("subTime") String subTime);

	public int insertTosaleReportDaliy(
			@Param("list") ArrayList<UserOrderInfoDTO> list);

	public String getWxIdById(@Param("id") Long id);
}
