package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.pexperience.ConfigDO;
import com.jdy.b2b.api.model.pexperience.ProductListDO;
import com.jdy.b2b.api.model.pexperience.ProductListDTO;
import com.jdy.b2b.api.service.ProductExperienceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

import static org.apache.commons.collections.CollectionUtils.isNotEmpty;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/13 10:40
 */
@RestController
@RequestMapping("pExperience")
public class ProductExperienceController extends BaseController {

    @Autowired
    ProductExperienceService service;

    @PostMapping("/listPosAndNum")
    public ResultBean listPosAndNum(@RequestBody ProductListDO vo) {
        return ResultBean.getSuccessResult(service.listPosAndNum(vo));
    }

    @PostMapping("/productConfigList")
    public ResultBean productConfigList(@RequestBody ProductListDO vo) {
        return service.productConfigList(vo);
    }

    @PostMapping("/productList")
    public ResultBean productList(@RequestBody ProductListDO vo) {
        PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
        List<ProductListDTO> list = service.selectPosProductList(vo);
        list = isNotEmpty(list) ? list : new ArrayList();
        return ResultBean.getSuccessResult(new PageInfo<>(list));
    }

    @PostMapping("/configPosProduct")
    public ResultBean configPosProduct(@RequestBody ConfigDO vo) {
        return service.configPosProduct(vo);
    }

    @GetMapping("/delete/{id}")
    public ResultBean delete(@PathVariable Long id) {
        return service.delete(id);
    }
}
