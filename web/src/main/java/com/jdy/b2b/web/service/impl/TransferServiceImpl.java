package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.pojo.transfer.TransferQueryVo;
import com.jdy.b2b.web.pojo.transfer.TransferSaveVo;
import com.jdy.b2b.web.pojo.transfer.TransferUpdateVo;
import com.jdy.b2b.web.service.TransferService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

/**
 * Created by yangcheng on 2017/9/7.
 */
@Service
public class TransferServiceImpl extends BaseService implements TransferService{

    @Override
    public ResultBean<Long> saveTransfer(TransferSaveVo vo) {
        StringBuffer url = new StringBuffer(financeCenterUrl).append("transfer/save");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }

    @Override
    public ResultBean<String> updateTransfer(TransferUpdateVo vo) {
        StringBuffer url = new StringBuffer(financeCenterUrl).append("transfer/update");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }

    @Override
    public ResultBean<Long> queryTransferPage(TransferQueryVo vo) {
        StringBuffer url = new StringBuffer(financeCenterUrl).append("transfer/list");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }
}
