package com.jdy.b2b.api.aop;

import com.jdy.b2b.api.common.BaseVO;
import com.jdy.b2b.api.common.ThreadLocalUtil;
import org.apache.commons.lang3.reflect.FieldUtils;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import java.util.Collection;
import java.util.Date;
import java.util.Iterator;

import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;

/**
 * @Description 设置传入mapper的待保存对象的create, update字段信息
 * @Author yyf
 * @DateTime 2017/7/17 17:10
 */
@Aspect
@Configuration
public class MapperCreateAndUpdateInfoSetterAOP {

    protected final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final static String INSERT = "insert";

    //定义切入点
    @Pointcut("execution(* com.jdy.b2b.api.dao..*Mapper*.*update*(..)) " +
            "|| execution(* com.jdy.b2b.api.dao..*Mapper*.*Update*(..))" +
            "|| execution(* com.jdy.b2b.api.dao..*Mapper*.*insert*(..))" +
            "|| execution(* com.jdy.b2b.api.dao..*Mapper*.*Insert*(..))" +
            "|| execution(* com.jdy.b2b.api.dao..*Mapper*.*save*(..))" +
            "|| execution(* com.jdy.b2b.api.dao..*Mapper*.*Save*(..))")
    private void allMethod() {
    }

    //针对指定的切入点表达式选择的切入点应用前置通知
    @Before("allMethod()")
    public void before(JoinPoint call) {
        String methodName = call.getSignature().getName();
        dealFun(call, methodName);
    }

    private void dealFun(JoinPoint call, String methodName) {
        Object[] args = call.getArgs();
        for (Object arg : args) {
            if (arg != null) {
                if (arg instanceof Collection) {
                    Iterator it = ((Collection) arg).iterator();
                    while (it.hasNext()) {
                        setupFields(it.next(), methodName);
                    }
                } else {
                    setupFields(arg, methodName);
                }
            }
        }
    }

    /**
     * 如果是insert方法，设置createTime、createUser字段
     * 如果是update方法，设置updateTime、updateUser字段
     */
    private void setupFields(Object arg, String methodName) {
        try {
            Object time = FieldUtils.readField(arg, containsIgnoreCase(methodName, INSERT) ? "createTime" : "updateTime", true);
            if (time == null) {
                FieldUtils.writeField(arg, containsIgnoreCase(methodName, INSERT) ? "createTime" : "updateTime", new Date(), true);
            }
        } catch (Exception e) {
            logger.info("AOP 设置 {%s} time、user未成功!", methodName);
        }
        try {
            Object user = FieldUtils.readField(arg, containsIgnoreCase(methodName, INSERT) ? "createUser" : "updateUser", true);
            if (user == null) {
                BaseVO baseUserInfo = (BaseVO) ThreadLocalUtil.getData(SetUserIdToThreadLocalAOP.tl);
                if (baseUserInfo != null && baseUserInfo.getPuserId() != null) {
                    FieldUtils.writeField(arg, containsIgnoreCase(methodName, INSERT) ? "createUser" : "updateUser", baseUserInfo.getPuserId(), true);
                }
            }
        } catch (Exception e) {
            logger.info("AOP 设置 {%s} time、user未成功!", methodName);
        }
    }

}
