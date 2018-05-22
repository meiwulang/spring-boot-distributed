package com.jdy.b2b.web.controll.frontAPIs;

import com.jdy.b2b.web.service.AdvertisementService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.NotNull;

/**
 * Created by yangcheng on 2017/9/27.
 */
@Api(value = "frontAdver", description = "手机端/前台广告")
@RestController
public class FrontAdverController extends BaseController{
    @Autowired
    private AdvertisementService advertisementService;


    @ApiOperation(value = "前台广告列表")
    @GetMapping("indexAdverList")
    public ResultBean indexAdverList(@NotNull @ApiParam(value = "城市码", required = true, name = "city_code") @RequestParam("city_code") String city_code){
        return advertisementService.indexAdverList(city_code);
    }

    @ApiOperation(value = "手机端广告列表")
    @GetMapping("front/h5/adver/indexAdver")
    public ResultBean mobileAdverList(){
        logger.debug(SecurityUtils.getSubject().isAuthenticated()+"@@@@@FrontAdverController");
        return advertisementService.mobileAdverList(getUser().getuCompanyId());
    }
}
