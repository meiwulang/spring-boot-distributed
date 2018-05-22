package com.jdy.b2b.api.service.Impl;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.agentinfo.AgentInfoMapper;
import com.jdy.b2b.api.model.agentinfo.AgentInfo;
import com.jdy.b2b.api.model.agentinfo.AgentInfoDTO;
import com.jdy.b2b.api.model.agentinfo.UserOrderInfoDTO;
import com.jdy.b2b.api.service.AgentInfoReportService;
import com.jdy.b2b.api.vo.AgentDetailInfoVO;
import com.jdy.b2b.api.vo.AgentInfoVO;

/**
 * @Description 代理人业务实现层
 * @author 王斌
 * @date 2017年10月20日 下午12:53:40
 * @version V1.0
 */
@Service
public class AgentInfoReportServiceImpl implements AgentInfoReportService {
	@Autowired
	AgentInfoMapper agentInfoMapper;
	private final static String WXID = "wxId";
	private final static String USERID = "userId";
	private final static String separator = ",";

	@Override
	public ResultBean<Map<String, Object>> list(AgentInfoVO vo) {
		AgentInfo agentInfo = JSONUtil.trans(vo, AgentInfo.class);
		String minDate = agentInfo.getMinDate();
		if (minDate == null || "".equals(minDate)) {
			agentInfo.setMinDate("-1");
		}
		String maxDate = agentInfo.getMaxDate();
		if (maxDate == null || "".equals(maxDate)) {
			agentInfo.setMaxDate("-1");
		}
		if ("".equals(agentInfo.getSearchStr())) {
			agentInfo.setSearchStr(null);
		}
		agentInfo.calc();
		agentInfo.setYesterday(getYesterday());
		Map<String, Object> result = new HashMap<>();
		List<AgentInfoDTO> list = agentInfoMapper.list(agentInfo);
		// for (AgentInfoDTO agentInfoDTO : list) {
		// Set<String> strSet = new HashSet<>();
		// CollectionUtils.addAll(strSet, agentInfoDTO.getIds().split((",")));
		// int size = strSet.size();
		// agentInfoDTO.setFollowers(size > 0 ? size - 1 : 0);
		// agentInfoDTO.setIds(null);
		// }
		result.put(Constants.Result.RESULT_LIST, list);
		result.put(Constants.Result.TOTAL_NUM,
				agentInfoMapper.count(agentInfo));
		return ResultBean.getSuccessResult(result);

	}

	@Override
	public ResultBean<Map<String, Object>> export(String minDate,
			String maxDate, String searchStr) {
		AgentInfo agentInfo = new AgentInfo();
		agentInfo.setMinDate(minDate);
		agentInfo.setMaxDate(maxDate);
		if ("".equals(searchStr)) {
			searchStr = null;
		}
		agentInfo.setSearchStr(searchStr);
		if (agentInfo.getMinDate() == null) {
			agentInfo.setMinDate("-1");
		}
		if (agentInfo.getMaxDate() == null) {
			agentInfo.setMaxDate("-1");
		}
		agentInfo.calc();
		Map<String, Object> result = new HashMap<>();
		result.put(Constants.Result.RESULT_LIST,
				agentInfoMapper.list(agentInfo));
		result.put(Constants.Result.TOTAL_NUM,
				agentInfoMapper.count(agentInfo));
		return ResultBean.getSuccessResult(result);

	}

	@Override
	public ResultBean<Map<String, Object>> detail(AgentDetailInfoVO vo) {

		Map<String, Object> result = geneDetailInfo(vo, false);
		return ResultBean.getSuccessResult(result);
	}

	/**
	 * @Description: TODO
	 * @author 王斌
	 * @date 2017年10月30日 下午1:52:14
	 * @param vo
	 * @return
	 */
	private Map<String, Object> geneDetailInfo(AgentDetailInfoVO vo,
			boolean isAll) {
		Map<String, Object> result = new HashMap<>();
		String minDateStr = vo.getMinDate();
		String maxDateStr = vo.getMaxDate();
		List<LinkedHashMap<String, Object>> list = null;
		if (isAll) {
			list = agentInfoMapper.detail(null, minDateStr, maxDateStr);
		} else {
			Long id = vo.getId();
			StringBuilder userIdsBuilder = new StringBuilder(id.toString());
			String wxId = agentInfoMapper.getWxIdById(id);
			if (Objects.nonNull(wxId)) {
				geneUserInfos(null, userIdsBuilder, wxId);
			}
			// String ids = agentInfoMapper.getIds(id);
			list = agentInfoMapper.detail(userIdsBuilder.toString(), minDateStr,
					maxDateStr);
		}
		ArrayList<Object> moneyList = new ArrayList<>();
		ArrayList<Object> dayList = new ArrayList<>();
		SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
		SimpleDateFormat sqlDateformat = new SimpleDateFormat("yyyy-MM-dd");
		Date minDate = null;
		Date maxDate = null;
		try {
			minDate = format.parse(minDateStr);
			maxDate = format.parse(maxDateStr);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		for (int i = 0; i < list.size(); i++) {
			LinkedHashMap<String, Object> map = list.get(i);
			String rowDateStr = (String) map.get("orderDate");

			try {
				Date rowDate = sqlDateformat.parse(rowDateStr);
				BigDecimal money = (BigDecimal) map.get("moneyCount");
				// 首条数据判断
				if (i == 0) {
					int differ = getDiffer(rowDate, minDate);
					// 开始时间小于首条数据时间，拓展数据
					if (differ > 0) {
						for (int j = 0; j < differ; j++) {

							Calendar date = Calendar.getInstance();
							date.setTime(rowDate);
							date.set(Calendar.DATE,
									date.get(Calendar.DATE) - differ + j);
							moneyList.add("0.00");
							dayList.add(sqlDateformat.format(date.getTime()));
						}
					}
					dayList.add(rowDateStr);
					moneyList.add(money.toString());
					if (i == list.size() - 1) {
						differ = getDiffer(maxDate, rowDate);
						if (differ > 0) {
							for (int j = 0; j < differ; j++) {

								Calendar date = Calendar.getInstance();
								date.setTime(maxDate);
								date.set(Calendar.DATE, date.get(Calendar.DATE)
										- differ + j + 1);
								dayList.add(
										sqlDateformat.format(date.getTime()));
								moneyList.add("0.00");
							}
						}
					}
				} else {// 其他数据
					minDate = sqlDateformat
							.parse((String) list.get(i - 1).get("orderDate"));
					int differ = getDiffer(rowDate, minDate);
					if (differ > 1) {
						for (int j = 1; j < differ; j++) {

							Calendar date = Calendar.getInstance();
							date.setTime(rowDate);
							date.set(Calendar.DATE,
									date.get(Calendar.DATE) - differ + j);
							dayList.add(sqlDateformat.format(date.getTime()));
							moneyList.add("0.00");
						}
					}
					dayList.add(rowDateStr);
					moneyList.add(money.toString());

					if (i == list.size() - 1) {
						differ = getDiffer(maxDate, rowDate);
						if (differ > 0) {
							for (int j = 0; j < differ; j++) {

								Calendar date = Calendar.getInstance();
								date.setTime(maxDate);
								date.set(Calendar.DATE, date.get(Calendar.DATE)
										- differ + j + 1);
								dayList.add(
										sqlDateformat.format(date.getTime()));
								moneyList.add("0.00");
							}
						}
					}
				}
			} catch (ParseException e) {
				e.printStackTrace();
			}

		}
		result.put("moneyList", moneyList);
		result.put("dayList", dayList);
		return result;
	}

	private int getDiffer(Date bigDate, Date littleDate) {
		long nd = 1000 * 24 * 60 * 60;
		return Long.valueOf((bigDate.getTime() - littleDate.getTime()) / nd)
				.intValue();
	}

	@Override
	public ResultBean<Map<String, Object>> sumDetail(AgentDetailInfoVO vo) {
		Map<String, Object> result = geneDetailInfo(vo, true);
		return ResultBean.getSuccessResult(result);
	}

	private String getYesterday() {
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.DATE, -1);
		return new SimpleDateFormat("yyyyMMdd").format(cal.getTime());
	}

	/**
	 *
	 */
	@SuppressWarnings("unchecked")
	@Override
	public ResultBean<Map<String, Object>> geneSaleInfo(String yesterday) {
		if (Objects.isNull(yesterday)) {
			yesterday = getYesterday();
		}
		agentInfoMapper.deleteByDate(yesterday);
		ArrayList<UserOrderInfoDTO> userSubInfoList = new ArrayList<>();
		// 1.查询全部用户
		List<Map<String, Object>> allUser = agentInfoMapper.getAllUsers();
		// 2.递归统计下限
		Date now = new Date();
		for (Map<String, Object> user : allUser) {
			String userIds = null;
			Long userId = (Long) user.get(USERID);
			StringBuilder userIdsBuilder = new StringBuilder(userId.toString());
			String wxId = (String) user.get(WXID);
			if (Objects.nonNull(wxId)) {
				geneUserInfos(yesterday, userIdsBuilder, wxId);
			} else {
				continue;
			}
			userIds = userIdsBuilder.toString();
			// 3.统计订单和金额数
			int length = userIds.split(separator).length;
			length = length > 0 ? length - 1 : length;
			UserOrderInfoDTO usersOrderSub = agentInfoMapper
					.getUsersOrderSub(userId, length, userIds, yesterday);
			usersOrderSub.setCreateTime(now);
			userSubInfoList.add(usersOrderSub);
		}
		// 4.入库
		agentInfoMapper.insertTosaleReportDaliy(userSubInfoList);
		return ResultBean.getSuccessResult();
	}

	/**
	 * @Description: TODO
	 * @author 王斌
	 * @date 2017年10月31日 上午9:39:17
	 * @param yesterday
	 * @param userIdsBuilder
	 * @param wxId
	 */
	private void geneUserInfos(String yesterday, StringBuilder userIdsBuilder,
			String wxId) {
		while (true) {
			Map<String, Object> secondLevelAgent = agentInfoMapper
					.getUserWxIdByPid(Arrays.asList(wxId.split(",")),
							yesterday);
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
