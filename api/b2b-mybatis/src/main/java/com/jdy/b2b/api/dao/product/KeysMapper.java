package com.jdy.b2b.api.dao.product;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.jdy.b2b.api.model.product.Keys;

@Mapper
public interface KeysMapper {
	int deleteByPrimaryKeyAndCompanyId(@Param("id") Long id,
			@Param("companyId") Long companyId);

	int insert(Keys record);

	int insertSelective(Keys record);

	Keys queryByNameAndColor(@Param("name") String name,
			@Param("color") String color);

	Keys selectByPrimaryKey(Long id);

	Map<String, Object> selectByPrimaryKeyAndCompanyId(@Param("id") Long id,
			@Param("companyId") Long companyId);

	int updateByPrimaryKeySelective(Keys record);

	int updateByPrimaryKey(Keys record);

	List<Keys> selectKeysByProductId(Long productId);

	List<Keys> selectKeysByCompanyId(Keys key);

	int countKeysByCompanyId(Keys key);

	List<LinkedHashMap<String, Object>> queryByproductIdAndStatus(
			@Param("productId") Long productId,
			@Param("status") Integer status);
}