
import Vue from 'vue';

import api_prefix from '@/assets/js/apiUrl';
import VueResource from 'vue-resource';

Vue.use(VueResource);

const resourceObj={
    orderResource : Vue.resource(api_prefix.api_prefix + 'Order{/id}'),
    busResource : Vue.resource(api_prefix.api_prefix + 'Bus{/id}'),
    // 出发站/始发站列表
    pichupStationResource : Vue.resource(api_prefix.api_prefix + 'Schedule{/id}'),
    // 品牌
    brandResource : Vue.resource(api_prefix.api_prefix + 'brand{/id}'),
    // 产品
    productResource : Vue.resource(api_prefix.api_prefix + 'product{/id}'),
    // 单位
    companyResource : Vue.resource(api_prefix.api_prefix + 'Company{/id}'),
    // 人员
    userResource : Vue.resource(api_prefix.api_prefix + 'user_role{/id}'),
}

export default resourceObj;


