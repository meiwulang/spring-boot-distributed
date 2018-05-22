package com.jdy.b2b.api.dao.diy;

import com.jdy.b2b.api.model.DictionariesGroup;
import com.jdy.b2b.api.model.diy.DictionariesGroupDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DictionariesGroupMapperDiy {
    List<DictionariesGroupDTO> selectDictionariesGroupList(DictionariesGroup dictionariesGroup);
}