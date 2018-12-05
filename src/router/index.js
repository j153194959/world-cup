import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home/Home'
import HomeTab1 from '@/components/home/Home-tab1'
import Rule from '@/components/home/Rule'
import HomeTab3 from '@/components/home/Home-tab3'
import HomeTab2 from '@/components/home/Home-tab2'
import Activity1 from '@/components/activity1/Activity1'
import Activity2 from '@/components/activity2/Activity2'
import Activity3 from '@/components/activity3/Activity3'
import Share from '@/components/share/Share'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/', // 默认显示主页
      component: Home,
      children: [
        {
          // 当 / 匹配成功，
          path: '/', // 默认为 主页
          name: 'tab1',
          component: HomeTab1
        },
        {
          // 当 /tab1/rule 匹配成功，
          path: '/tab1/rule', // tab1 规则页
          name: 'rule',
          component: Rule
        },
        {
          // 当 /tab2 匹配成功，
          path: 'tab2', // tab栏2 活动4
          name: 'tab2',
          component: HomeTab2
        },
        {
          // 当 /tab3 匹配成功，
          path: 'tab3', // tab栏3
          name: 'tab3',
          component: HomeTab3
        }
      ]
    },
    {
      // 当 /act/activity1 匹配成功，
      path: '/act/activity1', // 活动1
      name: 'activity1',
      component: Activity1
    },
    {
      // 当 /act/activity2 匹配成功，
      path: '/act/activity2', // 活动2
      name: 'activity2',
      component: Activity2
    },
    {
      // 当 /act/activity2 匹配成功，
      path: '/act/activity3', // 活动3
      name: 'activity3',
      component: Activity3
    },
    {
      // 当 /share 匹配成功，
      path: '/share', // 活动4
      name: 'share',
      component: Share
    }
  ]
})
