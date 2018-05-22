package com.jdy.b2b.web.pojo.schedule;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.NotNull;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/8/1 15:57
 */
@ApiModel("车辆锁定、解锁座位DTO")
public class BusLockDTO extends BaseVO{

    @ApiModelProperty("车辆id")
    @NotNull
    private Long id;

    @ApiModelProperty("true:lock, false:unlock")
    @NotNull
    private Boolean lock;

    @ApiModelProperty("座位号，逗号分隔")
    @NotBlank
    private String bSeatsLock;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getLock() {
        return lock;
    }

    public void setLock(Boolean lock) {
        this.lock = lock;
    }

    public String getbSeatsLock() {
        return bSeatsLock;
    }

    public void setbSeatsLock(String bSeatsLock) {
        this.bSeatsLock = bSeatsLock;
    }
}