package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.Dictionaries;
import com.jdy.b2b.api.model.DictionariesGroup;
import com.jdy.b2b.api.model.diy.DictionariesGroupDTO;
import com.jdy.b2b.api.model.diy.DictionariesSearchVO;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/17 10:37
 */
public interface DictionariesService {
    /**
     * 字典分组表相关
     */
    List<DictionariesGroupDTO> selectDictionariesGroupList(DictionariesGroup dictionariesGroup);

    int insertSelective(DictionariesGroup record);

    int updateByPrimaryKeySelective(DictionariesGroup record);

    DictionariesGroup getDictGroupById(Long id);

    /**
     * 字典表相关
     */
    List<Dictionaries> selectDictionariesList(DictionariesSearchVO dictionariesDTO);

    int insertSelective(Dictionaries record);

    int updateByPrimaryKeySelective(Dictionaries record);

    Dictionaries getDictById(Long id);
}
