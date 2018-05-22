package com.jdy.b2b.web.aop;

import java.lang.reflect.Method;
import java.util.Date;
import java.util.Objects;

import javax.servlet.http.HttpServletRequest;

import com.jdy.b2b.web.util.UserCacheBean;
import org.apache.commons.lang.ArrayUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.apache.shiro.subject.Subject;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.jdy.b2b.web.pojo.log.BusiLogLevel;
import com.jdy.b2b.web.pojo.log.BusiLogs;
import com.jdy.b2b.web.pojo.log.MyLog;
import com.jdy.b2b.web.pojo.log.OperationTypeEnum;
import com.jdy.b2b.web.pojo.user.UserResultDTO;
import com.jdy.b2b.web.service.BusiLogsService;
import com.jdy.b2b.web.util.ResultBean;

import eu.bitwalker.useragentutils.UserAgent;

/**
 * Created by dugq on 2017/7/12.
 */
@Aspect
@Configuration
public class MyLogAop {
	protected static final Logger logger = LoggerFactory
			.getLogger(MyLogAop.class);
	@Autowired
	BusiLogsService busiLogsService;

	@Autowired
	@Qualifier("shiroEhcacheManager")
	private EhCacheManager ehCacheManager;

	@Pointcut("execution(public * com.jdy.b2b.web.controll..*.*(..))")
	public void asyncSaveLog() {
	}

	@Around("asyncSaveLog()")
	public Object doSave(ProceedingJoinPoint point) throws Throwable {
		Method method = ((MethodSignature) point.getSignature()).getMethod();
		MyLog myLog = method.getDeclaredAnnotation(MyLog.class);
		if (Objects.isNull(myLog)) {
			return point.proceed();
		}
		ResultBean result = null;
		Object proceed = null;
		try {
			proceed = point.proceed();
			if (proceed instanceof ResultBean) {
				result = (ResultBean) proceed;
			} else {
				String errorMessage = getErrorMessage(point);
				if (StringUtils.isEmpty(errorMessage)) {
					result = new ResultBean("0", "操作成功");
				} else {
					result = new ResultBean("-1", errorMessage.substring(0,errorMessage.length()>150?150:errorMessage.length()));
				}
			}
			return proceed;
		} catch (Throwable e) {
			result = new ResultBean(myLog.ErrorCode(), myLog.ErrorInfo());
			throw e;
		} finally {
			if (Objects.isNull(result.getCode()) ||  BusiLogLevel.isStore(result.getCode())) {
				buildLogAndStoreInDB(point, method, myLog, result);
			}
		}
	}

	private String getErrorMessage(ProceedingJoinPoint point) {
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder
				.getRequestAttributes()).getRequest();
		String error = (String) request.getAttribute("error");
		if (!StringUtils.isEmpty(error)) {
			return error;
		}
		Object[] args = point.getArgs();
		for (int i = 0; i < args.length; i++) {
			Class<?> aClass = args[i].getClass();
			if (Model.class.isAssignableFrom(aClass)) {
				Model model = (Model) args[i];
				if (model.containsAttribute("error")) {
					return (String) model.asMap().get("error");
				}
			}
		}
		return null;
	}

	private void buildLogAndStoreInDB(ProceedingJoinPoint point, Method method,
			MyLog myLog, ResultBean result) {
		BusiLogs log = buildBasicLogWithClientInfo();
		BusiLogs[] logs = setOtherInfo2Log(myLog, point, method, result, log);
		asyncSaveLog(logs);
	}

	private BusiLogs buildBasicLogWithClientInfo() {
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder
				.getRequestAttributes()).getRequest();
		BusiLogs log = new BusiLogs();
		/* 设置用户信息 */

		Cache<Object, Object> cache = ehCacheManager.getCache("currentUserCache");
		Subject subject = SecurityUtils.getSubject();
		Object obj = subject.getPrincipal();
		if (obj != null && obj instanceof UserResultDTO) {
			UserResultDTO user = (UserResultDTO) obj;
			log.setBlUsername("暂无");
			log.setBlAccount(StringUtils.isEmpty(user.getuAccount())
					? "该用户用户名为空" : user.getuAccount());
			log.setCreateUser(user.getUserId());
			log.setBlCompany(StringUtils.isEmpty(user.getcName()) ? "该用户没有单位信息"
					: user.getcName());
		} else {
			log.setBlUsername("暂无");
			log.setBlAccount("用户未登陆");
			log.setBlCompany("用户未登陆");
			log.setCreateUser((long) 0);
		}

		/* 设置ip */
		String remoteAddr = getIpAddr(request);
		log.setBlIp(remoteAddr);

		/* 设置浏览器 */
		String header = request.getHeader("User-Agent");
		UserAgent userAgent = UserAgent.parseUserAgentString(header);
		log.setBlBrowser(userAgent.getBrowser().getName() + "/"
				+ userAgent.getBrowser().getVersion(header));

		/* 设置域名 */
		String contextPath = request.getServerName();
		log.setBlDomain(contextPath);
		return log;
	}

	private String getIpAddr(HttpServletRequest request) {
		String ip = request.getHeader("x-forwarded-for");
		if (ip != null && ip.length() != 0 && !"unknown".equalsIgnoreCase(ip)) {
			// 多次反向代理后会有多个ip值，第一个ip才是真实ip
			if (ip.indexOf(",") != -1) {
				ip = ip.split(",")[0];
			}
		}
		if (isInvalidIp(ip)) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (isInvalidIp(ip)) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (isInvalidIp(ip)) {
			ip = request.getHeader("HTTP_CLIENT_IP");
		}
		if (isInvalidIp(ip)) {
			ip = request.getHeader("HTTP_X_FORWARDED_FOR");
		}
		if (isInvalidIp(ip)) {
			ip = request.getHeader("X-Real-IP");
		}
		if (isInvalidIp(ip)) {
			ip = request.getRemoteAddr();
		}
		request.getLocalAddr();
		return ip;
	}

	private boolean isInvalidIp(String ip) {
		return ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)
				|| "0:0:0:0:0:0:0:1".equalsIgnoreCase(ip);
	}

	private BusiLogs[] setOtherInfo2Log(MyLog myLog, ProceedingJoinPoint point,
			Method method, ResultBean result, BusiLogs log) {

		// 设置pid，由于是关联外键不可为空，所以为空了，就说明出问题了
		OperationTypeEnum operationTypeEnum = OperationTypeEnum.ofValue(myLog,
				method);
		Long[] id = operationTypeEnum.getId(myLog, point, method, result);

		String methodName = method.getName();
		log.setBlMethod(methodName);

		/* 设置模块 */
		if (StringUtils.isEmpty(myLog.Module())) {
			String controllerName = point.getTarget().getClass()
					.getSimpleName();
			controllerName = controllerName.substring(0,
					controllerName.indexOf("Controller"));
			log.setBlModule(controllerName);
		} else {
			log.setBlModule(myLog.Module());
		}

		/* 设置日期 */
		Date now = new Date();
		log.setCreateTime(now);

		/* 设置表述 */
		if (result.isSuccess() || Objects.equals(result.getCode(), myLog.SuccessCode())) {
			String blDescription = myLog.SuccessInfo();
			if (StringUtils.isEmpty(blDescription)) {
				String successInfo = StringUtils.isEmpty(result.getMessage())
						? "成功" : result.getMessage();
				blDescription = log.getBlModule() + operationTypeEnum.toString()
						+ successInfo;
			}
			log.setBlDescription(blDescription);
		} else if (result.isFail() || Objects.equals(result.getCode(), myLog.ErrorCode())) {
			String blDescription = myLog.ErrorInfo();
			if (StringUtils.isEmpty(blDescription)) {
				String errorInfo = StringUtils.isEmpty(result.getMessage())
						? "失败" : result.getMessage();
				blDescription = log.getBlModule() + operationTypeEnum.toString()
						+ errorInfo;
			}
			log.setBlDescription(blDescription.substring(0,blDescription.length()>150?150:blDescription.length()));
		}
		BusiLogs[] logs;
		if (ArrayUtils.isEmpty(id)) {
			if (Objects.equals(result.getCode(), myLog.ErrorCode())
					&& operationTypeEnum.equals(OperationTypeEnum.SAVE)) {
				log.setBlPid((long) 0);
				logs = new BusiLogs[] { log };
			} else {
				logger.error("pid 为空");
				return null;
			}
		} else {
			logs = new BusiLogs[id.length];
			for (int i = 0; i < id.length; i++) {
				logs[i] = log.copy(id[i]);
			}
			log = null;
		}
		return logs;
	}

	private void asyncSaveLog(BusiLogs[] log) {
		if (!Objects.isNull(log)) {
			busiLogsService.add(log);
		} else {
			logger.error("日志生成失败。。。");
		}
	}

}
