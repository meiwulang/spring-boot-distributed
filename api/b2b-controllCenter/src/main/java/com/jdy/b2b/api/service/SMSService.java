package com.jdy.b2b.api.service;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.vo.sms.SLsmsVO;

public interface SMSService {

	public ResultBean<?> save(SLsmsVO vo);

	public ResultBean<?> query(SLsmsVO vo);

	public ResultBean<?> delete(Long id);
}
