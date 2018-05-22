package com.jdy.b2b.web.pojo.news;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/27 17:47
 */
@ApiModel(value = "NewsInsertDTO", description = "资讯公告")
public class NewsInsertDTO extends BaseVO{

    @Length(min = 1, max = 50)
    @NotEmpty
    @ApiModelProperty(value = "文章标题")
    private String nTitle;

    @ApiModelProperty(value = "类型1:资讯 2:公告")
    @Range(min = 1, max = 2)
    @NotNull
    private Integer nType;

    @ApiModelProperty(value = "是否推荐0:否 1:是")
    @NotNull
    private Boolean nRecommend;

    @ApiModelProperty(value = "状态 0:发布 1:隐藏")
    @NotNull
    @Range(min = 0, max = 1)
    private Integer nStatus;

    @ApiModelProperty(value = "排序(最小为1)")
    @Min(1)
    private Integer nSort;

    @ApiModelProperty(value = "关键词")
    @Length(max = 100)
    private String nKeys;

    @ApiModelProperty(value = "内容")
    private String nContent;

    public String getnTitle() {
        return nTitle;
    }

    public void setnTitle(String nTitle) {
        this.nTitle = nTitle;
    }

    public Integer getnType() {
        return nType;
    }

    public void setnType(Integer nType) {
        this.nType = nType;
    }

    public Boolean getnRecommend() {
        return nRecommend;
    }

    public void setnRecommend(Boolean nRecommend) {
        this.nRecommend = nRecommend;
    }

    public Integer getnStatus() {
        return nStatus;
    }

    public void setnStatus(Integer nStatus) {
        this.nStatus = nStatus;
    }

    public Integer getnSort() {
        return nSort;
    }

    public void setnSort(Integer nSort) {
        this.nSort = nSort;
    }

    public String getnKeys() {
        return nKeys;
    }

    public void setnKeys(String nKeys) {
        this.nKeys = nKeys;
    }

    public String getnContent() {
        return nContent;
    }

    public void setnContent(String nContent) {
        this.nContent = nContent;
    }

}
