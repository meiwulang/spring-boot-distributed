package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.aggrproduct.AggrProductMapper;
import com.jdy.b2b.api.dao.product.KeysMapper;
import com.jdy.b2b.api.model.aggrproduct.AggrProduct;
import com.jdy.b2b.api.service.AggrProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * @Description 集结产品业务层
 * @author 王斌
 * @date 2018年2月26日 下午3:20:19
 * @version V1.0
 */
@Service
@SuppressWarnings({ "rawtypes", "unchecked" })
public class AggrProductServiceImpl implements AggrProductService {
	@Autowired
	AggrProductMapper aggrProductMapper;
	@Autowired
	private KeysMapper keysDao;

	/**
	 * @Description: 区域产品列表
	 * @author 王斌
	 * @date 2018年2月26日 下午3:14:44
	 * @return
	 */
	@Override
	public ResultBean<Object> areaProductList(AggrProduct aggrProduct) {
		aggrProduct.calc();
		Map resultMap = new HashMap<>();
		List<Map<String, Object>> areaProductList = aggrProductMapper.areaProductList(aggrProduct);
		Iterator<Map<String, Object>> iterator = areaProductList.iterator();
		while (iterator.hasNext()) {
			Map<String, Object> item = iterator.next();
			final Long productId = new Long(item.get(Constants.Fields.ID).toString());
			final List<LinkedHashMap<String, Object>> keys = keysDao.queryByproductIdAndStatus(productId, 0);
			item.put(Constants.Fields.PRODUCT_KEYS, keys);
		}
		resultMap.put(Constants.Result.RESULT_LIST, areaProductList);
		resultMap.put(Constants.Result.TOTAL_NUM, aggrProductMapper.areaProductListSize(aggrProduct));
		return ResultBean.getSuccessResult(resultMap);
	}

	/**
	 * @Description: 集结产品列表
	 * @author 王斌
	 * @date 2018年2月26日 下午3:15:01
	 * @return
	 */
	@Override
	public ResultBean<Object> localProductList(AggrProduct aggrProduct) {
		aggrProduct.calc();
		String pName = aggrProduct.getpName();
		if (Objects.nonNull(pName) && pName.matches("^[a-zA-Z]+$")) {
			aggrProduct.setpPym(pName);
			aggrProduct.setpName(null);
		}
		Map<String, Object> result = new HashMap<>();
		List<Map<String, Object>> routeListMap = aggrProductMapper.localProductList(aggrProduct);
		Iterator<Map<String, Object>> iterator = routeListMap.iterator();
		while (iterator.hasNext()) {
			Map<String, Object> item = iterator.next();
			final Long productId = new Long(item.get(Constants.Fields.ID).toString());
			final List<LinkedHashMap<String, Object>> keys = keysDao.queryByproductIdAndStatus(productId, 0);
			item.put(Constants.Fields.PRODUCT_KEYS, keys);
		}
		result.put(Constants.Result.RESULT_LIST, routeListMap);
		result.put(Constants.Result.TOTAL_NUM,
				aggrProductMapper.localProductListSize(aggrProduct));
		return ResultBean.getSuccessResult(result);
	}

	/**
	 * @Description: 创建集结产品
	 * @author 王斌
	 * @date 2018年2月26日 下午3:15:26
	 * @return
	 */
	@Override
	public ResultBean<Object> createProduct(AggrProduct aggrProduct) {
		aggrProductMapper.createProduct(aggrProduct);
		return null;
	}

	/**
	 * @Description: 创建本地产品
	 * @author 王斌
	 * @date 2018年2月26日 下午3:15:41
	 * @return
	 */
	@Override
	public ResultBean<Object> createLocalProduct(AggrProduct aggrProduct) {
		aggrProductMapper.createLocalProduct(aggrProduct);
		return null;
	}
}
