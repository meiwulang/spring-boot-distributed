package com.jdy.b2b.api.dao.department.report;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.jdy.b2b.api.model.department.report.DepartSaleReportDO;

@Mapper
public interface DepartSlRportMapper {

	// Map<String, Object> getTotalData(DepartSaleReportDO param);

	List<HashMap<String, Object>> getFirstLevelDepartments();

	List<Map<String,Object>> getAllChildCompanysInfo(DepartSaleReportDO param);

	List<Map<String, Object>> getAllDepartmentsInfo(DepartSaleReportDO param);

	List<Map<String, Object>> getReportInfoByTime(DepartSaleReportDO param);

	List<HashMap<String, Object>> getListData(DepartSaleReportDO param);

	/**
	 * @Description: 查出部门的责任人 userName
	 * @author 王斌
	 * @date 2017年11月9日 下午2:19:16
	 * @param dId
	 */
	HashMap<String, Object> getDepartmentManagerBydCode(
			@Param("dCode") Long dCode);

	/**
	 * @Description: 查出部门的订单数和金额 moneyCount orderCount
	 * @author 王斌
	 * @date 2017年11月9日 下午2:20:45
	 * @param dId
	 */
	HashMap<String, Object> getDepartmentOrderInfo(DepartSaleReportDO param);
}
