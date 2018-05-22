package com.jdy.b2b.web.pojo.distributionSystemEntity.login;

import java.io.Serializable;
import java.util.List;

/**
 * Created by dugq on 2018/3/23.
 */
public class OpenIdLoginResult implements Serializable {
	private static final long serialVersionUID = 788796062285074954L;

	private Position position;
	private Dept dept;
	private Employee employee;
	private String accessToken;
	private AgentViewDto userDto;
	private List<Position> positionList;
	private String tokenId;
	private JwtUser jwtUser;

	public void translateAccessToken(){
		this.jwtUser = JwtTokenUtils.getUserFromToken(accessToken);
	}

	public JwtUser getJwtUser() {
		return jwtUser;
	}

	public void setJwtUser(JwtUser jwtUser) {
		this.jwtUser = jwtUser;
	}

	public List<Position> getPositionList() {
		return positionList;
	}

	public void setPositionList(List<Position> positionList) {
		this.positionList = positionList;
	}

	public String getTokenId() {
		return tokenId;
	}

	public void setTokenId(String tokenId) {
		this.tokenId = tokenId;
	}


	public AgentViewDto getUserDto() {
		return userDto;
	}

	public void setUserDto(AgentViewDto userDto) {
		this.userDto = userDto;
	}

	public Position getPosition() {
		return position;
	}

	public void setPosition(Position position) {
		this.position = position;
	}

	public Dept getDept() {
		return dept;
	}

	public void setDept(Dept dept) {
		this.dept = dept;
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	@Override
	public String toString() {
		return "OpenIdLoginResult [position=" + position + ", dept=" + dept
				+ ", employee=" + employee + ", accessToken=" + accessToken
				+ ", userDto=" + userDto + "]";
	}

}
