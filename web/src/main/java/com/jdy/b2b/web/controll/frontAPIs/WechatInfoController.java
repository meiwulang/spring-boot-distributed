package com.jdy.b2b.web.controll.frontAPIs;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.Objects;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.jdy.b2b.web.pojo.user.UserResultDTO;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.alibaba.fastjson.JSON;

/***
 * 
 * @Description 微信相关接口
 * @author 王斌
 * @date 2017年9月26日 上午9:58:07
 * @version V1.0
 */
@Controller
// @Api(hidden = true)
public class WechatInfoController {
	private static final String S2 = "var share_user=";
	private static final String S3 = "var _uinfo =";
	@Autowired
	@Qualifier("shiroEhcacheManager")
	private EhCacheManager ehCacheManager;

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	@RequestMapping(value = "/wap/m/assets/js/get_wechat.js", method = RequestMethod.GET)
	public void get_wechat(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		Subject subject = SecurityUtils.getSubject();
		String inPath;
		if (subject.isAuthenticated()) {
			inPath = "/templates/wap/m/assets/js/get_wechat_logined.js";
		} else {
			inPath = "/templates/wap/m/assets/js/get_wechat_nologin.js";
		}

		StringBuilder result = getTemplateString(subject, inPath, S2);
		response.setHeader("Content-Type",
				"application/javascript;charset=UTF-8");
		PrintWriter writer = response.getWriter();
		writer.print(result.toString());
		writer.flush();
		writer.close();
	}

	/**
	 * @Description: 读取模板内容
	 * @author 王斌
	 * @date 2017年9月28日 上午9:21:56
	 * @param subject
	 * @param inPath
	 * @return
	 * @throws FileNotFoundException
	 * @throws IOException
	 */
	private StringBuilder getTemplateString(Subject subject, String inPath,
			String key) throws FileNotFoundException, IOException {
		// 读取文件
		InputStream is = ClassLoader.getSystemResourceAsStream(inPath);
		if (is == null) {
			is = this.getClass().getResourceAsStream(inPath);
		}
		BufferedReader br = new BufferedReader(new InputStreamReader(is));
		String s;
		StringBuilder result = new StringBuilder();
		while ((s = br.readLine()) != null) {
			// 替换变量
			if (s.contains(key) && subject.isAuthenticated()) {
				replaceKeyWords(subject, key, result);
			} else {
				result.append(s);
			}
		}
		br.close();
		return result;
	}

	/**
	 * @Description: TODO
	 * @author 王斌
	 * @date 2017年9月28日 上午9:45:27
	 * @param subject
	 * @param key
	 * @param result
	 */
	private void replaceKeyWords(Subject subject, String key,
			StringBuilder result) {
		Cache<Object, Object> cache = ehCacheManager
				.getCache("currentUserCache");
		UserResultDTO principal = (UserResultDTO)subject.getPrincipal();
		String jsonString = JSON
				.toJSONString(cache.get(principal.getuAccount() + "_front"));
		String userInfo;
		logger.info("jsonString:" + jsonString);
		if (Objects.equals(key, S2)) {
			userInfo = jsonString == null ? "{}" : jsonString;
		} else {
			userInfo = jsonString;
		}
		result.append(key).append(userInfo).append(";");
	}

	@RequestMapping(value = "/wap/m/assets/js/get_consts.js", method = RequestMethod.GET)
	public void getConst(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		Subject subject = SecurityUtils.getSubject();
		String inPath;
		if (subject.isAuthenticated()) {
			inPath = "/templates/wap/m/assets/js/get_consts_logined.js";
		} else {
			inPath = "/templates/wap/m/assets/js/get_consts_nologin.js";
		}
		StringBuilder result = getTemplateString(subject, inPath, S3);
		response.setHeader("Content-Type",
				"application/javascript;charset=UTF-8");
		PrintWriter writer = response.getWriter();
		writer.print(result.toString());
		writer.flush();
		writer.close();
	}
}
