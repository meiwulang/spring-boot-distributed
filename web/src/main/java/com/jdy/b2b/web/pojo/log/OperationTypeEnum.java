package com.jdy.b2b.web.pojo.log;

import com.jdy.b2b.web.pojo.user.UserResultDTO;
import com.jdy.b2b.web.util.ResultBean;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.aspectj.lang.ProceedingJoinPoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.Objects;

/**
 * Created by dugq on 2017/7/19.
 */

public enum OperationTypeEnum {
	SAVE {
		@Override
		public Long[] getId(MyLog myLog, ProceedingJoinPoint point,
				Method method, ResultBean resultBean) {
			if (StringUtils.isEmpty(myLog.Obj())) {
				return resultBean.getId();
			} else {
				Long id = findId(myLog, point, method);
				return Objects.isNull(id) ? EMPTY_ARRAY : new Long[] { id };
			}
		}

		@Override
		public String toString() {
			return "保存";
		}
	},
	UPDATE {
		@Override
		public Long[] getId(MyLog myLog, ProceedingJoinPoint point,
				Method method, ResultBean resultBean) {
			Long id = findId(myLog, point, method);
			return Objects.isNull(id) ? EMPTY_ARRAY : new Long[] { id };
		}

		@Override
		public String toString() {
			return "更新";
		}
	},
	DELETE {
		@Override
		public Long[] getId(MyLog myLog, ProceedingJoinPoint point,
				Method method, ResultBean resultBean) {
			Long id = findId(myLog, point, method);
			return Objects.isNull(id) ? EMPTY_ARRAY : new Long[] { id };
		}

		@Override
		public String toString() {
			return "删除";
		}
	},
	OTHER {
		@Override
		public Long[] getId(MyLog myLog, ProceedingJoinPoint point,
				Method method, ResultBean resultBean) {
			Long id;
			if (method.getReturnType().equals(ResultBean.class)) {
				id = findId(myLog, point, method);
			} else {
				id = findIdInRequest(myLog);
			}
			return Objects.isNull(id) ? EMPTY_ARRAY : new Long[] { id };
		}

		@Override
		public String toString() {
			return "操作";
		}
	};
	private OperationTypeEnum() {
	}

	public final static Long[] EMPTY_ARRAY = new Long[] {};

	protected static final Logger logger = LoggerFactory
			.getLogger(OperationTypeEnum.class);

	public abstract Long[] getId(MyLog myLog, ProceedingJoinPoint point,
			Method method, ResultBean resultBean);

	public static OperationTypeEnum ofValue(MyLog myLog, Method method) {
		if (!StringUtils.isEmpty(myLog.Operation())) {
			switch (myLog.Operation()) {
			case "save":
				return SAVE;
			case "update":
				return UPDATE;
			case "delete":
				return DELETE;
			default:
				return OTHER;
			}
		} else {
			String methodName = method.getName().toLowerCase();
			if (methodName.indexOf("save") != -1 || methodName.indexOf("insert") != -1) {
				return SAVE;
			} else if (methodName.indexOf("update") != -1) {
				return UPDATE;
			} else if (methodName.indexOf("delete") != -1) {
				return DELETE;
			} else {
				return OTHER;
			}
		}
	}

	private static Long findId(MyLog myLog, ProceedingJoinPoint point,
			Method method) {
		Object obj = null;
		if (StringUtils.isEmpty(myLog.Obj())) {
			if (point.getArgs().length < 1) {
				logger.error("参数为空 ");
				return null;
			}
			obj = point.getArgs()[0];
			if (!(obj instanceof Long)) {
				try {
					obj = BeanUtils.getPropertyDescriptor(obj.getClass(), "id")
							.getReadMethod().invoke(obj);
				} catch (Exception e) {
					logger.error(e.getMessage());
					logger.error("属性映射失败。。。。。。。。。。。。。。");
					return null;
				}
			}
		} else {
			Parameter[] parameters = method.getParameters();
			String[] split = myLog.Obj().split("\\.");
			for (int i = 0; i < parameters.length; i++) {
				if (parameters[0].getType().getSimpleName().equals(split[0])) {
					obj = point.getArgs()[i];
					for (int j = 1; j < split.length; j++) {
						try {
							obj = BeanUtils
									.getPropertyDescriptor(obj.getClass(),
											split[j])
									.getReadMethod().invoke(obj);
						} catch (Exception e) {
							logger.error("属性映射失败。。。。。。。。。。。。。。");
							return null;
						}
					}
					break;
				}
			}
		}
		if (obj instanceof Long) {
			return (Long) obj;
		} else {
			logger.error("找到了个错误的id");
			return null;
		}
	}

	private static Long findIdInRequest(MyLog myLog) {
		Object object = null;
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder
				.getRequestAttributes()).getRequest();
		if (StringUtils.isEmpty(myLog.Obj())) {
			Subject subject = SecurityUtils.getSubject();
			UserResultDTO user = (UserResultDTO) subject.getSession()
					.getAttribute("user");
			if (Objects.isNull(user)) {
				object = 0L;
			} else {
				object = user.getUserId();
			}
		} else {
			String[] split = myLog.Obj().split("\\.");
			object = request.getAttribute(split[0]);
			for (int i = 1; i < split.length; i++) {
				try {
					object = BeanUtils
							.getPropertyDescriptor(object.getClass(), split[i])
							.getReadMethod().invoke(object);
				} catch (Exception e) {
					logger.error(e.getMessage());
					return null;
				}
			}
		}
		if (object instanceof Long) {
			return (Long) object;
		} else {
			logger.error("找到了个错误的id 2");
			return null;
		}
	}
}