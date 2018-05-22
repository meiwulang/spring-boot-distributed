package com.jdy.b2b.web.aop;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

/**
 * Created by dugq on 2017/10/30.
 */
@Component
@ConfigurationProperties
public class StaticDateInYML {

    public static String accessKey;

    public String getAccessKey() {
        return accessKey;
    }
    @Value("${spring.accessKey}")
    public void setAccessKey(String accessKey) {
        StaticDateInYML.accessKey = accessKey;
    }
}
