package com.jdy.b2b.api.service;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.transfer.Transfer;
import com.jdy.b2b.api.model.transfer.TransferQueryDTO;
import com.jdy.b2b.api.vo.transfer.TransferSaveVo;
import com.jdy.b2b.api.vo.transfer.TransferUpdateVo;

import java.util.List;

/**
 * Created by yangcheng on 2017/9/7.
 */
public interface TransferService {
    ResultBean<Long> saveTransfer(TransferSaveVo vo);

    ResultBean<String> handleTransfer(TransferUpdateVo vo);

    List<Transfer> queryTransferPage(TransferQueryDTO transfer);
}
