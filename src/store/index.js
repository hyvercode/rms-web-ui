import Vue from "vue";
import Vuex from "vuex";
import {auth} from "./auth.module";
import {nav} from "./nav.module";
import notification from "./notification.module";
import menu from "./menu.module"

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        menu,
        notification,
        nav,
        auth,
    },
});
