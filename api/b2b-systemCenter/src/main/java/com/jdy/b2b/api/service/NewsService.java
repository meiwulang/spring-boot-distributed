package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.News;
import com.jdy.b2b.api.model.diy.NewsDTO;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/14 13:51
 */
public interface NewsService {
    List<News> selectNewsList(NewsDTO newsDTO);

    Long insertSelective(News record);

    int updateSelective(News record);

    News selectByPrimaryKey(Long id);

}
