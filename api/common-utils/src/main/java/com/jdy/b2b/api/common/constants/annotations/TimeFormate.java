package com.jdy.b2b.api.common.constants.annotations;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import javax.validation.OverridesAttribute;
import javax.validation.Payload;
import javax.validation.constraints.Pattern;

@Documented
@Retention(RUNTIME)
@Target(FIELD)
/**
 * @Description 周几有效注解
 * @author 王斌
 * @date 2017年7月17日 下午3:59:27
 * @version V1.0
 */
public @interface TimeFormate {
	Class<?>[] groups() default {};

	String message() default "时间格式不对，格式如：xx:xx";

	Class<? extends Payload>[] payload() default {};

	String errorCode() default "-1";

	@OverridesAttribute(constraint = Pattern.class, name = "regexp")
	String regexp() default "^(20|21|22|23|[0-1]\\d):[0-5]\\d$";
}
