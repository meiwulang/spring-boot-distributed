package com.jdy.b2b.api.vo.schedule;

import com.jdy.b2b.api.model.Bus;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/25 11:17
 */
public class BusLockDTO extends Bus {
    /** true:lock, false:unlock */
    private Boolean lock;

    public Boolean getLock() {
        return lock;
    }

    public void setLock(Boolean lock) {
        this.lock = lock;
    }
}
