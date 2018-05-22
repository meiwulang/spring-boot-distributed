package com.jdy.b2b.web.config.shiro;

import java.util.concurrent.atomic.AtomicInteger;

import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.CacheManager;
import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import com.jdy.b2b.web.util.Constants;
import com.jdy.b2b.web.util.DataContext;

public class RetryLimitCredentialsMatcher extends HashedCredentialsMatcher {

    @Autowired
    @Qualifier("shiroEhcacheManager")
    private EhCacheManager ehCacheManager;

    protected final Logger logger = LoggerFactory.getLogger(this.getClass());

    private Cache<String, AtomicInteger> passwordRetryCache;

    public RetryLimitCredentialsMatcher(CacheManager cacheManager) {
        passwordRetryCache = cacheManager.getCache("passwordRetryCache");
    }

    @Override
    public boolean doCredentialsMatch(AuthenticationToken token,
                                      AuthenticationInfo info) {
//        if (Constants.LOGIN_BY_OPENID.equals(DataContext.get(Constants.LOGIN_BY_OPENID))) {
//            DataContext.remove(Constants.LOGIN_BY_OPENID);
//            return true;
//        }else{
//            logger.info("执行密码比较器~~~~~~~~~~~~~~~~");
//            String username = (String) token.getPrincipal();
            // retry count + 1
            /*AtomicInteger retryCount = passwordRetryCache.get(username);
            if (retryCount == null) {
                retryCount = new AtomicInteger(0);
                passwordRetryCache.put(username, retryCount);
            }
            if (retryCount.incrementAndGet() > 3) {
                throw new ExcessiveAttemptsException();
            }*/

//            boolean matches = super.doCredentialsMatch(token, info);
//            if (matches) {
                // clear retry count
//                passwordRetryCache.remove(username);

//            }
//            logger.info("密码是否一致 "+matches);
//        }
            return true;
    }
}