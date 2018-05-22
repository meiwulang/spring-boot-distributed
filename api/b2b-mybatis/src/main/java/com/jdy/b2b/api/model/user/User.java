package com.jdy.b2b.api.model.user;

import java.util.Date;

public class User {
	private Long id;// id

	private String uAccount;// 用户名

	private String uPassword;// 密码

	private String uRealName;// 真实姓名

	private String uNo;// 用户编号

	private String uPym;// 用户名首字母拼音码

	private Long uCompanyId;// 所属公司id

	private Long uDepartmentId;// 部门id

	private Integer uDataLimit;// 数据级别0:用户级 1:部门级2:单位级3:系统级

	private Long uRoleId;// 角色id

	private Integer uChargeType;// 负责人标识，0：不是负责人，1：是负责人
	private Integer uType;// 用户类型0:供应商1:分销商 2:管理公司 3:分销中心

	private String uPost;// 岗位职务

	private String uAddress;// 地址

	private String uTel;// 手机号码

	private String uIdcard;// 身份证号码

	private Boolean uSex;// 性别0:男 1:女

	private Date uBirthday;// 生日

	private Integer uDegree;// 文化程度id

	private String uWxname;// 微信号

	private Integer uPolitical;// 政治面貌id

	private String uPhone;// 电话

	private String uFax;// 传真

	private String uQq;// qq

	private String uEmail;// email

	private String uContacts;// 紧急联系人

	private String uContactsPhone;// 联系人电话

	private String uRemark;// 备注

	private Integer uStatus;// 状态 0:有效 1:无效 2:锁定

	private Date createTime;

	private Long createUser;

	private Date updateTime;

	private Long updateUser;

	private String uPic;// 头像地址

	private Date uLastLogin;// 最后登录时间

	private String uWxOpenId;// 微信openid

	private String pid;
	private Byte level;
	private Integer uDtype;
	private Integer uStype;

	private String uUid;
	private String uPuserid;
	private String uPuserName;
	private Long uPositionId;// 岗位id： 字典表

	private Date endDate;
	private Date startDate;

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	private Long oaid;// oa系统id

	public Long getOaid() {
		return oaid;
	}

	public void setOaid(Long oaid) {
		this.oaid = oaid;
	}

	public Long getuPositionId() {
		return uPositionId;
	}

	public void setuPositionId(Long uPositionId) {
		this.uPositionId = uPositionId;
	}

	public String getuUid() {
		return uUid;
	}

	public void setuUid(String uUid) {
		this.uUid = uUid;
	}

	public String getuPuserid() {
		return uPuserid;
	}

	public void setuPuserid(String uPuserid) {
		this.uPuserid = uPuserid;
	}

	public Integer getuStype() {
		return uStype;
	}

	public void setuStype(Integer uStype) {
		this.uStype = uStype;
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

	public String getuPassword() {
		return uPassword;
	}

	public void setuPassword(String uPassword) {
		this.uPassword = uPassword;
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

	public String getuPym() {
		return uPym;
	}

	public void setuPym(String uPym) {
		this.uPym = uPym;
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

	public Integer getuDataLimit() {
		return uDataLimit;
	}

	public void setuDataLimit(Integer uDataLimit) {
		this.uDataLimit = uDataLimit;
	}

	public Long getuRoleId() {
		return uRoleId;
	}

	public void setuRoleId(Long uRoleId) {
		this.uRoleId = uRoleId;
	}

	public Integer getuType() {
		return uType;
	}

	public void setuType(Integer uType) {
		this.uType = uType;
	}

	public String getuPost() {
		return uPost;
	}

	public void setuPost(String uPost) {
		this.uPost = uPost;
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

	public Integer getuPolitical() {
		return uPolitical;
	}

	public void setuPolitical(Integer uPolitical) {
		this.uPolitical = uPolitical;
	}

	public String getuPhone() {
		return uPhone;
	}

	public void setuPhone(String uPhone) {
		this.uPhone = uPhone;
	}

	public String getuFax() {
		return uFax;
	}

	public void setuFax(String uFax) {
		this.uFax = uFax;
	}

	public String getuQq() {
		return uQq;
	}

	public void setuQq(String uQq) {
		this.uQq = uQq;
	}

	public String getuEmail() {
		return uEmail;
	}

	public void setuEmail(String uEmail) {
		this.uEmail = uEmail;
	}

	public String getuContacts() {
		return uContacts;
	}

	public void setuContacts(String uContacts) {
		this.uContacts = uContacts;
	}

	public String getuContactsPhone() {
		return uContactsPhone;
	}

	public void setuContactsPhone(String uContactsPhone) {
		this.uContactsPhone = uContactsPhone;
	}

	public String getuRemark() {
		return uRemark;
	}

	public void setuRemark(String uRemark) {
		this.uRemark = uRemark;
	}

	public Integer getuStatus() {
		return uStatus;
	}

	public void setuStatus(Integer uStatus) {
		this.uStatus = uStatus;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Long getCreateUser() {
		return createUser;
	}

	public void setCreateUser(Long createUser) {
		this.createUser = createUser;
	}

	public Date getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	public Long getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(Long updateUser) {
		this.updateUser = updateUser;
	}

	public String getuPic() {
		return uPic;
	}

	public void setuPic(String uPic) {
		this.uPic = uPic;
	}

	public Date getuLastLogin() {
		return uLastLogin;
	}

	public void setuLastLogin(Date uLastLogin) {
		this.uLastLogin = uLastLogin;
	}

	public String getuWxOpenId() {
		return uWxOpenId;
	}

	public void setuWxOpenId(String uWxOpenId) {
		this.uWxOpenId = uWxOpenId;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public Byte getLevel() {
		return level;
	}

	public void setLevel(Byte level) {
		this.level = level;
	}

	public Integer getuDtype() {
		return uDtype;
	}

	public void setuDtype(Integer uDtype) {
		this.uDtype = uDtype;
	}

	public Integer getuChargeType() {
		return uChargeType;
	}

	public void setuChargeType(Integer uChargeType) {
		this.uChargeType = uChargeType;
	}

	public String getuPuserName() {
		return uPuserName;
	}

	public void setuPuserName(String uPuserName) {
		this.uPuserName = uPuserName;
	}
}