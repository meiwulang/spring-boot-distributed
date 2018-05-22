package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.transfer.TransferQueryVo;
import com.jdy.b2b.web.pojo.transfer.TransferSaveVo;
import com.jdy.b2b.web.pojo.transfer.TransferUpdateVo;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by yangcheng on 2017/9/7.
 */
public interface TransferService {
    ResultBean<Long> saveTransfer(TransferSaveVo vo);

    ResultBean<String> updateTransfer(TransferUpdateVo vo);

    ResultBean<Long> queryTransferPage(TransferQueryVo vo);
}
