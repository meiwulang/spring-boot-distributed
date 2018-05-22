package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.withdrawals.WithdrawalsQueryVo;
import com.jdy.b2b.web.pojo.withdrawals.WithdrawalsSaveVo;
import com.jdy.b2b.web.pojo.withdrawals.WithdrawalsUpdateVo;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by yangcheng on 2017/9/12.
 */
public interface WithdrawalsService {
    ResultBean<Long> saveWithdrawals(WithdrawalsSaveVo vo);

    ResultBean<String> updateWithdrawals(WithdrawalsUpdateVo vo);

    ResultBean queryWithdrawalsPage(WithdrawalsQueryVo vo);
}
