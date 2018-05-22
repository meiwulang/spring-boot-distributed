package com.jdy.b2b.api.dao.diy;

import com.jdy.b2b.api.model.ProductExperience;
import com.jdy.b2b.api.model.pexperience.PosAndNumDTO;
import com.jdy.b2b.api.model.pexperience.ProductListDO;
import com.jdy.b2b.api.model.pexperience.ProductListDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/13 11:28
 */
@Mapper
public interface ProductExperienceMapperDiy {

    List<PosAndNumDTO> listPosAndNum(ProductListDO vo);

    List<ProductListDTO> selectPosProductList(ProductListDO vo);

    List<ProductListDTO> selectProductList(ProductListDO vo);

    void deleteExpByPosIdAndPids(Map map);

    void batchSaveProductExperiences(List<ProductExperience> list);
}
