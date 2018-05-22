package com.jdy.b2b.web.product.vo;


import com.jdy.b2b.web.util.BaseVO;

import java.io.Serializable;


/**
 * @Description 查询公司品牌列表vo
 * @author 王斌
 * @date 2017年7月3日 下午3:49:14
 * @version V1.0
 */
public class QueryBrandListVO extends BaseVO implements Serializable {
	private static final long serialVersionUID = 1L;
	private String cbName;

	public String getCbName() {
		return cbName;
	}

	public void setCbName(String cbName) {
		this.cbName = cbName;
	}

}
