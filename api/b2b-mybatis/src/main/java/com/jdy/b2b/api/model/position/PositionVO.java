package com.jdy.b2b.api.model.position;

import java.util.List;

import com.jdy.b2b.api.model.role.RolesDTO;

/**
 * Created by dugq on 2018/3/25.
 */
public class PositionVO extends Position {
	private List<RolesDTO> rolesDTOS;
	private List<Long> roleIds;
	private String userName;

	public List<Long> getRoleIds() {
		return roleIds;
	}

	public void setRoleIds(List<Long> roleIds) {
		this.roleIds = roleIds;
	}

	public List<RolesDTO> getRolesDTOS() {
		return rolesDTOS;
	}

	public void setRolesDTOS(List<RolesDTO> rolesDTOS) {
		this.rolesDTOS = rolesDTOS;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

}
