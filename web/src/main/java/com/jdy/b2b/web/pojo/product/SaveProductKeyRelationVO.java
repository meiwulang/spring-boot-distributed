package com.jdy.b2b.web.pojo.product;

import java.util.Set;

import javax.validation.constraints.NotNull;

import com.jdy.b2b.web.annotation.MyValidator;
import com.jdy.b2b.web.util.BaseVO;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @Description 产品--关键词保存vo
 * @author 王斌
 * @date 2017年7月3日 下午5:48:23
 * @version V1.0
 */
@ApiModel("产品--关键词保存参数")
public class SaveProductKeyRelationVO extends BaseVO {
	@ApiModelProperty("产品关键词")
	@NotNull(message = "产品编号不能为空")
	private Long productId;
	@ApiModelProperty("关键词列表")
	@NotNull(message = "关键词列表不能为空")
	@MyValidator
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
