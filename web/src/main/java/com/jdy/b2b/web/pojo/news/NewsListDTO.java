package com.jdy.b2b.web.pojo.news;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Range;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/27 16:36
 */
@ApiModel(description = "资讯公告")
public class NewsListDTO extends BaseVO {
    @ApiModelProperty(value = "搜索关键词")
    private String searchKey;

    @ApiModelProperty(value = "类型1:资讯 2:公告")
    @Range(min = 1, max = 2, message = "类型1:资讯 2:公告")
    private Integer nType;

    public String getSearchKey() {
        return searchKey;
    }

    public void setSearchKey(String searchKey) {
        this.searchKey = searchKey;
    }

    public Integer getnType() {
        return nType;
    }

    public void setnType(Integer nType) {
        this.nType = nType;
    }
}
