package com.jdy.b2b.api.model.user;

public class DepartDistDO {
    private Long id;
    private String uRealName;
    private String uAccount;
    private String pid;
    private Integer level;

    private Integer uCount;

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public String getuAccount() {
        return uAccount;
    }

    public void setuAccount(String uAccount) {
        this.uAccount = uAccount;
    }

    public String getPid() {
        return pid;
    }

    public void setPid(String pid) {
        this.pid = pid;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getuRealName() {
        return uRealName;
    }

    public void setuRealName(String uRealName) {
        this.uRealName = uRealName;
    }

    public Integer getuCount() {
        return uCount;
    }

    public void setuCount(Integer uCount) {
        this.uCount = uCount;
    }
}
