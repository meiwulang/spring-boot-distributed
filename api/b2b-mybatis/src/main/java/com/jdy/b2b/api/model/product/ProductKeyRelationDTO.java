package com.jdy.b2b.api.model.product;

import java.util.Set;

public class ProductKeyRelationDTO extends BaseDO {
	private Long productId;
	private Set<Long> keyIds;

	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
	}

	public Set<Long> getKeyIds() {
		return keyIds;
	}

	public void setKeyIds(Set<Long> keyIds) {
		this.keyIds = keyIds;
	}

}
