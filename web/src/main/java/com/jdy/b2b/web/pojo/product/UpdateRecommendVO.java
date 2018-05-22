package com.jdy.b2b.web.pojo.product;

import javax.validation.constraints.NotNull;

import com.jdy.b2b.web.annotation.EnumValue;
import com.jdy.b2b.web.util.BaseVO;

import io.swagger.annotations.ApiModelProperty;

/**
 * @Description 产品推荐状态vo
 * @author 王斌
 * @date 2017年7月3日 下午5:48:23
 * @version V1.0
 */
public class UpdateRecommendVO extends BaseVO {
	@NotNull
	@EnumValue(enums = { "0", "1", "2" })
	@ApiModelProperty("推荐状态，可选值[0,1,2]")
	private Integer pRecommend;

	@NotNull
	@ApiModelProperty("产品编号")
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getpRecommend() {
		return pRecommend;
	}

	public void setpRecommend(Integer pRecommend) {
		this.pRecommend = pRecommend;
	}

}
