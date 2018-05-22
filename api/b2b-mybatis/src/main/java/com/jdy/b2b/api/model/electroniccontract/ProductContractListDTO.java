package com.jdy.b2b.api.model.electroniccontract;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/14 20:24
 */
public class ProductContractListDTO {

    private List<ContractTemplateInfoExt> list;
    private Long id;

    public List<ContractTemplateInfoExt> getList() {
        return list;
    }

    public void setList(List<ContractTemplateInfoExt> list) {
        this.list = list;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
