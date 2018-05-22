package com.jdy.b2b.web.pojo.user;

import java.io.Serializable;
import java.util.Date;

import com.jdy.b2b.web.util.BaseVO;

import io.swagger.annotations.ApiModel;

/**
 * Created by yangcheng on 2017/7/5.
 */
@ApiModel
public class UserSaveOrUpdateVo extends BaseVO implements Serializable {

	private static final long serialVersionUID = 8197064114754580914L;
	private Long id;
	private String uAccount;
	private String uPym;// 用户名首字母拼音码
	private String uRealName;
	private String uNo;
	private String uPost;
	private Long uCompanyId;
	private Long uDepartmentId;
	private Integer uDtype;
	private String uAddress;
	private String uTel;
	private String uIdcard;
	private Boolean uSex;
	private Date uBirthday;
	private Integer uDegree;
	private String uWxname;
	private String uPhone;
	private String uEmail;
	private String uQq;
	private String uContacts;
	private String uRemark;
	private Integer uType;
	private String uPassword;
	private Integer uStatus;
	private Long updateUser;
	private Integer uDataLimit;
	private Date uLastLogin;// 最后登录时间
	private Long uRoleId;// 角色id
	private Integer uStype;

	private String uPuserid;// 上级岗位员工id
	private Long uPositionId;// 岗位id： 字典表
	private String uWxOpenId;// 微信openid
	private Long oaid;// oa系统id

	@Override
	public String toString() {
		return "UserSaveOrUpdateVo {id=\"" + id + "\", \"oaid=\"" + oaid
				+ "\", \"uAccount=\"" + uAccount + "\", \"uPym=\"" + uPym
				+ "\", \"uRealName=\"" + uRealName + "\", \"uNo=\"" + uNo
				+ "\", \"uPost=\"" + uPost + "\", \"uCompanyId=\"" + uCompanyId
				+ "\", \"uDepartmentId=\"" + uDepartmentId + "\", \"uDtype=\""
				+ uDtype + "\", \"uAddress=\"" + uAddress + "\", \"uTel=\""
				+ uTel + "\", \"uIdcard=\"" + uIdcard + "\", \"uSex=\"" + uSex
				+ "\", \"uBirthday=\"" + uBirthday + "\", \"uDegree=\""
				+ uDegree + "\", \"uWxname=\"" + uWxname + "\", \"uPhone=\""
				+ uPhone + "\", \"uEmail=\"" + uEmail + "\", \"uQq=\"" + uQq
				+ "\", \"uContacts=\"" + uContacts + "\", \"uRemark=\""
				+ uRemark + "\", \"uType=\"" + uType + "\", \"uPassword=\""
				+ uPassword + "\", \"uStatus=\"" + uStatus
				+ "\", \"updateUser=\"" + updateUser + "\", \"uDataLimit=\""
				+ uDataLimit + "\", \"uLastLogin=\"" + uLastLogin
				+ "\", \"uRoleId=\"" + uRoleId + "\", \"uStype=\"" + uStype
				+ "\", \"uPuserid=\"" + uPuserid + "\", \"uPositionId=\""
				+ uPositionId + "\", \"uWxOpenId=\"" + uWxOpenId + "\"}";
	}

	public Long getOaid() {
		return oaid;
	}

	public void setOaid(Long oaid) {
		this.oaid = oaid;
	}

	public String getuWxOpenId() {
		return uWxOpenId;
	}

	public void setuWxOpenId(String uWxOpenId) {
		this.uWxOpenId = uWxOpenId;
	}

	public Integer getuStype() {
		return uStype;
	}

	public void setuStype(Integer uStype) {
		this.uStype = uStype;
	}

	public Integer getuDtype() {
		return uDtype;
	}

	public void setuDtype(Integer uDtype) {
		this.uDtype = uDtype;
	}

	public Long getuRoleId() {
		return uRoleId;
	}

	public void setuRoleId(Long uRoleId) {
		this.uRoleId = uRoleId;
	}

	public Date getuLastLogin() {
		return uLastLogin;
	}

	public void setuLastLogin(Date uLastLogin) {
		this.uLastLogin = uLastLogin;
	}

	public Integer getuDataLimit() {
		return uDataLimit;
	}

	public void setuDataLimit(Integer uDataLimit) {
		this.uDataLimit = uDataLimit;
	}

	public Long getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(Long updateUser) {
		this.updateUser = updateUser;
	}

	public Integer getuStatus() {
		return uStatus;
	}

	public void setuStatus(Integer uStatus) {
		this.uStatus = uStatus;
	}

	public String getuPym() {
		return uPym;
	}

	public void setuPym(String uPym) {
		this.uPym = uPym;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getuAccount() {
		return uAccount;
	}

	public void setuAccount(String uAccount) {
		this.uAccount = uAccount;
	}

	public String getuRealName() {
		return uRealName;
	}

	public void setuRealName(String uRealName) {
		this.uRealName = uRealName;
	}

	public String getuNo() {
		return uNo;
	}

	public void setuNo(String uNo) {
		this.uNo = uNo;
	}

	public String getuPost() {
		return uPost;
	}

	public void setuPost(String uPost) {
		this.uPost = uPost;
	}

	public Long getuCompanyId() {
		return uCompanyId;
	}

	public void setuCompanyId(Long uCompanyId) {
		this.uCompanyId = uCompanyId;
	}

	public Long getuDepartmentId() {
		return uDepartmentId;
	}

	public void setuDepartmentId(Long uDepartmentId) {
		this.uDepartmentId = uDepartmentId;
	}

	public Integer getUdType() {
		return uDtype;
	}

	public void setUdType(Integer uDtype) {
		this.uDtype = uDtype;
	}

	public String getuAddress() {
		return uAddress;
	}

	public void setuAddress(String uAddress) {
		this.uAddress = uAddress;
	}

	public String getuTel() {
		return uTel;
	}

	public void setuTel(String uTel) {
		this.uTel = uTel;
	}

	public String getuIdcard() {
		return uIdcard;
	}

	public void setuIdcard(String uIdcard) {
		this.uIdcard = uIdcard;
	}

	public Boolean getuSex() {
		return uSex;
	}

	public void setuSex(Boolean uSex) {
		this.uSex = uSex;
	}

	public Date getuBirthday() {
		return uBirthday;
	}

	public void setuBirthday(Date uBirthday) {
		this.uBirthday = uBirthday;
	}

	public Integer getuDegree() {
		return uDegree;
	}

	public void setuDegree(Integer uDegree) {
		this.uDegree = uDegree;
	}

	public String getuWxname() {
		return uWxname;
	}

	public void setuWxname(String uWxname) {
		this.uWxname = uWxname;
	}

	public String getuPhone() {
		return uPhone;
	}

	public void setuPhone(String uPhone) {
		this.uPhone = uPhone;
	}

	public String getuEmail() {
		return uEmail;
	}

	public void setuEmail(String uEmail) {
		this.uEmail = uEmail;
	}

	public String getuQq() {
		return uQq;
	}

	public void setuQq(String uQq) {
		this.uQq = uQq;
	}

	public String getuContacts() {
		return uContacts;
	}

	public void setuContacts(String uContacts) {
		this.uContacts = uContacts;
	}

	public String getuRemark() {
		return uRemark;
	}

	public void setuRemark(String uRemark) {
		this.uRemark = uRemark;
	}

	public Integer getuType() {
		return uType;
	}

	public void setuType(Integer uType) {
		this.uType = uType;
	}

	public String getuPassword() {
		return uPassword;
	}

	public void setuPassword(String uPassword) {
		this.uPassword = uPassword;
	}

	public String getuPuserid() {
		return uPuserid;
	}

	public void setuPuserid(String uPuserid) {
		this.uPuserid = uPuserid;
	}

	public Long getuPositionId() {
		return uPositionId;
	}

	public void setuPositionId(Long uPositionId) {
		this.uPositionId = uPositionId;
	}
}
