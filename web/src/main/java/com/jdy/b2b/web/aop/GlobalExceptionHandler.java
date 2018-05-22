package com.jdy.b2b.web.aop;

import com.alibaba.fastjson.JSON;
import com.jdy.b2b.web.util.HttpUtils;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.ThreadLocalUtil;
import com.jdy.b2b.web.util.exception.NotLoginException;
import com.jdy.b2b.web.util.exception.ParamUnExpectException;
import com.jdy.b2b.web.util.exceptions.NoPermissionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * @Description 统一异常处理类(可根据异常类型定义不同的返回信息)
 * @Author yyf
 * @DateTime 2017/7/4 15:52
 */
@ControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class GlobalExceptionHandler {
    final Logger logger = LoggerFactory.getLogger(this.getClass());


    @ResponseStatus(HttpStatus.OK)
    @ExceptionHandler(NotLoginException.class)
    public Object notLoginException(HttpServletRequest request, Exception e,
                                    HttpServletResponse response) {
        if (HttpUtils.isAjax(request)) {
            logger.error("请先登陆~：" + e);
            HttpUtils.writeJson2Response(response, "请先登陆~", "-5");
            return null;
            //return "login";//所有请求都调回登录页
        } else {
            return "login";
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @ExceptionHandler(ParamUnExpectException.class)
    public Object paramUnExpectException(HttpServletRequest request, Exception e,
                                         HttpServletResponse response) {
        if (HttpUtils.isAjax(request)) {
            HttpUtils.writeJson2Response(response, e.getMessage(), "-1");
            return null;
            //return "login";//所有请求都调回登录页
        } else {
            return "error";
        }
    }

    @ResponseStatus(HttpStatus.OK)
    @ExceptionHandler(NoPermissionException.class)
    public Object paramUnExpectException(HttpServletRequest request, NoPermissionException e,
                                         HttpServletResponse response) {
        if (HttpUtils.isAjax(request)) {
            HttpUtils.writeJson2Response(response, e.getMessage(), "-10");
            return null;
            //return "login";//所有请求都调回登录页
        } else {
            return "error";
        }
    }


    @ExceptionHandler(value = RuntimeException.class)
    @ResponseBody
    public ResultBean jsonErrorHandler(HttpServletRequest request, RuntimeException e) throws Exception {

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

        try {
            logger.error(String.format("API Params and Content : {%s}", JSON.toJSONString(map)));
        } catch (Exception ex) {
            logger.error("ERROR", ex);
        }
        logger.error("API 出错：", e);
        ResultBean r = new ResultBean("-10", "出错了：" + e.getMessage());
        r.setUrl(request.getRequestURL().toString());
        return r;
    }

    /**
     * 400 - Bad Request
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({ConstraintViolationException.class})
    public Object handleServiceException(HttpServletRequest request,
                                         ConstraintViolationException e, HttpServletResponse response) {
        Set<ConstraintViolation<?>> violations = e.getConstraintViolations();
        ConstraintViolation<?> violation = violations.iterator().next();
        String message = violation.getMessage();
        logger.error(message);
        return getView(request, response, message);
    }

    private Object getView(HttpServletRequest request,
                           HttpServletResponse response, String message) {
        if (HttpUtils.isAjax(request)) {
            HttpUtils.writeJson2Response(response, message, "-1");
            return null;
        } else {
            request.setAttribute("error", message);
            return "error";
        }
    }



    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({MethodArgumentNotValidException.class})
    public Object handleServiceException(HttpServletRequest request,
                                         MethodArgumentNotValidException e, HttpServletResponse response) {
        StringBuilder message = new StringBuilder();
        for (FieldError error : e.getBindingResult().getFieldErrors()) {
            message.append(error.getDefaultMessage()).append(";");
        }
        return getView(request, response, message.toString());
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({BindException.class})
    public Object handleServiceException(HttpServletRequest request,
                                         BindException e, HttpServletResponse response) {
        StringBuilder message = new StringBuilder();
        for (FieldError error : e.getBindingResult().getFieldErrors()) {
            message.append(error.getDefaultMessage()).append(";");
        }
        return getView(request, response, message.toString());
    }

    /**
     * 500 - Internal Server Error
     */
    @ResponseStatus(HttpStatus.CREATED)
    @ExceptionHandler(Exception.class)
    public Object handleException(HttpServletRequest request, Exception e,
                                  HttpServletResponse response) {
        e.printStackTrace();
        logger.error(e.getMessage());
        if (HttpUtils.isAjax(request)) {
            HttpUtils.writeJson2Response(response, e.getMessage(), "-10");
            return null;
        } else {
            request.setAttribute("error", e.getMessage());
            return "error";
        }
    }

}