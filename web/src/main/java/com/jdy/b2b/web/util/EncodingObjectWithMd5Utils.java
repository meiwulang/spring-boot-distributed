package com.jdy.b2b.web.util;

import com.alibaba.fastjson.JSONObject;
import com.jdy.b2b.web.aop.StaticDateInYML;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.*;

/**
 * Created by dugq on 2017/10/12.
 */
public class EncodingObjectWithMd5Utils {
    private static final List<String> ignoredKeys = new ArrayList<String>();
    static {
        ignoredKeys.add("curPage");
        ignoredKeys.add("pageSize");
    }

    private EncodingObjectWithMd5Utils() {
    }

    public static <T> JSONObject encoding(T t){
        JSONObject jsonObject = new JSONObject();
        Map ignoredMap = new HashMap();
        Map<String, Object> properties = new HashMap<>();
        if(t instanceof Map){

            properties.putAll((Map<String, Object>) t);
        }else{
            try {
                properties.putAll(PropertyUtils.describe(t));
            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException(e);
            }
        }
        String time = Long.toString(new Date().getTime());
        Map<String,Object> map = new HashMap();
        map.putAll(properties);
        map.put("time",time);
        List keys = new LinkedList();
        map.forEach((key,value)->{
            if(ignoredKeys.contains(key)){
                ignoredMap.put(key,value);
                return;
            }
            if(value instanceof String){
                String v = (String)value;
                if(!StringUtils.isBlank(v)){
                    keys.add(key);
                    jsonObject.put(key,value);
                }
            }
            else if(!Objects.isNull(value)){
                keys.add(key);
                jsonObject.put(key,value);
            }
        });
        Collections.sort(keys);
        StringBuilder sb = new StringBuilder();
        keys.forEach(key -> sb.append(key+"=").append(map.get(key)).append("&"));
        sb.append("key=").append(StaticDateInYML.accessKey);
        System.out.println("md5("+sb.toString()+")");
        String md5Code = MD5.GetMD5Code(sb.toString());
        jsonObject.put("accesstoken",md5Code);
        jsonObject.putAll(ignoredMap);
        return jsonObject;
    }

    public static void main(String[] args) {
        Map map = new HashMap();
        map.put("publicId","wx4f8c668abdd46305");
        map.put("searchParam","");
        JSONObject encoding = encoding(map);
        System.out.println(encoding.get("accesstoken"));
//        696608afe24c35d6f1767ca209813442
    }
}
