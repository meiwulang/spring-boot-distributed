package com.jdy.b2b.api.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.slsms.SLsmsMapper;
import com.jdy.b2b.api.model.slsms.SLsms;
import com.jdy.b2b.api.service.SMSService;
import com.jdy.b2b.api.vo.sms.SLsmsVO;

/**
 * @Description 图片业务实现层
 * @author 王斌
 * @date 2017年7月11日 下午2:51:52
 * @version V1.0
 */
@Service
public class SMSServiceImpl implements SMSService {
	@Autowired
	private SLsmsMapper smsdao;

	@Override
	public ResultBean<?> save(SLsmsVO vo) {
		SLsms trans = JSONUtil.trans(vo, SLsms.class);
		smsdao.insert(trans);
		return ResultBean.getSuccessResultForLog(trans.getId());
	}

	@Override
	public ResultBean<?> query(SLsmsVO vo) {
		SLsms trans = JSONUtil.trans(vo, SLsms.class);
		return ResultBean.getSuccessResult(smsdao.query(trans));
	}

	@Override
	public ResultBean<?> delete(Long id) {
		smsdao.deleteByPrimaryKey(id);
		return ResultBean.getSuccessResultForLog(id);
	}

}
