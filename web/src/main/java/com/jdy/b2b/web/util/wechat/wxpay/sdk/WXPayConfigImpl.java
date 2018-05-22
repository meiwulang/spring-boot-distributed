package com.jdy.b2b.web.util.wechat.wxpay.sdk;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

import com.jdy.b2b.web.config.wechat.WechatConfiguration;
import com.jdy.b2b.web.config.wechat.WechatConfiguration2;

public class WXPayConfigImpl extends WXPayConfig{

    private byte[] certData;
    private String appId;
    private String mchId;
    private String payKey;

    private static WXPayConfigImpl INSTANCE;
    private static WXPayConfigImpl INSTANCE2;
    public static WXPay wxpay;
    public static WXPay wxpay2;

    private WXPayConfigImpl(WechatConfiguration wcf) throws Exception{
        appId=wcf.getAppId();
        mchId=wcf.getMchId();
        payKey=wcf.getPayKey();
    }

    private WXPayConfigImpl(WechatConfiguration2 wcf2) throws Exception{
        appId=wcf2.getAppId();
        mchId=wcf2.getMchId();
        payKey=wcf2.getPayKey();
    }

    public static WXPayConfigImpl getInstance(WechatConfiguration wcf) throws Exception{
        if (INSTANCE == null) {
            synchronized (WXPayConfigImpl.class) {
                if (INSTANCE == null) {
                    INSTANCE = new WXPayConfigImpl(wcf);
                    wxpay = new WXPay(INSTANCE);
                }
            }
        }
        return INSTANCE;
    }

    public static WXPayConfigImpl getInstance(WechatConfiguration2 wcf2) throws Exception{
        if (INSTANCE2 == null) {
            synchronized (WXPayConfigImpl.class) {
                if (INSTANCE2 == null) {
                    INSTANCE2 = new WXPayConfigImpl(wcf2);
                    wxpay2 = new WXPay(INSTANCE2);
                }
            }
        }
        return INSTANCE2;
    }

    public static WXPay getWXPay(){
        return wxpay;
    }

    public String getAppID() {
        return appId;
    }

    public String getMchID() {
        return mchId;
    }

    public String getKey() {
        return payKey;
    }

    public InputStream getCertStream() {
        ByteArrayInputStream certBis;
        certBis = new ByteArrayInputStream(this.certData);
        return certBis;
    }


    public int getHttpConnectTimeoutMs() {
        return 2000;
    }

    public int getHttpReadTimeoutMs() {
        return 10000;
    }

    IWXPayDomain getWXPayDomain() {
        return WXPayDomainSimpleImpl.instance();
    }

    public String getPrimaryDomain() {
        return "api.mch.weixin.qq.com";
    }

    public String getAlternateDomain() {
        return "api2.mch.weixin.qq.com";
    }

    @Override
    public int getReportWorkerNum() {
        return 1;
    }

    @Override
    public int getReportBatchSize() {
        return 2;
    }

}
