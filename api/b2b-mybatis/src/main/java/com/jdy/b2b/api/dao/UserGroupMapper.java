package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.virtualGroup.UserGroup;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserGroupMapper {
    int deleteByPrimaryKey(Long id);

    int insert(UserGroup record);

    int insertSelective(UserGroup record);

    UserGroup selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(UserGroup record);

    int updateByPrimaryKey(UserGroup record);

    List<UserGroup> selectByUserAccount(@Param("name") String name, @Param("gno") String gno);

    int deleteByUserAccount(String name);
}