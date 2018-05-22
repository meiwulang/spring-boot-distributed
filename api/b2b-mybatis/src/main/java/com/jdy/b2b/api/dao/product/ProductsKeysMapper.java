package com.jdy.b2b.api.dao.product;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.jdy.b2b.api.model.product.ProductsKeys;

@Mapper
public interface ProductsKeysMapper {
	int deleteByPrimaryKey(Integer pkId);

	int insert(ProductsKeys record);

	int insertSelective(ProductsKeys record);

	ProductsKeys selectByPrimaryKey(Integer pkId);

	int updateByPrimaryKeySelective(ProductsKeys record);

	int updateByPrimaryKey(ProductsKeys record);

	List<Map<String, Object>> queryKeysList(@Param("ids") String[] ids,
			@Param("record") ProductsKeys record);

	int queryKeysListCount(@Param("ids") String[] ids,
			@Param("record") ProductsKeys record);
}