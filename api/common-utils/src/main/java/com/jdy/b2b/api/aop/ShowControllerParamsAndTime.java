package com.jdy.b2b.api.aop;

import com.alibaba.fastjson.JSON;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by dugq on 2017/7/5.
 */
@Aspect
@Configuration
public class ShowControllerParamsAndTime {
    private final Logger LOG = LoggerFactory.getLogger(this.getClass());

    @Pointcut("execution(public * com.jdy..b2b.api.controller..*.*(..))")
    public void ShowTime() {
    }

    @Around("ShowTime()")
    public Object test(ProceedingJoinPoint thisJoinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        Object[] args = thisJoinPoint.getArgs();
        MethodSignature methodSignature = (MethodSignature)thisJoinPoint.getSignature();
        String[] parameterNames = methodSignature.getParameterNames();
        Map map = new HashMap();
        if(parameterNames.length==args.length){
            for (int i = 0 ; i < parameterNames.length; i++){
                map.put(parameterNames[i],args[i]);
            }
        }
        LOG.info(thisJoinPoint.getTarget().getClass().getName() + "." + thisJoinPoint.getSignature().getName()+"参数列表：" + JSON.toJSONString(map));
        Object proceed = thisJoinPoint.proceed();
        long end = System.currentTimeMillis();
        long message = end - start;
        LOG.info("接口：：：" + thisJoinPoint.getTarget().getClass().getName() + "." + thisJoinPoint.getSignature().getName() + "耗时=============" + message);
        return proceed;
    }
}
