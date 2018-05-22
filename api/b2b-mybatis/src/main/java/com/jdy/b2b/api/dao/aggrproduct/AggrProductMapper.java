package com.jdy.b2b.api.dao.aggrproduct;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.jdy.b2b.api.model.aggrproduct.AggrProduct;

/**   
* @Description 集结产品
* @author 王斌
* @date 2018年2月26日 下午5:47:19 
* @version V1.0   
*/
@Mapper
public interface AggrProductMapper {
	List<Map<String, Object>> areaProductList (AggrProduct param);
	int areaProductListSize (AggrProduct param);
	List<Map<String, Object>> localProductList (AggrProduct param);
	int localProductListSize (AggrProduct param);
	int createProduct (AggrProduct param);
	int createLocalProduct (AggrProduct param);
}
