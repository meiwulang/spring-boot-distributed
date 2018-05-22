package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.transfer.Transfer;
import com.jdy.b2b.api.model.transfer.TransferQueryDTO;
import com.jdy.b2b.api.service.TransferService;
import com.jdy.b2b.api.vo.transfer.TransferQueryVo;
import com.jdy.b2b.api.vo.transfer.TransferSaveVo;
import com.jdy.b2b.api.vo.transfer.TransferUpdateVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by yangcheng on 2017/9/7.
 */
@RestController
@RequestMapping("transfer")
public class TransferController extends BaseController {
    @Autowired
    private TransferService transferService;

    @PostMapping("save")
    public ResultBean<Long> saveTransfer(@RequestBody TransferSaveVo vo){
        return transferService.saveTransfer(vo);
    }

    @PostMapping("update")
    public ResultBean<String> handleTransfer(@RequestBody TransferUpdateVo vo){
        return transferService.handleTransfer(vo);
    }

    @PostMapping("list")
    public ResultBean<PageInfo<Transfer>> queryTransferPage(@RequestBody TransferQueryVo vo){
        if (vo.getCurrPage() != null && vo.getPageSize() != null) {
            PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
        }
        TransferQueryDTO transfer = JSONUtil.trans(vo, TransferQueryDTO.class);
        List<Transfer> list = transferService.queryTransferPage(transfer);

        return ResultBean.getSuccessResult(new PageInfo<Transfer>(list));
    }

    /**
     * 更新转账时间 完成时间  失败原因 状态!!!!!!!!!!!!!!!
     *
     * 转账成功后 修改订单已付金额
     */

}
