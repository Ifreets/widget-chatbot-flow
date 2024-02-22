import type { Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

// const checkAccessToken = (router: Router) => router.beforeEach((
//     to: RouteLocationNormalized,
//     from: RouteLocationNormalized,
//     proceed: NavigationGuardNext
// ) => {
//     // ghi đè lại param bằng cách tạo thêm 1 action router nữa
//     if (!to.query.access_token && from.query.access_token) return proceed({
//         path: to.path,
//         query: { ...from.query, ...to.query }
//     })

//     // nếu không có token thì đánh chặn
//     if (to.fullPath !== '/403' && !to.query.access_token) return proceed('/403')

//     proceed()
// })

export const loadMiddleware = (router: Router) => {
    // checkAccessToken(router)
}