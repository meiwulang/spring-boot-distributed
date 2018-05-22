package com.jdy.b2b.web.pojo.news;

import io.swagger.annotations.ApiModel;

import javax.validation.constraints.NotNull;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/27 17:47
 */
@ApiModel(value = "NewsSelectOneDTO", description = "资讯公告查询单个记录")
public class NewsSelectOneDTO {

    @NotNull
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
