package com.jdy.b2b.web.pojo.product;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @Description 产品vo
 * @author 王斌
 * @date 2017年7月3日 下午5:48:23
 * @version V1.0
 */
@ApiModel
public class FrontProductVO {
	@ApiModelProperty(value = "来源")
	private String source;
	@ApiModelProperty(value = "城市编码")
	private String city_code;
	@ApiModelProperty(value = "产品类型编号")
	private String type;
	@ApiModelProperty(value = "省")
	private String province;
	@ApiModelProperty(value = "目的地")
	private String destination;
	@ApiModelProperty(value = "行程天数")
	private Long days;
	@ApiModelProperty(value = "属性", hidden = true)
	private String attribute;
	@ApiModelProperty(value = "行程景点")
	private String scenic;
	@ApiModelProperty(value = "产品所属公司名")
	private String business;
	@ApiModelProperty(value = "关键词", hidden = true)
	private String key;
	@ApiModelProperty(value = "查询开始值,非负整数")
	private String start;
	@ApiModelProperty(value = "查询总条数,非负整数")
	private Integer limit;
	@ApiModelProperty(value = "出发日期，格式：YYYYMMDD[,YYYYMMDD]。括号内的为可选值，表示截至时间.示例：\"20160826,20160827\"  \"20160826\"")
	private String startDate;
	@ApiModelProperty(hidden = true)
	private String endDate;

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getCity_code() {
		return city_code;
	}

	public void setCity_code(String city_code) {
		this.city_code = city_code;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getProvince() {
		return province;
	}

	public void setProvince(String province) {
		this.province = province;
	}

	public String getDestination() {
		return destination;
	}

	public void setDestination(String destination) {
		this.destination = destination;
	}

	public Long getDays() {
		return days;
	}

	public void setDays(Long days) {
		this.days = days;
	}

	public String getAttribute() {
		return attribute;
	}

	public void setAttribute(String attribute) {
		this.attribute = attribute;
	}

	public String getScenic() {
		return scenic;
	}

	public void setScenic(String scenic) {
		this.scenic = scenic;
	}

	public String getBusiness() {
		return business;
	}

	public void setBusiness(String business) {
		this.business = business;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getStart() {
		return start;
	}

	public void setStart(String start) {
		this.start = start;
	}

	public Integer getLimit() {
		return limit;
	}

	public void setLimit(Integer limit) {
		this.limit = limit;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

}
