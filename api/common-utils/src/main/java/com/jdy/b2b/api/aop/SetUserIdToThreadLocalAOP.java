package com.jdy.b2b.api.aop;

import com.alibaba.fastjson.JSON;
import com.jdy.b2b.api.common.BaseVO;
import com.jdy.b2b.api.common.ThreadLocalUtil;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.context.annotation.Configuration;

/**
 * @Description 该切面用于解析web传入api的参数，如果其中含userId，account信息，则将其放入ThreadLocal，供后续业务调用。
 * @Author yyf
 * @DateTime 2017/8/21 10:16
 */
@Aspect
@Configuration
public class SetUserIdToThreadLocalAOP {
    protected final Logger logger = LoggerFactory.getLogger(this.getClass());
    public static ThreadLocal tl = new ThreadLocal();

    //定义切入点
    @Pointcut("execution(* com.jdy.b2b.api.controller.*.*(..))")
    private void allMethod() {
    }

    @Before("allMethod()")
    public void before(JoinPoint call) {
        Object[] objects = call.getArgs();
        for (Object object : objects) {
            if (object != null && object instanceof BaseVO) {
                BaseVO vo = (BaseVO) object;
                if (vo.getPuserId() != null) {
                    BaseVO baseUserInfo = new BaseVO();
                    BeanUtils.copyProperties(vo, baseUserInfo);
                    ThreadLocalUtil.setData(tl, baseUserInfo);
                    logger.info("【" + vo.getPuserId() + "】,【" + vo.getPuAccount() + "】用户信息设置到ThreadLocal成功！");
                    logger.info(call.getSignature().getName()+"接口参数："+ JSON.toJSONString(vo));
                } else {
                    logger.info("参数里puserId参数为空，用户信息设置到ThreadLocal失败！");
                }
            }
            break;
        }
    }
}
