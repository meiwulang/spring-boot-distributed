package com.jdy.b2b.api.vo.user;

import java.io.Serializable;

/**
 * Created by dugq on 2017/10/10.
 */
public class SynchronizeUserInfo implements Serializable{

    private static final long serialVersionUID = -348843822809063850L;

    private String openid;
    private String realname;
    private String phone;
    private String idcard;
    private String pid;
    private String uid;
    private Byte level;
    private String groupId;
    private String groupName;
    private String vGroupId;
    private String vGroupName;

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getvGroupId() {
        return vGroupId;
    }

    public void setvGroupId(String vGroupId) {
        this.vGroupId = vGroupId;
    }

    public String getvGroupName() {
        return vGroupName;
    }

    public void setvGroupName(String vGroupName) {
        this.vGroupName = vGroupName;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
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

    public String getOpenid() {
        return openid;
    }

    public void setOpenid(String openid) {
        this.openid = openid;
    }

    public String getRealname() {
        return realname;
    }

    public void setRealname(String realname) {
        this.realname = realname;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getIdcard() {
        return idcard;
    }

    public void setIdcard(String idcard) {
        this.idcard = idcard;
    }
}
