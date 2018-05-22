package com.jdy.b2b.api.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Objects;

import org.apache.shiro.crypto.hash.SimpleHash;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.TaskExecutor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.github.pagehelper.PageHelper;
import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.PinyinUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.CompanyMapper;
import com.jdy.b2b.api.dao.CompanySettingMapper;
import com.jdy.b2b.api.dao.marketArea.MarketAreaMapper;
import com.jdy.b2b.api.dao.user.UserMapper;
import com.jdy.b2b.api.model.Company;
import com.jdy.b2b.api.model.company.AccountStatusEnum;
import com.jdy.b2b.api.model.company.AuditEnum;
import com.jdy.b2b.api.model.company.CompanyDto;
import com.jdy.b2b.api.model.company.CompanyTypeEnum;
import com.jdy.b2b.api.model.company.CompanyVo;
import com.jdy.b2b.api.model.user.User;
import com.jdy.b2b.api.service.CompanyService;
import com.jdy.b2b.api.service.MarketAreaService;
import com.jdy.b2b.api.util.MQAssembleService;
import com.jdy.b2b.api.util.MQTransformationUtils;
import org.apache.shiro.crypto.hash.SimpleHash;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.TaskExecutor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.Date;
import java.util.List;
import java.util.Objects;

/**
 * Created by dugq on 2017/7/4.
 */
@Service
@Transactional
public class CompanyServiceImpl  extends BaseService implements CompanyService{

    @Value("${spring.shiro.password.algorithmName:md5}")
    private String algorithmName;
    @Value("${spring.shiro.password.hashIterations:3}")
    private Integer hashIterations;
//    @Value("${spring.login.verifiCode.time:120000}")
//    private Integer virifitime;
    @Value("${spring.shiro.password.originPassword:123456}")
    private String originPassword;

    @Autowired
    private CompanyMapper companyMapper;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private CompanySettingMapper companySettingMapper;
    @Autowired
    private MarketAreaService marketAreaService;
    @Autowired
    private MarketAreaMapper marketAreaMapper;
    @Autowired
    TaskExecutor taskExecutor;
    @Autowired
    MQAssembleService mqAssembleService;

    @Override
    public int deleteByPrimaryKey(Long orgId) {
        Company company = selectByPrimaryKey(orgId);
        if(company==null)
            return 1;
        companySettingMapper.deleteByCompanyId(orgId);
        int i = companyMapper.deleteByPrimaryKey(orgId);
        if(i == 0){
            throw new RuntimeException();
        }
        companyMapper.updatePids();
        marketAreaService.removeByCompanyId(orgId);
        return i;
    }

    @Override
    public int insert(Company record) {
        int insert = companyMapper.insert(record);
        companyMapper.updatePids();
        return insert;
    }

	@Override
	@Transactional
	public int insertSelective(Company record) {
		int i = companyMapper.insertSelective(record);
		companyMapper.updatePids();
//		taskExecutor.execute(() -> mqAssembleService.getMQClinet()
//				.syncCompanys(MQTransformationUtils.transComapny(
//						companyMapper.selectByPrimaryKey(record.getId()))));
		// 创建管理员
		User user = new User();
		user.setuRealName(record.getcChargeName());
		user.setuTel(record.getcTel());
		user.setuPhone(record.getcPhone());
		user.setuAccount(record.getcTel());
		user.setCreateTime(new Date());
		user.setCreateUser(record.getCreateUser());
		user.setuAddress(record.getcAddress());
		user.setuCompanyId(record.getId());
		user.setuDataLimit(Constants.DATA_LIMIT_COM);

		SimpleHash hash = new SimpleHash(algorithmName, originPassword,
				user.getuAccount(), hashIterations);
		String encodedPassword = hash.toHex();

		user.setuPassword(encodedPassword);
		String pinyin = PinyinUtil.getPingYin(user.getuAccount());
		if (pinyin.length() > Constants.PINYIN_LENGTH) {
			user.setuPym(pinyin.substring(0, 10));
		}
		user.setuStatus(Constants.EFFECT_YES);
		user.setuType(record.getcType());
		// 后期修改
		logger.debug("需要设置用户默认角色~~~~~~~~~~~~~~~~~~~~~");
		user.setuRoleId(Constants.COMPANY_DEFAULT_ROLE);
		User accountUser = userMapper.selectByAccountOnly(user.getuAccount());
		User telUser = userMapper.queryForUserByTel(user.getuTel());
		if (accountUser != null || telUser != null) {
			throw new RuntimeException("用户名或手机号已存在!");
		}
		marketAreaService.addNewRelative(record.getId(), record.getSets());
		int result = userMapper.insert(user);
//		taskExecutor.execute(() -> mqAssembleService.getMQClinet()
//				.syncSmUser(MQTransformationUtils.transSmUser(
//						userMapper.queryForUserByIdSingle(user.getId()))));
		return i;
	}

	@Override
	@Transactional(propagation = Propagation.SUPPORTS)
	public CompanyVo selectByPrimaryKey(Long orgId) {
		CompanyVo companyVo = companyMapper.selectByPrimaryKey(orgId);
		List<String> strings = marketAreaMapper
				.selectCityNamesByCompanyId(orgId);
		if (!CollectionUtils.isEmpty(strings)) {
			companyVo.setSets(strings.stream().reduce("", (acc, set) -> {
				if (acc == "")
					return set;
				else
					return acc + "," + set;
			}));
		} else {
			companyVo.setSets("");
		}
		return companyVo;
	}

	@Override
	public int updateByPrimaryKeySelective(Company record) {
		Company company = selectByPrimaryKey(record.getId());
		if (company == null)
			return 0;
		marketAreaService.updateByCompanyId(record.getId(), record.getSets());
		int resultCount = companyMapper.updateByPrimaryKeySelective(record);
//		taskExecutor.execute(() -> mqAssembleService.getMQClinet()
//				.syncCompanys(MQTransformationUtils.transComapny(
//						companyMapper.selectByPrimaryKey(record.getId()))));
		return resultCount;
	}

	@Override
	public int updateByPrimaryKey(Company record) {
		Company company = selectByPrimaryKey(record.getId());
		if (company == null)
			return 0;
		marketAreaService.updateByCompanyId(record.getId(), record.getSets());
		int resultCount = companyMapper.updateByPrimaryKey(record);
//		taskExecutor.execute(() -> mqAssembleService.getMQClinet()
//				.syncCompanys(MQTransformationUtils.transComapny(
//						companyMapper.selectByPrimaryKey(record.getId()))));
		return resultCount;
	}

	@Override
	@Transactional(propagation = Propagation.SUPPORTS)
	public List<Company> selectByTypeAndCityAndBhAndName(Integer orgType,
			String orgCity, Long orgPid, String fastSearchStr,
			Integer pageIndex, Integer searchType) {
		if (pageIndex == null || pageIndex == 0) {
			pageIndex = 1;
		}
		PageHelper.startPage(pageIndex, 200);
		return companyMapper.selectByTypeAndCityAndBhAndName(orgType, orgCity,
				orgPid, fastSearchStr, searchType);
	}

	@Override
	@Transactional(propagation = Propagation.SUPPORTS)
	public List<Company> selectTopCompanyByName(String name,
			Integer pageIndex) {
		if (pageIndex == null || pageIndex == 0) {
			pageIndex = 1;
		}
		PageHelper.startPage(pageIndex, 20);
		return companyMapper.selectTopCompanyByName(name);
	}

	@Override
	@Transactional(propagation = Propagation.SUPPORTS)
	public List<CompanyDto> selectAllCompanyWithTree(String name,
			Integer pageIndex) {
		if (pageIndex == null || pageIndex == 0) {
			pageIndex = 1;
		}
		PageHelper.startPage(pageIndex, 10);
		return companyMapper.selectAllCompanyWithTree(name);
	}

	@Override
	@Transactional(propagation = Propagation.SUPPORTS)
	public List<Company> selectChildrenByParentId(Long id) {
		return companyMapper.selectChildrenByParentId(id);
	}

	@Override
	public ResultBean entityAccount(Long companyId) {
		Company company = companyMapper.selectByPrimaryKey(companyId);
		if (company == null) {
			return new ResultBean("-1", "单位不存在");
		}
		if (CompanyTypeEnum.ofValue(company.getcType()).isSupplier()) {
			company.setcOpenAccount(AccountStatusEnum.ALL.getValue());
		} else if (CompanyTypeEnum.ofValue(company.getcType())
				.isDistributor()) {
			company.setcOpenAccount(AccountStatusEnum.FINACCOUNT.getValue());
		} else {
			return new ResultBean("-1", "单位数据异常~");
		}
		int result = companyMapper.updateByPrimaryKeySelective(company);
		return result == 1 ? ResultBean.getSuccessResult()
				: new ResultBean("-1", "修改失败");
	}

	@Override
	@Transactional(propagation = Propagation.SUPPORTS)
	public Company selectByOrgName(String orgName, Long orgId) {
		return companyMapper.selectByOrgName(orgName, orgId);
	}

	@Override
	@Transactional(propagation = Propagation.SUPPORTS)
	public Company selectByOrgMob(String orgMob, Long orgId) {
		return companyMapper.selectByOrgMob(orgMob, orgId);
	}

	@Override
	@Transactional(propagation = Propagation.SUPPORTS)
	public List<Company> selectChildrenById(Long orgId, String fastSearchStr,
			Integer pageIndex) {
		if (pageIndex == null || pageIndex == 0) {
			pageIndex = 1;
		}
		PageHelper.startPage(pageIndex, 20);
		return companyMapper.selectChildrenById(orgId, fastSearchStr);
	}

	@Override
	@Transactional(propagation = Propagation.SUPPORTS)
	public List<Company> selectAuditingCompanies(String fastSearchStr,
			Integer pageIndex, AuditEnum status) {
		if (pageIndex == null || pageIndex == 0) {
			pageIndex = 1;
		}
		PageHelper.startPage(pageIndex, 20);
		return companyMapper.selectAuditingCompanies(fastSearchStr,
				status.getValue());
	}

	@Override
	public Integer modifyAuditStatus(Long orgId, AuditEnum auditEnum,
			String reason) {
		if (Objects.equals(companyMapper.selectByPrimaryKey(orgId), null)) {
			return 0;
		}
		Company company = new Company();
		company.setId(orgId);
		company.setcStatus(auditEnum.getValue());
		company.setReason(reason);
		Integer resultCount = companyMapper
				.updateByPrimaryKeySelective(company);
//		taskExecutor.execute(() -> mqAssembleService.getMQClinet()
//				.syncCompanys(MQTransformationUtils.transComapny(
//						companyMapper.selectByPrimaryKey(company.getId()))));
		return resultCount;
	}

	@Override
	@Transactional(propagation = Propagation.SUPPORTS)
	public Company selectByNo(String no, Long companyId) {
		return companyMapper.selectByNo(no, companyId);
	}

	@Override
	public List<Company> selectCompanyAll(Company company) {
		return companyMapper.selectCompanyAll(company);
	}

	@Override
	public Company selectByCompanyId(Long companyId) {
		return companyMapper.selectByCompanyId(companyId);
	}
}