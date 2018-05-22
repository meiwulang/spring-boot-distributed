package com.jdy.b2b.api.service.impl;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.designProject.DesignMapper;
import com.jdy.b2b.api.dao.designProject.DesignProjectMapper;
import com.jdy.b2b.api.dao.designProject.RequireMapper;
import com.jdy.b2b.api.enums.RequireStatus;
import com.jdy.b2b.api.model.designProject.Design;
import com.jdy.b2b.api.model.designProject.DesignProject;
import com.jdy.b2b.api.model.designProject.DesignProjectVO;
import com.jdy.b2b.api.model.designProject.DesignProjectWithBLOBs;
import com.jdy.b2b.api.model.designProject.DesignProjectWithBLOBsDTO;
import com.jdy.b2b.api.model.designProject.DesignRequireListDO;
import com.jdy.b2b.api.model.designProject.Require;
import com.jdy.b2b.api.model.designProject.RequireDTO;
import com.jdy.b2b.api.model.designProject.RequireDetailDTO;
import com.jdy.b2b.api.model.designProject.RequireTypeUpdateVO;
import com.jdy.b2b.api.model.designProject.RequireVO;
import com.jdy.b2b.api.service.RequireService;
import com.jdy.b2b.api.vo.designproject.RequireSaveVO;

/**
 * @author 王斌
 * @version V1.0
 * @Description 定制游业务层
 * @date 2017年12月19日 下午3:08:15
 */
@Service
public class RequireServiceImpl implements RequireService {
    @Autowired
    private DesignProjectMapper dProjectMapper;
    @Autowired
    private RequireMapper requireMapper;
    @Autowired
    private DesignMapper designMapper;
    @Autowired
    private DesignProjectMapper designProjectMapper;

    @Override
    @Transactional
    public ResultBean<Object> saveProject(DesignProjectWithBLOBs vo) {
    	
    	//一个需求最多只会对应一个方案
		//检查需求是否已定制
		DesignProjectWithBLOBs project = dProjectMapper.selectByRid(vo.getrId());
		Long pid= vo.getId();
		//只要定制的 需求id，和 projectid不匹配就将projectid置为null
		if(project!=null){
			if(pid==null){
				
				return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,Constants.Error.PROJECT_EXIST);
			}else if(!project.getId().equals(pid)){
				vo.setId(null);
			}
		}else{
			vo.setId(null);
		}
    	
        //操作为保存时,保存或者编辑方案、修改定制的最终方案;操作为提交时,保存或者编辑方案、修改定制的最终方案,同时修改定制的状态

		Design design = new Design();
		if (Long.valueOf(1L).equals(vo.getOperationType())) {//提交操作
			design.setdStatus(Integer.valueOf(3));
			vo.setStatus(0);
		}
    	final Date createTime = new Date();
        if (vo.getId() == null) {
            vo.setDpCompanyId(vo.getPcompanyId());
			vo.setCreateTime(createTime);
            dProjectMapper.insertSelective(vo);
        } else {
            vo.setDpCompanyId(vo.getPcompanyId());
            vo.setUpdateTime(createTime);
            dProjectMapper.updateByPrimaryKeySelective(vo);
        }
        design.setId(vo.getDesignId());
        design.setLastPId(vo.getId());
        designMapper.updateByPrimaryKeySelective(design);
        return ResultBean.getSuccessResultForLog(vo.getId());

    }
    @Override
    @Transactional
    public ResultBean<Object> updateStatus(RequireTypeUpdateVO vo) {
        Design trans = JSONUtil.trans(vo, Design.class);
        if (Long.valueOf(2).equals(vo.getdStatus())) {
            trans.setAnswerTime(new Date());
            trans.setManagerId(vo.getPuserId());
        }
        designMapper.updateByPrimaryKeySelective(trans);
        return ResultBean.getSuccessResultForLog(vo.getId());
    }

    @Override
    public ResultBean queryRequireList(RequireVO vo) {
        if (vo.getCurrPage() != null && vo.getPageSize() != null) {
            PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
        } else {
            PageHelper.startPage(1, 20);
        }
        PageInfo<RequireDTO> pageInfo = new PageInfo<>(requireMapper.selectRequireList(vo));
        buildInfo(pageInfo.getList());
        return ResultBean.getIndexSuccessResult(pageInfo);
    }

    private void buildInfo(List<RequireDTO> list) {
        if (list != null && list.size() > 0) {

            for (RequireDTO dto : list) {
                StringBuilder sb = new StringBuilder("【").append(dto.getRequireNo())
                        .append("】").append(dto.getrStartCity()).append("——");
                if (dto.getrDestinationCitys() != null && dto.getrDestinationCitys().length() > 0) {
                    String[] destinationCitysArr = dto.getrDestinationCitys().split(",");
                    for (String dCity : destinationCitysArr) {
                        sb.append(dCity).append("或");
                    }
                    sb.deleteCharAt(sb.length() - 1);// 去掉最后一个  或
                }
                sb.append(dto.getrPlayDaysMin()).append("-").append(dto.getrPlayDaysMax()).append("日游");
                dto.setTitle(sb.toString());
                sb.delete(0, sb.length());
                sb.append(LocalDate.parse(dto.getrStartDateHead() + "", DateTimeFormatter.ofPattern("yyyyMMdd")).toString());
                sb.append("至");
                sb.append(LocalDate.parse(dto.getrStartDateTail() + "", DateTimeFormatter.ofPattern("yyyyMMdd")).toString());
                int totalPeople = dto.getrAdultNum() + dto.getrChildNum() + dto.getrBabyNum();
                sb.append("出发，").append(totalPeople).append("人参与。想要定制");
                if (dto.getrType() == 0) {
                    sb.append("个人游，预算");
                } else {
                    sb.append("企业游，预算");
                }
                sb.append(dto.getrPerBudget() * totalPeople).append("元");
                dto.setSubTitle(sb.toString());
                dto.setTotalPeople(totalPeople);
            }
        }
    }

//    @Override
//    @Transactional
//    public ResultBean saveNewRequire(RequireSaveVO vo) {
//        Require require = JSONUtil.trans(vo, Require.class);
//        //did前端传递
//        //设置编号
//        require.setRequireNo("");
//        //设置公司id
//        require.setrCompanyId(vo.getPcompanyId());
//        //设置创建时间
//        require.setCreateTime(new Date());
//        //新增需求
//        int result = requireMapper.insert(require);
//        //更新编号
//        if (require.getId() == null) {
//            throw new RuntimeException("获取需求主键失败!");
//        }
//        Require r = new Require();
//        r.setId(require.getId());
//        String idStr = String.format("%0" + 5 + "d", require.getId());
//        r.setRequireNo(idStr);
//        requireMapper.updateByPrimaryKeySelective(r);
//
//        //查询方案并更新
//        Design design = designMapper.selectByPrimaryKey(require.getdId());
//        design.setLastRId(r.getId());
//        design.setdStatus(RequireStatus.CUSTOMIZED.getValue());
//        designMapper.updateByPrimaryKeySelective(design);
//
//        return ResultBean.getIndexSuccessResult(require.getId());
//    }
    @Override
    @Transactional
    public ResultBean saveNewRequire(RequireSaveVO vo) {
        Require require = JSONUtil.trans(vo, Require.class);
        Design design = designMapper.selectByPrimaryKey(require.getdId());
        if(design.getdStatus().equals(Integer.valueOf(4))){
            return new ResultBean("-1","该定制已完成,不可操作!");
        }
        //did前端传递
        //设置编号
        require.setRequireNo("");
        //设置公司id
        require.setrCompanyId(vo.getPcompanyId());
        //设置创建时间
        require.setCreateTime(new Date());
        //新增需求
        int result = requireMapper.insert(require);
        //更新编号
        if (require.getId() == null) {
            throw new RuntimeException("获取需求主键失败!");
        }
        Require r = new Require();
        r.setId(require.getId());
        String idStr = String.format("%0" + 5 + "d", require.getId());
        r.setRequireNo(idStr);
        requireMapper.updateByPrimaryKeySelective(r);

        //查询方案并更
        design.setLastRId(r.getId());
        //如果定制状态是1,不修改状态
        if(!design.getdStatus().equals(Integer.valueOf(1))){
            design.setdStatus(RequireStatus.CUSTOMIZED.getValue());
        }
        designMapper.updateByPrimaryKeySelective(design);

        return ResultBean.getIndexSuccessResult(require.getId());
    }

    @Override
    @Transactional
    public ResultBean saveRequire(RequireSaveVO vo) {
        Require require = JSONUtil.trans(vo, Require.class);
        //设置方案did
        require.setdId(0L);
        //设置编号
        require.setRequireNo("");
        //设置公司id
        require.setrCompanyId(vo.getPcompanyId());
        //设置创建时间
        require.setCreateTime(new Date());
        //新增需求
        int result = requireMapper.insert(require);
        //更新编号和did
        if (require.getId() == null) {
            throw new RuntimeException("获取需求主键失败!");
        }
        Require r = new Require();
        r.setId(require.getId());
        String idStr = String.format("%0" + 5 + "d", require.getId());
        r.setRequireNo(idStr);
        r.setdId(r.getId());
        requireMapper.updateByPrimaryKeySelective(r);

        //新增方案
        Design design = new Design();
        design.setId(r.getdId());
        design.setLastRId(r.getId());
        design.setCreateUser(vo.getPuserId());
        design.setCreateTime(new Date());
        design.setdStatus(RequireStatus.UNACCEPT.getValue());
        designMapper.insert(design);

        return ResultBean.getIndexSuccessResult(require.getId());
    }

    @Override
    public ResultBean queryProjectDetail(DesignProjectVO vo) {
        ResultBean<Object> resultBean = new ResultBean<Object>();
        if (vo.getEdit()){
            DesignProjectWithBLOBs bs = designProjectMapper.selectByPrimaryKey(vo.getProjectId());
            resultBean.setBody(bs);
            resultBean.setCode("200");
        }else {
            DesignProjectWithBLOBsDTO bsDTO = designProjectMapper.selectByPrimaryKeyWithManageInfo(vo.getProjectId());
            resultBean.setBody(bsDTO);
            resultBean.setCode("200");
        }
        return resultBean;
    }

    @Override
    public List historyDesignRequireList(Long dId) {
        List<DesignRequireListDO> list = new ArrayList();

        List<DesignProject> designList = designProjectMapper.historyDesignList(dId);
        List<Require> requireList = requireMapper.historyRequireList(dId);

        requireList.stream().forEach(r -> {
            DesignRequireListDO drDO = new DesignRequireListDO();
            drDO.setId(r.getId());
            drDO.setCreateTime(r.getCreateTime());
            drDO.setType(Constants.REQUIRE_TYPE);
            drDO.setDrName("【"+r.getrStartCity()+"-"+r.getrDestinationCitys()+r.getrPlayDaysMin()+"-"+r.getrPlayDaysMax()+"日游】需求单");
            list.add(drDO);
        });

        designList.stream().forEach(d -> {
            DesignRequireListDO drDO = new DesignRequireListDO();
            drDO.setId(d.getId());
            drDO.setCreateTime(d.getCreateTime());
            drDO.setType(Constants.DESIGN_TYPE);
            drDO.setProductId(d.getProductId());
            list.stream().forEach(r->{
                if(d.getrId().equals(r.getId())){
                    drDO.setDrName(r.getDrName().replace("需求单","方案"));

                }
            });
            list.add(drDO);
        });


        Collections.sort(list);

        for(DesignRequireListDO d:list){
            if(d.getType().equals(Constants.REQUIRE_TYPE)){
                d.setLast(true);
                break;
            }
        }

        for(DesignRequireListDO d:list){
            if(d.getType().equals(Constants.DESIGN_TYPE)){
                d.setLast(true);
                break;
            }
        }

        return list;
    }

    @Override
    public ResultBean queryRequireDetail(RequireVO vo) {
        RequireDTO rDTO = requireMapper.selectRequireDetailDTOById(vo.getRequireId());
        if (vo.getEdit()){
            ResultBean<RequireDTO> successResult = ResultBean.getSuccessResult(rDTO);
            successResult.setCode("200");
            return successResult;
        }else{
            RequireDetailDTO detailDTO = dealInfo(rDTO);
            ResultBean<RequireDetailDTO> successResult = ResultBean.getSuccessResult(detailDTO);
            successResult.setCode("200");
            return successResult;
        }
    }

    private RequireDetailDTO dealInfo(RequireDTO rDTO) {

        if (rDTO != null) {
            RequireDetailDTO detailDTO = new RequireDetailDTO();
            detailDTO.setStartCity(rDTO.getrStartCity());
            if (rDTO.getrDestinationCitys() != null) {
                String[] dCitys = rDTO.getrDestinationCitys().split(",");
                detailDTO.setDestinationCitys(String.join(" 或 ", dCitys));
            }
            detailDTO.setStartDate(LocalDate.parse(rDTO.getrStartDateHead() + "", DateTimeFormatter.ofPattern("yyyyMMdd")).toString()
                    + " 至 " + LocalDate.parse(rDTO.getrStartDateTail() + "", DateTimeFormatter.ofPattern("yyyyMMdd")).toString());
            detailDTO.setPlayDays(rDTO.getrPlayDaysMin()+"至"+rDTO.getrPlayDaysMax());
            detailDTO.setPlayPeoples(rDTO.getrAdultNum()+"成人"+rDTO.getrChildNum()+"儿童"+rDTO.getrBabyNum()+"婴儿");
            detailDTO.setPerBudget(rDTO.getrPerBudget()+"元/人");
            if (rDTO.getrOptionalServices() != null){
                detailDTO.setOptionalServiceArr(rDTO.getrOptionalServices().split(","));
            }
            detailDTO.setOtherService(rDTO.getrOtherRequire());
            detailDTO.setSaleName(rDTO.getSaleName());
            detailDTO.setSalePhone(rDTO.getSalePhone());

            detailDTO.setHeadName(rDTO.getrHeadName());
            detailDTO.setHeadEmail(rDTO.getrHeadEmail());
            detailDTO.setHeadPhone(rDTO.getrHeadPhone());
            detailDTO.setHeadSex(rDTO.getrHeadSex()==0?"男":"女");
            detailDTO.setHeadWx(rDTO.getrHeadWx());
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            detailDTO.setCreateDate(sdf.format(rDTO.getCreateTime()));
            return detailDTO;
        }
        return null;
    }
}
