package com.jdy.b2b.web.util;

import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

/**
 * Created by dugq on 2017/7/21.
 */
public class PhoneMessageUtils {

    private String genarateCode() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            char c = (char) (randomInt(0, 9) + '0');
            sb.append(c);
        }
        return sb.toString();
    }

    /**
     * 生成随机数
     */
    private int randomInt(int from, int to) {
        Random r = new Random();
        return from + r.nextInt(to - from);
    }

    public static String sendMessage(String phone, String content) {
        /*短信接口URL提交地址*/
        String url = "";

        Map<String, String> params = new HashMap<String, String>();

        params.put("", "用户账号");
        params.put("", "用户密码");
        params.put("短信类别编号", "");
        params.put("", "扩展编号");

        //手机号码，多个号码使用英文逗号进行分割
        params.put("phones", "");
        //将短信内容进行URLEncoder编码
        params.put("content", URLEncoder.encode(content));

        return "";
    }

}
