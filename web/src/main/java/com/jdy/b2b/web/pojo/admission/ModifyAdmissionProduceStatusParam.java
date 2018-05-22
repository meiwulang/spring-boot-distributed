package com.jdy.b2b.web.pojo.admission;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.List;

/**
 * Created by dugq on 2018/4/17.
 */
@ApiModel
public class ModifyAdmissionProduceStatusParam {

    @ApiModelProperty("生产记录id的数组")
    private List<Long> ids;


    @ApiModelProperty("生产记录状态码")
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
