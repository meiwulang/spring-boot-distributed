package com.jdy.b2b.web.controll.product;

import com.jdy.b2b.web.pojo.pexperience.ConfigDO;
import com.jdy.b2b.web.pojo.pexperience.PosAndNumDTO;
import com.jdy.b2b.web.pojo.pexperience.ProductListDO;
import com.jdy.b2b.web.pojo.pexperience.ProductListDTO;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/12 19:53
 */
@RestController
@RequestMapping("pExperience")
@Api(description = "配置产品体验")
public class ProductExperienceController extends BaseController {

    @Value("${controllCenterUrl}pExperience")
    String MODULE_URL;

    @ApiOperation(value = "岗位和配置产品的数量列表")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "岗位和配置产品的数量列表", response = PosAndNumDTO.class)})
    @PostMapping("/listPosAndNum")
    public ResultBean listPosAndNum(ProductListDO vo) {
        if(!vo.getPuDataLimit().equals(Integer.valueOf(3))){
            vo.setCompanyId(vo.getPcompanyId());
        }
        return restTemplate.postForObject(MODULE_URL + "/listPosAndNum",vo, ResultBean.class);
    }

    @ApiOperation(value = "产品配置列表")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "产品配置列表", response = ProductListDTO.class)})
    @PostMapping("/productConfigList")
    public ResultBean productConfigList(@RequestBody ProductListDO vo) {
        if(!vo.getPuDataLimit().equals(Integer.valueOf(3))){
            vo.setCompanyId(vo.getPcompanyId());
        }
        return restTemplate.postForObject(MODULE_URL + "/productConfigList", vo, ResultBean.class);
    }

    @ApiOperation(value = "已配置产品列表")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "已配置产品列表", response = ProductListDTO.class)})
    @PostMapping("/productList")
    public ResultBean productList(@RequestBody ProductListDO vo) {
        if(!vo.getPuDataLimit().equals(Integer.valueOf(3))){
            vo.setCompanyId(vo.getPcompanyId());
        }
        return restTemplate.postForObject(MODULE_URL + "/productList", vo, ResultBean.class);
    }

    @ApiOperation(value = "配置岗位和产品关系")
    @PostMapping("/configPosProduct")
    public ResultBean configPosProduct(@RequestBody ConfigDO vo) {
        if(!vo.getPuDataLimit().equals(Integer.valueOf(3))){
            vo.setCompanyId(vo.getPcompanyId());
        }
        return restTemplate.postForObject(MODULE_URL + "/configPosProduct", vo, ResultBean.class);
    }

    @ApiOperation(value = "删除岗位和产品关系")
    @GetMapping("/delete/{id}")
    public ResultBean delete(@PathVariable Long id) {
        return restTemplate.getForObject(MODULE_URL + "/delete/{id}", ResultBean.class, id);
    }

}
