package com.jdy.b2b.web.util;

import com.jdy.b2b.web.util.exception.NotLoginException;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.web.client.RestTemplate;

import com.jdy.b2b.web.pojo.user.UserResultDTO;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Objects;

/**
 * Created by Admin on 2017/7/4.
 */
public abstract class BaseController {
	@Autowired
	@Qualifier("customRestTemplate")
	protected RestTemplate restTemplate;

	@Autowired
	@Qualifier("shiroEhcacheManager")
	private EhCacheManager ehCacheManager;

	@Value("${controllCenterUrl:http://localhost:8088}")
	protected String controllCenterUrl;
	@Value("${systemCenterUrl:http://localhost:8089}")
	protected String systemCenterUrl;
	@Value("${reportsCenterUrl:http://localhost:6666/api/reportsCenter/}")
	protected String reportsCenterUrl;
	@Value("${salesCenterUrl:http://localhost:5555/api/salesCenterUrl/}")
	protected String salesCenterUrl;

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	public UserResultDTO getUser() {
		/*
		 * Subject subject = SecurityUtils.getSubject(); return (UserResultDTO)
		 * subject.getSession().getAttribute("user");
		 */
		Subject subject = SecurityUtils.getSubject();
		UserResultDTO user = (UserResultDTO)subject.getPrincipal();
		if(Objects.isNull(user)){
			throw new NotLoginException("without user!!!");
		}
		return user;
	}
	protected HttpServletRequest getRequest(){
		return ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
	}

	protected HttpServletResponse getResponse(){
		return ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();
	}
}
