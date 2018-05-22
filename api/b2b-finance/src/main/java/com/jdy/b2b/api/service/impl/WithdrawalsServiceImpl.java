package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.withdrawals.WithdrawalsMapper;
import com.jdy.b2b.api.model.transfer.Transfer;
import com.jdy.b2b.api.model.withdrawals.Withdrawals;
import com.jdy.b2b.api.model.withdrawals.WithdrawalsQueryDTO;
import com.jdy.b2b.api.service.WithdrawalsService;
import com.jdy.b2b.api.vo.withdrawals.WithdrawalsUpdateVo;
import org.apache.commons.codec.binary.Base32InputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Random;

/**
 * Created by yangcheng on 2017/9/8.
 */
@Service
public class WithdrawalsServiceImpl extends BaseService implements WithdrawalsService {
    @Autowired
    private WithdrawalsMapper withdrawalsMapper;

    @Override
    public int saveWithdrawals(Withdrawals withdrawals) {
        withdrawals.setwBillNo(getWithdrawalsNo(withdrawals.getwInAccountId()));
        return withdrawalsMapper.insert(withdrawals);
    }

    @Override
    @Transactional
    public ResultBean<String> updateWithdrawals(WithdrawalsUpdateVo vo) {
        //修改之前的为已撤销
        Withdrawals w = new Withdrawals();
        w.setId(vo.getId());
        w.setwStatus(Constants.WITHDRAWALS_REVOKED);
        w.setUpdateTime(new Date());
        w.setUpdateUser(vo.getPuserId());
        int updateResult = withdrawalsMapper.updateByPrimaryKeySelective(w);

        ////新增一条记录
        Withdrawals withdrawals = withdrawalsMapper.selectByPrimaryKey(vo.getId());
        withdrawals.setId(null);
        withdrawals.setCreateTime(new Date());
        withdrawals.setCreateUser(vo.getPuserId());
        withdrawals.setwStatus(Constants.WITHDRAWALS_HANDLING);

        String billNo = getWithdrawalsNo(withdrawals.getwInAccountId());
        withdrawals.setwBillNo(billNo);
        int insertResult = withdrawalsMapper.insert(withdrawals);

        if(updateResult>0 &&insertResult>0){
            return ResultBean.getSuccessResult(billNo);
        }else{
            throw new RuntimeException("处理体现记录失败");
        }
    }

    private String getWithdrawalsNo(Long id){
        //处理提现编号
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter format = DateTimeFormatter.ofPattern("yyyyMMdd");
        String dataStr = now.format(format);
        String supplierId = String.format("%06d", id);
        Random random = new Random();
        int result = random.nextInt(10000);
        String num = String.format("%04d", result);
        String transferNo ="W"+dataStr+num+supplierId;

        return transferNo;
    }

    @Override
    public List<Withdrawals> queryWithdrawalsPage(WithdrawalsQueryDTO withdrawals) {
        return withdrawalsMapper.queryWithdrawalsPage(withdrawals);
    }

}
