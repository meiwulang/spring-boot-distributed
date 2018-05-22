package com.jdy.b2b.api.dao.diy;

import com.jdy.b2b.api.model.Dictionaries;
import com.jdy.b2b.api.model.diy.DictionariesSearchVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DictionariesMapperDiy {
    List<Dictionaries> selectDictionariesList(DictionariesSearchVO dictionariesDTO);
}