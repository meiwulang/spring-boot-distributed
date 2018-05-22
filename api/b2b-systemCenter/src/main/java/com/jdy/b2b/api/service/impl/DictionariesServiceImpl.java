package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.dao.DictionariesGroupMapper;
import com.jdy.b2b.api.dao.DictionariesMapper;
import com.jdy.b2b.api.dao.diy.DictionariesGroupMapperDiy;
import com.jdy.b2b.api.dao.diy.DictionariesMapperDiy;
import com.jdy.b2b.api.model.Dictionaries;
import com.jdy.b2b.api.model.DictionariesGroup;
import com.jdy.b2b.api.model.diy.DictionariesGroupDTO;
import com.jdy.b2b.api.model.diy.DictionariesSearchVO;
import com.jdy.b2b.api.service.DictionariesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/17 10:41
 */
@Service
public class DictionariesServiceImpl extends BaseService implements DictionariesService {

    @Autowired
    DictionariesMapper dictionariesMapper;
    @Autowired
    DictionariesMapperDiy dictionariesMapperDiy;
    @Autowired
    DictionariesGroupMapper dictionariesGroupMapper;
    @Autowired
    DictionariesGroupMapperDiy dictionariesGroupMapperDiy;

    @Override
    public List<DictionariesGroupDTO> selectDictionariesGroupList(DictionariesGroup dictionariesGroup) {
        return dictionariesGroupMapperDiy.selectDictionariesGroupList(dictionariesGroup);
    }

    @Override
    public int insertSelective(DictionariesGroup record) {
        int res = dictionariesGroupMapper.insertSelective(record);
        if (res == 1) {
            return res;
        } else {
            throw new RuntimeException("保存字典分组信息出错了！");
        }
    }

    @Override
    public int updateByPrimaryKeySelective(DictionariesGroup record) {
        int res = dictionariesGroupMapper.updateByPrimaryKeySelective(record);
        if (res == 1) {
            return res;
        } else {
            throw new RuntimeException("更新字典分组信息出错了！");
        }
    }

    @Override
    public DictionariesGroup getDictGroupById(Long id) {
        return dictionariesGroupMapper.selectByPrimaryKey(id);
    }

    @Override
    public List<Dictionaries> selectDictionariesList(DictionariesSearchVO record) {
        return dictionariesMapperDiy.selectDictionariesList(record);
    }

    @Override
    public int insertSelective(Dictionaries record) {
        // 如果是管理公司，记录设置为0，表示公用
        if (Integer.valueOf(2).equals(record.getPcType())) {
            record.setCompanyId(0L);
        } else {
            Long cid = record.getPcompanyId();
            record.setCompanyId(cid == null ? 0 : cid);
        }
        int res = dictionariesMapper.insertSelective(record);
        if (res == 1) {
            return res;
        } else {
            throw new RuntimeException("保存字典信息失败！");
        }
    }

    @Override
    public int updateByPrimaryKeySelective(Dictionaries record) {
        int res = dictionariesMapper.updateByPrimaryKeySelective(record);
        if (res == 1) {
            return res;
        } else {
            throw new RuntimeException("更新字典信息失败！");
        }
    }

    @Override
    public Dictionaries getDictById(Long id) {
        return dictionariesMapper.selectByPrimaryKey(id);
    }
}
