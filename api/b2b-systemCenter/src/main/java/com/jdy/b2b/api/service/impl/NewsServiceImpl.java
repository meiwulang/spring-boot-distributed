package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.dao.NewsMapper;
import com.jdy.b2b.api.dao.diy.NewsMapperDiy;
import com.jdy.b2b.api.model.News;
import com.jdy.b2b.api.model.diy.NewsDTO;
import com.jdy.b2b.api.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/14 13:53
 */
@Service
public class NewsServiceImpl extends BaseService implements NewsService {
    @Autowired
    NewsMapper newsMapper;
    @Autowired
    NewsMapperDiy newsMapperDiy;


    @Override
    public List<News> selectNewsList(NewsDTO newsDTO) {
        return newsMapperDiy.selectNewsList(newsDTO);
    }

    @Override
    public Long insertSelective(News record) {
        int result = newsMapper.insertSelective(record);
        if (result == 1) {
            return record.getId();
        } else {
            throw new RuntimeException("保存资讯信息失败！");
        }
    }

    @Override
    public int updateSelective(News record) {
        int result = newsMapper.updateByPrimaryKeySelective(record);
        if (result == 1) {
            return result;
        } else {
            throw new RuntimeException("更新资讯信息失败！");
        }
    }

    @Override
    public News selectByPrimaryKey(Long id) {
        return newsMapper.selectByPrimaryKey(id);
    }

}
