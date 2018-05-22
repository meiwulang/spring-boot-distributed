package com.jdy.b2b.web.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.context.annotation.Configuration;

@Aspect
@Configuration
public class NoLoginAOP {

    @Pointcut("execution(public * com.jdy.b2b.web.controll..*.*(..))")
    public void method() {
    }

    /**
     *
     */
    @Before("method()")
    public void test(JoinPoint joinPoint) throws Throwable {

    }
}
