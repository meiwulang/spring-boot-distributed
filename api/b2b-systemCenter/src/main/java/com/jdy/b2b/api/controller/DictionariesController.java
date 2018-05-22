package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.Dictionaries;
import com.jdy.b2b.api.model.DictionariesGroup;
import com.jdy.b2b.api.model.diy.DictionariesSearchVO;
import com.jdy.b2b.api.service.DictionariesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/17 10:36
 */
@RestController
@RequestMapping("Dictionaries")
public class DictionariesController extends BaseController {

    @Autowired
    DictionariesService dictionariesService;

    /**
     * 字典分组Group相关操作
     */
    @PostMapping("/dictGroupList")
    public ResultBean dictGroupList(@RequestBody DictionariesGroup record) {
        if (record.getCurrPage() != null && record.getPageSize() != null) {
            PageHelper.startPage(record.getCurrPage(), record.getPageSize());
        }
        List list = dictionariesService.selectDictionariesGroupList(record);
        return ResultBean.getSuccessResult(new PageInfo(list));
    }

    @PostMapping("/insertDictGroup")
    public ResultBean insertDictGroup(@RequestBody DictionariesGroup record) {
        dictionariesService.insertSelective(record);
        return ResultBean.getSuccessResult();
    }

    @GetMapping("/getDictGroupById/{id}")
    public ResultBean getDictGroupById(@PathVariable Long id) {
        return ResultBean.getSuccessResult(dictionariesService.getDictGroupById(id));
    }

    @PostMapping("/updateDictGroup")
    public ResultBean updateDictGroup(@RequestBody DictionariesGroup record) {
        dictionariesService.updateByPrimaryKeySelective(record);
        return ResultBean.getSuccessResult();
    }

    /**
     * 字典表相关操作
     */
    @PostMapping("/dictList")
    public ResultBean dictList(@RequestBody DictionariesSearchVO record) {
        boolean page = (record.getCurrPage() != null && record.getPageSize() != null) ? true : false;
        if (page) {
            PageHelper.startPage(record.getCurrPage(), record.getPageSize());
        }
        List<Dictionaries> list = dictionariesService.selectDictionariesList(record);
        if (CollectionUtils.isEmpty(list)) {
            return new ResultBean("-1", "未找到相关字典信息");
        } else {
            boolean b = list.stream().anyMatch(t -> "销售总".equals(t.getdName()));
            if (b) {
                Dictionaries d = new Dictionaries();
                d.setCompanyId(999999L);
                d.setdName("非销售岗");
                list.add(d);
            }
            if (page) {
                return ResultBean.getSuccessResult(new PageInfo(list));
            } else {
                return ResultBean.getSuccessResult(list);
            }
        }
    }

    @PostMapping("/insertDict")
    public ResultBean insertDict(@RequestBody Dictionaries dict) {
        dictionariesService.insertSelective(dict);
        return ResultBean.getSuccessResult();
    }

    @GetMapping("/getDictById/{id}")
    public ResultBean getDictById(@PathVariable Long id) {
        return ResultBean.getSuccessResult(dictionariesService.getDictById(id));
    }

    @PostMapping("/updateDict")
    public ResultBean updateDict(@RequestBody Dictionaries dict) {
        dictionariesService.updateByPrimaryKeySelective(dict);
        return ResultBean.getSuccessResult();
    }
}
