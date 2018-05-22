package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.pojo.admission.*;
import com.jdy.b2b.web.service.AdmissionService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import javax.annotation.PostConstruct;
import java.util.HashMap;

/**
 * Created by dugq on 2018/4/18.
 */
@Service
public class AdmissionServiceImpl extends BaseService implements AdmissionService {

    private String saveBaseUrl;
    private String listBaseUrl;
    private String modifyAdmissionBaseStatusUrl;
    private String getAdmissionBaseUrl;
    private String listProduceDtoUrl;
    private String saveProduceUrl;
    private String getProduceUrl;
    private String modifyProduceStatusUrl;
    private String modifySalesStatusUrl;


    @Override
    public ResultBean saveBase(AdmissionBase admissionBase) {
        return restTemplate.postForEntity(saveBaseUrl,admissionBase,ResultBean.class).getBody();
    }

    @Override
    public ResultBean listBase(AdmissionBaseListParam param) {
        return restTemplate.postForEntity(listBaseUrl,param,ResultBean.class).getBody();
    }

    @Override
    public ResultBean modifyAdmissionBaseStatus(Long id,Byte status) {
        HashMap multiValueMap = buildMultiValueMap(new String[]{"id","status"}, new String[]{id.toString(),status.toString()});
        return restTemplate.getForObject(modifyAdmissionBaseStatusUrl,ResultBean.class,multiValueMap);
    }

    @Override
    public ResultBean getAdmissionBase(Long id) {
        HashMap multiValueMap = buildMultiValueMap(new String[]{"id"}, new String[]{id.toString()});
        return restTemplate.getForObject(getAdmissionBaseUrl,ResultBean.class,multiValueMap);
    }

    @Override
    public ResultBean listProduceDto(AdmissionProduceListParam param) {
        return restTemplate.postForEntity(listProduceDtoUrl,param,ResultBean.class).getBody();
    }

    @Override
    public ResultBean saveProduce(AdmissionProduce produce) {
        return restTemplate.postForEntity(saveProduceUrl,produce,ResultBean.class).getBody();
    }

    @Override
    public ResultBean getProduce(Long id) {
        HashMap multiValueMap = buildMultiValueMap(new String[]{"id"}, new String[]{id.toString()});
        return restTemplate.getForObject(getProduceUrl,ResultBean.class,multiValueMap);
    }

    @Override
    public ResultBean modifyProduceStatus(ModifyAdmissionProduceStatusParam param) {
        return restTemplate.postForEntity(modifyProduceStatusUrl,param,ResultBean.class).getBody();
    }

    @Override
    public ResultBean modifySalesStatus(ModifyAdmissionProduceStatusParam param) {
        return restTemplate.postForEntity(modifySalesStatusUrl,param,ResultBean.class).getBody();
    }


    @PostConstruct
    public void init(){
        saveBaseUrl = controllCenterUrl+"admission/base/saveAdmissionBase";
        listBaseUrl= controllCenterUrl+"admission/base/list";
        modifyAdmissionBaseStatusUrl= controllCenterUrl+"admission/base/modifyAdmissionBaseStatus/{id}/{status}";
        getAdmissionBaseUrl= controllCenterUrl+"admission/base/getAdmissionBase/{id}";
        listProduceDtoUrl = controllCenterUrl + "admission/produce/listDto";
        saveProduceUrl= controllCenterUrl + "admission/produce/save";
        getProduceUrl= controllCenterUrl + "admission/produce/get/{id}";
        modifyProduceStatusUrl= controllCenterUrl + "admission/produce/modifyProduceStatus";
        modifySalesStatusUrl= controllCenterUrl + "admission/produce/modifySalesStatus";

    }
    private HashMap<String,Object> buildMultiValueMap(String[] key, String[] value){
        HashMap map = new HashMap<String,Object>();
        for(int i =0 ; i < key.length; i++){
            map.put(key[i],value[i]);
        }
        return map;
    }
}
