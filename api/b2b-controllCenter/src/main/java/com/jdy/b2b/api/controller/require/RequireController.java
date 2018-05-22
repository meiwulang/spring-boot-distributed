package com.jdy.b2b.api.controller.require;


import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.designProject.*;
import com.jdy.b2b.api.service.RequireService;
import com.jdy.b2b.api.vo.designproject.RequireSaveVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;



/**   
* @Description 定制游控制层
* @author 王斌
* @date 2017年12月19日 上午11:56:36 
* @version V1.0   
*/
@SuppressWarnings("rawtypes")
@RestController
@RequestMapping("require")
public class RequireController {
@Autowired 
private RequireService requireService;

	@PostMapping("/queryRequireList")
    public ResultBean queryRequireList(@RequestBody RequireVO vo){

        return requireService.queryRequireList(vo);
    }

    @PostMapping("/queryRequireDetail")
    public ResultBean queryRequireDetail(@RequestBody RequireVO vo){
		return requireService.queryRequireDetail(vo);
	}

	@PostMapping("/queryProjectDetail")
    public ResultBean queryProjectDetail(@RequestBody DesignProjectVO vo){
		return requireService.queryProjectDetail(vo);
	}

    @PostMapping("project/save")
	public ResultBean<Object> save(@RequestBody DesignProjectWithBLOBs vo) {
		 return requireService.saveProject(vo);
	}
	@PostMapping("status/update")
	public ResultBean<Object> updateStatus(@RequestBody RequireTypeUpdateVO vo) {
		return requireService.updateStatus(vo);
	}

	//新增需求
	@PostMapping("saveRequire")
	public ResultBean<Long> saveRequire(@RequestBody RequireSaveVO vo){
		return requireService.saveRequire(vo);
	}

	//新增需求
	@PostMapping("saveNewRequire")
	public ResultBean<Long> saveNewRequire(@RequestBody RequireSaveVO vo){
		return requireService.saveNewRequire(vo);
	}

	//历史需求,方案列表
	@GetMapping("historyDesignRequireList/{dId}")
	public ResultBean historyDesignRequireList(@PathVariable Long dId){
		return ResultBean.getIndexSuccessResult(requireService.historyDesignRequireList(dId));
	}

}
