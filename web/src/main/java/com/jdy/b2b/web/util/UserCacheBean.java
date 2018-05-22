package com.jdy.b2b.web.util;

import com.jdy.b2b.web.config.shiro.ShiroRealm;
import com.jdy.b2b.web.pojo.user.UserResultDTO;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.apache.shiro.mgt.RealmSecurityManager;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

/**
 * Created by yangcheng on 2017/8/9.
 */
@Configuration
@Component("userCacheBean")
public class UserCacheBean {
    @Autowired
    @Qualifier("shiroEhcacheManager")
    private EhCacheManager ehCacheManager;

    public  void clearAuthen(){
        //清空该用户的认证信息
        RealmSecurityManager securityManager = (RealmSecurityManager) SecurityUtils.getSecurityManager();
        ShiroRealm shiroRealm = (ShiroRealm) securityManager.getRealms().iterator().next();
        shiroRealm.clearCachedAuthenticationInfo(SecurityUtils.getSubject().getPrincipals());
    }

    public  void clearAuthor(){
        //清空该用户的授权信息
        RealmSecurityManager securityManager = (RealmSecurityManager) SecurityUtils.getSecurityManager();
        ShiroRealm shiroRealm = (ShiroRealm) securityManager.getRealms().iterator().next();
        shiroRealm.clearCachedAuthorizationInfo(SecurityUtils.getSubject().getPrincipals());
    }

    public  void clearSession(){
        Subject subject = SecurityUtils.getSubject();
        subject.logout();
    }

    public  void clearCurrentUserCache(String uAccount){
        Cache<Object, Object> cache = ehCacheManager.getCache("currentUserCache");
        Subject subject = SecurityUtils.getSubject();
        UserResultDTO user = (UserResultDTO)cache.remove(uAccount);
    }


    public  void clearShiroCache(){
        clearAuthen();
        clearAuthor();
        clearSession();
    }
    public void clearAll(String uAccount){
        clearAuthen();
        clearAuthor();
        clearSession();
        clearCurrentUserCache(uAccount);
    }

}
