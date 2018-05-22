package com.jdy.b2b.web.pojo.news;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotNull;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/27 17:47
 */
@ApiModel(value = "NewsUpdateStatusDTO", description = "资讯公告更新状态")
public class NewsUpdateStatusDTO extends BaseVO {

    @NotNull
    private Long id;

    @ApiModelProperty(value = "状态 0:发布 1:隐藏 2:删除")
    @NotNull
    @Range(min = 0, max = 2)
    private Integer nStatus;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getnStatus() {
        return nStatus;
    }

    public void setnStatus(Integer nStatus) {
        this.nStatus = nStatus;
    }
}
