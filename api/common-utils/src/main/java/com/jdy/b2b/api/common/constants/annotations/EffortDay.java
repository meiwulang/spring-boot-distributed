package com.jdy.b2b.api.common.constants.annotations;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.OverridesAttribute;
import javax.validation.Payload;
import javax.validation.constraints.Pattern;

import com.jdy.b2b.api.common.constants.annotations.EffortDay.ValidStringChecker;

@Documented
@Retention(RUNTIME)
@Target(FIELD)
/**
 * @Description 周几有效注解
 * @author 王斌
 * @date 2017年7月17日 下午3:59:27
 * @version V1.0
 */
@Constraint(validatedBy = { ValidStringChecker.class })
public @interface EffortDay {
	Class<?>[] groups() default {};

	String message() default "有效日期格式不对";

	Class<? extends Payload>[] payload() default {};

	String errorCode() default "-1";

	@OverridesAttribute(constraint = Pattern.class, name = "regexp")
	String regexp() default "^([01]{7})$";

	class ValidStringChecker implements ConstraintValidator<EffortDay, String> {

		@Override
		public void initialize(EffortDay arg0) {
		}

		@Override
		public boolean isValid(String value,
				ConstraintValidatorContext context) {
			return java.util.regex.Pattern.matches("^([01]{7})$", value);
		}

	}
}
