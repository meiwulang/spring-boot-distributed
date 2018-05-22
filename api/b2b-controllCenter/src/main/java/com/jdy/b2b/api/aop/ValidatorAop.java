package com.jdy.b2b.api.aop;

import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.Validator;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.CollectionUtils;

@Aspect
@Configuration
public class ValidatorAop {
	@Autowired
	Validator validator;

	@Pointcut("execution(public * com.jdy.b2b.api.controller.TripController.*(..))")
	public void validate() {
	}

	@Before("validate()")
	public void validating(JoinPoint point) throws Throwable {
		Object[] args = point.getArgs();
		Method method = ((MethodSignature) point.getSignature()).getMethod();
		Parameter[] parameters = method.getParameters();
		for (int i = 0; i < parameters.length; i++) {
			Parameter parameter = parameters[i];
			Object value = args[i];
			com.jdy.b2b.api.common.constants.annotations.Collection annotation = parameter
					.getAnnotation(
							com.jdy.b2b.api.common.constants.annotations.Collection.class);
			if (!Objects.isNull(annotation)) {
				ValidatorByType(args, i, value, annotation);
			}
		}
	}

	private void ValidatorByType(Object[] args, int i, Object value,
			com.jdy.b2b.api.common.constants.annotations.Collection annotation) {
		if (Map.class.isAssignableFrom(value.getClass())) {
			Map<Object, Object> newValue = (Map<Object, Object>) value;
			for (Map.Entry<Object, Object> entry : newValue.entrySet()) {
				Object value1 = entry.getValue();
				if (!value1.getClass().isPrimitive()
						&& !(value1 instanceof String)) {
					validatedUseHibernateValidator(value1, annotation);
				}
			}
		} else if (Collection.class.isAssignableFrom(value.getClass())) {
			Collection newValue = (Collection) value;
			Iterator iterator = newValue.iterator();
			while (iterator.hasNext()) {
				validatedUseHibernateValidator(iterator.next(), annotation);
			}
		} else {
			validatedUseHibernateValidator(args[i], annotation);
		}
	}

	private void validatedUseHibernateValidator(Object value,
			com.jdy.b2b.api.common.constants.annotations.Collection annotation) {
		Set<ConstraintViolation<Object>> validate = validator.validate(value,
				annotation.value());
		if (!CollectionUtils.isEmpty(validate)) {
			throw new ConstraintViolationException(validate);
		}
	}

}