import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from "@/views/Dashboard";
import Login from "@/views/Login";
import Index from "../views/Index";
import Pages from "../helpers/Pages";
import VueCookies from "vue-cookies";
import Password from "../views/Password";
import Users from "../views/Users";
import UserIndex from "../components/users/UserIndex";
import Menu from "../views/Menu";
import MenuIndex from "../components/menu/MenuIndex";
import Home from "../views/Home";
import routeLandingPage from "../theme/routePage";
import MenuList from "../views/MenuList";
import MenuListIndex from "../components/menuList/MenuListIndex";
import MenuRoleIndex from "../components/menuRole/MenuRoleIndex";

Vue.use(VueRouter);
const routes = [
    {
        path: "/",
        name: 'Index',
        component: Index,
        children: routeLandingPage
    },
    {
        path: Pages.LOGIN,
        name: 'Login',
        component: Login
    },
    {
        path: "password",
        name: "Password",
        component: Password,
        children: [
            {
                path: Pages.PASSWORD_FORGOT,
                name: "ForgotPassword",
                component: () => import("../components/password/ForgotPassword"),
            },
            {
                path: Pages.PASSWORD_OTP,
                name: "Otp",
                component: () => import("../components/password/Otp.vue"),
            },
            {
                path: Pages.PASSWORD_RESET,
                name: "ResetPassword",
                component: () => import("../components/password/ResetPassword.vue"),
            },
        ],
    },
    {
        path: Pages.HOME,
        redirect: Pages.DASHBOARD,
        name: 'home',
        component: Home,
        children: [
            {
                path: Pages.DASHBOARD,
                name: 'Dashboard',
                component: Dashboard
            },
            {
                path: Pages.USERS,
                name: 'Users',
                component: Users,
                children: [
                    {
                        path: "",
                        name: "Index",
                        component: UserIndex
                    },
                    {
                        path: Pages.USERS_CREATE,
                        name: 'UsersCreate',
                        component: Dashboard
                    }
                ]
            },
            {
                path: Pages.MENU_LIST,
                name: 'Menu',
                component: MenuList,
                children: [
                    {
                        path: "",
                        name: "Index",
                        component: MenuListIndex
                    }
                ]
            },
            {
                path: Pages.MENU,
                name: 'Menu',
                component: Menu,
                children: [
                    {
                        path: "",
                        name: "Index",
                        component: MenuIndex
                    }
                ]
            },
            {
                path: Pages.MENU_ROLE,
                name: 'Menu',
                component: MenuList,
                children: [
                    {
                        path: "",
                        name: "Index",
                        component: MenuRoleIndex
                    }
                ]
            }
        ]
    },
    {
        path: '*',
        name: '*',
        component: Login
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    const publicPages = [
        Pages.INDEX,
        Pages.BLOG,
        Pages.BLOG_SLUG,
        Pages.BLOG_POST,
        Pages.BLOG_ARCHIVE,
        Pages.BLOG_CATEGORY,
        Pages.LOGIN,
        Pages.PASSWORD_FORGOT,
        Pages.PASSWORD_OTP,
        Pages.PASSWORD_RESET,
    ];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = VueCookies.get("__MIH__BASE__SESSIONID__");

    if (authRequired && !loggedIn) {
        next(Pages.INDEX);
    } else {
        next();
    }
});

export default router;