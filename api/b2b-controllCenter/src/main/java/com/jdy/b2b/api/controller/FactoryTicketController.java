package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.factoryTicket.FactoryTicket;
import com.jdy.b2b.api.service.FactoryTicketService;
import com.jdy.b2b.api.service.ProductCostingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

/**
 * Created by dugq on 2018/4/11.
 */
@RestController
@RequestMapping("factoryTicket")
public class FactoryTicketController {
    @Autowired
    private FactoryTicketService factoryTicketService;
    @Autowired
    private ProductCostingService productCostingService;

    @RequestMapping("add")
    public ResultBean insertFactoryTicket(@RequestBody FactoryTicket factoryTicket) {
        factoryTicketService.insertFactoryTicket(factoryTicket);
        return ResultBean.getSuccessResult();
    }
    @RequestMapping("update")
    public ResultBean updateFactoryTicket(@RequestBody FactoryTicket factoryTicket) {
        factoryTicketService.updateFactoryTicket(factoryTicket);
        return ResultBean.getSuccessResult();
    }
    @RequestMapping("list")
    public ResultBean selectFactoryTicketList(@RequestBody FactoryTicket factoryTicket) {
        BigDecimal bigDecimal = productCostingService.selectNewestCostUnitPriceByProductId(factoryTicket.getProductId());
        List<FactoryTicket> factoryTickets = factoryTicketService.selectFactoryTicketList(factoryTicket);
        factoryTickets.forEach(factoryTicket1 -> factoryTicket1.setCostPrice(bigDecimal));
        PageInfo page = new PageInfo(factoryTickets);
        return ResultBean.getSuccessResult(page);
    }

    @RequestMapping("delete/{id}")
    public ResultBean delete(@PathVariable Long id) {
        factoryTicketService.delete(id);
        return ResultBean.getSuccessResult();
    }

    @RequestMapping("get/{id}")
    public ResultBean get(@PathVariable Long id) {
        FactoryTicket factoryTicket = factoryTicketService.selectByPrimaryKey(id);
        BigDecimal bigDecimal = productCostingService.selectNewestCostUnitPriceByProductId(factoryTicket.getProductId());
        factoryTicket.setCostPrice(bigDecimal);
        return ResultBean.getSuccessResult(factoryTicket);
    }
}
