package com.jdy.b2b.web.pojo.order;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Past;
import java.util.Date;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/10/9 14:51
 */
@ApiModel(description = "近期订单信息vo")
public class OrderStaticsVO extends BaseVO {
    @ApiModelProperty(value = "下单时间左范围")
    @NotNull
    @Past
    private Date dateStart;

    @ApiModelProperty(value = "下单时间右范围")
    @NotNull
    @Past
    private Date dateEnd;

    public Date getDateStart() {
        return dateStart;
    }

    public void setDateStart(Date dateStart) {
        this.dateStart = dateStart;
    }

    public Date getDateEnd() {
        return dateEnd;
    }

    public void setDateEnd(Date dateEnd) {
        this.dateEnd = dateEnd;
    }
}
