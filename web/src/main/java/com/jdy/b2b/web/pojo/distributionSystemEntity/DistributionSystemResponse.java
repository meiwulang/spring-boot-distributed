package com.jdy.b2b.web.pojo.distributionSystemEntity;

/**
 * Created by dugq on 2018/3/23.
 */
public class DistributionSystemResponse<T> {
	int code;
	String msg;
	T data;

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}

	@Override
	public String toString() {
		return "DistributionSystemResponse {\"code\":\"" + code
				+ "\", \"msg\":\"" + msg + "\", \"data\":\"" + data + "\"}";
	}

}
