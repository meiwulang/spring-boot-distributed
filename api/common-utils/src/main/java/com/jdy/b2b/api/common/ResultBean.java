package com.jdy.b2b.api.common;

import java.util.Arrays;

import org.springframework.util.StringUtils;

import com.alibaba.fastjson.JSON;

/**
 * Created by Administrator on 2017/3/21.
 */
public class ResultBean<T> {

	private String code;
	private String message;
	private String msg;
	private T body;
	private String url;
	private Long[] id;

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	// 前端数据
	private T data;

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}

	public Long[] getId() {
		return id;
	}

	public void setId(Long... id) {
		this.id = id;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public T getBody() {
		return body;
	}

	public void setBody(T body) {
		this.body = body;
	}

	@SuppressWarnings("rawtypes")
	public static ResultBean getSuccessResult() {
		ResultBean<String> bean = new ResultBean<>();
		bean.setCode("0");
		bean.setMessage("SUCCESS");
		bean.setBody("");
		return bean;
	}

	public static ResultBean getSuccessResultForMessage(String message) {
		ResultBean<String> bean = new ResultBean<>();
		bean.setCode("0");
		bean.setMessage(message);
		return bean;
	}

	public static ResultBean getErrorResult() {
		ResultBean<String> bean = new ResultBean<>();
		bean.setCode("-1");
		bean.setMessage("error");
		bean.setBody("系统错误，请联系管理员。");
		return bean;
	}

	public static ResultBean getErrorResult(String message) {
		ResultBean<String> bean = new ResultBean<>();
		bean.setCode("-1");
		bean.setMessage(message);
		return bean;
	}

	public static <T> ResultBean<T> getSuccessResult(T obj) {
		ResultBean<T> bean = new ResultBean<T>();
		bean.setCode("0");
		bean.setMessage("SUCCESS");
		bean.setBody(obj);
		return bean;
	}

	public static <T> ResultBean<T> getSuccessResultForLog(Long... id) {
		ResultBean<T> bean = new ResultBean<T>();
		bean.setCode("0");
		bean.setMessage("SUCCESS");
		bean.id = id;
		return bean;
	}

	public ResultBean() {
	}

	public ResultBean(String code, String message) {
		this.code = code;
		this.message = message;
	}

	public <T> T getParsedEnitity(Class<T> clazz) {
		return JSON.parseObject(JSON.toJSONString(getBody()), clazz);
	}

	public <T> T getParsedData(Class<T> clazz) {
		return JSON.parseObject(JSON.toJSONString(getData()), clazz);
	}

	public boolean isSuccess() {
		return StringUtils.isEmpty(code) || "0".equals(this.code);
	}

	public boolean isFail() {
		return !isSuccess();
	}

	private String token;

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public static <T> ResultBean<T> getIndexSuccessResult(T obj) {
		ResultBean<T> bean = new ResultBean<T>();
		bean.setCode("200");
		bean.setMessage("ok");
		bean.setData(obj);
		return bean;
	}

	public static <T> ResultBean<T> getIndexFailResult(String message) {
		ResultBean<T> bean = new ResultBean<T>();
		bean.setCode("0");
		bean.setMessage(message);
		return bean;
	}

	public static <T> ResultBean<T> getReturnResult(String code, String message,
			T obj) {
		ResultBean<T> bean = new ResultBean<T>();
		bean.setCode(code);
		bean.setMessage(message);
		bean.setBody(obj);
		return bean;
	}

	@Override
	public String toString() {
		return "ResultBean [code=" + code + ", message=" + message + ", msg="
				+ msg + ", body=" + body + ", url=" + url + ", id="
				+ Arrays.toString(id) + ", data=" + data + ", token=" + token
				+ "]";
	}

}
