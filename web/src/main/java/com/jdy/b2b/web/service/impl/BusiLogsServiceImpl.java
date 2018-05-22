package com.jdy.b2b.web.service.impl;


import com.jdy.b2b.web.pojo.log.BusiLogs;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Objects;
import java.util.stream.Stream;

/**
 * Created by dugq on 2017/7/18.
 */
@Service
public class BusiLogsServiceImpl  extends BaseService implements com.jdy.b2b.web.service.BusiLogsService {

    private String addUrl;
    private String selectLogsUrl;

    @PostConstruct
    private void initUrl(){
        addUrl = controllCenterUrl + "busiLog/add";
        selectLogsUrl = controllCenterUrl + "busiLog/selectLogs";
    }

    @Override
    @Async
    public void add(BusiLogs[] busiLogs){
        Stream.of(busiLogs).forEach(busiLog -> {
            ResultBean resultBean = restTemplate.postForEntity(addUrl,busiLog, ResultBean.class).getBody();
            if(!Objects.equals(resultBean.getCode(),"0")){
                logger.error("日志插入失败。。。");
            }
        });
    }

    @Override
    public ResultBean selectLogsByModuleAndPid(String module, Long pid, Integer pageIndex) {
        MultiValueMap map = new LinkedMultiValueMap<String,String>();
        map.add("module",module);
        map.add("pid",pid);
        map.add("pageIndex",pageIndex);
        return restTemplate.postForObject(selectLogsUrl,map,ResultBean.class);
    }
}
