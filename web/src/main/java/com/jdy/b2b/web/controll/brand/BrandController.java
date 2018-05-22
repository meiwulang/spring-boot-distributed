package com.jdy.b2b.web.controll.brand;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.web.pojo.brand.BrandVO;
import com.jdy.b2b.web.pojo.log.MyLog;
import com.jdy.b2b.web.pojo.user.UserResultDTO;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.annotations.Delete;
import com.jdy.b2b.web.util.annotations.Query;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * @Description: 品牌控制层
 * @author 王斌
 * @date 2017年8月9日 上午10:05:52
 * @version V1.0
 */
@RestController
@RequestMapping(value = "brand")
@Api(description = "品牌管理")
public class BrandController extends BaseController {
	@PostMapping("/list")
	@ApiOperation("品牌列表")
	public ResultBean<?> list(
			@Validated(Query.class) @RequestBody BrandVO brand) {
		setPermissions(brand);
		StringBuffer url = new StringBuffer(systemCenterUrl)
				.append("brand/list");
		return restTemplate
				.postForEntity(url.toString(), brand, ResultBean.class)
				.getBody();
	}

	@PostMapping("/toplist")
	@ApiOperation("精品品牌列表")
	public ResultBean<?> listForIndex(
			@RequestParam(required = true, name = "size") @ApiParam(value = "精品品牌列表数量") int size) {
		StringBuffer url = new StringBuffer(systemCenterUrl)
				.append("brand/toplist?size=").append(size);
		return restTemplate
				.postForEntity(url.toString(), null, ResultBean.class)
				.getBody();
	}

	@MyLog
	@PostMapping("/update")
	@ApiOperation("品牌编辑")
	public ResultBean<?> update(
			@Validated(Update.class) @RequestBody BrandVO brand) {
		setPermissions(brand);
		StringBuffer url = new StringBuffer(systemCenterUrl)
				.append("brand/update");
		return restTemplate
				.postForEntity(url.toString(), brand, ResultBean.class)
				.getBody();
	}

	@PostMapping("/delete")
	@ApiOperation("品牌删除")
	public ResultBean<?> delete(
			@Validated(Delete.class) @RequestBody BrandVO brand) {
		setPermissions(brand);
		StringBuffer url = new StringBuffer(systemCenterUrl)
				.append("brand/delete");
		return restTemplate
				.postForEntity(url.toString(), brand, ResultBean.class)
				.getBody();
	}

	@MyLog
	@PostMapping("/save")
	@ApiOperation("品牌保存")
	public ResultBean<?> save(
			@Validated(Save.class) @RequestBody BrandVO brand) {
		setPermissions(brand);
		StringBuffer url = new StringBuffer(systemCenterUrl)
				.append("brand/save");
		return restTemplate
				.postForEntity(url.toString(), brand, ResultBean.class)
				.getBody();
	}
    /**
     * @Description: 设置权限
     * @author 王斌
     * @date 2017年12月12日 下午2:01:30
     * @param vo
     */
    private void setPermissions(BrandVO vo) {
        UserResultDTO userInfo = getUser();
        Long companyId = userInfo.getuCompanyId();
        // 系统级用户 查看全部数据
        Integer uDataLimit = userInfo.getuDataLimit();
        if (!Integer.valueOf(3).equals(uDataLimit) ) {
            vo.setbCompanyId(companyId);
        }
    }

}
