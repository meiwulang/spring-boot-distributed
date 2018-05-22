package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.pojo.company.CompanyBasicInfoVo;
import com.jdy.b2b.web.pojo.company.CompanySetting;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import javax.annotation.PostConstruct;
import java.util.Objects;

/**
 * Created by dugq on 2017/7/12.
 */
@Service
public class CompanyServiceImpl extends BaseService implements com.jdy.b2b.web.service.CompanyService {

    private String indexUrl;
    private String saveUrl;
    private String updateUrl;
    private String entityAccountUrl;
    private String delUrl;
    private String selectTopCompanyUrl;
    private String selectAllCompanyUrl;
    private String selectChildrenUrl;
    private String selectAudioUrl;
    private String modifyAudioUrl;
    private String saveCompanySettingUrl;
    private String selectCompanySettingUrl;
    private String selectCompanySUrl;
    private String selectCompanyAllUrl;

    @PostConstruct
    private void initUrl(){
        indexUrl = controllCenterUrl + "Company/index";
        saveUrl = controllCenterUrl + "Company/add";
        updateUrl = controllCenterUrl + "Company/save";
        entityAccountUrl = controllCenterUrl + "Company/entityAccount";
        delUrl = controllCenterUrl + "Company/del";
        selectTopCompanyUrl = controllCenterUrl + "Company/selectAllTopCompany";
        selectAllCompanyUrl = controllCenterUrl + "Company/selectAllCompanyWithTree";
        selectChildrenUrl = controllCenterUrl + "Company/selectChildrenById";
        selectAudioUrl = controllCenterUrl + "Company/selectAuditingCompanies";
        modifyAudioUrl = controllCenterUrl + "Company/modifyAuditStatus";
        saveCompanySettingUrl = controllCenterUrl + "companySetting/saveByCompanyId";
        selectCompanySettingUrl = controllCenterUrl + "companySetting/selectCompanySetting";
        selectCompanyAllUrl = controllCenterUrl + "Company/syncCompanyAll";
        selectCompanySUrl = controllCenterUrl + "Company/selectCompany";
    }

    @Override
    public ResultBean selectByConditions(CompanyBasicInfoVo company, String fastSearchStr, Integer pageIndex){
        MultiValueMap map = buildMultiValueMap(new String[]{"cType", "cCity","cPid","fastSearchStr","pageIndex","searchType"},
                                                new String[]{Objects.toString(company.getcType(),""),company.getcCity(), Objects.toString(company.getcPid(),""),fastSearchStr, Objects.toString(pageIndex,""),Objects.toString(company.getSearchType(),"")});
        return restTemplate.postForObject(indexUrl,map,ResultBean.class);
    }

    @Override
    public ResultBean save(CompanyBasicInfoVo company){
        return   restTemplate.postForEntity(saveUrl, company,ResultBean.class).getBody();
    }

    @Override
    public <T> ResultBean update(T company){
        return restTemplate.postForEntity(updateUrl,company,ResultBean.class).getBody();
    }

    @Override
    public ResultBean entityAccount(Long id){
        return restTemplate.getForObject(entityAccountUrl + "?id=" + id,ResultBean.class);
    }

    @Override
    public ResultBean del(Long id){
        return restTemplate.getForObject(delUrl + "?id=" + id,ResultBean.class);
    }

    @Override
    public ResultBean selectAllTopCompany(String name, Integer pageIndex){
        MultiValueMap map = buildMultiValueMap(new String[]{"name", "pageIndex"},new String[]{name,pageIndex.toString()});
        return restTemplate.postForObject(selectTopCompanyUrl,map,ResultBean.class);
    }

    @Override
    public ResultBean selectAllCompanyWithTree(String name, Integer pageIndex){
        MultiValueMap map = buildMultiValueMap(new String[]{"pageIndex", "name"},new String[]{pageIndex.toString(),name});
        return restTemplate.postForObject(selectAllCompanyUrl,map,ResultBean.class);
    }

    @Override
    public ResultBean selectChildrenById(Long id, String fastSearchStr, Integer pageIndex){
        MultiValueMap map = buildMultiValueMap(new String[]{"id", "fastSearchStr","pageIndex"},new String[]{id.toString(),fastSearchStr,pageIndex.toString()});
        return restTemplate.postForObject(selectChildrenUrl,map,ResultBean.class);
    }

    @Override
    public ResultBean selectAuditingCompanies(String fastSearchStr, Integer pageIndex){
        MultiValueMap map = buildMultiValueMap(new String[]{"pageIndex", "fastSearchStr"},new String[]{pageIndex.toString(),fastSearchStr});
        return restTemplate.postForObject(selectAudioUrl,map,ResultBean.class);
    }

    @Override
    public ResultBean modifyAuditStatus(Long id, Integer status,String reason){
        MultiValueMap map = buildMultiValueMap(new String[]{"id", "status","reason"},new String[]{id.toString(),Objects.toString(status,""),reason});
        return restTemplate.postForObject(modifyAudioUrl,map,ResultBean.class);
    }

    @Override
    public ResultBean saveCompanySetting(CompanySetting companySetting) {
        return   restTemplate.postForEntity(saveCompanySettingUrl, companySetting,ResultBean.class).getBody();
    }

    @Override
    public ResultBean selectCompanySetting(Long companyId) {
        MultiValueMap map = buildMultiValueMap(new String[]{"companyId"},new String[]{companyId.toString()});
        return restTemplate.postForObject(selectCompanySettingUrl,map,ResultBean.class);
    }

    @Override
    public ResultBean selectCompany(Long companyId) {
        MultiValueMap map = buildMultiValueMap(new String[]{"companyId"},new String[]{companyId.toString()});
        return restTemplate.postForObject(selectCompanySUrl,map,ResultBean.class);
    }


    @Override
    public ResultBean selectSyncCompanyAll(CompanyBasicInfoVo company) {
        return restTemplate.postForEntity(selectCompanyAllUrl,company,ResultBean.class).getBody();
    }

    private MultiValueMap buildMultiValueMap(String[] key,String[] value){
        MultiValueMap map = new LinkedMultiValueMap<String,String>();
        for(int i =0 ; i < key.length; i++){
            map.add(key[i],value[i]);
        }
        return map;
    }
}
