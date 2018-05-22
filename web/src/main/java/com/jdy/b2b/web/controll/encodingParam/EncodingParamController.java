package com.jdy.b2b.web.controll.encodingParam;

import static org.apache.commons.lang.time.DateFormatUtils.format;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.EncodingObjectWithMd5Utils;
import com.jdy.b2b.web.util.ExcelUtil;
import com.jdy.b2b.web.util.HttpClientUtils;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by dugq on 2017/10/12.
 */
@SuppressWarnings({ "unchecked", "rawtypes" })
@RestController
@RequestMapping
public class EncodingParamController extends BaseController {

	private String prefixFxUrl;

	@RequestMapping("encodingParam")
	public ResultBean encodingParam(@RequestBody Map map) {
		Object obj = map.get("url");
		if (Objects.isNull(obj)) {
			return new ResultBean("-1", "url is empty");
		}
		String url = (String) obj;
		if (StringUtils.isBlank(url)) {
			return new ResultBean("-1", "url is empty");
		}
		map.remove("url");
		Object export = map.get("export");
		map.remove("export");
		String encoding = EncodingObjectWithMd5Utils.encoding(map)
				.toJSONString();
		System.out.println(encoding);
		try {
			JSONObject jsonObject = HttpClientUtils.httpPostJSON(prefixFxUrl+url, encoding);
			exportFile(map, jsonObject, obj, export);
			// JSONObject jsonObject = HttpClientUtils.httpPost(url, map);
			return ResultBean.getSuccessResult(jsonObject);
		} catch (Exception e) {
			// return new ResultBean("-1","请求失败~");
			return new ResultBean("-1", e.getMessage());
		}
	}

	@GetMapping("exportRebateList")
	private ResultBean<Object> exportRebateList(
			@RequestParam("curPage") Integer curPage,
			@RequestParam("pageSize") Integer pageSize,
			@RequestParam("publicId") String publicId,
			@RequestParam("searchParam") String searchParam,
			@RequestParam("companyId") String companyId,
			@RequestParam("url") String url) {
		Map<String, Object> map = new HashMap<>(16);
		map.put("curPage", curPage);
		map.put("pageSize", pageSize);
		map.put("companyId", companyId);
		map.put("publicId", publicId);
		map.put("searchParam", searchParam);
		String encoding = EncodingObjectWithMd5Utils.encoding(map)
				.toJSONString();
		JSONObject jsonObject = HttpClientUtils.httpPostJSON(getPrefixFxUrl()+url, encoding);
		exportRebateList(jsonObject);
		return null;
	}

	@GetMapping("exportRebateDetailList")
	private ResultBean<Object> exportRebateDetailList(
			@RequestParam("curPage") Integer curPage,
			@RequestParam("pageSize") Integer pageSize,
			@RequestParam("openId") String publicId,
			@RequestParam(required = false, value = "startDate") String startDate,
			@RequestParam(required = false, value = "endDate") String endDate,
			@RequestParam(required = false, value = "level") String level,
			@RequestParam("searchParam") String searchParam,
			@RequestParam("url") String url) {
		Map<String, Object> map = new HashMap<>(16);
		map.put("curPage", curPage);
		map.put("pageSize", pageSize);
		map.put("openId", publicId);
		map.put("searchParam", searchParam);
		if (startDate != null) {
			map.put("startDate", startDate);
		}
		if (endDate != null) {
			map.put("endDate", endDate);
		}
		if (level != null) {
			map.put("level", level);
		}
		String encoding = EncodingObjectWithMd5Utils.encoding(map)
				.toJSONString();
		JSONObject jsonObject = HttpClientUtils.httpPostJSON(url, encoding);
		exportRebateDetailList(jsonObject);
		return null;
	}

	private void exportFile(Map map, JSONObject jsonObject, Object obj,
			Object export) {
		if (export != null) {
			if (((String) (obj)).contains("rebate/getRebateList.do")) {
				exportRebateList(jsonObject);
			}
			if (((String) (obj)).contains("rebate/getRebateDetailList.do")) {
				exportRebateDetailList(jsonObject);
			}
		}

	}

	private void exportRebateDetailList(JSONObject jsonObject) {
		List<String> titles = new ArrayList<>();
		List<List> bodyList = new ArrayList<>();
		titles.add("姓名");
		titles.add("手机号码");
		titles.add("返佣编号");
		titles.add("订单编号");
		titles.add("商品名称");
		titles.add("数量");
		titles.add("商品单价");
		titles.add("规则编号");
		titles.add("返佣类型");
		titles.add("返佣等级");
		titles.add("返佣金额");
		titles.add("百分比/金额");
		titles.add("成交时间");
		titles.add("结算状态");
		ArrayList<Map> resultList = (ArrayList<Map>) JSON.parseArray(
				JSON.toJSONString(jsonObject.get("resultList")), Map.class);
		for (Map<String, Object> row : resultList) {
			List body = new ArrayList<>();
			body.add(row.get("name"));
			body.add(row.get("phone"));
			body.add(row.get("code"));
			body.add(row.get("orderNumber"));
			body.add(row.get("productName"));
			body.add(row.get("qty"));
			body.add(new StringBuilder().append("￥")
					.append(row.get("realAmount")).toString());
			body.add(row.get("promotionCode"));
			body.add(row.get("rebateTypeName"));
			int level = (int) row.get("level");
			String levelStr = "";
			levelStr = level == 1 ? "一级" : level == 2 ? "二级" : "三级";
			body.add(levelStr);
			body.add(new StringBuilder().append("￥").append(row.get("amount"))
					.toString());
			body.add("1".equals(row.get("rebateType")) ? "金额" : "百分比");
			body.add(row.get("tranTimeFormat"));
			body.add("0".equals(row.get("status")) ? "未结算" : "已结算");
			bodyList.add(body);
		}
		// 生成模板并下载
		geneFile(titles, bodyList, "佣金明细");
	}

	private void exportRebateList(JSONObject jsonObject) {
		List<String> titles = new ArrayList<>();
		List<List> bodyList = new ArrayList<>();
		titles.add("openid");
		titles.add("昵称");
		titles.add("真实姓名");
		titles.add("手机号码");
		titles.add("未结佣金");
		titles.add("已结佣金");
		titles.add("订单数");
		titles.add("成交总金额");
		ArrayList<Map> resultList = (ArrayList<Map>) JSON.parseArray(
				JSON.toJSONString(jsonObject.get("resultList")), Map.class);
		for (Map<String, Object> row : resultList) {
			List body = new ArrayList<>();
			body.add(row.get("openId"));
			body.add(row.get("nickName"));
			body.add(row.get("name"));
			body.add(row.get("phone"));
			body.add(new StringBuilder().append("￥")
					.append(row.get("unsettledAmount")).toString());
			body.add(new StringBuilder().append("￥")
					.append(row.get("settledAmount")).toString());
			body.add(row.get("qty"));
			body.add(new StringBuilder().append("￥")
					.append(row.get("totalAmount")).toString());
			bodyList.add(body);
		}
		// 生成模板并下载
		geneFile(titles, bodyList, "佣金列表");
	}

	/**
	 * @Description: TODO
	 * @author 王斌
	 * @date 2017年10月23日 下午5:57:42
	 * @param titles
	 * @param bodyList
	 */
	private void geneFile(List<String> titles, List<List> bodyList,
			String fileName) {
		ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder
				.getRequestAttributes();
		HttpServletRequest request = requestAttributes.getRequest();
		final String userAgent = request.getHeader("USER-AGENT");
		String finalFileName = null;
		try {
			if (StringUtils.contains(userAgent, "MSIE")) {// IE浏览器
				finalFileName = URLEncoder.encode(fileName, "UTF8");
			} else if (StringUtils.contains(userAgent, "Mozilla")) {// google,火狐浏览器
				finalFileName = new String(fileName.getBytes(), "ISO8859-1");
			} else {
				finalFileName = URLEncoder.encode(fileName, "UTF8");// 其他浏览器
			}
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		HttpServletResponse response = requestAttributes.getResponse();
		try {
			ExcelUtil.export(
					finalFileName + format(new Date(), "yyyy_MM_dd HH_mm_ss"),
					fileName, titles, bodyList, response);
		} catch (Exception e) {
			logger.error("佣金列表导出失败", e);
		}
	}

	public String getPrefixFxUrl() {
		return prefixFxUrl;
	}
	@Value("${spring.fxUrl}")
	public void setPrefixFxUrl(String fxUrl) {
		this.prefixFxUrl = fxUrl;
	}
}
