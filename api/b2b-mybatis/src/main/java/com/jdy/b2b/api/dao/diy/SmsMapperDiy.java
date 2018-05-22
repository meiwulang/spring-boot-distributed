package com.jdy.b2b.api.dao.diy;

import com.jdy.b2b.api.model.Sms;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SmsMapperDiy {
    List<Sms> selectList(Sms sms);
}