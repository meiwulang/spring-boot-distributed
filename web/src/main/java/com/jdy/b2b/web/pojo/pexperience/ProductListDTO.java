package com.jdy.b2b.web.pojo.pexperience;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/12 20:55
 */
@ApiModel
public class ProductListDTO extends BaseVO{

    @ApiModelProperty(value = "是否选中")
    private Boolean chosen;

    @ApiModelProperty(value = "岗位和产品关系表id")
    private Long id;

    @ApiModelProperty(value = "产品id")
    private Long pid;

    @ApiModelProperty(value = "产品编号")
    private String pno;

    @ApiModelProperty(value = "产品名称")
    private String pname;

    @ApiModelProperty(value = "产品经理id")
    private Long managerId;

    @ApiModelProperty(value = "产品经理")
    private String manager;

    @ApiModelProperty(value = "行程天数")
    private Integer tripDays;

    public Boolean getChosen() {
        return chosen;
    }

    public void setChosen(Boolean chosen) {
        this.chosen = chosen;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPno() {
        return pno;
    }

    public void setPno(String pno) {
        this.pno = pno;
    }

    public Long getPid() {
        return pid;
    }

    public void setPid(Long pid) {
        this.pid = pid;
    }

    public String getPname() {
        return pname;
    }

    public void setPname(String pname) {
        this.pname = pname;
    }

    public String getManager() {
        return manager;
    }

    public void setManager(String manager) {
        this.manager = manager;
    }

    public Integer getTripDays() {
        return tripDays;
    }

    public void setTripDays(Integer tripDays) {
        this.tripDays = tripDays;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }
}
