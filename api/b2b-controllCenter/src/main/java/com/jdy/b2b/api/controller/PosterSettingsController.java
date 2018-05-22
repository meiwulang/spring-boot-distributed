package com.jdy.b2b.api.controller;

import com.alibaba.fastjson.JSONObject;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.posterSettings.PosterSettings;
import com.jdy.b2b.api.service.PosterSettingsService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by dengbo on 2018/1/4.
 */
@RestController
@RequestMapping("/poster")
public class PosterSettingsController {

    private Logger logger = Logger.getLogger(PosterSettingsController.class);

    @Autowired
    private PosterSettingsService posterSettingsService;

    /**
     * 计算个人，销售组，公司的业绩,是否发送喜报
     * @param jsonObject
     * @return
     */
    @RequestMapping("/sendPoster")
    public ResultBean sendPoster(@RequestBody JSONObject jsonObject){
        logger.info("PosterSettingsController sendPoster params =======>"+jsonObject.toString());
        List<PosterSettings> list;
        try{
            if(StringUtils.isEmpty(jsonObject.get("orderNo"))){
                return ResultBean.getErrorResult("没有传入参数");
            }
            list = posterSettingsService.queryPosters(jsonObject.getString("orderNo"));
        }catch (Exception e){
            logger.error("PosterSettingsController sendPoster error =======>"+e.getMessage());
            return ResultBean.getErrorResult(e.getMessage());
        }
        return ResultBean.getSuccessResult(list);
    }
}
