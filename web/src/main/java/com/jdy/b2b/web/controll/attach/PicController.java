package com.jdy.b2b.web.controll.attach;

import java.util.List;
import java.util.Map;

import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.web.pojo.attach.AlbumVO;
import com.jdy.b2b.web.pojo.log.MyLog;
import com.jdy.b2b.web.pojo.pic.PicVO;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.annotations.Delete;
import com.jdy.b2b.web.util.annotations.Query;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

/**
 * @Description 图片控制层
 * @author 王斌
 * @date 2017年7月11日 上午11:29:19
 * @version V1.0
 */
@RestController
@SuppressWarnings("unchecked")
@Api(description = "图册/图片接口")
public class PicController extends BaseController {

	// 管理页全部图片列表

	@RequestMapping(value = "attach/list", method = RequestMethod.POST)
	@ApiOperation("图片列表")
	@MyLog(Module = "attach")
	public ResultBean<Map<String, Object>> queryList(
			@Validated(Query.class) @RequestBody PicVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("attach/list");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	// 产品添加页全部图片列表
	@RequestMapping(value = "album/query", method = RequestMethod.POST)
	@ApiOperation("产品添加页全部图片列表")
	public ResultBean<Map<String, Object>> queryListForProduct(
			@Validated(Query.class) @RequestBody AlbumVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("album/query");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	// 编辑图片
	@RequestMapping(value = "attach/update", method = RequestMethod.POST)
	@ApiOperation("编辑图片")
	@MyLog(Module = "attach")
	public ResultBean<Map<String, Object>> edit(
			@Validated(Update.class) @RequestBody PicVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("attach/update");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	// 添加图片
	@RequestMapping(value = "attach/save", method = RequestMethod.POST)
	@ApiOperation("添加图片")
	@MyLog(Module = "attach")
	public ResultBean<Map<String, Object>> save(
			@Validated(Save.class) @RequestBody PicVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("attach/save");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	// 删除图片
	@RequestMapping(value = "attach/delete", method = RequestMethod.POST)
	@ApiOperation("删除图片")
	@MyLog(Module = "attach")
	public ResultBean<Map<String, Object>> del(
			@Validated(Delete.class) @RequestBody PicVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("attach/delete");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	// 删除图片
	@ApiOperation("删除批量图片")
	@MyLog(Module = "attach")
	// 相册批量删除
	@RequestMapping(value = "attach/batchDelete", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> deleteAttachs(
			@Validated @RequestBody @NotEmpty List<Long> ids) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("attach/batchDelete");
		return restTemplate.postForEntity(url.toString(), ids, ResultBean.class)
				.getBody();
	}

	// --------------
	// 查询相册列表
	@RequestMapping(value = "album/list", method = RequestMethod.POST)
	@ApiOperation("查询相册列表")
	public ResultBean<Map<String, Object>> queryAlbum(
			@Validated @RequestBody AlbumVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("album/list");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	// 查询相册列表
	@RequestMapping(value = "album/save", method = RequestMethod.POST)
	@ApiOperation("保存相册")
	@MyLog(Module = "album")
	public ResultBean<Map<String, Object>> saveAlbum(
			@Validated(Save.class) @RequestBody AlbumVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("album/save");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	// 相册编辑
	@RequestMapping(value = "album/update", method = RequestMethod.POST)
	@ApiOperation("相册编辑")
	@MyLog(Module = "album")
	public ResultBean<Map<String, Object>> updateAlbum(
			@Validated(Update.class) @RequestBody AlbumVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("album/update");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}

	// 相册删除
	@RequestMapping(value = "album/delete", method = RequestMethod.POST)
	@ApiOperation("相册删除")
	@MyLog(Module = "album")
	public ResultBean<Map<String, Object>> deleteAlbum(
			@Validated(Delete.class) @RequestBody AlbumVO vo) {
		StringBuffer url = new StringBuffer(controllCenterUrl)
				.append("album/delete");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class)
				.getBody();
	}
}
