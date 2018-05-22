package com.jdy.b2b.api.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jdy.b2b.api.common.Constants.Error;
import com.jdy.b2b.api.common.Constants.Result;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.brand.BrandMapper;
import com.jdy.b2b.api.dao.pic.AttachMapper;
import com.jdy.b2b.api.model.brand.Brand;
import com.jdy.b2b.api.model.pic.Attach;
import com.jdy.b2b.api.service.BrandService;
import com.jdy.b2b.api.vo.brand.BrandVO;

/**
 * @Description 品牌业务接口实现层
 * @author 王斌
 * @date 2017年8月9日 上午11:07:36
 * @version V1.0
 */
@Service
public class BrandServiceImpl implements BrandService {

	@Autowired
	private BrandMapper brandMapper;
	@Autowired
	private AttachMapper attachMapper;

	@Override
	public ResultBean<?> list(BrandVO brand) {
		Map<String, Object> result = new HashMap<>();
		Brand record = JSONUtil.trans(brand, Brand.class);
		record.calc();
		result.put(Result.RESULT_LIST, brandMapper.queryByRecord(record));
		result.put(Result.TOTAL_NUM, brandMapper.countByRecord(record));
		return ResultBean.getSuccessResult(result);
	}

	@Override
	public ResultBean<?> listForIndex(int size) {
		Map<String, Object> list = new HashMap<>();
		List<Brand> listForIndex = brandMapper.listForIndex(size);
		list.put("list", listForIndex);
		ResultBean<?> successResult = ResultBean.getSuccessResult(list);
		successResult.setCode("200");
		successResult.setMessage("ok");
		return successResult;
	}

	@Transactional
	@Override
	public ResultBean<?> update(BrandVO brand) {
		Brand record = JSONUtil.trans(brand, Brand.class);
		record.setbDel(0);
		List<Brand> queryByName = brandMapper.queryByName(record);
		Integer id = record.getId();
		if (Objects.nonNull(queryByName)
				&& (queryByName.size() > 1 || (queryByName.size() == 1
						&& !Objects.equals(queryByName.get(0).getId(), id)))) {
			return new ResultBean<>(Error.COMMON_ERROR_CODE, Error.EXITS_NAME);
		}

		Brand current = brandMapper.selectByPrimaryKey(record.getId());
		if (!Objects.equals(record.getbCompanyId(), 1L)
				&& Objects.nonNull(current)) {
			record.setbSort(current.getbSort());
		}
		if (brandMapper.updateByPrimaryKey(record) > 0) {
			Attach attach = new Attach();
			attach.setId(null);
			attach.setpOssName(brand.getpOssName());
			attach.setpType(5);
			attach.setpPid((long) record.getId());
			attachMapper.updateAttachByPpIdAndType((long) record.getId(), 5,
					brand.getpOssName());
			return ResultBean.getSuccessResultForLog((long) id);
		} else {
			return new ResultBean<>(Error.COMMON_ERROR_CODE,
					Error.INSUFFICIENT_AUTHORITY);
		}
	}

	@Transactional
	@Override
	public ResultBean<?> delete(BrandVO brand) {
		Brand record = new Brand();
		Integer id = brand.getId();
		record.setId(id);
		record.setbCompanyId(brand.getbCompanyId());
		record.setbDel(1);
		if (brandMapper.updateByPrimaryKeySelective(record) > 0) {
			return ResultBean.getSuccessResultForLog((long) id);
		} else {
			return new ResultBean<>(Error.COMMON_ERROR_CODE,
					Error.INSUFFICIENT_AUTHORITY);
		}
	}

	@Transactional
	@Override
	public ResultBean<?> save(BrandVO brand) {
		Brand record = JSONUtil.trans(brand, Brand.class);
		record.setbDel(0);
		List<Brand> queryByName = brandMapper.queryByName(record);
		if (queryByName.size() > 0) {
			return new ResultBean<>(Error.COMMON_ERROR_CODE, Error.EXITS_NAME);
		}
		// record.initForClearNull();
		brandMapper.insert(record);
		Attach attach = new Attach();
		attach.setpOssName(brand.getpOssName());
		attach.setpType(5);
		attach.setpPid((long) record.getId());
		attachMapper.insert(attach);

		return ResultBean.getSuccessResultForLog((long) record.getId());
	}

}
