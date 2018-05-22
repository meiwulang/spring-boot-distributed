package com.jdy.b2b.api.common;

import java.util.HashMap;
import java.util.Map;

/**
 * @Description 封装返回结果
 * @author 王斌
 * @date 2017年7月3日 下午12:08:36
 * @version V1.0
 */
public abstract class ResponseBeanUtil {
	private final static String CODE = "code";
	private final static String MESSAGE = "message";
	private final static String SUCCESS_CODE = "0";
	private final static String SUCCESS_MESSAGE = "成功";
	private final static String FAIL_MESSAGE = "失败";
	private final static String FAIL_CODE = "-1";

	public static Map<String, Object> genEmptyResult() {
		return new HashMap<String, Object>();
	}

	public static Map<String, Object> setErrorResult(Map<String, Object> result,
			String errorNo) {
		result.put(CODE, errorNo);
		return result;
	}

	public static Map<String, Object> setErrorResult(Map<String, Object> result,
			String errorNo, String errorInfo) {
		result.put(CODE, errorNo);
		result.put(MESSAGE, errorInfo);
		return result;
	}

	public static Map<String, Object> genErrorResult() {
		return genErrorResult(FAIL_CODE, FAIL_MESSAGE);
	}

	public static Map<String, Object> genErrorResult(String errorNo,
			String errorInfo) {
		Map<String, Object> result = genEmptyResult();
		result.put(CODE, errorNo);
		result.put(MESSAGE, errorInfo);
		return result;
	}

	public static Map<String, Object> setSuccessResult(
			Map<String, Object> result, String errorInfo) {
		return setErrorResult(result, SUCCESS_CODE, SUCCESS_MESSAGE);
	}

	public static Map<String, Object> genSuccessResult() {
		return genErrorResult(SUCCESS_CODE, SUCCESS_MESSAGE);
	}

	public static Map<String, Object> setSuccessResult(
			Map<String, Object> result) {
		result.put(SUCCESS_CODE, SUCCESS_MESSAGE);
		return result;
	}

}
