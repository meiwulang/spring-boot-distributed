package com.jdy.b2b.api.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Created by yangcheng on 2017/7/5.
 */
@ConfigurationProperties
public abstract class BaseService {


    protected final Logger logger = LoggerFactory.getLogger(this.getClass());

    protected String syncProductListUrl;

    public String getSyncProductListUrl() {
        return syncProductListUrl;
    }

    public void setSyncProductListUrl(String syncProductListUrl) {
        this.syncProductListUrl = syncProductListUrl;
    }
}
