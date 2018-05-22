package com.jdy.b2b.api.model.department;

/**
 * Created by strict on 2017/11/9.
 */
public class DepartmentSaleCountVO {
	/**
	 * 部门编码
	 */
	private Long uDepartmentCode;
	/**
	 * 查询的时间 某年某月 yyyy-mm 或者是 某年某月某日 yyyy-mm-dd
	 */
	private String queryDate;
	/**
	 * 查询的时间类型 0 没有 1 年月 2 年月日
	 */
	private Integer queryType;

	private String startDate;

	private String endDate;

	private String wxId;
	private Long companyId;
	private Long departmentId;
	private Long userId;
	private String userIdsStr;
	private String groupConcat;

	public String getGroupConcat() {
		return groupConcat;
	}

	public void setGroupConcat(String groupConcat) {
		this.groupConcat = groupConcat;
	}

	public String getUserIdsStr() {
		return userIdsStr;
	}

	public void setUserIdsStr(String userIdsStr) {
		this.userIdsStr = userIdsStr;
	}

	public Long getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(Long departmentId) {
		this.departmentId = departmentId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Long getCompanyId() {
		return companyId;
	}

	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
	}

	/**
	 * @Fields objectType : 统计对象,对象可选值[0，1，2].其中：0表示人员，1表示时间，2表示产品
	 */
	private Integer objectType;

	public Integer getObjectType() {
		return objectType;
	}

	public void setObjectType(Integer objectType) {
		this.objectType = objectType;
	}

	public String getWxId() {
		return wxId;
	}

	public void setWxId(String wxId) {
		this.wxId = wxId;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	public Long getuDepartmentCode() {
		return uDepartmentCode;
	}

	public void setuDepartmentCode(Long uDepartmentCode) {
		this.uDepartmentCode = uDepartmentCode;
	}

	public String getQueryDate() {
		return queryDate;
	}

	public void setQueryDate(String queryDate) {
		this.queryDate = queryDate;
	}

	public Integer getQueryType() {
		return queryType;
	}

	public void setQueryType(Integer queryType) {
		this.queryType = queryType;
	}
}
