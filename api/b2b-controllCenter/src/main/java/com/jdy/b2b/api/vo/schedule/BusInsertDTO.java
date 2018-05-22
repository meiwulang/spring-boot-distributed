package com.jdy.b2b.api.vo.schedule;

import com.jdy.b2b.api.model.Bus;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/25 15:02
 */
public class BusInsertDTO extends Bus {
    /**
     * 新增车辆数
     */
    private Integer num;

    public Integer getNum() {
        return num;
    }

    public void setNum(Integer num) {
        this.num = num;
    }
}
