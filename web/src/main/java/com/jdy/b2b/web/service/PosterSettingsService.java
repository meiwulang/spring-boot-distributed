package com.jdy.b2b.web.service;

import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by dengbo on 2018/1/4.
 */
public interface PosterSettingsService {

    ResultBean sendPoster(String orderNo,int flag);

}
