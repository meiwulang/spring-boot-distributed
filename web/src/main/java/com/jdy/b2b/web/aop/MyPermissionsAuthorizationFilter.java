package com.jdy.b2b.web.aop;

import com.jdy.b2b.web.pojo.module.Module;
import com.jdy.b2b.web.service.ModuleService;
import com.jdy.b2b.web.util.HttpUtils;
import com.jdy.b2b.web.util.ResultBean;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.util.StringUtils;
import org.apache.shiro.web.filter.authz.PermissionsAuthorizationFilter;
import org.apache.shiro.web.util.WebUtils;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import java.util.Objects;

/**
 * Created by dugq on 2017/11/1.
 */

public class MyPermissionsAuthorizationFilter extends PermissionsAuthorizationFilter {

    @Autowired
    private ModuleService moduleService;
    private static Map<String,Module> allModules;

    private  Map<String,Module> getAllModules(){
        if(Objects.isNull(allModules)){
            synchronized (MyPermissionsAuthorizationFilter.class){
                ResultBean<Map<String,Module>> resultBean = moduleService.selectAllModules();
                allModules = resultBean.getBody();
            }
        }
        return allModules;
    }

    public synchronized static void clearAllModules(){
        allModules = null;
    }



    @Override
    public boolean onPreHandle(ServletRequest request, ServletResponse response, Object mappedValue) throws Exception {
        return super.onPreHandle(request, response, mappedValue);
    }


    @Override
    public boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue) throws IOException {
        HttpServletRequest httpServletRequest = (HttpServletRequest)request;
        String requestURI = httpServletRequest.getRequestURI();
        Map<String, Module> allModules = getAllModules();
        for(String str : allModules.keySet()){
            String substring = str;
            if(str.indexOf("#")!=-1){
                 substring = str.substring(0, str.indexOf("#"));
            }
            if(requestURI.equals(substring)){
                Subject subject = SecurityUtils.getSubject();
                return  subject.isPermitted(requestURI);
            }
        }
        return true;
    }


    /*当拦截返回false的时候执行*/
    @Override
    protected void redirectToLogin(ServletRequest request, ServletResponse response) throws IOException {
        if(HttpUtils.isAjax((HttpServletRequest) request)){
            HttpUtils.writeJson2Response((HttpServletResponse) response,"登陆过期,请重新登录","-5");
            return;
        }
        HttpServletResponse httpServletResponse = (HttpServletResponse)response;
        httpServletResponse.sendRedirect(getLoginUrl());
    }

    @Override
    protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws IOException {
        Subject subject = this.getSubject(request, response);
        if (!subject.isAuthenticated()) {
            this.saveRequestAndRedirectToLogin(request, response);
        } else {
            String unauthorizedUrl = this.getUnauthorizedUrl();
            if (StringUtils.hasText(unauthorizedUrl)) {
                WebUtils.issueRedirect(request, response, unauthorizedUrl);
            } else {
               HttpServletResponse httpServletResponse = (HttpServletResponse)response;
                if(HttpUtils.isAjax((HttpServletRequest) request)){
                    HttpUtils.writeJson2Response(httpServletResponse,"noPermission","-10");
                }else{
                   httpServletResponse.sendRedirect("/noPermission.html");
                }
            }
        }

        return false;
    }


}
