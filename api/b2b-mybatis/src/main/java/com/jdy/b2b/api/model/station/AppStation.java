package com.jdy.b2b.api.model.station;

import java.util.List;

/**
 * @Description 移动端站点参数实体
 * @author 王斌
 * @date 2017年9月22日 下午5:27:06
 * @version V1.0
 */
public class AppStation {

	private List<String> t_ids;
	private Long p_id;
	private String source;
	private String start_date;
	private String end_date;
	private String start_time;
	private Long bl_id;// 班期编号
	private int limit = 999;
	private int start = 0;

	public Long getBl_id() {
		return bl_id;
	}

	public void setBl_id(Long bl_id) {
		this.bl_id = bl_id;
	}

	public List<String> getT_ids() {
		return t_ids;
	}

	public void setT_ids(List<String> t_ids) {
		this.t_ids = t_ids;
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
