package com.jdy.b2b.api.vo.user;

import com.jdy.b2b.api.common.BaseVO;

import java.io.Serializable;

public class DistUserUpdateVo extends BaseVO implements Serializable {
    private static final long serialVersionUID = 8197064114754580914L;

    private Long id;
    private String uRealName;
    private String uTel;
    private String uIdcard;
    private String pid;
    private Byte level;
    private Integer uDtype;
    private Long uDepartmentId;
    private Integer uDepartmentCode;

    public Integer getuDepartmentCode() {
        return uDepartmentCode;
    }

    public void setuDepartmentCode(Integer uDepartmentCode) {
        this.uDepartmentCode = uDepartmentCode;
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

    public Long getuDepartmentId() {
        return uDepartmentId;
    }

    public void setuDepartmentId(Long uDepartmentId) {
        this.uDepartmentId = uDepartmentId;
    }
}
