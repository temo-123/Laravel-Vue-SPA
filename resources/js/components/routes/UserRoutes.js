import VueRouter from 'vue-router'

import NotFound from '../components/errors/404Component.vue'

import login from '../components/auth/LoginComponent.vue'
import register from '../components/auth/RegisterComponent.vue'

import forget_pass from '../components/auth/reset_password/ForgetPasswordComponent.vue'
import reset_pass from '../components/auth/reset_password/ResetPasswordComponent.vue'

function load(component) {
    return () => import(`../components/user/pages/${component}.vue`)
}
const router = new VueRouter({
    routes: [
        { path: '/', name: 'home', component: load('HomePageComponent') },
        { path: '/dashboard', name: 'dashboard', component: load('DashboardComponent') },

        { path: '/users_list', name: 'usersList', component: load('usersListPageComponent') },

        { path: '/login', name: 'login', component: login },
        { path: '/register', name: 'register', component: register},
        { path: '/forget_pass', name: 'forget_pass', component: forget_pass},
        { path: '/reset-password/:token/:user_id', name: 'reset_pass', component: reset_pass},

        { path: '*', name: 'NotFound', component: NotFound },
    ],
    mode: 'history',
});

router.beforeEach((to, from, next)=>{
    const token = localStorage.getItem('x_xsrf_token')
// console.log(history.back());
    axios
        .get('./api/auth_user')
        .then((response)=>{
            check(to, from, next, token)
        })
        .catch(function (error) {
            // if (error.request.status === 401) {
                if (token != null) {
                    localStorage.removeItem('x_xsrf_token');
                    check(to, from, next, token)
                    return next ({name: 'login'})
                }
                else{
                    check(to, from, next, token)
                }
            // }
        });

    // var token = localStorage.getItem('x_xsrf_token')

    // if (!token) {
    //     if (to.name === 'login' || to.name === 'register') {
    //         return next()
    //     }
    //     else{
    //         return next ({name: 'login'})
    //     }
    // }

    // if (to.name === 'login' || to.name === 'register' && token) {
    //     return next ({name: 'home'})
    // }

    next()
})

function check(to, from, next, token) {

    if (!token) {
        if (to.name == 'login' || to.name == 'register' || to.name == 'forget_pass' || to.name == 'reset_pass') {
            return next()
        }
        else{
            return next ({name: 'login'})
        }
    }
    else if (token){
        if(to.name === 'login' || to.name === 'register' || to.name === 'forget_pass' || to.name === 'reset_pass' && token) {
            return next ({name: 'home'})
        }
    }
}

export default router