package com.jdy.b2b.web.aop;

import java.lang.reflect.Field;

import javax.validation.ValidationException;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.Constants;

/**
 * Created by yangcheng on 2017/8/4.
 */
@Aspect
@Configuration
public class TicketSaveAOP {
	final Logger logger = LoggerFactory.getLogger(TicketSaveAOP.class);

	@Pointcut("execution(public * com.jdy.b2b.web.controll.ticket.TicketController.saveTicket(..))")
	public void validate() {
	}

	@Before("validate()")
	public void bindValidate(JoinPoint point)
			throws NoSuchFieldException, IllegalAccessException {
		Object[] objs = point.getArgs();
		if (objs != null && objs.length > 0) {
			for (Object obj : objs) {
				if (obj instanceof BaseVO) {

					// 获取到tTicketType的值
					Field tTicketType = obj.getClass()
							.getDeclaredField("tTicketType");
					Field tType = obj.getClass().getDeclaredField("tType");
					Field tTraffic = obj.getClass()
							.getDeclaredField("tTraffic");

					tTicketType.setAccessible(true);
					tType.setAccessible(true);
					tTraffic.setAccessible(true);

					Integer ticketType = (Integer) tTicketType.get(obj);
					Integer type = (Integer) tType.get(obj);
					Integer traffic = (Integer) tTraffic.get(obj);

					if (ticketType.equals(Constants.TICKET_SINGLE_YES)) {
						if (type == null) {
							throw new ValidationException(
									"保存单票时,交通类型和票价类型不能为空!!!");
						}
					}
					return;
				}
			}
		}
	}

}
