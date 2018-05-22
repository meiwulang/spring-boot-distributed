package com.jdy.b2b.web.util.excel;

import java.lang.annotation.*;

/**
 * 导入导出源数据
 *
 * @author zhaopan
 * @date 2013年10月11日 下午2:53:18
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.FIELD })
public @interface Excel {

	String value() default "";


}
