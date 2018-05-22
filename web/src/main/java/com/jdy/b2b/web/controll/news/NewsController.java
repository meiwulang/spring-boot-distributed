package com.jdy.b2b.web.controll.news;

import com.jdy.b2b.web.pojo.log.MyLog;
import com.jdy.b2b.web.pojo.news.*;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/27 16:25
 */
@Api(value = "News", description = "资讯、公告")
@RestController
@RequestMapping("News")
public class NewsController extends BaseController {

    @Value("${systemCenterUrl}News")
    String MODULE_URL;

    @ApiOperation("列表查询")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "资讯公告信息", response = News.class)})
    @PostMapping("/list")
    public ResultBean list(@Validated @RequestBody NewsListDTO newsListDTO) {
        return restTemplate.postForObject(MODULE_URL + "/list", newsListDTO, ResultBean.class);
    }

    @MyLog(SuccessInfo = "保存资讯公告成功")
    @ApiOperation("保存资讯公告")
    @PostMapping("/insertSelective")
    public ResultBean insertSelective(@Validated @RequestBody NewsInsertDTO news) {
        return restTemplate.postForObject(MODULE_URL + "/insertSelective", news, ResultBean.class);
    }

    @MyLog(SuccessInfo = "更新资讯公告成功")
    @ApiOperation("更新资讯公告")
    @PostMapping("/updateSelective")
    public ResultBean updateSelective(@Validated @RequestBody NewsUpdateDTO news) {
        return restTemplate.postForObject(MODULE_URL + "/updateSelective", news, ResultBean.class);
    }

    @MyLog(SuccessInfo = "更新是否推荐")
    @ApiOperation("更新是否推荐")
    @PostMapping("/updateRecommend")
    public ResultBean updateRecommend(@Validated @RequestBody NewsUpdateRecommendDTO news) {
        return restTemplate.postForObject(MODULE_URL + "/updateSelective", news, ResultBean.class);
    }

    @MyLog(SuccessInfo = "更新资讯状态")
    @ApiOperation("更新资讯状态")
    @PostMapping("/updateStatus")
    public ResultBean updateStatus(@Validated @RequestBody NewsUpdateStatusDTO news) {
        return restTemplate.postForObject(MODULE_URL + "/updateSelective", news, ResultBean.class);
    }

    @ApiOperation("根据id查询具体记录")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "资讯公告信息", response = News.class)})
    @PostMapping("/selectById")
    public ResultBean selectById(@Validated @RequestBody NewsSelectOneDTO news) {
        return restTemplate.postForObject(MODULE_URL + "/selectById", news, ResultBean.class);
    }

}
