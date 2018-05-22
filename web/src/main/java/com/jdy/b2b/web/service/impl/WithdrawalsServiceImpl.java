package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.pojo.withdrawals.WithdrawalsQueryVo;
import com.jdy.b2b.web.pojo.withdrawals.WithdrawalsSaveVo;
import com.jdy.b2b.web.pojo.withdrawals.WithdrawalsUpdateVo;
import com.jdy.b2b.web.service.WithdrawalsService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

/**
 * Created by yangcheng on 2017/9/12.
 */
@Service
public class WithdrawalsServiceImpl extends BaseService implements WithdrawalsService {
    @Override
    public ResultBean<Long> saveWithdrawals(WithdrawalsSaveVo vo) {
        StringBuffer url = new StringBuffer(financeCenterUrl).append("withdrawals/save");
        return restTemplate.postForEntity(url.toString(),vo, ResultBean.class).getBody();
    }

    @Override
    public ResultBean<String> updateWithdrawals(WithdrawalsUpdateVo vo) {
        StringBuffer url = new StringBuffer(financeCenterUrl).append("withdrawals/update");
        return restTemplate.postForEntity(url.toString(),vo, ResultBean.class).getBody();
    }

    @Override
    public ResultBean queryWithdrawalsPage(WithdrawalsQueryVo vo) {
        StringBuffer url = new StringBuffer(financeCenterUrl).append("withdrawals/list");
        return restTemplate.postForEntity(url.toString(),vo, ResultBean.class).getBody();
    }
}
