package com.jdy.b2b.api.model.product;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FrontProduct {
	private Long p_id;
	private Long org_id;
	private String p_num;
	private String p_name;
	private String p_sname;
	private Long p_cb_id;
	private String p_type;
	private String linkman;
	private String p_days;
	private String man_qq;
	private String meet_tel;
	private String p_status;
	private String p_cover;
	private String business;
	private List<String> start_place;
	private List<String> slide_img;
	private Map<String, String> detail;
	private List<Map<String, String>> stroke;
	private Map<String, String> cost_in;
	private Map<String, String> cost_noin;
	private Map<String, String> notice;
	private Map<String, String> annex;
	private Map<String, String> visa;
	private Map<String, Object> bus_list = new HashMap<String, Object>();

	private List<Map<String, String>> start_place_detail;
	private TicketObject ticket_detail_min;
	private List<Map<String, Object>> p_promotion = null;
	private List<String> p_only_buyer = new ArrayList<String>();

	private String p_brokerage1;
	private String p_brokerage2;
	private String p_brokerage3;
	private Integer pAscription;

	public Integer getpAscription() {
		return pAscription;
	}

	public void setpAscription(Integer pAscription) {
		this.pAscription = pAscription;
	}

	public String getP_brokerage1() {
		return p_brokerage1;
	}

	public void setP_brokerage1(String p_brokerage1) {
		this.p_brokerage1 = p_brokerage1;
	}

	public String getP_brokerage2() {
		return p_brokerage2;
	}

	public void setP_brokerage2(String p_brokerage2) {
		this.p_brokerage2 = p_brokerage2;
	}

	public String getP_brokerage3() {
		return p_brokerage3;
	}

	public void setP_brokerage3(String p_brokerage3) {
		this.p_brokerage3 = p_brokerage3;
	}

	public Map<String, Object> getBus_list() {
		return bus_list;
	}

	public void setBus_list(Map<String, Object> bus_list) {
		this.bus_list = bus_list;
	}

	public List<Map<String, Object>> getP_promotion() {
		return p_promotion;
	}

	public void setP_promotion(List<Map<String, Object>> p_promotion) {
		this.p_promotion = p_promotion;
	}

	public Long getP_id() {
		return p_id;
	}

	public void setP_id(Long p_id) {
		this.p_id = p_id;
	}

	public Long getOrg_id() {
		return org_id;
	}

	public void setOrg_id(Long org_id) {
		this.org_id = org_id;
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

	public Long getP_cb_id() {
		return p_cb_id;
	}

	public void setP_cb_id(Long p_cb_id) {
		this.p_cb_id = p_cb_id;
	}

	public String getP_type() {
		return p_type;
	}

	public void setP_type(String p_type) {
		this.p_type = p_type;
	}

	public String getLinkman() {
		return linkman;
	}

	public void setLinkman(String linkman) {
		this.linkman = linkman;
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

	public String getBusiness() {
		return business;
	}

	public void setBusiness(String business) {
		this.business = business;
	}

	public List<String> getStart_place() {
		return start_place;
	}

	public void setStart_place(List<String> start_place) {
		this.start_place = start_place;
	}

	public List<String> getSlide_img() {
		return slide_img;
	}

	public void setSlide_img(List<String> slide_img) {
		this.slide_img = slide_img;
	}

	public Map<String, String> getDetail() {
		return detail;
	}

	public void setDetail(Map<String, String> detail) {
		this.detail = detail;
	}

	public List<Map<String, String>> getStroke() {
		return stroke;
	}

	public void setStroke(List<Map<String, String>> stroke) {
		this.stroke = stroke;
	}

	public Map<String, String> getCost_in() {
		return cost_in;
	}

	public void setCost_in(Map<String, String> cost_in) {
		this.cost_in = cost_in;
	}

	public Map<String, String> getCost_noin() {
		return cost_noin;
	}

	public void setCost_noin(Map<String, String> cost_noin) {
		this.cost_noin = cost_noin;
	}

	public Map<String, String> getNotice() {
		return notice;
	}

	public void setNotice(Map<String, String> notice) {
		this.notice = notice;
	}

	public Map<String, String> getAnnex() {
		return annex;
	}

	public void setAnnex(Map<String, String> annex) {
		this.annex = annex;
	}

	public Map<String, String> getVisa() {
		return visa;
	}

	public void setVisa(Map<String, String> visa) {
		this.visa = visa;
	}

	public List<Map<String, String>> getStart_place_detail() {
		return start_place_detail;
	}

	public void setStart_place_detail(
			List<Map<String, String>> start_place_detail) {
		this.start_place_detail = start_place_detail;
	}

	public TicketObject getTicket_detail_min() {
		return ticket_detail_min;
	}

	public void setTicket_detail_min(TicketObject ticket_detail_min) {
		this.ticket_detail_min = ticket_detail_min;
	}

	public List<String> getP_only_buyer() {
		return p_only_buyer;
	}

	public void setP_only_buyer(List<String> p_only_buyer) {
		this.p_only_buyer = p_only_buyer;
	}

}