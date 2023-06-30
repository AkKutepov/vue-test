import weatherWrapper from './weather-wrapper.js'
import share from './share.js'
import timers from './timers.js'
import cities from './cities.js'
import paginators from './paginators.js' // () => Promise...

var routes0 = [
  { name: 'Weather', path: '/', component: weatherWrapper, },
  { name: 'Timers', path: '/timers', component: timers, },
  { name: 'Cities', path: '/cities', component: cities, },
  { name: 'Paginators', path: '/paginators', component: paginators, },
  { name: 'Dropdown', path: '/dropdown' },
  { name: 'Action', path: '/dropdown/', component: share, child: 1, },
]

// add names
export var routes = routes0.map(item => {
  if(item.component && item.component != paginators) { // paginators - async
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


