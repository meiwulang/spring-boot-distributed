package com.jdy.b2b.api.service;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.vo.struct.ChangeCompanyVO;
import com.jdy.b2b.api.vo.struct.ChangeOrgNameVO;
import com.jdy.b2b.api.vo.struct.CreateCompanyVO;
import com.jdy.b2b.api.vo.struct.SetManagerVO;

public interface CompanyService {
	ResultBean<Object> changeCompany(ChangeCompanyVO vo);

	ResultBean<Object> createCompany(CreateCompanyVO vo);

	ResultBean<Object> changeOrgName(ChangeOrgNameVO vo);

	ResultBean<Object> delete(Long orgId, Integer type, Long operatorId);

	ResultBean<Object> list();

	ResultBean<Object> setManagerForCompany(SetManagerVO vo);
}
