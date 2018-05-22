package com.jdy.b2b.api.dao.product;

import com.jdy.b2b.api.model.product.ProductKeyRelationDTO;
import com.jdy.b2b.api.model.product.ProductKeySynDTO;
import com.jdy.b2b.api.model.product.ProductKeys;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Set;

@Mapper
public interface ProductKeysMapper {
	int deleteByPrimaryKey(Long id);

	int deleteByRelated(ProductKeyRelationDTO entity);

	int insert(ProductKeys record);

	int insertSelective(ProductKeys record);

	int selectByProductIdAndKeyId(@Param("productId") Long productId,
			@Param("keyId") Long keyId);

	int selectByProductId(@Param("productId") Long productId);

	ProductKeys selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(ProductKeys record);

	int updateByPrimaryKey(ProductKeys record);

	/**
	 * 根据关键词id删除所有的关联关系
	 * 
	 * @param id
	 * @return
	 */
	int deleteByKeysId(Long id);

	/**
	 * 根据产品id删除所有的关联关系
	 * 
	 * @param id
	 * @return
	 */
	int deleteByProductId(Long id);

	int deleteByProductIdAndKeyId(@Param("productId") Long productId,
			@Param("keyId") Long keyId);

	/**
	 * @Description: 批量保存
	 * @author 王斌
	 * @date 2017年8月30日 上午10:08:08
	 * @param param
	 */
	int saveByRelated(ProductKeyRelationDTO param);

	List<ProductKeySynDTO> selectByPIds(@Param("list") Set<Long> productIdList);
}