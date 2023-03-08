import VueRouter from "vue-router";

import NotFound from "../components/errors/404Component.vue";

import i18n from "../services/localization/i18n";

function load(component) {
    return () => import(`../components/site/pages/${component}.vue`);
}

function getLocaleRegex() {
    let reg = "";
    // SUPPORTED_LOCALES.forEach((locale, index) => {
    // reg = `${reg}${locale.code}${index !== SUPPORTED_LOCALES.length - 1 ? '|' : ''}`
    // reg = process.env.MIX_VUE_APP_I18N_SUPORTED_LOCALE.split(',') - 1 ? '|' : '/'
    reg = "ka|ru|/";
    // })
    return `(${reg})`;
}

const router = new VueRouter({
    routes: [
        { path: "/en", redirect: `/` },
        {
            path: `/:locale${getLocaleRegex()}?`,
            // path: `/:locale`,
            component: {
                render: (h) => h("router-view"),
            },
            beforeEnter: (to, from, next) => {
                to.params.locale = localStorage.getItem("lang");
                const locale = to.params.locale;

                localStorage.setItem("lang", locale);

                const supported_locales =
                    process.env.MIX_VUE_APP_I18N_SUPORTED_LOCALE.split(",");

                if (!supported_locales.includes(locale)) {
                    return next("/");
                }

                if (i18n.locale !== locale) {
                    i18n.locale = locale;
                }

                return next();
            },
            children: [
                {
                    path: "",
                    name: "index",
                    component: load("IndexPageComponent"),
                },
                {
                    path: "about_us",
                    name: "about_us",
                    component: load("AboutUsComponent"),
                },

                { path: "*", name: "NotFound", component: NotFound },
            ],
        },
    ],
    mode: "history",
});

router.beforeEach((to, from, next) => {
    if (!to.params.locale) {
        i18n.locale = process.env.MIX_VUE_APP_I18N_LOCALE;
        localStorage.setItem("lang", process.env.MIX_VUE_APP_I18N_LOCALE);
    }

    // console.log(to.params.locale, getLocaleRegex(), i18n.lang);

    // axios
    // .get('/api/auth_user')
    // .then((response)=>{
    //     //
    // })
    // .catch(function (error) {
    //     //
    // });

    next();
});

export default router;
