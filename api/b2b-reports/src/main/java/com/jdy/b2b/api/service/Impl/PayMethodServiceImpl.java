package com.jdy.b2b.api.service.Impl;

import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.dao.reports.PayMethodMapper;
import com.jdy.b2b.api.model.reports.PayMethodQueryDO;
import com.jdy.b2b.api.model.reports.PayMethodQueryDTO;
import com.jdy.b2b.api.service.PayMethodService;
import com.jdy.b2b.api.vo.PayMethodResultDO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by yangcheng on 2017/9/18.
 */
@Service
public class PayMethodServiceImpl extends BaseService implements PayMethodService{
    @Autowired
    private PayMethodMapper payMethodMapper;

    @Override
    public List<PayMethodResultDO> queryPayMethodList(PayMethodQueryDTO trans) {
        List<PayMethodQueryDO> list =  payMethodMapper.queryPayMethodList(trans);
        //获取有数据的大区
        Set<String> cGroups = new HashSet<String>();
        list.stream().forEach(p->{
            if(p.getcGroup() !=null){
                cGroups.add(p.getcGroup());
            }
        });
        List<PayMethodResultDO> resultList = new ArrayList<PayMethodResultDO>();
        cGroups.stream().forEach(g->{
            PayMethodResultDO result = new PayMethodResultDO();
            result.setcGroup(g);
            list.stream().forEach(p->{
                if(g.equals(p.getcGroup())){
                    switch (p.getFlag()){
                        case 1:
                            result.setOnlineTotal(p.getTotalPrice());
                            result.setOnlineCounts(p.getOrderCounts());
                            break;
                        case 2:
                            result.setCreditTotal(p.getTotalPrice());
                            result.setCreditCounts(p.getOrderCounts());
                            break;
                        case 3:
                            result.setOfflineTotal(p.getTotalPrice());
                            result.setOfflineCounts(p.getOrderCounts());
                            break;
                        case 4:
                            result.setUnconfirmedTotal(p.getTotalPrice());
                            result.setUnconfirmedCounts(p.getOrderCounts());
                            break;
                        case 5:
                            result.setUnPayedTotal(p.getTotalPrice());
                            result.setUnPayedCounts(p.getOrderCounts());
                            break;
                        case 6:
                            result.setTotal(p.getTotalPrice());
                            result.setCounts(p.getOrderCounts());
                            break;
                    }
                }
            });
            resultList.add(result);
        });

        return resultList;
    }
}
