package com.jdy.b2b.api.service.Impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.reports.OrdersReportMapper;
import com.jdy.b2b.api.model.department.DepartmentSaleCountVO;
import com.jdy.b2b.api.model.reports.OrdersReportDTO;
import com.jdy.b2b.api.service.DepartmentSaleService;

/**
 * Created by strict on 2017/11/9.
 */
@Service
public class DepartmentSaleServiceImpl implements DepartmentSaleService {
	private static final String TOTAL_AMOUNT = "totalAmount";
	private static final String TOTAL_NUM = "totalNum";
	private static final String LIST = "list";
	private static final String TOTAL_INFO = "totalInfo";
	private final static String WXID = "wxId";
	private final static String USERID = "userId";
	private final static String separator = ",";
	@Autowired
	private OrdersReportMapper ordersReportMapper;

	@SuppressWarnings("serial")
	@Override
	public ResultBean<Object> querySaleCount(DepartmentSaleCountVO vo) {
		String groupConcat = vo.getGroupConcat();
		vo.setGroupConcat(StringUtils.isBlank(groupConcat)?null:groupConcat);
		if (vo.getUserId() != null) {
			vo.setCompanyId(null);
			vo.setDepartmentId(null);
			vo.setuDepartmentCode(null);
		}
		Map<String, Object> totalMap = new HashMap<>();
		List<OrdersReportDTO> finalList = new ArrayList<>();
		Integer object = vo.getObjectType();
		object = object == null ? 0 : object;
		switch (object) {
		case 0:
			getUserInfo(vo, totalMap, finalList);

			break;
		case 1:
			finalList = getTimeInfo(vo, totalMap, finalList);
			if (Integer.valueOf(5).equals(vo.getQueryType())) {
				finalList = finalList.stream().filter(m -> m.getOrderNum() > 0)
						.collect(Collectors.toList());
			}
			break;
		case 2:
			finalList = getProductInfo(vo, totalMap, finalList);
			break;

		default:
			break;
		}
		finalList.sort(Comparator
				.comparingDouble(dto -> -dto.getAmount().doubleValue()));
		final List<OrdersReportDTO> finalListInfo = finalList;
		ResultBean<Object> resultBean = new ResultBean<>();
		resultBean.setCode("200");
		resultBean.setBody(new HashMap<String, Object>() {
			{
				put(LIST, finalListInfo);
				put(TOTAL_INFO, totalMap);
			}
		});
		return resultBean;
	}

	/**
	 * @Description:统计产品维度信息
	 * @author 王斌
	 * @date 2017年12月5日 下午5:31:01
	 * @param vo
	 * @param totalMap
	 * @param finalList
	 */
	private List<OrdersReportDTO> getProductInfo(DepartmentSaleCountVO vo,
			Map<String, Object> totalMap, List<OrdersReportDTO> finalList) {
		Long userId = vo.getUserId();
		if (userId != null) {
			StringBuilder userIdsBuilder = new StringBuilder(userId.toString());
			geneUserInfos(userIdsBuilder,
					ordersReportMapper.getWXopenIdById(userId));
			vo.setUserIdsStr(userIdsBuilder.toString());
		}
		finalList = ordersReportMapper.getProductInfo(vo);
		return setTotalInfo(totalMap, finalList);

	}

	/**
	 * @Description: 统计时间维度信息
	 * @author 王斌
	 * @date 2017年12月5日 下午5:30:58
	 * @param vo
	 * @param totalMap
	 * @param finalList
	 */
	private List<OrdersReportDTO> getTimeInfo(DepartmentSaleCountVO vo,
			Map<String, Object> totalMap, List<OrdersReportDTO> finalList) {
		Long userId = vo.getUserId();
		if (userId != null) {
			StringBuilder userIdsBuilder = new StringBuilder(userId.toString());
			geneUserInfos(userIdsBuilder,
					ordersReportMapper.getWXopenIdById(userId));
			vo.setUserIdsStr(userIdsBuilder.toString());
		}
		finalList = ordersReportMapper.getTimeInfo(vo);
		return setTotalInfo(totalMap, finalList);
	}

	/**
	 * @Description: 设置合计信息
	 * @author 王斌
	 * @date 2017年12月6日 上午9:19:26
	 * @param totalMap
	 * @param finalList
	 */
	private List<OrdersReportDTO> setTotalInfo(Map<String, Object> totalMap,
			List<OrdersReportDTO> finalList) {
		BigDecimal totalAmount = BigDecimal.ZERO;
		BigDecimal totalIncomeAmount = BigDecimal.ZERO;
		Integer totalNum = 0;
		for (OrdersReportDTO dto : finalList) {
			totalAmount = totalAmount.add(dto.getAmount());
			totalNum += dto.getOrderNum();
			totalIncomeAmount = totalIncomeAmount.add(null == dto.getIncomeAmount() ? BigDecimal.ZERO : dto.getIncomeAmount());
		}
		totalMap.put(TOTAL_AMOUNT, totalAmount);
		totalMap.put("totalIncomeAmount", totalIncomeAmount);
		totalMap.put(TOTAL_NUM, totalNum);
		return finalList;
	}

	/**
	 * @Description: 统计用户维度信息
	 * @author 王斌
	 * @date 2017年12月5日 下午5:30:23
	 * @param vo
	 * @param totalMap
	 * @param finalList
	 */
	private void getUserInfo(DepartmentSaleCountVO vo,
			Map<String, Object> totalMap, List<OrdersReportDTO> finalList) {
		Map<Long, OrdersReportDTO> resMap = ordersReportMapper
				.selectListByDepartIdAndTime(vo);
		if (resMap != null) {
			BigDecimal totalAmount = BigDecimal.ZERO;
			BigDecimal totalIncomeAmount = BigDecimal.ZERO;
			Integer totalNum = 0;
			for (Map.Entry<Long, OrdersReportDTO> entry : resMap.entrySet()) {
				OrdersReportDTO value = entry.getValue();
				if (Objects.equals(value.getPid(), value.getOpenid())) {
					Long userId = vo.getUserId();
					Long userId2 = value.getUserId();
					if (userId != null && !Objects.equals(userId2, userId)) {// 筛选指定人的数据
						continue;
					}
//					temp就是上面的 value 变量。。。注释掉
// 					OrdersReportDTO temp = new OrdersReportDTO();
//					temp.setUserId(userId2);
//					temp.setUserName(value.getUserName());
//					temp.setAmount(value.getAmount());
//					temp.setOrderNum(value.getOrderNum());
					getChild(value.getOpenid(), resMap, value);
					finalList.add(value);
					totalAmount = totalAmount.add(value.getAmount());
					totalIncomeAmount = totalIncomeAmount.add(null == value.getIncomeAmount() ? BigDecimal.ZERO : value.getIncomeAmount());
					totalNum += value.getOrderNum();
				}
			}

			totalMap.put(TOTAL_AMOUNT, totalAmount);
			totalMap.put("totalIncomeAmount", totalIncomeAmount);
			totalMap.put(TOTAL_NUM, totalNum);
		}
	}

	private void getChild(String pid, Map<Long, OrdersReportDTO> resMap,
			OrdersReportDTO temp) {
		for (Map.Entry<Long, OrdersReportDTO> entry : resMap.entrySet()) {
			if (!Objects.equals(entry.getValue().getOpenid(), entry.getValue().getPid())) {
				if (pid == null)
					return;
				if (pid.equals(entry.getValue().getPid())) {
					temp.setOrderNum(temp.getOrderNum() + entry.getValue().getOrderNum());
					temp.setAmount(
							temp.getAmount().add(entry.getValue().getAmount()));
					temp.setIncomeAmount(
							temp.getIncomeAmount().add(entry.getValue().getIncomeAmount()));
					getChild(entry.getValue().getOpenid(), resMap, temp);
				}
			}
		}
	}

	/**
	 * @Description: TODO
	 * @author 王斌
	 * @date 2017年12月15日 下午4:45:14
	 * @param startDate
	 * @param endDate
	 * @param userIdsBuilder
	 * @param wxId
	 * @param queryType
	 */
	private void geneUserInfos(StringBuilder userIdsBuilder, String wxId) {
		while (true) {
			Map<String, Object> secondLevelAgent = ordersReportMapper
					.getUserWxIdByPid(Arrays.asList(wxId.split(",")));
			if (secondLevelAgent != null && secondLevelAgent.size() > 0) {
				Object tempUserid = secondLevelAgent.get(USERID);
				Object tempwxId = secondLevelAgent.get(WXID);
				if (tempUserid == null || tempwxId == null) {
					break;
				}
				userIdsBuilder.append(separator).append(tempUserid);
				wxId = (String) tempwxId;
			} else {
				break;
			}
		}
	}
}
