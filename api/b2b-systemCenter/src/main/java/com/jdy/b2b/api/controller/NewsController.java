package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.News;
import com.jdy.b2b.api.model.diy.NewsDTO;
import com.jdy.b2b.api.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/14 14:00
 */
@RestController
@RequestMapping("News")
public class NewsController extends BaseController {
    @Autowired
    NewsService newsService;

    @PostMapping("/list")
    public ResultBean list(@RequestBody NewsDTO newsDTO) {
        if (newsDTO.getCurrPage() != null && newsDTO.getPageSize() != null) {
            PageHelper.startPage(newsDTO.getCurrPage(), newsDTO.getPageSize());
        }
        List list = newsService.selectNewsList(newsDTO);
        return ResultBean.getSuccessResult(new PageInfo(list));
    }

    @PostMapping("/insertSelective")
    public ResultBean insertSelective(@RequestBody News news) {
        Long[] arr = new Long[1];
        Long id = newsService.insertSelective(news);
        arr[0] = id;
        ResultBean bean = ResultBean.getSuccessResult();
        bean.setId(arr);
        return bean;
    }

    @PostMapping("/updateSelective")
    public ResultBean updateSelective(@RequestBody News news) {
        newsService.updateSelective(news);
        return ResultBean.getSuccessResult();
    }

    @PostMapping("/selectById")
    public ResultBean selectById(@RequestBody News news) {
        News result = newsService.selectByPrimaryKey(news.getId());
        return ResultBean.getSuccessResult(result);
    }

}
