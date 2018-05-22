package com.jdy.b2b.api.dao.product;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.jdy.b2b.api.model.product.CompanyBrand;

@Mapper
public interface CompanyBrandMapper {
	int deleteByPrimaryKey(Integer cbId);

	int insert(CompanyBrand record);

	int insertSelective(CompanyBrand record);

	CompanyBrand selectByPrimaryKey(Integer cbId);

	int updateByPrimaryKeySelective(CompanyBrand record);

	int updateByPrimaryKey(CompanyBrand record);

	List<Map<String, String>> getBrandList(CompanyBrand record);

	int countList(CompanyBrand t);
}