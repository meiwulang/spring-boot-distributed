package com.jdy.b2b.api.service;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.withdrawals.Withdrawals;
import com.jdy.b2b.api.model.withdrawals.WithdrawalsQueryDTO;
import com.jdy.b2b.api.vo.withdrawals.WithdrawalsUpdateVo;

import java.util.List;

/**
 * Created by yangcheng on 2017/9/8.
 */
public interface WithdrawalsService {
    int saveWithdrawals(Withdrawals withdrawals);

    ResultBean<String> updateWithdrawals(WithdrawalsUpdateVo vo);

    List<Withdrawals> queryWithdrawalsPage(WithdrawalsQueryDTO withdrawals);

}
