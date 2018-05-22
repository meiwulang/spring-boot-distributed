package com.jdy.b2b.api.model.company;

/**
 * Created by yangcheng on 2017/9/23.
 */
public class MobileCompanyConditionDO {

    private Integer id;
    private String name;
    private String sname;//暂时使用name
    private String logo;//暂时不传

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getSname() {
        return sname;
    }

    public void setSname(String sname) {
        this.sname = sname;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }
}
