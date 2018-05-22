package com.jdy.b2b.api.task;

import com.jdy.b2b.api.service.OnlineBillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Created by strict on 2017/9/14.
 */
@Component
public class BillTask {
    @Autowired
    private OnlineBillService onlineBillService;
    /**
     * 每天定时生成在线账单
     */
    @Scheduled(cron = "0 45 21 * * ?")
    public void  createOnlineBillTask(){
        onlineBillService.createOnlineBill();
    }
}
