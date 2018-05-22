package com.jdy.b2b.web.controll.agentinfo;

import static org.apache.commons.lang.time.DateFormatUtils.format;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.jdy.b2b.web.pojo.agentinfo.AgentDetailInfoVO;
import com.jdy.b2b.web.pojo.agentinfo.AgentInfoVO;
import com.jdy.b2b.web.pojo.user.UserResultDTO;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ExcelUtil;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.annotations.Query;
import com.jdy.b2b.web.util.annotations.Save;

@RestController
@RequestMapping("agentinfo")
@SuppressWarnings({ "unchecked", "rawtypes" })
public class AgentInfoReportController extends BaseController {

	/** 
	 * @Description: 代理人销售报表列表
	 * @author 王斌
	 * @date 2018年1月9日 上午11:25:20
	 * @param vo
	 * @return
	 */
	@PostMapping("list")
	public ResultBean<Map<String, Object>> list(@RequestBody AgentInfoVO vo) {
		setPermissions(vo);
		return restTemplate.postForObject(
				new StringBuilder().append(reportsCenterUrl)
						.append("/agentinfo/list").toString(),
				vo, ResultBean.class);

	}

	/** 
	 * @Description: 手动生成代理人销售报表数据
	 * @author 王斌
	 * @date 2018年1月9日 上午11:24:47
	 * @param date
	 * @param companyId
	 * @return
	 */
	@GetMapping("generateReport/{date}")
	public ResultBean<Map<String, Object>> generateReport(
			@PathVariable String date,@RequestParam(value="companyId",required=false) Long companyId) {
		UserResultDTO user = getUser();
		if (!Integer.valueOf(3).equals(user.getuDataLimit()) ) {
			companyId=user.getuCompanyId();
		}
		if (!Pattern.matches("^\\d{4}[0,1]{1}\\d{1}[0,1,2,3]{1}\\d{1}$",
				date)) {
			return new ResultBean<>("-1", "时间格式不正确。应为:yyyyMMdd");
		}
		return restTemplate.getForObject(new StringBuilder()
				.append(reportsCenterUrl).append("/agentinfo/generateReport/")
				.append(date).toString(), ResultBean.class);
	}

	@PostMapping("detail")
	public ResultBean<Map<String, Object>> detail(
			@Validated(Query.class) @RequestBody AgentDetailInfoVO vo) {
		String minDateStr = vo.getMinDate();
		String maxDateStr = vo.getMaxDate();
		if (!Pattern.matches("^\\d{4}[0,1]{1}\\d{1}[0,1,2,3]{1}\\d{1}$",
				minDateStr)
				|| !Pattern.matches("^\\d{4}[0,1]{1}\\d{1}[0,1,2,3]{1}\\d{1}$",
						maxDateStr)) {
			return new ResultBean<>("-1", "时间格式不正确。应为:yyyyMMdd");

		}
		try {
			SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
			Date minDate = format.parse(minDateStr);
			Date maxDate = format.parse(maxDateStr);
			long nd = 1000 * 24 * 60 * 60;
			long dayRange = (maxDate.getTime() - minDate.getTime()) / nd;
			if (dayRange > 31L) {
				return new ResultBean<>("-1", "统计时间最大范围为31天");
			}
			if (dayRange < 0L) {
				return new ResultBean<>("-1", "开始时间不能小于结束时间");
			}
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return restTemplate.postForObject(
				new StringBuilder().append(reportsCenterUrl)
						.append("/agentinfo/detail").toString(),
				vo, ResultBean.class);

	}

	@PostMapping("sumdetail")
	public ResultBean<Map<String, Object>> sumDetail(
			@Validated(Save.class) @RequestBody AgentDetailInfoVO vo) {
		vo.setId(null);
		String minDateStr = vo.getMinDate();
		String maxDateStr = vo.getMaxDate();
		if (!Pattern.matches("^\\d{4}[0,1]{1}\\d{1}[0,1,2,3]{1}\\d{1}$",
				minDateStr)
				|| !Pattern.matches("^\\d{4}[0,1]{1}\\d{1}[0,1,2,3]{1}\\d{1}$",
						maxDateStr)) {
			return new ResultBean<>("-1", "时间格式不正确。应为:yyyyMMdd");

		}
		try {
			SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
			Date minDate = format.parse(minDateStr);
			Date maxDate = format.parse(maxDateStr);
			long nd = 1000 * 24 * 60 * 60;
			long dayRange = (maxDate.getTime() - minDate.getTime()) / nd;
			if (dayRange > 31L) {
				return new ResultBean<>("-1", "统计时间最大范围为31天");
			}
			if (dayRange < 0L) {
				return new ResultBean<>("-1", "开始时间不能小于结束时间");
			}
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return restTemplate.postForObject(
				new StringBuilder().append(reportsCenterUrl)
						.append("/agentinfo/sumdetail").toString(),
				vo, ResultBean.class);

	}

	/** 
	 * @Description: 导出代理人销售报表列表
	 * @author 王斌
	 * @date 2018年1月9日 上午11:25:35
	 * @param minDate
	 * @param maxDate
	 * @param searchStr
	 * @param companyId
	 */
	@GetMapping("export")
	public void export(@RequestParam(value = "minDate") String minDate,
			@RequestParam(value = "maxDate") String maxDate,
			@RequestParam(value = "searchStr", required = false) String searchStr,
			@RequestParam(value="companyId",required=false) Long companyId) {
		AgentInfoVO vo = new AgentInfoVO();
		if (minDate != null) {
			vo.setMinDate(minDate);
		}
		if (maxDate != null) {
			vo.setMaxDate(maxDate);
		}
		if (searchStr != null) {
			vo.setSearchStr(searchStr);
		}
		vo.setCompanyId(companyId);
		setPermissions(vo);
		vo.setCurrPage(Integer.valueOf(0));
		vo.setPageSize(Integer.MAX_VALUE);
		exportData(
				(List<Map<String, Object>>) ((Map<String, Object>) restTemplate
						.postForObject(
								new StringBuilder().append(reportsCenterUrl)
										.append("/agentinfo/list").toString(),
								vo, ResultBean.class)
						.getBody()).get("resultList"));
	}

	private void exportData(List<Map<String, Object>> list) {
		List<String> titles = new ArrayList<>();
		List<List> bodyList = new ArrayList<>();
		titles.add("openid");
		titles.add("昵称");
		titles.add("真实姓名");
		titles.add("手机号码");
		titles.add("下线总人数");
		titles.add("订单数");
		titles.add("销售总金额");
		for (Map<String, Object> row : list) {
			List body = new ArrayList<>();
			body.add(row.get("openId"));
			body.add(row.get("realName"));
			body.add(row.get("realName"));
			body.add(row.get("phone"));
			body.add(row.get("followers"));
			body.add(row.get("orderCount"));
			body.add(row.get("moneyCount"));
			bodyList.add(body);
		}
		// 生成模板并下载
		ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder
				.getRequestAttributes();
		HttpServletRequest request = requestAttributes.getRequest();
		final String userAgent = request.getHeader("USER-AGENT");
		String finalFileName = null;
		String fileName = "代理人销售列表";
		try {
			if (StringUtils.contains(userAgent, "MSIE")) {// IE浏览器
				finalFileName = URLEncoder.encode(fileName, "UTF8");
			} else if (StringUtils.contains(userAgent, "Mozilla")) {// google,火狐浏览器
				finalFileName = new String(fileName.getBytes(), "ISO8859-1");
			} else {
				finalFileName = URLEncoder.encode(fileName, "UTF8");// 其他浏览器
			}
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		HttpServletResponse response = requestAttributes.getResponse();
		try {
			ExcelUtil.export(
					finalFileName + format(new Date(), "yyyy_MM_dd HH_mm_ss"),
					fileName, titles, bodyList, response);
		} catch (Exception e) {
			logger.error("代理人销售列表导出失败", e);
		}
	}
	/**
	 * @Description: 设置权限
	 * @author 王斌
	 * @date 2017年12月12日 下午2:01:30
	 * @param vo
	 */
	private void setPermissions(AgentInfoVO vo) {
		UserResultDTO userInfo = getUser();
		Long companyId = userInfo.getuCompanyId();
		// 系统级用户 查看全部数据
		Integer uDataLimit = userInfo.getuDataLimit();
		if (!Integer.valueOf(3).equals(uDataLimit) ) {
			vo.setCompanyId(companyId);
		}
	}


}
