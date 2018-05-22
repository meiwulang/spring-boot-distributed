package com.jdy.b2b.api.common;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 短信API服务调用示例代码 － 聚合数据 在线接口文档：http://www.juhe.cn/docs/54
 **/
@Component
public class SMSUtil {
    public static final String DEF_CHATSET = "UTF-8";
    public static final int DEF_CONN_TIMEOUT = 30000;
    public static final int DEF_READ_TIMEOUT = 30000;
    public static String userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
    private static String sendUrl = "http://v.juhe.cn/sms/send";// 请求接口地址
    private static String blackUrl = "http://v.juhe.cn/sms/black";// 屏蔽词检查地址
    // 配置您申请的KEY
    @Value("${sms.appkey}")
    public static final String APPKEY = "56e055c6d992441576dce3ab43efc34c";

    // 1.屏蔽词检查
    public static void getRequest1() {
        String result = null;

        Map<String, Object> params = new HashMap<>();// 请求参数
        params.put("word", "");// 需要检测的短信内容，需要UTF8 URLENCODE
        params.put("key", APPKEY);// 应用APPKEY(应用详细页查询)

        try {
            result = net(blackUrl, params, "GET");
            JSONObject object = JSONObject.parseObject(result);
            if (object.getIntValue("error_code") == 0) {
                System.out.println(object.get("result"));
            } else {
                System.out.println(
                        object.get("error_code") + ":" + object.get("reason"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // 2.发送短信
    public static String sendSMS(String phone, String tpl_id, String tpl_value)
            throws Exception {
        if (!isMobile(phone)) {
            Map map = new HashMap();
            map.put("error_code", "-1");
            map.put("reason", "【" + phone + "】不是正确的手机号码!");
            return JSON.toJSONString(map);
        }

        Map<String, Object> params = new HashMap<>();// 请求参数
        params.put("mobile", phone);// 接收短信的手机号码
        params.put("tpl_id", tpl_id);// 短信模板ID，请参考个人中心短信模板设置
        params.put("tpl_value", tpl_value);//
        // 变量名和变量值对。如果你的变量名或者变量值中带有#&=中的任意一个特殊符号，请先分别进行urlencode编码后再传递，<a
        // href="http://www.juhe.cn/news/index/id/50"
        // target="_blank">详细说明></a>
        params.put("key", APPKEY);// 应用APPKEY(应用详细页查询)
        params.put("dtype", "json");// 返回数据的格式,xml或json，默认json

        return net(sendUrl, params, "GET");
    }

    public static boolean isMobile(final String str) {
        Pattern p = null;
        Matcher m = null;
        boolean b = false;
        p = Pattern.compile("^[1][3,4,5,7,8][0-9]{9}$"); // 验证手机号
        m = p.matcher(str);
        b = m.matches();
        return b;
    }

    /**
     * @param strUrl 请求地址
     * @param params 请求参数
     * @param method 请求方法
     * @return 网络请求字符串
     * @throws Exception
     */
    public static String net(String strUrl, Map<String, Object> params,
                             String method) throws Exception {
        HttpURLConnection conn = null;
        BufferedReader reader = null;
        String rs = null;
        try {
            StringBuffer sb = new StringBuffer();
            if (method == null || method.equals("GET")) {
                strUrl = strUrl + "?" + urlencode(params);
            }
            URL url = new URL(strUrl);
            conn = (HttpURLConnection) url.openConnection();
            if (method == null || method.equals("GET")) {
                conn.setRequestMethod("GET");
            } else {
                conn.setRequestMethod("POST");
                conn.setDoOutput(true);
            }
            conn.setRequestProperty("User-agent", userAgent);
            conn.setUseCaches(false);
            conn.setConnectTimeout(DEF_CONN_TIMEOUT);
            conn.setReadTimeout(DEF_READ_TIMEOUT);
            conn.setInstanceFollowRedirects(false);
            conn.connect();
            if (params != null && method.equals("POST")) {
                try {
                    DataOutputStream out = new DataOutputStream(
                            conn.getOutputStream());
                    out.writeBytes(urlencode(params));
                } catch (Exception e) {
                    // TODO: handle exception
                }
            }
            InputStream is = conn.getInputStream();
            reader = new BufferedReader(new InputStreamReader(is, DEF_CHATSET));
            String strRead = null;
            while ((strRead = reader.readLine()) != null) {
                sb.append(strRead);
            }
            rs = sb.toString();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (reader != null) {
                reader.close();
            }
            if (conn != null) {
                conn.disconnect();
            }
        }
        return rs;
    }

    // 将map型转为请求参数型
    @SuppressWarnings("rawtypes")
    public static String urlencode(Map<String, Object> data) {
        StringBuilder sb = new StringBuilder();
        for (Map.Entry i : data.entrySet()) {
            try {
                sb.append(i.getKey()).append("=")
                        .append(URLEncoder.encode(i.getValue() + "", "UTF-8"))
                        .append("&");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }
        return sb.toString();
    }
}