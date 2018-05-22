package com.jdy.b2b.api.service;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.pexperience.ConfigDO;
import com.jdy.b2b.api.model.pexperience.PosAndNumDTO;
import com.jdy.b2b.api.model.pexperience.ProductListDO;
import com.jdy.b2b.api.model.pexperience.ProductListDTO;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/13 10:45
 */
public interface ProductExperienceService {

    List<PosAndNumDTO> listPosAndNum(ProductListDO vo);

    List<ProductListDTO> selectPosProductList(ProductListDO vo);

    ResultBean productConfigList(ProductListDO vo);

    ResultBean configPosProduct(ConfigDO vo);

    ResultBean delete(Long id);
}
