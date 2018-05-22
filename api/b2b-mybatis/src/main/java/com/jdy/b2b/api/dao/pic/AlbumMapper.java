package com.jdy.b2b.api.dao.pic;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.jdy.b2b.api.model.pic.Album;
import com.jdy.b2b.api.model.pic.AlbumExt;
import com.jdy.b2b.api.model.pic.Attach;

@Mapper
public interface AlbumMapper {
	int deleteByPrimaryKey(Long id);

	int insert(Album record);

	int insertSelective(Album record);

	Album selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(Album record);

	int updateByPrimaryKey(Album record);

	List<Attach> queryList(Album record);

	int queryListCount(Album record);

	List<Attach> queryListForProduct(Album t);

	AlbumExt selecAlbumExt(Long id);

	int queryListForProductCount(Album t);
}