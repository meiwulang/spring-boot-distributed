package com.jdy.b2b.web.pojo.advertisement;


import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;
import java.util.Date;
@ApiModel(value="投放城市查询vo")
public class AdverAreaQueryVo extends BaseVO {
    @ApiModelProperty(value = "广告id")
    private Long aaAdverId;

    public Long getAaAdverId() {
        return aaAdverId;
    }

    public void setAaAdverId(Long aaAdverId) {
        this.aaAdverId = aaAdverId;
    }

}