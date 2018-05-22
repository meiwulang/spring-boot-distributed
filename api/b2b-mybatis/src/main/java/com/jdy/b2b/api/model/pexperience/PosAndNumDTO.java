package com.jdy.b2b.api.model.pexperience;

import com.jdy.b2b.api.common.BaseVO;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/12 20:04
 */
public class PosAndNumDTO extends BaseVO {

    private Integer posId;

    private String posName;

    private Integer num;

    public Integer getPosId() {
        return posId;
    }

    public void setPosId(Integer posId) {
        this.posId = posId;
    }

    public String getPosName() {
        return posName;
    }

    public void setPosName(String posName) {
        this.posName = posName;
    }

    public Integer getNum() {
        return num;
    }

    public void setNum(Integer num) {
        this.num = num;
    }
}
