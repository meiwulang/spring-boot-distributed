package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.pojo.userrole.UserRole;
import com.jdy.b2b.web.pojo.userrole.UserRoleQueryVo;
import com.jdy.b2b.web.pojo.userrole.UserRoleSaveOrUpdateVo;
import com.jdy.b2b.web.service.UserRoleService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

/**
 * Created by yangcheng on 2017/7/12.
 */
@Service
public class UserRoleServiceImpl extends BaseService implements UserRoleService {

    /**
     * 查询角色列表
     * @param vo
     * @return
     */
    @Override
    public ResultBean queryRoleList(UserRoleQueryVo vo) {
        StringBuffer url = new StringBuffer(systemCenterUrl).append("user_role/list");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }

    /**
     * 根据id查询
     * @param id
     * @return
     */
    @Override
    public ResultBean<UserRole> queryUserRoleById(Long id) {
        StringBuffer url = new StringBuffer(systemCenterUrl).append("user_role/get/").append(id);
        return restTemplate.getForEntity(url.toString(),ResultBean.class).getBody();
    }

    @Override
    public ResultBean<Long> saveOrUpdateUserRole(UserRoleSaveOrUpdateVo vo) {
        StringBuffer url = new StringBuffer(systemCenterUrl).append("user_role/saveOrUpdate");
        return restTemplate.postForEntity(url.toString(),vo,ResultBean.class).getBody();
    }


}
