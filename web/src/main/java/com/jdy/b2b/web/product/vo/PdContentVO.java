package com.jdy.b2b.web.product.vo;

import java.util.List;

/**
 * @Description 详情实体
 * @author 王斌
 * @date 2017年7月4日 上午11:57:41
 * @version V1.0
 */
public class PdContentVO {
	private String correctly;
	private String cost_in;
	private String cost_noin;
	private String feature;
	private String notice;
	private String p_cover;
	private String p_crowd;
	private String p_days;
	private String p_name;
	private String p_name_short;
	private String p_num;
	private String p_series;
	private String passed;
	private List<StrokeVO> stroke;

	public String getCorrectly() {
		return correctly;
	}

	public void setCorrectly(String correctly) {
		this.correctly = correctly;
	}

	public String getCost_in() {
		return cost_in;
	}

	public void setCost_in(String cost_in) {
		this.cost_in = cost_in;
	}

	public String getCost_noin() {
		return cost_noin;
	}

	public void setCost_noin(String cost_noin) {
		this.cost_noin = cost_noin;
	}

	public String getFeature() {
		return feature;
	}

	public void setFeature(String feature) {
		this.feature = feature;
	}

	public String getNotice() {
		return notice;
	}

	public void setNotice(String notice) {
		this.notice = notice;
	}

	public String getP_cover() {
		return p_cover;
	}

	public void setP_cover(String p_cover) {
		this.p_cover = p_cover;
	}

	public String getP_crowd() {
		return p_crowd;
	}

	public void setP_crowd(String p_crowd) {
		this.p_crowd = p_crowd;
	}

	public String getP_days() {
		return p_days;
	}

	public void setP_days(String p_days) {
		this.p_days = p_days;
	}

	public String getP_name() {
		return p_name;
	}

	public void setP_name(String p_name) {
		this.p_name = p_name;
	}

	public String getP_name_short() {
		return p_name_short;
	}

	public void setP_name_short(String p_name_short) {
		this.p_name_short = p_name_short;
	}

	public String getP_num() {
		return p_num;
	}

	public void setP_num(String p_num) {
		this.p_num = p_num;
	}

	public String getP_series() {
		return p_series;
	}

	public void setP_series(String p_series) {
		this.p_series = p_series;
	}

	public String getPassed() {
		return passed;
	}

	public void setPassed(String passed) {
		this.passed = passed;
	}

	public List<StrokeVO> getStroke() {
		return stroke;
	}

	public void setStroke(List<StrokeVO> stroke) {
		this.stroke = stroke;
	}

}
