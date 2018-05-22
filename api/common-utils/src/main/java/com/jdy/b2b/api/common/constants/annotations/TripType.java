package com.jdy.b2b.api.common.constants.annotations;

/**
 * @Description 行程类型
 * @author 王斌
 * @date 2017年7月21日 上午11:23:11
 * @version V1.0
 */
public enum TripType {

	/**
	 * 默认行程
	 */
	DEFAULT(0),

	/**
	 * 补充行程
	 */
	EXTRA(1),

	;

	private final Integer val;

	private TripType(Integer val) {
		this.val = val;
	}

	public Integer getVal() {
		return val;
	}

}
