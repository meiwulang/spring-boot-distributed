package com.jdy.b2b.api.dao.posterSettings;

import com.jdy.b2b.api.model.posterSettings.PosterSettings;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PosterSettingsMapper {
    int deleteByPrimaryKey(Long id);

    long insert(PosterSettings posterSettings);

    int insertSelective(PosterSettings posterSettings);

    PosterSettings selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(PosterSettings posterSettings);

    int updateByComIdOrGroupId(PosterSettings posterSettings);
	
	/*自定义*/

	List<PosterSettings> queryPosterSettingsList(PosterSettings posterSettings);

    PosterSettings selectPosterSettings(PosterSettings posterSettings);

    PosterSettings selectCompanyAmountInDay(PosterSettings posterSettings);

    PosterSettings selectCompanyAmountInMonth(PosterSettings posterSettings);

    PosterSettings selectUserGroup(@Param("saleId")Long saleId);

    String selectProductById(Long productId);

    PosterSettings selectGroupAmountInMonth(PosterSettings posterSettings);

    String queryAllPosterUser();

    int updateByPrimaryKeyInCompanyDay(PosterSettings posterSettings);

    int updateByPrimaryKeyInCompanyMonth(PosterSettings posterSettings);

    int updateByPrimaryKeyInGroupMonth(PosterSettings posterSettings);

    String queryPUserName(@Param("saleId")Long saleId);
}