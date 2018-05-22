package com.jdy.b2b.web.controll.transfer;

import com.jdy.b2b.web.pojo.transfer.TransferQueryVo;
import com.jdy.b2b.web.pojo.transfer.TransferSaveVo;
import com.jdy.b2b.web.pojo.transfer.TransferUpdateVo;
import com.jdy.b2b.web.service.TransferService;
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
 * Created by yangcheng on 2017/9/7.
 */
@Api(value = "transfer", description = "转账失败预警")
@RestController
@RequestMapping("transfer")
public class TransferController extends BaseController  {
    @Autowired
    private TransferService transferService;
    @ApiOperation(value = "新增")
    @PostMapping("save")
    public ResultBean<Long> saveTransfer(@RequestBody @Validated TransferSaveVo vo){
        return transferService.saveTransfer(vo);
    }
    @ApiOperation(value = "处理")
    @PostMapping("update")
    public ResultBean<String> updateTransfer(@RequestBody @Validated TransferUpdateVo vo){
        return transferService.updateTransfer(vo);
    }
    @ApiOperation(value = "查列表")
    @PostMapping("list")
    public ResultBean<Long> queryTransferPage(@RequestBody @Validated TransferQueryVo vo){
        return transferService.queryTransferPage(vo);
    }
}
