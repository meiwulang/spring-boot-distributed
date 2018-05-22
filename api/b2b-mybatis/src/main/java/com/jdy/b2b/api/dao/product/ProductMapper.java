package com.jdy.b2b.api.dao.product;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import com.jdy.b2b.api.model.fingercrm.ProductSyncInfoDTO;
import com.jdy.b2b.api.model.product.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ProductMapper {
	int deleteByPrimaryKey(Long pId);

	int insert(Product record);

	int insertSelective(Product record);

	Product selectByPrimaryKey(Long pId);

	int updateByPrimaryKeySelective(Product record);

	int updateByPrimaryKey(Product record);

	List<Product> queryList(Product t);

	int countList(Product t);

	Map<String, Object> getProductDetail(@Param("pId") Integer pId,
			@Param("pdId") Integer pdId);

	/**
	 * @Description: 默认行程信息
	 * @author 王斌
	 * @date 2017年7月5日 下午4:59:07
	 * @param productsDetail
	 * @return
	 */
	Map<String, Object> getdefaultProductDetail(@Param("pId") Integer pId);

	/**
	 * @Description: 查询产品编号总数
	 * @author 王斌
	 * @date 2017年7月6日 上午10:50:07
	 * @param pNum
	 * @return
	 */
	int countBypNum(@Param("pNum") String pNum);

	/**
	 * @Description: 按主键统计总数
	 * @author 王斌
	 * @date 2017年7月6日 下午2:20:49
	 * @param getpId
	 * @return
	 */
	int countBypId(@Param("pId") Integer getpId);

	List<ProductRecommendDTO> queryProductRecommendListForPage(
			ProductRecommendQueryVo vo);

	List<ProductRecommendDTO> queryDestCitys(
			List<ProductRecommendDTO> products);

	String queryForUserByIdSingle(Long id);



	List<MobileProductProvince> selectListConditionProductIds(@Param("code") String city_code, @Param("type") Integer type);


	List<MobileListConditionDO> listCondition(List<MobileProductProvince> list);

	List<ProductSyncInfoDTO> selectShelfProductList(@Param("companyId") Long companyId,@Param("productId") Long productId);

	List<ProductSyncInfoDTO> selectShelfToPresentProductList();


	Product selectProductById(Long productId);

    BigDecimal selectMinTicketPrice(Long id);

    List<Product> selectProductsByCompanyId(@Param("companyId")Long companyId);

    List<Long> selectProductsByCompanyIds(@Param("companyId")Long companyId);

}