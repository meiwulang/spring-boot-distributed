package com.jdy.b2b.web.controll.require;

import com.jdy.b2b.web.pojo.log.MyLog;
import com.jdy.b2b.web.pojo.product.ProductVO;
import com.jdy.b2b.web.pojo.require.*;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**   
* @Description 定制游控制层
* @author 王斌
* @date 2017年12月19日 上午11:54:16 
* @version V1.0    
*/
@Api(value = "require")
@RestController
@RequestMapping("require")
@SuppressWarnings("unchecked")
public class RequireController  extends BaseController{
	@PostMapping("project/save")
	@MyLog
	public ResultBean<Object> save(@RequestBody @Validated DesignProject vo) {
		 return restTemplate.postForObject(new StringBuilder(controllCenterUrl).append("require/project/save").toString(),vo,ResultBean.class);
	}
	@PostMapping("status/update")
	@MyLog
	public ResultBean<Object> updateStatus(@RequestBody @Validated RequireTypeUpdateVO vo) {
		return restTemplate.postForObject(new StringBuilder(controllCenterUrl).append("require/status/update").toString(),vo,ResultBean.class);
	}

	@ApiOperation(value = "新增需求")
	@PostMapping("saveRequire")
	public ResultBean saveRequire(@RequestBody RequireSaveVO vo) {
		return restTemplate.postForObject(new StringBuilder(controllCenterUrl).append("require/saveRequire").toString(), vo, ResultBean.class);
	}

	@ApiOperation(value = "新增改进需求")
	@PostMapping("saveNewRequire")
	public ResultBean saveNewRequire(@RequestBody RequireSaveVO vo) {
		return restTemplate.postForObject(new StringBuilder(controllCenterUrl).append("require/saveNewRequire").toString(), vo, ResultBean.class);
	}

	@ApiOperation(value = "历史方案需求列表")
	@GetMapping("historyDesignRequireList/{dId}")
	public ResultBean historyDesignRequireList(@PathVariable Long dId) {
		return restTemplate.getForObject(new StringBuilder(controllCenterUrl).append("require/historyDesignRequireList/").append(dId).toString(), ResultBean.class);
	}
	@ApiOperation(value = "获取定制(需求)列表")
	@PostMapping("/queryRequireList")
	public ResultBean queryRequireList(@RequestBody RequireVO vo){
		if (!vo.getPuDataLimit().equals(Integer.valueOf(3))){
			vo.setCompanyId(vo.getPcompanyId());
		}
		return restTemplate.postForObject(new StringBuilder(controllCenterUrl).append("require/queryRequireList").toString(),vo,ResultBean.class);
	}
	@ApiOperation(value = "获取 需求详情")
	@PostMapping("/queryRequireDetail")
	public ResultBean queryRequireDetail(@RequestBody RequireVO vo){
		return restTemplate.postForObject(new StringBuilder(controllCenterUrl).append("require/queryRequireDetail").toString(),vo,ResultBean.class    );
	}
	@ApiOperation(value = "获取 方案详情")
	@PostMapping("/queryProjectDetail")
	public ResultBean queryProjectDetail(@RequestBody DesignProjectVO vo){
		return restTemplate.postForObject(new StringBuilder(controllCenterUrl).append("require/queryProjectDetail").toString(),vo,ResultBean.class    );
	}
	@ApiOperation(value = "保存关联")
	@PostMapping("/saveDesignProduct")
	public ResultBean saveDesignProduct(@RequestBody DesignProduct vo){
		vo.setCreateUser(getUser().getUserId());
		return restTemplate.postForObject(new StringBuilder(controllCenterUrl).append("designProduct/save").toString(),vo,ResultBean.class    );
	}

	@ApiOperation(value = "获取产品")
	@PostMapping("/searchProduct")
	public ResultBean searchProduct(@RequestBody SearchProduct vo){
		return restTemplate.postForObject(new StringBuilder(controllCenterUrl).append("designProduct/searchProduct").toString(),vo,ResultBean.class    );
	}
}
