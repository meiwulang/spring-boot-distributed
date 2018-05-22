package com.jdy.b2b.api.dao.product;

import org.apache.ibatis.annotations.Mapper;

import com.jdy.b2b.api.model.product.ProductExtends;
import com.jdy.b2b.api.model.product.ProductExtendsWithBLOBs;

@Mapper
public interface ProductExtendsMapper {
	int deleteByPrimaryKey(Long id);

	int deleteByTime(ProductExtends record);

	int insert(ProductExtendsWithBLOBs record);

	ProductExtendsWithBLOBs selectByTime(ProductExtends record);

	int updateByPrimaryKeyWithBLOBs(ProductExtendsWithBLOBs record);

	int insertSelective(ProductExtendsWithBLOBs record);

	ProductExtendsWithBLOBs selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(ProductExtendsWithBLOBs record);

	int updateByPrimaryKey(ProductExtends record);
}