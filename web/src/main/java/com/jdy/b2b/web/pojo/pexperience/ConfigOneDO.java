package com.jdy.b2b.web.pojo.pexperience;

import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotNull;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/15 13:54
 */
public class ConfigOneDO {
    @NotNull
    private Long id;
    @NotNull
    @Range(min = 0, max = 1)
    private Integer flag;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }
}
