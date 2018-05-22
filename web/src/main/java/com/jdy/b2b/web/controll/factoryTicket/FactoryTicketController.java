package com.jdy.b2b.web.controll.factoryTicket;

import com.jdy.b2b.web.pojo.factoryTicket.FactoryTicket;
import com.jdy.b2b.web.service.FactoryTicketService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

/**
 * Created by dugq on 2018/4/11.
 */
@RestController
@RequestMapping("factoryTicket")
public class FactoryTicketController {
    @Autowired
    private FactoryTicketService factoryTicketService;

    @RequestMapping("add")
    public ResultBean insertFactoryTicket(@RequestBody FactoryTicket factoryTicket) {
        return factoryTicketService.insertFactoryTicket(factoryTicket);
    }
    @RequestMapping("update")
    public ResultBean updateFactoryTicket(@RequestBody FactoryTicket factoryTicket) {
        return factoryTicketService.updateFactoryTicket(factoryTicket);
    }
    @RequestMapping("list")
    public ResultBean selectFactoryTicketList(@RequestBody FactoryTicket factoryTicket) {
        return factoryTicketService.selectFactoryTicketList(factoryTicket);
    }

    @RequestMapping("get/{id}")
    public ResultBean get(@PathVariable Long id) {
        return factoryTicketService.get(id);
    }

    @RequestMapping("delete/{id}")
    public ResultBean delete(@PathVariable Long id) {
        return factoryTicketService.delete(id);
    }
}