package com.jdy.b2b.web.pojo.electroniccontract;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/14 20:24
 */
public class ProductContractListDTO {

    private List<ContractTemplateInfo> list;
    private Long id;

    public List<ContractTemplateInfo> getList() {
        return list;
    }

    public void setList(List<ContractTemplateInfo> list) {
        this.list = list;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
