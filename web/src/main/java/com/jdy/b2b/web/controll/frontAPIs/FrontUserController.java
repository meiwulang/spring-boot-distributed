package com.jdy.b2b.web.controll.frontAPIs;

import java.util.Arrays;
import java.util.Date;
import java.util.Objects;

import javax.validation.constraints.NotNull;

import com.jdy.b2b.web.util.exception.UserCenterException;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.ExcessiveAttemptsException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.session.mgt.DefaultWebSessionManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.web.pojo.user.User;
import com.jdy.b2b.web.pojo.user.UserLoginVo;
import com.jdy.b2b.web.pojo.user.UserResultDTO;
import com.jdy.b2b.web.pojo.user.UserSaveOrUpdateVo;
import com.jdy.b2b.web.service.UserService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.Constants;
import com.jdy.b2b.web.util.DataContext;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.UserCacheBean;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Created by yangcheng on 2017/10/20.
 */
@RestController
@RequestMapping("/user")
public class FrontUserController extends BaseController{
    @Value("${spring.wechat.publicid}")
    private String publicid;
    @Value("${spring.registerUrl}")
    private String registerUrl;
    @Value("${spring.registerKey}")
    private String registerKey;
    @Value("${spring.mineKey}")
    private String mineKey;
    @Autowired
    @Qualifier("sessionManager")
    private DefaultWebSessionManager sessionManager;

    @Autowired
    private UserService userService;
    @Autowired
    private UserCacheBean userCacheBean;

    @Autowired
    @Qualifier("shiroEhcacheManager")
    private EhCacheManager ehCacheManager;

    /**
     *OA端销售或者代理人登录
     * @param openId
     * @return
     */
    @ApiOperation(value = "OA端销售或者代理人登录")
    @RequestMapping("oaLoginByOpenId/{openId}")
    public ResultBean oaLoginByOpenId(@PathVariable @NotNull(message = "openId不能为null") String openId) {
        Subject subject = SecurityUtils.getSubject();
        // 限制只允许代理人登录
        ResultBean<User> openIdResultBean = userService.queryForUserByOpenId(openId,0);
        User user = openIdResultBean.getParsedEnitity(User.class);
        if (Objects.isNull(user)) {
            //如果没有查询到用户,则新建用户,角色设置为0
            assembleUser(openId);
        }

        // 开始登录
        DataContext.set(Constants.LOGIN_BY_OPENID, Constants.LOGIN_BY_OPENID);
        UsernamePasswordToken token = new UsernamePasswordToken(openId, "");
        token.setRememberMe(false);
        // 通过openid获取到用户信息后,通过用户名执行登录操作
        String error = getAccountErrorMessage(subject,token);
        if (error != null) {// 出错了，返回登录页面
            return new ResultBean("-1", error);
        } else {// 登录成功
            putFrontUserIntoCache(user.getuAccount());
            // 将后端用户信息放入缓存
            // 分销端不用关联角色
            ResultBean<UserResultDTO> cacheUserResult = userService.queryForUserByAccount(user.getuAccount());
            UserResultDTO cacheUser = cacheUserResult.getParsedEnitity(UserResultDTO.class);
            // 如果取到了后端用户信息,
            if (cacheUser != null && cacheUser.getUserId() != null) {
                // 将用户信息放入缓存
                Cache<Object, Object> cache = ehCacheManager.getCache("currentUserCache");
                cache.put(user.getuAccount(), cacheUser);
                // 更新最后登录时间
                UserSaveOrUpdateVo updateTimeVo = new UserSaveOrUpdateVo();
                updateTimeVo.setId(cacheUser.getUserId());
                updateTimeVo.setuLastLogin(new Date());
                ResultBean<Long> resultBean = userService.saveOrUpdateUsers(updateTimeVo);
                ResultBean<String> indexSuccessResult = ResultBean.getIndexSuccessResult(Constants.TO_LOGIN);
                indexSuccessResult.setToken(subject.getSession().getId().toString());
                return indexSuccessResult;
            } else {
                // 如果未取到后端用户信息,则退出登录
                userCacheBean.clearAll(user.getuAccount());
                return ResultBean.getIndexFailResult("查询缓存用户信息错误!");
            }
        }
    }

    private void assembleUser(String openId) {
        UserSaveOrUpdateVo user = new UserSaveOrUpdateVo();
        user.setuWxOpenId(openId);
        user.setuAccount(user.getuWxOpenId());
        user.setuPassword(Constants.OaAgent.UPASSWORD);
        user.setuRealName(Constants.OaAgent.UREALNAME);
        //user.setuWxOpenId(user.getuWxOpenId());//openId
        user.setuDataLimit(Constants.OaAgent.UDATALIMIT);//用户级
        user.setuRoleId(Constants.OaAgent.UROLEID);
        user.setuType(Constants.OaAgent.UTYPE);
        //user.setuStype(Constants.Visitor.USTYPE);
        user.setuTel(Constants.OaAgent.UTEL);
        user.setuCompanyId(Constants.OaAgent.COMPANYID);
        user.setuStatus(Constants.OaAgent.USTATUS);
        userService.saveOrUpdateUsers(user);
    }




    /**
     * 分销管理员h5登录
     * @return
     */
    @ApiOperation(value = "分销管理员h5登录", notes = "")
    @RequestMapping(value = "/distAdminLogin", method = { RequestMethod.POST })
    @ResponseBody
    public ResultBean distAdminLogin(@RequestBody @Validated UserLoginVo vo) {
        //验证手机号是否存在.uname实际是手机号
        ResultBean<UserResultDTO> userResultBean = userService.queryForUserByAccount(vo.getuAccount());
        UserResultDTO userResult = userResultBean.getParsedEnitity(UserResultDTO.class);
        if (Objects.isNull(userResult)) {
            return ResultBean.getIndexFailResult("该账号未注册!");
        }
        //先判断该登录用户是否是供应商,否则,禁止登录
        if(!Integer.valueOf(0).equals(userResult.getuStype()) && !Integer.valueOf(1).equals(userResult.getuStype())){
            return new ResultBean("-1","销售类型错误,不允许登录!");
        }

        //如果存在,查找到用户信息后,使用用户名方式登录
        Subject subject = SecurityUtils.getSubject();
        UsernamePasswordToken token = new UsernamePasswordToken(userResult.getuAccount(), vo.getuPassword());
        token.setRememberMe(false);
        String error = getAccountErrorMessage(subject,token);
        if (error != null) {// 出错了，返回登录页面
            return ResultBean.getIndexFailResult(error);
        } else {// 登录成功
            //将前端用户信息放入缓存
            putFrontUserIntoCache(userResult.getuAccount());
            //将后端用户信息放入缓存
            ResultBean<UserResultDTO> cacheUserResult = userService.queryForUserByAccount(userResult.getuAccount());
            UserResultDTO cacheUser = cacheUserResult.getParsedEnitity(UserResultDTO.class);
            if (cacheUser != null && cacheUser.getUserId() != null) {
                Cache<Object, Object> cache = ehCacheManager.getCache("currentUserCache");
                cache.put(userResult.getuAccount(), cacheUser);
                // 更新最后登录时间
                return updateLastLoginTime(cacheUser.getUserId(),cacheUser);
            } else {
                // 如果未取到用户信息,应该退出登录
                userCacheBean.clearAll(vo.getuAccount());
                return ResultBean.getIndexFailResult("登录获取用户信息失败!");
            }
        }
    }

    //更新最后登录时间,手机号登录
    private ResultBean updateLastLoginTime(Long userId,UserResultDTO cacheUser) {
        UserSaveOrUpdateVo updateTimeVo = new UserSaveOrUpdateVo();
        updateTimeVo.setId(userId);
        updateTimeVo.setuLastLogin(new Date());
        ResultBean<Long> resultBean = userService.saveOrUpdateUsers(updateTimeVo);
        if ("0".equals(resultBean.getCode())) {
            Long longResult = resultBean.getParsedEnitity(Long.class);
            if (longResult != null && longResult > 0) {
                return ResultBean.getIndexSuccessResult(cacheUser);
            } else {
                return ResultBean.getIndexFailResult("更新最后登录时间失败");
            }
        } else {
            return ResultBean.getIndexFailResult("更新最后登录时间失败)");
        }
    }



    @ApiOperation(value = "获取'我的url'")
    @RequestMapping("/h5/mine")
    public ResultBean toMine(){
        StringBuilder url = new StringBuilder(registerUrl).append("?p=").append(publicid).append("&key=").append(mineKey);
        return ResultBean.getIndexSuccessResult(url);
    }

    @ApiOperation(value = "如果返回状态是未注册,前端获取地址跳转注册页面")
    @GetMapping("/h5/register")
    public ResultBean toRegister(){
        StringBuilder url = new StringBuilder(registerUrl).append("?p=").append(publicid).append("&key=").append(registerKey);
        return ResultBean.getIndexSuccessResult(url);
    }

    /**
     * 通过openId登录
     * state通过ResultBean的body返回,如果登录成功,才往缓存中放入用户信息
     *
     * #####各种状态分别返回什么参数
     * #####统一register状态
     *
     *
     * @param openId
     * @return
     */
    @ApiOperation(value = "通过openId登录", notes = "如果正常登陆,传递openid和0,如果跳转页面,只传递对应的state,具体入参设置待联调")
    @RequestMapping("loginByOpenId")
	public ResultBean loginByOpenId(
			@ApiParam(name = "openId", value = "openId") @RequestParam(value = "openId", required = true) @NotNull(message = "openId不能为null") String openId,
			@ApiParam(name = "from", value = "来源，0：公众号，1：其他") @RequestParam(value = "from", required = false, defaultValue = "0") Integer from) {
        from =0;//一直都是0
        DataContext.set("loginByOpenIdFrom", from);

        Subject subject = SecurityUtils.getSubject();
        //开始登录
        DataContext.set(Constants.LOGIN_BY_OPENID,Constants.LOGIN_BY_OPENID);
        UsernamePasswordToken token = new UsernamePasswordToken(openId,"");
        token.setRememberMe(false);
        //通过openid获取到用户信息后,通过用户名执行登录操作
        String error = getAccountErrorMessage(subject,token);
        if (error != null) {// 出错了，返回登录页面
            return new ResultBean("-1",error);
        } else {// 登录成功
            ResultBean<String> indexSuccessResult = ResultBean.getIndexSuccessResult(getUser().getDistributionSystemDTO().getAccessToken());
            indexSuccessResult.setToken(subject.getSession().getId().toString());
            return indexSuccessResult;
        }
    }

    //账号登录,pc登录,openid登录,手机号登录调用
    private String getAccountErrorMessage(Subject subject,UsernamePasswordToken token){
        String error = null;
        try {
            subject.login(token);
        } catch (UnknownAccountException e) {
            error = "该用户名不存在";
        } catch (IncorrectCredentialsException e) {
            error = "用户名或密码错误";
        } catch (ExcessiveAttemptsException e) {
            error = "登录失败次数超过3次，账户锁定10分钟";
        } catch (LockedAccountException e) {
            error = "账号状态错误：" + e.getMessage();
        } catch (AuthenticationException e) {
            error = "登录出错!"+e.getMessage();
        } catch (UserCenterException e){
            error = "用户中心登录报错啦~~~~~："+e.getMessage();
        }catch (NullPointerException e) {
            error = "空指针异常: " + e.getMessage();
        }
        return error;
    }

    //登录成功后,将用户信息放入缓存,手机号登录,openid登录调用
    private void putFrontUserIntoCache(String uAccount){
        userService.putFrontUserIntoCache(uAccount);
    }
}
