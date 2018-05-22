package com.jdy.b2b.api.vo.product;

import java.util.Set;

import javax.validation.constraints.NotNull;

import com.jdy.b2b.api.common.BaseVO;

/**
 * @Description 产品行程vo
 * @author 王斌
 * @date 2017年7月3日 下午5:48:23
 * @version V1.0
 */
public class SaveProductKeyRelationVO extends BaseVO {
	@NotNull(message = "产品编号不能为空")
	private Long productId;
	@NotNull(message = "关键词列表不能为空")
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
