package com.jdy.b2b.api.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.ProductExperienceMapper;
import com.jdy.b2b.api.dao.diy.ProductExperienceMapperDiy;
import com.jdy.b2b.api.enums.UserPosEnum;
import com.jdy.b2b.api.model.ProductExperience;
import com.jdy.b2b.api.model.pexperience.*;
import com.jdy.b2b.api.service.ProductExperienceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

import static org.apache.commons.collections.CollectionUtils.isNotEmpty;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/13 11:27
 */
@Service
public class ProductExperienceServiceImpl extends BaseService implements ProductExperienceService {

    @Autowired
    ProductExperienceMapper mapper;
    @Autowired
    ProductExperienceMapperDiy mapperDiy;

    @Override
    public List<PosAndNumDTO> listPosAndNum(ProductListDO vo) {
        List<PosAndNumDTO> es = Arrays.stream(UserPosEnum.values()).map(e -> {
            PosAndNumDTO p = new PosAndNumDTO();
            p.setPosId(e.getPosId());
            p.setPosName(e.getDesc());
            p.setNum(0);
            return p;
        }).collect(Collectors.toList());
        List<PosAndNumDTO> list = mapperDiy.listPosAndNum( vo);
        if (isNotEmpty(list)) {
            es.forEach(e -> {
                PosAndNumDTO d = list.stream().filter(p -> p.getPosId().equals(e.getPosId())).findFirst().orElse(null);
                if (d != null) e.setNum(d.getNum());
            });
        }
        return es;
    }

    @Override
    public List<ProductListDTO> selectPosProductList(ProductListDO vo) {
        return mapperDiy.selectPosProductList(vo);
    }

    @Override
    public ResultBean productConfigList(ProductListDO vo) {
        PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
        List<ProductListDTO> list = mapperDiy.selectProductList(vo);
        if (isNotEmpty(list)) {
            List<ProductListDTO> chosen = mapperDiy.selectPosProductList(vo);
            //如果有配置过的，chosen置为true
            if (isNotEmpty(chosen)) {
                list.stream().filter(p -> chosen.stream().anyMatch(c -> c.getPid().equals(p.getPid()))).forEach(p -> p.setChosen(true));
            }
        }
        return ResultBean.getSuccessResult(new PageInfo<>(list));
    }

    @Transactional
    @Override
    public ResultBean configPosProduct(ConfigDO vo) {
        List<ConfigOneDO> posPids = vo.getProds();
        if (isNotEmpty(posPids)) {
            List<ConfigOneDO> dels = posPids.stream().filter(t -> t.getFlag() == 0).collect(Collectors.toList());
            List<ConfigOneDO> adds = posPids.stream().filter(t -> t.getFlag() == 1).collect(Collectors.toList());
            if (isNotEmpty(dels)) {
                List<Long> pids = dels.stream().map(t -> t.getId()).collect(Collectors.toList());
                Map map = new HashMap();
                map.put("posId", vo.getPosId());
                map.put("pids", pids);
                map.put("companyId",vo.getCompanyId());
                mapperDiy.deleteExpByPosIdAndPids(map);
            }
            if (isNotEmpty(adds)) {
                ProductListDO pvo = new ProductListDO();
                pvo.setPosId(vo.getPosId());
                pvo.setCompanyId(vo.getCompanyId());
                List<ProductListDTO> chosen = mapperDiy.selectPosProductList(pvo);
                List<ConfigOneDO> toAdds = adds.stream().filter(t -> chosen.stream().noneMatch(c -> c.getPid().equals(t.getId()))).collect(Collectors.toList());
                if (isNotEmpty(toAdds)) {
                    List<ProductExperience> list = generateList(vo, toAdds);
                    mapperDiy.batchSaveProductExperiences(list);
                }
            }
        }
        return ResultBean.getSuccessResult();
    }

    private List<ProductExperience> generateList(ConfigDO vo, List<ConfigOneDO> toAdds) {
        List<ProductExperience> list = new ArrayList<>(toAdds.size());
        for (ConfigOneDO c : toAdds) {
            ProductExperience p = new ProductExperience();
            p.setPosId(vo.getPosId());
            p.setPid(c.getId());
            p.setcId(vo.getCompanyId());
            list.add(p);
        }
        return list;
    }

    @Override
    public ResultBean delete(Long id) {
        mapper.deleteByPrimaryKey(id);
        return ResultBean.getSuccessResult();
    }

}
