package com.jdy.b2b.web.controll.department.sale.report;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.web.pojo.department.sale.report.DepartSaleReportVO;
import com.jdy.b2b.web.pojo.user.UserResultDTO;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;

/**
 * @Description 部门销售业绩统计报表
 * @author 王斌
 * @date 2017年11月9日 上午9:58:20
 * @version V1.0
 */
@RestController
public class DepartSlRportController extends BaseController {

	@SuppressWarnings("unchecked")
	@PostMapping("department/sale/report")
	public ResultBean<Object> report(@RequestBody DepartSaleReportVO vo) {

		setPermissions(vo);

		// 时间判断 当为月统计、日统计时，时间不能为空
		Integer type = vo.getType();
		String date = vo.getDate();
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
		String today = LocalDate.now().toString();
		switch (type) {

		case 0:
			vo.setEndDate(simpleDateFormat.format(new Date()));
			break;
		case 1:
			if (StringUtils.isBlank(date)) {
				return new ResultBean<>("-1", "时间不能为空");
			}
			if (date.compareTo(today) > 0) {
				return new ResultBean<>("-1", "统计时间不能超过今天");
			}
			if (!Pattern.matches("^\\d{4}-[0,1]{1}\\d{1}-[0,1,2,3]{1}\\d{1}$",
					date)) {
				return new ResultBean<>("-1", "时间格式不正确");
			}
			// 设置新时间
			try {
				Calendar calendar = Calendar.getInstance();
				int currentYear = calendar.get(Calendar.YEAR);
				int currentMonth = calendar.get(Calendar.MONTH);
				calendar.setTime(simpleDateFormat.parse(date));
				int statisticsMonth = calendar.get(Calendar.MONTH);
				int statisticsYear = calendar.get(Calendar.YEAR);
				calendar.set(Calendar.DAY_OF_MONTH, 1);
				vo.setDate(simpleDateFormat.format(calendar.getTime()));
				if (currentMonth == statisticsMonth
						&& statisticsYear == currentYear) {// 同月结束时间取今天，否则取次月1日
					vo.setEndDate(LocalDate.now().plusDays(1).toString());
				} else {
					calendar.add(Calendar.MONTH, 1);
					vo.setEndDate(simpleDateFormat.format(calendar.getTime()));
				}
			} catch (ParseException e) {
				e.printStackTrace();
			}
			break;
		case 2:
			if (StringUtils.isBlank(date)) {

				return new ResultBean<>("-1", "时间不能为空");
			}
			if (date.compareTo(today) > 0) {
				return new ResultBean<>("-1", "统计时间不能超过今天");
			}
			if (!Pattern.matches("^\\d{4}-[0,1]{1}\\d{1}-[0,1,2,3]{1}\\d{1}$",
					date)) {
				return new ResultBean<>("-1", "时间格式不正确");
			}
			LocalDate queryDate2 = LocalDate.parse(date); {
			String startTime = vo.getStartTime();
			if (StringUtils.isNotBlank(startTime)) {
				LocalDateTime startDateTime = LocalDateTime
						.parse(new StringBuilder().append(date).append("T")
								.append(startTime));
				DateTimeFormatter timeFormat = DateTimeFormatter
						.ofPattern("YYYY-MM-dd HH:mm:ss");
				vo.setDate(startDateTime.format(timeFormat));
				vo.setEndDate(startDateTime.plusHours(1).format(timeFormat));
			} else {
				String hourStr = " 00:00:00";
				vo.setDate(new StringBuilder(date).append(hourStr).toString());
				vo.setEndDate(
						new StringBuilder(queryDate2.plusDays(1).toString())
								.append(hourStr).toString());
			}

		}
			break;
		case 3:
		case 4:
			String endDate = vo.getEndDate();
			if (StringUtils.isBlank(date) || StringUtils.isBlank(endDate)) {
				return new ResultBean<>("-1", "时间不能为空");
			}
			if (endDate.compareTo(date) < 0) {
				return new ResultBean<>("-1", "结束时间不能小于开始时间不能为空");
			}
			if (date.compareTo(today) > 0) {
				return new ResultBean<>("-1", "统计时间不能超过今天");
			}
			if (endDate.compareTo(today) > 0) {
				vo.setEndDate(today);
			}
			if (!Pattern.matches("^\\d{4}-[0,1]{1}\\d{1}-[0,1,2,3]{1}\\d{1}$",
					date)) {
				return new ResultBean<>("-1", "时间格式不正确");
			}
			break;

		default:
			break;
		}

		return restTemplate.postForObject(
				new StringBuilder(reportsCenterUrl)
						.append("department/sale/report").toString(),
				vo, ResultBean.class);

	}

	/**
	 * @Description: 设置权限
	 * @author 王斌
	 * @date 2017年12月12日 下午2:01:30
	 * @param vo
	 */
	private void setPermissions(DepartSaleReportVO vo) {
		// 设置权限
		// 公司
		Subject subject = SecurityUtils.getSubject();
		UserResultDTO userInfo = (UserResultDTO) subject.getPrincipal();
		Long companyId = userInfo.getuCompanyId();
//		boolean isSuperCompany = Long.valueOf(0L).equals(companyId);
//			vo.setCompanyId((isSuperCompany
//					&& userInfo.getuDataLimit() == Integer.valueOf(3)) ? null
//							: companyId);
		
		// 公司
		final Integer uDataLimit = userInfo.getuDataLimit();
		if(uDataLimit <= Integer.valueOf(2)){
			vo.setCompanyId(companyId);
		}
		
		// 部门
//		if (userInfo.getuDataLimit() < Integer.valueOf(2)) {
//			Long departId = userInfo.getuDepartmentId();
//			vo.setDepartmentId(departId == null ? -1 : departId);
//		}
		
		// 部门
		if(uDataLimit <= Integer.valueOf(1)){
				Long departId = userInfo.getuDepartmentId();
				vo.setDepartmentId(departId == null ? -1 : departId);
		}
		
		// 人员
		if (uDataLimit == Integer.valueOf(0)) {
			vo.setUserId(userInfo.getUserId());
		}
	}
}
