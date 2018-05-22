package com.jdy.b2b.api.model.product;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @Description 产品返回参数
 * @author 王斌
 * @date 2017年7月3日 下午5:48:23
 * @version V1.0
 */
public class AppProduct {
	private Long p_id;
	private String p_num;
	private String p_name;
	private String p_sname;
	private String p_type;
	private String p_type_name;
	private String p_days;
	private String man_qq;
	private String meet_tel;
	private String p_status;
	private String p_cover;
	private String ticket_min;
	private String t_trade_price;
	private String bus_lists;
	private String business;
	private Long business_id;
	private List<String> start_place;
	private List<String> arrive_place;
	private List<String> buslist;
	private Map<String, String> p_key;
	private List<Map<String, String>> t_temp_price;
	private List<Map<String, Object>> p_promotion = new ArrayList<>();

	public Long getP_id() {
		return p_id;
	}

	public void setP_id(Long p_id) {
		this.p_id = p_id;
	}

	public String getP_num() {
		return p_num;
	}

	public void setP_num(String p_num) {
		this.p_num = p_num;
	}

	public String getP_name() {
		return p_name;
	}

	public void setP_name(String p_name) {
		this.p_name = p_name;
	}

	public String getP_sname() {
		return p_sname;
	}

	public void setP_sname(String p_sname) {
		this.p_sname = p_sname;
	}

	public String getP_type() {
		return p_type;
	}

	public void setP_type(String p_type) {
		this.p_type = p_type;
	}

	public String getP_type_name() {
		return p_type_name;
	}

	public void setP_type_name(String p_type_name) {
		this.p_type_name = p_type_name;
	}

	public String getP_days() {
		return p_days;
	}

	public void setP_days(String p_days) {
		this.p_days = p_days;
	}

	public String getMan_qq() {
		return man_qq;
	}

	public void setMan_qq(String man_qq) {
		this.man_qq = man_qq;
	}

	public String getMeet_tel() {
		return meet_tel;
	}

	public void setMeet_tel(String meet_tel) {
		this.meet_tel = meet_tel;
	}

	public String getP_status() {
		return p_status;
	}

	public void setP_status(String p_status) {
		this.p_status = p_status;
	}

	public String getP_cover() {
		return p_cover;
	}

	public void setP_cover(String p_cover) {
		this.p_cover = p_cover;
	}

	public String getTicket_min() {
		return ticket_min;
	}

	public void setTicket_min(String ticket_min) {
		this.ticket_min = ticket_min;
	}

	public String getT_trade_price() {
		return t_trade_price;
	}

	public void setT_trade_price(String t_trade_price) {
		this.t_trade_price = t_trade_price;
	}

	public String getBus_lists() {
		return bus_lists;
	}

	public void setBus_lists(String bus_lists) {
		this.bus_lists = bus_lists;
	}

	public String getBusiness() {
		return business;
	}

	public void setBusiness(String business) {
		this.business = business;
	}

	public Long getBusiness_id() {
		return business_id;
	}

	public void setBusiness_id(Long business_id) {
		this.business_id = business_id;
	}

	public List<String> getStart_place() {
		return start_place;
	}

	public void setStart_place(List<String> start_place) {
		this.start_place = start_place;
	}

	public List<String> getArrive_place() {
		return arrive_place;
	}

	public void setArrive_place(List<String> arrive_place) {
		this.arrive_place = arrive_place;
	}

	public List<String> getBuslist() {
		return buslist;
	}

	public void setBuslist(List<String> buslist) {
		this.buslist = buslist;
	}

	public Map<String, String> getP_key() {
		return p_key;
	}

	public void setP_key(Map<String, String> p_key) {
		this.p_key = p_key;
	}

	public List<Map<String, String>> getT_temp_price() {
		return t_temp_price;
	}

	public void setT_temp_price(List<Map<String, String>> t_temp_price) {
		this.t_temp_price = t_temp_price;
	}

	public List<Map<String, Object>> getP_promotion() {
		return p_promotion;
	}

	public void setP_promotion(List<Map<String, Object>> p_promotion) {
		this.p_promotion = p_promotion;
	}

}
