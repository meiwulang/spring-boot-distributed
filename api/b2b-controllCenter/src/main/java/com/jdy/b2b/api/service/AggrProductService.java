package com.jdy.b2b.api.service;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.aggrproduct.AggrProduct;

/**
 * @Description TODO
 * @author 王斌
 * @date 2018年2月27日 上午9:18:39
 * @version V1.0
 */
public interface AggrProductService {

	/**
	 * @Description: TODO
	 * @author 王斌
	 * @date 2018年2月27日 上午11:15:22
	 * @param aggrProduct
	 * @return
	 */
	ResultBean<Object> areaProductList(AggrProduct aggrProduct);

	/**
	 * @Description: TODO
	 * @author 王斌
	 * @date 2018年2月27日 上午11:15:41
	 * @param aggrProduct
	 * @return
	 */
	ResultBean<Object> localProductList(AggrProduct aggrProduct);

	/**
	 * @Description: TODO
	 * @author 王斌
	 * @date 2018年2月27日 上午11:15:55
	 * @param aggrProduct
	 * @return
	 */
	ResultBean<Object> createProduct(AggrProduct aggrProduct);

	/**
	 * @Description: TODO
	 * @author 王斌
	 * @date 2018年2月27日 上午11:16:07
	 * @param aggrProduct
	 * @return
	 */
	ResultBean<Object> createLocalProduct(AggrProduct aggrProduct);

}
