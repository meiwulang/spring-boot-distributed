package com.jdy.b2b.web.pojo.hotel;


import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

@ApiModel(value="酒店查询vo")
public class HotelAreaQueryVo extends BaseVO {
}