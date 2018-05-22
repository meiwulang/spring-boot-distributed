package com.jdy.b2b.web.pojo.product;

import java.util.Date;


public class QueryCostByProductAndDateVO {
	private Long productId;
	private Date date;
	public Long getProductId() {
		return productId;
	}
	public void setProductId(Long productId) {
		this.productId = productId;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}

}
