package com.jdy.b2b.web.service;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.web.pojo.credit.CreditQueryVo;
import com.jdy.b2b.web.pojo.credit.CreditResultDO;
import com.jdy.b2b.web.pojo.credit.CreditSaveOrUpdateVo;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by yangcheng on 2017/8/30.
 */
public interface CreditService {

    ResultBean<Long> saveOrUpdateCredit(CreditSaveOrUpdateVo saveOrUpdateVo);

    ResultBean<PageInfo<CreditResultDO>> queryCreditPage(CreditQueryVo vo);
}
