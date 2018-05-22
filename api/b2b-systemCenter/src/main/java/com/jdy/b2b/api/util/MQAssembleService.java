package com.jdy.b2b.api.util;

import cn.jdytrip.sp.data.warehouse.client.MQClient;
import cn.jdytrip.sp.data.warehouse.entity.MQRequestModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * MQ组装类
 * @author Darker on 2018/01/26
 */
@Component
public class MQAssembleService {

    @Value("${mq.appId}")
    String appId;
    @Value("${mq.appSecret}")
    String appSecret;
    @Value("${mq.requestUrl}")
    String requestUrl;

    public MQClient getMQClinet(){
        MQRequestModel mqRequestModel = AssembleReq();
        return new MQClient(mqRequestModel);
    }



    MQRequestModel AssembleReq(){
        MQRequestModel mqReq = new MQRequestModel();
        mqReq.setRequestUrl(requestUrl);
        mqReq.setAppSecret(appSecret);
        mqReq.setAppId(appId);
        return mqReq;
    }
}
