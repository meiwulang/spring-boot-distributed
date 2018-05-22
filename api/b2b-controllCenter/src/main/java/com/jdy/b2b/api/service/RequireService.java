package com.jdy.b2b.api.service;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.designProject.*;
import com.jdy.b2b.api.vo.designproject.RequireSaveVO;

import java.util.List;

/**
 * @Description 定制游业务层接口
 * @author 王斌
 * @date 2017年12月19日 下午3:14:53
 * @version V1.0
 */
public interface RequireService {
	public ResultBean<Object> saveProject(DesignProjectWithBLOBs vo);

	public ResultBean<Object> updateStatus(RequireTypeUpdateVO vo);

	ResultBean queryRequireList(RequireVO vo);

    ResultBean saveRequire(RequireSaveVO require);

	ResultBean saveNewRequire(RequireSaveVO require);

    ResultBean queryProjectDetail(DesignProjectVO vo);

	List historyDesignRequireList(Long dId);

    ResultBean queryRequireDetail(RequireVO vo);
}
