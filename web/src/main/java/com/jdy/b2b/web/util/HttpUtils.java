package com.jdy.b2b.web.util;

import java.io.IOException;

import javax.servlet.ServletOutputStream;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;

import eu.bitwalker.useragentutils.UserAgent;

/**
 * Created by dugq on 2017\11\6 0006.
 */
public class HttpUtils {
	public static boolean isAjax(HttpServletRequest request) {
		String header = request.getHeader("X-Requested-With");
		String header1 = request.getHeader("Content-Type");// Content-Type:application/json;
		if (header1==null||(header1 != null && header1.contains("application/json"))
				|| "XMLHttpRequest".equals(header)) {
			return true;
		}
		return false;
	}

	public static void writeJson2Response(HttpServletResponse response,
			String message, String code) {
		ServletOutputStream outputStream = null;
		try {
			outputStream = response.getOutputStream();
			response.setHeader("Content-Type",
					"application/json;charset=UTF-8");
			outputStream.write(JSON.toJSONString(new ResultBean(code, message))
					.getBytes("UTF-8"));
			outputStream.close();
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}

	public static boolean isOptionsRequest(ServletRequest request) {
		if (request instanceof HttpServletRequest) {
			HttpServletRequest res = (HttpServletRequest) request;
			String method = res.getMethod();
			if (method.equals("OPTIONS")) {
				return true;
			}
		}
		return false;
	}

	public static void cros(ServletResponse response) {
		HttpServletResponse httpServletResponse = (HttpServletResponse) response;
		// 这里填写你允许进行跨域的主机ip
		httpServletResponse.setHeader("Access-Control-Allow-Origin", "*");
		// 允许的访问方法
		httpServletResponse.setHeader("Access-Control-Allow-Methods",
				"POST, GET, PUT, OPTIONS, DELETE, PATCH");
		// Access-Control-Max-Age 用于 CORS 相关配置的缓存
		httpServletResponse.setHeader("Access-Control-Max-Age", "3600");
		httpServletResponse.setHeader("Access-Control-Allow-Headers",
				"content-type,sessionid,x-requested-with");
	}

	public static String getIpAddr(HttpServletRequest request) {
		String ip = request.getHeader("x-forwarded-for");
		if (ip != null && ip.length() != 0 && !"unknown".equalsIgnoreCase(ip)) {
			// 多次反向代理后会有多个ip值，第一个ip才是真实ip
			if (ip.indexOf(",") != -1) {
				ip = ip.split(",")[0];
			}
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("HTTP_CLIENT_IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("HTTP_X_FORWARDED_FOR");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("X-Real-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getRemoteAddr();
		}
		return ip;
	}

	public static String getBrowser(HttpServletRequest request) {
		UserAgent userAgent = UserAgent
				.parseUserAgentString(request.getHeader("User-Agent"));
		return userAgent.getBrowser().getName() + "/" + userAgent.getBrowser()
				.getVersion(request.getHeader("User-Agent"));
	}
}
