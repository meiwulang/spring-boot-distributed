package com.jdy.b2b.web.pojo.distributionSystemEntity.login;

import java.io.Serializable;
import java.util.List;

/**
 * @Description 账号登陆返回体
 * @author 王斌
 * @date 2018年3月25日 下午2:22:42
 * @version V1.0
 */
@SuppressWarnings("serial")
public class AccountLoginResponse extends BaseResponse implements Serializable {
	private String tokenId;
	private String accessToken;
	private String userId;
	private List<Position> positionList;
	private Position position;
	private Employee employee;
	private Dept dept;

	public Dept getDept() {
		return dept;
	}

	public void setDept(Dept dept) {
		this.dept = dept;
	}

	public Position getPosition() {
		return position;
	}

	public void setPosition(Position position) {
		this.position = position;
	}

	public String getTokenId() {
		return tokenId;
	}

	public void setTokenId(String tokenId) {
		this.tokenId = tokenId;
	}

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public List<Position> getPositionList() {
		return positionList;
	}

	public void setPositionList(List<Position> positionList) {
		this.positionList = positionList;
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	@Override
	public String toString() {
		return "AccountLoginResponse {tokenId=\"" + tokenId
				+ "\", \"accessToken=\"" + accessToken + "\", \"userId=\""
				+ userId + "\", \"positionList=\"" + positionList
				+ "\", \"position=\"" + position + "\", \"employee=\""
				+ employee + "\", \"dept=\"" + dept + "\"}";
	}

}
