package com.jdy.b2b.web.pojo.news;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/27 17:47
 */
@ApiModel(value = "NewsUpdateRecommendDTO", description = "资讯公告是否推荐")
public class NewsUpdateRecommendDTO extends BaseVO{

    @NotNull
    private Long id;

    @ApiModelProperty(value = "是否推荐0:否 1:是")
    @NotNull
    private Boolean nRecommend;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getnRecommend() {
        return nRecommend;
    }

    public void setnRecommend(Boolean nRecommend) {
        this.nRecommend = nRecommend;
    }
}
