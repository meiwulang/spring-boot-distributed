package com.jdy.b2b.api.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.BeanFactoryAware;
import org.springframework.stereotype.Service;

/**
 * spring容器工具类
 * @author chris
 * @since Apr 27.18
 */
@Service
public class SpringUtils implements BeanFactoryAware {
	static Logger log = LoggerFactory.getLogger(SpringUtils.class);

	private static BeanFactory beanFactory;

	/**
	 * 通过bean的id从上下文中拿出该对象
	 */
	public static Object getBean(String beanId) {
		return beanFactory == null ? null : beanFactory.getBean(beanId);
	}

	/**
	 * 通过bean的id从上下文中拿出该对象
	 */
	public static <T> T getBean(Class<T> clazz, String beanId) {
		return beanFactory == null ? null : clazz.cast(beanFactory.getBean(beanId));
	}

	/**
	 * 通过bean的type从上下文中拿出该对象
	 */
	public static <T> T getBean(Class<T> clazz) {
		return beanFactory == null ? null : beanFactory.getBean(clazz);
	}

	public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
		SpringUtils.beanFactory = beanFactory;
		log.info("Bean Factory has been saved in a static variable SpringUtils !");
	}
}