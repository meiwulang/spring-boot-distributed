package com.jdy.b2b.api.dao.reports;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.jdy.b2b.api.model.department.DepartmentSaleCountVO;
import com.jdy.b2b.api.model.reports.OrdersReport;
import com.jdy.b2b.api.model.reports.OrdersReportDTO;

@Mapper
public interface OrdersReportMapper {
	int deleteByPrimaryKey(Long id);

	int insert(OrdersReport record);

	int insertSelective(OrdersReport record);

	OrdersReport selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(OrdersReport record);

	int updateByPrimaryKey(OrdersReport record);

	@MapKey("userId")
	Map<Long, OrdersReportDTO> selectListByDepartIdAndTime(
			DepartmentSaleCountVO departmentSaleCountVO);

	List<OrdersReportDTO> getTimeInfo(
			DepartmentSaleCountVO departmentSaleCountVO);

	List<OrdersReportDTO> getProductInfo(
			DepartmentSaleCountVO departmentSaleCountVO);

	public Map<String, Object> getUserWxIdByPid(
			@Param("pids") List<String> pids);

	String getWXopenIdById(@Param("id") Long id);
}