import Vue from 'vue';

import api_prefix from '@/assets/js/apiUrl';
import VueResource from 'vue-resource';

Vue.use(VueResource);

// 线下退款
export const order_refund = Vue.resource(api_prefix.api_prefix + 'order_refund{/id}');
// 标签
export const label = Vue.resource(api_prefix.api_prefix + 'label{/id}');
//在线账单
export const billResource = Vue.resource(api_prefix.api_prefix + 'bill{/id}');


