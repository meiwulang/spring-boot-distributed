package com.jdy.b2b.web.aop;

import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.jdy.b2b.web.util.ResultBean;

/**
 * @Description 操作失败都记录到日志中
 * @Author yyf
 * @DateTime 2017/10/27 16:48
 */
@Aspect
@Component
public class LogErrorAOP {

	final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Pointcut("execution(public * com.jdy.b2b.web.controll..*.*(..)) && !execution(* com.jdy.b2b.web.controll.city.CityController.*(..))")
	public void method() {
	}

	@AfterReturning(returning = "ret", pointcut = "method()")
	public void doAfterReturning(Object ret) throws Throwable {
		if (ret != null && ret instanceof ResultBean) {
			ResultBean bean = (ResultBean) ret;
			if (bean.isFail()) {
				logger.error(JSON.toJSONString(bean));
			}
		}
//		logger.info("RESPONSE : " + ret);
	}
}
