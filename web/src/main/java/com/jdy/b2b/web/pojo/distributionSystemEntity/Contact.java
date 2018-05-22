package com.jdy.b2b.web.pojo.distributionSystemEntity;

import java.io.Serializable;
import java.util.Date;

/**
 * <p>
 * 
 * </p>
 *
 * @author liuxiang
 * @since 2017-10-12
 */
public class Contact  {

    private static final long serialVersionUID = 1L;
	private Integer cloudId;
	private Long contactId;
	private String wxWithdrawOpenId;
	private String contactName;
    /**
     * 0 - 不详
            1 - 女
            2 - 男
            3 - ...
     */
	private String gendar;
	private String idCode;
	private String nation;
	private String passportCode;
	private String mobile;
	private String email;
	private String wechatCode;
	private String qqCode;
	private String weiboCode;
	private Integer isEmployee;
	private Integer isDeleted;
	private Date updateDt;
	private Long updaterId;
	private String wxOpenId;
	private String wxName;
	private String logoUrl;
	public Integer getCloudId() {
		return cloudId;
	}

	public void setCloudId(Integer cloudId) {
		this.cloudId = cloudId;
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

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getWechatCode() {
		return wechatCode;
	}

	public void setWechatCode(String wechatCode) {
		this.wechatCode = wechatCode;
	}

	public String getQqCode() {
		return qqCode;
	}

	public void setQqCode(String qqCode) {
		this.qqCode = qqCode;
	}

	public String getWeiboCode() {
		return weiboCode;
	}

	public void setWeiboCode(String weiboCode) {
		this.weiboCode = weiboCode;
	}

	public Integer getIsEmployee() {
		return isEmployee;
	}

	public void setIsEmployee(Integer isEmployee) {
		this.isEmployee = isEmployee;
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

	public static long getSerialVersionUID() {
		return serialVersionUID;
	}



	public String getWxWithdrawOpenId() {
		return wxWithdrawOpenId;
	}

	public void setWxWithdrawOpenId(String wxWithdrawOpenId) {
		this.wxWithdrawOpenId = wxWithdrawOpenId;
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

	public String getLogoUrl() {
		return logoUrl;
	}

	public void setLogoUrl(String logoUrl) {
		this.logoUrl = logoUrl;
	}

	@Override
	public String toString() {
		return "Contact{" +
			"cloudId=" + cloudId +
			", contactId=" + contactId +
			", contactName=" + contactName +
			", gendar=" + gendar +
			", idCode=" + idCode +
			", nation=" + nation +
			", passportCode=" + passportCode +
			", mobile=" + mobile +
			", email=" + email +
			", wechatCode=" + wechatCode +
			", qqCode=" + qqCode +
			", weiboCode=" + weiboCode +
			", isEmployee=" + isEmployee +
			", isDeleted=" + isDeleted +
			", updateDt=" + updateDt +
			", updaterId=" + updaterId +
			"}";
	}
}
