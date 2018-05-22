package com.jdy.b2b.web.controll.city;

import com.jdy.b2b.web.pojo.city.CityDTO;
import com.jdy.b2b.web.pojo.city.CityOpenVO;
import com.jdy.b2b.web.pojo.city.CityPutListVO;
import com.jdy.b2b.web.pojo.city.CitySelectVO;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @Description 城市管理controller
 * @Author yyf
 * @DateTime 2017/7/7 16:41
 */
@Api(value = "City", description = "城市管理")
@RestController
@RequestMapping("City")
public class CityController extends BaseController {
    @Value("${systemCenterUrl}City")
    String MODULE_URL;

    @ApiOperation("投放城市查询")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "城市信息", response = CityDTO.class)})
    @PostMapping("/selectCityPutList")
    public ResultBean selectCityPutList(@RequestBody CityPutListVO city) {
        String url = MODULE_URL + "/selectCityPutList";
        return restTemplate.postForObject(url, city, ResultBean.class);
    }

    @ApiOperation("投放城市状态更新,省市级必须一起传入，省级状态有可能改变，省级更新状态由接口调用方判断")
    @PostMapping("/openCities")
    public ResultBean openCities(@Validated @RequestBody List<CityOpenVO> cities) {
        String url = MODULE_URL + "/openCities";
        return restTemplate.postForObject(url, cities, ResultBean.class);
    }

    @ApiOperation("分级别查询省市县信息")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "城市信息", response = CityDTO.class)})
    @PostMapping("/selectCities")
    public ResultBean selectCities(@Validated @RequestBody CitySelectVO city) {
        if(StringUtils.isBlank(city.getType())){
            city.setType("CN");
        }
        String url = MODULE_URL + "/selectCities";
        return restTemplate.postForObject(url, city, ResultBean.class);
    }
    /** 
     * @Description: 获取全部大洲
     * @author 王斌
     * @date 2018年5月11日 下午1:53:32
     * @return
     */
    @ApiOperation("获取全部大洲")
    @PostMapping("/getContinents")
    public ResultBean getContinents(){return restTemplate.postForObject(new StringBuffer(MODULE_URL).append("/getContinents").toString(), null, ResultBean.class);}
    /** 
     * @Description: 大洲下的国家
     * @author 王斌
     * @date 2018年5月11日 下午1:53:32
     * @return
     */
    @ApiOperation("大洲下的国家")
    @PostMapping("/getCountriesByPid")
    public ResultBean getCountriesByPid ( @RequestBody Long pid){
    	return restTemplate.postForObject(new StringBuffer(MODULE_URL).append("/getCountriesByPid").toString(), pid, ResultBean.class);
    }

}
