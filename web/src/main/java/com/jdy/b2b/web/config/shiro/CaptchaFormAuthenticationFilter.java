package com.jdy.b2b.web.config.shiro;

import com.jdy.b2b.web.util.HttpUtils;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by yangcheng on 2017/7/24.
 */
public class CaptchaFormAuthenticationFilter extends FormAuthenticationFilter {
  
    private static final Logger log = LoggerFactory
            .getLogger(CaptchaFormAuthenticationFilter.class);

    //最后执行的方法，放在finally中
    @Override
    protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws Exception {
        return super.onAccessDenied(request, response);
    }

    /*判断是否登陆*/
    @Override
    protected boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue) {
       return  isLoginRequest(request, response) || isUserLogin((HttpServletRequest)request,(HttpServletResponse)response);
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

    private boolean isUserLogin(HttpServletRequest request,HttpServletResponse response){
        Subject subject = getSubject(request, response);
        if(!subject.isAuthenticated()){
            return false;
        }
//        原意：防止拦截请求获取sessionID直接越过登陆，请求服务器 。 但由于手机端通常动态ip，并且浏览器版本不好获取，先注释
//        Session session = subject.getSession(false);
//        Object user_ip = session.getAttribute("user_ip");
//        Object user_browser = session.getAttribute("user_browser");
//        if(!HttpUtils.getIpAddr(request).equals(user_ip) || !HttpUtils.getBrowser(request).equals(user_browser)){
//            return false;
//        }
        return true;
    }

}  