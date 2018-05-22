package com.jdy.b2b.web.controll.dict;

import com.jdy.b2b.web.pojo.dict.*;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/31 16:21
 */
@Api(value = "Dictionaries", description = "字典")
@RestController
@RequestMapping("Dictionaries")
public class DictionariesController extends BaseController {

    @Value("${systemCenterUrl}Dictionaries")
    String MODULE_URL;

    @ApiOperation("字典分组管理列表")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "字典分组", response = DictGroupWithSub.class)})
    @PostMapping("/dictGroupList")
    public ResultBean dictGroupList(@Validated @RequestBody DictGroupListDTO dto) {
        return restTemplate.postForObject(MODULE_URL + "/dictGroupList", dto, ResultBean.class);
    }

    @ApiOperation("插入字典分组")
    @PostMapping("/insertDictGroup")
    public ResultBean insertDictGroup(@Validated @RequestBody DictGroupInsertDTO record) {
        record.setDgStatus(0);
        return restTemplate.postForObject(MODULE_URL + "/insertDictGroup", record, ResultBean.class);
    }

    @ApiOperation("更新字典分组")
    @PostMapping("/updateDictGroup")
    public ResultBean updateDictGroup(@Validated @RequestBody DictGroupUpdateDTO record) {
        return restTemplate.postForObject(MODULE_URL + "/updateDictGroup", record, ResultBean.class);
    }

    @ApiOperation("根据id查询字典分组")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "字典信息", response = DictGroup.class)})
    @GetMapping("/getDictGroupById/{id}")
    public ResultBean getDictGroupById(@PathVariable Long id) {
        return restTemplate.getForObject(MODULE_URL + "/getDictGroupById/{id}", ResultBean.class, id);
    }

    @ApiOperation("删除字典分组")
    @PostMapping("/deleteDictGroup")
    public ResultBean deleteDictGroup(@Validated @RequestBody DictGroupDeleteDTO record) {
        record.setDgStatus(1);//0-有效，1-无效
        return restTemplate.postForObject(MODULE_URL + "/updateDictGroup", record, ResultBean.class);
    }

    @ApiOperation("字典列表")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "字典信息", response = Dict.class)})
    @PostMapping("/dictList")
    public ResultBean dictList(@Validated @RequestBody DictListDTO dto) {
        return restTemplate.postForObject(MODULE_URL + "/dictList", dto, ResultBean.class);
    }

    @ApiOperation("插入字典")
    @PostMapping("/insertDict")
    public ResultBean insertDict(@Validated @RequestBody DictInsertDTO record) {
        record.setdStatus(0);
        return restTemplate.postForObject(MODULE_URL + "/insertDict", record, ResultBean.class);
    }

    @ApiOperation("更新字典")
    @PostMapping("/updateDict")
    public ResultBean updateDict(@Validated @RequestBody DictUpdateDTO record) {
        return restTemplate.postForObject(MODULE_URL + "/updateDict", record, ResultBean.class);
    }

    @ApiOperation("根据id查询字典名词")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "字典信息", response = Dict.class)})
    @GetMapping("/getDictById/{id}")
    public ResultBean getDictById(@PathVariable Long id) {
        return restTemplate.getForObject(MODULE_URL + "/getDictById/{id}", ResultBean.class, id);
    }
}
