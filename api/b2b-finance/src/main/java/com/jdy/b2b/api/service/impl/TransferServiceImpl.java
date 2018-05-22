package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.transfer.TransferMapper;
import com.jdy.b2b.api.model.transfer.Transfer;
import com.jdy.b2b.api.model.transfer.TransferQueryDTO;
import com.jdy.b2b.api.service.TransferService;
import com.jdy.b2b.api.vo.transfer.TransferSaveVo;
import com.jdy.b2b.api.vo.transfer.TransferUpdateVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Random;

/**
 * Created by yangcheng on 2017/9/7.
 */
@RestController
public class TransferServiceImpl extends BaseService implements TransferService{
    @Autowired
    private TransferMapper transferMapper;

    @Override
    public ResultBean<Long> saveTransfer(TransferSaveVo vo) {
        Transfer transfer = JSONUtil.trans(vo, Transfer.class);
        transfer.setCreateTime(new Date());
        transfer.settStartTime(transfer.getCreateTime());
        transfer.setCreateUser(vo.getPuserId());
        transfer.settStatus(Constants.TRANSFER_HANDLING);
        String transferNo = getTransferNo(vo.gettInAccountId());
        transfer.settTransferNo(transferNo);
        int result = transferMapper.insert(transfer);
        if(result>0){
            return ResultBean.getSuccessResult(transfer.getId());
        }else{
            throw new RuntimeException("新增转账记录失败!");
        }
    }

    @Override
    @Transactional
    public ResultBean<String> handleTransfer(TransferUpdateVo vo) {
        //修改之前的状态为已撤销
        Transfer t = new Transfer();
        t.setId(vo.getId());
        t.settStatus(Constants.TRANSFER_REVOKED);
        t.setUpdateTime(new Date());
        t.setUpdateUser(vo.getPuserId());
        int updateResult = transferMapper.updateByPrimaryKeySelective(t);

        //新增一条记录
        Transfer transfer = transferMapper.selectByPrimaryKey(vo.getId());
        transfer.setId(null);
        transfer.setCreateTime(new Date());
        transfer.setCreateUser(vo.getPuserId());
        transfer.settStatus(Constants.TRANSFER_HANDLING);
        String transferNo = getTransferNo(transfer.gettInAccountId());
        transfer.settTransferNo(transferNo);
        int insertResult = transferMapper.insert(transfer);

        if(updateResult>0 &&insertResult>0){
            return ResultBean.getSuccessResult(transferNo);
        }else{
            throw new RuntimeException("处理转账记录失败");
        }
    }

    private String getTransferNo(Long id){
        //处理转账编号
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter format = DateTimeFormatter.ofPattern("yyyyMMdd");
        String dataStr = now.format(format);
        String supplierId = String.format("%06d", id);
        Random random = new Random();
        int result = random.nextInt(10000);
        String num = String.format("%04d", result);
        String transferNo =dataStr+num+supplierId;

        return transferNo;
    }

    @Override
    public List<Transfer> queryTransferPage(TransferQueryDTO transfer) {
        return transferMapper.queryTransferPage(transfer);
    }
}
