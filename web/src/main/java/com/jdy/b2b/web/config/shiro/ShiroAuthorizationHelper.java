package com.jdy.b2b.web.config.shiro;

import com.jdy.b2b.web.pojo.user.User;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.Serializable;

/**
 * Created by yangcheng on 2017/7/24.
 */
public class ShiroAuthorizationHelper {
    @Autowired
    private static EhCacheManager cacheManager;

    private static Logger log = LoggerFactory.getLogger(ShiroAuthorizationHelper.class);


    /**
     * 清除用户的授权信息
     * @param username
     */
    public static void clearAuthorizationInfo(String username){
        log.debug("clear the " + username + " authorizationInfo");

        ShiroRealm realm = new ShiroRealm();
        //ShiroCasRealm.authorizationCache 为shiro自义cache名(shiroCasRealm为我们定义的reaml类的类名)
        Cache<Object, Object> cache = cacheManager.getCache(realm.getName()+".authorizationCache");
        cache.remove(username);
    }

    /**
     * 清除当前用户的授权信息
     */
    public static void clearAuthorizationInfo(){
        if(SecurityUtils.getSubject().isAuthenticated()){
            Subject subject = SecurityUtils.getSubject();
            User user = (User)subject.getSession().getAttribute("user");
            clearAuthorizationInfo(user.getuAccount());
        }
    }

    /**清除session(认证信息)
     * @param JSESSIONID
     */
    public static void clearAuthenticationInfo(Serializable JSESSIONID){
        log.debug("clear the session " + JSESSIONID);
        //shiro-activeSessionCache 为shiro自义cache名，该名在org.apache.shiro.session.mgt.eis.CachingSessionDAO抽象类中定义
        //如果要改变此名，可以将名称注入到sessionDao中，例如注入到CachingSessionDAO的子类EnterpriseCacheSessionDAO类中
        Cache<Object, Object> cache = cacheManager.getCache("shiro-activeSessionCache");
        cache.remove(JSESSIONID);
    }


}
