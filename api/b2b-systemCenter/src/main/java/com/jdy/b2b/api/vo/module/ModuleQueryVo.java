package com.jdy.b2b.api.vo.module;

import com.jdy.b2b.api.common.BaseVO;
import com.jdy.b2b.api.model.product.BaseDO;

import java.util.Date;

public class ModuleQueryVo extends BaseVO{
    private Integer id;
    private Integer mType;

    public Integer getmType() {
        return mType;
    }

    public void setmType(Integer mType) {
        this.mType = mType;
    }

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
}