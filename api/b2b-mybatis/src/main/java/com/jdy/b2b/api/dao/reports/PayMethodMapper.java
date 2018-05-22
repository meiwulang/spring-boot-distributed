package com.jdy.b2b.api.dao.reports;

import com.jdy.b2b.api.model.reports.PayMethodQueryDO;
import com.jdy.b2b.api.model.reports.PayMethodQueryDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * Created by yangcheng on 2017/9/14.
 */

@Mapper
public interface PayMethodMapper {
    List<PayMethodQueryDO> queryPayMethodList(PayMethodQueryDTO trans);
}
