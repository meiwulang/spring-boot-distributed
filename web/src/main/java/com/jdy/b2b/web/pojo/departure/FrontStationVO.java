package com.jdy.b2b.web.pojo.departure;

import io.swagger.annotations.ApiModelProperty;

/**
 * @Description 接送站点vo
 * @author 王斌
 * @date 2017年7月3日 下午5:48:23
 * @version V1.0
 */
public class FrontStationVO {
	@ApiModelProperty(value = "票编号")
	private String t_id;
	@ApiModelProperty(value = "产品编号")
	private Long p_id;
	@ApiModelProperty(value = "来源")
	private String source;
	@ApiModelProperty(value = "出发日期，格式：YYYYMMDD[,YYYYMMDD]。括号内的为可选值，表示截至时间.示例：\"20160826,20160827\"  \"20160826\"")
	private String start_date;
	@ApiModelProperty(hidden = true)
	private String end_date;
	@ApiModelProperty(hidden = true)
	private String start_time;
	@ApiModelProperty(value = "查询条数，非负整数")
	private int limit = 999;
	@ApiModelProperty(value = "开始值，非负整数")
	private int start = 0;
	@ApiModelProperty(value = "班期编号")
	private Long bl_id;

	public Long getBl_id() {
		return bl_id;
	}

	public void setBl_id(Long bl_id) {
		this.bl_id = bl_id;
	}

	public String getT_id() {
		return t_id;
	}

	public void setT_id(String t_id) {
		this.t_id = t_id;
	}

	public Long getP_id() {
		return p_id;
	}

	public void setP_id(Long p_id) {
		this.p_id = p_id;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getStart_date() {
		return start_date;
	}

	public void setStart_date(String start_date) {
		this.start_date = start_date;
	}

	public String getEnd_date() {
		return end_date;
	}

	public void setEnd_date(String end_date) {
		this.end_date = end_date;
	}

	public String getStart_time() {
		return start_time;
	}

	public void setStart_time(String start_time) {
		this.start_time = start_time;
	}

	public int getLimit() {
		return limit;
	}

	public void setLimit(int limit) {
		this.limit = limit;
	}

	public int getStart() {
		return start;
	}

	public void setStart(int start) {
		this.start = start;
	}

}
