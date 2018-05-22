package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.posterSettings.PosterSettings;

import java.util.List;

/**
 * Created by dengbo on 2018/1/4.
 */
public interface PosterSettingsService {

    int deleteByPrimaryKey(Long id);

    long insert(PosterSettings posterSettings);

    int insertSelective(PosterSettings posterSettings);

    PosterSettings selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(PosterSettings posterSettings);

	/*自定义*/

    List<PosterSettings> queryPosterSettingsList(PosterSettings posterSettings);

    PosterSettings selectPosterSettings(PosterSettings posterSettings);

    int updateByComIdOrGroupId(PosterSettings posterSettings);

    List<PosterSettings> queryPosters(String orderNo);


}
