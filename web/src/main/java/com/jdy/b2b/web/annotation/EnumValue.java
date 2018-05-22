package com.jdy.b2b.web.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

import javax.validation.Constraint;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.Payload;

import com.jdy.b2b.web.annotation.EnumValue.LocalEnumValidator;
import com.jdy.b2b.web.util.EnumUtil;

@Target({ ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER,
		ElementType.ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(validatedBy = { LocalEnumValidator.class })
public @interface EnumValue {

	Class<?>[] groups() default {};

	String message() default "当前值不在候选值中";

	Class<? extends Payload>[] payload() default {};

	String errorCode() default "-1";

	/**
	 * 可选值枚举
	 * 
	 * @return
	 */
	String[] enums() default {};

	/**
	 * 可选值枚举类
	 * 
	 * @return
	 */
	Class<? extends Enum<?>> enumClass() default Thread.State.class;

	class LocalEnumValidator implements ConstraintValidator<EnumValue, Object> {

		private Set<String> cadidators;

		private String stringDelimiter;

		private String messageTemplate;

		private Map<String, Object> msgTmpValueMap;

		@Override
		public void initialize(EnumValue constraintAnnotation) {
			cadidators = new LinkedHashSet<String>();
			String[] enums = constraintAnnotation.enums();
			// 如果设置了enums，以enums为准
			if (null != enums && 0 != enums.length) {
				for (String enumVal : enums) {
					cadidators.add(enumVal);
				}
			} else {
				// 查看是否设置了enumClass
				Class<? extends Enum<?>> enumClass = constraintAnnotation
						.enumClass();
				if (!Thread.State.class.equals(enumClass)) {
					Collection<?> enumValues = EnumUtil.getEnumMap(enumClass)
							.keySet();
					for (Object enumValue : enumValues) {
						cadidators.add(String.valueOf(enumValue));
					}
					// FIXME 处理提示错误信息时不能显示可选枚举值的问题
				}
			}

			messageTemplate = constraintAnnotation.message();
			msgTmpValueMap = new HashMap<String, Object>();
			msgTmpValueMap.put("enums", cadidators.toString());
		}

		@SuppressWarnings("rawtypes")
		@Override
		public boolean isValid(Object value,
				ConstraintValidatorContext context) {
			// 空值直接通过，由@NotNull之类的控制
			if (null == value) {
				return true;
			}
			// 没设置候选限制，通过
			if (cadidators.isEmpty()) {
				return true;
			}

			boolean valid = true;
			if (value.getClass().isArray()) {
				Object[] array = (Object[]) value;
				// 空值直接通过，由@NotNull之类的控制
				if (0 == array.length) {
					return true;
				}
				// 如果是数组，遍历检查
				for (Object valueUnit : array) {
					// 因为cadidators为String，转化为String比较
					valueUnit = String.valueOf(valueUnit);
					if (!cadidators.contains(valueUnit)) {
						valid = false;
						break;
					}
				}
			} else if (value instanceof Collection) {
				Collection collection = (Collection) value;
				// 空值直接通过，由@NotNull之类的控制
				if (collection.isEmpty()) {
					return true;
				}
				// 如果是Collection，遍历检查
				for (Object valueUnit : collection) {
					// 因为cadidators为String，转化为String比较
					valueUnit = String.valueOf(valueUnit);
					if (!cadidators.contains(valueUnit)) {
						valid = false;
						break;
					}
				}
			} else {
				// 其他类型转化为字符串处理
				String stringValue = String.valueOf(value);

				// 空值直接通过，由@NotNull之类的控制
				if (stringValue.isEmpty()) {
					return true;
				}
				// 没设置分割符，直接检查
				valid = cadidators.contains(stringValue);
			}

			if (!valid) {
				context.disableDefaultConstraintViolation();
				String message = messageTemplate + msgTmpValueMap.get("enums");
				context.buildConstraintViolationWithTemplate(message)
						.addConstraintViolation();
			}

			return valid;
		}

		public boolean isNotEmpty(CharSequence cs) {
			return cs == null || cs.length() == 0;
		}
	}
}