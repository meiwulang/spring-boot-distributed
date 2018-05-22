package com.jdy.b2b.web.pojo.distributionSystemEntity.login;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.io.Serializable;
import java.util.Date;

public class AgentViewDto implements Serializable {

    private static final long serialVersionUID = -5074799468440363338L;
    private Integer cloudId;
    private String fAgentName;
    private String AgentName;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createDt;
    private Long contactId;
    private Integer  isAgent;
    private Integer  isEmployee;
    private String  logoUrl;

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    private  String wxOpenId;
    private String wxWithdrawOpenId;
    private String contactName;



    public Integer getCloudId() {
        return cloudId;
    }

    public void setCloudId(Integer cloudId) {
        this.cloudId = cloudId;
    }

    public String getfAgentName() {
        return fAgentName;
    }

    public void setfAgentName(String fAgentName) {
        this.fAgentName = fAgentName;
    }

    public String getAgentName() {
        return AgentName;
    }

    public void setAgentName(String agentName) {
        AgentName = agentName;
    }

    public Date getCreateDt() {
        return createDt;
    }

    public void setCreateDt(Date createDt) {
        this.createDt = createDt;
    }

    public Long getContactId() {
        return contactId;
    }

    public void setContactId(Long contactId) {
        this.contactId = contactId;
    }

    public Integer getIsAgent() {
        return isAgent;
    }

    public void setIsAgent(Integer isAgent) {
        this.isAgent = isAgent;
    }

    public Integer getIsEmployee() {
        return isEmployee;
    }

    public void setIsEmployee(Integer isEmployee) {
        this.isEmployee = isEmployee;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getWxOpenId() {
        return wxOpenId;
    }

    public void setWxOpenId(String wxOpenId) {
        this.wxOpenId = wxOpenId;
    }

    public String getWxWithdrawOpenId() {
        return wxWithdrawOpenId;
    }

    public void setWxWithdrawOpenId(String wxWithdrawOpenId) {
        this.wxWithdrawOpenId = wxWithdrawOpenId;
    }
}
