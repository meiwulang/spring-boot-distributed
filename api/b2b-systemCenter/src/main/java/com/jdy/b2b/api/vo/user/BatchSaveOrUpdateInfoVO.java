package com.jdy.b2b.api.vo.user;

import java.io.Serializable;
import java.util.List;

import com.jdy.b2b.api.common.BaseVO;

public class BatchSaveOrUpdateInfoVO extends BaseVO implements Serializable {

	private static final long serialVersionUID = 8197064114754580914L;
	private List<UserSaveOrUpdateVo> userList;
	private List<Long> userIdList;

	public List<UserSaveOrUpdateVo> getUserList() {
		return userList;
	}

	public void setUserList(List<UserSaveOrUpdateVo> userList) {
		this.userList = userList;
	}

	public List<Long> getUserIdList() {
		return userIdList;
	}

	public void setUserIdList(List<Long> userIdList) {
		this.userIdList = userIdList;
	}

	public BatchSaveOrUpdateInfoVO(List<UserSaveOrUpdateVo> userList, List<Long> userIdList) {
		super();
		this.userList = userList;
		this.userIdList = userIdList;
	}

	public BatchSaveOrUpdateInfoVO() {
		super();
	}

}
