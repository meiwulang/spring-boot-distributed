package com.jdy.b2b.web.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.jdy.b2b.web.pojo.label.LabelDTO;
import com.jdy.b2b.web.pojo.schedule.TicketDTO;
import com.jdy.b2b.web.pojo.ticket.Ticket;
import com.jdy.b2b.web.pojo.ticket.TicketDefaultVo;
import com.jdy.b2b.web.pojo.ticket.TicketQueryVo;
import com.jdy.b2b.web.pojo.ticket.TicketSaveOrUpdateVo;
import com.jdy.b2b.web.service.TicketService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.Constants;
import com.jdy.b2b.web.util.JSONUtil;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by yangcheng on 2017/7/4.
 */
@Service
public class TicketServiceImpl extends BaseService implements TicketService{
    @Override
    public ResultBean queryForTicketListForPage(TicketQueryVo vo) {
        StringBuffer url = new StringBuffer(controllCenterUrl).append("ticket/list");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }

    @Override
    public ResultBean queryForOutTicketList(TicketQueryVo vo) {
        StringBuffer url = new StringBuffer(controllCenterUrl).append("ticket/outList");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }

    @Override
    public ResultBean<Ticket> queryForTicketById(Long id,Integer single) {
        StringBuffer url = new StringBuffer(controllCenterUrl).append("ticket/get/").append(id).append("/").append(single);
        ResultBean<Ticket> resultBean = restTemplate.getForEntity(url.toString(),ResultBean.class).getBody();
        return resultBean;
    }

    @Override
    public ResultBean<Long> saveTicketBash(List<TicketSaveOrUpdateVo> list) {
        StringBuffer url = new StringBuffer(controllCenterUrl).append("ticket/saveBash");
        Object o = JSONObject.toJSON(list);

        return restTemplate.postForEntity(url.toString(), list, ResultBean.class).getBody();
    }

    @Override
    public ResultBean<Long> saveOrUpdateTicket(TicketSaveOrUpdateVo vo) {
        StringBuffer url = new StringBuffer(controllCenterUrl).append("ticket/saveOrUpdate");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }

    @Override
    public ResultBean<Long> updateTicketOnly(TicketDefaultVo vo) {
        StringBuffer url = new StringBuffer(controllCenterUrl).append("ticket/updateTicketOnly");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }
}
