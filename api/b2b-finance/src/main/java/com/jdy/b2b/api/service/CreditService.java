package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.credit.Credit;
import com.jdy.b2b.api.model.credit.CreditDTO;
import com.jdy.b2b.api.model.credit.CreditResultDO;

import java.util.List;

/**
 * Created by yangcheng on 2017/8/30.
 */
public interface CreditService {

    int saveCredit(Credit credit);

    int updateCredit(Credit credit);

    List<CreditResultDO> queryCreditPage(CreditDTO credit);
}
