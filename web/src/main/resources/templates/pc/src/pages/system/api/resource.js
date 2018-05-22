
import Vue from 'vue';

import api_prefix from '@/assets/js/apiUrl';
import VueResource from 'vue-resource';

Vue.use(VueResource);

const resourceObj={
    //组织架构
    orgResource : Vue.resource(api_prefix.api_prefix + 'struct{/id}{/orgId}{/type}'),
    orgTreeResource : Vue.resource(api_prefix.api_prefix + 'userRolePrivilege{/id}'),
    // 角色管理
    roleResource : Vue.resource(api_prefix.api_prefix + 'role{/id}'),
    // 用户基本信息
    userbaseResource : Vue.resource(api_prefix.api_prefix + 'userRolePrivilege{/id}'),
    //根据id查询用户信息
    userResource:Vue.resource(api_prefix.api_prefix + 'user{/id}{/val}'),
    // 用户
    adduserResource:Vue.resource(api_prefix.api_prefix + 'user{/id}{/val}{/status}{/account}'),
    //保存编辑用户权限
    orgUser : Vue.resource(api_prefix.api_prefix + 'userRolePrivilege/{/id}'),
}

export default resourceObj;

