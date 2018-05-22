package com.jdy.b2b.web.controll.frontAPIs;

import com.jdy.b2b.web.aop.MyLogAop;
import com.jdy.b2b.web.service.PosterSettingsService;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * 手动通知喜报
 * Created by pengmd on 2018/1/10.
 */
@Controller
@RequestMapping("poster")
public class ManualPosterController {

    @Autowired
    PosterSettingsService posterSettingsService;
    protected static final org.slf4j.Logger logger = LoggerFactory
            .getLogger(MyLogAop.class);
    /**
     * 手动通知喜报
     * @return
     */
    @RequestMapping(value = "noticePoster" , method = RequestMethod.POST)
    @ResponseBody
    public String noticePoster(HttpServletRequest request){
        try {
            String orderNo = request.getParameter("orderNo");
            String type = request.getParameter("type");
            if (StringUtils.isNotEmpty(orderNo)) {
                logger.error("进入手动推送喜报");
                logger.error("订单编号：" + orderNo);
                posterSettingsService.sendPoster(orderNo, Integer.valueOf(type));
                logger.error("手动推送喜报完成：");
                return "success";
            } else {
                return "error";
            }
        }catch(Exception e){
            logger.error(e.toString());
            return "error";
        }
    }
}
