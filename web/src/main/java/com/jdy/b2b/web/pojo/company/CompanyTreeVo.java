package com.jdy.b2b.web.pojo.company;

import com.jdy.b2b.web.annotation.Phone;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * Created by dugq on 2017/7/12.
 */
@ApiModel
public class CompanyTreeVo implements Serializable {

    private static final long serialVersionUID = -656241773745740828L;
    @ApiModelProperty(value = "子单位列表")
    List<CompanyVo> children;

    public List<CompanyVo> getChildren() {
        return children;
    }

    public void setChildren(List<CompanyVo> children) {
        this.children = children;
    }
}

