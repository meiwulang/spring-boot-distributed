package com.jdy.b2b.api.service;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.vo.brand.BrandVO;

/**
 * @Description 品牌业务接口层
 * @author 王斌
 * @date 2017年8月9日 上午11:04:33
 * @version V1.0
 */
public interface BrandService {
	/**
	 * @Description: 列表
	 * @author 王斌
	 * @date 2017年8月9日 上午11:05:49
	 * @param brand
	 * @return
	 */
	public ResultBean<?> list(BrandVO brand);

	/**
	 * @Description: 顶级列表
	 * @author 王斌
	 * @date 2017年8月9日 上午11:06:00
	 * @param brand
	 * @return
	 */
	public ResultBean<?> listForIndex(int size);

	/**
	 * @Description: 编辑
	 * @author 王斌
	 * @date 2017年8月9日 上午11:06:18
	 * @param brand
	 * @return
	 */
	public ResultBean<?> update(BrandVO brand);

	/**
	 * @Description: 删除
	 * @author 王斌
	 * @date 2017年8月9日 上午11:06:25
	 * @param brand
	 * @return
	 */
	public ResultBean<?> delete(BrandVO brand);

	/**
	 * @Description: 保存
	 * @author 王斌
	 * @date 2017年8月9日 上午11:06:35
	 * @param brand
	 * @return
	 */
	public ResultBean<?> save(BrandVO brand);
}
