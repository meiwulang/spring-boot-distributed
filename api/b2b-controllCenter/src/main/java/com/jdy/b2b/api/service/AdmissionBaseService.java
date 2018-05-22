package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.admission.AdmissionBase;
import com.jdy.b2b.api.model.admission.AdmissionBaseDto;
import com.jdy.b2b.api.model.admission.AdmissionBaseListParam;
import com.jdy.b2b.api.model.admission.AdmissionBaseWithBLOBs;

import java.util.List;

/**
 * Created by dugq on 2018/4/17.
 */
public interface AdmissionBaseService {
    boolean isAdmissionComplete(Long id);

    int deleteByPrimaryKey(Long id);

    int insert(AdmissionBaseWithBLOBs record);

    int insertSelective(AdmissionBaseWithBLOBs record);

    AdmissionBaseWithBLOBs selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(AdmissionBaseWithBLOBs record);

    int updateByPrimaryKeyWithBLOBs(AdmissionBaseWithBLOBs record);

    int updateByPrimaryKey(AdmissionBase record);

    List<AdmissionBaseDto> selectByParam(AdmissionBaseListParam param);

    /**
     * 修改状态
     * @param id
     * @return
     */
    int updateAdmissionBaseStatus(Long baseId,Byte status);

    /**
     * 判断本次操作后产品是否完成
     *  如果status 本来是0 ，且本次操作后基本信息，电子合同和成本信息都完成，则修改status为1
     * @param id
     * @return
     */
    int completeAdmission(Long baseId);
}
