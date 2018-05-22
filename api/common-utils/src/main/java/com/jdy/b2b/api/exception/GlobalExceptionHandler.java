package com.jdy.b2b.api.exception;

import com.alibaba.fastjson.JSON;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.common.ThreadLocalUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.sql.SQLException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

/**
 * @Description 统一异常处理类(可根据异常类型定义不同的返回信息)
 * @Author yyf
 * @DateTime 2017/7/4 15:52
 */
@ControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class GlobalExceptionHandler {
    final Logger logger = LoggerFactory.getLogger(this.getClass());

    @ExceptionHandler(value = {RuntimeException.class, SQLException.class})
    @ResponseBody
    public ResultBean jsonErrorHandler(HttpServletRequest request, Exception e) throws Exception {

        Map map = new HashMap<>();
        /** Header部分 */
        Enumeration<?> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String key = (String) headerNames.nextElement();
            String value = request.getHeader(key);
            map.put(key, value);
        }

        /** Body 部分 */
        Object args = ThreadLocalUtil.getData(ControllerThrowExceptionAOP.CONTROLLER_EXCEPTION_THROW_KEY);
        if (args != null) {
            map.put("content", args);
        }

        logger.error(String.format("API Params and Content : {%s}", JSON.toJSONString(map)));
        logger.error("API 出错：", e);
        ResultBean r = null;
        if(e instanceof SQLException){
            r = new ResultBean("-1", "服务器出错了!");
        }else{
            r = new ResultBean("-1", e.getMessage());
        }
        r.setUrl(request.getRequestURL().toString());
        return r;
    }

}