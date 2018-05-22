package com.jdy.b2b.api.dao.brand;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.jdy.b2b.api.model.brand.Brand;

@Mapper
public interface BrandMapper {
	int deleteByPrimaryKey(Integer id);

	List<Brand> queryByName(Brand record);

	int insert(Brand record);

	int insertSelective(Brand record);

	Brand selectByPrimaryKey(Integer id);

	List<Brand> listForIndex(@Param("size") Integer size);

	int updateByPrimaryKeySelective(Brand record);

	int countByRecord(Brand record);

	String selectCompanyName(Long id);

	String selectCreateUserName(Long id);

	List<Brand> queryByRecord(Brand record);

	int updateByPrimaryKey(Brand record);
}