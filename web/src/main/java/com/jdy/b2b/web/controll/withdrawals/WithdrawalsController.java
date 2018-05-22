package com.jdy.b2b.web.controll.withdrawals;

import com.jdy.b2b.web.pojo.withdrawals.WithdrawalsQueryVo;
import com.jdy.b2b.web.pojo.withdrawals.WithdrawalsSaveVo;
import com.jdy.b2b.web.pojo.withdrawals.WithdrawalsUpdateVo;
import com.jdy.b2b.web.service.WithdrawalsService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by yangcheng on 2017/9/12.
 */
@Api(value = "withdrawals", description = "提现预警")
@RestController
@RequestMapping("withdrawals")
public class WithdrawalsController extends BaseController {
    @Autowired
    private WithdrawalsService withdrawalsService;
    @ApiOperation(value = "新增",notes = "")
    @PostMapping("save")
    public ResultBean<Long> saveWithdrawals(@RequestBody @Validated WithdrawalsSaveVo vo){
        return withdrawalsService.saveWithdrawals(vo);
    }

    @ApiOperation(value = "处理",notes = "")
    @PostMapping("update")
    public ResultBean<String> updateWithdrawals(@RequestBody @Validated WithdrawalsUpdateVo vo){
        return withdrawalsService.updateWithdrawals(vo);
    }

    @ApiOperation(value = "列表",notes = "")
    @PostMapping("list")
    public ResultBean queryWithdrawalsPage(@RequestBody @Validated WithdrawalsQueryVo vo){
        return withdrawalsService.queryWithdrawalsPage(vo);
    }
}
