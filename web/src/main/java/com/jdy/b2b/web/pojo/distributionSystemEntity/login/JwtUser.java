package com.jdy.b2b.web.pojo.distributionSystemEntity.login;


import java.io.Serializable;

public class JwtUser implements Serializable{
	private static final long serialVersionUID = 7819955699689293155L;
	private Long uid;//联系人Id
	private String username;//员工姓名
	private String openId;//代理人
	private Long deptId;//部门编码
	private String deptName;//部门名称
	private Long orgId;//公司编码
	private String orgName;//公司名称
	private String createDate;//创建日期
	private String positionId;//职位编码
	private Long contactId;//联系人编码
	private String contactName;//联系人姓名
	private Integer isOrg;//是否公司  1:是公司   0：部门
	private Integer isAgent;//是否代理人  1:是代理人  0：非代理人
	private String parentName;//上级代理人名称
	private String headImg;//代理人微信头像logoUrl
	private String wxWithdrawOpenId; //暂时没用
	private String phone;

	public JwtUser() {
	}

	public JwtUser(Long uid, String username, String openId,
				Long deptId, String deptName, Long orgId, String orgName, String createDate,String positionId,Long contactId,String contactName, Integer isOrg,Integer isAgent,String parentName,String headImg,
				String wxWithdrawOpenId) {
		this.uid = uid;
		this.username = username;
		this.openId = openId;
		this.deptId = deptId;
		this.deptName = deptName;
		this.orgId = orgId;
		this.orgName = orgName;
		this.createDate = createDate;
		this.positionId = positionId;
		this.contactId = contactId;
		this.contactName = contactName;
		this.isOrg = isOrg;
		this.isAgent = isAgent;
		this.parentName = parentName;
		this.headImg = headImg;
		this.wxWithdrawOpenId = wxWithdrawOpenId;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Long getUid() {
		return uid;
	}

	public void setUid(Long uid) {
		this.uid = uid;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getOpenId() {
		return openId;
	}

	public void setOpenId(String openId) {
		this.openId = openId;
	}

	public Long getDeptId() {
		return deptId;
	}

	public void setDeptId(Long deptId) {
		this.deptId = deptId;
	}

	public String getDeptName() {
		return deptName;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}

	public Long getOrgId() {
		return orgId;
	}

	public void setOrgId(Long orgId) {
		this.orgId = orgId;
	}

	public String getOrgName() {
		return orgName;
	}

	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}

	public String getCreateDate() {
		return createDate;
	}

	public void setCreateDate(String createDate) {
		this.createDate = createDate;
	}

	public String getPositionId() {
		return positionId;
	}

	public void setPositionId(String positionId) {
		this.positionId = positionId;
	}

	public Long getContactId() {
		return contactId;
	}

	public void setContactId(Long contactId) {
		this.contactId = contactId;
	}

	public String getContactName() {
		return contactName;
	}

	public void setContactName(String contactName) {
		this.contactName = contactName;
	}

	public Integer getIsOrg() {
		return isOrg;
	}

	public void setIsOrg(Integer isOrg) {
		this.isOrg = isOrg;
	}

	public Integer getIsAgent() {
		return isAgent;
	}

	public void setIsAgent(Integer isAgent) {
		this.isAgent = isAgent;
	}

	public String getParentName() {
		return parentName;
	}

	public void setParentName(String parentName) {
		this.parentName = parentName;
	}

	public String getHeadImg() {
		return headImg;
	}

	public void setHeadImg(String headImg) {
		this.headImg = headImg;
	}

	public String getWxWithdrawOpenId() {
		return wxWithdrawOpenId;
	}

	public void setWxWithdrawOpenId(String wxWithdrawOpenId) {
		this.wxWithdrawOpenId = wxWithdrawOpenId;
	}
}
