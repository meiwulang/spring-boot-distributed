package com.jdy.b2b.api.service;

import java.util.List;
import java.util.Map;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.product.Keys;
import com.jdy.b2b.api.vo.product.SaveProductKeyRelationVO;

/**
 * Created by dugq on 2017/7/20.
 */
public interface ProductKeysService {
	/**
	 * 查询关键词详情
	 * 
	 * @param id
	 * @return
	 */
	Map<String, Object> getKey(Long id, Long companyId);

	/**
	 * 删除关键词，以及所有关联关系
	 * 
	 * @param id
	 * @return
	 */
	int deleteByPrimaryKeyAndCompanyId(Long id, Long companyId);

	/**
	 * 删除一组关键词和产品的关联关系
	 * 
	 * @param productId
	 * @param keyId
	 * @return
	 */
	int deleteProductKeyRelation(Long productId, Long keyId);

	/**
	 * 插入关键词，如果传入产品id，则绑定关联关系
	 * 
	 * @param record
	 * @param productId
	 * @return
	 */
	int insertSelective(Keys record, Long productId);

	int insertProductKeyRelation(Long productId, Long keyId);
	ResultBean<Map<String, Object>> insertProductKeyRelation(
			SaveProductKeyRelationVO vo);

	/**
	 * 根据productId查询所有的关键词
	 * 
	 * @param productId
	 * @return
	 */
	List<Keys> selectKeysByProductId(Long productId);

	/**
	 * 查询公司的关键词
	 * 
	 * @param CompanyId
	 * @return
	 */
	ResultBean<Map<String, Object>> selectKeysByCompanyId(Keys key);

	/**
	 * @Description: 编辑关键词
	 * @author 王斌
	 * @date 2017年8月8日 上午11:53:44
	 * @param keys
	 * @return
	 */
	ResultBean<Map<String, Object>> updateKey(Keys keys);

}
