package com.jdy.b2b.web.pojo.distributionSystemEntity.login;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * jwt相关配置
 *
 */
@Configuration
@ConfigurationProperties(prefix = JwtProperties.JWT_PREFIX)
public class JwtProperties {

    public static final String JWT_PREFIX = "jwt";

    public static String header = "Authorization";

    public static String secret = "mySecret";

    public static Long expiration = 3600l;

    public static String authPath = "/auth/**";

    public static String ignorePath = "/pub/**";

    public static String wxNotice = "/wx/**";

    public void setHeader(String header) {
        JwtProperties.header = header;
    }

    public void setSecret(String secret) {
        JwtProperties.secret = secret;
    }

    public void setExpiration(Long expiration) {
        JwtProperties.expiration = expiration;
    }

    public void setAuthPath(String authPath) {
        JwtProperties.authPath = authPath;
    }

    public void setIgnorePath(String ignorePath) {
        JwtProperties.ignorePath = ignorePath;
    }
}
