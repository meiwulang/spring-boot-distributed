package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.common.DateTime;
import com.jdy.b2b.api.common.StringUtils;
import com.jdy.b2b.api.dao.diy.OrderMapperDiy;
import com.jdy.b2b.api.dao.posterSettings.PosterSettingsMapper;
import com.jdy.b2b.api.model.Order;
import com.jdy.b2b.api.model.diy.OrderPayRecordsDTO;
import com.jdy.b2b.api.model.posterSettings.PosterSettings;
import com.jdy.b2b.api.service.PosterSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static java.math.BigDecimal.ROUND_HALF_DOWN;

/**
 * add by dengbo 2018/1/4
 */
@Service
public class PosterSettingsServiceImpl implements PosterSettingsService {

	@Autowired
	private PosterSettingsMapper posterSettingsMapper;

	@Autowired
	OrderMapperDiy orderMapperDiy;

	@Override
	public int deleteByPrimaryKey(Long id) {
		return posterSettingsMapper.deleteByPrimaryKey(id);
	}

	@Override
	public long insert(PosterSettings posterSettings) {
		return posterSettingsMapper.insert(posterSettings);
	}

	@Override
	public int insertSelective(PosterSettings posterSettings) {
		return posterSettingsMapper.insertSelective(posterSettings);
	}

	@Override
	public PosterSettings selectByPrimaryKey(Long id) {
		return posterSettingsMapper.selectByPrimaryKey(id);
	}

	@Override
	public int updateByPrimaryKeySelective(PosterSettings posterSettings) {
		return posterSettingsMapper.updateByPrimaryKeySelective(posterSettings);
	}

	@Override
	public List<PosterSettings> queryPosterSettingsList(PosterSettings posterSettings) {
		return posterSettingsMapper.queryPosterSettingsList(posterSettings);
	}

	@Override
	public PosterSettings selectPosterSettings(PosterSettings posterSettings) {
		return posterSettingsMapper.selectPosterSettings(posterSettings);
	}

	public int updateByComIdOrGroupId(PosterSettings posterSettings){
		return posterSettingsMapper.updateByComIdOrGroupId(posterSettings);
	}

	/**
	 * 计算个人，销售组，公司的业绩,是否发送喜报
	 * @param orderNo
	 * @return
	 */
	@Transactional
	@Override
	public List<PosterSettings> queryPosters(String orderNo){
		List<PosterSettings> list = new ArrayList<PosterSettings>();
		//查询订单
		Order od = orderMapperDiy.selectOrderByOrderNo(orderNo);
		boolean flag = false;
		/*//判断是否是全额付款
		if(org.springframework.util.StringUtils.isEmpty(od.getoFirstPay()) || (od.getoFirstPay().compareTo(BigDecimal.ZERO) == 0)){
			flag = true;
		}
		//判断是否是首付款或付尾款的情况
		if(!org.springframework.util.StringUtils.isEmpty(od.getoFirstPay()) && !(od.getoFirstPay().compareTo(BigDecimal.ZERO) == 0)
			&& !org.springframework.util.StringUtils.isEmpty(od.getoUnPay())&&!(od.getoUnPay().compareTo(BigDecimal.ZERO) == 0)){
			flag = true;
		}*/

		//因现在可支持多次支付尾款，需要修改逻辑，查询订单支付条数是否大于1，大于1则判断是支付尾款，不发喜报
		//小于等于1，则是支付首款或全款
		OrderPayRecordsDTO orderPayRecordsDTO = orderMapperDiy.orderPayRecords(od);
		if (null != orderPayRecordsDTO
				&& null != orderPayRecordsDTO.getPays()
				&& orderPayRecordsDTO.getPays().size()<=1){
			flag = true;
		}

		if(flag){
			PosterSettings posterSettingsNum = new PosterSettings();
			//查询所有员工
			String openIds = posterSettingsMapper.queryAllPosterUser();
			//封装个人业绩
			PosterSettings personal = new PosterSettings();
			personal.setType("10");//个人
			personal.setAmount(od.getoRealPrice());//成交金额
			personal.setOpenIds(openIds);
			//查询个人所在销售组
			PosterSettings posterSettings = posterSettingsMapper.selectUserGroup(od.getoBuyerId());
			personal.setGroupName(posterSettings.getGroupName());
			String groupNo = posterSettings.getGroupNo();//销售组id
			if(org.springframework.util.StringUtils.isEmpty(od.getUpdateTime())){
				personal.setDate(DateTime.currentTime("MM月dd日"));
			}else{
				personal.setDate(DateTime.date2Str(od.getUpdateTime(),"MM月dd日"));
			}
			personal.setUserName(od.getoBuyerName());
			personal.setCompanyName(posterSettings.getCompanyName());
			//查询上级代理人
			//String pUserName = posterSettingsMapper.queryPUserName(od.getoBuyerId());
			if (null != posterSettings.getpUserName() && !"".equals(posterSettings.getpUserName())){
				personal.setpUserName(posterSettings.getpUserName());
			}else if (null != posterSettings.getpSaleManager() && !"".equals(posterSettings.getpSaleManager())){
				personal.setpUserName(posterSettings.getpSaleManager());
			}
			if (null != posterSettings.getpSaleManager() && !"".equals(posterSettings.getpSaleManager())){
				personal.setpSaleManager(posterSettings.getpSaleManager());
			}

			//查询产品名称
			String productName = posterSettingsMapper.selectProductById(od.getoProductId());
			personal.setProductName(productName);
			list.add(personal);
			//查询当前日的起始和截止时间
			String startDayDate = "";
			String endDayDate = "";
			if(org.springframework.util.StringUtils.isEmpty(od.getUpdateTime())){
				startDayDate = DateTime.currentDateTime(DateTime.DateFormat1)+" 00:00:00";
				endDayDate = DateTime.currentDateTime(DateTime.DateFormat1)+" 59:59:59";
			}else{
				startDayDate = DateTime.date2Str(od.getUpdateTime(),DateTime.DateFormat1)+" 00:00:00";
				endDayDate = DateTime.date2Str(od.getUpdateTime(),DateTime.DateFormat1)+" 59:59:59";
			}
			//查询当前月的起始和截止时间
			Map<String,String> map = DateTime.getStartDateAndEndDate("currmonth",od.getUpdateTime());
			//封装销售组每月业绩
			PosterSettings groupQuery = new PosterSettings();
			groupQuery.setGroupNo(groupNo);
			groupQuery.setStartDate(map.get("start_date"));
			groupQuery.setEndDate(map.get("end_date"));
			PosterSettings group = posterSettingsMapper.selectGroupAmountInMonth(groupQuery);
			if(null!=group && StringUtils.isNotNullOrEmptyStr(group.getGroupName())){
				if(org.springframework.util.StringUtils.isEmpty(od.getUpdateTime())){
					group.setDate(DateTime.currentTime("MM月"));
				}else{
					group.setDate(DateTime.date2Str(od.getUpdateTime(),"MM月"));
				}

				group.setType("20");
				list.add(group);
				//修改销售组每月业绩参数
				posterSettingsNum.setGroupNo(groupNo);
				//upd by dengbo
				PosterSettings groupAmount = posterSettingsMapper.selectPosterSettings(groupQuery);
				BigDecimal groupNum = group.getTotalAmount().divide(groupAmount.getGroupMonthLimit(),0,BigDecimal.ROUND_HALF_DOWN);
				group.setAmount(groupNum.multiply(groupAmount.getGroupMonthLimit()));
				posterSettingsNum.setGroupNum(groupNum.add(new BigDecimal("1")).intValue());
				posterSettingsMapper.updateByComIdOrGroupId(posterSettingsNum);
			}
			//封装公司每日业绩
			PosterSettings companyDayQuery = new PosterSettings();
			companyDayQuery.setCompanyId(od.getoBuyerCompanyId());
			companyDayQuery.setStartDate(startDayDate);
			companyDayQuery.setEndDate(endDayDate);
			PosterSettings companyDay = posterSettingsMapper.selectCompanyAmountInDay(companyDayQuery);
			if(null!=companyDay && StringUtils.isNotNullOrEmptyStr(companyDay.getCompanyName())){
				companyDay.setType("30");
				list.add(companyDay);
				//修改公司每日业绩参数
				posterSettingsNum = new PosterSettings();
				posterSettingsNum.setCompanyId(companyDayQuery.getCompanyId());
				PosterSettings companyAmount = posterSettingsMapper.selectPosterSettings(companyDayQuery);
				BigDecimal companyDayNum = companyDay.getTotalAmount().divide(companyAmount.getCompanyDayLimit(),0,BigDecimal.ROUND_HALF_DOWN);
				group.setAmount(companyDayNum.multiply(companyAmount.getCompanyDayLimit()));
				posterSettingsNum.setCompanyDayNum(companyDayNum.add(new BigDecimal("1")).intValue());
				posterSettingsMapper.updateByComIdOrGroupId(posterSettingsNum);
			}
			//封装公司每月业绩
			PosterSettings companyMonthQuery = new PosterSettings();
			companyMonthQuery.setCompanyId(od.getoBuyerCompanyId());
			companyMonthQuery.setStartDate(map.get("start_date"));
			companyMonthQuery.setEndDate(map.get("end_date"));
			PosterSettings companyMonth = posterSettingsMapper.selectCompanyAmountInMonth(companyMonthQuery);
			if(null!=companyMonth && StringUtils.isNotNullOrEmptyStr(companyMonth.getCompanyName())){
				companyMonth.setType("40");
				list.add(companyMonth);
				posterSettingsNum = new PosterSettings();
				posterSettingsNum.setCompanyId(companyDayQuery.getCompanyId());
				PosterSettings companyAmount = posterSettingsMapper.selectPosterSettings(companyMonthQuery);
				BigDecimal companyDayNum = companyMonth.getTotalAmount().divide(companyAmount.getCompanyMonthLimit(),0,BigDecimal.ROUND_HALF_DOWN);
				group.setAmount(companyDayNum.multiply(companyAmount.getCompanyMonthLimit()));
				posterSettingsNum.setCompanyDayNum(companyDayNum.add(new BigDecimal("1")).intValue());
				posterSettingsMapper.updateByComIdOrGroupId(posterSettingsNum);
			}
		}
		return list;
	}

	/**
	 * 每日任务，每月任务调整销售组，公司计数器
	 */
//	@Scheduled(cron = "0 0 0 1 * ?")
//	public void dealGroupAndComNumInMonth() {
//		PosterSettings posterSettings = new PosterSettings();
//		posterSettings.setGroupNum(1);
//		posterSettingsMapper.updateByPrimaryKeyInGroupMonth(posterSettings);
//		posterSettings = new PosterSettings();
//		posterSettings.setCompanyMonthNum(1);
//		posterSettingsMapper.updateByPrimaryKeyInCompanyMonth(posterSettings);
//	}
//
//	@Scheduled(cron = "0 0 0 * * ?")
//	public void dealComNumInDay() {
//		PosterSettings posterSettings = new PosterSettings();
//		posterSettings.setCompanyDayNum(1);
//		posterSettingsMapper.updateByPrimaryKeyInCompanyDay(posterSettings);
//	}

}
