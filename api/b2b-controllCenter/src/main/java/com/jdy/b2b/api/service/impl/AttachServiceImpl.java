package com.jdy.b2b.api.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jdy.b2b.api.common.BaseVO;
import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.pic.AlbumMapper;
import com.jdy.b2b.api.dao.pic.AttachMapper;
import com.jdy.b2b.api.dao.user.UserMapper;
import com.jdy.b2b.api.model.pic.Album;
import com.jdy.b2b.api.model.pic.Attach;
import com.jdy.b2b.api.model.product.BaseDO;
import com.jdy.b2b.api.service.AttachService;
import com.jdy.b2b.api.vo.pic.AlbumVO;

/**
 * @Description 图片业务实现层
 * @author 王斌
 * @date 2017年7月11日 下午2:51:52
 * @version V1.0
 */
@Service
public class AttachServiceImpl implements AttachService {
	@Autowired
	private AttachMapper adao;
	@Autowired
	private AlbumMapper abDao;
	@Autowired
	private UserMapper userMapper;

	@Override
	public ResultBean<Map<String, Object>> queryList(Attach t) {
		// 获取同公司员工
		t.setUserIds(userMapper.selectUserIdsBycompanyId(t.getPcompanyId()));
		Map<String, Object> result = new HashMap<>();
		t.calc();
		result.put(Constants.Result.RESULT_LIST, adao.queryList(t));
		result.put(Constants.Result.TOTAL_NUM, adao.queryListCount(t));
		return ResultBean.getSuccessResult(result);
	}

	@Override
	public ResultBean<Map<String, Object>> queryListForProduct(Album t) {
		Map<String, Object> result = new HashMap<>();
		t.calc();
		result.put(Constants.Result.RESULT_LIST, abDao.queryListForProduct(t));
		result.put(Constants.Result.TOTAL_NUM,
				abDao.queryListForProductCount(t));
		return ResultBean.getSuccessResult(result);
	}

	@Override
	public ResultBean<Map<String, Object>> update(Attach t) {
		adao.updateByPrimaryKeySelective(t);
		Map<String, Object> result = new HashMap<>();
		result.put(Constants.Fields.ID, t.getId());
		return ResultBean.getSuccessResult(result);
	}

	@Override
	public ResultBean<Map<String, Object>> save(Attach t) {
		// 相册总数检查
		Attach param = new Attach();
		param.setpAlbumId(t.getpAlbumId());
		// if (adao.queryListCount(param) > 10) {
		// return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
		// Constants.Error.ERROR_ALBUM_SIZE);
		// }
		// 字段处理
		t.initCreatetimeAndUpdateTime();
		t.initForClearNull();
		t.setId(null);

		// 保存
		adao.insert(t);

		// 返回信息
		Map<String, Object> result = new HashMap<>();
		Long id = t.getId();
		result.put(Constants.Fields.ID, id);
		ResultBean<Map<String, Object>> successResult = ResultBean
				.getSuccessResult(result);
		successResult.setId(id);
		return successResult;
	}

	@Override
	public ResultBean<Map<String, Object>> del(Attach t) {
		Long id = t.getId();
		t.initUpdateTime();
		adao.deleteByPrimaryKey(id);
		Map<String, Object> result = new HashMap<>();
		result.put(Constants.Fields.ID, id);
		return ResultBean.getSuccessResult(result);
	}

	@Override
	public ResultBean<Map<String, Object>> queryAlbum(Album album) {
		// 处理分页
		album.calc();
		// 查询并返回
		Map<String, Object> result = new HashMap<>();
		result.put(Constants.Result.RESULT_LIST, abDao.queryList(album));
		result.put(Constants.Result.TOTAL_NUM, abDao.queryListCount(album));
		return ResultBean.getSuccessResult(result);
	}

	@Override
	@Transactional
	public ResultBean<Map<String, Object>> saveAlbum(AlbumVO vo) {
		// 保存相册
		Album album = insertAlbum(vo);

		// 保存附件
		// insertAttach(vo, album);

		// 返回
		Map<String, Object> result = new HashMap<>();
		result.put(Constants.Fields.ID, album.getId());
		return ResultBean.getSuccessResult(result);
	}

	/**
	 * @Description: 保存附件
	 * @author 王斌
	 * @date 2017年7月18日 下午5:17:42
	 * @param vo
	 * @param album
	 * @return
	 */
	@Transactional
	private Long insertAttach(AlbumVO vo, Album album) {
		Attach attach = JSONUtil.trans(vo, Attach.class);
		// 处理时间、操作人
		attach.initCreatetimeAndUpdateTime();
		initUpdateAndCreateUser(vo, attach);
		Long id = album.getId();
		attach.setpAlbumId(id);
		// 处理其他字段
		if (album.getaType().equals(0)) {
			attach.setpType(2);
		} else {
			attach.setpType(3);
		}
		attach.setpRealName(album.getaName());
		attach.setpPid(album.getaPid());
		attach.initForClearNull();
		adao.insert(attach);
		return id;
	}

	/**
	 * @Description: 保存相册
	 * @author 王斌
	 * @date 2017年7月18日 下午5:17:04
	 * @param vo
	 * @return
	 */
	@Transactional
	private Album insertAlbum(AlbumVO vo) {
		Album album = JSONUtil.trans(vo, Album.class);
		// 处理时间、操作人
		album.initCreatetimeAndUpdateTime();
		initUpdateAndCreateUser(vo, album);
		// 处理其他字段
		album.setId(null);
		album.initForClearNull();

		// 保存相册信息
		abDao.insert(album);
		return album;
	}

	// 处理操作人
	private void initUpdateAndCreateUser(BaseVO vo, BaseDO baseDO) {
		baseDO.setCreateUser(vo.getPuserId());
		baseDO.setUpdateUser(vo.getPuserId());
	}

	@Override
	@Transactional
	public ResultBean<Map<String, Object>> updateAlbum(Album album) {
		// 校验权限
		Long id = album.getId();
		Album current = abDao.selectByPrimaryKey(id);
		if (hasPermission(album, current)) {
			// 处理初始时间
			album.initUpdateTime();
			abDao.updateByPrimaryKeySelective(album);
			Map<String, Object> result = new HashMap<>();
			result.put(Constants.Fields.ID, id);
			return ResultBean.getSuccessResult(result);
		} else {
			return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
					Constants.Error.INSUFFICIENT_AUTHORITY);
		}
	}

	/**
	 * @Description: 判断是否有操作权限
	 * @author 王斌
	 * @date 2017年7月18日 下午5:20:46
	 * @param album
	 * @param current
	 * @return
	 */
	private boolean hasPermission(Album album, Album current) {
		return Constants.MANAGER_COMPANY_ID == album.getCompanyId()
				|| Optional.ofNullable(current).isPresent()
						&& Optional.ofNullable(current.getCompanyId())
								.isPresent()
						&& current.getCompanyId().equals(album.getCompanyId());
	}

	@Override
	@Transactional
	public ResultBean<Map<String, Object>> deleteAlbum(Album album) {
		// 校验权限
		Long id = album.getId();
		Album current = abDao.selectByPrimaryKey(id);
		if (hasPermission(album, current)) {
			// 处理初始时间
			album.initUpdateTime();
			abDao.deleteByPrimaryKey(id);
			// 删除关联数据
			adao.deleteByAlbId(id);
			Map<String, Object> result = new HashMap<>();
			result.put(Constants.Fields.ID, id);
			return ResultBean.getSuccessResult(result);
		} else {
			return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
					Constants.Error.INSUFFICIENT_AUTHORITY);
		}
	}

	@Override
	@Transactional
	public ResultBean<Map<String, Object>> deleteByIds(List<Long> list) {
		adao.deleteByIds(list);
		Long[] ids = new Long[list.size()];
		return ResultBean.getSuccessResultForLog(list.toArray(ids));
	}
}
