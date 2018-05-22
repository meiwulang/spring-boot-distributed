package com.jdy.b2b.api.service.Impl;

import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.department.report.DepartSlRportMapper;
import com.jdy.b2b.api.model.department.report.DepartSaleReportDO;
import com.jdy.b2b.api.service.DepartSlRportService;
import com.jdy.b2b.api.vo.DepartSaleReportVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @Description 部门销售业绩统计报表
 * @author 王斌
 * @date 2017年11月9日 上午11:12:07
 * @version V1.0
 */
@Service
public class DepartSlRportServiceImpl implements DepartSlRportService {
    private static final String MONEY_COUNT = "moneyCount";
    private static final String ORDER_COUNT = "orderCount";
	private static final String ALL_MONEY_COUNT = "moneyTotalCount";
	private static final String ORDER_TOTAL_COUNT = "orderTotalCount";
	private static final String GROUP_CONCAT = "groupConcat";
	private static final String ZERO = "0.00";
    private static final String D_CODE = "dCode";


	@Autowired
	DepartSlRportMapper mapper;

	@Override
	public ResultBean<Object> report(DepartSaleReportVO vo) {
		HashMap<String, Object> resultMap = new HashMap<>();
		if (vo.getCompanyId() != null ){
			getHistoryData(vo, resultMap);
		}else{
			getSystemLevelData(vo,resultMap);
		}

		return ResultBean.getIndexSuccessResult(resultMap);
	}

	private void getSystemLevelData(DepartSaleReportVO vo, HashMap<String, Object> resultMap) {
		DepartSaleReportDO param = JSONUtil.trans(vo, DepartSaleReportDO.class);
		Boolean isGetDepartInfo=Integer.valueOf(0).equals(vo.getObjectType());
		List<Map<String, Object>> departs = null;
		if ( isGetDepartInfo|| vo.getObjectType() == null) {
			departs = mapper.getAllChildCompanysInfo(param);
		} else {
			departs = mapper.getReportInfoByTime(param);
			// 去除没有订单的数据
			if (Integer.valueOf(5).equals(vo.getType())) {
				departs = departs.stream()
						.filter(m -> (Long) m.get(ORDER_COUNT) > 0L)
						.collect(Collectors.toList());
			}
			for (Map<String, Object> map : departs) {
				String groupConcatStr = (String) map.get(GROUP_CONCAT);
				if (groupConcatStr != null && groupConcatStr.length() >0){
					String[] ids = groupConcatStr.split(",");
					Set<String> groupConcatSet = new HashSet<String>();
					for (String id : ids){
						groupConcatSet.add(id);
					}
					map.put(GROUP_CONCAT,String.join(",",groupConcatSet));
				}
			}
		}
		BigDecimal totalMoney = new BigDecimal(ZERO);
		BigDecimal totalIncomeAmount = BigDecimal.ZERO;
		Long totalOrder = new Long(0L);
		for (Map<String, Object> map : departs) {
			BigDecimal moneyCountValue = (BigDecimal) map.get(MONEY_COUNT);
			totalMoney = totalMoney.add(moneyCountValue);
			totalIncomeAmount = totalIncomeAmount.add(null == map.get("incomeAmount") ? BigDecimal.ZERO : (BigDecimal) map.get("incomeAmount"));

			Long rowOrderCount = (Long) map.get(ORDER_COUNT);
			totalOrder += rowOrderCount == null ? 0L : rowOrderCount;
		}
		Map<String, Object> totalData = new HashMap<>();
		String allMoneyCount = ALL_MONEY_COUNT;
		totalData.put(allMoneyCount, totalMoney);
		totalData.put("totalIncomeAmount", totalIncomeAmount);
		totalData.put(ORDER_TOTAL_COUNT, totalOrder);
		// 按金额排序
		departs = sortList(departs);
		resultMap.put(Constants.Result.RESULT_LIST, departs);
		resultMap.put(Constants.Result.TOTAL_INFO, totalData);
	}

	private void getHistoryData(DepartSaleReportVO vo,
			HashMap<String, Object> resultMap) {
		DepartSaleReportDO param = JSONUtil.trans(vo, DepartSaleReportDO.class);
		List<Map<String, Object>> departs = null;
		Boolean isGetDepartInfo=Integer.valueOf(0).equals(vo.getObjectType());
		if (
				isGetDepartInfo|| vo.getObjectType() == null) {
			departs = mapper.getAllDepartmentsInfo(param);
		} else {
			departs = mapper.getReportInfoByTime(param);
			// 去除没有订单的数据
			if (Integer.valueOf(5).equals(vo.getType())) {
				departs = departs.stream()
						.filter(m -> (Long) m.get(ORDER_COUNT) > 0L)
						.collect(Collectors.toList());
			}
		}
		BigDecimal totalMoney = new BigDecimal(ZERO);
		BigDecimal totalIncomeAmount = BigDecimal.ZERO;
		Long totalOrder = new Long(0L);
		for (Map<String, Object> map : departs) {
           if(isGetDepartInfo){
        	   final HashMap<String, Object> departmentManager = mapper.getDepartmentManagerBydCode(Long.valueOf((String) map.get(D_CODE)));
               if(departmentManager!=null){
               	map.putAll(departmentManager);
               }
           }

			BigDecimal moneyCountValue = (BigDecimal) map.get(MONEY_COUNT);
			totalMoney = totalMoney.add(moneyCountValue);
			totalIncomeAmount = totalIncomeAmount.add(null == map.get("incomeAmount") ? BigDecimal.ZERO : (BigDecimal)map.get("incomeAmount"));

			Long rowOrderCount = (Long) map.get(ORDER_COUNT);
			totalOrder += rowOrderCount == null ? 0L : rowOrderCount;
		}
		Map<String, Object> totalData = new HashMap<>();
		String allMoneyCount = ALL_MONEY_COUNT;
		totalData.put(allMoneyCount, totalMoney);
		totalData.put("totalIncomeAmount", totalIncomeAmount);
		totalData.put(ORDER_TOTAL_COUNT, totalOrder);
		// 按金额排序
		departs = sortList(departs);
		resultMap.put(Constants.Result.RESULT_LIST, departs);
		resultMap.put(Constants.Result.TOTAL_INFO, totalData);
	}

	private List<Map<String, Object>> sortList(
			List<Map<String, Object>> resultList) {
		int size = resultList.size();
		for (int i = 0; i < size; i++) {
			for (int j = 0; j < size - 1; j++) {
				Map<String, Object> mapi = resultList.get(i);
				Map<String, Object> mapj = resultList.get(j);
				BigDecimal moneyi = (BigDecimal) mapi.get(MONEY_COUNT);
				BigDecimal moneyj = (BigDecimal) mapj.get(MONEY_COUNT);
				if (moneyi.compareTo(moneyj) > 0) {
					resultList.set(i, mapj);
					resultList.set(j, mapi);
				}
			}
		}
		return resultList;
	}

	public static void main(String[] args) {
		List<Map<String, Object>> departs = new ArrayList<>();
		for (int i = -2; i < 4; i++) {
			Map<String, Object> map = new HashMap<>();
			map.put(ORDER_COUNT, i);
			departs.add(map);
		}
		departs = departs.stream().filter(m -> (Integer) m.get(ORDER_COUNT) > 0)
				.collect(Collectors.toList());
		System.out.println(departs);
	}
}
