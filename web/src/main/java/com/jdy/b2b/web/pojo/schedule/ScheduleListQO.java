package com.jdy.b2b.web.pojo.schedule;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotNull;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/8/1 11:24
 */
@ApiModel(description = "班期列表查询")
public class ScheduleListQO extends BaseVO {

    @ApiModelProperty(value = "产品id")
    @NotNull
    private Long sProductId;

    @ApiModelProperty(value = "查询开始时间,yyyy-MM-dd")
    private String sCalendarStart;

    @ApiModelProperty(value = "查询结束时间,yyyy-MM-dd")
    private String sCalendarEnd;

    @ApiModelProperty(value = "分组排序标识:1/2-班期编号升序/降序，3/4-出发日期升序/降序，5/6=出发时分升序/降序，7/8-星期几升序/降序")
    @Range(min = 1, max = 8)
    private Integer orderBy;

    /* 0:正常 1:暂停 2:删除 3:已过期 */
    @ApiModelProperty(value = "0:正常 1:暂停 2:删除 3:已过期")
    @Range(min = 0, max = 3)
    private Integer flag;

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }

    public Long getsProductId() {
        return sProductId;
    }

    public void setsProductId(Long sProductId) {
        this.sProductId = sProductId;
    }

    public String getsCalendarStart() {
        return sCalendarStart;
    }

    public void setsCalendarStart(String sCalendarStart) {
        this.sCalendarStart = sCalendarStart;
    }

    public String getsCalendarEnd() {
        return sCalendarEnd;
    }

    public void setsCalendarEnd(String sCalendarEnd) {
        this.sCalendarEnd = sCalendarEnd;
    }

    public Integer getOrderBy() {
        return orderBy;
    }

    public void setOrderBy(Integer orderBy) {
        this.orderBy = orderBy;
    }
}
