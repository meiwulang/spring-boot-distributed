package com.jdy.b2b.web.controll.org.struct;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.web.pojo.department.DepartmentVo;
import com.jdy.b2b.web.pojo.department.LeaderVo;
import com.jdy.b2b.web.pojo.orgstruct.ChangeCompanyVO;
import com.jdy.b2b.web.pojo.orgstruct.ChangeDepartmentVO;
import com.jdy.b2b.web.pojo.orgstruct.ChangeOrgNameVO;
import com.jdy.b2b.web.pojo.orgstruct.CreateCompanyVO;
import com.jdy.b2b.web.pojo.orgstruct.CreateDepartmentVO;
import com.jdy.b2b.web.pojo.orgstruct.QueryManagerVO;
import com.jdy.b2b.web.pojo.orgstruct.SetManagerVO;
import com.jdy.b2b.web.pojo.user.UserResultDTO;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

/**
 * @Description 组织架构
 * @author 王斌
 * @date 2017年11月15日 上午11:21:47
 * @version V1.0
 */
@RestController
@Api(description = "组织架构")
@SuppressWarnings("unchecked")
public class OrgStructsController extends BaseController {

	@Autowired
	@Qualifier("shiroEhcacheManager")
	private EhCacheManager ehCacheManager;

	@PostMapping("struct/setmanager")
	@ApiOperation(value = "设置负责人")
	public ResultBean<Object> setManagerForDepartment(
			@RequestBody SetManagerVO vo) {
		vo.setUserId(getCurrentUserId());
		return restTemplate
				.postForEntity(
						new StringBuilder(systemCenterUrl)
								.append("struct/setmanager").toString(),
						vo, ResultBean.class)
				.getBody();
	}

	@PostMapping("struct/setLeader")
	public ResultBean setLeader(@RequestBody DepartmentVo vo){
		return restTemplate
				.postForEntity(
						new StringBuilder(systemCenterUrl)
								.append("struct/setLeader").toString(),
						vo, ResultBean.class)
				.getBody();
	}


	@RequestMapping("struct/leader")
	public ResultBean leader(@RequestBody LeaderVo vo){
		return restTemplate
				.getForObject(systemCenterUrl+"struct/leader/"+vo.getCompanyId(),ResultBean.class);
	}

	@PostMapping("struct/changedepartment")
	@ApiOperation(value = "调整部门")
	public ResultBean<Object> changeDepartment(
			@Validated @RequestBody ChangeDepartmentVO vo) {
		logger.error("changeDepartment入參：\n"+vo.toString());
		return restTemplate.postForEntity(
				new StringBuilder(systemCenterUrl)
						.append("struct/changedepartment").toString(),
				vo, ResultBean.class).getBody();
	}

	@PostMapping("struct/changeCompany")
	@ApiOperation(value = "调整公司")
	public ResultBean<Object> changeCompany(
			@RequestBody @Validated ChangeCompanyVO vo) {
		vo.setUserId(getCurrentUserId());
		return restTemplate.postForEntity(
				new StringBuilder(systemCenterUrl)
						.append("struct/changeCompany").toString(),
				vo, ResultBean.class).getBody();

	}

	@PostMapping("struct/managers")
	@ApiOperation(value = "领导列表")
	public ResultBean<Object> managers(
			@RequestBody @Validated QueryManagerVO vo) {
		return restTemplate
				.postForEntity(
						new StringBuilder(systemCenterUrl)
								.append("struct/managers").toString(),
						vo, ResultBean.class)
				.getBody();

	}

	@PostMapping("struct/changeorgname")
	@ApiOperation(value = "编辑组织名称")
	public ResultBean<Object> changeOrgName(
			@RequestBody @Validated ChangeOrgNameVO vo) {
		vo.setUserId(getCurrentUserId());
		return restTemplate.postForEntity(
				new StringBuilder(systemCenterUrl)
						.append("struct/changeorgname").toString(),
				vo, ResultBean.class).getBody();

	}

	@PostMapping("struct/createcompany")
	@ApiOperation(value = "新增公司")
	public ResultBean<Object> createOrg(
			@RequestBody @Validated CreateCompanyVO vo) {
		vo.setUserId(getCurrentUserId());
		return restTemplate.postForEntity(
				new StringBuilder(systemCenterUrl)
						.append("struct/createcompany").toString(),
				vo, ResultBean.class).getBody();

	}

	@PostMapping("struct/createdepartment")
	@ApiOperation(value = "新增部门")
	public ResultBean<Object> createdepartment(
			@RequestBody @Validated CreateDepartmentVO vo) {
		vo.setCreateUser(getCurrentUserId());
		return restTemplate.postForEntity(
				new StringBuilder(systemCenterUrl)
						.append("struct/createdepartment").toString(),
				vo, ResultBean.class).getBody();

	}

	// @PostMapping("struct/list")
	// @ApiOperation(value = "组织架构列表")
	// public ResultBean<Object> list() {
	// return restTemplate.postForEntity(new StringBuilder(systemCenterUrl)
	// .append("struct/list").toString(), null, ResultBean.class)
	// .getBody();
	//
	// }

	@ApiImplicitParams(value = {
			@ApiImplicitParam(name = "orgId", value = "组织编号", required = true, paramType = "path"),
			@ApiImplicitParam(value = "组织类型，0：公司，1：部门", required = true, name = "type", paramType = "path") })
	@GetMapping("struct/delete/{orgId}/{type}")
	@ApiOperation(value = "撤销组织")
	public ResultBean<Object> delete(@PathVariable("orgId") Long orgId,
			@PathVariable("type") Integer type) {
		return restTemplate.getForEntity(new StringBuilder(systemCenterUrl)
				.append("struct/delete").append("/").append(orgId).append("/")
				.append(type).append("/").append(getCurrentUserId()).toString(),
				ResultBean.class).getBody();

	}

	/**
	 * @Description: 获取当前登录用户编号
	 * @author 王斌
	 * @date 2017年11月15日 下午1:36:28
	 * @return
	 */
	private Long getCurrentUserId() {
		Cache<Object, Object> cache = ehCacheManager
				.getCache("currentUserCache");
		Subject subject = SecurityUtils.getSubject();
		UserResultDTO user = (UserResultDTO) subject.getPrincipal();
		return user.getUserId();
	}
}
