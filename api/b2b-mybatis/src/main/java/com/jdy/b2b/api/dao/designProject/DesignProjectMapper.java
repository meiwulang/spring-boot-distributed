package com.jdy.b2b.api.dao.designProject;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.jdy.b2b.api.model.designProject.DesignProject;
import com.jdy.b2b.api.model.designProject.DesignProjectWithBLOBs;
import com.jdy.b2b.api.model.designProject.DesignProjectWithBLOBsDTO;

@Mapper
public interface DesignProjectMapper {
    int deleteByPrimaryKey(Long id);

    int insert(DesignProjectWithBLOBs record);

    int insertSelective(DesignProjectWithBLOBs record);

    DesignProjectWithBLOBs selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(DesignProjectWithBLOBs record);

    int updateByPrimaryKeyWithBLOBs(DesignProjectWithBLOBs record);

    int updateByPrimaryKey(DesignProject record);

    List<DesignProject> historyDesignList(Long dId);

    DesignProjectWithBLOBsDTO selectByPrimaryKeyWithManageInfo(Long projectId);
    
	DesignProjectWithBLOBs selectByRid(Long getrId);
}