package com.jdy.b2b.api.dao.product;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.jdy.b2b.api.model.product.ProductsDetail;

@Mapper
public interface ProductsDetailMapper {
	int deleteByPrimaryKey(Integer pdId);

	int insert(ProductsDetail record);

	int insertSelective(ProductsDetail record);

	ProductsDetail selectByPrimaryKey(Integer pdId);

	int updateByPrimaryKeySelective(ProductsDetail record);

	int updateByPrimaryKeyWithBLOBs(ProductsDetail record);

	int updateByProductId(ProductsDetail record);

	int updateByPrimaryKey(ProductsDetail record);

	/**
	 * @Description: 查询产品的详情列表
	 * @author 王斌
	 * @date 2017年7月5日 下午3:27:33
	 * @param productsDetail
	 */
	List<Map<String, Object>> findDetailListByPidAndPdId(
			ProductsDetail productsDetail);

	/**
	 * @Description: 查询产品的详情列表总数
	 * @author 王斌
	 * @date 2017年7月5日 下午3:27:33
	 * @param productsDetail
	 */
	int countDetailListByPidAndPdId(ProductsDetail productsDetail);

	/**
	 * @Description: 查询产品的详情列表
	 * @author 王斌
	 * @date 2017年7月5日 下午4:27:11
	 * @param productsDetail
	 * @return
	 */
	List<Map<String, Object>> findDetailListByPid(
			ProductsDetail productsDetail);

	/**
	 * @Description: 查询产品的详情列表总数
	 * @author 王斌
	 * @date 2017年7月5日 下午4:27:38
	 * @param productsDetail
	 * @return
	 */
	int countDetailListByPid(ProductsDetail productsDetail);

	/**
	 * @Description: 判断当前行程是否为默认行程
	 * @author 王斌
	 * @date 2017年7月6日 上午11:06:46
	 * @param pd
	 * @return
	 */
	int isDefaultRoute(@Param("pdId") Integer pdId);

	/**
	 * @Description: 获取满足条件的存在行程
	 * @author 王斌
	 * @date 2017年7月6日 下午1:41:52
	 * @param pd
	 * @return
	 */
	int countExistRouteByDate(ProductsDetail pd);
}