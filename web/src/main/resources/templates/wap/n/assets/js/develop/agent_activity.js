import '@/assets/less/develop/agent_activity.less'
import $ from 'jquery'
import Common from '@/assets/js/common/common'
import pubs from './agent_activity/pubs'
import index from './agent_activity/index'
import company from './agent_activity/company'
import department from './agent_activity/department'
import person from './agent_activity/person'

const Routes = {
    index,
    company,
    department,
    person
}

const App = {
    init () {
        this.render()
        this.refreshHref()
        this.refreshStyle()
        pubs.initEvent()
        this.navigation()
        $(window).on('hashchange',() => {
            this.refreshHref()
            this.refreshStyle()
            this.navigation()
        })
    },
    render () {
        pubs.renderTime()
    },
    refreshHref () {
        let param = location.hash ? location.hash.split('/')[1] : null
        param = param ? '/' + param : ''
        $('#header').find('.ul-bag li').each(function () {
            let self  = $(this);
            let page = self.find('a').data('page')
            self.find('a').attr('href',`#${page}${param}`);
        });
    },
    refreshStyle () {
        pubs.refreshTimeStyle()
    },
    navigation () {
        let Page = Routes[pubs.getPath()[1]]
        $(window).scrollTop(0)
        Page ? Page.init() : Routes.index.init()
    }
}

Common.Ready(() => {
    App.init()
});