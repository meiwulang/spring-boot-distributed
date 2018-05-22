package com.jdy.b2b.web.config.oss;

import net.sf.json.JSONObject;
import org.apache.commons.lang.time.DateFormatUtils;
import org.apache.commons.lang.time.DateUtils;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.Base64Utils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Created by pengmd on 2016/7/22.
 */
@Configuration
@ConfigurationProperties(prefix="spring.oss")
public class OssConfiguration {
    private String pic;
    private String endpoint;
    private String key;
    private String secret;

    public String getPic() {
        return pic;
    }

    public void setPic(String pic) {
        this.pic = pic;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public Map<String, String> getOssMap(Integer expirationMinuts, Integer maxKb) {
        Map<String, String> ossMap = new HashMap<String, String>();
        try {
            ossMap.put("host", pic); // 图片上传路径
            ossMap.put("accessid", key);
            ossMap.put("accesskey", secret);
            Map<String, Object> policyMap = new HashMap<String, Object>();
            // 设置policy有效时间
            Date now = DateUtils.addMinutes(new Date(), expirationMinuts);
            String expiration = DateFormatUtils.format(now, "yyyy-MM-dd HH:mm:ss.SSS").replace(" ", "T").concat("Z");
            policyMap.put("expiration", expiration);
            policyMap.put("conditions", new Object[] { new Object[] { "content-length-range", 0, 1048 * maxKb } });
            String policyJson = JSONObject.fromObject(policyMap).toString();
            String policyBase64 = Base64Utils.encodeToString(policyJson.getBytes("UTF-8"));
            ossMap.put("policy", policyBase64);
            // 设置签名
            SecretKeySpec signingKey = new SecretKeySpec(secret.getBytes("UTF-8"), "HmacSHA1");
            Mac mac = Mac.getInstance("HmacSHA1");
            mac.init(signingKey);
            byte[] rawHmac = mac.doFinal(policyBase64.getBytes("UTF-8"));
            String signature = Base64Utils.encodeToString(rawHmac);
            ossMap.put("signature", signature);
            ossMap.put("uuid", UUID.randomUUID().toString().replace("-", ""));
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return ossMap;
    }




}
