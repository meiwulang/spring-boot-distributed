package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Mapper
public interface ProductCostingTitleMapper {
    int deleteByPrimaryKey(Long id);

    int insert(ProductCostingTitle record);

    int insertSelective(ProductCostingTitle record);

    ProductCostingTitle selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ProductCostingTitle record);

    int updateByPrimaryKey(ProductCostingTitle record);

    List<Map> selectProductCostingTitleListById(ProductCostingQueryDTO productCostingQueryDTO);

    List<ProductCostingCategoryInformation> selectProductCostingCategoryInformationById(@Param("productCostingTitleId") Long productCostingTitleId);

    ProductCostingAllInformation selectProductCostingTitleByTypeAndId(ProductCostingQueryDTO productCostingQueryDTO);

    GenerateCostingInformation selectGenerateCostingInformationByScheduleId(@Param("scheduleId") Long scheduleId);

    int deleteByIdAndType(ProductCostingTitle productCostingTitle);

    ProductCostingTitle selectByRelIdAndType(ProductCostingTitle productCostingTitle);

    Long selectProductCompanyIdByProductCostingTitleIdAndType(@Param("productCostingTitleId") Long productCostingTitleId,
                                                              @Param("type") Integer type);

    /**
     * 搜索 区域产品 的成本 (type 为1 任何产品)
     * @param productId
     * @return
     */
    List<ProductCostingTitle> selectByProductId(Long productId);

    List<Map> queryCostingTitleList(CostingTitleDTO dto);

    BigDecimal selectNewestCostUnitPriceByProductId(Long productId);
    BigDecimal selectNewestCostUnitPriceByProductIdAndDate(@Param("productId") Long productId,@Param("suitableTime")Date suitableTime);

    ProductCostDTO queryProductCostDTOById(Long id);

}