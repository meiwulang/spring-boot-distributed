package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.admission.*;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

/**
 * Created by dugq on 2018/4/18.
 */
public interface AdmissionService {
    ResultBean saveBase(AdmissionBase admissionBase);

    ResultBean listBase(AdmissionBaseListParam param) ;

    ResultBean modifyAdmissionBaseStatus(Long id,Byte status);

    ResultBean getAdmissionBase(Long id);

    ResultBean listProduceDto(AdmissionProduceListParam param);

    ResultBean saveProduce(AdmissionProduce produce);

    ResultBean getProduce(Long id);

    ResultBean modifyProduceStatus(ModifyAdmissionProduceStatusParam param);

    ResultBean modifySalesStatus(ModifyAdmissionProduceStatusParam param);
}
