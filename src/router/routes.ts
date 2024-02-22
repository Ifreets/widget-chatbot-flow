import OAuth from '@/views/OAuth.vue'

import Dashboard from '@/views/Dashboard.vue'

export const routes = [
  { path: '/', redirect: '/dashboard' },
  { 
    path: '/oauth', component: OAuth 
  },
  {
    path: '/dashboard',
    component: Dashboard,
    // redirect: '/dashboard/create',
    // children: [
    //   { path: 'create', component: Create },
    //   { path: 'setting', component: Setting },
    // ]
  },
]