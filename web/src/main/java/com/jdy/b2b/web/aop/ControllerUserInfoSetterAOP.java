package com.jdy.b2b.web.aop;

import java.beans.BeanInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.InvocationTargetException;
import java.util.HashSet;
import java.util.Objects;

import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.apache.shiro.subject.Subject;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.jdy.b2b.web.pojo.user.UserResultDTO;
import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.UserCacheBean;
import com.jdy.b2b.web.util.exception.NotLoginException;

/**
 * @Description 该切面用于把用户信息（如果存在的话）设置到每个controller的public 请求的参数里（如果是BaseVO的子类）
 * @Author yyf
 * @DateTime 2017/7/6 12:01
 */
@Aspect
@Configuration
public class ControllerUserInfoSetterAOP {
	@Autowired
	@Qualifier("shiroEhcacheManager")
	private EhCacheManager ehCacheManager;

	@Autowired
	private UserCacheBean userCacheBean;

	final Logger logger = LoggerFactory.getLogger(this.getClass());

	// 定义切入点
	@Pointcut("execution(* com.jdy.b2b.web.controll..*.*(..)) "
			+ "&& !execution(* com.jdy.b2b.web.controll.user.UserController.login(..)) "
			+ "&& !execution(* com.jdy.b2b.web.controll.user.UserController.changeNotify(..)) "
			+ "&& !execution(* com.jdy.b2b.web.controll.orderOffline.OrderOfflineController.saveOrderOffline(..)) "
			+ "&& !execution(* com.jdy.b2b.web.controll.frontAPIs.WechatInfoController.*(..)) "
			+ "&& !execution(* com.jdy.b2b.web.controll.user.UserController.mobileLogin(..)) "
			+ "&& !execution(* com.jdy.b2b.web.controll.user.UserController.visitorRegister(..)) "
			+ "&& !execution(* com.jdy.b2b.web.controll.user.UserController.syncUser(..)) "
			+ "&& !execution(* com.jdy.b2b.web.controll.department.DepartmentController.syncDepartment(..)) "
			+ "&& !execution(* com.jdy.b2b.web.controll.company.CompanyController.syncCompanyAll(..))"
			+ "&& !execution(* com.jdy.b2b.web.controll.frontAPIs.*.*(..))"
			+ "&& !execution(* com.jdy.b2b.web.controll.electroniccontract.ElectronicContractController.customerSignContractCallback(..)) "
			+ "&& !execution(* com.jdy.b2b.web.controll.electroniccontract.ElectronicContractController.queryContractViewAndDownloadUrlByOrderNo(..)) "
			+ "&& !execution(* com.jdy.b2b.web.controll.require.RequireController.queryProjectDetail(..)) "
			+ "&& !execution(* com.jdy.b2b.web.controll.user.UserController.singlePointLoginValidateSuccess(..))")

	private void allMethod() {
	}

	// 针对指定的切入点表达式选择的切入点应用前置通知
	@Before("allMethod()")
	public void before(JoinPoint call) throws IllegalAccessException, NoSuchMethodException, InvocationTargetException {

		ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder
				.getRequestAttributes();
		HttpServletRequest request = requestAttributes.getRequest();
		String uri = request.getRequestURI();
		if ("/orderSync/save".contains(uri)) {
			return;
		}

		Subject subject = SecurityUtils.getSubject();
		Cache<Object, Object> cache = ehCacheManager.getCache("currentUserCache");
		if (cache == null || subject == null) {
			logger.error("cache是否为空: " + cache);
			logger.error("subject是否为空: " + subject);
		}
		UserResultDTO user = (UserResultDTO) subject.getPrincipal();
		// 获取到用户信息,就set到vo里面
		if (subject != null && user != null) {
			Object[] objects = call.getArgs();
			for (Object object : objects) {
				if (object != null && object instanceof BaseVO) {
					BaseVO vo = (BaseVO) object;
					vo.setPuserId(user.getUserId());
					vo.setPuAccount(user.getuAccount());
					vo.setPcompanyId(user.getuCompanyId());
					vo.setpStype(user.getuStype());
					vo.setPuTel(user.getuTel());
					vo.setPuDepartmentId(user.getuDepartmentId());
					vo.setPcName(user.getcName());
					vo.setPcType(user.getcType());
					vo.setPdName(user.getdName());
					vo.setpURealName(user.getuRealName());
					vo.setPuDataLimit(user.getuDataLimit());
					vo.setpRoleId(user.getuRoleId());
					if (RequestMapping.REQUEST_MAPPINGS.contains(uri) && !Objects.equals(user.getcType(), 2)) {
						setCompanyId(user, vo);
					}
					break;
				}
			}
		} else {
			if (subject.isAuthenticated()) {
				userCacheBean.clearAll((String) subject.getPrincipal());
				// throw异常,让切面返回resultBean,前端跳转登录页面@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
				// 跳转页面
				System.out.println(subject.isAuthenticated());
				throw new NotLoginException("未取到cache,清空认证授权,跳转登录页面!");
			} else {
				throw new NotLoginException("未取到cache,清空认证授权,跳转登录页面!");
			}
		}
	}

	/**
	 * @param user
	 * @param vo
	 * @Description: 处理公司编号信息
	 * @author 王斌
	 * @date 2017年8月9日 下午3:50:22
	 */
	private void setCompanyId(UserResultDTO user, BaseVO vo) {
		BeanInfo beanInfo;
		try {
			beanInfo = Introspector.getBeanInfo(vo.getClass());
			PropertyDescriptor[] propertyDescriptors = beanInfo.getPropertyDescriptors();
			for (PropertyDescriptor propertyDescriptor : propertyDescriptors) {
				try {
					String name = propertyDescriptor.getName();
					if (name.contains("CompanyId") || name.contains("companyId")) {
						propertyDescriptor.getWriteMethod().invoke(vo, user.getuCompanyId());
					}
				} catch (IllegalAccessException | IllegalArgumentException | InvocationTargetException e) {
					e.printStackTrace();
				}
			}
		} catch (IntrospectionException e) {
			e.printStackTrace();
		}
	}
}

/**
 * @Description 需要处理companyId的接口
 * @author 王斌
 * @date 2017年9月11日 下午7:27:09
 * @version V1.0
 */
class RequestMapping {
	static HashSet<String> REQUEST_MAPPINGS = new HashSet<>();
	static {
		REQUEST_MAPPINGS.add("/product/save");
		REQUEST_MAPPINGS.add("/product/update");
		REQUEST_MAPPINGS.add("/product/uneffect");
		REQUEST_MAPPINGS.add("/product/effect");
		REQUEST_MAPPINGS.add("/product/updateConfirm");
		REQUEST_MAPPINGS.add("/product/updateRecommend");
		REQUEST_MAPPINGS.add("/departure/save");
		REQUEST_MAPPINGS.add("/departure/update");
		REQUEST_MAPPINGS.add("/departure/del");
		REQUEST_MAPPINGS.add("/shuttle_bus/save");
		REQUEST_MAPPINGS.add("/shuttle_bus/update");
		REQUEST_MAPPINGS.add("/shuttle_bus/del");
		REQUEST_MAPPINGS.add("/attach/update");
		REQUEST_MAPPINGS.add("/attach/save");
		REQUEST_MAPPINGS.add("/attach/delete");
		REQUEST_MAPPINGS.add("/attach/batchDelete");
		REQUEST_MAPPINGS.add("/album/save");
		REQUEST_MAPPINGS.add("/album/update");
		REQUEST_MAPPINGS.add("/album/delete");
		REQUEST_MAPPINGS.add("/productKey/saveNewKey");
		REQUEST_MAPPINGS.add("/productKey/deleteKey");
		REQUEST_MAPPINGS.add("/productKey/deleteProductKeyRelation");
		REQUEST_MAPPINGS.add("/productKey/saveProductKeyRelation");
		REQUEST_MAPPINGS.add("/productKey/batchSaveProductKeyRelation");
		REQUEST_MAPPINGS.add("/productKey/updateKey");
		REQUEST_MAPPINGS.add("/productRecommend/list");
		REQUEST_MAPPINGS.add("/departure/start_site_group");
		REQUEST_MAPPINGS.add("/productKey/selectKeyListByCompanyId");
		REQUEST_MAPPINGS.add("/productKey/newKeywordForm");
	}
}
