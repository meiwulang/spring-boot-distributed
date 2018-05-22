package com.jdy.b2b.web.controll.productStatistics;

import com.jdy.b2b.web.pojo.productStatistic.ListParam;
import com.jdy.b2b.web.service.ProductStatisticsService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.groups.Default;

/**
 * Created by dugq on 2017/11/16.
 */
@RestController
@RequestMapping("productStatistics")
@Api(value = "ProductStatisticsController",description = "产品统计")
public class ProductStatisticsController extends BaseController{
    @Autowired
    private ProductStatisticsService productStatisticsService;

    @RequestMapping("list")
    @ApiOperation(value = "单位级查询产品列表和前五产品信息", notes = "参数例 ： 总计： {type:2} 按月：{startDate : '2017-10-01',type:1}  按天：{startDate : '2017-10-01',type:0}",httpMethod = "POST")
    public ResultBean list(@RequestBody @Validated(Default.class) ListParam param){
        param.init();
        param.initList();
        ResultBean result = productStatisticsService.selectProductList(param);
        return result;
    }

    @ApiOperation(value = "单位级查询产品详情", notes = "参数例 ： 总计： {type:2} 按月：{startDate : '2017-10-01',type:1}  按天：{startDate : '2017-10-01',type:0}",httpMethod = "POST")
    @RequestMapping("detailList")
    public ResultBean detailList(@RequestBody  @Validated({Default.class,ListParam.detailList.class}) ListParam param){
        param.init();
        param.initDetilList();
        ResultBean result = productStatisticsService.selectProductList(param);
        return result;
    }

}
