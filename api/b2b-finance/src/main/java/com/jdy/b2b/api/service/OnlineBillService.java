package com.jdy.b2b.api.service;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.model.bill.*;

import java.util.List;

/**
 * Created by strict on 2017/8/31.
 */
public interface OnlineBillService {
    PageInfo<OnlineBillParentDTO> queryOnlineBillList(OnlineBillVo onlineBillVo);

    BillTotalInfoDTO sumOnlineBillTotal(OnlineBillVo onlineBillVo);

    void createOnlineBill();

    BillWithOrderPayDto queryOnlineBillDetail(Long id);

    List<BillDto4ExportBillList> queryOnlineBillList4Export(ParamDto4ExportBillList param);
}
