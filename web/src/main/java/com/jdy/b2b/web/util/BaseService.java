package com.jdy.b2b.web.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.web.client.RestTemplate;

/**
 * Created by yangcheng on 2017/7/5.
 */
@ConfigurationProperties
public abstract class BaseService {
    @Autowired
    @Qualifier("customRestTemplate")
    protected RestTemplate restTemplate;

    protected String controllCenterUrl;
    protected String systemCenterUrl;
    protected String financeCenterUrl;
    protected String reportsCenterUrl;
    protected String salesCenterUrl;
    @Value("${spring.distributionSystemUrl}")
    protected String distributionSystemUrl;

    public String getFinanceCenterUrl() {
        return financeCenterUrl;
    }

    public void setFinanceCenterUrl(String financeCenterUrl) {
        this.financeCenterUrl = financeCenterUrl;
    }

    public String getReportsCenterUrl() {
        return reportsCenterUrl;
    }

    public void setReportsCenterUrl(String reportsCenterUrl) {
        this.reportsCenterUrl = reportsCenterUrl;
    }

    public String getSalesCenterUrl() {
        return salesCenterUrl;
    }

    public void setSalesCenterUrl(String salesCenterUrl) {
        this.salesCenterUrl = salesCenterUrl;
    }

    protected final Logger logger = LoggerFactory.getLogger(this.getClass());

    public String getControllCenterUrl() {
        return controllCenterUrl;
    }

    public void setControllCenterUrl(String controllCenterUrl) {
        this.controllCenterUrl = controllCenterUrl;
    }

    public String getSystemCenterUrl() {
        return systemCenterUrl;
    }

    public void setSystemCenterUrl(String systemCenterUrl) {
        this.systemCenterUrl = systemCenterUrl;
    }
}
