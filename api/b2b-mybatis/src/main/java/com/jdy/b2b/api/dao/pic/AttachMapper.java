package com.jdy.b2b.api.dao.pic;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.jdy.b2b.api.model.pic.Attach;
import com.jdy.b2b.api.model.product.Trip;

@Mapper
public interface AttachMapper {
	int deleteByPrimaryKey(Long atId);

	int insert(Attach record);

	int insertSelective(Attach record);

	Attach selectByPrimaryKey(Long atId);

	int updateByPrimaryKeySelective(Attach record);

	int updateByPrimaryKey(Attach record);

	List<Attach> queryList(Attach t);

	int queryListCount(Attach t);

	int deleteByIds(@Param("list") List<Long> list);

	List<Map<String, Object>> queryAlbum(Attach t,
			@Param("sids") List<String> sids);

	int deleteByAlbId(@Param("albId") Long albId);

	/**
	 * @Description: 批量保存
	 * @author 王斌
	 * @date 2017年7月24日 上午10:22:53
	 * @param attachs
	 */
	int batchSave(LinkedList<Attach> attachs);

	/**
	 * @Description: 批量删除
	 * @author 王斌
	 * @date 2017年7月24日 上午10:28:36
	 * @param attachs
	 */
	int batchDelete(LinkedList<Attach> attachs);

	/**
	 * @Description: 批量删除
	 * @author 王斌
	 * @date 2017年7月24日 上午10:28:36
	 * @param attachs
	 */
	int batchDeleteByTrips(ArrayList<Trip> trip);

	/**
	 * @Description: 查询行程附件
	 * @author 王斌
	 * @date 2017年7月24日 下午2:58:59
	 * @param tripId
	 * @return
	 */
	List<String> queryAttachPpId(@Param("ppid") Long tripId,
			@Param("type") int type);

	int updateAttachByPpIdAndType(@Param("ppid") Long tripId,
			@Param("type") int type, @Param("pOssName") String pOssName);

    int deleteOldPic(Long id);
}