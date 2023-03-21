import home from './home.js'
import timers from './timers.js'
import share from './share.js'
import offset from './offset.js' // () => Promise...

var routes0 = [
  { name: 'Weather', path: '/', component: home, },
  { name: 'Timers', path: '/timers', component: timers, },
  { name: 'Contacts', path: '/contacts', component: share, },
  { name: 'Offset', path: '/offset', component: offset, },
  { name: 'Dropdown', path: '/dropdown' },
  { name: 'Action', path: '/dropdown/', component: share, child: 1, },
  { name: 'Another action', path: '/dropdown/', component: share, child: 1, },
  { name: 'Something else here', path: '/dropdown/timers', component: timers, child: 1, },
  { name: 'Separated link', path: '/dropdown/', component: share, child: 1, separated: 1, },
  { name: 'Dropdown1', path: '/dropdown1' },
  { name: 'Action1', path: '/dropdown1/timers', component: timers, child: 1, },
  { name: 'Another action1', path: '/dropdown1/offset', component: offset, child: 1, },
  { name: 'Something else here1', path: '/dropdown1/timers', component: timers, child: 1, },
  { name: 'Separated link1', path: '/dropdown1/', component: share, child: 1, separated: 1, },
]

// add names
export let routes = routes0.map(item => {
  if(item.component && item.component != offset) { // offset - () => promise
    item.component = { ...item.component, props:{ name: item.name }}
  }
  return item
})

export const menus = () => {
  var i, ii, k = 0, res = []
  
  for(i = 0, ii = routes.length; i < ii; i++) {
    if(routes[i].child) {
      res[k - 1].data.push(routes[i])
    }
    else {
      res[k++] = { item: routes[i], data: [] }
    }
  }
  
  return res;
}

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
})


