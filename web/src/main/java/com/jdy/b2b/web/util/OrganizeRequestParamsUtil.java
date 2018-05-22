package com.jdy.b2b.web.util;

import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.Objects;

/**
 * Created by zhangfofa on 2017/11/21.
 */
public class OrganizeRequestParamsUtil {

    public static MultiValueMap buildMultiValueMap(String[] key, String[] value){
        MultiValueMap map = new LinkedMultiValueMap<String,String>();
        for(int i =0 ; i < key.length; i++){
            if(Objects.equals(value[i], null) || Objects.equals(value[i], "")) continue;
            map.add(key[i],value[i]);
        }
        return map;
    }
}
