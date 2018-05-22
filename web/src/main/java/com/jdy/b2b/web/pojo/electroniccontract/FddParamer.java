package com.jdy.b2b.web.pojo.electroniccontract;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Created by zhangfofa on 2017/12/13.
 */
@Configuration
@ConfigurationProperties(prefix="spring.fadada")
public class FddParamer {
    private String url;

    private String appId;

    private String appSecret;

    private String version;

    private String companyName;

    private String customerId;

    private String returnUrl;

    private String notifyUrl;

    private String temporaryFileSavePath;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getAppId() {
        return appId;
    }

    public void setAppId(String appId) {
        this.appId = appId;
    }

    public String getAppSecret() {
        return appSecret;
    }

    public void setAppSecret(String appSecret) {
        this.appSecret = appSecret;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getReturnUrl() {
        return returnUrl;
    }

    public void setReturnUrl(String returnUrl) {
        this.returnUrl = returnUrl;
    }

    public String getNotifyUrl() {
        return notifyUrl;
    }

    public void setNotifyUrl(String notifyUrl) {
        this.notifyUrl = notifyUrl;
    }

    public String getTemporaryFileSavePath() {
        return temporaryFileSavePath;
    }

    public void setTemporaryFileSavePath(String temporaryFileSavePath) {
        this.temporaryFileSavePath = temporaryFileSavePath;
    }
}
