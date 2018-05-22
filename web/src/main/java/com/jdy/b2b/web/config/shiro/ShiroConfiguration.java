package com.jdy.b2b.web.config.shiro;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.Filter;

import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.apache.shiro.codec.Base64;
import org.apache.shiro.session.Session;
import org.apache.shiro.session.SessionListener;
import org.apache.shiro.session.mgt.eis.EnterpriseCacheSessionDAO;
import org.apache.shiro.session.mgt.eis.JavaUuidSessionIdGenerator;
import org.apache.shiro.session.mgt.eis.SessionDAO;
import org.apache.shiro.session.mgt.eis.SessionIdGenerator;
import org.apache.shiro.session.mgt.quartz.QuartzSessionValidationScheduler;
import org.apache.shiro.spring.LifecycleBeanPostProcessor;
import org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.CookieRememberMeManager;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.apache.shiro.web.servlet.SimpleCookie;
import org.slf4j.LoggerFactory;
import org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.jdy.b2b.web.aop.MyPermissionsAuthorizationFilter;

@Configuration
public class ShiroConfiguration {
	final org.slf4j.Logger logger = LoggerFactory.getLogger(this.getClass());

	private static Map<String, String> filterChainDefinitionMap = new LinkedHashMap<String, String>();

	@Bean(name = "ShiroRealmImpl")
	public ShiroRealm getShiroRealm() {
		ShiroRealm realm = new ShiroRealm();
		realm.setCachingEnabled(true);
		realm.setAuthenticationCachingEnabled(false);
		realm.setAuthorizationCachingEnabled(true);
		realm.setAuthorizationCacheName("authorizationCache");

		return realm;
	}

	@Bean(name = "shiroEhcacheManager")
	public EhCacheManager getEhCacheManager() {
		EhCacheManager em = new EhCacheManager();
		em.setCacheManagerConfigFile("classpath:ehcache-shiro.xml");
		return em;
	}

	@Bean(name = "lifecycleBeanPostProcessor")
	public LifecycleBeanPostProcessor getLifecycleBeanPostProcessor() {
		return new LifecycleBeanPostProcessor();
	}

	@Bean
	public DefaultAdvisorAutoProxyCreator getDefaultAdvisorAutoProxyCreator() {
		DefaultAdvisorAutoProxyCreator daap = new DefaultAdvisorAutoProxyCreator();
		daap.setProxyTargetClass(true);
		return daap;
	}

	@Bean(name = "securityManager")
	public DefaultWebSecurityManager getDefaultWebSecurityManager() {
		DefaultWebSecurityManager dwsm = new DefaultWebSecurityManager();
		/*
		 * 可以配置多realm,注意多realm的策略,默认atLeastOne List<Realm> list = new
		 * ArrayList<Realm>(); list.add(getShiroRealm());
		 * list.add(getShiroRealm2()); dwsm.setRealms(list);
		 */
		dwsm.setRealm(getShiroRealm());
		dwsm.setCacheManager(getEhCacheManager());
		logger.info(
				"getEhCacheManager~~~~~~~~~~~~~~~~" + getEhCacheManager() + "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
		dwsm.setSessionManager(getDefaultWebSessionManager());
		dwsm.setRememberMeManager(getRememberMeManager());
		dwsm.setSessionManager(getDefaultWebSessionManager());
		return dwsm;
	}

	@Bean
	public SimpleCookie getRememberMeCookie() {
		SimpleCookie simpleCookie = new SimpleCookie("RememberMeSessionID");
		simpleCookie.setHttpOnly(true);
		simpleCookie.setName("RememberMeSessionID");
		// cookie过期时间7天 /秒
		simpleCookie.setMaxAge(1800);
		// simpleCookie.setDomain("jdy");
		return simpleCookie;
	}

	@Bean
	public CookieRememberMeManager getRememberMeManager() {
		CookieRememberMeManager rememberMeManager = new CookieRememberMeManager();
		rememberMeManager.setCipherKey(Base64.decode("4AvVhmFLUs0KTA3Kprsdag=="));
		rememberMeManager.setCookie(getRememberMeCookie());
		return rememberMeManager;
	}

	@Bean
	public AuthorizationAttributeSourceAdvisor getAuthorizationAttributeSourceAdvisor() {
		AuthorizationAttributeSourceAdvisor aasa = new AuthorizationAttributeSourceAdvisor();
		aasa.setSecurityManager(getDefaultWebSecurityManager());
		return aasa;
	}

	@Bean(name = "shiroFilter")
	public ShiroFilterFactoryBean getShiroFilterFactoryBean() {
		ShiroFilterFactoryBean shiroFilterFactoryBean = new MyShiroFilterFactoryBean();

		shiroFilterFactoryBean.setSecurityManager(getDefaultWebSecurityManager());
		/* 没有认证时默认跳转的路径 */
		shiroFilterFactoryBean.setLoginUrl("/login.html");
		shiroFilterFactoryBean.setSuccessUrl("/login.html");
		shiroFilterFactoryBean.setUnauthorizedUrl("/noPermission.html");
		/* 可以配置自定义过滤器 */
		filterChainDefinitionMap.put("/front/**", "anon");
		filterChainDefinitionMap.put("/wechat/callback", "anon");
		filterChainDefinitionMap.put("/user/distAdminLogin", "anon");
		filterChainDefinitionMap.put("/user/mobileLogout", "anon");
		filterChainDefinitionMap.put("/user/loginByOpenId", "anon");
		filterChainDefinitionMap.put("/user/mobileLogin", "anon");
		filterChainDefinitionMap.put("/user/h5/register", "anon");
		filterChainDefinitionMap.put("/user/h5/mine", "anon");
		// 电子合同回调接口
		filterChainDefinitionMap.put("/front/order/m/electronicContract/callback", "anon");
		filterChainDefinitionMap.put("/front/order/m/electronicContract/queryContractViewAndDownloadUrlByOrderNo/**",
				"anon");
		filterChainDefinitionMap.put("/user/visitorRegister", "anon");
		filterChainDefinitionMap.put("/user/syncUser", "anon");
		filterChainDefinitionMap.put("/department/syncDepartment", "anon");
		filterChainDefinitionMap.put("/Company/syncCompanyAll", "anon");

		// 上传支付凭证接口
		filterChainDefinitionMap.put("/orderOffline/saveOrderOffline", "anon");
		// 电子合同回调接口
		filterChainDefinitionMap.put("/front/order/m/electronicContract/callback", "anon");
		filterChainDefinitionMap.put("/front/order/m/electronicContract/queryContractViewAndDownloadUrlByOrderNo/**",
				"anon");

		// /user/login不加kickout因为anon,可以随意访问,即随意踢出在线用户
		filterChainDefinitionMap.put("/user/login", "anon");
		filterChainDefinitionMap.put("/user/notifyUpdateUserInfo", "anon");
		filterChainDefinitionMap.put("/user/singlePointLoginValidateSuccess", "anon");
		filterChainDefinitionMap.put("/static/**", "anon");
		filterChainDefinitionMap.put("/wap/**", "anon");
		filterChainDefinitionMap.put("/wap/n/**", "anon");
		filterChainDefinitionMap.put("/wap/m/**", "anon");
		// 定制游获取方案详情 不需要登录
		filterChainDefinitionMap.put("/require/queryProjectDetail", "anon");

		// v1.0.1 不踢出用户
		filterChainDefinitionMap.put("/salesPerformance/**", "anon");
		filterChainDefinitionMap.put("/department/sale/report", "anon");
		filterChainDefinitionMap.put("/department/m/queryDepartmentSaleCount", "anon");
		filterChainDefinitionMap.put("/agentDistChart/chartData", "anon");
		filterChainDefinitionMap.put("/agentStatistics/**", "anon");

		// 短信链接指向的出团通知书
		filterChainDefinitionMap.put("/notify/groupAdviceNoteForMessage", "anon");

		filterChainDefinitionMap.put("/user/authorization", "myAuthc");

		filterChainDefinitionMap.put("/swagger*", "anon");
		filterChainDefinitionMap.put("/configuration*", "anon");
		filterChainDefinitionMap.put("/v2/api-docs", "anon");

		filterChainDefinitionMap.put("/**", "myAuthc,myPerm");

		filterChainDefinitionMap.put("/**", "anon");
		// filterChainDefinitionMap.put("/**", "myAuthc,kickout");

		/* 设置要代理的过滤器 */
		shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);
		Map<String, Filter> map = new LinkedHashMap<String, Filter>();
		// map.put("kickout", getKickoutSessionControlFilter());
		map.put("myAuthc", new CaptchaFormAuthenticationFilter());
		map.put("myPerm", myPerm());
		// map.put("mobileLogout",getMobileLogoutFilter());
		/* map.put("pcLogout",getPCLogoutFilter()); */
		shiroFilterFactoryBean.setFilters(map);
		return shiroFilterFactoryBean;
	}

	@Bean
	public MyPermissionsAuthorizationFilter myPerm() {
		return new MyPermissionsAuthorizationFilter();
	}

	@Bean
	public SessionIdGenerator getSessionIdGenerator() {
		return new JavaUuidSessionIdGenerator();
	}

	@Bean("sessionDAO")
	public SessionDAO getEnterpriseCacheSessionDAO() {
		EnterpriseCacheSessionDAO sessionDAO = new EnterpriseCacheSessionDAO();
		sessionDAO.setActiveSessionsCacheName("shiro-activeSessionCache");
		sessionDAO.setSessionIdGenerator(getSessionIdGenerator());
		return sessionDAO;
	}

	@Bean
	public SimpleCookie getSessionIdCookie() {
		SimpleCookie simpleCookie = new SimpleCookie("ShiroSessionID");
		// simpleCookie.setName("jdy");
		simpleCookie.setHttpOnly(true);
		// 30分钟
		simpleCookie.setMaxAge(1800);
		// 设置当前访问的域名*
		// simpleCookie.setDomain("localhost");
		return simpleCookie;
	}

	@Bean("sessionManager")
	public SessionManager getDefaultWebSessionManager() {
		SessionManager sessionManager = new SessionManager();
		// 设置全局session过期时间 /毫秒 半小时
		sessionManager.setGlobalSessionTimeout(1800000);
		// sessionManager.setGlobalSessionTimeout(1000);
		sessionManager.setDeleteInvalidSessions(true);
		sessionManager.setSessionValidationSchedulerEnabled(true);
		sessionManager.setSessionDAO(getEnterpriseCacheSessionDAO());
		sessionManager.setSessionIdCookieEnabled(true);
		sessionManager.setSessionIdCookie(getSessionIdCookie());
		// 设置监听器,自定义的监听器也要加在这里
		List list = new ArrayList();
		list.add(getSessionListener());
		sessionManager.setSessionListeners(list);
		return sessionManager;
	}

	@Bean
	public QuartzSessionValidationScheduler getQuartzSessionValidationScheduler() {
		QuartzSessionValidationScheduler scheduler = new QuartzSessionValidationScheduler();
		scheduler.setSessionValidationInterval(5000);
		scheduler.setSessionManager(getDefaultWebSessionManager());
		return scheduler;
	}

	/* 创建会话监听器,监听session的创建和销毁,验证会话管理是否起作用 */
	@Bean
	public SessionListener getSessionListener() {
		SessionListener listener = new SessionListener() {
			@Override
			public void onStart(Session session) {
				logger.debug("会话创建: " + session.getId());
			}

			@Override
			public void onStop(Session session) {
				logger.debug("退出会话：" + session.getId());
			}

			@Override
			public void onExpiration(Session session) {
				logger.debug("会话过期：" + session.getId());
			}
		};
		return listener;
	}

	@Bean(name = "matcher")
	public RetryLimitCredentialsMatcher getMatcher() {
		EhCacheManager manager = new EhCacheManager();
		RetryLimitCredentialsMatcher matcher = new RetryLimitCredentialsMatcher(getEhCacheManager());
		matcher.setHashAlgorithmName("md5");
		matcher.setHashIterations(3);
		matcher.setStoredCredentialsHexEncoded(true);
		return matcher;
	}

	// @Bean(name = "kickoutSessionControlFilter")
	// public KickoutSessionControlFilter getKickoutSessionControlFilter() {
	// KickoutSessionControlFilter kickoutSessionControlFilter = new
	// KickoutSessionControlFilter();
	// kickoutSessionControlFilter.setCacheManager(getEhCacheManager());
	// kickoutSessionControlFilter
	// .setSessionManager(getDefaultWebSessionManager());
	// /* 踢出前者 */
	// kickoutSessionControlFilter.setKickoutAfter(false);
	// kickoutSessionControlFilter.setMaxSession(1);
	// kickoutSessionControlFilter.setKickoutUrl("/login.html?kickout=1");
	// return kickoutSessionControlFilter;
	// }

	/*
	 * @Bean(name = "myAuthcFilter") public CaptchaFormAuthenticationFilter
	 * getMyAuthcFilter() { CaptchaFormAuthenticationFilter myAuthcFilter = new
	 * CaptchaFormAuthenticationFilter(); return myAuthcFilter; }
	 */

	/*
	 * @Bean(name="logoutFilter") public LogoutFilter getLogoutFilter(){
	 * LogoutFilter filter = new LogoutFilter();
	 * filter.setRedirectUrl("/login.html"); return filter; }
	 */
	/* 拦截器执行的顺序是在这里配置的顺序 */
	/*
	 * @Bean(name="pcLogoutFilter") public PCLogoutFilter getPCLogoutFilter(){
	 * PCLogoutFilter filter = new PCLogoutFilter(); return filter; }
	 */
	/*
	 * @Bean public FilterRegistrationBean getMobileLogoutFilter(){
	 * FilterRegistrationBean registrationBean = new FilterRegistrationBean();
	 * MobileLogoutFilter filter = new MobileLogoutFilter();
	 * registrationBean.setFilter(filter); List<String> urlPatterns = new
	 * ArrayList<String>(); urlPatterns.add("/user/mobileLogout");
	 * registrationBean.setUrlPatterns(urlPatterns); return registrationBean; }
	 */
}
