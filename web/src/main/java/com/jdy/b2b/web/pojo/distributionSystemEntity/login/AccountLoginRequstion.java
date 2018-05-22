package com.jdy.b2b.web.pojo.distributionSystemEntity.login;

/**   
* @Description 账号登陆请求体
* @author 王斌
* @date 2018年3月25日 下午2:22:42 
* @version V1.0   
*/
public class AccountLoginRequstion {
    private Long cloudId;
    private String loginName;
    private String loginPwd;

    public Long getCloudId() {
		return cloudId;
	}

	public void setCloudId(Long cloudId) {
		this.cloudId = cloudId;
	}

	public String getLoginName() {
		return loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}

	public String getLoginPwd() {
		return loginPwd;
	}

	public void setLoginPwd(String loginPwd) {
		this.loginPwd = loginPwd;
	}

	public AccountLoginRequstion() {
    }

	/** 
	* @Description: TODO
	* @author 王斌
	* @date 2018年3月25日 下午2:23:46 
	* @param loginName
	* @param loginPwd
	*/
	public AccountLoginRequstion(String loginName, String loginPwd) {
		super();
		this.loginName = loginName;
		this.loginPwd = loginPwd;
		this.cloudId=2L;
	}

	@Override
	public String toString() {
		return "AccountLoginRequstion {cloudId=\"" + cloudId
				+ "\", loginName=\"" + loginName + "\", loginPwd=\"" + loginPwd
				+ "}";
	}

}
