package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.pojo.factoryTicket.FactoryTicket;
import com.jdy.b2b.web.service.FactoryTicketService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

/**
 * Created by dugq on 2018/4/11.
 */
@Service
public class FactoryTicketServiceImpl extends BaseService implements FactoryTicketService {

    private String addUrl;
    private String updateUrl;
    private String listUrl;
    private String getUrl;
    private String deleteUrl;

    @PostConstruct
    public void init(){
        listUrl = controllCenterUrl +"factoryTicket/list";
        addUrl = controllCenterUrl + "factoryTicket/add";
        updateUrl = controllCenterUrl + "factoryTicket/update";
        getUrl = controllCenterUrl + "factoryTicket/get/";
        deleteUrl = controllCenterUrl + "factoryTicket/delete/";
    }

    @Override
    public ResultBean insertFactoryTicket(FactoryTicket factoryTicket) {
        return restTemplate.postForEntity(addUrl, factoryTicket, ResultBean.class).getBody();
    }

    @Override
    public ResultBean updateFactoryTicket(FactoryTicket factoryTicket) {
        return restTemplate.postForEntity(updateUrl, factoryTicket, ResultBean.class).getBody();
    }

    @Override
    public ResultBean selectFactoryTicketList(FactoryTicket factoryTicket) {
        return restTemplate.postForEntity(listUrl, factoryTicket, ResultBean.class).getBody();
    }

    @Override
    public ResultBean get(Long id) {
        return restTemplate.getForEntity(getUrl+id, ResultBean.class).getBody();
    }

    @Override
    public ResultBean delete(Long id) {
        return restTemplate.getForEntity(deleteUrl+id, ResultBean.class).getBody();
    }
}
