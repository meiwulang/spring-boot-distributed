
import Vue from 'vue';

import api_prefix from '@/assets/js/apiUrl';
import VueResource from 'vue-resource';

Vue.use(VueResource);

const resourceObj={
    orderResource : Vue.resource(api_prefix.api_prefix + 'Order{/id}'),
    reportResource : Vue.resource(api_prefix.api_prefix + '{id}'),
}

export default resourceObj;

