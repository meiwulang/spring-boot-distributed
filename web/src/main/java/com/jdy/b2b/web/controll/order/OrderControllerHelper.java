package com.jdy.b2b.web.controll.order;

import com.jdy.b2b.web.pojo.order.OrderSearchVO;
import com.jdy.b2b.web.util.ResultBean;

import static com.jdy.b2b.web.enums.UserDataLimitEnum.DATA_LIMIT_COMPANY;
import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;
import static org.apache.commons.lang3.time.DateUtils.addDays;
import static org.apache.commons.lang3.time.DateUtils.truncatedCompareTo;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/18 15:59
 */
public class OrderControllerHelper {

    protected static ResultBean validateExportDate(OrderSearchVO vo) {
        if (vo.getDateType() == null) return new ResultBean("-1", "请指定日期类型");
        if (isNull(vo.getDateStart()) || isNull(vo.getDateEnd())) return new ResultBean("-1", "请指定开始结束日期");
        if (truncatedCompareTo(addDays(vo.getDateStart(), 30), vo.getDateEnd(), 5) < 0)
            return new ResultBean("-1", "时间跨度不能超过30天");

        return ResultBean.getSuccessResult();
    }

    protected static ResultBean validateUserAndCompany(OrderSearchVO vo) {
		Integer getoStatus = vo.getoStatus();
//		    if (nonNull(vo.getDateStart())) {
//		        if (isNull(vo.getDateEnd())) return new ResultBean("-1", "请指定结束日期！");
//		        if (isNull(vo.getDateType())) return new ResultBean("-1", "请指定日期类型！");
//		    }
//		    if (nonNull(vo.getDateEnd())) {
//		        if (isNull(vo.getDateStart())) return new ResultBean("-1", "请指定开始日期！");
//		        if (isNull(vo.getDateType())) return new ResultBean("-1", "请指定日期类型！");
//		    }
        if (isNull(vo.getPuserId())) return new ResultBean("-1", "当前用户信息有误！");
        if (isNull(vo.getPcompanyId())) return new ResultBean("-1", "当前用户公司信息有误！");
        if (isNull(vo.getPuDataLimit())) return new ResultBean("-1", "当前用户数据级别信息有误！");
        if (DATA_LIMIT_COMPANY.equals(vo.getPuDataLimit()) && isNull(vo.getPcompanyId()))
            return new ResultBean("-1", "当前用户公司信息有误！");

        return ResultBean.getSuccessResult();
    }

}
