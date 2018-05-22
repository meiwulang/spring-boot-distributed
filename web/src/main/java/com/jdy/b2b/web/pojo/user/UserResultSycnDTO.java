package com.jdy.b2b.web.pojo.user;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

/**
 * Created by yangcheng on 2017/7/17.
 */
public class UserResultSycnDTO {

    private Long userId;
    private String uUid;
    private String uTel;
    private int uLevel;
    private String uRealName;
    private String uWxOpenId;// 微信openid
    private String uWxname;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private  Date updateTime;
    private String uPid;
    private Long uDepartmentId;
    private  Long uPositionId;
    private Integer uStype;
    private Long uCompanyId;
    private Integer uStatus;
    private String uDepartmentName;
    private String gNo;
    private String uPositionName;
    private String  cName;
    private String uPic;
    private Date uLastLogin;

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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getuUid() {
        return uUid;
    }

    public void setuUid(String uUid) {
        this.uUid = uUid;
    }

    public String getuTel() {
        return uTel;
    }

    public void setuTel(String uTel) {
        this.uTel = uTel;
    }

    public int getuLevel() {
        return uLevel;
    }

    public void setuLevel(int uLevel) {
        this.uLevel = uLevel;
    }

    public String getuRealName() {
        return uRealName;
    }

    public void setuRealName(String uRealName) {
        this.uRealName = uRealName;
    }

    public String getuWxOpenId() {
        return uWxOpenId;
    }

    public void setuWxOpenId(String uWxOpenId) {
        this.uWxOpenId = uWxOpenId;
    }

    public String getuWxname() {
        return uWxname;
    }

    public void setuWxname(String uWxname) {
        this.uWxname = uWxname;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public String getuPid() {
        return uPid;
    }

    public void setuPid(String uPid) {
        this.uPid = uPid;
    }

    public Long getuDepartmentId() {
        return uDepartmentId;
    }

    public void setuDepartmentId(Long uDepartmentId) {
        this.uDepartmentId = uDepartmentId;
    }

    public Long getuPositionId() {
        return uPositionId;
    }

    public void setuPositionId(Long uPositionId) {
        this.uPositionId = uPositionId;
    }

    public Integer getuStype() {
        return uStype;
    }

    public void setuStype(Integer uStype) {
        this.uStype = uStype;
    }

    public Long getuCompanyId() {
        return uCompanyId;
    }

    public void setuCompanyId(Long uCompanyId) {
        this.uCompanyId = uCompanyId;
    }

    public Integer getuStatus() {
        return uStatus;
    }

    public void setuStatus(Integer uStatus) {
        this.uStatus = uStatus;
    }

    public String getuDepartmentName() {
        return uDepartmentName;
    }

    public void setuDepartmentName(String uDepartmentName) {
        this.uDepartmentName = uDepartmentName;
    }

    public String getgNo() {
        return gNo;
    }

    public void setgNo(String gNo) {
        this.gNo = gNo;
    }

    public String getuPositionName() {
        return uPositionName;
    }

    public void setuPositionName(String uPositionName) {
        this.uPositionName = uPositionName;
    }

    public String getcName() {
        return cName;
    }

    public void setcName(String cName) {
        this.cName = cName;
    }

    public Integer getcType() {
        return cType;
    }

    public void setcType(Integer cType) {
        this.cType = cType;
    }

    private Integer cType;



}
