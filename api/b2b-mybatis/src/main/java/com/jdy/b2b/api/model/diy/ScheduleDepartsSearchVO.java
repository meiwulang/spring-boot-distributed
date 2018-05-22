package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.common.BaseVO;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/30 14:08
 */
public class ScheduleDepartsSearchVO extends BaseVO {

    private Long id;
    private String name;
    private Integer dType;

    public Integer getdType() {
        return dType;
    }

    public void setdType(Integer dType) {
        this.dType = dType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
