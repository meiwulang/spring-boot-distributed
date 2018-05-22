package com.jdy.b2b.api.common;

public class BaseVO {
	private  Long puserId;// 用户编号
	private  String pURealName;
	private  String puAccount;// 用户名称
	private  String puTel;// 手机号
	private  Integer puDataLimit;// 数据级别0:用户级 1:部门级2:单位级3:系统级
	private  Long pcompanyId;// 用户所属公司id
	private  Long puDepartmentId;// 部门id
	private  String pcName;// 公司名称
	private  Integer pcType;// 公司类型 0:供应商 1:分销商 2:管理公司
	private  String pdName;// 部门名称
	private  Integer currPage; // 当前页
	private  Integer pageSize; // 页面大小
	private  Integer startNum;// 分页开始值
	private  Long pRoleId;
	private  Integer pStype;

	public Integer getpStype() {
		return pStype;
	}

	public void setpStype(Integer pStype) {
		this.pStype = pStype;
	}

	public Long getpRoleId() {
		return pRoleId;
	}

	public void setpRoleId(Long pRoleId) {
		this.pRoleId = pRoleId;
	}

	public String getpURealName() {
		return pURealName;
	}

	public void setpURealName(String pURealName) {
		this.pURealName = pURealName;
	}

	public Integer getCurrPage() {
		return currPage;
	}

	public void setCurrPage(Integer currPage) {
		this.currPage = currPage;
	}

	public Integer getPageSize() {
		return pageSize;
	}

	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}

	public Integer getStartNum() {
		return startNum;
	}

	public void setStartNum(Integer startNum) {
		this.startNum = startNum;
	}

	public Long getPuserId() {
		return puserId;
	}

	public void setPuserId(Long puserId) {
		this.puserId = puserId;
	}

	public String getPuAccount() {
		return puAccount;
	}

	public void setPuAccount(String puAccount) {
		this.puAccount = puAccount;
	}

	public Long getPcompanyId() {
		return pcompanyId;
	}

	public void setPcompanyId(Long pcompanyId) {
		this.pcompanyId = pcompanyId;
	}

	public String getPuTel() {
		return puTel;
	}

	public void setPuTel(String puTel) {
		this.puTel = puTel;
	}

	public Long getPuDepartmentId() {
		return puDepartmentId;
	}

	public void setPuDepartmentId(Long puDepartmentId) {
		this.puDepartmentId = puDepartmentId;
	}

	public String getPcName() {
		return pcName;
	}

	public void setPcName(String pcName) {
		this.pcName = pcName;
	}

	public Integer getPcType() {
		return pcType;
	}

	public void setPcType(Integer pcType) {
		this.pcType = pcType;
	}

	public String getPdName() {
		return pdName;
	}

	public void setPdName(String pdName) {
		this.pdName = pdName;
	}

	public Integer getPuDataLimit() {
		return puDataLimit;
	}

	public void setPuDataLimit(Integer puDataLimit) {
		this.puDataLimit = puDataLimit;
	}
}
