package com.jdy.b2b.api.common;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
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
    @Value("${spring.accessKey:535bb3fdd47250f2dc7f2c617a835698}")
    public void setAccessKey(String accessKey) {
        StaticDateInYML.accessKey = accessKey;
    }
}
