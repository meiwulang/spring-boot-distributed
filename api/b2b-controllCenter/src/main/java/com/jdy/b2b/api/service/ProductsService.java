package com.jdy.b2b.api.service;

import java.util.Map;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.product.CompanyBrand;
import com.jdy.b2b.api.model.product.Product;
import com.jdy.b2b.api.model.product.ProductsDetail;
import com.jdy.b2b.api.vo.product.ProductDetailVO;
import com.jdy.b2b.api.vo.product.TripsVO;

/**
 * @Description 产品业务层
 * @author 王斌
 * @date 2017年7月3日 上午10:13:24
 * @version V1.0
 */
public interface ProductsService {
	Map<String, Object> queryList(Product t);

	/**
	 * @Description: 保存产品线路
	 * @date 2017年7月4日 下午3:14:06
	 * @param product
	 * @return
	 */
	ResultBean<Map<String, Object>> saveRoute(Product product, String cover);

	/**
	 * @Description: 编辑产品线路
	 * @date 2017年7月4日 下午3:13:56
	 * @param product
	 * @param cover
	 * @return
	 */
	ResultBean<Map<String, Object>> updateRoute(Product product, String cover);

	/**
	 * @Description: 删除产品
	 * @date 2017年7月4日 下午3:13:44
	 * @param pid
	 * @return
	 */
	int delete(Integer pid);

	/**
	 * @Description:获取品牌列表
	 * @date 2017年7月4日 下午3:13:24
	 * @param record
	 * @return
	 */
	Map<String, Object> getBrandList(CompanyBrand record);

	/**
	 * @Description:恢复产品
	 * @date 2017年7月4日 下午3:13:01
	 * @param pId
	 * @return
	 */
	int recovery(Integer pId);

	/**
	 * @Description: 查询行程详情列表
	 * @author 王斌
	 * @date 2017年7月5日 下午3:06:42
	 * @param pId
	 * @return
	 */
	Map<String, Object> queryDetailList(ProductsDetail productsDetail);

	/**
	 * @Description: 修改确认状态
	 * @author 王斌
	 * @date 2017年7月5日 下午6:07:00
	 * @param record
	 * @return
	 */
	int updateConfirm(Product record);

	/**
	 * @Description: 修改推荐状态
	 * @author 王斌
	 * @date 2017年7月5日 下午6:07:00
	 * @param record
	 * @return
	 */
	int updateRecommend(Product record);

	/**
	 * @Description: 保存附加行程
	 * @author 王斌
	 * @date 2017年7月6日 上午11:51:35
	 * @param vo
	 */
	ResultBean<Object> delExtRoute(Integer pdId);

	/**
	 * @Description: 下架（待入库/已提交）
	 * @author 王斌
	 * @date 2017年7月19日 上午10:40:28
	 * @param product
	 * @return
	 */
	ResultBean<Map<String, Object>> uneffectRoute(Product product);

	/**
	 * @Description: 上架
	 * @author 王斌
	 * @date 2017年7月19日 上午10:40:43
	 * @param product
	 * @return
	 */
	ResultBean<Map<String, Object>> effectRoute(Product product);

	/**
	 * @Description: 产品行程列表
	 * @author 王斌
	 * @date 2017年7月20日 上午11:05:14
	 * @return
	 */
	ResultBean<Map<String, Object>> queryTripList(TripsVO vo);

	/**
	 * @Description: 保存产品行程列表
	 * @author 王斌
	 * @date 2017年7月20日 上午11:19:58
	 * @return
	 */
	ResultBean<Map<String, Object>> saveTrips(TripsVO vo);

	/**
	 * @Description: 编辑产品行程列表
	 * @author 王斌
	 * @date 2017年7月20日 上午11:21:14
	 * @param trip
	 * @return
	 */
	ResultBean<Map<String, Object>> updateTrips(TripsVO vo);

	/**
	 * @Description: 批量删除行程
	 * @author 王斌
	 * @date 2017年7月21日 下午5:31:03
	 * @param vo
	 * @return
	 */
	ResultBean<Map<String, Object>> batchDeleteTrips(TripsVO vo);

	/**
	 * @Description: 查询产品行程
	 * @author 王斌
	 * @date 2017年7月24日 下午2:13:24
	 * @param vo
	 * @return
	 */
	ResultBean<Map<String, Object>> queryProductDetail(ProductDetailVO vo);

	Map mobileListCondition(String city_code, Integer type);

	/**
	 * @Description: 删除
	 * @author 王斌
	 * @date 2017年11月6日 下午4:31:02
	 * @param pid
	 * @param userId
	 * @return
	 */
	ResultBean<Map<String, Object>> delete(Long pid, Long userId);

}
