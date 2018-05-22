package com.jdy.b2b.api.dao.diy;

import com.jdy.b2b.api.model.News;
import com.jdy.b2b.api.model.diy.NewsDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface NewsMapperDiy {
    List<News> selectNewsList(NewsDTO newsDTO);
}