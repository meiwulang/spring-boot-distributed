
import Vue from 'vue';

import api_prefix from '@/assets/js/apiUrl';
import VueResource from 'vue-resource';

Vue.use(VueResource);

const resourceObj={
  reportResource: Vue.resource(api_prefix.api_prefix + '{id}'),
  saleTrendResource : Vue.resource(api_prefix.api_prefix + 'agentinfo{/id}'),
}

export default resourceObj;


