package com.jdy.b2b.api.service;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.CostingTitleDTO;
import com.jdy.b2b.api.model.ProductCosting;
import com.jdy.b2b.api.model.ProductCostingQueryDTO;
import com.jdy.b2b.api.model.ProductCostingTitle;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

import java.util.List;
import java.util.Map;

/**
 * Created by zhangfofa on 2018/2/6.
 */
public interface ProductCostingService {

    ResultBean addProductCosting(ProductCosting productCosting, Long id);

    List<Map> queryProductCostingTitleListById(ProductCostingQueryDTO productCostingQueryDTO);

    ResultBean queryProductCostingAllInformationById(ProductCostingQueryDTO productCostingQueryDTO);

    List<Map> queryCostingTitleList(CostingTitleDTO map);

    ResultBean modifyProductCostingTitle(ProductCostingTitle vo);

    BigDecimal selectNewestCostUnitPriceByProductId(Long productId);

	/** 
	 * @Description: 根据时间查成本价
	 * @author 王斌
	 * @date 2018年4月13日 下午7:50:38
	 * @param productId
	 * @param date
	 * @return
	 */
	BigDecimal selectNewestCostUnitPriceByProductIdAndDate(Long productId,
			Date date);
}
