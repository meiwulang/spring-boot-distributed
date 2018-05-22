package com.jdy.b2b.api.model.product;

import java.util.Map;

public class TicketObject {
	private Map<String, Object> 成人票;
	private Map<String, Object> 儿童票;
	private Map<String, Object> 套票;

	public Map<String, Object> get成人票() {
		return 成人票;
	}

	public void set成人票(Map<String, Object> 成人票) {
		this.成人票 = 成人票;
	}

	public Map<String, Object> get儿童票() {
		return 儿童票;
	}

	public void set儿童票(Map<String, Object> 儿童票) {
		this.儿童票 = 儿童票;
	}

	public Map<String, Object> get套票() {
		return 套票;
	}

	public void set套票(Map<String, Object> 套票) {
		this.套票 = 套票;
	}

}