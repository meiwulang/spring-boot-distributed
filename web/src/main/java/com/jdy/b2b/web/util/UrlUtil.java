package com.jdy.b2b.web.util;

import java.util.Base64;

/**
 * Created by zhangfofa on 2017/12/1.
 */
public class UrlUtil {
    private final static String ENCODE = "UTF-8";

    /**
     * URL 解码
     *
     * @return String
     */
    public static String getURLDecoderString(String str) {
        if (null == str) {
            return "";
        }
        return new String(Base64.getUrlDecoder().decode(str));
    }

    /**
     * URL 转码
     *
     * @return String
     */
    public static String getURLEncoderString(String str) {
        if (null == str) {
            return "";
        }
        return Base64.getUrlEncoder().encodeToString(str.getBytes());
    }
}
