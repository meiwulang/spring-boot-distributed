package com.jdy.b2b.api.service.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jdy.b2b.api.common.Constants.Error;
import com.jdy.b2b.api.common.Constants.Result;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.product.KeysMapper;
import com.jdy.b2b.api.dao.product.ProductKeysMapper;
import com.jdy.b2b.api.model.product.Keys;
import com.jdy.b2b.api.model.product.ProductKeyRelationDTO;
import com.jdy.b2b.api.model.product.ProductKeys;
import com.jdy.b2b.api.vo.product.SaveProductKeyRelationVO;

/**
 * Created by dugq on 2017/7/20.
 */
@Service
@Transactional
public class ProductKeysServiceImpl
		implements com.jdy.b2b.api.service.ProductKeysService {
	@Autowired
	private KeysMapper keysMapper;
	@Autowired
	private ProductKeysMapper productKeysMapper;

	@Override
	public int deleteByPrimaryKeyAndCompanyId(Long id, Long companyId) {
		return keysMapper.deleteByPrimaryKeyAndCompanyId(id, companyId);
	}

	@Override
	public int insertSelective(Keys record, Long productId) {
		record.initForClearNull();
		int i = 0;
		Keys existKey = keysMapper.queryByNameAndColor(record.getkName(),
				record.getkColor());
		boolean keyIsNull = Objects.isNull(existKey);
		if (keyIsNull) {
			i = keysMapper.insertSelective(record);
		} else {
			record.setId(existKey.getId());
		}
		if (Objects.nonNull(productId)) {
			ProductKeys productKeys = new ProductKeys();
			productKeys.setPkProductId(productId);
			productKeys.setPkKeyId(record.getId());
			Date createTime = new Date();
			productKeys.setCreateTime(createTime);
			productKeys.setUpdateTime(createTime);
			int selectByProductId = productKeysMapper
					.selectByProductId(productId);
			if (i > 0 && selectByProductId < 5) {
				int result = productKeysMapper.insertSelective(productKeys);
				if (result < 1) {
					throw new RuntimeException();
				}
			}
			if (selectByProductId >= 4) {
				throw new RuntimeException("一个产品最多可以添加4个关键词");
			}
			if (i < 1 && !keyIsNull
					&& productKeysMapper.selectByProductIdAndKeyId(productId,
							existKey.getId()) < 1) {
				productKeys.setPkKeyId(existKey.getId());
				i = productKeysMapper.insertSelective(productKeys);
				if (i < 1) {
					throw new RuntimeException();
				}
			}
		}
		return i;
	}

	@Override
	public List<Keys> selectKeysByProductId(Long productId) {
		return keysMapper.selectKeysByProductId(productId);
	}

	@Override
	public int deleteProductKeyRelation(Long productId, Long keyId) {
		return productKeysMapper.deleteByProductIdAndKeyId(productId, keyId);
	}

	@Override
	public ResultBean<Map<String, Object>> selectKeysByCompanyId(Keys key) {
		key.calc();
		Map<String, Object> result = new HashMap<>(2);
		result.put(Result.RESULT_LIST, keysMapper.selectKeysByCompanyId(key));
		result.put(Result.TOTAL_NUM, keysMapper.countKeysByCompanyId(key));
		return ResultBean.getSuccessResult(result);
	}

	@Override
	public Map<String, Object> getKey(Long id, Long companyId) {
		return keysMapper.selectByPrimaryKeyAndCompanyId(id, companyId);
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public ResultBean<Map<String, Object>> updateKey(Keys keys) {

		// 检查同名标签是否存在 检查公司编号是否相同
		Long id = keys.getId();
		if (Objects.nonNull(keysMapper.queryByNameAndColor(keys.getkName(),
				keys.getkColor()))) {
			return new ResultBean<>(Error.COMMON_ERROR_CODE,
					Error.NOT_EXIST_KEYWORD);
		}
		Date updateTime = new Date();
		keys.setUpdateTime(updateTime);
		keysMapper.updateByPrimaryKeySelective(keys);
		ResultBean successResult = ResultBean.getSuccessResult();
		successResult.setId(id);
		return successResult;
	}

	@Override
	@Transactional
	public ResultBean<Map<String, Object>> insertProductKeyRelation(
			SaveProductKeyRelationVO vo) {
		ProductKeyRelationDTO param = JSONUtil.trans(vo,
				ProductKeyRelationDTO.class);
		if (vo.getKeyIds().size() > 0) {
			productKeysMapper.deleteByRelated(param);
			productKeysMapper.saveByRelated(param);
		}
		return ResultBean.getSuccessResultForLog(
				vo.getKeyIds().toArray(new Long[vo.getKeyIds().size()]));
	}

	@Override
	public int insertProductKeyRelation(Long productId, Long keyId) {
		int count = productKeysMapper.selectByProductIdAndKeyId(productId,
				keyId);
		if (count < 1) {
			ProductKeys productKeys = new ProductKeys();
			productKeys.setPkProductId(productId);
			productKeys.setPkKeyId(keyId);
			Date createTime = new Date();
			productKeys.setCreateTime(createTime);
			productKeys.setUpdateTime(createTime);
			return productKeysMapper.insertSelective(productKeys);

		}
		return 1;
	}
}
