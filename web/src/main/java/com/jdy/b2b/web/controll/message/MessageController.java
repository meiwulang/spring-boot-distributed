package com.jdy.b2b.web.controll.message;

import com.jdy.b2b.web.util.ResultBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

/**
 * Created by dugq on 2017/7/21.
 */
@Controller
@RequestMapping
@ConfigurationProperties
public class MessageController {
    @Autowired
    @Qualifier("customRestTemplate")
    protected RestTemplate restTemplate;

    protected String messageServiceUrl;

    @RequestMapping("sendMessage")
    @ResponseBody
    public ResultBean SendMessage(String content,String phone,Integer model){
        MultiValueMap map = new LinkedMultiValueMap<String,String>();
        return restTemplate.postForObject(messageServiceUrl,map,ResultBean.class);
    }

    public String getMessageServiceUrl() {
        return messageServiceUrl;
    }

    public void setMessageServiceUrl(String messageServiceUrl) {
        this.messageServiceUrl = messageServiceUrl;
    }
}
