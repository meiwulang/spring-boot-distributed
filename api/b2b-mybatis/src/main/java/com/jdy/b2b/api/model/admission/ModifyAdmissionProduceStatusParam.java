package com.jdy.b2b.api.model.admission;


import java.util.List;

/**
 * Created by dugq on 2018/4/17.
 */
public class ModifyAdmissionProduceStatusParam {

    private List<Long> ids;


    private Byte status;


    public List<Long> getIds() {
        return ids;
    }

    public void setIds(List<Long> ids) {
        this.ids = ids;
    }

    public Byte getStatus() {
        return status;
    }

    public void setStatus(Byte status) {
        this.status = status;
    }
}
