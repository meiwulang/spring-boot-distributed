package com.jdy.b2b.api.service;

import java.util.List;
import java.util.Map;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.pic.Album;
import com.jdy.b2b.api.model.pic.Attach;
import com.jdy.b2b.api.vo.pic.AlbumVO;

/**
 * @Description 图片业务接口层
 * @author 王斌
 * @date 2017年7月11日 下午2:45:54
 * @version V1.0
 */
public interface AttachService {

	/**
	 * @Description: 查询图片列表
	 * @author 王斌
	 * @date 2017年7月11日 下午2:46:29
	 * @param t
	 * @return
	 */
	ResultBean<Map<String, Object>> queryList(Attach t);

	/**
	 * @Description: 产品模块查询图片列表
	 * @author 王斌
	 * @date 2017年7月11日 下午2:47:53
	 * @param t
	 * @return
	 */
	ResultBean<Map<String, Object>> queryListForProduct(Album t);

	/**
	 * @Description: 编辑图片
	 * @author 王斌
	 * @date 2017年7月11日 下午2:49:18
	 * @param t
	 * @return
	 */
	ResultBean<Map<String, Object>> update(Attach t);

	/**
	 * @Description: 保存图片
	 * @author 王斌
	 * @date 2017年7月11日 下午2:50:45
	 * @param t
	 * @return
	 */
	ResultBean<Map<String, Object>> save(Attach t);

	/**
	 * @Description: 删除图片
	 * @author 王斌
	 * @date 2017年7月11日 下午2:51:10
	 * @param t
	 * @return
	 */
	ResultBean<Map<String, Object>> del(Attach t);

	/**
	 * @Description: 删除图片
	 * @author 王斌
	 * @date 2017年7月11日 下午2:51:10
	 * @param t
	 * @return
	 */
	ResultBean<Map<String, Object>> deleteByIds(List<Long> list);

	/**
	 * @Description: 查询相册列表
	 * @author 王斌
	 * @date 2017年7月12日 上午11:27:41
	 * @param album
	 * @return
	 */
	ResultBean<Map<String, Object>> queryAlbum(Album album);

	/**
	 * @Description: 保存相册
	 * @author 王斌
	 * @date 2017年7月18日 上午10:25:08
	 * @param vo
	 * @return
	 */
	ResultBean<Map<String, Object>> saveAlbum(AlbumVO vo);

	/**
	 * @Description: 编辑相册
	 * @author 王斌
	 * @date 2017年7月18日 上午10:57:23
	 * @param album
	 * @return
	 */
	ResultBean<Map<String, Object>> updateAlbum(Album album);

	/**
	 * @Description: 删除相册
	 * @author 王斌
	 * @date 2017年7月18日 上午10:58:22
	 * @param album
	 * @return
	 */
	ResultBean<Map<String, Object>> deleteAlbum(Album album);

}
