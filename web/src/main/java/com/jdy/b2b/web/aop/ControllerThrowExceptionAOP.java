package com.jdy.b2b.web.aop;

import com.jdy.b2b.web.util.ThreadLocalUtil;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.context.annotation.Configuration;

@Aspect
@Configuration
public class ControllerThrowExceptionAOP {
    public static final ThreadLocal CONTROLLER_EXCEPTION_THROW_KEY = new ThreadLocal();

    @Pointcut("execution(public * com.jdy.b2b.web.controll..*.*(..))")
    public void method() {
    }

    /**
     * 把controller层的参数保留到threadlocal，提供给后面统一异常处理
     */
    @Before("method()")
    public void test(JoinPoint joinPoint) throws Throwable {
        Object[] args = joinPoint.getArgs();
        if (args != null && args.length > 0) {
            ThreadLocalUtil.setData(CONTROLLER_EXCEPTION_THROW_KEY, args);
        }
    }
}
