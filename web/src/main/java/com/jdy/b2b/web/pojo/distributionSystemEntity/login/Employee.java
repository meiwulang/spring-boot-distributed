package com.jdy.b2b.web.pojo.distributionSystemEntity.login;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import org.apache.poi.ss.formula.functions.T;

/**
 * <p>
 * 
 * </p>
 *
 * @author liuxiang
 * @since 2017-10-12
 */

public class Employee implements Serializable {

	private static final long serialVersionUID = 1376099423676880667L;
	private Integer cloudId; // 云id

	private Long employeeId; // 员工id

	private String employeeCode;// 员工code

	private String employeeName;// 员工名称
	private String wxOpenId;// openId
	private String wxName;// 微信昵称

	private Integer isLeft;

	private Integer isDeleted;

	private Date updateDt;

	private Long updaterId;

	private Date createDt;

	private Integer employeeState;

	private Integer isUserAccount;

	private Integer authType;// 权限类型 1：组织权限，2：团队权限

	private String loginName;// 登录名

	private String loginPwd;

	private Long positionId;

	private Integer isActive;

	private String tokenId;

	private Date startDt;

	private Date endDt;

	private String updater;

	private List<T> positionIdList;

	private String textQuery;

	private String positionName;// 职务名称

	private String positionDesc;

	private String deptName;// 部门名称

	private Integer isMainPosition;

	private Integer userStatus;

	private String fPositionName;

	private Long fPositionId;

	private List<T> employeeIdList;

	private String firstLetter;

	private Long contactId;

	private String keywords;

	private String contactName;

	private String gendar;

	private String idCode;

	private String nation;

	private String passportCode;

	private String deptId;// 部门id

	private String mobile;// 电话

	private String email;

	private String qqCode;

	private String isEmployee;

	private Boolean select;

	private String weiboCode;

	private String wechatCode;

	private String isManager; // 是否销售经理 1 员工 2 销售经理

	private Integer positionLevel; // 职务等级

	private String fdeptId;

	private String fdeptCode;

	private String fdeptName;
	private List<Employee> employeeDto;

	private Long roleId;

	public Integer getEmployeeState() {
		return employeeState;
	}

	public void setEmployeeState(Integer employeeState) {
		this.employeeState = employeeState;
	}

	public Integer getIsUserAccount() {
		return isUserAccount;
	}

	public void setIsUserAccount(Integer isUserAccount) {
		this.isUserAccount = isUserAccount;
	}

	public Date getCreateDt() {
		return createDt;
	}

	public void setCreateDt(Date createDt) {
		this.createDt = createDt;
	}

	public Integer getCloudId() {
		return cloudId;
	}

	public void setCloudId(Integer cloudId) {
		this.cloudId = cloudId;
	}

	public Long getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(Long employeeId) {
		this.employeeId = employeeId;
	}

	public String getEmployeeCode() {
		return employeeCode;
	}

	public void setEmployeeCode(String employeeCode) {
		this.employeeCode = employeeCode;
	}

	public String getEmployeeName() {
		return employeeName;
	}

	public void setEmployeeName(String employeeName) {
		this.employeeName = employeeName;
	}

	public Integer getIsLeft() {
		return isLeft;
	}

	public void setIsLeft(Integer isLeft) {
		this.isLeft = isLeft;
	}

	public Integer getIsDeleted() {
		return isDeleted;
	}

	public void setIsDeleted(Integer isDeleted) {
		this.isDeleted = isDeleted;
	}

	public Date getUpdateDt() {
		return updateDt;
	}

	public void setUpdateDt(Date updateDt) {
		this.updateDt = updateDt;
	}

	public Long getUpdaterId() {
		return updaterId;
	}

	public void setUpdaterId(Long updaterId) {
		this.updaterId = updaterId;
	}

	protected Serializable pkVal() {
		return this.cloudId;
	}

	@Override
	public String toString() {
		return "Employee {cloudId=\"" + cloudId + "\", \"employeeId=\""
				+ employeeId + "\", \"employeeCode=\"" + employeeCode
				+ "\", \"employeeName=\"" + employeeName + "\", \"wxOpenId=\""
				+ wxOpenId + "\", \"wxName=\"" + wxName + "\", \"isLeft=\""
				+ isLeft + "\", \"isDeleted=\"" + isDeleted
				+ "\", \"updateDt=\"" + updateDt + "\", \"updaterId=\""
				+ updaterId + "\", \"createDt=\"" + createDt
				+ "\", \"employeeState=\"" + employeeState
				+ "\", \"isUserAccount=\"" + isUserAccount + "\", \"authType=\""
				+ authType + "\", \"loginName=\"" + loginName
				+ "\", \"loginPwd=\"" + loginPwd + "\", \"positionId=\""
				+ positionId + "\", \"isActive=\"" + isActive
				+ "\", \"tokenId=\"" + tokenId + "\", \"startDt=\"" + startDt
				+ "\", \"endDt=\"" + endDt + "\", \"updater=\"" + updater
				+ "\", \"positionIdList=\"" + positionIdList
				+ "\", \"textQuery=\"" + textQuery + "\", \"positionName=\""
				+ positionName + "\", \"positionDesc=\"" + positionDesc
				+ "\", \"deptName=\"" + deptName + "\", \"isMainPosition=\""
				+ isMainPosition + "\", \"userStatus=\"" + userStatus
				+ "\", \"fPositionName=\"" + fPositionName
				+ "\", \"fPositionId=\"" + fPositionId
				+ "\", \"employeeIdList=\"" + employeeIdList
				+ "\", \"firstLetter=\"" + firstLetter + "\", \"contactId=\""
				+ contactId + "\", \"keywords=\"" + keywords
				+ "\", \"contactName=\"" + contactName + "\", \"gendar=\""
				+ gendar + "\", \"idCode=\"" + idCode + "\", \"nation=\""
				+ nation + "\", \"passportCode=\"" + passportCode
				+ "\", \"deptId=\"" + deptId + "\", \"mobile=\"" + mobile
				+ "\", \"email=\"" + email + "\", \"qqCode=\"" + qqCode
				+ "\", \"isEmployee=\"" + isEmployee + "\", \"select=\""
				+ select + "\", \"weiboCode=\"" + weiboCode
				+ "\", \"wechatCode=\"" + wechatCode + "\", \"isManager=\""
				+ isManager + "\", \"positionLevel=\"" + positionLevel
				+ "\", \"fdeptId=\"" + fdeptId + "\", \"fdeptCode=\""
				+ fdeptCode + "\", \"fdeptName=\"" + fdeptName
				+ "\", \"employeeDto=\"" + employeeDto + "\", \"roleId=\""
				+ roleId + "\"}";
	}

	public Integer getAuthType() {
		return authType;
	}

	public void setAuthType(Integer authType) {
		this.authType = authType;
	}

	public String getLoginName() {
		return loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}

	public String getPositionName() {
		return positionName;
	}

	public void setPositionName(String positionName) {
		this.positionName = positionName;
	}

	public String getDeptName() {
		return deptName;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}

	public String getDeptId() {
		return deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getWeiboCode() {
		return weiboCode;
	}

	public void setWeiboCode(String weiboCode) {
		this.weiboCode = weiboCode;
	}

	public String getLoginPwd() {
		return loginPwd;
	}

	public void setLoginPwd(String loginPwd) {
		this.loginPwd = loginPwd;
	}

	public Long getPositionId() {
		return positionId;
	}

	public void setPositionId(Long positionId) {
		this.positionId = positionId;
	}

	public Integer getIsActive() {
		return isActive;
	}

	public void setIsActive(Integer isActive) {
		this.isActive = isActive;
	}

	public String getTokenId() {
		return tokenId;
	}

	public void setTokenId(String tokenId) {
		this.tokenId = tokenId;
	}

	public Date getStartDt() {
		return startDt;
	}

	public void setStartDt(Date startDt) {
		this.startDt = startDt;
	}

	public Date getEndDt() {
		return endDt;
	}

	public void setEndDt(Date endDt) {
		this.endDt = endDt;
	}

	public String getUpdater() {
		return updater;
	}

	public void setUpdater(String updater) {
		this.updater = updater;
	}

	public List<T> getPositionIdList() {
		return positionIdList;
	}

	public void setPositionIdList(List<T> positionIdList) {
		this.positionIdList = positionIdList;
	}

	public String getTextQuery() {
		return textQuery;
	}

	public void setTextQuery(String textQuery) {
		this.textQuery = textQuery;
	}

	public String getPositionDesc() {
		return positionDesc;
	}

	public void setPositionDesc(String positionDesc) {
		this.positionDesc = positionDesc;
	}

	public Integer getIsMainPosition() {
		return isMainPosition;
	}

	public void setIsMainPosition(Integer isMainPosition) {
		this.isMainPosition = isMainPosition;
	}

	public Integer getUserStatus() {
		return userStatus;
	}

	public void setUserStatus(Integer userStatus) {
		this.userStatus = userStatus;
	}

	public String getfPositionName() {
		return fPositionName;
	}

	public void setfPositionName(String fPositionName) {
		this.fPositionName = fPositionName;
	}

	public Long getfPositionId() {
		return fPositionId;
	}

	public void setfPositionId(Long fPositionId) {
		this.fPositionId = fPositionId;
	}

	public List<T> getEmployeeIdList() {
		return employeeIdList;
	}

	public void setEmployeeIdList(List<T> employeeIdList) {
		this.employeeIdList = employeeIdList;
	}

	public String getFirstLetter() {
		return firstLetter;
	}

	public void setFirstLetter(String firstLetter) {
		this.firstLetter = firstLetter;
	}

	public Long getContactId() {
		return contactId;
	}

	public void setContactId(Long contactId) {
		this.contactId = contactId;
	}

	public String getKeywords() {
		return keywords;
	}

	public void setKeywords(String keywords) {
		this.keywords = keywords;
	}

	public String getContactName() {
		return contactName;
	}

	public void setContactName(String contactName) {
		this.contactName = contactName;
	}

	public String getGendar() {
		return gendar;
	}

	public void setGendar(String gendar) {
		this.gendar = gendar;
	}

	public String getIdCode() {
		return idCode;
	}

	public void setIdCode(String idCode) {
		this.idCode = idCode;
	}

	public String getNation() {
		return nation;
	}

	public void setNation(String nation) {
		this.nation = nation;
	}

	public String getPassportCode() {
		return passportCode;
	}

	public void setPassportCode(String passportCode) {
		this.passportCode = passportCode;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getQqCode() {
		return qqCode;
	}

	public void setQqCode(String qqCode) {
		this.qqCode = qqCode;
	}

	public String getIsEmployee() {
		return isEmployee;
	}

	public void setIsEmployee(String isEmployee) {
		this.isEmployee = isEmployee;
	}

	public Boolean getSelect() {
		return select;
	}

	public void setSelect(Boolean select) {
		this.select = select;
	}

	public String getWechatCode() {
		return wechatCode;
	}

	public void setWechatCode(String wechatCode) {
		this.wechatCode = wechatCode;
	}

	public String getIsManager() {
		return isManager;
	}

	public void setIsManager(String isManager) {
		this.isManager = isManager;
	}

	public Integer getPositionLevel() {
		return positionLevel;
	}

	public void setPositionLevel(Integer positionLevel) {
		this.positionLevel = positionLevel;
	}

	public String getFdeptId() {
		return fdeptId;
	}

	public void setFdeptId(String fdeptId) {
		this.fdeptId = fdeptId;
	}

	public String getFdeptCode() {
		return fdeptCode;
	}

	public void setFdeptCode(String fdeptCode) {
		this.fdeptCode = fdeptCode;
	}

	public String getFdeptName() {
		return fdeptName;
	}

	public void setFdeptName(String fdeptName) {
		this.fdeptName = fdeptName;
	}

	public List<Employee> getEmployeeDto() {
		return employeeDto;
	}

	public void setEmployeeDto(List<Employee> employeeDto) {
		this.employeeDto = employeeDto;
	}

	public Long getRoleId() {
		return roleId;
	}

	public void setRoleId(Long roleId) {
		this.roleId = roleId;
	}

	public String getWxOpenId() {
		return wxOpenId;
	}

	public void setWxOpenId(String wxOpenId) {
		this.wxOpenId = wxOpenId;
	}

	public String getWxName() {
		return wxName;
	}

	public void setWxName(String wxName) {
		this.wxName = wxName;
	}

}
