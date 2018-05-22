package com.jdy.b2b.api.controller;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.api.common.BaseVO;
import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.common.constants.annotations.Delete;
import com.jdy.b2b.api.common.constants.annotations.Query;
import com.jdy.b2b.api.common.constants.annotations.Save;
import com.jdy.b2b.api.common.constants.annotations.Update;
import com.jdy.b2b.api.model.pic.Album;
import com.jdy.b2b.api.model.pic.Attach;
import com.jdy.b2b.api.model.product.BaseDO;
import com.jdy.b2b.api.service.AttachService;
import com.jdy.b2b.api.vo.pic.AlbumVO;
import com.jdy.b2b.api.vo.pic.PicVO;

/**
 * @Description 图片控制层
 * @author 王斌
 * @date 2017年7月11日 上午11:29:19
 * @version V1.0
 */
@RestController
// @RequestMapping(value = "Pic", method = RequestMethod.POST)
public class PicController {
	@Autowired
	AttachService service;

	// 管理页全部图片列表
	@RequestMapping(value = "attach/list", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> queryList(
			@Validated(Query.class) @RequestBody PicVO vo) {
		Attach t = JSONUtil.trans(vo, Attach.class);
		return (service.queryList(t));
	}

	// 产品添加页全部图片列表
	@RequestMapping(value = "album/query", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> queryListForProduct(
			@Validated(Query.class) @RequestBody AlbumVO vo) {
		Album t = JSONUtil.trans(vo, Album.class);
		return (service.queryListForProduct(t));
	}

	// 编辑图片
	@RequestMapping(value = "attach/update", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> edit(
			@Validated(Update.class) @RequestBody PicVO vo) {
		Attach t = JSONUtil.trans(vo, Attach.class);
		initUpdateUser(vo, t);
		return (service.update(t));
	}

	// 添加图片
	@RequestMapping(value = "attach/save", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> save(
			@Validated(Save.class) @RequestBody PicVO vo) {
		Attach t = JSONUtil.trans(vo, Attach.class);
		initUpdateAndCreateUser(vo, t);
		return (service.save(t));
	}

	// 删除图片
	@RequestMapping(value = "attach/delete", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> del(
			@Validated(Delete.class) @RequestBody PicVO vo) {
		Attach t = JSONUtil.trans(vo, Attach.class);
		return (service.del(t));
	}

	// --------------
	// 查询相册列表
	@RequestMapping(value = "album/list", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> queryAlbum(
			@Validated @RequestBody AlbumVO vo) {
		Album album = JSONUtil.trans(vo, Album.class);
		return service.queryAlbum(album);
	}

	// 查询相册列表
	@RequestMapping(value = "album/save", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> saveAlbum(
			@Validated(Save.class) @RequestBody AlbumVO vo) {
		return service.saveAlbum(vo);
	}

	// 相册编辑
	@RequestMapping(value = "album/update", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> updateAlbum(
			@Validated(Update.class) @RequestBody AlbumVO vo) {
		Album album = JSONUtil.trans(vo, Album.class);
		initUpdateUser(vo, album);
		return service.updateAlbum(album);
	}

	// 相册删除
	@RequestMapping(value = "album/delete", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> deleteAlbum(
			@Validated(Delete.class) @RequestBody AlbumVO vo) {
		Album album = JSONUtil.trans(vo, Album.class);
		initUpdateUser(vo, album);
		return service.deleteAlbum(album);
	}

	// 相册批量删除
	@RequestMapping(value = "attach/batchDelete", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> deleteAttachs(
			@RequestBody List<Long> ids) {
		if (Objects.isNull(ids) || ids.isEmpty()) {
			return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
					Constants.Error.ERROR_ATTACH_SIZE);
		}
		return service.deleteByIds(ids);
	}

	// 处理操作人
	private void initUpdateUser(BaseVO vo, BaseDO baseDO) {
		baseDO.setUpdateUser(vo.getPuserId());
	}

	// 处理操作人
	private void initUpdateAndCreateUser(BaseVO vo, BaseDO baseDO) {
		Long userId = vo.getPuserId();
		baseDO.setUpdateUser(userId);
		baseDO.setCreateUser(userId);
	}
}
