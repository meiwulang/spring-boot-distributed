package com.jdy.b2b.api.common;

import com.alibaba.fastjson.JSONObject;
import org.apache.commons.lang3.*;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.CollectionUtils;

import java.io.Serializable;
import java.util.*;

/**
 * Created by dugq on 2017/10/12.
 */
public class EncodingObjectWithMd5Utils implements Serializable{
    private static final List<String> ignoredKeys = new ArrayList<String>();
    private static final long serialVersionUID = 6997401677274925567L;
    private static final Logger logger = LoggerFactory.getLogger(EncodingObjectWithMd5Utils.class);

    static {
        ignoredKeys.add("serialVersionUID");
    }

    private EncodingObjectWithMd5Utils() {
    }

    public static <T> JSONObject encoding(T t){
        JSONObject jsonObject = new JSONObject();
        Map<String, Object> properties;
        if(t instanceof Map){
            properties = (Map<String, Object>) t;
        }else{
            properties = BeanUtils.getProperties(t);
        }
        String time = Long.toString(new Date().getTime());
        Map<String,Object> map = new HashMap();
        map.putAll(properties);
        map.put("time",time);
        List keys = new LinkedList();
        map.forEach((key,value)->{
            if(ignoredKeys.contains(key) || Objects.isNull(value)){
                return;
            }
            else if(value instanceof String){
                String v = (String)value;
                if(!org.apache.commons.lang3.StringUtils.isBlank(v)){
                    keys.add(key);
                    jsonObject.put(key,value);
                }
                return;
            }else if(value instanceof List || value instanceof Set){
                Object[] as =((Collection)value).toArray(new Object[0]);
                String STR = StringUtils.join(as, ",");
                keys.add(key);
                jsonObject.put(key,STR);
                return;
            }else if(value.getClass().isArray()){
                String STR =  org.apache.commons.lang3.StringUtils.join(value,",");
                keys.add(key);
                jsonObject.put(key,STR);
                return;
            }
            else if(!Objects.isNull(value)){
                keys.add(key);
                jsonObject.put(key,value);
                return;
            }

        });
        Collections.sort(keys);
        StringBuilder sb = new StringBuilder();
        keys.forEach(key -> sb.append(key+"=").append(jsonObject.get(key)).append("&"));
        sb.append("key=").append(StaticDateInYML.accessKey);
        logger.info("EncodingObjectWithMd5Utils before MD5: "+sb.toString());
        String md5Code = MD5.GetMD5Code(sb.toString());
        jsonObject.put("accesstoken",md5Code);
        map.forEach((key,value)-> jsonObject.put(key,map.get(key)));
        return jsonObject;
    }

    public static void main(String[] args) {
        Map map = new HashMap();
        JSONObject encoding = encoding(map);
        System.out.println();
    }
}
