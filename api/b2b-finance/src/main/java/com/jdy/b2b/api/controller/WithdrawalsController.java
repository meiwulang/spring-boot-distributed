package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.withdrawals.Withdrawals;
import com.jdy.b2b.api.model.withdrawals.WithdrawalsQueryDTO;
import com.jdy.b2b.api.service.WithdrawalsService;
import com.jdy.b2b.api.vo.withdrawals.WithdrawalsQueryVo;
import com.jdy.b2b.api.vo.withdrawals.WithdrawalsSaveVo;
import com.jdy.b2b.api.vo.withdrawals.WithdrawalsUpdateVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

/**
 * Created by yangcheng on 2017/9/8.
 */
@RestController
@RequestMapping("withdrawals")
public class WithdrawalsController {
    @Autowired
    private WithdrawalsService withdrawalsService;

    @PostMapping("save")
    public ResultBean<Long> saveWithdrawals(@RequestBody WithdrawalsSaveVo vo){
        Withdrawals withdrawals = JSONUtil.trans(vo, Withdrawals.class);
        //执行新增
        withdrawals.setCreateTime(new Date());
        withdrawals.setCreateUser(vo.getPuserId());
        withdrawals.setwInAmount(withdrawals.getwBillAmount().subtract(withdrawals.getwSeviceCharge()));
        withdrawals.setwStatus(Constants.WITHDRAWALS_HANDLING);
        int result = withdrawalsService.saveWithdrawals(withdrawals);
        return result>0?ResultBean.getSuccessResult(withdrawals.getId()):new ResultBean<Long>("-1","新增失败");
    }

    /**
     * 处理 撤销 然后生成待处理新纪录
     * @param vo
     * @return
     */
    @PostMapping("update")
    public ResultBean<String> updateWithdrawals(@RequestBody WithdrawalsUpdateVo vo){
        return withdrawalsService.updateWithdrawals(vo);
    }


    @PostMapping("list")
    public ResultBean<PageInfo<Withdrawals>> queryWithdrawalsPage(@RequestBody WithdrawalsQueryVo vo){
        if (vo.getCurrPage() != null && vo.getPageSize() != null) {
            PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
        }
        WithdrawalsQueryDTO withdrawals = JSONUtil.trans(vo, WithdrawalsQueryDTO.class);
        List<Withdrawals> list = withdrawalsService.queryWithdrawalsPage(withdrawals);
        return ResultBean.getSuccessResult(new PageInfo<Withdrawals>(list));
    }


    /**
     * 更新请求提现时间  修改状态为成功或失败
     *
     * 修改账单或订单金额??
     */

}
