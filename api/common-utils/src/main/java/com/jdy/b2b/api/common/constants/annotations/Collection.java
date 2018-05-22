package com.jdy.b2b.api.common.constants.annotations;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

@Documented
@Retention(RUNTIME)
@Target(FIELD)
/**
 * @Description 集合校验
 * @author 王斌
 * @date 2017年7月17日 下午3:59:27
 * @version V1.0
 */
@Constraint(validatedBy = {})
public @interface Collection {
	Class<?>[] groups() default {};

	String message() default "";

	Class<?>[] value() default {};

	Class<? extends Payload>[] payload() default {};

	String errorCode() default "-1";

}
